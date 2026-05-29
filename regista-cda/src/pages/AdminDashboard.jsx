import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Ajout indispensable
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [playerName, setPlayerName] = useState('');
  const [playerGrade, setPlayerGrade] = useState('A');
  const [litigations, setLitigations] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Charger les litiges au démarrage avec vérification d'identité intégrée
  useEffect(() => {
    const token = localStorage.getItem('token');
    const pseudo = localStorage.getItem('pseudo');

    // 🛡️ SÉCURITÉ ADMINISTRATEUR SUPRÊME (Double contrôle)
    if (!token) {
      navigate('/');
      return;
    }
    if (pseudo !== 'Dildi_President') {
      navigate('/home'); // Rejet de l'utilisateur standard vers l'accueil général
      return;
    }

    fetchLitigations(token);
  }, [navigate]);

  const fetchLitigations = (token) => {
    const activeToken = token || localStorage.getItem('token');
    fetch('http://localhost:4000/api/admin/litigations', {
        headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
        }
    })
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
            setLitigations(data);
        }
      })
      .catch(err => console.error(err));
  };

  // Soumission du nouveau joueur (Sécurisée par JWT)
  const handleAddPlayer = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:4000/api/admin/players', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ name: playerName, grade: playerGrade })
    })
    .then(res => res.json())
    .then(data => {
      setMessage(data.message || data.error);
      setPlayerName('');
    });
  };

  // Résolution d'un litige (Sécurisée par JWT)
  const handleResolve = (id) => {
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:4000/api/admin/litigations/${id}/resolve`, { 
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        fetchLitigations(token);
        alert('Litige résolu avec succès !');
      });
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        <h1 style={{ color: '#ff4444', fontSize: '2.2rem', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '40px' }}>
          ⚙️ QG de Contrôle - Administration
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* Formulaire : Ajouter un joueur */}
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222', height: 'fit-content' }}>
            <h2 style={{ color: '#d4af37', fontSize: '1.3rem', marginTop: 0, marginBottom: '20px' }}>Ajouter un Joueur ADN</h2>
            {message && <p style={{ color: '#00ffcc', fontSize: '0.9rem', marginBottom: '15px' }}>{message}</p>}
            
            <form onSubmit={handleAddPlayer}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Nom du footballeur</label>
                <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.9rem' }}>Grade de la Carte</label>
                <select value={playerGrade} onChange={(e) => setPlayerGrade(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}>
                  <option value="S">Rang S (Légendaire)</option>
                  <option value="A">Rang A (Excellent)</option>
                  <option value="B">Rang B (Bon)</option>
                  <option value="C">Rang C (Moyen)</option>
                  <option value="D">Rang D (Espoir)</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Injecter en base
              </button>
            </form>
          </div>

          {/* Tableau : Gestion des litiges de la Marketplace */}
          <div style={{ background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222' }}>
            <h2 style={{ color: '#d4af37', fontSize: '1.3rem', marginTop: 0, marginBottom: '20px' }}>Litiges Marketplace & Ventes suspectes</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Agent</th>
                  <th style={{ padding: '10px' }}>Incident</th>
                  <th style={{ padding: '10px' }}>Objet</th>
                  <th style={{ padding: '10px' }}>Statut</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {litigations.map((litige) => (
                  <tr key={litige.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px' }}>#{litige.id}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{litige.pseudo}</td>
                    <td style={{ padding: '12px', color: '#ff4444' }}>{litige.type || 'Conflit de transaction'}</td>
                    <td style={{ padding: '12px' }}>{litige.carte}</td>
                    <td style={{ padding: '12px', color: litige.statut === 'Résolu' ? '#00ffcc' : '#f0c641' }}>{litige.statut}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {litige.statut !== 'Résolu' && (
                        <button onClick={() => handleResolve(litige.id)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                          Résoudre
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}