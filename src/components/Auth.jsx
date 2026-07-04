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
    e.preventDefault(); // Evita recarga involuntaria de página
    setError("");
    
    if (!email || !password || (isRegister && !name)) {
      setError("Por favor, completa todos los campos requeridos.");
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
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? "Crear Cuenta en XBank" : "Iniciar Sesión"}</h2>
      {error && <div className="error-banner">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={handleNameChange}
            disabled={loading}
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={handleEmailChange}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : isRegister ? "Registrarse" : "Entrar"}
        </button>
      </form>
      
      <button 
        className="toggle-btn" 
        onClick={() => { setIsRegister(!isRegister); setError(""); }}
      >
        {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate aquí"}
      </button>
    </div>
  );
}