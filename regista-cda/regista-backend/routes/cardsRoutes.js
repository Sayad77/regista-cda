const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/cardsController');

// Importation de votre videur (Vérifiez que le chemin et le nom du fichier sont exacts)
// Parfois il s'appelle juste auth.js ou authMiddleware.js dans votre dossier middlewares
const auth = require('../middlewares/auth'); 

// Route protégée : GET /api/cards/draw/S
router.get('/draw/:rank', auth, cardsController.drawCard);

module.exports = router;