import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcHome, FcSearch, FcOrganization, FcLibrary, FcIcons8Cup, FcSettings } from 'react-icons/fc';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentAgent = localStorage.getItem('pseudo') || localStorage.getItem('username');
  const isAuthorizedAdmin = currentAgent === 'Dildi_President';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <span className="navbar-brand">REGISTA</span>
        <span className="badge-beta">BÊTA</span>
      </div>

      {/* Bouton hamburger (visible en mobile uniquement via CSS) */}
      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Liens + actions regroupés (deviennent un menu déroulant en mobile) */}
      <div className={`navbar-collapse ${menuOpen ? 'open' : ''}`}>
        <div className="navbar-links">
          <Link to="/home" className="nav-link" onClick={closeMenu}>
            <FcHome className="nav-link-icon" /> Accueil
          </Link>
          <Link to="/scoutisme" className="nav-link" onClick={closeMenu}>
            <FcSearch className="nav-link-icon" /> Scoutisme
          </Link>
          <Link to="/agence" className="nav-link" onClick={closeMenu}>
            <FcOrganization className="nav-link-icon" /> Agence
          </Link>
          <Link to="/banque" className="nav-link" onClick={closeMenu}>
            <FcLibrary className="nav-link-icon" /> Banque
          </Link>
          <Link to="/classement" className="nav-link" onClick={closeMenu}>
            <FcIcons8Cup className="nav-link-icon" /> Classement
          </Link>
        </div>

        <div className="navbar-actions">
          {isAuthorizedAdmin && (
            <Link to="/admin" className="nav-link nav-link-admin" onClick={closeMenu}>
              <FcSettings className="nav-link-icon" /> Admin
            </Link>
          )}
          <button onClick={() => { handleLogout(); closeMenu(); }} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}