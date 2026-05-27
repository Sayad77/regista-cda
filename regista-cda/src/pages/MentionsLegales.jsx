import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MentionsLegales() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff' }}>
      <Navbar />
      <main style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline', marginBottom: '20px' }}
        >
          ← Retour au QG
        </button>

        <h1 style={{ color: '#d4af37', fontSize: '2.2rem', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
          MENTIONS LÉGALES
        </h1>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>1. Édition du site</h2>
          <p style={textStyle}>
            L'application et le site web <strong>REGISTA</strong> sont édités dans le cadre d'un projet pédagogique pour la certification du titre professionnel "Concepteur Développeur d'Applications" (CDA).
          </p>
          <p style={textStyle}>
            <strong>Directeur de la publication & Développeur :</strong> [Votre Prénom] [Votre Nom]<br />
            <strong>Contact :</strong> [Votre Adresse Email]
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>2. Hébergement</h2>
          <p style={textStyle}>
            Ce site et l'API associée sont configurés via Docker et hébergés de manière sécurisée sur les infrastructures européennes de :
          </p>
          <p style={textStyle}>
            <strong>Hébergeur :</strong> Hetzner Online GmbH<br />
            <strong>Siège social :</strong> Industriestr. 25, 91710 Gunzenhausen, Allemagne<br />
            <strong>Site web :</strong> www.hetzner.com
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>3. Propriété intellectuelle</h2>
          <p style={textStyle}>
            L'architecture technique, le code source du backend (Node.js/Express) et du frontend (React) sont la propriété exclusive de l'éditeur. 
          </p>
          <p style={textStyle}>
            Les noms, statistiques et données des joueurs de football utilisés dans le cadre de ce jeu de simulation proviennent de données publiques ou fictives. Ils sont exploités ici à des fins strictement éducatives, non commerciales et non lucratives.
          </p>
        </section>
      </main>
    </div>
  );
}

const sectionStyle = { marginBottom: '30px', backgroundColor: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #222' };
const titleStyle = { color: '#d4af37', fontSize: '1.2rem', marginTop: 0, marginBottom: '15px', letterSpacing: '1px' };
const textStyle = { color: '#bbb', lineHeight: '1.6', fontSize: '0.95rem', margin: '0 0 10px 0' };