import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [step, setStep] = useState(1); 
    const [form, setForm] = useState({ email: '', pseudo: '', newPassword: '' });
    
    // Nouveaux états pour remplacer les bulles (alerts)
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        setErrorMsg(''); // On efface les anciennes erreurs
        setSuccessMsg('');

        try {
            const res = await fetch('http://localhost:4000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, pseudo: form.pseudo })
            });
            const data = await res.json();
            
            if (res.ok || data.success) {
                setStep(2);
                setSuccessMsg(data.message || "Identité confirmée. Veuillez créer un nouveau mot de passe.");
            } else {
                // Remplacment de l'alerte par un beau message d'erreur
                setErrorMsg(data.message || data.error || "Données incorrectes. Échec de l'identification.");
            }
        } catch (error) {
            setErrorMsg("Erreur de liaison satellite avec le serveur.");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const res = await fetch('http://localhost:4000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            
            if (res.ok || data.success) {
                setSuccessMsg("✅ Sécurité mise à jour ! Redirection...");
                // On attend 2 secondes pour que l'utilisateur lise le message, puis on le redirige
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setErrorMsg(data.message || data.error || "Erreur lors de la réinitialisation.");
            }
        } catch (error) {
            setErrorMsg("Erreur de liaison lors de la mise à jour.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'sans-serif' }}>
            <div style={{ padding: '2.5rem', border: '1px solid #00D1B2', borderRadius: '15px', background: '#111', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0, 209, 178, 0.1)' }}>
                <h2 style={{ color: '#00D1B2', textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '2px' }}>RÉCUPÉRATION</h2>
                
                {step === 1 ? (
                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input 
                            type="email" 
                            placeholder="EMAIL D'ENREGISTREMENT" 
                            required 
                            style={inputStyle}
                            onChange={(e) => setForm({...form, email: e.target.value})} 
                        />
                        <input 
                            type="text" 
                            placeholder="PSEUDO D'AGENT" 
                            required 
                            style={inputStyle}
                            onChange={(e) => setForm({...form, pseudo: e.target.value})} 
                        />
                        
                        {/* AFFICHAGE DE L'ERREUR ÉTAPE 1 */}
                        {errorMsg && <p style={errorStyle}>{errorMsg}</p>}
                        
                        <button type="submit" style={btnStyle}>
                            VÉRIFIER IDENTITÉ
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* AFFICHAGE DU SUCCÈS ÉTAPE 1 */}
                        {successMsg && <p style={successStyle}>{successMsg}</p>}
                        
                        <input 
                            type="password" 
                            placeholder="NOUVEAU MOT DE PASSE" 
                            required 
                            style={inputStyle}
                            onChange={(e) => setForm({...form, newPassword: e.target.value})} 
                        />

                        {/* AFFICHAGE DE L'ERREUR ÉTAPE 2 */}
                        {errorMsg && <p style={errorStyle}>{errorMsg}</p>}

                        <button type="submit" style={btnStyle}>
                            METTRE À JOUR
                        </button>
                    </form>
                )}
                
                <button 
                    onClick={() => navigate('/')} 
                    style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', width: '100%', textDecoration: 'underline' }}
                >
                    RETOUR À LA CONNEXION
                </button>
            </div>
        </div>
    );
}

// Objets de style pour un code plus propre
const inputStyle = {
    padding: '15px', 
    background: '#000', 
    border: '1px solid #333', 
    color: 'white', 
    borderRadius: '8px',
    textAlign: 'center',
    letterSpacing: '1px'
};

const btnStyle = {
    padding: '15px', 
    background: '#00D1B2', 
    color: 'black',
    border: 'none', 
    borderRadius: '8px',
    fontWeight: '900', 
    cursor: 'pointer',
    marginTop: '10px'
};

const errorStyle = {
    color: '#ff4444', 
    fontSize: '0.9rem', 
    textAlign: 'center', 
    margin: '0',
    fontWeight: 'bold'
};

const successStyle = {
    color: '#00D1B2', 
    fontSize: '0.9rem', 
    textAlign: 'center', 
    margin: '0 0 10px 0',
    fontWeight: 'bold'
};

export default ForgotPassword;