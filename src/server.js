const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const EditorCompartido = require('./EditorCompartido');
const Desarrollador = require('./Desarrollador');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const editor = new EditorCompartido();

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/editor', (req, res) => {
  res.sendFile(path.join(__dirname, '../editor.html'));
});

app.get('/apoyo', (req, res) => {
  res.sendFile(path.join(__dirname, '../apoyo.html'));
});

// Socket.IO
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

  socket.emit('contenido-inicial', editor.archivoActivo.leerContenido());

  socket.on('cambio', (contenido) => {
    editor.mostrarCambios(socket.id, contenido);
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