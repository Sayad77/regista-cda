const dbPool = require('../config/db');

/**
 * 🏗️ CLASSE CARDS CONTROLLER
 * Gère toute la logique métier (règles) liée aux cartes ADN de l'application.
 */
class CardsController {
  
    /**
     * Méthode : Tirage d'une carte en fonction de son rang (S, A, B, C, D)
     */
    async drawCard(req, res) {
        // 🛡️ SÉCURITÉ : Vérification immédiate de l'ID utilisateur
        const userId = req.user?.id; 
        if (!userId) {
            return res.status(401).json({ error: "Utilisateur non authentifié (JWT manquant)." });
        }

        const { rank } = req.params;

        try {
            const [cards] = await dbPool.execute(
                'SELECT * FROM legendary_cards WHERE tier = ? ORDER BY RAND() LIMIT 1',
                [rank]
            );

            let drawnCard = cards[0];
            
            // 🛡️ SÉCURITÉ : Fallback si la carte n'existe pas
            if (!drawnCard) {
                const [fallback] = await dbPool.execute('SELECT * FROM legendary_cards ORDER BY RAND() LIMIT 1');
                drawnCard = fallback[0];
            }

            if (!drawnCard) throw new Error("Aucune carte disponible en base de données.");

            // 🛡️ SÉCURITÉ : On génère le numéro de série ici pour éviter le undefined
            const serialNumber = Math.floor(Math.random() * 1000000);

            // 🚀 INSERTION AVEC VÉRIFICATION
            await dbPool.execute(
                'INSERT INTO inventaire (user_id, card_id, status) VALUES (?, ?, ?)',
                [userId, drawnCard.id, 'coffre']
            );

            // Mapping pour React...
            const formattedCard = {
                id: drawnCard.id,
                name: drawnCard.name,
                team: "Légende",
                price: drawnCard.base_value,
                flag: drawnCard.flag,
                rank: drawnCard.tier,
                description: drawnCard.description,
                stats: { wc: drawnCard.wc_won, ucl: drawnCard.ucl_won, league: drawnCard.league_won, cup: drawnCard.cup_won }
            };

            res.json({ success: true, card: formattedCard });

        } catch (error) {
            console.error("🚨 ERREUR SQL LORS DU TIRAGE DE CARTE :", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

// 📦 EXPORTATION D'UNE INSTANCE DE LA CLASSE
// On exporte un objet "nouveau contrôleur" pour qu'il soit utilisable dans les routes
module.exports = new CardsController();