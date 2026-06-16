const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// On affiche dans le terminal ce que Node.js arrive à lire (pour le débogage)
console.log("🔍 TEST LECTURE .ENV -> USER:", process.env.DB_USER, "| BDD:", process.env.DB_NAME);

const dbPool = mysql.createPool({
    host: process.env.DB_HOST || 'regista-db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'regista_db',
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : null, 
    multipleStatements: true, // 👈 Permet d'exécuter tout le fichier init.sql d'un coup
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 🚀 Script d'auto-importation des tables sur Aiven
async function importDatabaseTables() {
    try {
        // Calcule le chemin pour remonter jusqu'à init.sql depuis regista-backend/config/
        const sqlPath = path.join(__dirname, '../../database/init.sql'); 
        
        if (fs.existsSync(sqlPath)) {
            const sqlQuery = fs.readFileSync(sqlPath, 'utf8');
            await dbPool.query(sqlQuery);
            console.log('🚀 [Aiven BDD] Succès ! Toutes les tables et données ont été importées.');
        } else {
            console.log('⚠️ Fichier init.sql introuvable au chemin :', sqlPath);
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation automatique :', error.message);
    }
}

// Lance l'importation au démarrage du serveur
importDatabaseTables();

console.log('✅ Pool de base de données Regista initialisé (Sécurisé) !');
module.exports = dbPool;