export default function TransactionHistory({ transactions, userEmail }) {
  if (transactions.length === 0) {
    return (
      <div className="card-box">
        <h3>Historial de Movimientos</h3>
        <p className="empty-state">Aún no se registran movimientos en esta cuenta.</p>
      </div>
    );
  }

  return (
    <div className="card-box">
      <h3>Historial de Movimientos</h3>
      <div className="history-list">
        {transactions.map((tx) => {
          const isSender = tx.emisorEmail === userEmail;
          const contraparte = isSender ? tx.receptorNombre : tx.emisorNombre;
          const contraparteEmail = isSender ? tx.receptorEmail : tx.emisorEmail;
          const tipoStr = isSender ? "Envío" : "Recepción";
          const fechaFormateada = new Date(tx.fecha).toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short"
          });

          return (
            <div key={tx.id} className={`history-item ${isSender ? "sent" : "received"}`}>
              <div className="tx-details">
                <span className="tx-type">{tipoStr}</span>
                <span className="tx-name">{contraparte} <small>({contraparteEmail})</small></span>
                <span className="tx-date">{fechaFormateada}</span>
              </div>
              <div className="tx-value">
                {isSender ? "-" : "+"} ${tx.monto.toLocaleString("es-CL")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}