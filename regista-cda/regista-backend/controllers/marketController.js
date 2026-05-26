const dbPool = require('../config/db');

exports.buyCard = async (req, res) => {
    const { username, cardId, price } = req.body;

    if (!username || !cardId || !price) {
        return res.status(400).json({ error: "Données incomplètes pour l'achat." });
    }

    const connection = await dbPool.getConnection();
    
    try {
        // 1. Démarrer la transaction sécurisée (ACID)
        await connection.beginTransaction();

        // 2. Vérifier le solde de l'utilisateur
        const [users] = await connection.query('SELECT id, solde FROM users WHERE pseudo = ?', [username]);
        if (users.length === 0) throw new Error("Utilisateur introuvable");
        
        const user = users[0];
        if (user.solde < price) throw new Error("Fonds insuffisants");

        // 3. Débiter le solde et incrémenter le nombre de cartes
        await connection.query(
            'UPDATE users SET solde = solde - ?, cartes = cartes + 1 WHERE id = ?', 
            [price, user.id]
        );

        // 4. Ajouter la carte dans l'inventaire
        await connection.query(
            'INSERT INTO inventaire (user_id, card_id) VALUES (?, ?)', 
            [user.id, cardId]
        );

        // 5. Valider la transaction si tout s'est bien passé
        await connection.commit();
        res.status(200).json({ success: true, message: "Achat réussi avec succès !" });

    } catch (error) {
        // 6. En cas d'erreur (ex: crash réseau), on annule tout !
        await connection.rollback();
        console.error("🚨 Erreur Transaction Marketplace :", error.message);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};
exports.sellCard = async (req, res) => {
    // On récupère les infos envoyées par React
    const { username, cardId, price } = req.body;

    if (!username || !cardId || !price) {
        return res.status(400).json({ error: "Données incomplètes pour la revente." });
    }

    const connection = await dbPool.getConnection();
    
    try {
        // 1. Démarrer la transaction sécurisée
        await connection.beginTransaction();

        // 2. Récupérer l'ID de l'utilisateur
        const [users] = await connection.query('SELECT id FROM users WHERE pseudo = ?', [username]);
        if (users.length === 0) throw new Error("Utilisateur introuvable");
        const user = users[0];

        // 3. Supprimer la carte de l'inventaire (LIMIT 1 au cas où vous auriez des doublons)
        const [deleteResult] = await connection.query(
            'DELETE FROM inventaire WHERE user_id = ? AND card_id = ? LIMIT 1', 
            [user.id, cardId]
        );

        if (deleteResult.affectedRows === 0) {
            throw new Error("Cette carte n'est plus dans votre coffre.");
        }

        // 4. CRÉDITER LE SOLDE et décrémenter le nombre de cartes
        await connection.query(
            'UPDATE users SET solde = solde + ?, cartes = cartes - 1 WHERE id = ?', 
            [price, user.id]
        );

        // 5. Valider la transaction
        await connection.commit();
        res.status(200).json({ success: true, message: "Revente réussie ! Les fonds ont été virés." });

    } catch (error) {
        // 6. En cas de problème, on annule tout
        await connection.rollback();
        console.error("🚨 Erreur Transaction Revente :", error.message);
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};