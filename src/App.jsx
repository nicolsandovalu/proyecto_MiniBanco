import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { subscribeToUserBalance, subscribeToTransactions } from "./services/bankService";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import TransferForm from "./components/TransferForm";
import TransactionHistory from "./components/TransactionHistory";

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // 1. Efecto para controlar la persistencia de autenticación de Firebase
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setTransactions([]);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth(); // Cleanup de autenticación
  }, []);

  // 2. Efecto para la sincronización reactiva de datos del cliente
  useEffect(() => {
    if (!user) return;

    // Suscripción al Perfil/Saldo
    const unsubscribeBalance = subscribeToUserBalance(user.uid, (data) => {
      setProfile(data);
    });

    // Suscripción al Historial de Transacciones
    const unsubscribeTx = subscribeToTransactions(user.uid, (data) => {
      setTransactions(data);
    });

    // Limpieza estricta de listeners de Firestore al mutar estado o logout
    return () => {
      unsubscribeBalance();
      unsubscribeTx();
    };
  }, [user]);

  if (loadingAuth) {
    return <div className="loading-viewport">Cargando aplicación...</div>;
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
        userEmail={user.email} 
      />
    </Dashboard>
  );
}