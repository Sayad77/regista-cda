const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

// Route POST pour acheter une carte : /api/market/buy
router.post('/buy', marketController.buyCard);

module.exports = router;