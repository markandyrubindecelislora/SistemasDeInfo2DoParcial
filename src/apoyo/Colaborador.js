class Colaborador {
  constructor(idColaborador, nombre) {
    this.idColaborador = idColaborador;
    this.nombre = nombre;
    this.disponible = true;
  }

  marcarApoyo(tarea) {
    return tarea.marcarApoyo(this.nombre);
  }

  solicitarApoyo(tarea, motivo) {
    tarea.registrarMotivo(motivo);
    return tarea.marcarApoyo(this.nombre);
  }
}

module.exports = Colaborador;