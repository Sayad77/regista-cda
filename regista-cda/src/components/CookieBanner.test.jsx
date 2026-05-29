import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookieBanner from './CookieBanner';

describe('🍪 Test Unitaire - CookieBanner', () => {
    beforeEach(() => {
    localStorage.clear();
  });
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

    it('devrait changer le style au survol de la souris (onMouseEnter et onMouseLeave)', () => {
    // 1. On affiche le composant
    render(<CookieBanner />);
    
    // 2. On récupère le bouton
    const button = screen.getByText(/J'AI COMPRIS/i);

    // 3. On simule l'entrée de la souris (Déclenche le onMouseEnter)
    fireEvent.mouseEnter(button);
    // Vérification : La couleur a-t-elle changé ?
    expect(button.style.backgroundColor).toBe('rgb(241, 196, 15)'); // #f1c40f en RGB

    // 4. On simule la sortie de la souris (Déclenche le onMouseLeave)
    fireEvent.mouseLeave(button);
    // Vérification : La couleur est-elle revenue à l'original ?
    expect(button.style.backgroundColor).toBe('rgb(212, 175, 55)'); // #d4af37 en RGB
  });

  it('ne devrait pas afficher le bandeau si le consentement est déjà donné', () => {
  // 1. Arrange : On pré-remplit le localStorage avec 'true'
  localStorage.setItem('regista_rgpd_consent', 'true');

  // 2. Act : On affiche le composant
  render(<CookieBanner />);

  // 3. Assert : On vérifie que le bouton n'existe PAS dans le DOM
  // screen.queryByText renvoie null si l'élément n'est pas trouvé
  const button = screen.queryByText(/J'AI COMPRIS/i);
  expect(button).not.toBeInTheDocument();
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