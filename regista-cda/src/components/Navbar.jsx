import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation(); 
  const navigate = useNavigate(); // 👈 L'outil pour rediriger après le nettoyage

  const isActive = (path) => location.pathname === path ? '#00ffcc' : 'white';

  // 🧹 La fonction de nettoyage absolu
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('regista_collection');
    localStorage.removeItem('regista_solde');
    
    // On renvoie l'agent vers la page de connexion
    navigate('/'); 
  };

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '15px 30px', background: '#0a0a0c', borderBottom: '2px solid #00ffcc' 
    }}>
      <div className="navbar-logo">
        <Link to="/home" style={{ color: '#00ffcc', fontSize: '1.8rem', fontWeight: '900', textDecoration: 'none', letterSpacing: '2px' }}>
          REGISTA <span style={{ background: '#ff007f', color: '#fff', fontSize: '0.8rem', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>BÊTA</span>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/home" style={{ color: isActive('/home'), textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
        <Link to="/game" style={{ color: isActive('/game'), textDecoration: 'none', fontWeight: 'bold' }}>🔍 Scoutisme</Link>
        <Link to="/agency" style={{ color: isActive('/agency'), textDecoration: 'none', fontWeight: 'bold' }}>🏢 Agence</Link>
        <Link to="/bank" style={{ color: isActive('/bank'), textDecoration: 'none', fontWeight: 'bold' }}>🏦 Banque</Link>
        <Link to="/leaderboard" style={{ color: isActive('/leaderboard'), textDecoration: 'none', fontWeight: 'bold' }}>🏆 Classement</Link>
      </div>

      <div>
        {/* On remplace le <Link> par un vrai <button> qui lance le nettoyage */}
        <button 
          onClick={handleLogout} 
          style={{ 
            background: 'transparent',
            border: '1px solid #00ffcc', 
            color: '#00ffcc', 
            padding: '8px 15px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          DÉCONNEXION
        </button>
      </div>
    </nav>
  );
}

export default Navbar;