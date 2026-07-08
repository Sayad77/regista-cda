import { useState, useEffect, useCallback } from 'react';
import './GameBoard.css';

function GameBoard({ mysteryPlayer, onWin, onGiveUp, onBuyClue }) {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [clueLevel, setClueLevel] = useState(1); 
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'error'

  const targetName = mysteryPlayer.name.replace(/[^a-zA-Z]/g, '').toUpperCase();

  // --- MOTEUR DE GÉNÉRATION ---
  const generateGrid = useCallback(() => {
    const size = 6; 
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let newGrid = [];
    let placed = false;
    const maxRetries = 100;
    let retries = 0;

    while (!placed && retries < maxRetries) {
      retries++;
      newGrid = Array(size).fill(null).map(() => Array(size).fill(''));
      let r = Math.floor(Math.random() * size);
      let c = Math.floor(Math.random() * size);
      newGrid[r][c] = targetName[0];
      let currentR = r, currentC = c;
      let success = true;

      for (let i = 1; i < targetName.length; i++) {
        let available = [];
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            let nr = currentR + dr, nc = currentC + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && newGrid[nr][nc] === '') {
              available.push({ nr, nc });
            }
          }
        }
        
        if (available.length === 0) { 
          success = false; 
          break; 
        } 
        
        let next = available[Math.floor(Math.random() * available.length)];
        newGrid[next.nr][next.nc] = targetName[i];
        currentR = next.nr;
        currentC = next.nc;
      }
      if (success) placed = true;
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
    setGrid(newGrid);
    setSelectedCells([]);
    setStatus('playing');
  }, [targetName]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  // --- LOGIQUE DE SÉLECTION (SANS OBLIGATION DE TOUCHER) ---
  const handleCellClick = (r, c) => {
    if (status !== 'playing' && status !== 'error') return;
    if (status === 'error') setStatus('playing');

    const isSelectedIdx = selectedCells.findIndex(cell => cell.r === r && cell.c === c);
    
    if (isSelectedIdx !== -1) {
      if (isSelectedIdx === selectedCells.length - 1) {
        handleUndo();
      }
      return; 
    }

    setSelectedCells(prev => [...prev, { r, c, letter: grid[r][c] }]);
  };

  const handleUndo = () => {
    setSelectedCells(prev => prev.slice(0, -1));
    setStatus('playing');
  };

  // --- VALIDATION ET ATTRIBUTION DU RANG ---
  const handleValidate = () => {
    const currentWord = selectedCells.map(cell => cell.letter).join('');
    
    if (currentWord === targetName) {
      setStatus('won');
      
      let rank = 'C';
      if (clueLevel === 1) rank = 'S';
      else if (clueLevel === 2) rank = 'A';
      else if (clueLevel === 3) rank = 'B';
      
      setTimeout(() => onWin(mysteryPlayer, rank), 2000); 
    } else {
      setStatus('error'); 
    }
  };

  const handleGiveUp = () => {
    alert(`Dommage ! L'agent caché était ${mysteryPlayer.name}. Vous le recrutez quand même, mais au Rang D.`);
    onWin(mysteryPlayer, 'D');
  };

  const handleReveal = () => {
    alert(`Dossier déclassifié par l'Agence. L'agent caché était ${mysteryPlayer.name}. Vous récupérez la carte au RANG D.`);
    onWin(mysteryPlayer, 'D');
  };

  const handleBuyClue = () => {
    const cost = clueLevel * 200; 
    if (onBuyClue(cost)) {
      setClueLevel(prev => prev + 1);
    }
  };

  return (
    <div className="gameboard-container">
      <div className="game-hud">
        <h3>🔍 DOSSIER SCOUT # {mysteryPlayer.id}</h3>
        <p>Reconstituez le nom de l'agent. Cliquez sur les lettres dans l'ordre.</p>
        
        {/* NOUVELLE ZONE D'INDICES AVEC BOUTON RÉVÉLER */}
        <div className="clues-panel">
          <div className="clue-item">🌍 Indice 1 : <strong>{mysteryPlayer.clues[0]}</strong></div>
          
          {clueLevel >= 2 ? (
             <div className="clue-item">📍 Indice 2 : <strong>{mysteryPlayer.clues[1]}</strong></div>
          ) : (
             <button className="btn-clue" onClick={handleBuyClue}>Acheter Indice 2 (200 🎫)</button>
          )}

          {clueLevel >= 3 ? (
             <div className="clue-item">🏆 Indice 3 : <strong>{mysteryPlayer.clues[2]}</strong></div>
          ) : clueLevel === 2 ? (
             <button className="btn-clue" onClick={handleBuyClue}>Acheter Indice Ultime (400 🎫)</button>
          ) : null}

          <button 
            className="btn-clue" 
            style={{ marginTop: '10px', borderColor: '#ff4444', color: '#ff4444', borderStyle: 'dashed' }} 
            onClick={handleReveal}
          >
             Révéler l'identité (Rang D)
          </button>
        </div>
      </div>

      {/* ZONE DE JEU */}
      <div className="game-core-area">
        <div className={`boggle-grid ${status}`}>
          {grid.map((row, r) => (
            <div key={r} className="boggle-row">
              {row.map((letter, c) => {
                const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
                return (
                  <div 
                    key={`${r}-${c}`} 
                    className={`boggle-cell ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCellClick(r, c)}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="controls-panel">
          <div className={`input-display ${status === 'error' ? 'error-text' : ''}`}>
            {selectedCells.length > 0 
              ? selectedCells.map(c => c.letter).join('') 
              : <span className="placeholder-text">NOM DU JOUEUR</span>
            }
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-action btn-undo" 
              onClick={handleUndo} 
              disabled={selectedCells.length === 0 || status === 'won'}
            >
              ⌫ Effacer
            </button>
            <button 
              className="btn-action btn-submit" 
              onClick={handleValidate} 
              disabled={selectedCells.length === 0 || status === 'won'}
            >
              ✓ Valider
            </button>
          </div>
        </div>
      </div>
      
      {status === 'won' && <div className="victory-banner">MISSION RÉUSSIE : {mysteryPlayer.name} DÉMASQUÉ !</div>}

      <div className="gameboard-footer">
        <button className="btn-giveup" onClick={handleGiveUp}>Abandonner le dossier</button>
      </div>
    </div>
  );
}

export default GameBoard;