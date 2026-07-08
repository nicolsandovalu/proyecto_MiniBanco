import { useBank } from "../context/BankContext";

export default function TransactionHistory() {
  const { state } = useBank();
  const { user, transactions } = state;

  const formatDate = (timestamp) => {
      if (!timestamp) return "Procesando...";
      
      let date;
      if (typeof timestamp.toDate === "function") {
        date = timestamp.toDate(); // Es Firestore Timestamp
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000); // Es Firestore Timestamp serializado
      } else {
        date = new Date(timestamp); // Es un String o Date
      }

      if (isNaN(date.getTime())) return "Fecha inválida"; // Fallback por si la fecha no sirve

      return new Intl.DateTimeFormat('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
    };

  return (
    <div className="card-corporate">
      <div className="card-header">
        <h3>Historial de Movimientos</h3>
        <p>Últimas transacciones de tu cuenta</p>
      </div>

      <div className="transaction-timeline">
        {transactions.length === 0 ? (
          <div className="state-empty">
            No tienes movimientos recientes.
          </div>
        ) : (
          transactions.map((tx) => {
            // Determinar si el usuario actual envió o recibió el dinero
            const isDebit = tx.emisorUid === user.uid;
            
            // La contraparte es el nombre/correo de la OTRA persona
            const counterparty = isDebit ? tx.receptorEmail : tx.emisorEmail;
            
            return (
              <div key={tx.id} className={`transaction-item ${isDebit ? "debit" : "credit"}`}>
                <div className="tx-info">
                  <span className="tx-concept">
                    {isDebit ? "Transferencia enviada a" : "Transferencia recibida de"}
                  </span>
                  <span className="tx-meta">{counterparty}</span>
                  <span className="tx-timestamp">{formatDate(tx.fecha)}</span>
                </div>
                <div className="tx-amount">
                  {isDebit ? "-" : "+"}${tx.monto.toLocaleString("es-CL")}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}