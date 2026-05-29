import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' 
import './App.css'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import BankVault from './pages/BankVault' 
import Agency from './pages/Agency'
import Leaderboard from './pages/Leaderboard'
import Home from './pages/Home' 
import Scoutisme from './pages/Scoutisme';
import CookieBanner from './components/CookieBanner';
import Confidentialite from './pages/Confidentialite';
import AdminDashboard from './pages/AdminDashboard';

// 🛡️ PARE-FEU CENTRAL DE L'AGENCE (Route Guard)
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
}

function App() {
  const [solde, setSolde] = useState(() => {
    try {
      const saved = localStorage.getItem('regista_solde');
      return saved !== null ? JSON.parse(saved) : 10000;
    } catch (e) { return 10000; }
  });

  const [myCollection, setMyCollection] = useState(() => {
    try {
      const saved = localStorage.getItem('regista_collection');
      return saved !== null ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [transactions, setTransactions] = useState([]); 
  const [syncStatus, setSyncStatus] = useState('idle');

  // ... (Le reste de vos fonctions saveProgressToServer, handleSellPlayer, etc. ne change pas)

  const addTransaction = (motif, montant) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setTransactions(prev => [{ time, motif, montant, type: montant > 0 ? 'REVENU' : 'DÉPENSE' }, ...prev]);
  };

  const handleSellPlayer = (playerId) => {
    const playerToSell = myCollection.find(p => p.id === playerId);
    if (playerToSell) {
      const coefs = { 'S': 1.2, 'A': 0.8, 'B': 0.6, 'C': 0.4, 'D': 0.2 };
      const safePrice = playerToSell.price || playerToSell.base_value || 10000;
      const safeRank = playerToSell.rank || playerToSell.tier || 'C';
      const safeName = playerToSell.name || "Légende Inconnue";
      const sellPrice = Math.floor(safePrice * (coefs[safeRank] || 0.5));
      
      setSolde(prev => prev + sellPrice);
      addTransaction(`Revente ${safeName}`, sellPrice);
      setMyCollection(prev => prev.filter(p => p.id !== playerId));

      const storedUser = localStorage.getItem('pseudo') || "Joueur_Test";
      fetch('http://localhost:4000/api/market/sell', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: storedUser, cardId: playerId, price: sellPrice })
      }).catch(err => console.error("Erreur Vente Backend:", err));

      return { name: safeName, rank: safeRank, price: sellPrice, date: new Date().toLocaleTimeString() };
    }
    return null;
  };

  const handleBuyHint = (cost, motif) => {
    if (solde >= cost) {
      setSolde(prev => prev - cost);
      addTransaction(motif, -cost); 
      return true; 
    }
    return false; 
  };

  const handleWinCard = (playerName, teamName, achievedRank, basePrice, fullCardData) => {
    const actualCard = fullCardData.card || fullCardData.carteTiree || fullCardData;
    const newCard = {
      id: actualCard.id || Date.now(), 
      name: actualCard.name || playerName || "Légende Inconnue",
      team: "Légende",
      rank: actualCard.tier || actualCard.rank || achievedRank,
      price: actualCard.price || actualCard.base_value || basePrice || 0,
      flag: actualCard.flag,
      stats: actualCard.stats || { wc: 0, ucl: 0, league: 0, cup: 0 }
    };
    setMyCollection(prev => [newCard, ...prev]);
  };

  return (
    <>
      <CookieBanner />

      {/* ⚠️ LA NAVBAR GLOBALE A ÉTÉ SUPPRIMÉE ICI POUR ÉVITER LES DOUBLONS */}

      <Routes>
        {/* 🔓 Routes Publiques (SANS NAVBAR) */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* 🔐 Routes Privées Protégées par le Pare-feu */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/scoutisme" element={<PrivateRoute><Scoutisme solde={solde} onBuyHint={handleBuyHint} onWinCard={handleWinCard} /></PrivateRoute>} />
        <Route path="/agence" element={<PrivateRoute><Agency myCollection={myCollection} onSellPlayer={handleSellPlayer} /></PrivateRoute>} />
        <Route path="/banque" element={<PrivateRoute><BankVault solde={solde} transactions={transactions} myCollection={myCollection} /></PrivateRoute>} />
        <Route path="/classement" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/confidentialite" element={<PrivateRoute><Confidentialite /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;