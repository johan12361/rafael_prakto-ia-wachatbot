import 'dotenv/config'
import fs from 'fs'

//TT MODULOS
import { Notificar, ENUM_NOTI } from '../../config/notificaciones.mjs'
import { MENSAJES } from '../../config/bot.mjs'
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
export async function EnviarAudioOpenAI(audio) {
  try {
    const openai = CargarToken()
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audio),
      model: 'whisper-1',
      response_format: 'text'
    })
    return transcription
  } catch (error) {
    console.error('WHISPER - Error al llamar a la API de OpenAI:', error)
    const msj =
      'No es posible conectar con *OpenAI(WHISPER)*, revisa la calve de la Api, o el saldo de tu cuenta'
    Notificar(ENUM_NOTI.ERROR, { msj })
    return MENSAJES.ERROR
  }
}
