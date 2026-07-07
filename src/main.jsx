import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BankProvider } from './context/BankContext.jsx' // <-- IMPORTAR

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BankProvider> {/* <-- ENVOLVER APP */}
      <App />
    </BankProvider>
  </React.StrictMode>,
)