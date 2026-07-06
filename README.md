# 🏆 REGISTA - Académie de Scoutisme & Marketplace ADN

**REGISTA** est une application web full-stack de détection de légendes du football, de collection de cartes ADN cryptées et de gestion financière (achats d'indices, reventes de cartes cotées sur le marché). 

Ce projet a été conçu, sécurisé et conteneurisé dans le cadre du passage du titre RNCP de **Concepteur Développeur d'Applications (CDA)**.

---

## 🚀 Fonctionnalités Clés

### 👤 Espace Agent (Joueur)
* **Connexion & Inscription Sécurisées :** Système d'accréditation étanche gérant les sessions utilisateur via JWT.
* **🔍 Module Scoutisme :** Jeu de piste et de déduction basé sur des indices statistiques (Coupes du monde, Ligues des Champions, championnats gagnés) pour extraire la carte ADN d'un joueur mystère.
* **🏢 L'Agence OnAirTech :** Place de marché (Marketplace) permettant de revendre ses cartes collectionnées au juste prix. Un système d'évaluation applique automatiquement des coefficients financiers selon le grade de la carte obtenue (**Rang S, A, B, C, D**).
* **🏦 Le Coffre-Fort (Banque) :** Suivi en temps réel du solde de l'agent et historique complet des transactions financières (Revenus de revente, Dépenses d'indices).
* **🏆 Le Classement :** Tableau de bord compétitif recensant les agents les plus riches de l'Académie.

### 👑 Espace Présidentiel (Administration Restreinte)
* **Dashboard Admin Privé :** Interface exclusive accessible uniquement par l'identifiant maître.
* **Gestion du Catalogue :** CRUD permettant d'injecter de nouvelles cartes de légendes dans la base de données et de surveiller l'écosystème.

---

## 🌐 Application en ligne
* **Frontend :** https://regista-front.onrender.com
* **Backend (API) :** https://regista-backend-ziv5.onrender.com

## 🛡️ Architecture de Sécurité (Conformité OWASP & CDA)

L'application intègre des contre-mesures strictes face aux vulnérabilités du web :

1. **Anti-Injection SQL :** Neutralisation totale des charges utiles malveillantes grâce à l'utilisation systématique de **requêtes préparées et paramétrées** (`?`) via le pool de connexions MySQL.
2. **Protection des Mots de Passe :** Aucun mot de passe n'est stocké en clair. Le système utilise l'algorithme de hachage robuste **Bcrypt** (salt round = 10).
3. **Authentification & Contrôle d'Accès :**
   * Génération de jetons **JWT (JSON Web Tokens)** signés cryptographiquement.
   * Pare-feu asynchrone côté Front-end (`PrivateRoute` via React Router) bloquant les accès par manipulation d'URL.
   * Rendu conditionnel de l'interface (la Navbar masque l'accès Admin aux agents standards).
4. **Respect du RGPD :** Intégration d'un bandeau de consentement des cookies et d'une page dédiée à la politique de confidentialité.

---

## 🛠️ Stack Technique & DevOps
* **Frontend :** React.js (Vite), React Router v6, CSS 3.
* **Backend :** Node.js, Express.js.
* **Base de Données :** MySQL 8.0 (Persistance ACID).
* **Conteneurisation :** Docker, Docker Compose (Isolation réseau inter-conteneurs).
* **Déploiement :** Render.com — Frontend en Static Site (CDN), Backend en Web Service Dockerisé.
* **Base de données :** MySQL managée sur Aiven (connexion chiffrée SSL)
* **CI/CD :** GitHub Actions (tests automatisés à chaque push).

---

## 💻 Installation en Environnement Local (Développement)

### Prérequis
* Docker et Docker Compose installés.
* Git installé.

### Procédure d'allumage rapide
1. Clonez le dépôt sur votre machine :
   ```bash
   git clone [https://github.com/VOTRE_COMPTE/regista-cda.git](https://github.com/VOTRE_COMPTE/regista-cda.git)
   cd regista-cda

   
   Accédez à l'application :

Interface Web (React) : http://localhost:5173

API Backend (Node.js) : http://localhost:4000

🚀 Commandes de Maintenance Docker

Démarrer Docker Desktop : docker compose up -d --build

Vérifier l'état de l'architecture : docker compose ps

Consulter la boîte noire (Logs) : docker compose logs

Arrêter les serveurs proprement : docker compose down

📝 Auteurs & Licence
Projet développé, architecturé et déployé par Sayadali Madarbukus (Président) avec l'infrastructure OnAirTech.
Projet académique de certification CDA. 2026
