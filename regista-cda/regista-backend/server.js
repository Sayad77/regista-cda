const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); 

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'regista_db'
});

db.connect((err) => {
  if (err) console.error('❌ Erreur MySQL :', err);
  else console.log('✅ Connecté à la base de données Regista !');
});

// === ROUTES DE JEU ===
app.get('/', (req, res) => res.send('Le serveur Backend Regista fonctionne !'));

app.get('/api/classement', (req, res) => {
    const sqlQuery = 'SELECT pseudo, cartes, solde FROM users ORDER BY solde DESC';
    db.query(sqlQuery, (err, results) => {
        if (err) res.status(500).json({ error: 'Erreur SQL' });
        else res.json(results);
    });
});

app.get('/api/game/start/:teamName', (req, res) => {
    const teamName = req.params.teamName;
    const sqlQuery = `
        SELECT t.name AS team, p.id AS player_id, p.name AS player_name, p.grid_type, h.hint_text, h.hint_order
        FROM teams t JOIN players_pool p ON t.id = p.team_id LEFT JOIN hints h ON p.id = h.player_id
        WHERE t.name = ? ORDER BY p.grid_type ASC, h.hint_order ASC
    `;
    db.query(sqlQuery, [teamName], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erreur SQL' });
        const gameSession = { team: teamName, grids: [{ type: 4, player: null, hints: [] }, { type: 5, player: null, hints: [] }, { type: 6, player: null, hints: [] }] };
        results.forEach(row => {
            const grid = gameSession.grids.find(g => g.type === row.grid_type);
            if (grid) {
                grid.player = row.player_name;
                if (row.hint_text) grid.hints.push(row.hint_text);
            }
        });
        res.json(gameSession);
    });
});

app.post('/api/save-user', (req, res) => {
    const { username, solde, cardsCount } = req.body;
    if (!username) return res.status(400).json({ error: "Username manquant" });

    const query = `UPDATE users SET solde = ?, cartes = ? WHERE pseudo = ?`;
    db.query(query, [solde, cardsCount, username], (err) => {
        if (err) return res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        res.json({ success: true, message: 'Progression sauvegardée !' });
    });
});

// === NOUVELLE ROUTE : TIRAGE DE CARTE LÉGENDAIRE ===
app.get('/api/cards/draw/:tier', (req, res) => {
    const tier = req.params.tier;
    // On sélectionne UNE carte au hasard correspondant au rang (S, A, B ou C)
    const query = 'SELECT * FROM legendary_cards WHERE tier = ? ORDER BY RAND() LIMIT 1';
    
    db.query(query, [tier], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur lors du tirage' });
        if (results.length === 0) return res.status(404).json({ error: 'Aucune carte trouvée pour ce rang' });
        
        res.json(results[0]); // On renvoie la carte gagnée
    });
});

// === ROUTES D'AUTHENTIFICATION ===
app.post('/api/register', async (req, res) => {
    const { pseudo, email, password } = req.body;
    if (!pseudo || !email || !password) return res.status(400).json({ error: 'Champs manquants' });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (pseudo, email, password, cartes, solde) VALUES (?, ?, ?, 0, 10000)`;
        db.query(query, [pseudo, email, hashedPassword], (err) => {
            if (err) return res.status(409).json({ error: 'Ce pseudo ou email existe déjà' });
            res.json({ success: true, message: 'Compte créé avec succès' });
        });
    } catch (error) { res.status(500).json({ error: 'Erreur de chiffrement' }); }
});

app.post('/api/login', (req, res) => {
    const { pseudo, password } = req.body;
    db.query(`SELECT * FROM users WHERE pseudo = ?`, [pseudo], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Pseudo introuvable' });
        const match = await bcrypt.compare(password, results[0].password);
        if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });
        res.json({ success: true, user: { pseudo: results[0].pseudo, solde: results[0].solde, cartes: results[0].cartes } });
    });
});

app.post('/api/forgot-password', (req, res) => {
    const { email, pseudo } = req.body;
    db.query(`SELECT id FROM users WHERE email = ? AND pseudo = ?`, [email, pseudo], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ success: false, message: "Email ou Pseudo introuvable" });
        res.json({ success: true, message: "Identité confirmée." });
    });
});

app.post('/api/reset-password', async (req, res) => {
    const { email, pseudo, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query(`UPDATE users SET password = ? WHERE email = ? AND pseudo = ?`, [hashedPassword, email, pseudo], (err, results) => {
            if (err || results.affectedRows === 0) return res.status(400).json({ success: false, message: "Impossible de modifier" });
            res.json({ success: true, message: "Mot de passe modifié !" });
        });
    } catch (error) { res.status(500).json({ success: false, message: "Erreur de chiffrement" }); }
});

app.listen(port, () => console.log(`🚀 Serveur démarré sur http://localhost:${port}`));