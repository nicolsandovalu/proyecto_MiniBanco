import { auth, db } from "../firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  // Crear perfil inicial en Firestore con saldo obligatorio
  await setDoc(doc(db, "users", user.uid), {
    nombre: displayName,
    email: email.toLowerCase(),
    saldo: 100000
  });

  return user;
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  await signOut(auth);
};