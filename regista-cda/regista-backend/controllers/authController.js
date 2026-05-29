const dbPool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🛡️ 1. FONCTION DE CONNEXION (Celle que vous aviez déjà)
exports.login = async (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    try {
        const query = 'SELECT * FROM users WHERE pseudo = ?';
        const [rows] = await dbPool.query(query, [pseudo]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Pseudo introuvable' });
        }

        const user = rows[0];

        // Vérification du mot de passe haché
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Génération du Token JWT éphémère
        const token = jwt.sign(
            { id: user.id, pseudo: user.pseudo },
            process.env.JWT_SECRET || 'SECRET_AGENCE_REGINA_2026',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            pseudo: user.pseudo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur de sécurité.' });
    }
};

// 🛡️ 2. FONCTION D'INSCRIPTION (Manquante : Elle crée les nouveaux agents)
exports.register = async (req, res) => {
    const { pseudo, email, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).json({ error: 'Le pseudo et le mot de passe sont obligatoires.' });
    }

    try {
        // Vérifier si l'agent existe déjà
        const [existingUser] = await dbPool.query('SELECT * FROM users WHERE pseudo = ?', [pseudo]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Ce nom de code (pseudo) est déjà utilisé par un autre agent.' });
        }

        // Hachage du mot de passe avec Bcrypt avant insertion
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertion sécurisée en base de données (Anti-Injection SQL)
        // Note: Si votre table n'a pas de colonne 'email', enlevez-le de la requête ci-dessous
        const query = 'INSERT INTO users (pseudo, email, password) VALUES (?, ?, ?)';
        await dbPool.query(query, [pseudo, email || 'agent@regista.com', hashedPassword]);

        res.status(201).json({ success: true, message: 'Agent accrédité avec succès ! Vous pouvez maintenant vous connecter.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du compte.' });
    }
};

// 🛡️ 3. FONCTION DE SUPPRESSION (Manquante : Pour la route /delete)
exports.deleteAccount = async (req, res) => {
    try {
        // Le middleware 'auth' doit attacher l'utilisateur au req (ex: req.user.id)
        const userId = req.user.id; 
        
        await dbPool.query('DELETE FROM users WHERE id = ?', [userId]);
        res.status(200).json({ message: 'Compte agent effacé des serveurs.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Impossible de supprimer le compte.' });
    }
};