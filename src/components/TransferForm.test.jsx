// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TransferForm from './TransferForm';

// 1. Importamos todo el módulo de Firebase y del Contexto
import * as bankService from '../services/bankService';
import * as BankContext from '../context/BankContext';

// 2. Mockeamos SÓLO el servicio de Firebase para aislar la base de datos
vi.mock('../services/bankService', () => ({
  executeTransfer: vi.fn(),
}));

describe('RT3 - Componente React: TransferForm', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    
    // 3. SPY-ON: La forma profesional y segura de inyectar datos falsos 
    // a un Custom Hook de React sin romper el Dispatcher de Hooks.
    vi.spyOn(BankContext, 'useBank').mockReturnValue({
      state: {
        user: { uid: 'uid-nami-123', email: 'nami@banco.cl' },
        profile: { saldo: 50000 } // Nuestro saldo de prueba
      }
    });
  });

  afterEach(() => {
    // Restauramos todo a la normalidad después de cada test
    vi.restoreAllMocks();
  });

  it('1. Debe renderizar los elementos clave de la UI', () => {
    render(<TransferForm />);
    expect(screen.getByText('Transferir Fondos')).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo del Destinatario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monto a Transferir/i)).toBeInTheDocument();
  });

  it('2. Debe simular clics y mostrar error si se envía vacío', async () => {
    render(<TransferForm />);
    const submitBtn = screen.getByRole('button');
    fireEvent.click(submitBtn);
    
    // Verificamos el feedback visual
    expect(await screen.findByText(/completa todos los campos/i)).toBeInTheDocument();
  });

  it('3. Debe mostrar error por saldo insuficiente', async () => {
    render(<TransferForm />);
    const emailInput = screen.getByLabelText(/Correo del Destinatario/i);
    const amountInput = screen.getByLabelText(/Monto a Transferir/i);
    const submitBtn = screen.getByRole('button');

    // Intentamos transferir 100.000 cuando NamiBank solo nos dio 50.000 falsos
    fireEvent.change(emailInput, { target: { value: 'amigo@correo.cl' } });
    fireEvent.change(amountInput, { target: { value: '100000' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Saldo insuficiente/i)).toBeInTheDocument();
  });

  it('4. Debe realizar una transferencia exitosa (Mock de Firebase)', async () => {
    // Le decimos a Vitest que la promesa simule ser exitosa
    bankService.executeTransfer.mockResolvedValueOnce();

    render(<TransferForm />);
    const emailInput = screen.getByLabelText(/Correo del Destinatario/i);
    const amountInput = screen.getByLabelText(/Monto a Transferir/i);
    const submitBtn = screen.getByRole('button');

    // Escenario exitoso
    fireEvent.change(emailInput, { target: { value: 'amigo@correo.cl' } });
    fireEvent.change(amountInput, { target: { value: '20000' } }); 
    fireEvent.click(submitBtn);

    // Aseguramos que el componente disparó los datos correctos al servidor mock
    await waitFor(() => {
      expect(bankService.executeTransfer).toHaveBeenCalledWith(
        'uid-nami-123', 'nami@banco.cl', 'amigo@correo.cl', 20000
      );
    });

    expect(await screen.findByText(/realizada con éxito/i)).toBeInTheDocument();
  });
});