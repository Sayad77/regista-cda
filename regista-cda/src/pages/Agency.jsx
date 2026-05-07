import { useState } from 'react';
import Navbar from '../components/Navbar';
import PlayerCard from '../components/PlayerCard';

function Agency({ myCollection, onSellPlayer }) {
  // L'état qui va stocker les infos du ticket de caisse une fois la vente effectuée
  const [receipt, setReceipt] = useState(null);

  const handleSell = (id) => {
    // onSellPlayer (dans App.jsx) retourne les infos de la vente !
    const result = onSellPlayer(id);
    if (result) {
      setReceipt(result); // On affiche le ticket avec les infos
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* === LE PANNEAU EXPLICATIF DE L'AGENCE === */}
        <div style={{ background: '#1a1a1c', border: '1px solid #d4af37', borderRadius: '12px', padding: '25px', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <span style={{ fontSize: '2.5rem' }}>🏢</span>
            <div>
              <h2 style={{ color: '#d4af37', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>L'Agence OnAirTech</h2>
              <p style={{ color: '#888', margin: '5px 0 0 0', fontStyle: 'italic' }}>Marché de rachat officiel de Cartes ADN</p>
            </div>
          </div>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>
            L'Agence rachète vos dossiers clôturés pour financer vos futures expéditions. Le prix de rachat dépend exclusivement de la <strong>pureté de la déduction (Le Rang)</strong>. Voici la grille tarifaire en vigueur :
          </p>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
            <div style={{ background: '#111', padding: '10px', borderRadius: '6px', borderBottom: '3px solid #ffd700', flex: 1, textAlign: 'center', color: '#fff' }}><strong>RANG S</strong> : 120%</div>
            <div style={{ background: '#111', padding: '10px', borderRadius: '6px', borderBottom: '3px solid #00ffcc', flex: 1, textAlign: 'center', color: '#fff' }}><strong>RANG A</strong> : 80%</div>
            <div style={{ background: '#111', padding: '10px', borderRadius: '6px', borderBottom: '3px solid #3498db', flex: 1, textAlign: 'center', color: '#fff' }}><strong>RANG B</strong> : 60%</div>
            <div style={{ background: '#111', padding: '10px', borderRadius: '6px', borderBottom: '3px solid #555', flex: 1, textAlign: 'center', color: '#fff' }}><strong>RANG D</strong> : 20%</div>
          </div>
        </div>

        {/* === LE COFFRE DU JOUEUR (Pour la vente) === */}
        <h3 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: '2rem' }}>
          🗄️ Votre Coffre (Cartes disponibles à la vente : {myCollection.length})
        </h3>
        
        {myCollection.length === 0 ? (
          <div style={{ background: '#111', padding: '3rem', borderRadius: '8px', textAlign: 'center', color: '#666', fontStyle: 'italic', border: '1px dashed #333', marginTop: '1rem' }}>
            Votre coffre est vide. Retournez au Scoutisme pour dénicher de nouvelles légendes !
          </div>
        ) : (
          <div className="cards-grid" style={{ marginTop: '1.5rem' }}>
            {myCollection.map(player => (
              <PlayerCard 
                key={`sell-${player.id}`} 
                {...player} 
                isOwned={true} 
                onSell={handleSell} // On passe la fonction qui déclenche le ticket
              />
            ))}
          </div>
        )}

        {/* === LE TICKET DE CAISSE OFFICIEL (MODAL) === */}
        {receipt && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            
            <div style={{ background: '#fdfdfd', color: '#111', padding: '30px', width: '350px', fontFamily: '"Courier New", Courier, monospace', border: '2px dashed #888', boxShadow: '0 0 40px rgba(0, 255, 204, 0.4)', borderRadius: '4px' }}>
              
              <h2 style={{ textAlign: 'center', margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '900' }}>AGENCE ONAIRTECH</h2>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', borderBottom: '1px dashed #ccc', paddingBottom: '15px', color: '#555', fontWeight: 'bold' }}>
                TICKET DE CAISSE OFFICIEL<br/>JEU REGISTA
              </p>
              
              <div style={{ margin: '20px 0', fontSize: '1.1rem', lineHeight: '1.6' }}>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}><span>Heure:</span> <strong>{receipt.date}</strong></p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}><span>Carte ADN:</span> <strong>{receipt.name}</strong></p>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}><span>Pureté:</span> <strong>Rang {receipt.rank}</strong></p>
              </div>

              <div style={{ borderTop: '2px solid #111', borderBottom: '2px solid #111', padding: '15px 0', margin: '20px 0' }}>
                <h3 style={{ margin: 0, display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                  <span>MONTANT VIRÉ:</span> 
                  <span style={{ color: '#27ae60' }}>+{receipt.price} 🎫</span>
                </h3>
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginBottom: '20px', fontStyle: 'italic' }}>
                Transaction certifiée.<br/>La carte a bien été authentifiée comme produit officiel Regista et rachetée par l'Agence.
              </p>
              
              <button onClick={() => setReceipt(null)} style={{ width: '100%', padding: '15px', background: '#111', color: '#00ffcc', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Fermer le reçu
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default Agency;