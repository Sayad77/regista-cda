import { defineConfig } from 'vitest/config'; // Importation depuis vitest pour la compatibilité
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // 🎯 SÉCURITÉ SERVEUR INTERNE & DOCKER
  server: {
    host: true, // Force Vite à écouter sur toutes les interfaces du conteneur
    port: 5173,
    strictPort: true,
    allowedHosts: true, // Option officielle Vite 6 pour désactiver complètement la vérification
  },

  test: {
    globals: true, 
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    
    // 🎯 CONFIGURATION DE LA COUVERTURE (Code Coverage)
    coverage: {
      provider: 'v8', // Utilise V8 pour une analysis rapide et précise
      reporter: ['text', 'json', 'html'], // Génère les rapports nécessaires
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});