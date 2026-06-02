import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBuilding, FaUniversity, FaTrophy, FaCog, FaHome } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  // On récupère le pseudo (soit 'pseudo', soit 'username' selon votre configuration)
  const currentAgent = localStorage.getItem('pseudo') || localStorage.getItem('username');

  // 🛡️ ACCÈS ADMIN : Le bouton s'affiche UNIQUEMENT pour Dildi_President
  const isAuthorizedAdmin = currentAgent === 'Dildi_President';

  const handleLogout = () => {
    localStorage.clear(); // Purge absolue
    navigate('/');
  };

  // Ajout du flex pour un alignement vertical parfait icône + texte
  const linkStyle = { 
    color: '#fff', 
    textDecoration: 'none', 
    fontSize: '0.95rem', 
    fontWeight: '500', 
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#0a0a0a', borderBottom: '1px solid #222' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#00ffcc', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '2px' }}>REGISTA</span>
        <span style={{ background: '#ff4444', color: '#000', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>BÊTA</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <Link to="/home" style={linkStyle}>
          <FaHome style={{ marginRight: '8px' }} /> Accueil
        </Link>
        <Link to="/scoutisme" style={linkStyle}>
          <FaSearch style={{ marginRight: '8px' }} /> Scoutisme
        </Link>
        <Link to="/agence" style={linkStyle}>
          <FaBuilding style={{ marginRight: '8px' }} /> Agence
        </Link>
        <Link to="/banque" style={linkStyle}>
          <FaUniversity style={{ marginRight: '8px' }} /> Banque
        </Link>
        <Link to="/classement" style={linkStyle}>
          <FaTrophy style={{ marginRight: '8px' }} /> Classement
        </Link>
        
        {/* ⚙️ BOUTON ADMIN NETTOYÉ ET SÉCURISÉ */}
        {isAuthorizedAdmin && (
          <Link to="/admin" style={{ ...linkStyle, color: '#ff4444', fontWeight: 'bold', border: '1px solid #ff4444', padding: '5px 10px', borderRadius: '6px' }}>
            <FaCog style={{ marginRight: '8px' }} /> Admin
          </Link>
        )}

        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          DÉCONNEXION
        </button>
      </div>
    </nav>
  );
}