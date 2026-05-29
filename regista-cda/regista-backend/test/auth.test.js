// 🎯 INJECTION PRIORITAIRE : On configure l'environnement de test en dur pour Jest
// Cela court-circuite les caprices de dotenvx et isole parfaitement le plan de test.
process.env.NODE_ENV = 'test';
process.env.DB_HOST = '127.0.0.1';   // On cible le Docker qui tourne sur votre Windows
process.env.DB_USER = 'root';        // Votre utilisateur MySQL
process.env.DB_PASSWORD = '';        // Votre mot de passe (vide)
process.env.DB_NAME = 'regista_db';  // Le nom de votre base de données
process.env.PORT = '4000';

const request = require('supertest');
const app = require('../server'); 
const dbPool = require('../config/db'); 

describe('🔒 Tests d\'intégration - Authentification Backend', () => {

    // 🛡️ Fermeture propre du pool après les tests
    afterAll(async () => {
        if (dbPool && typeof dbPool.end === 'function') {
            await dbPool.end();
        }
    });

    it('devrait refuser l\'accès si un agent tente de se connecter avec des champs vides', async () => {
        const res = await request(app)
            .post('/api/login') 
            .send({
                pseudo: '',
                password: ''
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('devrait renvoyer une erreur si le pseudo de l\'agent n\'existe pas', async () => {
        const res = await request(app)
            .post('/api/login') 
            .send({
                pseudo: 'Agent_Fantome_9999',
                password: 'password123'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Pseudo introuvable');
    });
});