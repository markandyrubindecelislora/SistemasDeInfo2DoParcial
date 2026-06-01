const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data.db'));

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    propietario TEXT NOT NULL,
    estado TEXT DEFAULT 'Pendiente',
    motivoApoyo TEXT
  );

  CREATE TABLE IF NOT EXISTS editor_contenido (
    id INTEGER PRIMARY KEY,
    contenido TEXT DEFAULT ''
  );
`);

// Insertar contenido inicial del editor si no existe
const editorExiste = db.prepare('SELECT * FROM editor_contenido WHERE id = 1').get();
if (!editorExiste) {
  db.prepare('INSERT INTO editor_contenido (id, contenido) VALUES (1, ?)').run('');
}

// Funciones de Tareas
function crearTarea(titulo, propietario) {
  const stmt = db.prepare('INSERT INTO tareas (titulo, propietario) VALUES (?, ?)');
  const result = stmt.run(titulo, propietario);
  return result.lastInsertRowid;
}

function obtenerTareas() {
  return db.prepare('SELECT * FROM tareas').all();
}

function actualizarTarea(id, estado, motivoApoyo) {
  db.prepare('UPDATE tareas SET estado = ?, motivoApoyo = ? WHERE id = ?')
    .run(estado, motivoApoyo, id);
}

function obtenerTarea(id) {
  return db.prepare('SELECT * FROM tareas WHERE id = ?').get(id);
}

// Funciones del Editor
function guardarContenidoEditor(contenido) {
  db.prepare('UPDATE editor_contenido SET contenido = ? WHERE id = 1').run(contenido);
}

function obtenerContenidoEditor() {
  const row = db.prepare('SELECT contenido FROM editor_contenido WHERE id = 1').get();
  return row ? row.contenido : '';
}

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  obtenerTarea,
  guardarContenidoEditor,
  obtenerContenidoEditor
};