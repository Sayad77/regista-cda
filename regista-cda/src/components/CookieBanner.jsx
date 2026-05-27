import { useState, useEffect } from 'react';

export default function CookieBanner() {
  // 1. On vérifie le disque dur de l'utilisateur dès le chargement
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Le code vérifie une seule fois, au démarrage, s'il y a la signature d'accord
    const consent = localStorage.getItem('regista_rgpd_consent');
    if (consent !== 'true') {
      setIsVisible(true); // S'il n'y a pas d'accord, on AFFICHE le bandeau
    }
  }, []);

  // 2. La fonction qui ne s'active QUE quand l'utilisateur clique
  const handleAccept = () => {
    localStorage.setItem('regista_rgpd_consent', 'true'); // On grave l'accord dans le marbre
    setIsVisible(false); // On cache le bandeau
  };

  // Si on ne doit pas le voir, on ne renvoie rien
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#111',
      borderTop: '2px solid #d4af37',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      zIndex: 99999, // Z-index extrême pour être sûr qu'il passe par-dessus tout le jeu
      boxShadow: '0 -10px 30px rgba(0,0,0,0.8)'
    }}>
      <div style={{ flex: '1 1 70%', color: '#bbb', fontSize: '0.95rem', paddingRight: '20px', lineHeight: '1.5' }}>
        <strong style={{ color: '#d4af37', letterSpacing: '1px' }}>🛡️ ACCÈS SÉCURISÉ & VIE PRIVÉE :</strong><br />
        L'Agence REGISTA n'utilise <strong>aucun traceur publicitaire</strong>. Nous utilisons uniquement le stockage local de votre navigateur pour une raison strictement technique : maintenir votre session chiffrée active et sécuriser le contenu de votre coffre-fort. En poursuivant votre navigation, vous acceptez cette utilisation indispensable au fonctionnement du jeu.
      </div>
      <button 
        onClick={handleAccept}
        style={{
          backgroundColor: '#d4af37',
          color: '#000',
          border: 'none',
          padding: '12px 25px',
          borderRadius: '5px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '10px',
          transition: 'transform 0.2s, background-color 0.2s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f1c40f'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#d4af37'}
      >
        J'AI COMPRIS
      </button>
    </div>
  );
}