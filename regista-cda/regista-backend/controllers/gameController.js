const dbPool = require('../config/db');

/**
 *  CLASSE GAME CONTROLLER
 * Gère le déroulement des parties de scoutisme (récupération des grilles, calcul des scores).
 */
class GameController {
    
    // Route de démarrage
    async startGame(req, res) {
        const teamName = req.params.teamName;
        const sqlQuery = `
            SELECT t.name AS team, p.id AS player_id, p.name AS player_name, p.grid_type, h.hint_text, h.hint_order
            FROM teams t JOIN players_pool p ON t.id = p.team_id LEFT JOIN hints h ON p.id = h.player_id
            WHERE t.name = ? ORDER BY p.grid_type ASC, h.hint_order ASC
        `;
        try {
            const [results] = await dbPool.execute(sqlQuery, [teamName]);
            
            if (results.length === 0) {
                return res.status(404).json({ error: `Aucune donnée trouvée pour l'équipe ${teamName}` });
            }

            const gameSession = { team: teamName, grids: [{ type: 4, player: null, hints: [] }, { type: 5, player: null, hints: [] }, { type: 6, player: null, hints: [] }] };
            
            results.forEach(row => {
                const grid = gameSession.grids.find(g => g.type === row.grid_type);
                if (grid) {
                    grid.player = row.player_name;
                    if (row.hint_text) grid.hints.push(row.hint_text);
                }
            });
            res.json(gameSession);
        } catch (error) {
            console.error("🚨 ERREUR SQL DANS STARTGAME :", error); 
            res.status(500).json({ error: 'Erreur SQL lors du chargement de la partie' });
        }
    }

    // Route de soumission
    async submitGame(req, res) {
        const userId = req.user.id; 
        const { tempsDeclare, erreursCount, indiceUtilise } = req.body; 

        if (tempsDeclare > 45 || tempsDeclare <= 0) {
            return res.status(400).json({ error: "Fraude détectée : Temps hors limites." });
        }

        try {
            const baseReward = 500; 
            const multiplicateur = 1 - (tempsDeclare / 45);
            let oatGagnes = Math.floor(baseReward * multiplicateur);
            if (erreursCount > 0) oatGagnes = Math.floor(oatGagnes * 0.5); 

            let rang = 'D';
            if (tempsDeclare <= 15 && erreursCount === 0 && !indiceUtilise) rang = 'S';
            else if (tempsDeclare <= 25 && erreursCount <= 1) rang = 'A';
            else if (tempsDeclare <= 40 && erreursCount <= 2) rang = 'B';

            await dbPool.execute(
                `UPDATE users SET solde = solde + ? WHERE id = ?`, 
                [oatGagnes, userId]
            );

            const [cards] = await dbPool.execute(
                `SELECT * FROM legendary_cards WHERE tier = ? ORDER BY RAND() LIMIT 1`,
                [rang]
            );
            
            let carteGagnee = null;
            
            if (cards.length > 0) {
                const drawnCard = cards[0];
                
                await dbPool.execute(
                    `INSERT INTO inventaire (user_id, card_id) VALUES (?, ?)`,
                    [userId, drawnCard.id]
                );

                await dbPool.execute(`UPDATE users SET cartes = cartes + 1 WHERE id = ?`, [userId]);

                carteGagnee = {
                    id: drawnCard.id,
                    name: drawnCard.name,
                    team: "Légende",
                    rank: drawnCard.tier,
                    price: drawnCard.base_value,
                    flag: drawnCard.flag,
                    stats: {
                        wc: drawnCard.wc_won,
                        ucl: drawnCard.ucl_won,
                        league: drawnCard.league_won,
                        cup: drawnCard.cup_won
                    }
                };
            }

            res.status(200).json({
                success: true,
                oatGagnes: oatGagnes,
                carteTiree: carteGagnee, 
                rang: rang,
                message: `Grille validée ! Vous avez gagné ${oatGagnes} OAT et une carte de Rang ${rang}.`
            });

        } catch (error) {
            console.error(" ERREUR LORS DE LA SOUMISSION DU JEU :", error);
            res.status(500).json({ error: 'Erreur lors du traitement algorithmique.' });
        }
    }
}

//  EXPORT DE L'INSTANCE
module.exports = new GameController();