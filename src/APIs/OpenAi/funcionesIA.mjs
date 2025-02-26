//TT MODULOS
import { EnviarTextoOpenAI } from './enviarTextoOpenAI.mjs'
import { ENUNGUIONES } from './guiones.mjs'

//TT FUNCIONES
import { IASolicitarAyuda, SolicitarAyuda } from './funciones/solicitarAyuda.mjs'
import { IACitasActuales, CitasActuales } from './funciones/agenda/citasActuales.mjs'
import { IAAgendarCita, AgendarCita } from './funciones/agenda/agendarCita.mjs'
import { IACancelarCita, CancelarCita } from './funciones/agenda/cancelarCita.mjs'
import { IAObtenerDisponibilidad, ObtenerDisponibilidad } from './funciones/agenda/obtenerDisponibilidad.mjs'

//TT RETORNAR FUNCIONES
export function FuncionesIA(guion) {
  if (guion === ENUNGUIONES.INFO) {
    return [IASolicitarAyuda, IACitasActuales, IAAgendarCita, IACancelarCita, IAObtenerDisponibilidad]
  } else {
    return [IASolicitarAyuda]
  }
}

//TT COMPROBAR LLAMADA A FUNCION
export async function DetectarFuncion(message, userId, guion, estado, funciones) {
  if (message.function_call) {
    //Cargar argumentos
    const nombreFuncion = message.function_call.name
    const functionArgs = JSON.parse(message.function_call.arguments)
    console.log(`🧩 Se llamo a una funcion desde IA: ${nombreFuncion}`, functionArgs)

    let resp = ''
    //SS SOLICITAR AYUDA
    if (nombreFuncion === 'SolicitarAyuda') {
      resp = await SolicitarAyuda(userId, functionArgs.duda)
    }
    //SS CITAS ACTUALES
    else if (nombreFuncion === 'CitasActuales') {
      resp = await CitasActuales(userId)
    }
    //SS AGENDAR CITA
    else if (nombreFuncion === 'AgendarCita') {
      resp = await AgendarCita(
        userId,
        functionArgs.fecha,
        functionArgs.hora,
        functionArgs.nombre,
        functionArgs.motivo
      )
    }
    //SS CANCELAR CITA
    else if (nombreFuncion === 'CancelarCita') {
      resp = await CancelarCita(userId, functionArgs.idCita)
    }
    //SS OBTENER DISPONIBILIDAD
    else if (nombreFuncion === 'ObtenerDisponibilidad') {
      resp = await ObtenerDisponibilidad(functionArgs.fecha)
    }

    //FF REGRESAR LLAMADA
    const llamada = [message, { role: 'function', name: nombreFuncion, content: resp }]
    const res = await EnviarTextoOpenAI(resp, userId, guion, estado, llamada)
    return res.respuesta
  }
  return message.content
}
