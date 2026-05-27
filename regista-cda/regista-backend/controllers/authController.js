const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPool = require('../config/db');

exports.login = async (req, res) => {
    const { pseudo, password } = req.body;
    try {
        const [results] = await dbPool.execute('SELECT * FROM users WHERE pseudo = ?', [pseudo]);
        
        if (results.length === 0) return res.status(401).json({ error: 'Pseudo introuvable' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

        // 💣 CORRECTION 1 (Bombe désamorcée) : On utilise "id" au lieu de "userId"
        const token = jwt.sign(
            { id: user.id, username: user.pseudo }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            token: token,
            user: { pseudo: user.pseudo, solde: user.solde, cartes: user.cartes } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
};

exports.register = async (req, res) => {
    const { pseudo, email, password } = req.body;
    if (!pseudo || !email || !password) return res.status(400).json({ error: 'Champs manquants' });
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // On récupère le résultat de l'insertion pour avoir le nouvel ID
        const [result] = await dbPool.execute(
            `INSERT INTO users (pseudo, email, password, cartes, solde) VALUES (?, ?, ?, 0, 1000)`, 
            [pseudo, email, hashedPassword]
        );
        
        // 🔑 CORRECTION 2 (Le Passeport) : On génère le token dès l'inscription !
        const token = jwt.sign(
            { id: result.insertId, username: pseudo }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // On envoie le token à React pour qu'il ne stocke plus "undefined"
        res.status(201).json({ 
            success: true, 
            message: 'Compte Agent créé avec succès',
            token: token,
            user: { pseudo: pseudo, solde: 1000, cartes: 0 }
        });
    } catch (error) { 
        console.error("🚨 ERREUR SQL LORS DE L'INSCRIPTION :", error.message); 
        res.status(409).json({ error: 'Erreur serveur. Regardez le terminal Node.js !' }); 
    }
    // ... (vos fonctions login et register existantes) ...

exports.deleteAccount = async (req, res) => {
    // 1. L'ID est fourni par votre garde du corps (le middleware auth.js) grâce au token !
    const userId = req.user.id; 

    if (!userId) {
        return res.status(400).json({ error: 'Utilisateur non identifié.' });
    }

    let connection;
    try {
        // 2. 🚀 TRANSACTION ACID : On prend une connexion isolée
        connection = await dbPool.getConnection();
        await connection.beginTransaction();

        // 3. ÉTAPE A : On vide le coffre-fort (Suppression des cartes dans l'inventaire)
        await connection.execute('DELETE FROM inventaire WHERE user_id = ?', [userId]);

        // 4. ÉTAPE B : On supprime l'Agent (Suppression dans la table users)
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

        // Vérification de sécurité au cas où le compte aurait déjà été supprimé
        if (result.affectedRows === 0) {
            await connection.rollback(); 
            return res.status(404).json({ error: 'Agent introuvable.' });
        }

        // 5. VALIDATION : Tout s'est bien passé, on grave la destruction dans le marbre
        await connection.commit();
        console.log(`🗑️ L'Agent ID ${userId} a été définitivement effacé de la base.`);
        
        res.status(200).json({ success: true, message: 'Données détruites avec succès.' });

    } catch (error) {
        // 🛡️ SÉCURITÉ : S'il y a un crash au milieu, on annule tout pour ne rien corrompre !
        if (connection) await connection.rollback();
        console.error("🚨 Erreur critique lors de la suppression :", error);
        res.status(500).json({ error: 'Échec de la procédure de destruction.' });
    } finally {
        // 6. On rend la connexion au serveur
        if (connection) connection.release();
    }
};
};