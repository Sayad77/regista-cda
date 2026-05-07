import { useState } from 'react';
import Navbar from '../components/Navbar';
import PlayerCard from '../components/PlayerCard';

function BankVault({ solde, transactions, myCollection }) {
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <main id="main-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'white', margin: 0 }}>Banque Centrale & Coffre</h1>
        </div>

        <section style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* LEDGER BANCAIRE */}
          <div style={{ flex: '1 1 400px', background: '#0a0a0c', border: '1px solid #333', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ color: '#00ffcc', margin: '0 0 20px 0', fontSize: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
              🏦 HISTORIQUE BANCAIRE (Solde: {solde} 🎫)
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
                    <strong style={{ color: t.montant > 0 ? '#00ffcc' : '#ff4444', fontSize: '1.1rem', alignSelf: 'center' }}>
                      {t.montant > 0 ? `+${t.montant}` : t.montant} 🎫
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COFFRE-FORT */}
          <div style={{ flex: '2 1 500px', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: isVaultOpen ? 'flex-start' : 'center' }}>
            <h2 style={{ color: '#d4af37', margin: '0 0 20px 0', fontSize: '1.2rem' }}>
              🗄️ VOTRE COFFRE-FORT ({myCollection.length} Cartes)
            </h2>
            
            {!isVaultOpen ? (
               <button 
                onClick={() => setIsVaultOpen(true)}
                style={{ background: '#222', border: '1px solid #d4af37', color: '#d4af37', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', alignSelf: 'center' }}
               >
                 🔓 DÉVERROUILLER LE COFFRE
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
                        // ATTENTION : On n'envoie pas 'onSell' ici car on ne vend plus depuis la banque !
                      />
                    ))}
                  </div>
               </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default BankVault;