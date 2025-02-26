import 'dotenv/config'
import { patchTable } from 'appsheet-connect'
//TT MODULOS
import { BOT, Inicializar, APPSHEETCONFIG, CONFIG_ENV } from '../config/bot.mjs'

//TT ESTADO DE CONEXION
export function ESTADO_CONEXION(provedor) {
  let escuchar = true
  //SS SE DESCONECTA DE CUENTA DE WA
  provedor.on('require_action', async () => {
    if (escuchar) {
      console.warn('❌ ❌ ❌ DESCONECTADO ❌ ❌ ❌')
      escuchar = false

      const cuenta = BOT.NUM_TEL
      ActualizarEstadoBot('Desconectado', cuenta)
    }
  })
  //SS SE CONECTA A CUENTA DE WA
  provedor.on('ready', async () => {
    const num = provedor.globalVendorArgs?.host?.phone
    const name = provedor.globalVendorArgs?.host?.name
    console.log(`Conectado a: ${name} con numero: ${num}`)
    escuchar = true

    console.log('🛜🛜🛜 CONECTADO 🛜🛜🛜')
    const cuenta = name + '\n' + num
    ActualizarEstadoBot('Conectado', cuenta)
  })
}

//ss actualizar estado del bot
async function ActualizarEstadoBot(estado, cuenta = '') {
  //iniciar datos
  await Inicializar()
  console.log('🔄 FIN DE INICIALIZACION 🔚')

  //actualizar estado de bot
  if (estado !== BOT.CONEXION || cuenta !== BOT.NUM_TEL) {
    BOT.CONEXION = estado
    BOT.NUM_TEL = cuenta
    await patchTable(APPSHEETCONFIG, CONFIG_ENV.BOT, {
      BOT: BOT.BOT,
      CONEXION: BOT.CONEXION,
      NUM_TEL: BOT.NUM_TEL
    })
    console.log('✅ CONEXION DE BOT ACTUALIZADA 🔄')
  }
}
