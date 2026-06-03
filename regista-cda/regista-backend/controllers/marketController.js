const dbPool = require('../config/db');

/**
 * 🏗️ CLASSE MARKETPLACE CONTROLLER
 * Gère les transactions financières (Achat / Vente) avec le principe ACID.
 */
class MarketplaceController {

    // Achat d'une carte
    async buyCard(req, res) {
        const { username, cardId, price } = req.body;

        if (!username || !cardId || !price) {
            return res.status(400).json({ error: "Données incomplètes pour l'achat." });
        }

        const connection = await dbPool.getConnection();
        
        try {
            await connection.beginTransaction();

            const [users] = await connection.query('SELECT id, solde FROM users WHERE pseudo = ?', [username]);
            if (users.length === 0) throw new Error("Utilisateur introuvable");
            
            const user = users[0];
            if (user.solde < price) throw new Error("Fonds insuffisants");

            await connection.query(
                'UPDATE users SET solde = solde - ?, cartes = cartes + 1 WHERE id = ?', 
                [price, user.id]
            );

            await connection.query(
                'INSERT INTO inventaire (user_id, card_id) VALUES (?, ?)', 
                [user.id, cardId]
            );

            await connection.commit();
            res.status(200).json({ success: true, message: "Achat réussi avec succès !" });

        } catch (error) {
            await connection.rollback();
            console.error("🚨 Erreur Transaction Marketplace :", error.message);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    }

    // Revente d'une carte
    async sellCard(req, res) {
        const { username, cardId, price } = req.body;

        if (!username || !cardId || !price) {
            return res.status(400).json({ error: "Données incomplètes pour la revente." });
        }

        const connection = await dbPool.getConnection();
        
        try {
            await connection.beginTransaction();

            const [users] = await connection.query('SELECT id FROM users WHERE pseudo = ?', [username]);
            if (users.length === 0) throw new Error("Utilisateur introuvable");
            const user = users[0];

            const [deleteResult] = await connection.query(
                'DELETE FROM inventaire WHERE user_id = ? AND card_id = ? LIMIT 1', 
                [user.id, cardId]
            );

            if (deleteResult.affectedRows === 0) {
                throw new Error("Cette carte n'est plus dans votre coffre.");
            }

            await connection.query(
                'UPDATE users SET solde = solde + ?, cartes = cartes - 1 WHERE id = ?', 
                [price, user.id]
            );

            await connection.commit();
            res.status(200).json({ success: true, message: "Revente réussie ! Les fonds ont été virés." });

        } catch (error) {
            await connection.rollback();
            console.error("🚨 Erreur Transaction Revente :", error.message);
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    }
}

// 📦 EXPORT DE L'INSTANCE
module.exports = new MarketplaceController();