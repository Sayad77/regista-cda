import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="app-container">
      <Navbar />
      <main style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <h1 style={{ color: '#d4af37', fontSize: '2.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '3px' }}>
          L'Académie Regista
        </h1>

        <div style={{ 
          background: '#1a1a1c', border: '1px solid #333', borderRadius: '12px', 
          padding: '40px', maxWidth: '800px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <ul style={{ color: '#ccc', fontSize: '1.2rem', lineHeight: '1.8', listStyleType: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'white' }}>• LE BUT :</strong> Détectez le nom des joueurs pour gagner leur <strong style={{ color: '#00ffcc' }}>Carte ADN</strong>.
            </li>
            <li style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'white' }}>• LE GRADE :</strong> Moins vous faites d'erreurs et utilisez d'indices, plus la qualité de votre carte sera élevée (Rang S, A, B, C, D).
            </li>
            <li style={{ marginBottom: '20px' }}>
              <strong style={{ color: 'white' }}>• L'AGENCE ONAIRTECH 🏢 :</strong> Vous n'avez plus de billets ? Revendez vos cartes à l'Agence. Une carte Rang S vaut très cher !
            </li>
            <li>
              <strong style={{ color: 'white' }}>• LA BANQUE 🏦 :</strong> Consultez votre historique de transactions et admirez les cartes stockées dans votre coffre-fort.
            </li>
          </ul>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/game" style={{ 
              display: 'inline-block', background: 'linear-gradient(45deg, #d4af37, #f0c641)', 
              color: '#000', padding: '15px 40px', borderRadius: '8px', fontSize: '1.3rem', 
              fontWeight: 'bold', textDecoration: 'none', textTransform: 'uppercase'
            }}>
              J'ai compris, Jouer
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Home;