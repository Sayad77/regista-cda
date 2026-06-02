import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PlayerCard from '../components/PlayerCard';
// 📦 Importation des icônes professionnelles
import { FaUniversity, FaTicketAlt, FaUnlock, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
import { BsSafe } from 'react-icons/bs';

function BankVault({ solde, transactions, myCollection }) {
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  // 🧨 NOUVEL ÉTAT : Contrôle l'affichage de la modale de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Fonction 1 : Déclenchée par le bouton rouge en bas (Ouvre la modale)
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Fonction 2 : Déclenchée par le bouton "Annuler" de la modale (Ferme la modale)
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Fonction 3 : Déclenchée par le bouton "CONFIRMER" de la modale (Détruit le compte)
  const confirmDeletion = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:4000/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Votre compte et vos données ont été définitivement effacés. Au revoir, Agent.");
        localStorage.clear(); 
        window.location.href = '/'; 
      } else {
        alert("Une erreur est survenue lors de la suppression de votre compte.");
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Erreur de suppression :", error);
      alert("Impossible de joindre les serveurs de l'Agence.");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main id="main-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', margin: 0 }}>Banque Centrale & Coffre</h1>
        </div>

        <section style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* LEDGER BANCAIRE */}
          <div style={{ flex: '1 1 400px', background: '#0a0a0c', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ color: '#00ffcc', margin: '0 0 20px 0', fontSize: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <FaUniversity style={{ marginRight: '10px' }} /> 
              HISTORIQUE BANCAIRE (Solde: {solde} <FaTicketAlt style={{ marginLeft: '6px', fontSize: '1rem' }} />)
            </h2>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '10px' }}>
              {transactions.length === 0 ? (
                <p style={{ color: '#555', fontStyle: 'italic', textAlign: 'center' }}>Aucune transaction récente.</p>
              ) : (
                transactions.map((t, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', background: '#111', padding: '12px', borderRadius: '6px', borderLeft: `3px solid ${t.montant > 0 ? '#00ffcc' : '#ff4444'}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 'bold' }}>{t.motif}</span>
                      <span style={{ color: '#888', fontSize: '0.8rem' }}>{t.time}</span>
                    </div>
                    <strong style={{ color: t.montant > 0 ? '#00ffcc' : '#ff4444', fontSize: '1.1rem', alignSelf: 'center', display: 'flex', alignItems: 'center' }}>
                      {t.montant > 0 ? `+${t.montant}` : t.montant} <FaTicketAlt style={{ marginLeft: '6px', fontSize: '0.9rem' }} />
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COFFRE-FORT */}
          <div style={{ flex: '2 1 500px', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: isVaultOpen ? 'flex-start' : 'center' }}>
            <h2 style={{ color: '#d4af37', margin: '0 0 20px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BsSafe style={{ marginRight: '10px', fontSize: '1.4rem' }} /> VOTRE COFFRE-FORT ({myCollection.length} Cartes)
            </h2>
            
            {!isVaultOpen ? (
               <button 
                onClick={() => setIsVaultOpen(true)}
                style={{ background: '#222', border: '1px solid #d4af37', color: '#d4af37', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}
               >
                 <FaUnlock /> DÉVERROUILLER LE COFFRE
               </button>
            ) : (
               <div>
                  <button 
                    onClick={() => setIsVaultOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', marginBottom: '20px', textDecoration: 'underline', fontWeight: 'bold' }}
                  >
                    Verrouiller le coffre (Sécurité)
                  </button>
                  <div className="cards-grid">
                    {myCollection.map(player => (
                      <PlayerCard 
                        key={`owned-${player.id}`} 
                        {...player}
                        isOwned={true} 
                      />
                    ))}
                  </div>
               </div>
            )}
          </div>
        </section>

        {/* ⚖️ Zone de Danger RGPD (Droit à l'oubli) */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #333', textAlign: 'center' }}>
          <h3 style={{ color: '#ff4444', marginBottom: '10px' }}>Zone de Danger (RGPD)</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>
            Conformément au droit à l'oubli, vous pouvez supprimer l'intégralité de vos données de nos serveurs.
          </p>
          <button 
            onClick={handleDeleteClick}
            style={{ 
              background: 'transparent', 
              border: '2px solid #ff4444', 
              color: '#ff4444', 
              padding: '10px 20px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#ff4444'; e.target.style.color = 'white'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ff4444'; }}
          >
            <FaTrashAlt /> SUPPRIMER MON COMPTE DÉFINITIVEMENT
          </button>
        </div>

      </main>

      {/* 🛑 MODALE DE CONFIRMATION STYLISÉE */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 99999, backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#1a1a1c', border: '2px solid #ff4444', borderRadius: '12px',
            padding: '40px', maxWidth: '500px', width: '90%', textAlign: 'center',
            boxShadow: '0 10px 40px rgba(255, 68, 68, 0.2)'
          }}>
            <h2 style={{ color: '#ff4444', fontSize: '1.8rem', marginTop: 0, textTransform: 'uppercase', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <FaExclamationTriangle /> Alerte de Sécurité
            </h2>
            <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
              Êtes-vous absolument certain de vouloir supprimer définitivement votre compte ?<br /><br />
              <strong style={{ color: '#ff4444' }}>Toutes vos cartes, votre solde et votre historique seront détruits. Cette action est IRRÉVERSIBLE.</strong>
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleCancelDelete}
                style={{
                  background: '#333', color: 'white', border: 'none', padding: '12px 25px',
                  borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#555'}
                onMouseLeave={(e) => e.target.style.background = '#333'}
              >
                ANNULER
              </button>
              
              <button 
                onClick={confirmDeletion}
                style={{
                  background: '#ff4444', color: 'white', border: 'none', padding: '12px 25px',
                  borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#cc0000'; e.target.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.target.style.background = '#ff4444'; e.target.style.transform = 'scale(1)'; }}
              >
                OUI, DÉTRUIRE MES DONNÉES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankVault;