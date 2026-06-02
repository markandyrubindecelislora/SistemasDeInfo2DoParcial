class Sesion {
  constructor(id) {
    this.id = id;
    this.tiempoInicio = null;
    this.activa = false;
    this.actividad = [];
  }

  iniciar() {
    this.tiempoInicio = new Date();
    this.activa = true;
    this.registrarActividad('Sesión iniciada');
  }

  cerrar() {
    this.activa = false;
    this.registrarActividad('Sesión cerrada');
  }

  registrarActividad(evento) {
    this.actividad.push({
      evento: evento,
      hora: new Date()
    });
  }

  estaActiva() {
    return this.activa;
  }
}

module.exports = Sesion;