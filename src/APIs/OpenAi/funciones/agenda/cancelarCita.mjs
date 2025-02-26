import 'dotenv/config'
import { getTable, patchTable } from 'appsheet-connect'

//TT MODULOS
import { APPSHEETCONFIG, CONFIG_ENV } from '../../../../config/bot.mjs'
import { ENUM_ESTADOCITA } from './enum_cita.mjs'
import { ENUM_NOTI, Notificar } from '../../../../config/notificaciones.mjs'
import { ConvertirFechaExplicita } from '../../../../funciones/tiempo.mjs'

//TT CANCELAR CITA
export async function CancelarCita(userId, idCita) {
  //comprobar datos
  if (!idCita) {
    console.log('falta id de cita')
    return 'falta id de cita'
  }
  //comprobar cita
  const agenda = await getTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA)
  const cita = agenda.find((obj) => String(obj.ID) === String(idCita))
  if (!cita) {
    console.log('cita no encontrada')
    return 'cita no encontrada'
  }
  if (cita.ESTADO === ENUM_ESTADOCITA.CANCELADA) {
    console.log('cita ya cancelada')
    return 'cita ya cancelada'
  }
  if (cita.ESTADO === ENUM_ESTADOCITA.COMPLETA) {
    console.log('cita ya completada')
    return 'cita ya completada'
  }
  //comprobar usuario
  if (String(cita.CONTACTO) !== String(userId)) {
    console.log('no puedes cancelar esta cita')
    return 'Error: No puedes cancelar esta cita'
  }

  //actualizar cita
  const res = await patchTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA, {
    ID: idCita,
    ESTADO: ENUM_ESTADOCITA.CANCELADA
  })
  if (res) {
    console.log('✅ 📅 cita cancelada con exito')

    const [mes, dia, anio] = cita.FECHA.split('/').map(Number)
    const fecha = ConvertirFechaExplicita(`${dia}/${mes}/${anio}`)
    const mensaje = `El usuario *${cita.NOMBRE}* con numero de telefono ${userId} *cancelo* la cita con los siguientes datos:\n* *Fecha:* ${fecha}\n* *Hora:* ${cita.HORA}\n* *Motivo:* ${cita.MOTIVO}`
    Notificar(ENUM_NOTI.CITA, { msj: mensaje })
    return 'cita cancelada con exito'
  } else {
    console.log('❌ error al cancelar cita')
    return 'error al cancelar cita'
  }
}

//FF FUNCION IA
export const IACancelarCita = {
  name: 'CancelarCita',
  description: 'Cancela una cita',
  parameters: {
    type: 'object',
    properties: {
      idCita: {
        type: 'string',
        description: 'ID de la cita que se desea cancelar'
      }
    },
    required: ['idCita'],
    additionalProperties: false
  }
}
