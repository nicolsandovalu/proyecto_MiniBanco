import { db } from "../firebase/config";
import { 
  collection, 
  doc, 
  runTransaction, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  orderBy
} from "firebase/firestore";

export const subscribeToBalance = (uid, callback) => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
};

export const subscribeToTransactions = (uid, callback) => {
  const q = query(
    collection(db, "movimientos"),
    where("participantes", "array-contains", uid),
    orderBy("fecha", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const txList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(txList);
  });
};

export const transferFunds = async (senderUid, targetEmail, amount) => {
  const cleanedEmail = targetEmail.trim().toLowerCase();
  
  // Buscar destinatario por correo electrónico
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", cleanedEmail));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error("El correo electrónico ingresado no corresponde a ningún cliente registrado.");
  }
  
  const receiverDoc = querySnapshot.docs[0];
  const receiverUid = receiverDoc.id;
  const receiverData = receiverDoc.data();
  
  if (senderUid === receiverUid) {
    throw new Error("Operación no permitida: No puede realizar transferencias a sus propias cuentas.");
  }

  const senderDocRef = doc(db, "users", senderUid);
  const receiverDocRef = doc(db, "users", receiverUid);

  // Ejecución de la transacción segura
  await runTransaction(db, async (transaction) => {
    const senderSnap = await transaction.get(senderDocRef);
    if (!senderSnap.exists()) throw new Error("Error de consistencia en la cuenta de origen.");

    const currentSenderBalance = senderSnap.data().saldo;
    if (currentSenderBalance < amount) {
      throw new Error("Fondos insuficientes para autorizar la transacción.");
    }

    // Actualizaciones de saldo concurrentes
    transaction.update(senderDocRef, { saldo: currentSenderBalance - amount });
    transaction.update(receiverDocRef, { saldo: receiverData.saldo + amount });

    // Registrar el recibo digital de la operación
    const newTxRef = doc(collection(db, "movimientos"));
    transaction.set(newTxRef, {
      emisorUid: senderUid,
      emisorNombre: senderSnap.data().nombre,
      emisorEmail: senderSnap.data().email,
      receptorUid: receiverUid,
      receptorNombre: receiverData.nombre,
      receptorEmail: receiverData.email,
      monto: amount,
      fecha: new Date().toISOString(),
      participantes: [senderUid, receiverUid]
    });
  });
};