import { useState } from "react";
import { logoutUser } from "../services/authService";
import { simulateTransaction } from "../services/bankService";
import { useBank } from "../context/BankContext";

// Ilustración vectorial personalizada de Nami basada en su foto real
function NamiLogo({ size = 44 }) {
  return (
    <svg 
      className="nami-logo-svg" 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, marginRight: "12px" }}
    >
      {/* Fondo circular suave para realzar la figura */}
      <circle cx="50" cy="50" r="46" fill="var(--nami-bg-circle)" stroke="var(--bank-accent)" strokeWidth="2.5" />
      
      {/* Orejas caídas y peludas (Carbón Oscuro / Grafito) */}
      <path d="M22 38C14 42 10 56 16 68C20 76 26 74 28 64C30 54 28 42 22 38Z" fill="var(--nami-fur-dark)" />
      <path d="M78 38C86 42 90 56 84 68C80 76 74 74 72 64C70 54 72 42 78 38Z" fill="var(--nami-fur-dark)" />
      
      {/* Contorno de la Cabeza Peluda (Textura ondulada como en la foto) */}
      <path d="M30 36C32 24 68 24 70 36C75 44 76 64 66 74C56 84 44 84 34 74C24 64 25 44 30 36Z" fill="var(--nami-fur-main)" stroke="var(--nami-fur-dark)" strokeWidth="2" />
      
      {/* Flequillo / Pelo en la frente */}
      <path d="M38 28Q50 34 62 28Q56 22 50 24Q44 22 38 28Z" fill="var(--nami-fur-dark)" />
      
      {/* Hocico y Barba peluda */}
      <path d="M36 58C36 50 64 50 64 58C66 68 58 78 50 78C42 78 34 68 36 58Z" fill="var(--nami-muzzle)" />
      
      {/* Ojos expresivos y tiernos con brillo blanco */}
      <circle cx="41" cy="46" r="4.5" fill="#1C1917" />
      <circle cx="59" cy="46" r="4.5" fill="#1C1917" />
      <circle cx="42.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      <circle cx="60.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      <path d="M37 41Q41 39 45 41" stroke="var(--nami-fur-dark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 41Q59 39 63 41" stroke="var(--nami-fur-dark)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Nariz negra prominente con reflejo de luz */}
      <path d="M44 55H56L50 61L44 55Z" fill="#0F172A" />
      <circle cx="47" cy="56.5" r="1" fill="#FFFFFF" opacity="0.8" />
      
      {/* Sonrisa simpática bajo el hocico */}
      <path d="M47 64Q50 67 53 64" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Collar esmeralda con placucha dorada */}
      <path d="M35 78Q50 86 65 78" stroke="var(--bank-accent)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="82" r="3.5" fill="#F59E0B" />
    </svg>
  );
}

// Icono de Sol Animado (Rayos giratorios y núcleo resplandeciente)
function AnimatedSun() {
  return (
    <svg className="sun-icon-animated" viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="sun-core" cx="12" cy="12" r="5" fill="#F59E0B" />
      <g className="sun-rays" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

// Icono de Luna Creciente Animada (Balanceo suave con estrellas destellantes)
function AnimatedMoon() {
  return (
    <svg className="moon-icon-animated" viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path className="moon-crescent" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#38BDF8" stroke="#38BDF8" strokeWidth="1.5" strokeLinejoin="round" />
      <circle className="moon-star star-1" cx="19" cy="5" r="1.5" fill="#FDE047" />
      <circle className="moon-star star-2" cx="15" cy="3" r="1" fill="#FDE047" />
    </svg>
  );
}

export default function Dashboard({ children }) {
  const { state, dispatch } = useBank();
  const { user, profile, darkMode } = state;
  const [simLoading, setSimLoading] = useState(false);

  const handleLogoutClick = async () => {
    await logoutUser();
  };

  const handleToggleTheme = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  const handleSimulation = async (amount) => {
    setSimLoading(true);
    try {
      await simulateTransaction(user.uid, amount);
    } catch (error) {
      alert(error.message);
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="bank-layout">
      <header className="bank-navbar">
        <div className="navbar-brand" style={{ display: "flex", alignItems: "center" }}>
          <NamiLogo size={46} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ lineHeight: 1 }}>NamiBank</h1>
            <span className="subtitle-brand">Banca Fintech</span>
          </div>
          <span className="badge-corporate">Cuenta Pro</span>
        </div>
        <div className="navbar-user">
          <p className="user-greeting">Hola, <strong>{user.displayName || profile?.nombre}</strong></p>
          
          {/* Botón Redondo Animado Sol/Luna */}
          <button 
            className={`btn-theme-icon ${darkMode ? 'dark-active' : 'light-active'}`} 
            onClick={handleToggleTheme} 
            aria-label="Alternar modo visual"
            title="Alternar Tema"
          >
            {darkMode ? <AnimatedMoon /> : <AnimatedSun />}
          </button>

          <button className="btn-logout" onClick={handleLogoutClick}>Cerrar Sesión</button>
        </div>
      </header>

      <div className="bank-hero">
        <div className="balance-card">
          <span className="balance-label">Saldo Disponible Total</span>
          <h2 className="balance-value">
            ${profile ? profile.saldo.toLocaleString("es-CL") : "---"}
          </h2>
          <div className="balance-actions-row">
            <span className="balance-account">Cuenta N° {user.uid.substring(0, 8).toUpperCase()}</span>
            
            <div className="action-buttons-group">
              <button 
                onClick={() => handleSimulation(-10000)} 
                disabled={simLoading || profile?.saldo < 10000}
                className="btn-sim btn-pill-outline"
              >
                Retirar $10.000
              </button>
              
              <button 
                onClick={() => handleSimulation(10000)} 
                disabled={simLoading}
                className="btn-sim btn-pill-filled"
              >
                + Abonar $10.000
              </button>
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