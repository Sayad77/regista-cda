import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Confidentialite() {
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
          POLITIQUE DE CONFIDENTIALITÉ (RGPD)
        </h1>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>1. Principes généraux</h2>
          <p style={textStyle}>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et aux directives de la CNIL, l'Agence REGISTA s'engage à protéger la vie privée de ses utilisateurs. Ce document détaille la transparence absolue de nos traitements.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>2. Données collectées & Finalités</h2>
          <p style={textStyle}>Nous collectons uniquement les données strictement nécessaires à l'expérience de jeu :</p>
          <ul style={{ color: '#bbb', paddingLeft: '20px', lineHeight: '1.6', fontSize: '0.95rem' }}>
            <li><strong>Pseudonyme & Email :</strong> Pour identifier l'agent et associer son compte.</li>
            <li><strong>Mot de passe :</strong> Haché de manière irréversible via l'algorithme <strong>Bcrypt</strong> côté serveur (l'administrateur n'a aucun moyen de connaître votre mot de passe).</li>
            <li><strong>Données de progression :</strong> Solde de tickets (🎫), historique des transferts et contenu du coffre-fort.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>3. Sécurité et Intégrité (Transactions ACID)</h2>
          <p style={textStyle}>
            Les données sont stockées dans une base de données MySQL. Pour garantir qu'aucune donnée financière ou carte ne soit corrompue en cours de route (notamment lors de la revente à la Marketplace), le backend applique des <strong>transactions ACID (Atomicité, Cohérence, Isolation, Durabilité)</strong> rigoureuses.
          </p>
          <p style={textStyle}>
            Les sessions sont sécurisées par un jeton <strong>JWT (JSON Web Token)</strong> éphémère stocké dans le stockage local de votre navigateur. Aucun traceur publicitaire tiers n'est implanté.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>4. Durée de conservation & Droit à l'oubli</h2>
          <p style={textStyle}>
            Vos informations sont conservées tant que votre compte reste actif. Conformément à la loi, vous disposez d'un droit de suppression totale. 
          </p>
          <p style={textStyle} style={{ color: '#ff4444', fontWeight: 'bold' }}>
            ⚠️ Vous pouvez actionner la destruction définitive de votre compte et de l'ensemble de votre coffre-fort depuis votre espace Paramètres.
          </p>
        </section>
      </main>
    </div>
  );
}

const sectionStyle = { marginBottom: '30px', backgroundColor: '#111', padding: '20px', borderRadius: '8px', border: '1px solid #222' };
const titleStyle = { color: '#d4af37', fontSize: '1.2rem', marginTop: 0, marginBottom: '15px', letterSpacing: '1px' };
const textStyle = { color: '#bbb', lineHeight: '1.6', fontSize: '0.95rem', margin: '0 0 10px 0' };