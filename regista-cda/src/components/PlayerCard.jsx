import { useState } from 'react';
import './PlayerCard.css';

function PlayerCard({ id, name, rarity, price, clues, palmares, onBuy, onSell, isOwned, rank }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const initial = name ? name.charAt(0) : '?';
  const flag = clues && clues[0] ? clues[0].split(' ').pop() : '🌍'; 
  const club = clues && clues[2] ? clues[2] : 'Agent Libre';

  const trophies = {
    worldCup: palmares && palmares.worldCup ? palmares.worldCup.length : (rarity === 'Légendaire' ? 1 : 0),
    championsLeague: palmares && palmares.championsLeague ? palmares.championsLeague.length : 0,
    national: palmares && palmares.national ? palmares.national.length : (rarity === 'Légendaire' ? 3 : 1)
  };

  const rarityClass = rarity === 'Légendaire' ? 'legendaire' : rarity === 'Épique' ? 'epique' : 'standard';

  // Calcul du prix de revente
  let sellCoef = 0.5; 
  if (rank === 'S') sellCoef = 1.2; 
  else if (rank === 'A') sellCoef = 0.8; 
  else if (rank === 'B') sellCoef = 0.6; 
  else if (rank === 'D') sellCoef = 0.2; 
  
  const actualSellPrice = Math.floor((price || 0) * sellCoef);

  const rankStyle = {
    'S': { bg: '#ffd700', color: '#000', shadow: '0 0 15px #ffd700' },
    'A': { bg: '#00ffcc', color: '#000', shadow: '0 0 10px #00ffcc' },
    'B': { bg: '#3498db', color: '#fff', shadow: 'none' },
    'C': { bg: '#e67e22', color: '#fff', shadow: 'none' },
    'D': { bg: '#555555', color: '#fff', shadow: 'none' }
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); 
    if (!isOwned && onBuy) {
        onBuy(id);
    }
  };

  return (
    <div className={`player-card-container ${isFlipped ? 'is-flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`player-card-inner ${rarityClass}`}>
        
        {/* ================= FACE AVANT ================= */}
        <div className="card-front">
          <div className="card-header">
            <span className="card-flag" title="Nationalité">{flag}</span>
            
            {isOwned && rank && (
              <span style={{
                background: rankStyle[rank]?.bg || '#fff',
                color: rankStyle[rank]?.color || '#000',
                boxShadow: rankStyle[rank]?.shadow,
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: '900',
                fontSize: '0.9rem',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                RANG {rank}
              </span>
            )}

            <span className="rarity-badge">{rarity}</span>
          </div>

          {/* LA GESTION DE L'IMAGE EST ICI */}
          <div className="player-photo-container" style={{ width: '100%', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: '10px' }}>
              <img 
                src={`/players/${id}.png`} 
                alt={name}
                onError={(e) => {
                  // Si pas d'image, on cache l'image et on montre l'initiale
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                style={{ height: '100%', objectFit: 'contain' }}
              />
              {/* L'initiale de secours (cachée par défaut) */}
              <div style={{ display: 'none', fontSize: '4rem', fontWeight: 'bold', color: '#555', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {initial}
              </div>
          </div>

          <div className="player-info">
            <h3 className="player-name">{name}</h3>
            <div className="player-club">👕 {club}</div>
            
            <div className="player-trophies">
              {trophies.worldCup > 0 && <span title="Coupe du Monde">🏆 {trophies.worldCup}</span>}
              {trophies.championsLeague > 0 && <span title="Ligue des Champions">🥇 {trophies.championsLeague}</span>}
              <span title="Championnat">🏅 {trophies.national}</span>
            </div>
            
            {!isOwned && <p className="player-price">{price?.toLocaleString()} 🎫</p>}
          </div>

          <div className="card-footer">
            {/* LOGIQUE D'AFFICHAGE DU BOUTON ADAPTÉE POUR BANQUE ET AGENCE */}
            {isOwned ? (
              onSell ? (
                <button 
                  className="btn-sell" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onSell(id);
                  }}
                >
                  REVENDRE (+{actualSellPrice.toLocaleString()} 🎫)
                </button>
              ) : (
                <div style={{ color: '#888', fontStyle: 'italic', padding: '10px 0' }}>En sécurité dans le coffre</div>
              )
            ) : (
              <button className="btn-buy" onClick={handleActionClick}>ACQUÉRIR</button>
            )}
            <div className="flip-hint">↻ Cliquez pour infos</div>
          </div>
        </div>

        {/* ================= FACE ARRIÈRE ================= */}
        <div className="card-back">
          <h4 className="back-title">ARCHIVES : {name}</h4>
          
          {palmares ? (
            <>
              {palmares.worldCup && palmares.worldCup.length > 0 && (
                <div className="palmares-section">
                  <div className="palmares-title">🏆 Coupe du Monde</div>
                  <div className="palmares-years">{palmares.worldCup.join(', ')}</div>
                </div>
              )}
              {palmares.championsLeague && palmares.championsLeague.length > 0 && (
                <div className="palmares-section">
                  <div className="palmares-title">🥇 Ligue des Champions</div>
                  <div className="palmares-years">{palmares.championsLeague.join(', ')}</div>
                </div>
              )}
              {palmares.national && palmares.national.length > 0 && (
                <div className="palmares-section">
                  <div className="palmares-title">🏅 Championnats</div>
                  <div className="palmares-years">{palmares.national.join(', ')}</div>
                </div>
              )}
            </>
          ) : (
            <div className="no-data">Données historiques en cours de déclassification...</div>
          )}

          <div className="card-footer">
             <div className="flip-hint">↻ Retour</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PlayerCard;