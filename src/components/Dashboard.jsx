import { logoutUser } from "../services/authService";

export default function Dashboard({ user, profile, children }) {
  const handleLogoutClick = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>XBank Digital</h1>
          <p>Bienvenido/a, <strong>{user.displayName || profile?.nombre}</strong></p>
        </div>
        <button className="logout-btn" onClick={handleLogoutClick}>
          Cerrar Sesión
        </button>
      </header>

      <section className="balance-card">
        <h3>Saldo Disponible</h3>
        <p className="balance-amount">
          ${profile ? profile.saldo.toLocaleString("es-CL") : "---"}
        </p>
      </section>

      <main className="dashboard-grid">
        {children}
      </main>
    </div>
  );
}