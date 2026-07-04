import { db } from "../firebase/config";
import { 
  collection, 
  doc, 
  runTransaction, 
  query, 
  where, 
  getDocs, 
  addDoc,
  onSnapshot,
  orderBy
} from "firebase/firestore";

// Suscripción al saldo en tiempo real
export const subscribeToUserBalance = (uid, callback) => {
  const userDocRef = doc(db, "users", uid);
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

// Suscripción al historial de movimientos en tiempo real
export const subscribeToTransactions = (uid, callback) => {
  const q = query(
    collection(db, "movimientos"),
    where("participantes", "array-contains", uid),
    orderBy("fecha", "desc")
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const movimientos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(movimientos);
  });
};

// Ejecución de transferencia segura y atómica
export const executeTransfer = async (senderUid, targetEmail, amount) => {
  const cleanedEmail = targetEmail.trim().toLowerCase();
  
  // 1. Buscar destinatario por Email
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", cleanedEmail));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error("El usuario destinatario no existe.");
  }
  
  const targetDoc = querySnapshot.docs[0];
  const receiverUid = targetDoc.id;
  const receiverData = targetDoc.data();
  
  if (senderUid === receiverUid) {
    throw new Error("No puedes transferirte dinero a ti mismo.");
  }

  const senderDocRef = doc(db, "users", senderUid);
  const receiverDocRef = doc(db, "users", receiverUid);

  // 2. Ejecutar la transacción atómica
  await runTransaction(db, async (transaction) => {
    const senderSnap = await transaction.get(senderDocRef);
    if (!senderSnap.exists()) throw new Error("Error con la cuenta de origen.");

    const currentSenderBalance = senderSnap.data().saldo;
    if (currentSenderBalance < amount) {
      throw new Error("Saldo insuficiente para completar la transacción.");
    }

    // Modificaciones de saldo concurrentes y seguras
    transaction.update(senderDocRef, { saldo: currentSenderBalance - amount });
    transaction.update(receiverDocRef, { saldo: receiverData.saldo + amount });

    // Registrar el movimiento en la colección global
    const movimientoRef = doc(collection(db, "movimientos"));
    transaction.set(movimientoRef, {
      emisorUid: senderUid,
      emisorNombre: senderSnap.data().nombre,
      emisorEmail: senderSnap.data().email,
      receptorUid: receiverUid,
      receptorNombre: receiverData.nombre,
      receptorEmail: receiverData.email,
      monto: amount,
      fecha: new Date().toISOString(),
      participantes: [senderUid, receiverUid] // Indexación óptima para consultas en tiempo real
    });
  });
};