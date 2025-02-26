import 'dotenv/config'
import fs from 'fs'
import path from 'path'

//TT MODULOS
import { ENUM_IA_RESPUESTAS } from './IAEnumRespuestas.mjs'
import { Notificar, ENUM_NOTI } from '../../config/notificaciones.mjs'
import { MENSAJES, BOT } from '../../config/bot.mjs'
import { CargarToken } from './tokenAcceso.mjs'

//TT LLAMAR IA
/**
 * Envía un mensaje de texto a la API de OpenAI y obtiene una respuesta.
 * @param {string} paquete - El mensaje a enviar a la IA.
 * @param {string} userId - El ID del usuario que envía el mensaje.
 * @param {string} guion - Enum del guion a usar o agente.
 * @param {Object} estado - El estado actual del usuario, junto a los informacion necesaria para actualizar el prompt.
 * @returns {Promise<string>} La respuesta de la IA.
 */
export async function GenerarVoz(texto) {
  try {
    const nombre = generateUniqueFileName('mp3')
    const ruta = path.resolve('./temp/' + nombre)
    const openai = CargarToken()
    const voz = await openai.audio.speech.create({
      model: BOT.MODELO_VOZ,
      voice: BOT.VOZ,
      input: eliminarEmojis(texto)
    })
    const buffer = Buffer.from(await voz.arrayBuffer())
    await fs.promises.writeFile(ruta, buffer)
    return { respuesta: ruta, tipo: ENUM_IA_RESPUESTAS.NOTA_VOZ, texto }
  } catch (error) {
    console.error('TTS - Error al llamar a la API de OpenAI:', error)
    const msj = 'No es posible conectar con *OpenAI(TTS)*, revisa la calve de la Api, o el saldo de tu cuenta'
    Notificar(ENUM_NOTI.ERROR, { msj })
    return MENSAJES.ERROR
  }
}
//SS FUNCION: Generar ID
function generateUniqueFileName(extension) {
  const timestamp = Date.now() // Obtiene el timestamp actual
  const randomNumber = Math.floor(Math.random() * 1000) // Genera un número aleatorio
  return `file_${timestamp}_${randomNumber}.${extension}` // Combina el timestamp y el número aleatorio
}
//SS ELIMINAR EMOLLIS
function eliminarEmojis(texto) {
  return texto.replace(/([\u2600-\u27BF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/gu, '')
}
