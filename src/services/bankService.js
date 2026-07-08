import { db } from "../firebase/config";
import { 
  collection, 
  doc, 
  runTransaction, 
  query, 
  where, 
  or,          
  orderBy, 
  onSnapshot, 
  getDocs, 
  Timestamp 
} from "firebase/firestore";

// 1. Suscripción al Saldo (RF2) - ¡Restaurada!
export const subscribeToBalance = (uid, callback) => {
  // 1. Imprimimos el UID exacto que React está buscando
  console.log("🔍 Buscando saldo para el UID de Auth:", uid);

  const userRef = doc(db, "users", uid);

  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      // 2. Si lo encuentra, vemos exactamente qué estructura tiene
      console.log("✅ ¡Documento encontrado! Datos reales:", snapshot.data());
      callback(snapshot.data());
    } else {
      // 3. Si Firebase lo rechaza, te confirmará que el ID no coincide
      console.error("❌ ALERTA: Firestore dice que NO EXISTE el documento con ID:", uid);
      callback({ nombre: "Verificando...", saldo: 0 });
    }
  }, (error) => {
    console.error("⛔ Error de lectura (¿Reglas de seguridad vencidas?):", error);
  });
};

// 2. Suscripción al Historial (RF4 - Tiempo real y ordenado)
export const subscribeToTransactions = (uid, callback) => {
  const txRef = collection(db, "movimientos");
  
  const q = query(
    txRef,
    or(
      where("emisorUid", "==", uid),
      where("receptorUid", "==", uid)
    )
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Función auxiliar segura para extraer los milisegundos sin importar el formato
    const getSafeTime = (fecha) => {
      if (!fecha) return 0; // Si la fecha es nula (ej. escritura pendiente del servidor)
      if (typeof fecha.toMillis === "function") return fecha.toMillis(); // Es un Timestamp de Firestore
      if (fecha.seconds) return fecha.seconds * 1000; // Es un objeto serializado de Firebase
      if (fecha instanceof Date) return fecha.getTime(); // Es un objeto Date de Javascript
      return new Date(fecha).getTime() || 0; // Es un String u otro formato, intentamos convertirlo
    };

    // ORDENAMIENTO EN EL CLIENTE (JavaScript) - Del más reciente al más antiguo
    transactions.sort((a, b) => {
      const timeA = getSafeTime(a.fecha);
      const timeB = getSafeTime(b.fecha);
      return timeB - timeA; 
    });
    
    callback(transactions);
  }, (error) => {
    console.error("Error crítico obteniendo movimientos:", error);
  });

  return unsubscribe;
};

// 3. Ejecutar Transferencia (RF3 - Transacción Atómica)
export const executeTransfer = async (emisorUid, emisorEmail, receptorEmail, monto) => {
  // 3.1 Buscar destinatario por correo
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", receptorEmail.toLowerCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("El usuario destinatario no existe en NamiBank.");
  }

  const receptorDoc = querySnapshot.docs[0];
  const receptorUid = receptorDoc.id;

  const emisorRef = doc(db, "users", emisorUid);
  const receptorRef = doc(db, "users", receptorUid);
  const movimientoRef = doc(collection(db, "movimientos"));

  // 3.2 Ejecutar transacción atómica (Si algo falla, no se descuenta ni se abona nada)
  await runTransaction(db, async (transaction) => {
    const emisorSnap = await transaction.get(emisorRef);
    
    // Validación Backend-side (dentro de la transacción)
    if (!emisorSnap.exists()) {
      throw new Error("Cuenta de origen no válida.");
    }
    if (emisorSnap.data().saldo < monto) {
      throw new Error("Fondos insuficientes para autorizar la transacción.");
    }

    const nuevoSaldoEmisor = emisorSnap.data().saldo - monto;
    const nuevoSaldoReceptor = receptorDoc.data().saldo + monto;

    // Actualizar saldos simultáneamente
    transaction.update(emisorRef, { saldo: nuevoSaldoEmisor });
    transaction.update(receptorRef, { saldo: nuevoSaldoReceptor });
    
    // Generar registro inmutable del movimiento
    transaction.set(movimientoRef, {
      emisorUid,
      emisorEmail,
      receptorUid,
      receptorEmail: receptorDoc.data().email,
      monto,
      fecha: Timestamp.now(), // Guardado como Timestamp nativo de Firestore
      tipo: "transferencia",
      participantes: [emisorUid, receptorUid] // Clave para la query 'array-contains'
    });
  });
};

// 4. Simulación de Depósito/Retiro (Bonus)
export const simulateTransaction = async (uid, amount) => {
  const userRef = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error("Cuenta no encontrada.");

    const currentBalance = userSnap.data().saldo;
    const newBalance = currentBalance + amount;

    if (newBalance < 0) {
      throw new Error("Saldo insuficiente para realizar el retiro.");
    }

    transaction.update(userRef, { saldo: newBalance });
  });
};