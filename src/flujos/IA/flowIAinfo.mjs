import 'dotenv/config'
import { addKeyword, EVENTS } from '@builderbot/bot'
// TT MODULOS
import { ENUM_IA_RESPUESTAS } from '../../APIs/OpenAi/IAEnumRespuestas.mjs'
import { AgruparMensaje } from '../../funciones/agruparMensajes.mjs'
import { BOT } from '../../config/bot.mjs'
import { Escribiendo, MarcarComoLeido } from '../../funciones/proveedor.mjs'
import { Esperar } from '../../funciones/tiempo.mjs'
import { ENUNGUIONES } from '../../APIs/OpenAi/guiones.mjs'
import { ComprobrarListaNegra } from '../../config/listaNegra.mjs'
//TT FLUJOS
import { reset, idleFlow } from '../idle.mjs'
//TT BLOQUES
import { FormatoEnriquecido } from '../bloques/formatoEnriquecido.mjs'
import { DetectarArchivos } from '../bloques/detectarArchivos.mjs'
import { EnviarImagenes } from '../bloques/enviarMedia.mjs'
import { EnviarIA } from '../bloques/enviarIA.mjs'

// TT FLUJO INFO
export const flowIAinfo = addKeyword(EVENTS.ACTION)
  //TT FLUJO TRANSICION
  .addAction(async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
    const detectar = await DetectarArchivos(ctx, state)
    AgruparMensaje(detectar, async (txt) => {
      //SS respuesta

      console.log(
        `👤 FLUJO TRANSICION INFO Escribe: ${ctx.name} con numero: ${ctx.from} y escribe->\n ${txt}`
      )
      const res = await EnviarIA(txt, ENUNGUIONES.INFO, {
        ctx,
        flowDynamic,
        endFlow,
        gotoFlow,
        fallBack,
        state
      })
      if (BOT.VISTO) MarcarComoLeido(ctx)
      Escribiendo(ctx, res.tipo)
      await Responder(res, ctx, flowDynamic, endFlow, gotoFlow, fallBack, state)
    })
  })
  //TT FLUJO DE CONVERSACION
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, gotoFlow, fallBack, provider, state }) => {
      const detectar = await DetectarArchivos(ctx, state)
      AgruparMensaje(detectar, async (txt) => {
        // ff COMPROBAR LISTA NEGRA
        if (ComprobrarListaNegra(ctx) || !BOT.ESTADO) return gotoFlow(idleFlow)
        // ff RESET IDLE
        reset(ctx, gotoFlow, BOT.IDLE_TIME * 60)

        console.log(
          `👤 FLUJO DE CONVERSACION INFO Escribe: ${ctx.name} con numero: ${ctx.from} y escribe->\n ${txt}`
        )

        const res = await EnviarIA(txt, ENUNGUIONES.INFO, {
          ctx,
          flowDynamic,
          endFlow,
          gotoFlow,
          fallBack,
          state
        })
        if (BOT.VISTO) MarcarComoLeido(ctx)
        Escribiendo(ctx, res.tipo)
        await Responder(res, ctx, flowDynamic, endFlow, gotoFlow, fallBack, state)
      })
      return fallBack()
    }
  )

async function Responder(res, ctx, flowDynamic, endFlow, gotoFlow, fallBack, state) {
  //SS texto
  if (res.tipo === ENUM_IA_RESPUESTAS.TEXTO) {
    await Esperar(BOT.DELAY)
    //enviar imagenes
    const msj = await EnviarImagenes(res.respuesta, flowDynamic, ctx)
    //enviar mensaje
    console.log(`🤖 FLUJO INFO IA responde a: ${ctx.from} ->\n ${res.respuesta}`)
    return await flowDynamic(FormatoEnriquecido(msj))
  }
  //SS VOZ
  else if (res.tipo === ENUM_IA_RESPUESTAS.NOTA_VOZ) {
    //enviar nota de voz
    console.log(`🤖 FLUJO INFO IA EN VOZ 🎤 responde a: ${ctx.from} ->\n ${res.texto}`)
    return await flowDynamic([{ media: res.respuesta }])
  }
}
