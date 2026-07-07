import { useState } from "react";

export default function TransactionHistory({ transactions, userUid }) {
  const [filter, setFilter] = useState("ALL"); // "ALL", "SENT", "RECEIVED"

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

  // Lógica del filtro (derivada del estado puro)
  const filteredTransactions = transactions.filter((tx) => {
    const isSender = tx.emisorUid === userUid;
    if (filter === "SENT") return isSender;
    if (filter === "RECEIVED") return !isSender;
    return true;
  });

  return (
    <div className="card-corporate">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Últimos Movimientos</h3>
          <p>Cartola de transacciones en tiempo real</p>
        </div>
        
        {/* Controles del Filtro (Bonus) */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setFilter("ALL")}
            style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', background: filter === "ALL" ? '#0f265c' : 'white', color: filter === "ALL" ? 'white' : '#64748b', cursor: 'pointer' }}
          >Todas</button>
          <button 
            onClick={() => setFilter("RECEIVED")}
            style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', background: filter === "RECEIVED" ? '#10b981' : 'white', color: filter === "RECEIVED" ? 'white' : '#64748b', cursor: 'pointer' }}
          >Recibidas</button>
          <button 
            onClick={() => setFilter("SENT")}
            style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', background: filter === "SENT" ? '#ef4444' : 'white', color: filter === "SENT" ? 'white' : '#64748b', cursor: 'pointer' }}
          >Enviadas</button>
        </div>
      </div>

      <div className="transaction-timeline">
        {filteredTransactions.length === 0 ? (
          <p className="state-empty">No hay transacciones para este filtro.</p>
        ) : (
          filteredTransactions.map((tx) => {
            const isSender = tx.emisorUid === userUid;
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
          })
        )}
      </div>
    </div>
  );
}