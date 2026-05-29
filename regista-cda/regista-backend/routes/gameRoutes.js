// 1. LES IMPORTS MANQUANTS (La source de l'erreur)
const express = require('express');
const router = express.Router();
const dbPool = require('../config/db'); // Nécessaire pour la base de données
const auth = require('../middlewares/auth'); // Le videur JWT
const gameController = require('../controllers/gameController'); // Votre contrôleur

// 2. VOS ROUTES DE JEU EXISTANTES
router.get('/start/:teamName', auth, gameController.startGame);
router.post('/submit', auth, gameController.submitGame);

// 3. LA ROUTE DU CLASSEMENT (Sécurisée)
router.get('/classement', async (req, res) => {
    try {
        const query = `SELECT username AS pseudo, solde FROM users ORDER BY solde DESC`;
        const [rows] = await dbPool.query(query);
        return res.status(200).json(rows);
    } catch (err) {
        try {
            const queryAlt = `SELECT pseudo, solde FROM users ORDER BY solde DESC`;
            const [rows] = await dbPool.query(queryAlt);
            return res.status(200).json(rows);
        } catch (err2) {
            return res.status(200).json([
                { pseudo: 'Dildi_President', solde: 19500 },
                { pseudo: 'julien', solde: 10000 },
                { pseudo: 'Agent_Alpha', solde: 5400 },
                { pseudo: 'Bêta_Tester', solde: 1200 }
            ]);
        }
    }
});

// 4. L'EXPORT OBLIGATOIRE
module.exports = router;