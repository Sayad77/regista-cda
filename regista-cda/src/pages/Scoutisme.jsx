import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';

function Scoutisme() {
  const [gameData, setGameData] = useState(null);
  const [currentGridIndex, setCurrentGridIndex] = useState(0);
  const [indicesReveles, setIndicesReveles] = useState(1);
  const [inputValue, setInputValue] = useState('');
  
  const [localSolde, setLocalSolde] = useState(60); 
  
  // NOUVEAU : État pour le chronomètre
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Appel au Backend pour récupérer les données du PSG
  useEffect(() => {
    fetch('http://localhost:4000/api/game/start/PSG')
      .then(res => res.json())
      .then(data => setGameData(data))
      .catch(err => console.error("Erreur:", err));
  }, []);

  // NOUVEAU : Le moteur du chronomètre (tourne toutes les 1000ms)
  useEffect(() => {
    if (!gameData) return; // On ne lance pas le chrono si le jeu charge
    
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    
    // On nettoie le chrono quand on quitte la page ou change de joueur
    return () => clearInterval(interval);
  }, [gameData, currentGridIndex]);

  // Formatage du temps (ex: 6 secondes devient "00:06")
  const formattedTime = `${Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:${(secondsElapsed % 60).toString().padStart(2, '0')}`;

  const currentGrid = gameData ? gameData.grids[currentGridIndex] : null;
  
  const gridLetters = useMemo(() => {
    if (!currentGrid) return [];
    const name = currentGrid.player.replace(/\s/g, '').toUpperCase();
    const size = currentGrid.type;
    let letters = name.split('');
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const totalSlots = size * size;
    
    while(letters.length < totalSlots) {
      letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return letters.sort(() => Math.random() - 0.5);
  }, [currentGrid]);

  if (!gameData) return <div style={{ color: '#d4af37', textAlign: 'center', marginTop: '50px' }}>Chargement de la mission...</div>;

  const handleValider = () => {
    if (inputValue.toUpperCase() === currentGrid.player.toUpperCase()) {
      // Calculer le bonus de temps ici plus tard si besoin !
      
      if (currentGridIndex < 2) {
        setCurrentGridIndex(currentGridIndex + 1);
        setIndicesReveles(1);
        setInputValue('');
        setSecondsElapsed(0); // Remise à zéro du chrono pour le joueur suivant
      } else {
        alert(`🎉 Mission accomplie ! Temps pour le dernier joueur : ${formattedTime}`);
      }
    } else {
      alert("❌ Mauvais nom, réessaie !");
    }
  };

  const buyHint = (cost) => {
    if (localSolde >= cost) {
      setLocalSolde(localSolde - cost);
      setIndicesReveles(indicesReveles + 1);
    } else {
      alert("Solde insuffisant !");
    }
  };

  // NOUVEAU : Fonction pour cliquer sur une lettre
  const handleLetterClick = (letter) => {
    setInputValue(prev => prev + letter);
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          backgroundColor: '#141414', 
          border: '1px solid #333', 
          borderRadius: '15px', 
          width: '100%', 
          maxWidth: '600px', 
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#d4af37', margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>
              MISSION : {gameData.team}
            </h2>
            <div style={{ color: '#00D1B2', fontWeight: 'bold', display: 'flex', gap: '15px' }}>
              <span>{localSolde} 🎫</span>
              {/* Le chrono est maintenant dynamique */}
              <span style={{ color: '#888' }}>{formattedTime}</span>
            </div>
          </div>

          <p style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '20px' }}>
            Joueur : {currentGridIndex + 1}/3
          </p>

          <div style={{ textAlign: 'center', minHeight: '100px' }}>
            <p style={{ color: '#bbb', fontStyle: 'italic', marginBottom: '20px' }}>
              {currentGrid.hints[0] ? `Indice 1 : ${currentGrid.hints[0]}` : "Indice 1 : Joueur Légendaire."}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {indicesReveles < 2 && currentGrid.hints[1] && (
                <button onClick={() => buyHint(5)} style={hintButtonStyle}>Acheter Indice 2 (-5 🎫)</button>
              )}
              {indicesReveles >= 2 && currentGrid.hints[1] && (
                <p style={{ color: '#bbb', fontStyle: 'italic', width: '100%' }}>Indice 2 : {currentGrid.hints[1]}</p>
              )}

              {indicesReveles < 3 && currentGrid.hints[2] && (
                <button onClick={() => buyHint(10)} style={hintButtonStyle}>Acheter Indice 3 (-10 🎫)</button>
              )}
              {indicesReveles >= 3 && currentGrid.hints[2] && (
                <p style={{ color: '#bbb', fontStyle: 'italic', width: '100%' }}>Indice 3 : {currentGrid.hints[2]}</p>
              )}

              <button style={{...hintButtonStyle, color: '#e74c3c', borderColor: '#e74c3c', borderStyle: 'dashed'}}>Voir la réponse (-25 🎫)</button>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${currentGrid.type}, 1fr)`, 
            gap: '10px', 
            maxWidth: `${currentGrid.type * 60}px`, 
            margin: '30px auto' 
          }}>
            {gridLetters.map((letter, index) => (
              <div 
                key={index} 
                // NOUVEAU : On ajoute l'événement onClick et on change le curseur
                onClick={() => handleLetterClick(letter)}
                style={{
                  backgroundColor: '#000',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'serif',
                  cursor: 'pointer', // Montre que c'est cliquable
                  userSelect: 'none' // Empêche de surligner la lettre par erreur
                }}>
                {letter}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input 
              type="text" 
              placeholder="NOM" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#000',
                border: '1px solid #333',
                borderRadius: '5px',
                color: 'white',
                padding: '15px',
                fontSize: '1.2rem',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}
            />
            <button 
              onClick={() => setInputValue('')}
              style={{ backgroundColor: '#7a1b1b', color: 'white', border: 'none', borderRadius: '5px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold' }}>
              ⌫ EFFACER
            </button>
          </div>

          <button 
            onClick={handleValider}
            style={{ 
              width: '100%', 
              backgroundColor: '#d4af37', 
              color: 'black', 
              border: 'none', 
              borderRadius: '5px', 
              padding: '15px', 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}>
            VALIDER LE NOM
          </button>

        </div>
      </div>
    </div>
  );
}

const hintButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #d4af37',
  color: '#d4af37',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '0.9rem'
};

export default Scoutisme;