import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as bankService from './services/bankService';
import * as BankContext from './context/BankContext';
import { onAuthStateChanged } from 'firebase/auth';

// 1. Mockeamos los servicios de Firebase
vi.mock('./services/bankService', () => ({
  subscribeToBalance: vi.fn(),
  subscribeToTransactions: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn()
}));
vi.mock('./firebase/config', () => ({
  auth: {}
}));

describe('Bonus - Cobertura Completa de App.jsx', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Comportamiento por defecto del mock de Firebase Auth
    onAuthStateChanged.mockImplementation((auth, callback) => {
      return vi.fn(); // Retorna la función unsubscribe falsa
    });
  });

  it('1. Muestra la pantalla de carga cuando está inicializando (Línea 53)', () => {
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ 
      state: { initializing: true, darkMode: false }, 
      dispatch: mockDispatch 
    });
    render(<App />);
    expect(screen.getByText(/Estableciendo Conexión Segura/i)).toBeInTheDocument();
  });

  it('2. Aplica la clase dark-mode en el HTML (Líneas 16-18)', () => {
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ 
      state: { initializing: true, darkMode: true }, 
      dispatch: mockDispatch 
    });
    render(<App />);
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
  });

  it('3. Despacha LOGOUT si Firebase detecta que no hay usuario (Líneas 25-27)', () => {
    // Simulamos que Firebase avisa que la sesión expiró (usuario null)
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); 
      return vi.fn();
    });

    vi.spyOn(BankContext, 'useBank').mockReturnValue({ 
      state: { initializing: true, darkMode: false }, 
      dispatch: mockDispatch 
    });
    
    render(<App />);
    // Verificamos que se intentó borrar el estado global
    expect(mockDispatch).toHaveBeenCalledWith({ type: "LOGOUT" });
  });

  it('4. Renderiza la pantalla de Login (Auth) si no hay usuario autenticado', () => {
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ 
      state: { user: null, initializing: false, darkMode: false }, 
      dispatch: mockDispatch 
    });
    render(<App />);
    // El componente Auth tiene el botón "Ingresar Seguro", verificamos que exista
    expect(screen.getByRole('button', { name: /Ingresar Seguro/i })).toBeInTheDocument();
  });

  it('5. Ejecuta las funciones unsubscribe al desmontar el componente (Bonus Memory Leaks)', () => {
    const mockUnsubscribeTx = vi.fn();
    const mockUnsubscribeBalance = vi.fn();
    
    bankService.subscribeToTransactions.mockReturnValue(mockUnsubscribeTx);
    bankService.subscribeToBalance.mockReturnValue(mockUnsubscribeBalance);
    
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ 
      state: { 
        user: { uid: '123' }, 
        profile: { saldo: 50000 },
        transactions: [],
        initializing: false, 
        darkMode: false 
      }, 
      dispatch: mockDispatch 
    });

    // Extraemos la función unmount
    const { unmount } = render(<App />);
    
    expect(bankService.subscribeToTransactions).toHaveBeenCalled();
    expect(bankService.subscribeToBalance).toHaveBeenCalled();
    
    // Desmontamos la aplicación
    unmount();

    // Verificamos que se ejecutó la limpieza
    expect(mockUnsubscribeTx).toHaveBeenCalledTimes(1);
    expect(mockUnsubscribeBalance).toHaveBeenCalledTimes(1);
  });
});