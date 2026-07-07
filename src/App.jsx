import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { subscribeToBalance, subscribeToTransactions } from "./services/bankService";
import { useBank } from "./context/BankContext"; // <-- IMPORTAR HOOK
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import TransferForm from "./components/TransferForm";
import TransactionHistory from "./components/TransactionHistory";

export default function App() {
  const { state, dispatch } = useBank();
  const { user, profile, transactions, initializing } = state;

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

    const unsubscribeBalance = subscribeToBalance(user.uid, (data) => {
      dispatch({ type: "SET_PROFILE", payload: data });
    });

    const unsubscribeTx = subscribeToTransactions(user.uid, (data) => {
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    });

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
      {/* Ya no pasamos props de usuario, los componentes pueden usar el Contexto */}
      <TransferForm />
      <TransactionHistory />
    </Dashboard>
  );
}