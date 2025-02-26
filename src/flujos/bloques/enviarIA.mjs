import fs from 'fs'
//TT MODULOS
import { BOT } from '../../config/bot.mjs'
import { ENUM_TIPO_ARCHIVO } from './detectarArchivos.mjs'
import { EnviarTextoOpenAI } from '../../APIs/OpenAi/enviarTextoOpenAI.mjs'
import { EnviarImagenOpenAI } from '../../APIs/OpenAi/enviarImagenOpenAI.mjs'
import { convertOggToMp3 } from '../../funciones/convertirMp3.mjs'
import { EnviarAudioOpenAI } from '../../APIs/OpenAi/enviarAudioOpenAI.mjs'
import { GenerarVoz } from '../../APIs/OpenAi/generarVoz.mjs'
import { Voz, Img, Doc, ObtenerEstado } from '../../funciones/gestionarArchivos.mjs'

//TT DETECTAR TIPO DE MENSAJE
export async function EnviarIA(msj, guion, funciones, estado = {}) {
  const tipoMensaje = ObtenerEstado(funciones.ctx.from).tipoMensaje
  //
  Doc.borrar(funciones.ctx.from)
  //

  if (tipoMensaje === ENUM_TIPO_ARCHIVO.IMAGEN) {
    return await enviarImagen(msj, funciones, guion, estado)
  } else if (tipoMensaje === ENUM_TIPO_ARCHIVO.NOTA_VOZ) {
    return await enviarNotaVoz(funciones, guion, estado)
  } else if (tipoMensaje === ENUM_TIPO_ARCHIVO.DOCUMENTO) {
    return await enviarDocumento(msj, funciones, guion, estado)
  } else if (tipoMensaje === ENUM_TIPO_ARCHIVO.TEXTO) {
    return await enviarTexto(msj, funciones, guion, estado)
  }
}

//SS FUNCION: Enviar Imagen
async function enviarImagen(msj, funciones, guion, estado) {
  console.log('📤 🌄 enviando imagen')
  const objeto = { role: 'user', content: [{ type: 'text', text: msj }] }
  const datos = Img.obtener(funciones.ctx.from)
  const imagenes = datos.filter((item) => item.tipo === ENUM_TIPO_ARCHIVO.IMAGEN)

  for (const img of imagenes) {
    const imagenBase64 = fs.readFileSync(img.ruta, { encoding: 'base64' })
    const data = {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${imagenBase64}`,
        detail: BOT.CALIDA_IMAGENES
      }
    }
    objeto.content.push(data)
  }
  Img.borrar(funciones.ctx.from)
  const res = await EnviarImagenOpenAI(objeto, funciones.ctx.from, guion, estado, null, funciones)
  return res
}

//SS FUNCION: Enviar Nota de Voz
async function enviarNotaVoz(funciones, guion, estado) {
  console.log('📤 🎵 enviando nota de voz')
  const mensaje = []
  const datos = Voz.obtener(funciones.ctx.from)
  const audios = datos.filter((item) => item.tipo === ENUM_TIPO_ARCHIVO.NOTA_VOZ)

  for (const aud of audios) {
    const id = generateUniqueFileName('mp3')
    const mp3 = await convertOggToMp3(aud.ruta, id, BOT.VELOCIDAD)
    const txt = await EnviarAudioOpenAI(mp3)
    mensaje.push(txt)
  }

  Voz.borrar(funciones.ctx.from)
  console.log('🎤🎵 Nota de voz:', mensaje.join('\n'))
  const res = await EnviarTextoOpenAI(mensaje.join('\n'), funciones.ctx.from, guion, estado, null, funciones)
  return await notaVoz(res, true)
}

//SS FUNCION: Enviar Documento (placeholder)
async function enviarDocumento(msj, funciones, guion, estado) {
  console.log('📤 📦 documento detectado')
  const res = await EnviarTextoOpenAI(msj, funciones.ctx.from, guion, estado, null, funciones)
  return await notaVoz(res, false)
}

//SS FUNCION: Enviar Texto
async function enviarTexto(msj, funciones, guion, estado) {
  console.log('📤 📄 enviando texto')
  const res = await EnviarTextoOpenAI(msj, funciones.ctx.from, guion, estado, null, funciones)
  return await notaVoz(res, false)
}

//FF FUNCION: Generar ID
function generateUniqueFileName(extension) {
  const timestamp = Date.now() // Obtiene el timestamp actual
  const randomNumber = Math.floor(Math.random() * 1000) // Genera un número aleatorio
  return `file_${timestamp}_${randomNumber}.${extension}` // Combina el timestamp y el número aleatorio
}

//SS GENERAR VOZ
async function notaVoz(res, notaAnota = false) {
  if (BOT.GENERAR_VOZ) {
    if (BOT.SIEMPRE_VOZ || notaAnota) {
      const audio = await GenerarVoz(res.respuesta)
      if (audio) {
        return audio
      }
    }
  }
  return res
}
