import { useState } from "react";
import { useBank } from "../context/BankContext"; 

export default function TransactionHistory() {
  const { state } = useBank();
  const { user, transactions } = state;
  const userUid = user?.uid;

  const [filter, setFilter] = useState("ALL");

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card-corporate">
        <div className="card-header">
          <h3>Últimos Movimientos</h3>
        </div>
        <p className="state-empty">
          Aún no tienes movimientos en tu cuenta corriente.
        </p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((tx) => {
    const isSender = tx.emisorUid === userUid;
    if (filter === "SENT") return isSender;
    if (filter === "RECEIVED") return !isSender;
    return true;
  });

  return (
    <div className="card-corporate">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3>Últimos Movimientos</h3>
          <p>Cartola de transacciones en tiempo real</p>
        </div>
        
        {/* Filtros Limpios y Responsivos */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`filter-btn ${filter === "ALL" ? "active all" : ""}`}
            onClick={() => setFilter("ALL")}
          >Todas</button>
          <button 
            className={`filter-btn ${filter === "RECEIVED" ? "active received" : ""}`}
            onClick={() => setFilter("RECEIVED")}
          >Recibidas</button>
          <button 
            className={`filter-btn ${filter === "SENT" ? "active sent" : ""}`}
            onClick={() => setFilter("SENT")}
          >Enviadas</button>
        </div>
      </div>

      <div className="transaction-timeline">
        {filteredTransactions.length === 0 ? (
          <p className="state-empty">
            No hay transacciones que coincidan con este filtro.
          </p>
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