import { useState } from "react";
import { useBank } from "../context/BankContext";
import { executeTransfer } from "../services/bankService";

export default function TransferForm() {
  const { state } = useBank();
  const { user, profile } = state;
  
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransferSubmit = async (e) => {
    e.preventDefault(); // Regla estricta de la rúbrica: evitar recarga
    setError("");
    setSuccess("");

    const transferAmount = Number(amount);

    // 1. Validaciones previas en el Front-End
    if (!recipientEmail || !amount) {
      return setError("Por favor, completa todos los campos.");
    }
    if (transferAmount <= 0) {
      return setError("El monto a transferir debe ser mayor a $0.");
    }
    if (transferAmount > profile.saldo) {
      return setError("Saldo insuficiente para realizar esta operación.");
    }
    if (recipientEmail.toLowerCase() === user.email.toLowerCase()) {
      return setError("No puedes transferir dinero a tu propia cuenta.");
    }

    // 2. Ejecución de la transferencia
    setLoading(true);
    try {
      await executeTransfer(user.uid, user.email, recipientEmail, transferAmount);
      setSuccess(`Transferencia de $${transferAmount.toLocaleString("es-CL")} realizada con éxito.`);
      setRecipientEmail("");
      setAmount("");
    } catch (err) {
      setError(err.message || "Error al procesar la transferencia. Verifica el correo del destinatario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-corporate">
      <div className="card-header">
        <h3>Transferir Fondos</h3>
        <p>Envía dinero a otros usuarios de NamiBank de forma segura.</p>
      </div>

      {error && <div className="feedback-banner error">{error}</div>}
      {success && <div className="feedback-banner success">{success}</div>}

      <form onSubmit={handleTransferSubmit}>
        <div className="form-group">
          <label htmlFor="recipientEmail">Correo del Destinatario</label>
          <input
            id="recipientEmail"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            disabled={loading}
            placeholder="ejemplo@correo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Monto a Transferir ($)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            placeholder="0"
            min="1"
          />
        </div>

        <button 
          type="submit" 
          className="btn-accent btn-pill-filled" 
          disabled={loading || profile?.saldo === 0}
        >
          {loading ? "Procesando transferencia..." : "Transferir Ahora"}
        </button>
      </form>
    </div>
  );
}