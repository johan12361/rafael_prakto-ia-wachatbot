//TT MODULOS
import { CONTACTOS } from '../../../config/bot.mjs'

export function DatosUsuario(userid) {
  let txt = 'Nombre: Desconocido'
  const contacto = CONTACTOS.LISTA_CONTACTOS.find((obj) => String(obj.TELEFONO) === String(userid))
  if (contacto) {
    txt = 'Nombre: ' + contacto.NOMBRE
  }
  //console.log(txt)
  return txt
}
