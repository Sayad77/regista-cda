import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import BankVault from './pages/BankVault' 
import Navbar from './components/Navbar'
import Agency from './pages/Agency'
import Leaderboard from './pages/Leaderboard'
import Home from './pages/Home' 
import Scoutisme from './pages/Scoutisme';

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

  const saveProgressToServer = async (username, currentSolde, collection) => {
    setSyncStatus('syncing');
    try {
      await fetch('http://localhost:4000/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username || "Joueur_Test",
          solde: currentSolde,
          cardsCount: collection.length
        }),
      });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) { setSyncStatus('error'); }
  };

  useEffect(() => {
    localStorage.setItem('regista_solde', JSON.stringify(solde));
    localStorage.setItem('regista_collection', JSON.stringify(myCollection));
    const storedUser = localStorage.getItem('username') || "Joueur_Test";
    saveProgressToServer(storedUser, solde, myCollection);
  }, [solde, myCollection]);

  const addTransaction = (motif, montant) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setTransactions(prev => [{ time, motif, montant, type: montant > 0 ? 'REVENU' : 'DÉPENSE' }, ...prev]);
  };

  // 🛠️ MODIFICATION ICI : Sécurité Anti-NaN et appel au backend ACID
  const handleSellPlayer = (playerId) => {
    const playerToSell = myCollection.find(p => p.id === playerId);
    
    if (playerToSell) {
      const coefs = { 'S': 1.2, 'A': 0.8, 'B': 0.6, 'C': 0.4, 'D': 0.2 };
      
      // 🛡️ SÉCURITÉ ANTI-NaN : Récupère les valeurs qu'elles soient sous l'ancien ou le nouveau nom
      const safePrice = playerToSell.price || playerToSell.base_value || 10000;
      const safeRank = playerToSell.rank || playerToSell.tier || 'C';
      const safeName = playerToSell.name || "Légende Inconnue";
      
      const sellPrice = Math.floor(safePrice * (coefs[safeRank] || 0.5));
      
      // 1. Mise à jour de l'affichage Front-end
      setSolde(prev => prev + sellPrice);
      addTransaction(`Revente ${safeName}`, sellPrice);
      setMyCollection(prev => prev.filter(p => p.id !== playerId));

      // 2. 🚀 APPEL AU BACKEND : On lance la transaction sécurisée (ACID) !
      const storedUser = localStorage.getItem('username') || "Joueur_Test";
      fetch('http://localhost:4000/api/market/sell', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: storedUser, cardId: playerId, price: sellPrice })
      }).catch(err => console.error("Erreur Vente Backend:", err));

      // 3. On retourne les infos propres pour le ticket de caisse de l'Agence
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

  // 🛠️ MODIFICATION ICI : Mapping parfait pour s'assurer que les stats sont lisibles
  const handleWinCard = (playerName, teamName, achievedRank, basePrice, fullCardData) => {
    const newCard = {
      id: fullCardData.id || Date.now(), 
      name: fullCardData.name || playerName,
      team: "Légende", // On force "Légende" au lieu du club de la grille
      rank: fullCardData.tier || fullCardData.rank || achievedRank,
      price: fullCardData.base_value || fullCardData.price || basePrice,
      flag: fullCardData.flag,
      stats: fullCardData.stats || {
        wc: fullCardData.wc_won || 0,
        ucl: fullCardData.ucl_won || 0,
        league: fullCardData.league_won || 0,
        cup: fullCardData.cup_won || 0
      }
    };
    setMyCollection(prev => [newCard, ...prev]);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/agency" element={<Agency myCollection={myCollection} onSellPlayer={handleSellPlayer} />} />
        <Route path="/bank" element={<BankVault solde={solde} transactions={transactions} myCollection={myCollection} />} />
        <Route path="/game" element={<Scoutisme solde={solde} onBuyHint={handleBuyHint} onWinCard={handleWinCard} />} />
      </Routes>

      <div className={`sync-indicator ${syncStatus}`}>
        {syncStatus === 'syncing' && "⏳ Synchronisation..."}
        {syncStatus === 'success' && "✅ Données sécurisées"}
        {syncStatus === 'error' && "⚠️ Erreur serveur"}
      </div>
    </>
  );
}

export default App;