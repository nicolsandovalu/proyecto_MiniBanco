import { createContext, useContext, useReducer } from "react";

const initialState = {
  user: null,
  profile: null,
  transactions: [],
  initializing: true,
  darkMode: localStorage.getItem("theme") === "dark",
};

function bankReducer(state, action) {
  switch (action.type) {
    case "SET_AUTH":
      return { ...state, user: action.payload, initializing: false };
    case "SET_PROFILE":
      // Garantiza la inmutabilidad absoluta del estado base
      return { ...state, profile: action.payload };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "TOGGLE_DARK_MODE":
      const newMode = !state.darkMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return { ...state, darkMode: newMode };
    case "LOGOUT":
      return { ...initialState, darkMode: state.darkMode, initializing: false };
    default:
      return state;
  }
}

const BankContext = createContext();

export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  return (
    <BankContext.Provider value={{ state, dispatch }}>
      {children}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);