import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [step, setStep] = useState(1); 
    const [form, setForm] = useState({ email: '', pseudo: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://test-regista.onairtech.fr/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, pseudo: form.pseudo })
            });
            const data = await res.json();
            if (data.success) {
                setStep(2);
                setMessage(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Erreur de liaison satellite.");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://test-regista.onairtech.fr/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                alert("Sécurité mise à jour !");
                navigate('/');
            }
        } catch (error) {
            alert("Erreur lors de la réinitialisation.");
        }
    };

    return (
        <div className="login-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0a' }}>
            <div className="login-box" style={{ padding: '2rem', border: '1px solid #00ffcc', borderRadius: '8px', background: '#111', width: '320px' }}>
                <h2 className="section-title" style={{ color: '#00ffcc', textAlign: 'center', marginBottom: '1.5rem' }}>RÉCUPÉRATION</h2>
                
                {step === 1 ? (
                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input 
                            type="email" 
                            placeholder="Email d'enregistrement" 
                            required 
                            style={{ padding: '12px', background: '#222', border: '1px solid #333', color: 'white' }}
                            onChange={(e) => setForm({...form, email: e.target.value})} 
                        />
                        <input 
                            type="text" 
                            placeholder="Pseudo d'agent" 
                            required 
                            style={{ padding: '12px', background: '#222', border: '1px solid #333', color: 'white' }}
                            onChange={(e) => setForm({...form, pseudo: e.target.value})} 
                        />
                        <button type="submit" className="btn-submit" style={{ padding: '12px', background: '#00ffcc', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                            VÉRIFIER IDENTITÉ
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ color: '#00ffcc', fontSize: '0.9rem' }}>{message}</p>
                        <input 
                            type="password" 
                            placeholder="Nouveau mot de passe" 
                            required 
                            style={{ padding: '12px', background: '#222', border: '1px solid #333', color: 'white' }}
                            onChange={(e) => setForm({...form, newPassword: e.target.value})} 
                        />
                        <button type="submit" className="btn-submit" style={{ padding: '12px', background: '#00ffcc', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                            METTRE À JOUR
                        </button>
                    </form>
                )}
                
                <button 
                    onClick={() => navigate('/')} 
                    style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', width: '100%' }}
                >
                    RETOUR
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;