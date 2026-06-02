class Tarea {
  constructor(titulo, propietario) {
    this.idTarea = Date.now().toString();
    this.titulo = titulo;
    this.propietario = propietario;
    this.estado = 'Pendiente';
    this.motivoApoyo = null;
  }

  cambiarEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }

  consultarEstado() {
    return this.estado;
  }

  registrarMotivo(motivo) {
    this.motivoApoyo = motivo;
  }

  marcarApoyo(quienMarca) {
    if (quienMarca !== this.propietario) {
      return false;
    }
    this.estado = 'RequiereApoyo';
    return true;
  }
}

module.exports = Tarea;