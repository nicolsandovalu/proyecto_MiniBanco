import { describe, it, expect } from 'vitest';
import { validateTransfer } from './validations';

describe('RT2 - Lógica de Negocio: validateTransfer', () => {
  
  it('1. Debe retornar null cuando todos los datos son válidos (Happy Path)', () => {
    // Escenario ideal: monto válido, saldo suficiente, correos distintos
    const result = validateTransfer(5000, 10000, 'nami@banco.cl', 'usuario@banco.cl');
    expect(result).toBeNull();
  });

  it('2. Debe retornar error si faltan campos obligatorios', () => {
    const resultSinMonto = validateTransfer('', 10000, 'nami@banco.cl', 'usuario@banco.cl');
    expect(resultSinMonto).toBe("Por favor, completa todos los campos.");

    const resultSinDestinatario = validateTransfer(5000, 10000, '', 'usuario@banco.cl');
    expect(resultSinDestinatario).toBe("Por favor, completa todos los campos.");
  });

  it('3. Debe retornar error si el monto es menor o igual a 0', () => {
    const resultCero = validateTransfer(0, 10000, 'nami@banco.cl', 'usuario@banco.cl');
    expect(resultCero).toBe("El monto a transferir debe ser mayor a $0.");

    const resultNegativo = validateTransfer(-5000, 10000, 'nami@banco.cl', 'usuario@banco.cl');
    expect(resultNegativo).toBe("El monto a transferir debe ser mayor a $0.");
  });

  it('4. Debe retornar error si hay saldo insuficiente', () => {
    // Intenta transferir 15.000 teniendo solo 10.000
    const result = validateTransfer(15000, 10000, 'nami@banco.cl', 'usuario@banco.cl');
    expect(result).toBe("Saldo insuficiente para realizar esta operación.");
  });

  it('5. Debe retornar error si el usuario intenta transferirse a sí mismo', () => {
    // Usamos mayúsculas/minúsculas para probar que la validación es robusta (.toLowerCase)
    const result = validateTransfer(5000, 10000, 'Usuario@banco.cl', 'usuario@banco.cl');
    expect(result).toBe("No puedes transferir dinero a tu propia cuenta.");
  });
});

it.each([
    ['texto', 10000, 'amigo@banco.cl', 'yo@banco.cl', "El monto debe ser un número válido."],
    [500.50, 10000, 'amigo@banco.cl', 'yo@banco.cl', "No se permiten decimales."],
    [5000, 10000, 'amigobanco.cl', 'yo@banco.cl', "El formato del correo es inválido."]
  ])('Batería extra (Bonus): monto %s, correo %s retorna %s', (monto, saldo, dest, yo, esperado) => {
    expect(validateTransfer(monto, saldo, dest, yo)).toBe(esperado);
  });