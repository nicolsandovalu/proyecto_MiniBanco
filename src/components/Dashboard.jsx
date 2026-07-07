import { logoutUser } from "../services/authService";

export default function Dashboard({ user, profile, children }) {
  const handleLogoutClick = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error al revocar la sesión activa", error);
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
          <span className="balance-account">Cuenta Corriente Digital N° {user.uid.substring(0, 8).toUpperCase()}</span>
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