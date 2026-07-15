/**
 * Valida los datos de una transferencia antes de enviarlos a Firebase.
 * Retorna un string con el mensaje de error, o null si todo es válido.
 */
export const validateTransfer = (amount, currentBalance, recipientEmail, userEmail) => {
  // CORRECCIÓN: Revisamos estrictamente si está vacío o indefinido, para que el número 0 no sea tratado como "vacío"
  if (!recipientEmail || amount === "" || amount === undefined || amount === null) {
    return "Por favor, completa todos los campos.";
  }
  
  const transferAmount = Number(amount);
  
  if (transferAmount <= 0) {
    return "El monto a transferir debe ser mayor a $0.";
  }
  
  if (transferAmount > currentBalance) {
    return "Saldo insuficiente para realizar esta operación.";
  }
  
  if (recipientEmail.toLowerCase() === userEmail?.toLowerCase()) {
    return "No puedes transferir dinero a tu propia cuenta.";
  }

  return null; // Todo correcto
};