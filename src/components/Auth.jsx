import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { useBank } from "../context/BankContext";

function NamiLogo({ size = 80 }) {
  return (
    <svg 
      className="nami-logo-svg auth-logo" 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginBottom: "16px" }}
    >
      <circle cx="50" cy="50" r="46" fill="var(--nami-bg-circle)" stroke="var(--bank-accent)" strokeWidth="2.5" />
      <path d="M22 38C14 42 10 56 16 68C20 76 26 74 28 64C30 54 28 42 22 38Z" fill="var(--nami-fur-dark)" />
      <path d="M78 38C86 42 90 56 84 68C80 76 74 74 72 64C70 54 72 42 78 38Z" fill="var(--nami-fur-dark)" />
      <path d="M30 36C32 24 68 24 70 36C75 44 76 64 66 74C56 84 44 84 34 74C24 64 25 44 30 36Z" fill="var(--nami-fur-main)" stroke="var(--nami-fur-dark)" strokeWidth="2" />
      <path d="M38 28Q50 34 62 28Q56 22 50 24Q44 22 38 28Z" fill="var(--nami-fur-dark)" />
      <path d="M36 58C36 50 64 50 64 58C66 68 58 78 50 78C42 78 34 68 36 58Z" fill="var(--nami-muzzle)" />
      <circle cx="41" cy="46" r="4.5" fill="#1C1917" />
      <circle cx="59" cy="46" r="4.5" fill="#1C1917" />
      <circle cx="42.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      <circle cx="60.5" cy="44.5" r="1.5" fill="#FFFFFF" />
      <path d="M37 41Q41 39 45 41" stroke="var(--nami-fur-dark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M55 41Q59 39 63 41" stroke="var(--nami-fur-dark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 55H56L50 61L44 55Z" fill="#0F172A" />
      <circle cx="47" cy="56.5" r="1" fill="#FFFFFF" opacity="0.8" />
      <path d="M47 64Q50 67 53 64" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M35 78Q50 86 65 78" stroke="var(--bank-accent)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="82" r="3.5" fill="#F59E0B" />
    </svg>
  );
}

function AnimatedSun() {
  return (
    <svg className="sun-icon-animated" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle className="sun-core" cx="12" cy="12" r="5" fill="#F59E0B" />
      <g className="sun-rays" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

function AnimatedMoon() {
  return (
    <svg className="moon-icon-animated" viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path className="moon-crescent" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#38BDF8" stroke="#38BDF8" strokeWidth="1.5" strokeLinejoin="round" />
      <circle className="moon-star star-1" cx="19" cy="5" r="1.5" fill="#FDE047" /><circle className="moon-star star-2" cx="15" cy="3" r="1" fill="#FDE047" />
    </svg>
  );
}

export default function Auth() {
  const { state, dispatch } = useBank();
  const { darkMode } = state;
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

  const handleToggleTheme = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password || (isRegister && !name)) {
      setError("Todos los campos marcados son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(email, password, name);
      } else {
        await loginUser(email, password);
      }
    } catch (err) {
      setError("Error de autenticación. Verifique sus credenciales o el estado de su red.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <button className="btn-theme-icon auth-theme-btn" onClick={handleToggleTheme} title="Alternar Modo Visual">
        {darkMode ? <AnimatedMoon /> : <AnimatedSun />}
      </button>
      
      <div className="auth-brand">
        <NamiLogo size={86} />
        <h2>NamiBank</h2>
        <p>Banca Digital de Confianza</p>
      </div>
      
      <div className="auth-card">
        <h3>{isRegister ? "Crear Cuenta Pro" : "Acceso Clientes"}</h3>
        {error && <div className="feedback-banner error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" value={name} onChange={handleNameChange} disabled={loading} placeholder="Ej. Juan Pérez" />
            </div>
          )}
          <div className="form-group">
            <label>Rut o Correo Electrónico</label>
            <input type="email" value={email} onChange={handleEmailChange} disabled={loading} placeholder="usuario@namibank.cl" />
          </div>
          <div className="form-group">
            <label>Contraseña Bancaria</label>
            <input type="password" value={password} onChange={handlePasswordChange} disabled={loading} placeholder="••••••" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verificando..." : isRegister ? "Registrar Cuenta" : "Ingresar Seguro"}
          </button>
        </form>
        
        <button className="btn-link" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
          {isRegister ? "¿Ya posee una cuenta? Inicie sesión aquí" : "¿Cliente nuevo? Regístrese de forma digital"}
        </button>
      </div>
    </div>
  );
}