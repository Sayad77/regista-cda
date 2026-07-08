const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');

// 🏆 LE SECRET CDA : On "MOCK" (simule) la base de données !
// Le vrai fichier db.js ne sera jamais exécuté pendant les tests.
jest.mock('../config/db', () => {
    return {
        query: jest.fn(), // On crée une fausse fonction query
        end: jest.fn()    // On crée une fausse fonction end
    };
});

const dbPool = require('../config/db'); // Ceci est maintenant notre fausse base de données

// Fausse application pour le test
const app = express();
app.use(express.json());
app.use('/api/users', authRoutes); 

describe('Tests de la Classe AuthController', () => {

    // On nettoie les fausses données entre chaque test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test n°1 (Passe directement car il plante avant la BDD)
    it('Devrait refuser une inscription si le mot de passe est manquant', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ pseudo: 'Agent_Test' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    // Test n°2 (On force la fausse BDD à dire "Je n'ai pas trouvé l'utilisateur")
    it('Devrait refuser la connexion avec un mauvais pseudo', async () => {
        
        // On ordonne à notre fausse base de données de renvoyer un tableau vide
        dbPool.query.mockResolvedValueOnce([[]]); 

        const res = await request(app)
            .post('/api/users/login')
            .send({
                pseudo: 'Agent_Fantome',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Pseudo introuvable');
    });

});