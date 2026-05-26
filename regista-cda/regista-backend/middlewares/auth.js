const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupère le token après "Bearer"
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decodedToken.userId, username: decodedToken.username };
        next(); // Le token est bon, on laisse passer
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée ! Vous devez être connecté.' });
    }
};