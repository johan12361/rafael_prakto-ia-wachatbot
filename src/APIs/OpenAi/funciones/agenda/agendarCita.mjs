import 'dotenv/config'
import { postTable } from 'appsheet-connect'

//TT MODULOS
import { APPSHEETCONFIG, CONFIG_ENV } from '../../../../config/bot.mjs'
import { ObtenerDisponibilidad } from './obtenerDisponibilidad.mjs'
import { ENUM_NOTI, Notificar } from '../../../../config/notificaciones.mjs'
import { ConvertirFechaExplicita } from '../../../../funciones/tiempo.mjs'

//TT AGENDAR CITA DE DIAGNOSTICO
export async function AgendarCita(userId, fecha, hora, nombre, motivo) {
  try {
    //comprobar datos
    if (!fecha || !hora || !nombre || !motivo) {
      console.error('Error: faltan datos para agendar la cita')
      return 'Error: faltan datos para agendar la cita'
    }

    const disponibles = await ObtenerDisponibilidad(fecha, true)
    let existe = 'NO'
    if (!Array.isArray(disponibles)) {
      return disponibles
    } else {
      for (const disp of disponibles) {
        if (disp === hora) {
          existe = hora
          break
        }
      }
      if (existe === 'NO') {
        console.error('la hora no esta disponible')
        return 'Error: la hora no esta disponible'
      }
    }
    //cita
    const cita = {
      FECHA: fecha,
      HORA: existe,
      CONTACTO: userId,
      NOMBRE: nombre,
      MOTIVO: motivo
    }

    const propiedades = { Locale: 'en-GB', Timezone: process.env.TZ }
    const res = await postTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA, cita, propiedades)
    if (res) {
      console.log('✅ 📅Cita agendada con éxito')
      const fechaExplicita = ConvertirFechaExplicita(fecha)
      const mensaje = `El usuario *${cita.NOMBRE}* con numero de telefono ${userId} *solicito* una cita con los siguientes datos:\n* *Fecha:* ${fechaExplicita}\n* *Hora:* ${cita.HORA}\n* *Motivo:* ${cita.MOTIVO}\n*`
      Notificar(ENUM_NOTI.CITA, { msj: mensaje })
      return 'Cita  agendada con éxito'
    }
    return 'Error: No se pudo agendar la cita'
  } catch (error) {
    console.error('Error al agendar la cita de diagnostico:', error)
    return 'Error Error al agendar la cita de diagnostico'
  }
}

//FF FUNCION IA
export const IAAgendarCita = {
  name: 'AgendarCita',
  description: 'Agenda una cita',
  parameters: {
    type: 'object',
    properties: {
      fecha: {
        type: 'string',
        description: 'Fecha de la cita en formato DD/MM/AAAA'
      },
      hora: {
        type: 'string',
        description: 'Hora de la cita en formato HH:MM'
      },
      nombre: {
        type: 'string',
        description: 'Nombre del usuario'
      },
      motivo: {
        type: 'string',
        description: 'Motivo de la cita'
      }
    },
    required: ['fecha', 'hora', 'nombre', 'motivo'],
    additionalProperties: false
  }
}
