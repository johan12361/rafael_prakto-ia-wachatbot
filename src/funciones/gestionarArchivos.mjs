// Función genérica para gestionar colecciones
const gestionarColeccion = (coleccion) => ({
  obtener: (userId) => {
    if (!coleccion[userId]) {
      coleccion[userId] = []
    }
    return coleccion[userId]
  },
  agregar: (userId, item) => {
    if (!coleccion[userId]) {
      coleccion[userId] = []
    }
    coleccion[userId].push(item)
  },
  borrar: (userId) => {
    if (coleccion[userId]) {
      delete coleccion[userId]
      return true
    }
    return false
  }
})

// Instancias para VOZ e IMG
const VOZ = {}
const IMG = {}
const DOC = {}

export const Voz = gestionarColeccion(VOZ)
export const Img = gestionarColeccion(IMG)
export const Doc = gestionarColeccion(DOC)

//ESTADO
const ESTADO = {}

export function ObtenerEstado(userId) {
  if (!ESTADO[userId]) {
    ESTADO[userId] = { tipoMensaje: 0 }
  }
  return ESTADO[userId]
}
export function ActualizarEstado(userId, estado) {
  if (!ESTADO[userId]) {
    ESTADO[userId] = estado
  }
  ESTADO[userId] = estado
}
