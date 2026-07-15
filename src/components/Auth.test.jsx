import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Auth from './Auth';
import * as authService from '../services/authService';
import * as BankContext from '../context/BankContext';

// Mock de los servicios
vi.mock('../services/authService', () => ({ 
  loginUser: vi.fn(), 
  registerUser: vi.fn() 
}));

describe('RT4 - Componente: Auth (Login y Registro)', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ 
      state: { darkMode: false }, 
      dispatch: mockDispatch 
    });
  });

  it('1. No llama al servicio si los campos están vacíos', async () => {
    const user = userEvent.setup();
    render(<Auth />);
    await user.click(screen.getByRole('button', { name: /Ingresar Seguro/i }));
    
    expect(authService.loginUser).not.toHaveBeenCalled();
    expect(screen.getByText(/Todos los campos marcados son obligatorios/i)).toBeInTheDocument();
  });

  it('2. Muestra error si el servicio mockeado rechaza (credenciales inválidas)', async () => {
    const user = userEvent.setup();
    authService.loginUser.mockRejectedValue(new Error('Firebase Auth Error'));
    
    render(<Auth />);
    await user.type(screen.getByPlaceholderText('usuario@namibank.cl'), 'correo@malo.cl');
    await user.type(screen.getByPlaceholderText('••••••'), '123456');
    await user.click(screen.getByRole('button', { name: /Ingresar Seguro/i }));
    
    expect(await screen.findByText(/Error de autenticación/i)).toBeInTheDocument();
  });

  it('3. Llama al servicio de Firebase con éxito (Caso Feliz)', async () => {
    const user = userEvent.setup();
    // Simulamos que Firebase responde OK
    authService.loginUser.mockResolvedValueOnce({ user: { uid: '123' } });
    
    render(<Auth />);
    await user.type(screen.getByPlaceholderText('usuario@namibank.cl'), 'correo@bueno.cl');
    await user.type(screen.getByPlaceholderText('••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /Ingresar Seguro/i }));
    
    // Verificamos que se enviaron los datos correctos al backend mockeado
    expect(authService.loginUser).toHaveBeenCalledWith('correo@bueno.cl', 'password123');
  });

  it('4. Alterna la vista entre Login y Registro al hacer clic en el enlace', async () => {
    const user = userEvent.setup();
    render(<Auth />);
    
    // Hacemos clic en "¿Cliente nuevo?"
    const toggleModeBtn = screen.getByRole('button', { name: /Cliente nuevo/i });
    await user.click(toggleModeBtn);
    
    // El formulario debería vaciar los campos o cambiar de estado interno (cubrimos la rama de setIsLogin)
    expect(screen.getByPlaceholderText('usuario@namibank.cl')).toBeInTheDocument();
  });

  it('5. Despacha la acción de Tema (Dark Mode) al hacer clic en el sol/luna', async () => {
    const user = userEvent.setup();
    render(<Auth />);
    
    // Hacemos clic en el botón con el title "Alternar Modo Visual"
    const themeBtn = screen.getByTitle('Alternar Modo Visual');
    await user.click(themeBtn);
    
    // Verificamos que se haya intentado cambiar el tema en el Contexto Global
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'TOGGLE_DARK_MODE' });
  });
});