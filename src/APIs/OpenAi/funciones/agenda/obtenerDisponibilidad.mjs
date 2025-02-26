import 'dotenv/config'
import { getTable } from 'appsheet-connect'

//TT MODULOS
import { APPSHEETCONFIG, CON_CITAS, HORARIO, CONFIG_ENV } from '../../../../config/bot.mjs'

//TT OBTENER DISPONIBILIDAD DESARROLLO
export async function ObtenerDisponibilidad(fecha, interno = false) {
  try {
    if (!esFormatoFechaValido(fecha)) {
      console.log('la fecha no es valida')
      return 'Error: la fecha no es valida'
    }

    const dias = OrdenarPorDia()
    const [dia, mes, anio] = fecha.split('/').map(Number)
    const _fecha = new Date(anio, mes - 1, dia)

    const comprobar = ComprobarRangosDias(_fecha)
    if (comprobar !== 'OK') {
      console.log('fuera de rango de dias')
      return comprobar
    }

    //comprobar dia habil
    const _dia = dias[_fecha.getDay()]
    if (!_dia.HABIL) {
      console.log(_fecha.getDay())
      console.log(`el dia ${_dia.NOMBRE} ${fecha} no es habil`)
      return `el dia ${_dia.NOMBRE} ${fecha} no es habil`
    }
    let disponibilidad
    // Citas limitadas
    if (CON_CITAS.LIMITADAS) {
      //cargar agenda
      const dataAgenda = await getTable(APPSHEETCONFIG, CONFIG_ENV.AGENDA)
      if (!dataAgenda) {
        console.error('No hay datos de agenda')
        return 'Error: No hay datos, intentar mas tarde'
      }
      const citas = dataAgenda.filter((cit) => ConvertirFecha(cit.FECHA) === dia + '/' + mes + '/' + anio)
      disponibilidad = CalcularDisponibilidad(_dia, citas)
    }
    // Citas ilimitadas
    else {
      disponibilidad = String(_dia.HORAS).includes(' , ')
        ? String(_dia.HORAS).split(' , ')
        : [String(_dia.HORAS)]
    }

    if (disponibilidad.length < 1) {
      console.warn(`No hay disponibilidad para el dia ${fecha}`)
      return `Error: No hay disponibilidad para el dia ${fecha}`
    }
    console.log(disponibilidad)
    if (interno) {
      return disponibilidad
    } else {
      return JSON.stringify(disponibilidad)
    }
  } catch (error) {
    console.error('Error al obtener la disponibilidad de citas:', error)
    return 'Error: al obtener la disponibilidad de citas'
  }
}
//SS VALIDAR FECHA
function esFormatoFechaValido(fecha) {
  // Expresión regular para comprobar el formato D/M/AAAA o DD/MM/AAAA
  const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(\d{4})$/

  // Verificar si la fecha cumple con el formato
  return regex.test(fecha)
}

//SS ORDENAR POR DIA
function OrdenarPorDia() {
  const diasOrden = ['0', '1', '2', '3', '4', '5', '6']
  return HORARIO.DIAS.sort((a, b) => diasOrden.indexOf(a.DIA) - diasOrden.indexOf(b.DIA))
}

//SS COMPROBAR RANGOS
function ComprobarRangosDias(fechaDate) {
  const rangomin = new Date()
  rangomin.setHours(0, 0, 0, 0)
  rangomin.setDate(rangomin.getDate() + CON_CITAS.MIN_ANT)
  const rangomax = new Date()
  rangomax.setDate(rangomax.getDate() + CON_CITAS.MAX_ANT)

  if (fechaDate >= rangomin && fechaDate <= rangomax) {
    return 'OK'
  }
  //mensaje
  const inicio = rangomin.getDate() + '/' + (rangomin.getMonth() + 1) + '/' + rangomin.getFullYear()
  const fin = rangomax.getDate() + '/' + (rangomax.getMonth() + 1) + '/' + rangomax.getFullYear()
  const mensaje = `solo se puede agendar entre las fechas ${inicio} y ${fin}`
  return mensaje
}

//SS CONVERTIR A FECHA
function ConvertirFecha(fecha) {
  const [mes, dia, anio] = fecha.split('/').map(Number)
  return dia + '/' + mes + '/' + anio
}

//SS CALCULAR DISPONIBILIDAD
function CalcularDisponibilidad(dia, citas) {
  const disponibles = []
  const max = CON_CITAS.MAX_PARALELAS
  const horas = String(dia.HORAS).includes(' , ') ? String(dia.HORAS).split(' , ') : [String(dia.HORAS)]
  for (const hora of horas) {
    let disponible = true
    let contar = 0
    for (const cita of citas) {
      if (cita.HORA === hora) {
        contar++
        if (contar >= max) {
          disponible = false
          break
        }
      }
      if (!disponible) {
        break
      }
    }
    if (disponible) {
      disponibles.push(hora)
    }
  }
  return disponibles
}

//FF FUNCION IA
export const IAObtenerDisponibilidad = {
  name: 'ObtenerDisponibilidad',
  description: 'Obtiene la lista de horas disponibles para agendar una cita',
  parameters: {
    type: 'object',
    properties: {
      fecha: {
        type: 'string',
        description: 'Día que se desea consultar disponibilidad en formato DD/MM/AAAA'
      }
    },
    required: ['fecha'],
    additionalProperties: false
  }
}
