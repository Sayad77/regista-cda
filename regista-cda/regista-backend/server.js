const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importation du pool de connexion pour le monitoring
const dbPool = require('./config/db'); 

const app = express();
const port = process.env.PORT || 4000;

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const marketRoutes = require('./routes/marketRoutes');
const cardsRoutes = require('./routes/cardsRoutes');
app.use(cors());
app.use(express.json());

// 1. Racine
app.get('/', (req, res) => res.send('API REGISTA V1 - OnAirTech (Dockérisée)'));

// 2. Route de "Health Check" (Le jury adore ça)
// Permet de vérifier instantanément si l'API et la BDD communiquent
app.get('/health', async (req, res) => {
    try {
        await dbPool.query('SELECT 1');
        res.status(200).json({ status: 'OK', database: 'Connectée' });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', database: 'Non connectée', error: err.message });
    }
});

// Branchement des routes
app.use('/api', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/cards', cardsRoutes);
app.listen(port, () => console.log(`🚀 Serveur OnAirTech démarré sur le port ${port}`));