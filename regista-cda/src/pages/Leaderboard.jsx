import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/classement')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setPlayers(data);
        }
      })
      .catch(err => console.error("Erreur de connexion au serveur :", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🏆 Classement Regista</h1>
        
        <table style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #00D1B2', color: 'white' }}>
              <th style={{ padding: '10px' }}>Position</th>
              <th style={{ padding: '10px' }}>Pseudo</th>
              <th style={{ padding: '10px' }}>Cartes collectionnées</th>
              <th style={{ padding: '10px' }}>Solde</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((player, index) => (
                <tr key={player.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '10px' }}>{index + 1}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{player.pseudo}</td>
                  <td style={{ padding: '10px' }}>{player.cartes}</td>
                  <td style={{ padding: '10px', color: '#00D1B2' }}>{player.solde} €</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px' }}>Chargement des joueurs...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;