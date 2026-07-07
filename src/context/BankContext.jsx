import { createContext, useContext, useReducer } from "react";

// 1. Estado inicial
const initialState = {
  user: null,
  profile: null,
  transactions: [],
  initializing: true,
};

// 2. Función Reductora (useReducer)
function bankReducer(state, action) {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, user: action.payload, initializing: false };
    case "SET_PROFILE":
      return { ...state, profile: action.payload };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "LOGOUT":
      return { ...initialState, initializing: false };
    default:
      return state;
  }
}

// 3. Crear el Contexto
const BankContext = createContext();

// 4. Proveedor del Contexto
export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  return (
    <BankContext.Provider value={{ state, dispatch }}>
      {children}
    </BankContext.Provider>
  );
}

// 5. Hook personalizado para consumir el contexto fácilmente
export const useBank = () => useContext(BankContext);