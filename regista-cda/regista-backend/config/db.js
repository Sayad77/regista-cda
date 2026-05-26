const mysql = require('mysql2/promise');
require('dotenv').config();

// On affiche dans le terminal ce que Node.js arrive à lire (pour le débogage)
console.log("🔍 TEST LECTURE .ENV -> USER:", process.env.DB_USER, "| BDD:", process.env.DB_NAME);

const dbPool = mysql.createPool({
    // L'astuce magique (||) : Si le .env est vide, on force les bonnes valeurs
    host: process.env.DB_HOST || 'regista-db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'regista_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('✅ Pool de base de données Regista initialisé (Sécurisé) !');
module.exports = dbPool;