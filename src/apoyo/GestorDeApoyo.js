class GestorDeApoyo {
  constructor() {
    this.solicitudesActivas = [];
    this.tareasConApoyo = [];
  }

  registrarSolicitud(tarea, motivo) {
    tarea.registrarMotivo(motivo);
    this.solicitudesActivas.push(tarea);
  }

  validarPropietario(tarea, colaborador) {
    return tarea.propietario === colaborador.nombre;
  }

  actualizarTareas(tarea, colaborador) {
    if (!this.validarPropietario(tarea, colaborador)) {
      return false;
    }
    tarea.cambiarEstado('RequiereApoyo');
    this.tareasConApoyo.push(tarea);
    return true;
  }

  mostrarTareas() {
    return this.tareasConApoyo;
  }
}

module.exports = GestorDeApoyo;