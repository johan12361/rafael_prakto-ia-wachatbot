import { postTable } from 'appsheet-connect'
import { ObtenerFechaActual, ObtenerHoraActual } from '../../funciones/tiempo.mjs'
import { APPSHEETCONFIG, CONFIG_ENV } from '../../config/bot.mjs'

//TT APSHEET CREDENCIALES

const propiedades = { Locale: 'en-GB', Timezone: process.env.TZ }

export async function MensajeEntrante(ctx) {
  const userId = String(ctx.from)
  const mensaje = String(ctx.body)

  await postTable(
    APPSHEETCONFIG,
    CONFIG_ENV.CHATS,
    {
      TELEFONO: userId,
      FECHA: ObtenerFechaActual(),
      HORA: ObtenerHoraActual(),
      MENSAJE: mensaje,
      ROL: 'USER',
      ESTADO: 'OK'
    },
    propiedades
  )
}

export async function MensajeSaliente(msj, user) {
  const userId = String(user)
  const mensaje = String(msj)

  await postTable(
    APPSHEETCONFIG,
    CONFIG_ENV.CHATS,
    {
      TELEFONO: userId,
      FECHA: ObtenerFechaActual(),
      HORA: ObtenerHoraActual(),
      MENSAJE: mensaje,
      ROL: 'BOT',
      ESTADO: 'OK'
    },
    propiedades
  )
}
