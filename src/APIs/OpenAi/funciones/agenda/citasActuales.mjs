import 'dotenv/config'
import { getTable } from 'appsheet-connect'

//TT MODULOS
import { APPSHEETCONFIG, CONFIG_ENV } from '../../../../config/bot.mjs'

//TT CITAS ACTUALES
export async function CitasActuales(userId) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const agenda = await getTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA)
  const citas = agenda.filter(
    (obj) => String(obj.CONTACTO) === String(userId) && ConvertirFecha(obj.FECHA) >= hoy
  )
  if (citas.length < 1) {
    console.log('no hay citas')
    return 'no hay citas'
  } else {
    const lista = []
    for (const cita of citas) {
      const obj = {
        ID: cita.ID,
        Fecha: FormatearFecha(cita.FECHA),
        Hora: cita.HORA,
        motivo: cita.MOTIVO,
        Nombre: cita.NOMBRE,
        Estado: cita.ESTADO
      }
      lista.push(obj)
    }
    console.log('citas encontradas')
    console.log(lista)
    return JSON.stringify(lista)
  }
}

//SS CONVERTIR A FECHA
function ConvertirFecha(fecha) {
  const [mes, dia, anio] = fecha.split('/').map(Number)
  const fechaDate = new Date(anio, mes - 1, dia)
  return fechaDate
}
//SS CAMBIAR FORMATO DE FECHA
function FormatearFecha(fecha) {
  const [mes, dia, anio] = fecha.split('/').map(Number)
  return `${dia}/${mes}/${anio}`
}

//FF FUNCION IA
export const IACitasActuales = {
  name: 'CitasActuales',
  description: 'Obtiene las citas actuales del usuario (fechas en formato dd/mm/aaaa)'
}
