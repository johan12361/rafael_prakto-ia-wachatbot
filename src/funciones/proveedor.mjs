//TT MODULOS
import { RevisarTemp } from '../funciones/directorios.mjs'
import { ENUM_IA_RESPUESTAS } from '../APIs/OpenAi/IAEnumRespuestas.mjs'

//TT ENUN DE TIPOS DE PROVEEDOR
/**
 * Enumeración de tipos de proveedor.
 * Esta constante contiene una lista de tipos de proveedores disponibles en el sistema.
 * Actualmente, solo se incluye el proveedor "Baileys".
 * @type {Object}
 * @property {string} BAILEYS - Tipo de proveedor correspondiente a "Baileys".
 */
export const ENUNPROV = {
  BAILEYS: 'Baileys'
}
//TT PROVEEDOR
/**
 * Representación de un proveedor.
 * Esta constante define un objeto que almacena información sobre un proveedor.
 * Incluye el nombre del proveedor y el tipo de proveedor.
 * @type {Object}
 * @property {string} name - Nombre del proveedor. Inicialmente vacío.
 * @property {string|null} prov - Tipo de proveedor, que puede ser un valor definido en la enumeración `ENUNPROV` o `null`.
 */
export const PROVEEDOR = {
  name: '',
  prov: null
}

//TT ENVIAR MENSAJE DE TEXTO
/**
 * Envía un mensaje de texto a través del proveedor de servicios especificado.
 * La función verifica el proveedor configurado y, si es 'Baileys', utiliza su método para enviar un mensaje de texto al número proporcionado.
 * @param {string} dest - Número de teléfono o grupo al que se enviará el mensaje. El número debe estar en formato internacional sin el prefijo '+'.
 * @param {string} msj - Mensaje de texto que se enviará.
 * @returns {Promise<string|null>} - Retorna una promesa que se resuelve con 'OK' si el mensaje se envía correctamente, o `null` si ocurre un error o no hay un proveedor configurado.
 * @throws {Error} - Lanza una excepción si ocurre un error al intentar enviar el mensaje.
 */
export async function EnviarMensaje(dest, msj, media = {}) {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    const _num = ComprobarDestinatario(dest)
    if (_num) {
      try {
        await PROVEEDOR.prov.sendMessage(_num, msj, media)
        return 'OK'
      } catch (error) {
        console.warn(`no se pudo enviar a: ${dest} el mensaje: ${msj}`, error)
        return null
      }
    } else {
      console.warn(`${dest} no es destinatario valido`)
      return null
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}

//TT ENVIAR MEDIA
/**
 * Envía una imagen a través del proveedor de servicios especificado.
 * La función verifica el proveedor configurado y, si es 'Baileys', utiliza su método para enviar una imagen al número de teléfono asociado con el contexto proporcionado.
 * @param {string} dest - Número de teléfono o grupo al que se enviará el mensaje. El número debe estar en formato internacional sin el prefijo '+'.
 * @param {string} img - URL o ruta de la imagen que se enviará.
 * @returns {Promise<string|null>} - Retorna una promesa que se resuelve con 'OK' si la imagen se envía correctamente, o `null` si ocurre un error o no hay un proveedor configurado.
 * @throws {Error} - Lanza una excepción si ocurre un error al intentar enviar la imagen.
 */
export async function EnviarMedia(dest, img) {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    const _num = ComprobarDestinatario(dest)
    if (_num) {
      try {
        await PROVEEDOR.prov.sendMedia(_num, img)
        return 'OK'
      } catch (error) {
        console.warn(`no se pudo enviar imagen a: ${dest} la imagen  ${img}`, error)
        return null
      }
    } else {
      console.warn(`${dest} no es destinatario valido`)
      return null
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}

//TT ENVIAR UBICACION
/**
 * Envía una ubicación a través del proveedor de servicios especificado.
 * La función verifica el proveedor configurado y, si es 'Baileys', utiliza su método para enviar una ubicación al número de teléfono asociado con el contexto proporcionado.
 * @param {string} dest - Número de teléfono o grupo al que se enviará el mensaje. El número debe estar en formato internacional sin el prefijo '+'.
 * @param {number} lat - Latitud de la ubicación que se enviará.
 * @param {number} lon - Longitud de la ubicación que se enviará.
 * @returns {Promise<string|null>} - Retorna una promesa que se resuelve con 'OK' si la ubicación se envía correctamente, o `null` si ocurre un error o no hay un proveedor configurado.
 * @throws {Error} - Lanza una excepción si ocurre un error al intentar enviar la ubicación.
 */
export async function EnviarUbicacion(dest, lat, lon) {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    const _num = ComprobarDestinatario(dest)
    if (_num) {
      try {
        await PROVEEDOR.prov.vendor.sendMessage(_num, {
          location: { degreesLatitude: lat, degreesLongitude: lon }
        })
        return 'OK'
      } catch (error) {
        console.warn(`no se pudo enviar ubicacion a: ${dest} la ubicacion  ${lat},${lon}`, error)
        return null
      }
    } else {
      console.warn(`${dest} no es destinatario valido`)
      return null
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}

//TT ENVIAR PRESENCIA ESCRIBIENDO
/**
 * Envía una notificación de presencia "escribiendo..." a través del proveedor de servicios especificado.
 * La función verifica el proveedor configurado y, si es 'Baileys', utiliza su método para enviar una actualización de presencia al número de teléfono asociado con el contexto proporcionado.
 * @param {Object} ctx - Contexto del mensaje que contiene la información del remitente. Se usa `ctx.key.remoteJid` para obtener el identificador del destinatario.
 * @returns {Promise<string|null>} - Retorna una promesa que se resuelve con 'OK' si la notificación se envía correctamente, o `null` si ocurre un error o no hay un proveedor configurado.
 * @throws {Error} - Lanza una excepción si ocurre un error al intentar enviar la notificación.
 */
export async function Escribiendo(ctx, tipo = ENUM_IA_RESPUESTAS.TEXTO) {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    try {
      if (tipo === ENUM_IA_RESPUESTAS.TEXTO) {
        await PROVEEDOR.prov.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
      } else if (tipo === ENUM_IA_RESPUESTAS.NOTA_VOZ) {
        await PROVEEDOR.prov.vendor.sendPresenceUpdate('recording', ctx.key.remoteJid)
      }
      return 'OK'
    } catch (error) {
      console.warn(`no se pudo enviar (Escribiendo...) a: ${ctx.from}`, error)
      return null
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}
//TT MARCAR COMO LEIDO
export async function MarcarComoLeido(ctx) {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    try {
      await PROVEEDOR.prov.vendor.readMessages([
        {
          remoteJid: ctx.key.remoteJid,
          id: ctx.key.id, // id of the message you want to read
          participant: ctx.key.participant // the ID of the user that sent the  message (undefined for individual chats)
        }
      ])
    } catch (error) {
      console.warn(`No se pudo marcar como leído a: ${ctx.from}`, error)
      return null
    }
  }
}

//TT OBTENER GRUPOS
/**
 * Obtiene una lista de grupos de WhatsApp del proveedor especificado.
 *
 * @function ObtenerGrupos
 *
 * @returns {Array<Object>|string|null} Devuelve una lista de objetos de grupos si está conectado,
 * una cadena 'DESCONECTADO' si no hay conexión, o `null` si no hay proveedor asignado.
 *
 * @description
 * La función `ObtenerGrupos`:
 * 1. Comprueba si el proveedor es `Baileys` y si está conectado.
 * 2. Si está conectado, filtra los contactos para encontrar aquellos que son grupos de WhatsApp
 *    (identificados por la presencia de `'@g.us'` en el ID).
 * 3. Devuelve una lista de estos grupos. Si no está conectado, devuelve `'DESCONECTADO'`.
 * 4. Si no hay proveedor asignado, devuelve `null`.
 */
export function ObtenerGrupos() {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    if (PROVEEDOR.prov.store?.state?.connection === 'open') {
      const result = []
      const obj = PROVEEDOR.prov.store?.contacts
      for (const key in obj) {
        if (obj[key].id.includes('@g.us')) {
          result.push(obj[key])
        }
      }
      return result
    } else {
      return 'DESCONECTADO'
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}

export function ObtenerContactos() {
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    if (PROVEEDOR.prov.store?.state?.connection === 'open') {
      const result = []
      const obj = PROVEEDOR.prov.store?.contacts
      for (const key in obj) {
        if (obj[key].id.includes('@s.whatsapp.net')) {
          result.push(obj[key])
        }
      }
      return result
    } else {
      return 'DESCONECTADO'
    }
  }
  //ss si no hay proveedor asignado
  else {
    return null
  }
}

//TT COMPROBAR DESTINATARIO
function ComprobarDestinatario(dest) {
  //si es numero de telefono
  if (/^\d+$/.test(dest)) {
    return dest + '@s.whatsapp.net'
  }
  //si es un grupos
  else {
    const grupos = ObtenerGrupos()
    if (grupos && grupos !== 'DESCONECTADO') {
      const _destino = grupos.find((obj) => obj.name === dest)
      if (_destino) {
        return _destino.id
      }
    }
  }
  return null
}

//TT GUARDAR ARCHIVOS
export async function GuardarArchivos(ctx) {
  RevisarTemp()
  //ss si el proveedr es Baileys
  if (PROVEEDOR.name === ENUNPROV.BAILEYS) {
    if (PROVEEDOR.prov.store?.state?.connection === 'open') {
      const localPath = await PROVEEDOR.prov.saveFile(ctx, { path: './temp' })
      console.log(localPath)
      return localPath
    }
  }
  return null
}
