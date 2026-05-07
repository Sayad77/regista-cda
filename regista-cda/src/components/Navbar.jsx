import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation(); 
  const isActive = (path) => location.pathname === path ? '#00ffcc' : 'white';

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
        <Link to="/" style={{ border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 15px', borderRadius: '6px', textDecoration: 'none' }}>
          DÉCONNEXION
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;