import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
// 📦 Importation des icônes
import { AiTwotoneTrophy } from 'react-icons/ai';
import { FcMoneyTransfer } from 'react-icons/fc';
import { FaCrown } from 'react-icons/fa';

function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/game/classement')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlayers(data);
        }
      })
      .catch(err => console.error("Erreur de connexion au serveur :", err));
  }, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        
        <h1 style={{ color: '#d4af37', fontSize: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '40px' }}>
          <AiTwotoneTrophy style={{ fontSize: '2.8rem' }} /> Classement Regista
        </h1>
        
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #00D1B2', color: '#00D1B2', fontSize: '1.1rem' }}>
                <th style={{ padding: '15px' }}>Position</th>
                <th style={{ padding: '15px' }}>Pseudo</th>
                <th style={{ padding: '15px' }}>Solde</th>
              </tr>
            </thead>
            <tbody>
              {players.length > 0 ? (
                players.map((player, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: index === 0 ? '#d4af37' : '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {index + 1} {index === 0 && <FaCrown style={{ color: '#d4af37', fontSize: '1.2rem' }} />}
                    </td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{player.pseudo || player.username}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#00D1B2' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {player.solde} <FcMoneyTransfer style={{ fontSize: '1.4rem' }} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                    Aucun agent enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;