//TT MODULOS
import { Notificar, ENUM_NOTI } from '../../../config/notificaciones.mjs'

//TT SOLICITAR AYUDA
export async function SolicitarAyuda(userID, duda) {
  const msj = `🤖 El usuario con el número de teléfono ${userID} tiene la siguiente duda:\n\n_${duda}_`
  Notificar(ENUM_NOTI.AYUDA, { msj })
  return 'Notificacion enviada a asesor'
}

//FF FUNCION IA
export const IASolicitarAyuda = {
  name: 'SolicitarAyuda',
  description: 'Envía una notificación al asesor para solicitar que continúe con la conversación',
  parameters: {
    type: 'object',
    properties: {
      duda: {
        type: 'string',
        description: 'Resumen de la inquietud detallada del cliente que se enviará al asesor'
      }
    },
    required: ['duda'],
    additionalProperties: false
  }
}
