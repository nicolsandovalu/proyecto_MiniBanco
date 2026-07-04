import { useState } from "react";
import { executeTransfer } from "../services/bankService";

export default function TransferForm({ senderUid, currentBalance }) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleAmountChange = (e) => setAmount(e.target.value);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const numericAmount = parseFloat(amount);

    // Validaciones preventivas estrictas antes de invocar Firebase
    if (!email || !amount) {
      setMessage({ text: "Completa todos los campos obligatorios.", type: "error" });
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setMessage({ text: "El monto debe ser un número superior a $0.", type: "error" });
      return;
    }
    if (numericAmount > currentBalance) {
      setMessage({ text: "No posees saldo suficiente para esta operación.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await executeTransfer(senderUid, email, numericAmount);
      setMessage({ text: "¡Transferencia ejecutada con éxito!", type: "success" });
      setEmail("");
      setAmount("");
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-box">
      <h3>Realizar una Transferencia</h3>
      {message.text && (
        <div className={`status-message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleTransferSubmit}>
        <div className="input-group">
          <label>Email del Destinatario</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="ejemplo@correo.com"
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label>Monto ($)</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Monto a transferir"
            disabled={loading}
          />
        </div>
        <button type="submit" className="action-btn" disabled={loading}>
          {loading ? "Transfiriendo..." : "Enviar Dinero"}
        </button>
      </form>
    </div>
  );
}