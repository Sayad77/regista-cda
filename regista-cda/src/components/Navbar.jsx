import { Link, useNavigate } from 'react-router-dom';
import { FcHome, FcSearch, FcOrganization, FcLibrary, FcIcons8Cup, FcSettings } from 'react-icons/fc';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const currentAgent = localStorage.getItem('pseudo') || localStorage.getItem('username');
  const isAuthorizedAdmin = currentAgent === 'Dildi_President';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <span className="navbar-brand">REGISTA</span>
        <span className="badge-beta">BÊTA</span>
      </div>

      {/* Liens centrés */}
      <div className="navbar-links">
        <Link to="/home" className="nav-link">
          <FcHome className="nav-link-icon" /> Accueil
        </Link>
        <Link to="/scoutisme" className="nav-link">
          <FcSearch className="nav-link-icon" /> Scoutisme
        </Link>
        <Link to="/agence" className="nav-link">
          <FcOrganization className="nav-link-icon" /> Agence
        </Link>
        <Link to="/banque" className="nav-link">
          <FcLibrary className="nav-link-icon" /> Banque
        </Link>
        <Link to="/classement" className="nav-link">
          <FcIcons8Cup className="nav-link-icon" /> Classement
        </Link>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {isAuthorizedAdmin && (
          <Link to="/admin" className="nav-link nav-link-admin">
            <FcSettings className="nav-link-icon" /> Admin
          </Link>
        )}
        <button onClick={handleLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
