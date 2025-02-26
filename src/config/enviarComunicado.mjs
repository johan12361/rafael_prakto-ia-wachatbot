import 'dotenv/config'
import { getTable, patchTable, postTable } from 'appsheet-connect'

//TT MODULOS
import {
  BOT,
  APPSHEETCONFIG,
  CONFIG_ENV,
  CONTACTOS,
  COMUNICADOS,
  ActualizarComunicados,
  ActualizarContactos
} from './bot.mjs'
import { PausaCond, ObtenerFechaActual, ObtenerHoraActual } from '../funciones/tiempo.mjs'
import { EnviarMensaje } from '../funciones/proveedor.mjs'

const propiedades = {
  UserSettings: {
    DETECTAR: false
  }
}

//TT ENVIAR COMUNICADO
export async function EnviarComunicado(id) {
  //actualizar
  await Promise.all([ActualizarComunicados(), ActualizarContactos()])
  //buscar comunicado
  const comunicado = COMUNICADOS.LISTA_COMUNICADOS.find((obj) => obj.ID === id)
  if (comunicado) {
    console.log('✅ Comunicado encontrado')
    const destinos = CONTACTOS.LISTA_CONTACTOS.filter((_cont) => _cont.ETIQUETA === comunicado.ETIQUETA)
    if (destinos.length < 1) {
      return { res: 'no hay destinatarios' }
    }
    const reg = await getTable(APPSHEETCONFIG, CONFIG_ENV.REG_COMUNICADOS)
    const registros = reg.filter((_reg) => _reg.COMUNICADO === comunicado.ID)

    //filtar destinos
    const listaActual = FiltarDestinos(destinos, registros)
    if (listaActual.length < 1) {
      console.log('✅ Enviado a todos')
      return { res: 'Enviados a todos' }
    }
    EnviarMensajeComunicado(comunicado, listaActual)
    return { res: 'Enviando...' }
  } else {
    console.log('❌ Comunicado no encontrado')
  }
  return { res: 'Error al enviar comunicado' }
}

//SS FILTRAR DESTINOS
function FiltarDestinos(destinos, registros) {
  let listaActual = []
  //descartar enviados
  if (registros.length > 0) {
    for (const destino of destinos) {
      let enviado = false
      for (const registro of registros) {
        if (destino.TELEFONO === registro.CONTACTO) {
          enviado = true
          break
        }
      }
      if (!enviado) {
        listaActual.push(destino)
      }
    }
  }
  //enviar a todos
  else {
    listaActual = destinos
  }
  return listaActual
}

//SS ENVIAR MENSAJE
async function EnviarMensajeComunicado(comunicado, destinos) {
  const intervalo = parseInt(comunicado.INTERVALO, 10) ? parseInt(comunicado.INTERVALO, 10) : 5
  const mensaje = comunicado.MENSAJE
  let ruta = {}
  //Si es imagen URL
  if (comunicado.TIPO !== 'ninguno') {
    ruta = { media: comunicado.URL }
  }

  //Enviar mensajes
  for (let i = 0; i < destinos.length; i++) {
    const estado = `Enviando ${i + 1} de ${destinos.length}`
    ActualizarComunicado(comunicado.ID, estado, 'ENVIANDO')
    await PausaCond(intervalo * 60, () => estadoComunicado(comunicado.ID), 'Cancelando...', 5000)

    //comprobar conexion de bot
    if (BOT.CONEXION === 'Desconectado') {
      const _estado = `Bot desconectado en el envio de ${i} de ${destinos.length}`
      console.log('Envio de comunicado cancelado')
      ActualizarComunicado(comunicado.ID, _estado, '')
      return
    }

    //comprobar estado de comunicado
    const _registro = COMUNICADOS.LISTA_COMUNICADOS.find((obj) => obj.ID === comunicado.ID)
    if (_registro && _registro.ESTADO === 'Cancelando...') {
      const _estado = `Cancelado ${i} de ${destinos.length}`
      console.log('Envio de comunicado cancelado')
      ActualizarComunicado(comunicado.ID, _estado, '')
      return
    }

    //enviar mensaje
    const res = await EnviarMensaje(destinos[i].TELEFONO, mensaje, ruta)
    if (res) {
      console.log('✅ comunicado enviado a: ' + destinos[i].TELEFONO)
      CrearRegistro(comunicado.ID, destinos[i].TELEFONO, 'Enviado')
    } else {
      console.log('❌ Error al enviar comunicado a: ' + destinos[i].TELEFONO)
      CrearRegistro(comunicado.ID, destinos[i].TELEFONO, 'Error al enviar')
    }
  }
  console.log('✅ Comunicado enviado a todos')
  ActualizarComunicado(comunicado.ID, 'Comunicado enviado a todos', '')
}

//SS ACTUALIZAR COMUNICADO
export async function ActualizarComunicado(id, estado, proceso = '') {
  const act = {
    ID: id,
    ESTADO: estado,
    PROCESO: proceso
  }
  const res = await patchTable(APPSHEETCONFIG, CONFIG_ENV.COMUNICADOS, act, propiedades)
  if (res) {
    console.log('✅ Comunicado actualizado')
  }
}

//SS CREAR REGISTRO
async function CrearRegistro(comunicado, contacto, estado) {
  const propiedades = { Locale: 'en-GB', Timezone: 'Pacific Standard Time' }
  const reg = {
    COMUNICADO: comunicado,
    CONTACTO: contacto,
    ESTADO: estado,
    FECHA: ObtenerFechaActual(),
    HORA: ObtenerHoraActual()
  }
  const res = await postTable(APPSHEETCONFIG, CONFIG_ENV.REG_COMUNICADOS, reg, propiedades)
  if (res) {
    console.log('✅ Registro creado')
  }
}

//SS FORMATERAR NOMBRE
/*
function formatearNombreArchivo(str) {
  // Elimina caracteres no válidos para un nombre de archivo en la mayoría de los sistemas operativos
  return str
    .trim() // Elimina espacios al principio y al final
    .replace(/[<>:"/\\|?*]/g, '') // Reemplaza caracteres no permitidos
    .replace(/\s+/g, '_') // Reemplaza los espacios por guiones bajos
}
*/

function estadoComunicado(id) {
  const reg = COMUNICADOS.LISTA_COMUNICADOS.find((obj) => obj.ID === id)
  return reg.ESTADO
}
