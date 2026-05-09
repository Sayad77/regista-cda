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

  const handleSellPlayer = (playerId) => {
    const playerToSell = myCollection.find(p => p.id === playerId);
    if (playerToSell) {
      const coefs = { 'S': 1.2, 'A': 0.8, 'B': 0.6, 'C': 0.4 };
      const sellPrice = Math.floor(playerToSell.price * (coefs[playerToSell.rank] || 0.5));
      setSolde(prev => prev + sellPrice);
      addTransaction(`Revente ${playerToSell.name}`, sellPrice);
      setMyCollection(prev => prev.filter(p => p.id !== playerId));
      return { name: playerToSell.name, price: sellPrice, date: new Date().toLocaleTimeString() };
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
    const newCard = {
      id: Date.now(), 
      name: playerName,
      team: teamName,
      rank: achievedRank,
      price: basePrice,
      flag: fullCardData.flag,
      stats: {
        wc: fullCardData.wc_won,
        ucl: fullCardData.ucl_won,
        league: fullCardData.league_won,
        cup: fullCardData.cup_won
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