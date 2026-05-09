import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState({ pseudo: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // On s'adapte à ton backend local pour la connexion/inscription
    const endpoint = isLoginMode ? 'http://localhost:4000/api/login' : 'http://localhost:4000/api/register';
    
    // Si on s'inscrit, on envoie aussi l'email
    const payload = isLoginMode 
        ? { pseudo: form.pseudo, password: form.password } 
        : { pseudo: form.pseudo, email: form.email, password: form.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok || data.success) {
        localStorage.setItem('username', form.pseudo);
        navigate('/home');
      } else {
        setError(data.error || data.message || "Erreur d'authentification");
      }
    } catch (err) { 
        setError("Impossible de joindre le serveur de l'Agence."); 
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={cardStyle}>
          <h1 style={{color: '#00D1B2', margin: '0 0 10px 0', fontSize: '2.5rem', letterSpacing: '3px'}}>REGISTA</h1>
          <p style={{color: '#888', marginBottom: '30px', fontSize: '1.1rem'}}>
            {isLoginMode ? "Connexion Agent" : "Nouveau Profil"}
          </p>
          
          <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <input 
              type="text" placeholder="PSEUDO" 
              value={form.pseudo} onChange={(e)=>setForm({...form, pseudo: e.target.value})} 
              style={inputStyle} required
            />
            
            {/* On demande l'email uniquement à l'inscription */}
            {!isLoginMode && (
              <input 
                type="email" placeholder="ADRESSE EMAIL" 
                value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} 
                style={inputStyle} required
              />
            )}

            <input 
              type="password" placeholder="MOT DE PASSE" 
              value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} 
              style={inputStyle} required
            />

            {error && <p style={{color: '#ff4444', margin: 0, fontWeight: 'bold'}}>{error}</p>}

            <button type="submit" style={btnStyle}>
              {isLoginMode ? "SE CONNECTER" : "CRÉER COMPTE"}
            </button>
          </form>

          <div style={{marginTop: '25px'}}>
            <p onClick={() => {setIsLoginMode(!isLoginMode); setError('');}} style={linkStyle}>
              {isLoginMode ? "Pas encore de compte ? S'inscrire" : "Déjà agent ? Se connecter"}
            </p>
            
            {/* VOICI LE LIEN MOT DE PASSE OUBLIÉ */}
            {isLoginMode && (
              <Link to="/forgot-password" style={forgotStyle}>
                Mot de passe oublié ?
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' };
const cardStyle = { background: '#111', padding: '40px', borderRadius: '15px', border: '1px solid #00D1B2', textAlign: 'center', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0, 209, 178, 0.2)' };
const inputStyle = { backgroundColor: '#000', border: '1px solid #333', color: 'white', padding: '15px', borderRadius: '8px', fontSize: '1.1rem', textAlign: 'center', letterSpacing: '1px' };
const btnStyle = { backgroundColor: '#00D1B2', color: 'black', border: 'none', padding: '15px', fontWeight: '900', cursor: 'pointer', borderRadius: '8px', fontSize: '1.2rem', textTransform: 'uppercase' };
const linkStyle = { color: '#00D1B2', cursor: 'pointer', fontSize: '0.95rem', textDecoration: 'underline', marginBottom: '15px', display: 'block' };
const forgotStyle = { color: '#888', fontSize: '0.85rem', textDecoration: 'none' };

export default Login;