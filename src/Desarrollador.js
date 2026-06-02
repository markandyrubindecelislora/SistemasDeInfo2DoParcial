class Desarrollador {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
    this.editorActivo = null;
  }

  abrirEditor(editor) {
    this.editorActivo = editor;
    return this.editorActivo;
  }

  escribirContenido(contenido) {
    if (this.editorActivo) {
      this.editorActivo.mostrarCambios(this.id, contenido);
    }
  }

  recibirCambios(contenido) {
    this.ultimoCambioRecibido = contenido;
  }

  visualizarCambios() {
    return this.ultimoCambioRecibido;
  }
}

module.exports = Desarrollador;