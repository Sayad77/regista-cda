import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [form, setForm] = useState({ pseudo: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🧹 NETTOYAGE CHIRURGICAL : Dès qu'on arrive sur la page de connexion, on détruit l'ancienne session
  // Mais ON GARDE INTENTIOENNELLEMENT regista_solde et regista_collection pour ne pas perdre l'argent et les cartes !
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('pseudo');
    localStorage.removeItem('username');
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLoginMode ? 'http://localhost:4000/api/login' : 'http://localhost:4000/api/register';
    
    const payload = isLoginMode 
        ? { pseudo: form.pseudo, password: form.password } 
        : { pseudo: form.pseudo, email: form.email, password: form.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      let data;
      try {
          data = await response.json();
      } catch (parseError) {
          console.error("Le serveur n'a pas renvoyé un JSON valide :", parseError);
          throw new Error("Erreur interne du serveur. Regardez les logs de Docker !");
      }
      
      if (response.ok || data.success) {
        // 🎯 On stocke les identifiants avec les bonnes clés pour que la Navbar et le Backend nous reconnaissent
        localStorage.setItem('pseudo', form.pseudo);
        localStorage.setItem('username', form.pseudo); 
        localStorage.setItem('token', data.token); 
        
        navigate('/home');
      } else {
        setError(data.error || data.message || "Erreur d'authentification");
      }
    } catch (err) { 
      console.error("🚨 Vraie erreur capturée :", err);
      if (err.message === "Failed to fetch") {
          setError("Impossible de joindre le serveur. (Vérifiez que Docker est allumé sur le port 4000).");
      } else {
          setError(err.message || "Une erreur inconnue s'est produite.");
      }
    }
  };

  return (
    <div style={containerStyle}>
      {/* ⚠️ La Navbar n'est pas importée ici, elle ne s'affichera donc jamais sur la page de connexion */}
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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