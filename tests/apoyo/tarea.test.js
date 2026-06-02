const Tarea = require('../../src/apoyo/Tarea');
const Colaborador = require('../../src/apoyo/Colaborador');
const GestorDeApoyo = require('../../src/apoyo/GestorDeApoyo');

describe('CA-1: Cambiar estado a requiere apoyo', () => {
  test('el propietario puede marcar su tarea como requiere apoyo', () => {
    const tarea = new Tarea('Corregir módulo', 'Xavi');
    const resultado = tarea.marcarApoyo('Xavi');
    expect(resultado).toBe(true);
    expect(tarea.estado).toBe('RequiereApoyo');
  });
});

describe('CA-2: La tarea debe mostrar el estado al equipo', () => {
  test('consultarEstado retorna el estado actual de la tarea', () => {
    const tarea = new Tarea('Corregir módulo', 'Xavi');
    tarea.cambiarEstado('RequiereApoyo');
    expect(tarea.consultarEstado()).toBe('RequiereApoyo');
  });
});

describe('CA-3: Registrar motivo de dificultad', () => {
  test('la solicitud registra el motivo de la dificultad', () => {
    const tarea = new Tarea('Corregir módulo', 'Xavi');
    tarea.registrarMotivo('Error en validación');
    expect(tarea.motivoApoyo).toBe('Error en validación');
  });
});

describe('CA-4: Validación de propietario', () => {
  test('solo el propietario puede marcar la tarea como requiere apoyo', () => {
    const tarea = new Tarea('Corregir módulo', 'Xavi');
    const resultado = tarea.marcarApoyo('Andres');
    expect(resultado).toBe(false);
    expect(tarea.estado).toBe('Pendiente');
  });
});