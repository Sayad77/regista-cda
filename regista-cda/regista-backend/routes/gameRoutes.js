const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const auth = require('../middlewares/auth'); // Le videur JWT

// On protège les routes de jeu avec le middleware d'authentification "auth"
router.get('/start/:teamName', auth, gameController.startGame);
router.post('/submit', auth, gameController.submitGame);

module.exports = router;