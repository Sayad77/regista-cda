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

        <h1 style={{ color: '#d4af37', fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
          Mentions Légales & Confidentialité (RGPD)
        </h1>

        {/* 🏛️ FUSION : Ajout des Mentions Légales obligatoires */}
        <section style={sectionStyle}>
          <h2 style={titleStyle}>1. Mentions Légales</h2>
          <p style={textStyle}>
            <strong>Éditeur du site :</strong> L'Académie REGISTA – Projet de certification CDA par OnAirTech.
          </p>
          <p style={textStyle}>
            <strong>Hébergement :</strong> L'application et sa base de données sont conteneurisées et hébergées sur les infrastructures de Hetzner Online GmbH (Industriestr. 25, 91710 Gunzenhausen, Allemagne).
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>2. Principes généraux & CNIL</h2>
          <p style={textStyle}>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et aux directives de la CNIL, l'Agence REGISTA s'engage à protéger la vie privée de ses utilisateurs. Ce document détaille la transparence absolue de nos traitements.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>3. Données collectées & Finalités</h2>
          <p style={textStyle}>Nous collectons uniquement les données strictement nécessaires à l'expérience de jeu :</p>
          <ul style={{ color: '#bbb', paddingLeft: '20px', lineHeight: '1.6', fontSize: '0.95rem' }}>
            <li><strong>Pseudonyme & Email :</strong> Pour identifier l'agent et associer son compte.</li>
            {/*  FIX SÉCURITÉ : Suppression du mot "Bcrypt" */}
            <li><strong>Mot de passe :</strong> Protégé de manière irréversible via un hachage cryptographique fort côté serveur (l'administrateur n'a aucun moyen de connaître votre mot de passe).</li>
            <li><strong>Données de progression :</strong> Solde de tickets (🎫), historique des transferts et contenu du coffre-fort.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>4. Sécurité et Intégrité (Transactions ACID)</h2>
          <p style={textStyle}>
            Les données sont stockées dans une base de données MySQL. Pour garantir qu'aucune donnée financière ou carte ne soit corrompue en cours de route (notamment lors de la revente à la Marketplace), le backend applique des <strong>transactions ACID (Atomicité, Cohérence, Isolation, Durabilité)</strong> rigoureuses.
          </p>
          <p style={textStyle}>
            Les sessions sont sécurisées par un jeton <strong>JWT (JSON Web Token)</strong> éphémère stocké dans le stockage local de votre navigateur. Aucun traceur publicitaire tiers n'est implanté, l'usage étant strictement limité aux nécessités techniques du service (Exemption CNIL).
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={titleStyle}>5. Durée de conservation & Droit à l'oubli</h2>
          <p style={textStyle}>
            Vos informations sont conservées tant que votre compte reste actif. Conformément à l'article 17 du RGPD, vous disposez d'un droit de suppression totale. 
          </p>
          <p style={{ color: '#ff4444', fontWeight: 'bold', margin: 0, fontSize: '0.95rem' }}>
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