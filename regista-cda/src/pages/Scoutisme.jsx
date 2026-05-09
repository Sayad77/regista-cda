import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';

// Liste complète et préservée de tes 36 clubs
const availableMissions = [
  { id: 'Arsenal', name: 'ARSENAL', difficulty: 'Difficile', color: '#ef0107' },
  { id: 'Bayern', name: 'BAYERN MÜNCHEN', difficulty: 'Difficile', color: '#dc052d' },
  { id: 'Liverpool', name: 'LIVERPOOL', difficulty: 'Difficile', color: '#c8102E' },
  { id: 'Tottenham', name: 'TOTTENHAM', difficulty: 'Moyen', color: '#132257' },
  { id: 'Barcelona', name: 'BARCELONA', difficulty: 'Difficile', color: '#004d98' },
  { id: 'Chelsea', name: 'CHELSEA', difficulty: 'Moyen', color: '#034694' },
  { id: 'Sporting', name: 'SPORTING CP', difficulty: 'Moyen', color: '#008057' },
  { id: 'ManCity', name: 'MAN CITY', difficulty: 'Extrême', color: '#6CABDD' },
  { id: 'RealMadrid', name: 'REAL MADRID', difficulty: 'Extrême', color: '#d4af37' },
  { id: 'Inter', name: 'INTER', difficulty: 'Difficile', color: '#010E80' },
  { id: 'PSG', name: 'PARIS SG', difficulty: 'Difficile', color: '#004170' },
  { id: 'Newcastle', name: 'NEWCASTLE', difficulty: 'Moyen', color: '#241F20' },
  { id: 'Juventus', name: 'JUVENTUS', difficulty: 'Difficile', color: '#000000' },
  { id: 'Atletico', name: 'ATLETICO MADRID', difficulty: 'Difficile', color: '#CB3524' },
  { id: 'Atalanta', name: 'ATALANTA', difficulty: 'Moyen', color: '#1a5ba3' },
  { id: 'Leverkusen', name: 'LEVERKUSEN', difficulty: 'Difficile', color: '#e32221' },
  { id: 'Dortmund', name: 'DORTMUND', difficulty: 'Moyen', color: '#FDE100' },
  { id: 'Olympiacos', name: 'OLYMPIACOS', difficulty: 'Facile', color: '#c3272b' },
  { id: 'Brugge', name: 'CLUB BRUGGE', difficulty: 'Facile', color: '#00529f' },
  { id: 'Galatasaray', name: 'GALATASARAY', difficulty: 'Moyen', color: '#a90432' },
  { id: 'Monaco', name: 'AS MONACO', difficulty: 'Moyen', color: '#e2001a' },
  { id: 'Qarabag', name: 'QARABAĞ', difficulty: 'Facile', color: '#000000' },
  { id: 'Bodo', name: 'BODØ/GLIMT', difficulty: 'Facile', color: '#ffdd00' },
  { id: 'Benfica', name: 'BENFICA', difficulty: 'Moyen', color: '#ed1c24' },
  { id: 'Marseille', name: 'MARSEILLE', difficulty: 'Moyen', color: '#009dff' },
  { id: 'Pafos', name: 'PAFOS', difficulty: 'Facile', color: '#00529f' },
  { id: 'UnionSG', name: 'UNION SG', difficulty: 'Facile', color: '#ffe500' },
  { id: 'PSV', name: 'PSV EINDHOVEN', difficulty: 'Moyen', color: '#f00000' },
  { id: 'Athletic', name: 'ATHLETIC CLUB', difficulty: 'Moyen', color: '#ee2523' },
  { id: 'Napoli', name: 'NAPOLI', difficulty: 'Moyen', color: '#12a0d7' },
  { id: 'Copenhagen', name: 'COPENHAGEN', difficulty: 'Facile', color: '#0055a4' },
  { id: 'Ajax', name: 'AJAX AMSTERDAM', difficulty: 'Moyen', color: '#d2122e' },
  { id: 'Frankfurt', name: 'FRANKFURT', difficulty: 'Moyen', color: '#e00000' },
  { id: 'Slavia', name: 'SLAVIA PRAHA', difficulty: 'Facile', color: '#e2001a' },
  { id: 'Villarreal', name: 'VILLARREAL', difficulty: 'Moyen', color: '#fce300' },
  { id: 'Kairat', name: 'KAIRAT ALMATY', difficulty: 'Facile', color: '#fce300' }
];

function Scoutisme({ solde, onBuyHint, onWinCard }) {
  const [selectedTeam, setSelectedTeam] = useState(null); 
  const [gameData, setGameData] = useState(null);
  const [currentGridIndex, setCurrentGridIndex] = useState(0);
  const [indicesReveles, setIndicesReveles] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [errorMsg, setErrorMsg] = useState(''); 
  const [victoryData, setVictoryData] = useState(null); 

  useEffect(() => {
    if (!selectedTeam) return; 
    setGameData(null); 
    fetch(`http://localhost:4000/api/game/start/${selectedTeam}`)
      .then(res => res.json())
      .then(data => setGameData(data))
      .catch(err => console.error("Erreur:", err));
  }, [selectedTeam]);

  useEffect(() => {
    if (!gameData || victoryData) return;
    const interval = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [gameData, currentGridIndex, victoryData]);

  const formattedTime = `${Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:${(secondsElapsed % 60).toString().padStart(2, '0')}`;

  const currentGrid = gameData ? gameData.grids[currentGridIndex] : null;
  
  const gridLetters = useMemo(() => {
    if (!currentGrid) return [];
    const name = currentGrid.player.replace(/\s/g, '').toUpperCase();
    let letters = name.split('');
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    while(letters.length < currentGrid.type * currentGrid.type) {
      letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return letters.sort(() => Math.random() - 0.5);
  }, [currentGrid]);

  const handleValider = async () => {
    if (inputValue.toUpperCase() === currentGrid.player.toUpperCase()) {
      if (currentGridIndex < 2) {
        setCurrentGridIndex(currentGridIndex + 1);
        setIndicesReveles(1);
        setInputValue('');
        setSecondsElapsed(0); 
        setErrorMsg('');
      } else {
        let finalRank = 'C'; 
        if (indicesReveles === 1 && secondsElapsed <= 60) finalRank = 'S'; 
        else if (indicesReveles <= 2 && secondsElapsed <= 120) finalRank = 'A'; 
        else if (indicesReveles <= 3 && secondsElapsed <= 180) finalRank = 'B'; 
        
        try {
          const response = await fetch(`http://localhost:4000/api/cards/draw/${finalRank}`);
          const drawnCard = await response.json();

          onWinCard(drawnCard.name, gameData.team, finalRank, drawnCard.base_value, drawnCard);
          
          setVictoryData({ 
            player: drawnCard.name, 
            description: drawnCard.description,
            value: drawnCard.base_value,
            rank: finalRank, 
            flag: drawnCard.flag, 
            time: formattedTime 
          });
        } catch (error) {
          setErrorMsg("Erreur lors de la communication avec l'Agence.");
        }
      }
    } else {
      setErrorMsg("❌ Nom incorrect. Fouillez encore les données !");
      setInputValue('');
      setTimeout(() => setErrorMsg(''), 3000); 
    }
  };

  const buyHint = (cost, hintName) => {
    const isSuccess = onBuyHint(cost, `Achat : ${hintName} (${gameData.team})`);
    if (isSuccess) setIndicesReveles(indicesReveles + 1);
    else {
      setErrorMsg("❌ Solde insuffisant pour cet achat !");
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleLetterClick = (letter) => setInputValue(prev => prev + letter);
  const handleQuit = () => {
    setSelectedTeam(null); setGameData(null); setCurrentGridIndex(0);
    setSecondsElapsed(0); setInputValue(''); setIndicesReveles(1);
    setErrorMsg(''); setVictoryData(null);
  };

  // VUE 1 : UX DESIGN - Tri par difficulté et animations fluides
  if (!selectedTeam) {
    const levels = {
      'Facile': availableMissions.filter(m => m.difficulty === 'Facile'),
      'Moyen': availableMissions.filter(m => m.difficulty === 'Moyen'),
      'Difficile': availableMissions.filter(m => m.difficulty === 'Difficile'),
      'Extrême': availableMissions.filter(m => m.difficulty === 'Extrême'),
    };

    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <main style={{ padding: '3rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <header>
            <h1 style={{ color: '#d4af37', fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '10px' }}>
              RECRUTEMENT
            </h1>
            <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '3rem' }}>
              Identifiez votre cible pour infiltrer le réseau.
            </p>
          </header>

          {Object.entries(levels).map(([level, missions]) => (
            missions.length > 0 && (
              <section key={level} style={{ marginBottom: '40px' }}>
                <h2 style={{ color: '#555', textAlign: 'left', fontSize: '0.9rem', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '20px', letterSpacing: '2px' }}>
                  NIVEAU : {level.toUpperCase()}
                </h2>
                {/* Utilisation de Flexbox pour le responsive design */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                  {missions.map((mission) => (
                    <button 
                      key={mission.id} 
                      onClick={() => setSelectedTeam(mission.id)} 
                      aria-label={`Infiltrer ${mission.name}`}
                      style={{ 
                          background: '#111', 
                          border: `1px solid ${mission.color}50`, 
                          borderRadius: '8px', 
                          padding: '20px', 
                          cursor: 'pointer', 
                          width: '180px', 
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                      }} 
                      onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.borderColor = mission.color;
                          e.currentTarget.style.boxShadow = `0 0 15px ${mission.color}40`;
                      }} 
                      onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.borderColor = `${mission.color}50`;
                          e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ width: '100%', height: '4px', background: mission.color, position: 'absolute', top: 0, left: 0 }}></div>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px' }}>{mission.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            )
          ))}
        </main>
      </div>
    );
  }

  // VUE 2 : Écran de victoire avec Drapeau HD
  if (victoryData) {
    const rankColors = { 'S': '#ffd700', 'A': '#00ffcc', 'B': '#3498db', 'C': '#555' };
    const rColor = rankColors[victoryData.rank];

    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <main role="alert" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div style={{ background: '#111', border: `3px solid ${rColor}`, borderRadius: '15px', padding: '40px', textAlign: 'center', maxWidth: '500px', boxShadow: `0 0 50px ${rColor}40` }}>
            <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '10px' }}>🎉 MISSION ACCOMPLIE</h1>
            <p style={{ color: '#aaa', fontSize: '1.2rem', marginBottom: '30px' }}>
              Base de données du <strong style={{ color: 'white' }}>{gameData.team}</strong> hackée.
            </p>

            <div style={{ background: '#0a0a0a', border: '1px solid #333', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#888' }}>Récompense Légendaire Débloquée :</p>
              <h2 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '2rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                {victoryData.flag && victoryData.flag !== '🌍' ? (
                  <img src={`https://flagcdn.com/w40/${victoryData.flag.toLowerCase()}.png`} alt="Drapeau" style={{ height: '28px', borderRadius: '4px' }} />
                ) : (
                  <span aria-hidden="true">🌍</span>
                )}
                {victoryData.player}
              </h2>
              <p style={{ color: '#bbb', fontStyle: 'italic', marginBottom: '15px' }}>"{victoryData.description}"</p>
              
              <div style={{ display: 'inline-block', borderBottom: `4px solid ${rColor}`, paddingBottom: '5px', marginRight: '15px' }}>
                <span style={{ color: '#888', marginRight: '10px' }}>Rang :</span>
                <strong style={{ color: rColor, fontSize: '1.5rem' }}>{victoryData.rank}</strong>
              </div>
              <div style={{ display: 'inline-block', borderBottom: `4px solid #00D1B2`, paddingBottom: '5px' }}>
                <span style={{ color: '#888', marginRight: '10px' }}>Valeur :</span>
                <strong style={{ color: '#00D1B2', fontSize: '1.5rem' }}>{victoryData.value} 🎫</strong>
              </div>
            </div>

            <p style={{ color: '#00ffcc', marginBottom: '30px', fontWeight: 'bold' }}>✅ La carte a été envoyée en sécurité dans votre Coffre-Fort.</p>
            <button onClick={handleQuit} style={{ background: rColor, color: 'black', border: 'none', padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', width: '100%', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>RETOURNER AU QG</button>
          </div>
        </main>
      </div>
    );
  }

  if (!gameData) return <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}><Navbar /><div style={{ color: '#d4af37', textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }} aria-live="polite">📡 Infiltration des serveurs en cours...</div></div>;

  // VUE 3 : Écran de jeu
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#141414', border: '1px solid #333', borderRadius: '15px', width: '100%', maxWidth: '600px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' }}>
            <button onClick={handleQuit} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' }}>← Quitter</button>
            <h2 style={{ color: '#d4af37', margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>MISSION : {gameData.team}</h2>
            <div style={{ color: '#00D1B2', fontWeight: 'bold', display: 'flex', gap: '15px' }} aria-label="Infos mission">
              <span aria-label={`Solde: ${solde}`}>{solde} 🎫</span>
              <span aria-label={`Temps: ${formattedTime}`}>{formattedTime}</span>
            </div>
          </div>

          <p style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '20px' }}>Joueur : {currentGridIndex + 1}/3</p>

          <div style={{ textAlign: 'center', minHeight: '100px' }}>
            <p style={{ color: '#bbb', fontStyle: 'italic', marginBottom: '20px' }}>{currentGrid.hints[0] ? `Indice 1 : ${currentGrid.hints[0]}` : "Indice 1 : Joueur Légendaire."}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {indicesReveles < 2 && currentGrid.hints[1] && <button onClick={() => buyHint(5, 'Indice 2')} style={hintButtonStyle}>Acheter Indice 2 (-5 🎫)</button>}
              {indicesReveles >= 2 && currentGrid.hints[1] && <p style={{ color: '#bbb', fontStyle: 'italic', width: '100%' }}>Indice 2 : {currentGrid.hints[1]}</p>}
              {indicesReveles < 3 && currentGrid.hints[2] && <button onClick={() => buyHint(10, 'Indice 3')} style={hintButtonStyle}>Acheter Indice 3 (-10 🎫)</button>}
              {indicesReveles >= 3 && currentGrid.hints[2] && <p style={{ color: '#bbb', fontStyle: 'italic', width: '100%' }}>Indice 3 : {currentGrid.hints[2]}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentGrid.type}, 1fr)`, gap: '10px', maxWidth: `${currentGrid.type * 60}px`, margin: '30px auto' }} role="group" aria-label="Grille de lettres">
            {gridLetters.map((letter, index) => (
              <button 
                key={index} 
                onClick={() => handleLetterClick(letter)} 
                aria-label={`Lettre ${letter}`}
                style={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'serif', cursor: 'pointer', userSelect: 'none', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#222'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
              >
                {letter}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="NOM DU JOUEUR" 
                aria-label="Nom du joueur"
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                style={{ flex: 1, backgroundColor: '#000', border: errorMsg ? '1px solid #ff4444' : '1px solid #333', borderRadius: '5px', color: 'white', padding: '15px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', transition: 'border 0.3s' }} 
              />
              <button onClick={() => setInputValue('')} aria-label="Effacer" style={{ backgroundColor: '#7a1b1b', color: 'white', border: 'none', borderRadius: '5px', padding: '0 20px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#a32222'} onMouseLeave={(e) => e.target.style.backgroundColor = '#7a1b1b'}>⌫ EFFACER</button>
            </div>
            
            <div aria-live="assertive">
              {errorMsg && <p style={{ color: '#ff4444', textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>{errorMsg}</p>}
            </div>
          </div>

          {/* UX DESIGN : Bouton plus incitatif si un texte est tapé */}
          <button 
            onClick={handleValider} 
            style={{ 
                width: '100%', 
                backgroundColor: inputValue.length > 0 ? '#d4af37' : '#555', 
                color: 'black', 
                border: 'none', 
                borderRadius: '5px', 
                padding: '15px', 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                cursor: inputValue.length > 0 ? 'pointer' : 'default',
                transition: 'all 0.3s'
            }}
          >
            VALIDER LE NOM
          </button>
        </div>
      </main>
    </div>
  );
}

const hintButtonStyle = { backgroundColor: 'transparent', border: '1px solid #d4af37', color: '#d4af37', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' };

export default Scoutisme;