const mysql = require('mysql2');

// 1. On se connecte à ta base Wamp
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'regista_db'
});

// 2. Ton tableau de joueurs (Remplace-le par tes 100 joueurs si tu les as de côté !)
const listeJoueurs = [
    { pseudo: "Mourinho", cartes: 12, solde: 50000 },
    { pseudo: "Guardiola", cartes: 8, solde: 45000 },
    { pseudo: "Ancelotti", cartes: 15, solde: 60000 },
    { pseudo: "Klopp", cartes: 6, solde: 30000 },
    { pseudo: "Arteta", cartes: 4, solde: 25000 }
];

console.log("⏳ Début de l'importation...");

// 3. On boucle sur chaque joueur et on l'envoie dans MySQL
listeJoueurs.forEach(joueur => {
    // Le "?" est une sécurité de MySQL pour éviter les piratages
    const sqlQuery = 'INSERT INTO users (pseudo, cartes, solde) VALUES (?, ?, ?)';
    
    db.query(sqlQuery, [joueur.pseudo, joueur.cartes, joueur.solde], (err, results) => {
        if (err) {
            console.error(`❌ Erreur pour le joueur ${joueur.pseudo} :`, err.message);
        } else {
            console.log(`✅ Joueur ${joueur.pseudo} inséré avec succès !`);
        }
    });
});

// Le script s'arrête tout seul, on n'a plus besoin de le lancer ensuite.