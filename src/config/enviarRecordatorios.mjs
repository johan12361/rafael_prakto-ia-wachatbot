import 'dotenv/config'
import { getTable, patchTable } from 'appsheet-connect'

//TT MODULOS
import { APPSHEETCONFIG, CON_CITAS, CONFIG_ENV } from './bot.mjs'
import { Esperar, ConvertirFechaExplicita, ConvertirA12Horas } from '../funciones/tiempo.mjs'
import { EnviarMensaje } from '../funciones/proveedor.mjs'
import { AgregarMensajeHistorial } from '../APIs/OpenAi/historial.mjs'
import { ENUM_ESTADOCITA } from '../APIs/OpenAi/funciones/agenda/enum_cita.mjs'

//SS ENUM RECORDATORIO
const ENUM_NOTI = {
  DIA: 'Primera notificacion',
  HORA: 'Segunda notificacion'
}

//TT ENVIAR RECORDATORIOS
export async function EnviarRecordatorios() {
  if (CON_CITAS.RECORDATORIO) {
    console.log('⌛ ENVIADO RECORDATORIO DE CITAS')
    const hoy = new Date()
    const agenda = await getTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA)
    const citas = agenda.filter(
      (obj) => convertirADate(obj.FECHA, obj.HORA) >= hoy && String(obj.ESTADO) === ENUM_ESTADOCITA.SOLICITADA
    )
    if (citas.length < 1) {
      return console.log('⌛ NO HAY CITAS PARA ENVIAR RECORDATORIO')
    }
    Enviar(citas)
  } else {
    return console.log('⌛ RECORDATORIOS DESACTIVADOS')
  }
}

//SS CONVERTIR A FECHA Y HORA
function convertirADate(fecha, hora) {
  // Separar día, mes y año de la fecha
  const [mes, dia, anio] = String(fecha).split('/').map(Number)
  // Separar hora y minutos
  const [horas, minutos] = String(hora).split(':').map(Number)
  const fechaCompleta = new Date(anio, mes - 1, dia, horas, minutos)
  return fechaCompleta
}

//SS ENVIAR
async function Enviar(citas) {
  console.log('⌛ COMPROBANDO CITAS: ' + citas.length)
  const ahora = new Date()
  for (const cita of citas) {
    //fecha
    const partesfecha = cita.FECHA.split('/')
    const _fecha = ConvertirFechaExplicita(`${partesfecha[1]}/${partesfecha[0]}/${partesfecha[2]}`)
    const _hora = ConvertirA12Horas(cita.HORA)
    const tiempoCita = convertirADate(cita.FECHA, cita.HORA)

    //SS DIAS
    if (!cita.RECORDATORIO && esMenorAHoras(tiempoCita, ahora, 24 * CON_CITAS.DIAS_ANTES)) {
      console.log('⌛ ENVIADO RECORDATORIO DE CITAS (DIAS) A: ' + cita.NOMBRE)
      const msjUsuario = CrearMensaje(cita, CON_CITAS.MSJ_DIAS, _fecha, _hora)
      const resUsuario = await EnviarMensaje(cita.CONTACTO, msjUsuario)
      if (resUsuario) {
        console.log(`⌛ ✅ RECORDATORIO (DIAS) ENVIADO A: ${cita.NOMBRE}\nCON EL MENSAJE:\n ${msjUsuario}`)
        cita.RECORDATORIO = ENUM_NOTI.DIA
        const act = {
          ID: cita.ID,
          RECORDATORIO: ENUM_NOTI.DIA
        }
        await patchTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA, act)
        AgregarMensajeHistorial(cita.CONTACTO, msjUsuario)
        await Esperar(10)
      }
    }
    //SS HORAS
    else if (
      cita.RECORDATORIO !== ENUM_NOTI.HORA &&
      esMenorAHoras(tiempoCita, ahora, CON_CITAS.HORAS_ANTES + 1)
    ) {
      console.log('⌛ ENVIADO RECORDATORIO DE CITAS (HORAS) A: ' + cita.NOMBRE)
      const msjUsuario = CrearMensaje(cita, CON_CITAS.MSJ_HORAS, _fecha, _hora)
      const resUsuario = await EnviarMensaje(cita.CONTACTO, msjUsuario)
      if (resUsuario) {
        console.log(`⌛ ✅ RECORDATORIO (HORAS) ENVIADO A: ${cita.NOMBRE}\nCON EL MENSAJE:\n ${msjUsuario}`)
        cita.RECORDATORIO = ENUM_NOTI.HORA
        const act = {
          ID: cita.ID,
          RECORDATORIO: ENUM_NOTI.HORA
        }
        await patchTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA, act)
        AgregarMensajeHistorial(cita.CONTACTO, msjUsuario)
        await Esperar(10)
      }
    }
  }
  console.log('✅ ⌛ RECORDATORIOS DE CITAS ENVIADAS')
}

//SS COMPROBAR HORAS
function esMenorAHoras(fecha1, fecha2, horas) {
  // Obtener el tiempo en milisegundos de ambas fechas
  const time1 = fecha1.getTime()
  const time2 = fecha2.getTime()

  // Calcular la diferencia en milisegundos
  const diferenciaMilisegundos = Math.abs(time1 - time2)

  // Convertir las horas dadas a milisegundos (horas * 60 minutos * 60 segundos * 1000 milisegundos)
  const horasMilisegundos = horas * 60 * 60 * 1000
  // Comparar si la diferencia es menor a las horas especificadas
  const resultado = diferenciaMilisegundos < horasMilisegundos
  return resultado
}

//SS CREAR MENSAJE
export function CrearMensaje(cita, mensaje, fecha, hora) {
  let txt = mensaje
  txt = txt.replaceAll('[FECHA]', fecha)
  txt = txt.replaceAll('[HORA]', hora)
  txt = txt.replaceAll('[NOMBRE]', cita.NOMBRE)
  txt = txt.replaceAll('[MOTIVO]', cita.MOTIVO)
  txt = txt.replaceAll('[NOTA]', cita.NOTA)
  return txt
}
