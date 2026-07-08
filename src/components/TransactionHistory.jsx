import { useState } from "react";
import { useBank } from "../context/BankContext";

export default function TransactionHistory() {
  const { state } = useBank();
  const { user, transactions } = state;
  
  // ESTADO LOCAL PARA EL FILTRO (Requerimiento de la rúbrica)
  const [filter, setFilter] = useState("ALL"); // Puede ser: "ALL", "SENT", "RECEIVED"

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

      if (isNaN(date.getTime())) return "Fecha inválida"; 

      return new Intl.DateTimeFormat('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }).format(date);
  };

  // PROGRAMACIÓN REACTIVA: Filtramos la lista basándonos en el estado antes de renderizar
  const filteredTransactions = transactions.filter((tx) => {
    const isSender = tx.emisorUid === user?.uid;
    
    if (filter === "SENT") return isSender;
    if (filter === "RECEIVED") return !isSender;
    return true; // Si es "ALL", devolvemos todos
  });

  return (
    <div className="card-corporate">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h3>Historial de Movimientos</h3>
          <p>Últimas transacciones de tu cuenta</p>
        </div>

        {/* CONTROLES DEL FILTRO */}
        <div className="filter-group" style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setFilter("ALL")}
            style={{ 
              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', fontSize: '0.85rem',
              border: '1px solid var(--bank-border)', 
              background: filter === "ALL" ? 'var(--bank-primary)' : 'transparent', 
              color: filter === "ALL" ? '#fff' : 'var(--bank-text-main)' 
            }}
          >
            Todas
          </button>
          
          <button 
            onClick={() => setFilter("RECEIVED")}
            style={{ 
              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', fontSize: '0.85rem',
              border: '1px solid var(--bank-border)', 
              background: filter === "RECEIVED" ? 'var(--bank-success)' : 'transparent', 
              color: filter === "RECEIVED" ? '#fff' : 'var(--bank-text-main)' 
            }}
          >
            Recibidas
          </button>
          
          <button 
            onClick={() => setFilter("SENT")}
            style={{ 
              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s', fontSize: '0.85rem',
              border: '1px solid var(--bank-border)', 
              background: filter === "SENT" ? 'var(--bank-text-main)' : 'transparent', 
              color: filter === "SENT" ? 'var(--bank-bg-app)' : 'var(--bank-text-main)' 
            }}
          >
            Enviadas
          </button>
        </div>
      </div>

      <div className="transaction-timeline">
        {/* Lógica de Renderizado Condicional Doble (Defensivo) */}
        {transactions.length === 0 ? (
          <div className="state-empty">
            No tienes movimientos recientes.
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="state-empty" style={{ padding: '30px 0', border: 'none', background: 'transparent' }}>
            No hay transacciones que coincidan con este filtro.
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            // Determinar si el usuario actual envió o recibió el dinero
            const isDebit = tx.emisorUid === user?.uid;
            
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