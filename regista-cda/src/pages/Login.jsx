import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // L'outil pour changer de page
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
const handleLogin = () => {
  // ... ta logique de vérification ...
  localStorage.setItem('username', nameInput); // On stocke le nom pour l'utiliser partout
  navigate('/home');
};

    // Simulation d'authentification (plus tard, on connectera ça à votre vraie API Node.js)
    if (username !== '' && password !== '') {
      navigate('/game'); // Redirige vers le quartier général
    } else {
      alert("Accès refusé. Veuillez entrer vos identifiants.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>REGISTA</h2>
          <span className="badge-beta">PORTAIL</span>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Identifiant Agent</label>
            <input 
              type="text" 
              placeholder="Ex: Sayad77"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="btn-login">INITIER LA CONNEXION</button>
          {/* --- AJOUT DU LIEN DE RÉCUPÉRATION --- */}
<div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
  <p 
    onClick={() => navigate('/forgot-password')} 
    style={{ 
      color: '#00ffcc', 
      fontSize: '0.85rem', 
      cursor: 'pointer', 
      textDecoration: 'none',
      letterSpacing: '1px',
      opacity: 0.8
    }}
    onMouseOver={(e) => e.target.style.opacity = 1}
    onMouseOut={(e) => e.target.style.opacity = 0.8}
  >
    MOT DE PASSE OUBLIÉ ?
  </p>
</div>
        </form>
      </div>
    </div>
  );
}

export default Login;