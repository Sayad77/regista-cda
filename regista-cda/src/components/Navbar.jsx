import { Link, useNavigate } from 'react-router-dom';
// 📦 Importation des icônes colorées (Flat Color)
import { FcHome, FcSearch, FcOrganization, FcLibrary, FcIcons8Cup, FcSettings } from 'react-icons/fc';

export default function Navbar() {
  const navigate = useNavigate();
  const currentAgent = localStorage.getItem('pseudo') || localStorage.getItem('username');

  // 🛡️ ACCÈS ADMIN : Le bouton s'affiche UNIQUEMENT pour Dildi_President
  const isAuthorizedAdmin = currentAgent === 'Dildi_President';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

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
          <FcHome style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Accueil
        </Link>
        <Link to="/scoutisme" style={linkStyle}>
          <FcSearch style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Scoutisme
        </Link>
        <Link to="/agence" style={linkStyle}>
          <FcOrganization style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Agence
        </Link>
        <Link to="/banque" style={linkStyle}>
          <FcLibrary style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Banque
        </Link>
        <Link to="/classement" style={linkStyle}>
          <FcIcons8Cup style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Classement
        </Link>
        
        {/* ⚙️ BOUTON ADMIN */}
        {isAuthorizedAdmin && (
          <Link to="/admin" style={{ ...linkStyle, color: '#ff4444', fontWeight: 'bold', border: '1px solid #ff4444', padding: '5px 10px', borderRadius: '6px' }}>
            <FcSettings style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Admin
          </Link>
        )}

        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          DÉCONNEXION
        </button>
      </div>
    </nav>
  );
}