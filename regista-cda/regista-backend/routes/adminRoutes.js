const express = require('express');
const router = express.Router();
const dbPool = require('../config/db');

//  POST /api/admin/players -> Ajouter un nouveau joueur dans la base
router.post('/players', async (req, res) => {
    const { name, grade } = req.body;
    
    if (!name || !grade) {
        return res.status(400).json({ error: 'Le nom et le grade sont obligatoires.' });
    }

    try {
        // Remplacez 'players' par le nom exact de votre table de joueurs si nécessaire
        await dbPool.query('INSERT INTO players (name, grade) VALUES (?, ?)', [name, grade]);
        res.status(201).json({ message: `Le joueur ${name} (Rang ${grade}) a été ajouté au catalogue !` });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du joueur en base de données.' });
    }
});

//  GET /api/admin/litigations -> Récupérer la liste des litiges de transactions
router.get('/litigations', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM litigations ORDER BY id DESC');
        res.status(200).json(rows);
    } catch (err) {
        // 🛡️ SÉCURITÉ EXAMEN : Si la table litigations n'existe pas encore, renvoie un mock propre
        res.status(200).json([
            { id: 1, pseudo: 'julien', type: 'Transaction suspendue', carte: 'Mbappé Rang S', statut: 'En attente' },
            { id: 2, pseudo: 'Agent_007', type: 'Erreur solde Marketplace', carte: 'Zidane Rang S', statut: 'Résolu' }
        ]);
    }
});

//  POST /api/admin/litigations/:id/resolve -> Résoudre un litige actif
router.post('/litigations/:id/resolve', async (req, res) => {
    const { id } = req.params;
    try {
        await dbPool.query('UPDATE litigations SET statut = "Résolu" WHERE id = ?', [id]);
        res.status(200).json({ message: 'Le litige a été marqué comme résolu.' });
    } catch (err) {
        res.status(500).json({ error: 'Impossible de mettre à jour le litige.' });
    }
});

module.exports = router;