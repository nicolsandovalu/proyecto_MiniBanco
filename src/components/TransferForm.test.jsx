import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransferForm from './TransferForm';
import * as bankService from '../services/bankService';

// 1. Aislamos Firebase
vi.mock('../services/bankService', () => ({
  executeTransfer: vi.fn(),
}));

// 2. Corregido: Mock estático a prueba de borrados
vi.mock('../context/BankContext', () => ({
  useBank: () => ({
    state: {
      user: { uid: 'uid-nami-123', email: 'nami@banco.cl' },
      profile: { saldo: 50000 }
    }
  })
}));

describe('RT3 - Componente React: TransferForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Ahora esto solo borra el historial de executeTransfer, no el contexto
  });

  it('1. Debe renderizar los elementos clave de la UI', () => {
    render(<TransferForm />);
    expect(screen.getByText('Transferir Fondos')).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo del Destinatario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monto a Transferir/i)).toBeInTheDocument();
  });

  it('2. Debe simular clics y mostrar error si se envía vacío', async () => {
    const user = userEvent.setup();
    render(<TransferForm />);
    
    const submitBtn = screen.getByRole('button');
    await user.click(submitBtn);
    
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
  });

  it('3. Debe mostrar error por saldo insuficiente usando userEvent', async () => {
    const user = userEvent.setup();
    render(<TransferForm />);
    
    const emailInput = screen.getByLabelText(/Correo del Destinatario/i);
    const amountInput = screen.getByLabelText(/Monto a Transferir/i);
    const submitBtn = screen.getByRole('button');

    await user.type(emailInput, 'amigo@correo.cl');
    await user.type(amountInput, '100000');
    await user.click(submitBtn);

    expect(await screen.findByText(/Saldo insuficiente/i)).toBeInTheDocument();
  });

  it('4. Botón deshabilitado durante la carga (Evita doble submit)', async () => {
    const user = userEvent.setup();
    bankService.executeTransfer.mockImplementation(() => new Promise(res => setTimeout(res, 500)));
    
    render(<TransferForm />);
    await user.type(screen.getByLabelText(/Correo/i), 'amigo@correo.cl');
    await user.type(screen.getByLabelText(/Monto/i), '10000');
    
    const submitBtn = screen.getByRole('button');
    await user.click(submitBtn); 
    
    expect(submitBtn).toBeDisabled();
  });
});