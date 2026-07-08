import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { subscribeToBalance, subscribeToTransactions } from "./services/bankService";
import { useBank } from "./context/BankContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import TransferForm from "./components/TransferForm";
import TransactionHistory from "./components/TransactionHistory";

export default function App() {
  const { state, dispatch } = useBank();
  const { user, initializing, darkMode } = state;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      dispatch({ type: "SET_AUTH", payload: currentUser });
      if (!currentUser) {
        dispatch({ type: "LOGOUT" });
      }
    });
    return () => unsubscribeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    // Apertura de canales directos bidireccionales en tiempo real
    const unsubscribeBalance = subscribeToBalance(user.uid, (data) => {
      dispatch({ type: "SET_PROFILE", payload: data });
    });

    const unsubscribeTx = subscribeToTransactions(user.uid, (data) => {
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    });

    // Limpieza imperativa de la rúbrica para evitar fugas de memoria
    return () => {
      unsubscribeBalance();
      unsubscribeTx();
    };
  }, [user, dispatch]);

  if (initializing) {
    return (
      <div className="screen-loader">
        <div className="loader-spinner"></div>
        <p>Estableciendo Conexión Segura NamiBank...</p>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <Dashboard>
      <TransferForm />
      <TransactionHistory />
    </Dashboard>
  );
}