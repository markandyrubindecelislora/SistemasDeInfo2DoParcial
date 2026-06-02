const EditorCompartido = require('../src/EditorCompartido');
const Desarrollador = require('../src/Desarrollador');
const Archivo = require('../src/Archivo');
const Sesion = require('../src/Sesion');

// Tests de Archivo
describe('Archivo', () => {
  test('almacena y lee contenido correctamente', () => {
    const archivo = new Archivo('main.js');
    archivo.escribirContenido('const x = 1;');
    expect(archivo.leerContenido()).toBe('const x = 1;');
  });

  test('está disponible por defecto', () => {
    const archivo = new Archivo('main.js');
    expect(archivo.estaDisponible()).toBe(true);
  });

  test('actualiza su estado correctamente', () => {
    const archivo = new Archivo('main.js');
    archivo.actualizarEstado(false);
    expect(archivo.estaDisponible()).toBe(false);
  });
});

// Tests de Sesion
describe('Sesion', () => {
  test('inicia correctamente', () => {
    const sesion = new Sesion('s1');
    sesion.iniciar();
    expect(sesion.estaActiva()).toBe(true);
  });

  test('cierra correctamente', () => {
    const sesion = new Sesion('s1');
    sesion.iniciar();
    sesion.cerrar();
    expect(sesion.estaActiva()).toBe(false);
  });

  test('registra actividad', () => {
    const sesion = new Sesion('s1');
    sesion.iniciar();
    expect(sesion.actividad.length).toBeGreaterThan(0);
  });
});

// Tests de EditorCompartido
describe('EditorCompartido', () => {
  test('dos desarrolladores pueden abrir el mismo archivo', () => {
    const editor = new EditorCompartido();
    const dev1 = new Desarrollador('1', 'Ana');
    const dev2 = new Desarrollador('2', 'Luis');
    expect(editor.abrirArchivo(dev1, 'main.js')).toBe(true);
    expect(editor.abrirArchivo(dev2, 'main.js')).toBe(true);
  });

  test('no permite más de 2 desarrolladores', () => {
    const editor = new EditorCompartido();
    const dev1 = new Desarrollador('1', 'Ana');
    const dev2 = new Desarrollador('2', 'Luis');
    const dev3 = new Desarrollador('3', 'Carlos');
    editor.abrirArchivo(dev1, 'main.js');
    editor.abrirArchivo(dev2, 'main.js');
    expect(editor.abrirArchivo(dev3, 'main.js')).toBe(false);
  });

  test('cambio aparece en menos de 2 segundos', async () => {
    const editor = new EditorCompartido();
    const dev1 = new Desarrollador('1', 'Ana');
    editor.abrirArchivo(dev1, 'main.js');
    const inicio = Date.now();
    await editor.sincronizar('nuevo contenido');
    expect(Date.now() - inicio).toBeLessThan(2000);
  });

  test('cambio llega al otro desarrollador', () => {
    const editor = new EditorCompartido();
    const dev1 = new Desarrollador('1', 'Ana');
    const dev2 = new Desarrollador('2', 'Luis');
    editor.abrirArchivo(dev1, 'main.js');
    editor.abrirArchivo(dev2, 'main.js');
    editor.mostrarCambios('1', 'hola mundo');
    expect(dev2.visualizarCambios()).toBe('hola mundo');
  });
});