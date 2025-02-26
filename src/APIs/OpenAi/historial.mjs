//TT MODULOS
import { ConstrurGuion } from './guiones.mjs'

// TT HISTORIAL
let HistorialConv = {}
export function ObtenerHistorial(userId, guion, estado) {
  const _txt = ConstrurGuion(guion, estado, userId)
  if (!HistorialConv[userId]) {
    HistorialConv[userId] = []
    HistorialConv[userId].push({ role: 'system', content: _txt })
  } else {
    HistorialConv[userId][0] = { role: 'system', content: _txt }
  }
  return HistorialConv[userId]
}

//TT BORRAR ULTIMOS MENSAJES
/**
 * Borra los últimos mensajes del historial de un usuario.
 * @param {string} userId - El ID del usuario cuyo historial se va a actualizar (numero telefono con extension).
 */
export function BorrarMensajes(userId) {
  if (HistorialConv[userId] && HistorialConv[userId].length > 1) {
    HistorialConv[userId].splice(-2)
  }
}

//TT LIMPIAR HISTORIAL
/**
 * Limpia el historial de conversaciones para un usuario específico.
 * @param {string} userId - El ID del usuario cuyo historial se va a limpiar (numero telefono con extension).
 */
export function LimpiarHistorial(userId) {
  console.log('se limpia historial para: ' + userId)
  HistorialConv[userId] = null
}
//TT AGREGAR MENSAJE
/**
 * Agrega al historial de conversaciones un nuevo mensaje.
 * @param {string} userId Numero de telefono con extension
 * @param {string} mensaje Mensaje a agregar
 * @param {string} rol Rol del mensaje
 */
export function AgregarMensajeHistorial(userId, mensaje, rol = 'assistant') {
  console.log(`💬 Se agrega mensaje para: ${userId} con rol: ${rol} y mensaje\n${mensaje}`)
  if (HistorialConv[userId]) {
    HistorialConv[userId].push({ role: rol, content: mensaje })
  } else {
    HistorialConv[userId] = [{}, { role: rol, content: mensaje }]
  }
}

//TT BORRAR TODO EL HISTORIAL
/**
 * Limpia el historial de conversaciones para todos los usuarios.
 */
export function BorrarTodoHistorial() {
  console.log('se limpia todo el historial')
  HistorialConv = {}
}
