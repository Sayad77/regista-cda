import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookieBanner from './CookieBanner';

describe('🍪 Test Unitaire - CookieBanner', () => {
    
    it('devrait afficher le texte d\'information sur le stockage local de l\'Agence', () => {
        render(<CookieBanner />);
        const texteElement = screen.getByText(/traceur publicitaire/i);
        expect(texteElement).toBeInTheDocument();
    });

    it('devrait afficher le bouton de validation J\'AI COMPRIS', () => {
        render(<CookieBanner />);
        const boutonCompris = screen.getByRole('button', { name: /j'ai compris/i });
        expect(boutonCompris).toBeInTheDocument();
    });

    it('devrait exécuter la fonction de fermeture lorsque l\'utilisateur clique sur J\'AI COMPRIS', () => {
        render(<CookieBanner />);
        
        // 1. On récupère le bouton présent au départ
        const boutonCompris = screen.getByRole('button', { name: /j'ai compris/i });
        
        // 2. On clique dessus virtuellement
        fireEvent.click(boutonCompris);
        
        // 3. 🎯 CORRECTION : On vérifie que le bouton n'est PLUS dans le document (il a disparu !)
        const boutonApresClic = screen.queryByRole('button', { name: /j'ai compris/i });
        expect(boutonApresClic).not.toBeInTheDocument(); 
    });
});