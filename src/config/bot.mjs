import 'dotenv/config'
import { AppSheetUser, getTable } from 'appsheet-connect'
import { getIdDocFromUrl, getTxtDoc } from 'googledocs-downloader'

//TT APSHEET CREDENCIALES
const appsheetId = process.env.APPSHEET_ID
const appsheetKey = process.env.APPSHEET_KEY
export const APPSHEETCONFIG = new AppSheetUser(appsheetId, appsheetKey)

export const CONFIG_ENV = {
  BOT: 'BOT',
  MENSAJES: 'MENSAJES',
  CONTACTOS: 'CONTACTOS',
  NOTI: 'NOTI',
  //comunicados
  COMUNICADOS: 'COMUNICADOS',
  REG_COMUNICADOS: 'REG_COMUNICADOS',
  //agenda
  CONFIG_CITAS: 'CONFIG_CITAS',
  HORARIO: 'HORARIO',
  AGENDA: 'AGENDA',
  HORAS: 'HORAS',
  //chat
  CHATS: 'CHATS'
}

//FF CONFIGURACION DE BOT
export const BOT = {
  //BOT
  BOT: process.env.BOT_NAME,
  CONEXION: 'Conectado',
  ESTADO: true,
  VISTO: true,
  //TIEMPOS
  DELAY: 0,
  ESPERA_MJS: 5,
  IDLE_TIME: 3,

  //IA GENERAL
  TEMPERATURA: 0.3,
  KEY_IA: '',
  //IA TEXTO
  MODELO_IA: 'gpt-4o-mini',
  TOKENS: 250,
  //IA IMAGENES
  PROCESAR_IMG: false,
  MODELO_IA_IMAGENES: 'gpt-4o-mini',
  TOKENS_IMAGENES: 1000,
  CALIDA_IMAGENES: 'auto',
  //IA AUDIOS
  PROCESAR_AUDIOS: false,
  VELOCIDAD: 1.5,
  //IA GENERAR VOZ
  GENERAR_VOZ: false,
  SIEMPRE_VOZ: false,
  VOZ: 'nova',
  MODELO_VOZ: 'tts-1',

  //BASE DE CONOCIMIENTOS
  URLPROMPT: '',
  //OTROS
  NUM_TEL: ''
}

//FF MENSAJES DEL BOT
export const MENSAJES = {
  ERROR: ''
}

//FF NOTIFICACIONES
export const NOTIFICACIONES = {
  CITA: true,
  DEST_CITA: [],
  AYUDA: true,
  DEST_AYUDA: [],
  ERROR: true,
  DEST_ERROR: []
}

//FF COMPORTAMIENTOS
export const CONTACTOS = {
  LISTA_CONTACTOS: []
}

//FF REFERENCIAS
export const ARCHIVO = {
  PROMPT_INFO: ''
}

//FF CONFIGURACION DE CITAS
export const CON_CITAS = {
  LIMITADAS: false,
  MAX_PARALELAS: 1,
  MIN_ANT: 1,
  MAX_ANT: 30,
  RECORDATORIO: false,
  DIAS_ANTES: 3,
  MSJ_DIAS: '',
  HORAS_ANTES: 1,
  MSJ_HORAS: ''
}

//FF HORARIO
export const HORARIO = {
  DIAS: []
}

//TT INICAR BOT
export async function Inicializar() {
  console.log('🔄 INICIALIZANDO DATOS DE BOT 🔜')
  await Promise.all([
    ActualizarBot(),
    ActualizarMensajes(),
    ActualizarContactos(),
    ActualizarNotificaciones(),
    ActualizarConfigCitas(),
    ActualizarHorario()
  ])
}

//SS ACTUALIZAR BOT
export async function ActualizarBot() {
  const data = await getTable(APPSHEETCONFIG, CONFIG_ENV.BOT)
  const bot = data.find((obj) => obj.BOT === BOT.BOT)
  if (bot) {
    BOT.CONEXION = bot.CONEXION
    BOT.ESTADO = bot.ESTADO
    BOT.VISTO = bot.VISTO

    // TIEMPOS
    BOT.DELAY = parseInt(bot.DELAY, 10) ? parseInt(bot.DELAY, 10) : 0
    BOT.ESPERA_MJS = parseInt(bot.ESPERA_MJS, 10) ? parseInt(bot.ESPERA_MJS, 10) : 5
    BOT.IDLE_TIME = parseInt(bot.IDLE_TIME, 10) ? parseInt(bot.IDLE_TIME, 10) : 3

    //IA GENERAL
    BOT.TEMPERATURA = parseFloat(bot.TEMPERATURA, 10) ? parseFloat(bot.TEMPERATURA, 10) : 0.3
    BOT.KEY_IA = bot.KEY_IA ? bot.KEY_IA : ''
    //IA TXT
    BOT.MODELO_IA = bot.MODELO_IA
    BOT.TOKENS = parseInt(bot.TOKENS, 10) ? parseInt(bot.TOKENS, 10) : 250

    //IA IMAGENES
    BOT.PROCESAR_IMG = bot.PROCESAR_IMG
    BOT.MODELO_IA_IMAGENES = bot.MODELO_IA_IMAGENES
    BOT.TOKENS_IMAGENES = parseInt(bot.TOKENS_IMAGENES, 10) ? parseInt(bot.TOKENS_IMAGENES, 10) : 250
    BOT.CALIDA_IMAGENES = bot.CALIDA_IMAGENES
    //IA AUDIOS
    BOT.PROCESAR_AUDIOS = bot.PROCESAR_AUDIOS
    BOT.VELOCIDAD = parseFloat(bot.VELOCIDAD, 10) ? parseFloat(bot.VELOCIDAD, 10) : 1.5

    /*
    //IA GENERAR VOZ
    BOT.GENERAR_VOZ = bot.GENERAR_VOZ
    BOT.SIEMPRE_VOZ = bot.SIEMPRE_VOZ
    BOT.VOZ = bot.VOZ
    BOT.MODELO_VOZ = bot.MODELO_VOZ
    */

    //BASE DE CONOCIMIENTOS
    if (bot.URLPROMPT !== '') {
      BOT.URLPROMPT = bot.URLPROMPT
      ARCHIVO.PROMPT_INFO = await getTxtDoc(getIdDocFromUrl(bot.URLPROMPT))
      console.log('✅ INFORMACION DE REFERENCIA CARGADA 📄')
    }
    //OTROS
    BOT.NUM_TEL = bot.NUM_TEL

    console.table(BOT)
    return console.log('✅ INFORMACION DE BOT CARGADA 🤖')
  }
  return console.error('❌ NO SE LOGRO CARGAR INFORMACION DE REFERENCIA')
}

//SS ACTUALIZAR MENSAJE
export async function ActualizarMensajes() {
  const data = await getTable(APPSHEETCONFIG, CONFIG_ENV.MENSAJES)
  const bot = data.find((obj) => obj.BOT === BOT.BOT)
  if (bot) {
    MENSAJES.ERROR = bot.ERROR
    return console.log('✅ INFORMACION DE MENSAJES CARGADA')
  }
  return console.error('❌ NO SE LOGRO CARGAR INFORMACION DE MENSAJES')
}

//SS ACTUALIZAR CONTACTOS
export async function ActualizarContactos() {
  const data = await getTable(APPSHEETCONFIG, CONFIG_ENV.CONTACTOS)
  if (data !== null) {
    CONTACTOS.LISTA_CONTACTOS = data

    //console.table(CONTACTOS.LISTA_CONTACTOS)
    return console.log('✅ INFORMACION DE CONTACTOS CARGADA')
  }
  return console.error('❌ NO SE LOGRO CARGAR INFORMACION DE CONTACTOS')
}

//ss ACTUALIZAR NOTIFICACIONES
export async function ActualizarNotificaciones() {
  const data = await getTable(APPSHEETCONFIG, CONFIG_ENV.NOTI)
  const bot = data.find((obj) => obj.BOT === BOT.BOT)
  if (bot) {
    //Notificar cita
    NOTIFICACIONES.CITA = bot.CITA
    NOTIFICACIONES.DEST_CITA = String(bot.DEST_CITA).includes(' , ')
      ? bot.DEST_CITA.split(' , ')
      : [String(bot.DEST_CITA)]

    //Notificar ayuda
    NOTIFICACIONES.AYUDA = bot.AYUDA
    NOTIFICACIONES.DEST_AYUDA = String(bot.DEST_AYUDA).includes(' , ')
      ? bot.DEST_AYUDA.split(' , ')
      : [String(bot.DEST_AYUDA)]

    //Notificar error
    NOTIFICACIONES.ERROR = bot.ERROR
    NOTIFICACIONES.DEST_ERROR = String(bot.DEST_ERROR).includes(' , ')
      ? bot.DEST_ERROR.split(' , ')
      : [String(bot.DEST_ERROR)]

    //console.table(NOTIFICACIONES)
    return console.log('✅ INFORMACION DE NOTIFICACIONES CARGADA')
  }
  return console.error('❌ NO SE LOGRO CARGAR INFORMACION DE NOTIFICACIONES')
}

//SS ACTUALIZAR CONFIGURACION DE CITAS
export async function ActualizarConfigCitas() {
  const data = await getTable(APPSHEETCONFIG, CONFIG_ENV.CONFIG_CITAS)
  const bot = data.find((obj) => obj.BOT === BOT.BOT)
  if (bot) {
    CON_CITAS.LIMITADAS = bot.LIMITADAS
    CON_CITAS.MAX_PARALELAS = parseInt(bot.MAX_PARALELAS, 10) ? parseInt(bot.MAX_PARALELAS, 10) : 1
    CON_CITAS.MIN_ANT = parseInt(bot.MIN_ANT, 10) ? parseInt(bot.MIN_ANT, 10) : 0
    CON_CITAS.MAX_ANT = parseInt(bot.MAX_ANT, 10) ? parseInt(bot.MAX_ANT, 10) : 30
    CON_CITAS.RECORDATORIO = bot.RECORDATORIO
    CON_CITAS.DIAS_ANTES = parseInt(bot.DIAS_ANTES, 10) ? parseInt(bot.DIAS_ANTES, 10) : 1
    CON_CITAS.MSJ_DIAS = bot.MSJ_DIAS
    CON_CITAS.HORAS_ANTES = parseInt(bot.HORAS_ANTES, 10) ? parseInt(bot.HORAS_ANTES, 10) : 1
    CON_CITAS.MSJ_HORAS = bot.MSJ_HORAS

    //console.table(CON_CITAS)
    return console.log('✅ INFORMACION DE CONFIGURACION DE CITAS CARGADA')
  }
  return console.error('❌ NO SE LOGRO CARGAR INFORMACION DE CONFIGURACION DE CITAS')
}

//SS ACTUALIZAR HORARIO
export async function ActualizarHorario() {
  const data = await getTable(APPSHEETCONFIG, CONFIG_ENV.HORARIO)
  if (data) {
    HORARIO.DIAS = data
    //console.log(HORARIO.DIAS)
    return console.log('✅ INFORMACION DE HORARIO CARGADA')
  }
  return console.error('❌ NO SE LOGRO CARGAR INFORMACION DE HORARIO')
}
