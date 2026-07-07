import { useState } from "react";
import { loginUser, registerUser } from "../services/authService";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);

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
      <div className="auth-brand">
        <h2>NamiBank</h2>
        <p>Banca Digital Corporativa</p>
      </div>
      <div className="auth-card">
        <h3>{isRegister ? "Crear Cuenta" : "Acceso Clientes"}</h3>
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