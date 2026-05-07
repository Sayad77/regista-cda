import './Wallet.css';

// On ajoute 'billets' dans les parenthèses pour le recevoir dynamiquement
function Wallet({ billets }) {
  const rang = "Recrue";

  return (
    <div className="wallet-card">
      <div className="wallet-section">
        <span className="wallet-label">Solde</span>
        {/* On affiche la variable ici */}
        <span className="wallet-value neon-text">{billets} 🎫</span>
      </div>
      
      <div className="wallet-divider"></div>
      
      <div className="wallet-section">
        <span className="wallet-label">Rang Actuel</span>
        <span className="wallet-value">{rang}</span>
      </div>

      <div className="wallet-actions">
        <button className="btn-recharge">+ Recharger</button>
      </div>
    </div>
  );
}

export default Wallet;