import { useState } from "react";
import { transferFunds } from "../services/bankService";
import { useBank } from "../context/BankContext"; // <-- Importamos el contexto

export default function TransferForm() {
  // Sacamos los datos del estado global
  const { state } = useBank();
  const { user, profile } = state;
  
  const senderUid = user?.uid;
  const currentBalance = profile ? profile.saldo : 0;

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleAmountChange = (e) => setAmount(e.target.value);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ text: "", type: "" });

    const numericAmount = parseFloat(amount);

    if (!email || !amount) {
      setFeedback({ text: "Debe rellenar todos los campos del formulario.", type: "error" });
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFeedback({ text: "El monto de la transferencia debe ser mayor a $0.", type: "error" });
      return;
    }
    if (numericAmount > currentBalance) {
      setFeedback({ text: "Operación rechazada: Fondos disponibles insuficientes.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await transferFunds(senderUid, email, numericAmount);
      setFeedback({ text: "¡Transferencia realizada con éxito! Los fondos han sido abonados.", type: "success" });
      setEmail("");
      setAmount(""); // <-- AQUÍ ESTÁ LA CORRECCIÓN
    } catch (error) {
      setFeedback({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-corporate">
      <div className="card-header">
        <h3>Transferencias a Terceros</h3>
        <p>Transfiera fondos de forma segura e inmediata</p>
      </div>
      {feedback.text && (
        <div className={`feedback-banner ${feedback.type}`}>
          {feedback.text}
        </div>
      )}
      <form onSubmit={handleTransferSubmit}>
        <div className="form-group">
          <label>Correo Electrónico Destinatario</label>
          <input type="email" value={email} onChange={handleEmailChange} placeholder="destinatario@correo.cl" disabled={loading} />
        </div>
        <div className="form-group">
          <label>Monto a Transferir ($)</label>
          <input type="number" value={amount} onChange={handleAmountChange} placeholder="Monto en pesos chilenos" disabled={loading} />
        </div>
        <button type="submit" className="btn-accent" disabled={loading}>
          {loading ? "Procesando TEF..." : "Confirmar Transferencia"}
        </button>
      </form>
    </div>
  );
}