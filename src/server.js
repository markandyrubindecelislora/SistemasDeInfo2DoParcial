const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const EditorCompartido = require('./EditorCompartido');
const Desarrollador = require('./Desarrollador');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const editor = new EditorCompartido();

// Rutas de páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/editor', (req, res) => {
  res.sendFile(path.join(__dirname, '../editor.html'));
});

app.get('/apoyo', (req, res) => {
  res.sendFile(path.join(__dirname, '../apoyo.html'));
});

// API de Tareas
app.get('/api/tareas', (req, res) => {
  res.json(db.obtenerTareas());
});

app.post('/api/tareas', (req, res) => {
  const { titulo, propietario } = req.body;
  const id = db.crearTarea(titulo, propietario);
  res.json({ id, titulo, propietario, estado: 'Pendiente', motivoApoyo: null });
});

app.put('/api/tareas/:id', (req, res) => {
  const { estado, motivoApoyo, quienMarca } = req.body;
  const tarea = db.obtenerTarea(req.params.id);

  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
  if (quienMarca !== tarea.propietario) {
    return res.status(403).json({ error: 'Solo el propietario puede marcar esta tarea' });
  }

  db.actualizarTarea(req.params.id, estado, motivoApoyo);
  res.json({ ok: true });
});

// Socket.IO - Editor
io.on('connection', (socket) => {
  console.log('Desarrollador conectado:', socket.id);

  if (editor.desarrolladores.length >= editor.maxDesarrolladores) {
    socket.emit('editor-lleno', 'El editor ya tiene 2 desarrolladores');
    socket.disconnect();
    return;
  }

  const dev = new Desarrollador(socket.id, 'Dev-' + socket.id);
  editor.abrirArchivo(dev, 'archivo.js');
  io.emit('num-desarrolladores', editor.desarrolladores.length);

  // Cargar contenido desde la BD
  const contenidoGuardado = db.obtenerContenidoEditor();
  socket.emit('contenido-inicial', contenidoGuardado);

  socket.on('cambio', (contenido) => {
    editor.mostrarCambios(socket.id, contenido);
    db.guardarContenidoEditor(contenido);
    socket.broadcast.emit('actualizar', contenido);
  });

  socket.on('disconnect', () => {
    console.log('Desarrollador desconectado:', socket.id);
    editor.desarrolladores = editor.desarrolladores.filter(d => d.id !== socket.id);
    io.emit('num-desarrolladores', editor.desarrolladores.length);
  });
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});