export const validateTransfer = (amount, currentBalance, recipientEmail, userEmail) => {
  if (!recipientEmail || amount === "" || amount === undefined || amount === null) {
    return "Por favor, completa todos los campos.";
  }
  
  // Novedad: Formato de email válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    return "El formato del correo es inválido.";
  }
  
  const transferAmount = Number(amount);
  
  // Novedad: No numérico o decimales (XBank no acepta monedas fraccionarias en transferencias)
  if (isNaN(transferAmount)) return "El monto debe ser un número válido.";
  if (!Number.isInteger(transferAmount)) return "No se permiten decimales.";
  
  if (transferAmount <= 0) return "El monto a transferir debe ser mayor a $0.";
  if (transferAmount > currentBalance) return "Saldo insuficiente para realizar esta operación.";
  
  if (recipientEmail.toLowerCase() === userEmail?.toLowerCase()) {
    return "No puedes transferir dinero a tu propia cuenta.";
  }

  return null;
};