//TT MODULOS
import { MensajeEntrante, MensajeSaliente } from '../../funciones/CRM/controlMensajes.mjs'
import { CONTACTOS } from '../../config/bot.mjs'

//TT DETECTAR MENSAJES
export function DetectarMensajes(baileys, bot) {
  //console.log(baileys)
  baileys.on('message', (ctx) => {
    if (!ValidarContacto(ctx.from)) {
      return
    }
    console.log('💬 mensaje entrante', ctx.body)
    MensajeEntrante(ctx)
  })
  bot.on('send_message', (msj) => {
    if (!ValidarContacto(msj.from)) {
      return
    }
    console.log('💬 mensaje saliente', msj.answer)
    MensajeSaliente(msj.answer, msj.from)
  })
}

function ValidarContacto(userId) {
  const contacto = CONTACTOS.LISTA_CONTACTOS.find((item) => String(item.TELEFONO) === String(userId))
  if (!contacto) {
    return false
  }
  if (contacto.GUARDAR_CHAT) {
    return true
  }
  return false
}
