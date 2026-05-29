import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 🧪 AJOUTEZ CE BLOC DE CONFIGURATION POUR LES TESTS
  test: {
    globals: true,             // 1. Active afterAll, describe, expect sans avoir à les importer
    environment: 'jsdom',      // 2. Simule un navigateur internet pour React
    include: ['src/**/*.{test,spec}.{js,jsx}'] // 3. 🎯 FORCE Vitest à ne chercher que dans le Front-end !
  },
})