const dbPool = require('../config/db');

exports.drawCard = async (req, res) => {
    const userId = req.user.id; 
    const { rank } = req.params; // S, A, B, C, ou D

    try {
        // 1. Piocher une carte au hasard (on filtre même par le rang gagné pour être raccord avec le jeu !)
        const [cards] = await dbPool.execute(
            'SELECT * FROM legendary_cards WHERE tier = ? ORDER BY RAND() LIMIT 1',
            [rank]
        );

        // Sécurité si aucune carte du rang n'est trouvée, on pioche au hasard total
        let drawnCard;
        if (cards.length === 0) {
            const [fallbackCards] = await dbPool.execute('SELECT * FROM legendary_cards ORDER BY RAND() LIMIT 1');
            drawnCard = fallbackCards[0];
        } else {
            drawnCard = cards[0];
        }

        // 2. Sauvegarder la carte dans l'inventaire de l'agent
        await dbPool.execute(
            'INSERT INTO inventaire (user_id, card_id) VALUES (?, ?)',
            [userId, drawnCard.id]
        );

        // 3. 🪄 LE MAPPING : On "traduit" les données SQL pour que React les comprenne parfaitement
        const formattedCard = {
            id: drawnCard.id,
            name: drawnCard.name,
            team: "Légende", // Force le mot "Légende" au lieu de garder ManCity
            price: drawnCard.base_value, // base_value devient price
            flag: drawnCard.flag,
            rank: drawnCard.tier, // tier devient rank
            description: drawnCard.description,
            // On regroupe les trophées dans le fameux objet "stats" attendu par React
            stats: {
                wc: drawnCard.wc_won,
                ucl: drawnCard.ucl_won,
                league: drawnCard.league_won,
                cup: drawnCard.cup_won
            }
        };

        // 4. Renvoyer la carte formatée au Front-end
        res.json({
            success: true,
            card: formattedCard
        });

    } catch (error) {
        console.error("🚨 ERREUR SQL LORS DU TIRAGE DE CARTE :", error.message);
        res.status(500).json({ error: 'Erreur serveur lors du tirage de la carte.' });
    }
};