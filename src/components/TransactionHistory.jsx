export default function TransactionHistory({ transactions, userEmail }) {
  if (transactions.length === 0) {
    return (
      <div className="card-corporate">
        <div className="card-header">
          <h3>Últimos Movimientos</h3>
        </div>
        <p className="state-empty">No se registran transacciones vigentes en el período actual.</p>
      </div>
    );
  }

  return (
    <div className="card-corporate">
      <div className="card-header">
        <h3>Últimos Movimientos</h3>
        <p>Cartola de transacciones en tiempo real</p>
      </div>
      <div className="transaction-timeline">
        {transactions.map((tx) => {
          const isSender = tx.emisorEmail === userEmail;
          const counterpart = isSender ? tx.receptorNombre : tx.emisorNombre;
          const counterpartEmail = isSender ? tx.receptorEmail : tx.emisorEmail;
          const dateLabel = new Date(tx.fecha).toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short"
          });

          return (
            <div key={tx.id} className={`transaction-item ${isSender ? "debit" : "credit"}`}>
              <div className="tx-info">
                <span className="tx-concept">{isSender ? "Transferencia Emitida" : "Transferencia Recibida"}</span>
                <span className="tx-meta">{counterpart} <small>({counterpartEmail})</small></span>
                <span className="tx-timestamp">{dateLabel}</span>
              </div>
              <div className="tx-amount">
                {isSender ? "-" : "+"} ${tx.monto.toLocaleString("es-CL")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}