import 'dotenv/config'
import { OpenAI } from 'openai'

//TT MODULOS
import { BOT } from '../../config/bot.mjs'

//TT AGREGAR CLAVE
export function CargarToken() {
  if (BOT.KEY_IA) {
    return new OpenAI({
      apiKey: BOT.KEY_IA
    })
  } else {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
}
