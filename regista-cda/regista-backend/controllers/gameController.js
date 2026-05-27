const dbPool = require('../config/db');

// Route de démarrage : On garde vos anciennes tables !
exports.startGame = async (req, res) => {
    const teamName = req.params.teamName;
    const sqlQuery = `
        SELECT t.name AS team, p.id AS player_id, p.name AS player_name, p.grid_type, h.hint_text, h.hint_order
        FROM teams t JOIN players_pool p ON t.id = p.team_id LEFT JOIN hints h ON p.id = h.player_id
        WHERE t.name = ? ORDER BY p.grid_type ASC, h.hint_order ASC
    `;
    try {
        const [results] = await dbPool.execute(sqlQuery, [teamName]);
        
        // Sécurité : Si l'équipe n'existe pas en base, on renvoie une erreur 404 claire
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
        // LE VOILÀ ! Le fameux mouchard qui nous dira tout dans le terminal Docker :
        console.error("🚨 ERREUR SQL DANS STARTGAME :", error); 
        res.status(500).json({ error: 'Erreur SQL lors du chargement de la partie' });
    }
};

// Route de soumission : Anti-triche + Calcul + Tirage dynamique + ACID
exports.submitGame = async (req, res) => {
    const userId = req.user.id; 
    const { tempsDeclare, erreursCount, indiceUtilise } = req.body; 

    if (tempsDeclare > 45 || tempsDeclare <= 0) {
        return res.status(400).json({ error: "Fraude détectée : Temps hors limites." });
    }

    try {
        // 1. Calcul du score côté serveur
        const baseReward = 500; 
        const multiplicateur = 1 - (tempsDeclare / 45);
        let oatGagnes = Math.floor(baseReward * multiplicateur);
        if (erreursCount > 0) oatGagnes = Math.floor(oatGagnes * 0.5); // Malus d'erreur

        // 🎯 Détermination DYNAMIQUE du rang de performance
        let rang = 'D';
        if (tempsDeclare <= 15 && erreursCount === 0 && !indiceUtilise) rang = 'S';
        else if (tempsDeclare <= 25 && erreursCount <= 1) rang = 'A';
        else if (tempsDeclare <= 40 && erreursCount <= 2) rang = 'B';

        // 2. Mise à jour du solde de l'agent
        await dbPool.execute(
            `UPDATE users SET solde = solde + ? WHERE id = ?`, 
            [oatGagnes, userId]
        );

        // 3. 🎲 TIRAGE AUTOMATIQUE ET ENREGISTREMENT EN BASE
        // On pioche une légende qui correspond VRAIMENT au rang obtenu !
        const [cards] = await dbPool.execute(
            `SELECT * FROM legendary_cards WHERE tier = ? ORDER BY RAND() LIMIT 1`,
            [rang]
        );
        
        let carteGagnee = null;
        
        if (cards.length > 0) {
            const drawnCard = cards[0];
            
            // 🔥 CORRECTION CRITIQUE : ON SAUVEGARDE LA LIAISON DANS L'INVENTAIRE SQL !
            await dbPool.execute(
                `INSERT INTO inventaire (user_id, card_id) VALUES (?, ?)`,
                [userId, drawnCard.id]
            );

            // Mise à jour du compteur global de l'utilisateur
            await dbPool.execute(`UPDATE users SET cartes = cartes + 1 WHERE id = ?`, [userId]);

            // 🪄 LE MAPPING BACKEND : On traduit les colonnes SQL pour le composant PlayerCard de React
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

        // 4. On renvoie les données propres au Front-end (React)
        res.status(200).json({
            success: true,
            oatGagnes: oatGagnes,
            carteTiree: carteGagnee, // Contient maintenant le vrai nom (ex: Ronaldinho) et ses stats !
            rang: rang,
            message: `Grille validée ! Vous avez gagné ${oatGagnes} OAT et une carte de Rang ${rang}.`
        });

    } catch (error) {
        console.error("🚨 ERREUR LORS DE LA SOUMISSION DU JEU :", error);
        res.status(500).json({ error: 'Erreur lors du traitement algorithmique.' });
    }
};