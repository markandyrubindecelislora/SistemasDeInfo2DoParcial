class Archivo {
  constructor(nombre) {
    this.nombre = nombre;
    this.contenido = '';
    this.disponible = true;
  }

  leerContenido() {
    return this.contenido;
  }

  escribirContenido(nuevoContenido) {
    this.contenido = nuevoContenido;
  }

  actualizarEstado(disponible) {
    this.disponible = disponible;
  }

  estaDisponible() {
    return this.disponible;
  }
}

module.exports = Archivo;