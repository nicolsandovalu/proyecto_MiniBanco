import { useState } from "react";
import { logoutUser } from "../services/authService";
import { simulateTransaction } from "../services/bankService";
import { useBank } from "../context/BankContext"; // <-- Usar contexto global

export default function Dashboard({ children }) {
  const { state } = useBank();
  const { user, profile } = state;
  const [simLoading, setSimLoading] = useState(false);

  const handleLogoutClick = async () => {
    await logoutUser();
  };

  const handleSimulation = async (amount) => {
    setSimLoading(true);
    try {
      await simulateTransaction(user.uid, amount);
    } catch (error) {
      alert(error.message); // Feedback básico de error
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="bank-layout">
      <header className="bank-navbar">
        <div className="navbar-brand">
          <h1>NamiBank</h1>
          <span className="badge-corporate">Banca Personas</span>
        </div>
        <div className="navbar-user">
          <p>Hola, <strong>{user.displayName || profile?.nombre}</strong></p>
          <button className="btn-logout" onClick={handleLogoutClick}>Cerrar Sesión</button>
        </div>
      </header>

      <div className="bank-hero">
        <div className="balance-card">
          <span className="balance-label">Saldo Disponible Total</span>
          <h2 className="balance-value">
            ${profile ? profile.saldo.toLocaleString("es-CL") : "---"}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="balance-account">Cuenta N° {user.uid.substring(0, 8).toUpperCase()}</span>
            
            {/* Botones de simulación (Bonus) */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => handleSimulation(-10000)} 
                disabled={simLoading || profile?.saldo < 10000}
                style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer' }}
              >Retirar $10.000</button>
              
              <button 
                onClick={() => handleSimulation(10000)} 
                disabled={simLoading}
                style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >Abonar $10.000</button>
            </div>
          </div>
        </div>
      </div>

      <main className="bank-container">
        <div className="bank-grid">
          {children}
        </div>
      </main>
    </div>
  );
}