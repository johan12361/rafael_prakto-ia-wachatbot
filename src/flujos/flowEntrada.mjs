import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { start } from './idle.mjs'
import { BOT } from '../config/bot.mjs'
import { ComprobrarListaNegra } from '../config/listaNegra.mjs'
//TT FLUJOS
import { flowIAinfo } from './IA/flowIAinfo.mjs'

// TT FLUJO ENTRADA
export const flowEntrada = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    // FF ESTADO DEL BOT
    if (!BOT.ESTADO) return

    // ff COMPROBAR LISTA NEGRA
    if (ComprobrarListaNegra(ctx)) return

    // FF Star IDLE
    start(ctx, gotoFlow, BOT.IDLE_TIME * 60)

    //SS IR A FLUJO INFO
    return gotoFlow(flowIAinfo)
  }
)

// TT FLUJO ENTRADA AUDIO
export const flowEntradaAudio = addKeyword(EVENTS.VOICE_NOTE).addAction(async (ctx, { gotoFlow }) => {
  return gotoFlow(flowEntrada)
})

// TT FLUJO ENTRADA MEDIA
export const flowEntradaMedia = addKeyword(EVENTS.MEDIA).addAction(async (ctx, { gotoFlow }) => {
  return gotoFlow(flowEntrada)
})

// TT FLUJO ENTRADA DOCUMENTO
export const flowEntradaDoc = addKeyword(EVENTS.DOCUMENT).addAction(async (ctx, { gotoFlow }) => {
  return gotoFlow(flowEntrada)
})

// TT FLUJO ENTRADA LOCACION
export const flowEntradaLoc = addKeyword(EVENTS.LOCATION).addAction(async (ctx, { gotoFlow }) => {
  return gotoFlow(flowEntrada)
})
