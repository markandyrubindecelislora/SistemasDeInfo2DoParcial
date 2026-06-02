const Archivo = require('./Archivo');
const Sesion = require('./Sesion');

class EditorCompartido {
  constructor() {
    this.archivoActivo = null;
    this.sesionActivada = null;
    this.maxDesarrolladores = 2;
    this.desarrolladores = [];
  }

  abrirArchivo(desarrollador, nombreArchivo) {
    if (this.desarrolladores.length >= this.maxDesarrolladores) {
      return false;
    }

    if (!this.archivoActivo) {
      this.archivoActivo = new Archivo(nombreArchivo);
    }

    if (!this.sesionActivada) {
      this.sesionActivada = new Sesion('sesion-' + Date.now());
      this.sesionActivada.iniciar();
    }

    this.desarrolladores.push(desarrollador);
    return true;
  }

  mostrarCambios(idDesarrollador, contenido) {
    this.archivoActivo.escribirContenido(contenido);
    this.desarrolladores.forEach(dev => {
      if (dev.id !== idDesarrollador) {
        dev.recibirCambios(contenido);
      }
    });
  }

  habilitarEdicion() {
    if (this.archivoActivo) {
      this.archivoActivo.actualizarEstado(true);
    }
  }

  sincronizar(contenido) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.archivoActivo.escribirContenido(contenido);
        resolve(true);
      }, 100);
    });
  }
}

module.exports = EditorCompartido;