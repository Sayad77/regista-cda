# On utilise une version légère de Node.js (Alpine)
FROM node:20-alpine

# On définit le dossier de travail dans le conteneur
WORKDIR /app

# On copie les fichiers de configuration npm
COPY package*.json ./

# On installe les dépendances (express, mysql2, bcrypt, etc.) de manière déterministe
 RUN npm ci --omit=dev

# On copie tout le reste du code
COPY . .

# On expose le port 4000 pour que React puisse lui parler
EXPOSE 4000

# La commande pour démarrer le serveur
CMD ["node", "server.js"]