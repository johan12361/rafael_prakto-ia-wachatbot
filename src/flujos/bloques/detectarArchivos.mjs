//TT MODULOS
import { GuardarArchivos } from '../../funciones/proveedor.mjs'
import { BOT } from '../../config/bot.mjs'
import { Voz, Img, ActualizarEstado, Doc } from '../../funciones/gestionarArchivos.mjs'

//FF TIPOS DE ARCHIVOS
export const ENUM_TIPO_ARCHIVO = {
  TEXTO: 0,
  IMAGEN: 1,
  NOTA_VOZ: 2,
  DOCUMENTO: 3
}

//TT FUNCION PRINCIPAL: DetectarArchivos
export async function DetectarArchivos(ctx, state) {
  if (ctx.body.includes('_event_media_')) {
    return await procesarImagen(ctx)
  } else if (ctx.body.includes('_event_voice_note_')) {
    return await procesarNotaVoz(ctx)
  } else if (ctx.body.includes('_event_document_')) {
    return await procesarDocumento(ctx)
  } else if (ctx.body.includes('_event_location_')) {
    return await procesarLocacion(ctx)
  } else {
    return await procesarTexto(ctx)
  }
}

//SS FUNCION: Procesar Imagen
async function procesarImagen(ctx) {
  console.log('📁 🌄 imagen detectado')
  //PROCESA
  if (BOT.PROCESAR_IMG) {
    const ruta = await GuardarArchivos(ctx)
    if (ruta) {
      const img = {
        tipo: ENUM_TIPO_ARCHIVO.IMAGEN,
        ruta
      }
      Img.agregar(ctx.from, img)
      let txt = `[${ctx.body}]`
      if (ctx.message?.imageMessage?.caption) {
        txt = `${ctx.message.imageMessage.caption}\n[${ctx.body}]`
      }
      ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.IMAGEN })
      return {
        from: ctx.from,
        body: txt
      }
    }
  }
  //NO PROCESAR
  else {
    let txt = `[${ctx.body}]`
    if (ctx.message?.imageMessage?.caption) {
      txt = `${ctx.message.imageMessage.caption}\n[${ctx.body}]`
    }
    ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.TEXTO })
    return { from: ctx.from, body: txt }
  }
}

//SS FUNCION: Procesar Nota de Voz
async function procesarNotaVoz(ctx) {
  console.log('📁 🎵 nota de voz detectada')
  //PROCESAR
  if (BOT.PROCESAR_AUDIOS) {
    const ruta = await GuardarArchivos(ctx)
    if (ruta) {
      const voz = {
        tipo: ENUM_TIPO_ARCHIVO.NOTA_VOZ,
        ruta
      }
      Voz.agregar(ctx.from, voz)
      ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.NOTA_VOZ })
      return { from: ctx.from, body: '' }
    }
  }
  //NO PROCESAR
  else {
    ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.TEXTO })
    return { from: ctx.from, body: `[${ctx.body}]` }
  }
}

//SS FUNCION: Procesar Documento
async function procesarDocumento(ctx) {
  console.log('📁 📦 documento detectado')
  const ruta = await GuardarArchivos(ctx)
  if (ruta) {
    const doc = {
      tipo: ENUM_TIPO_ARCHIVO.DOCUMENTO,
      ruta
    }
    Doc.agregar(ctx.from, doc)
    ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.DOCUMENTO })
    let txt = `[${ctx.body}]`
    if (ctx.message?.documentWithCaptionMessage?.message?.documentMessage?.caption) {
      txt = `${ctx.message.documentWithCaptionMessage.message.documentMessage.caption}\n[${ctx.body}]`
    }
    return { from: ctx.from, body: txt }
  }
  ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.TEXTO })
  return { from: ctx.from, body: `[${ctx.body}]` }
}

//SS FUNCION: Procesar Locacion
async function procesarLocacion(ctx) {
  console.log('📁 📍 locacion detectado')
  const locacion = `_event_location_ {degreesLatitude: ${ctx.message.locationMessage.degreesLatitude}, degreesLongitude: ${ctx.message.locationMessage.degreesLongitude}}`
  ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.TEXTO })
  return { from: ctx.from, body: locacion }
}

//SS FUNCION: Procesar Texto
async function procesarTexto(ctx) {
  console.log('📄 texto detectado')
  ActualizarEstado(ctx.from, { tipoMensaje: ENUM_TIPO_ARCHIVO.TEXTO })
  return { from: ctx.from, body: ctx.body }
}
