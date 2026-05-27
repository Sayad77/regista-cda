const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // 1. Vérifie si le badge est bien présenté à la frontière
        if (!req.headers.authorization) {
            return res.status(401).json({ error: "Aucun jeton fourni dans l'en-tête." });
        }

        // 2. Récupération et lecture du badge
        const token = req.headers.authorization.split(' ')[1]; // Récupère le token après "Bearer"
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // 3. 🛡️ L'ASTUCE EST ICI : On récupère l'ID, qu'il ait été nommé `userId` ou `id` lors du login !
        const extractedId = decodedToken.userId || decodedToken.id;

        if (!extractedId) {
            throw new Error("Impossible de trouver l'identifiant du joueur dans le jeton.");
        }

        // 4. On transmet les bonnes informations au contrôleur suivant
        req.user = { 
            id: extractedId, 
            username: decodedToken.username 
        };
        
        next(); // Le token est valide, on ouvre la porte !

    } catch (error) {
        console.error("🚨 Erreur Middleware Auth :", error.message);
        res.status(401).json({ error: 'Requête non authentifiée ! Jeton invalide ou expiré.' });
    }
};