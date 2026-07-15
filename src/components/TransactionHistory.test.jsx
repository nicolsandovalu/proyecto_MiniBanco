import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TransactionHistory from './TransactionHistory';
import * as BankContext from '../context/BankContext';

describe('RT4 - Componente: Historial', () => {
  it('1. Muestra estado vacío si la cuenta es nueva (cero movimientos)', () => {
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ state: { user: { uid: '123' }, transactions: [] } });
    render(<TransactionHistory />);
    expect(screen.getByText(/No tienes movimientos recientes/i)).toBeInTheDocument();
  });

  it('2. Renderiza transacciones y cubre ramas de formato de fecha de Firestore (Líneas 16-18)', () => {
    // Mock 1: Simulamos un Timestamp de Firestore (cubre línea 16)
    const mockFirestoreTimestamp = { toDate: () => new Date('2026-07-15T10:00:00') };
    // Mock 2: Simulamos un objeto serializado con segundos (cubre línea 18)
    const mockSecondsTimestamp = { seconds: 1672531200 };

    const mockTx = [
      { id: '1', emisorUid: '123', receptorEmail: 'amigo@banco.cl', monto: 5000, fecha: mockFirestoreTimestamp }, 
      { id: '2', emisorUid: '999', emisorEmail: 'jefe@banco.cl', monto: 15000, fecha: mockSecondsTimestamp }   
    ];
    
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ state: { user: { uid: '123' }, transactions: mockTx } });
    render(<TransactionHistory />);
    
    // Verifica que el componente no explote con fechas raras y las renderice
    expect(screen.getByText((content, element) => element.textContent.replace(/\s+/g, '') === '-$5.000')).toBeInTheDocument();
  });

  it('3. Filtra correctamente las transacciones al hacer clic en los botones (Líneas 51-75)', async () => {
    const user = userEvent.setup();
    const mockTx = [
      { id: '1', emisorUid: '123', receptorEmail: 'amigo@banco.cl', monto: 5000, fecha: new Date() }, // Envío
      { id: '2', emisorUid: '999', emisorEmail: 'jefe@banco.cl', monto: 15000, fecha: new Date() }   // Recepción
    ];

    vi.spyOn(BankContext, 'useBank').mockReturnValue({ state: { user: { uid: '123' }, transactions: mockTx } });
    render(<TransactionHistory />);

    // ESTADO INICIAL: Muestra ambas transacciones
    expect(screen.getByText('amigo@banco.cl')).toBeInTheDocument();
    expect(screen.getByText('jefe@banco.cl')).toBeInTheDocument();

    // FILTRO ENVIADAS: Clic en el botón
    await user.click(screen.getByRole('button', { name: /Enviadas/i }));
    expect(screen.getByText('amigo@banco.cl')).toBeInTheDocument();
    expect(screen.queryByText('jefe@banco.cl')).not.toBeInTheDocument(); // El jefe debe desaparecer

    // FILTRO RECIBIDAS: Clic en el botón
    await user.click(screen.getByRole('button', { name: /Recibidas/i }));
    expect(screen.queryByText('amigo@banco.cl')).not.toBeInTheDocument(); // El amigo debe desaparecer
    expect(screen.getByText('jefe@banco.cl')).toBeInTheDocument();

    // FILTRO TODAS: Volver a la normalidad
    await user.click(screen.getByRole('button', { name: /Todas/i }));
    expect(screen.getByText('amigo@banco.cl')).toBeInTheDocument();
    expect(screen.getByText('jefe@banco.cl')).toBeInTheDocument();
  });

  it('4. Muestra estado vacío secundario si un filtro no encuentra resultados', async () => {
    const user = userEvent.setup();
    const mockTx = [
      { id: '1', emisorUid: '123', receptorEmail: 'amigo@banco.cl', monto: 5000, fecha: new Date() } // Solo tiene envíos
    ];
    vi.spyOn(BankContext, 'useBank').mockReturnValue({ state: { user: { uid: '123' }, transactions: mockTx } });
    render(<TransactionHistory />);

    // Hacemos clic en "Recibidas", pero como solo hay un envío, debe mostrar el estado vacío del filtro
    await user.click(screen.getByRole('button', { name: /Recibidas/i }));
    expect(screen.getByText(/No hay transacciones que coincidan con este filtro/i)).toBeInTheDocument();
  });
});