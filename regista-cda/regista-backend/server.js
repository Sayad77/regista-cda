const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

// === MIDDLEWARES ===
app.use(cors());
app.use(express.json()); 

// === INITIALISATION DE LA BASE DE DONNÉES ===
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'regista_db' // Ta base de données Wamp
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur MySQL :', err);
  } else {
    console.log('✅ Connecté à la base de données Regista !');
  }
});

// === ROUTES ===

// Route de test pour voir si le serveur répond
app.get('/', (req, res) => {
    res.send('Le serveur Backend Regista fonctionne parfaitement !');
});

// La route pour ton classement React
app.get('/api/classement', (req, res) => {
    const sqlQuery = 'SELECT * FROM users ORDER BY solde DESC';
    
    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Erreur SQL :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        } else {
            res.json(results);
        }
    });
});

// NOUVELLE ROUTE : Démarrer une partie avec une équipe spécifique
app.get('/api/game/start/:teamName', (req, res) => {
    const teamName = req.params.teamName;

    // Requête SQL complexe : On récupère l'équipe, ses joueurs et leurs indices
    const sqlQuery = `
        SELECT t.name AS team, p.id AS player_id, p.name AS player_name, p.grid_type, h.hint_text, h.hint_order
        FROM teams t
        JOIN players_pool p ON t.id = p.team_id
        LEFT JOIN hints h ON p.id = h.player_id
        WHERE t.name = ?
        ORDER BY p.grid_type ASC, h.hint_order ASC
    `;

    db.query(sqlQuery, [teamName], (err, results) => {
        if (err) {
            console.error('Erreur SQL (Game Start) :', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération de la partie' });
        }
        
        // On organise les données pour que React puisse les lire facilement
        const gameSession = {
            team: teamName,
            grids: [
                { type: 4, player: null, hints: [] },
                { type: 5, player: null, hints: [] },
                { type: 6, player: null, hints: [] }
            ]
        };

        results.forEach(row => {
            const grid = gameSession.grids.find(g => g.type === row.grid_type);
            if (grid) {
                grid.player = row.player_name;
                if (row.hint_text) {
                    grid.hints.push(row.hint_text);
                }
            }
        });

        res.json(gameSession);
    });
});

// === LANCEMENT ===
app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});