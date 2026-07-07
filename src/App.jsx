import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { subscribeToBalance, subscribeToTransactions } from "./services/bankService";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import TransferForm from "./components/TransferForm";
import TransactionHistory from "./components/TransactionHistory";

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setTransactions([]);
      }
      setInitializing(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeBalance = subscribeToBalance(user.uid, (data) => {
      setProfile(data);
    });

    const unsubscribeTx = subscribeToTransactions(user.uid, (data) => {
      setTransactions(data);
    });

    return () => {
      unsubscribeBalance();
      unsubscribeTx();
    };
  }, [user]);

  if (initializing) {
    return (
      <div className="screen-loader">
        <div className="loader-spinner"></div>
        <p>Estableciendo Conexión Segura NamiBank...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Dashboard user={user} profile={profile}>
      <TransferForm 
        senderUid={user.uid} 
        currentBalance={profile ? profile.saldo : 0} 
      />
      <TransactionHistory 
        transactions={transactions} 
        userUid={user.uid} 
      />
    </Dashboard>
  );
}