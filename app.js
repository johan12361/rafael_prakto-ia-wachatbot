import { createBot, createProvider, createFlow, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'

//TT MODULOS
import { APIREST } from './src/APIs/API_Rest.mjs'
import { ESTADO_CONEXION } from './src/funciones/estadoConexion.mjs'
import { PROVEEDOR, ENUNPROV } from './src/funciones/proveedor.mjs'
import { RevisarTemp, BorrarTemp } from './src/funciones/directorios.mjs'
import { CronXhora } from './src/funciones/cronXhora.mjs'

//TT FLUJOS
import {
  flowEntrada,
  flowEntradaAudio,
  flowEntradaMedia,
  flowEntradaDoc,
  flowEntradaLoc
} from './src/flujos/flowEntrada.mjs'
import { idleFlow } from './src/flujos/idle.mjs'
import { flowIAinfo } from './src/flujos/IA/flowIAinfo.mjs'

const FLUJOS_ENTRADA = [
  flowEntrada,
  flowEntradaAudio,
  flowEntradaMedia,
  flowEntradaDoc,
  flowEntradaLoc,
  idleFlow,
  flowIAinfo
]

// TT INICIAR BOT
const main = async () => {
  const adapterDB = new MemoryDB()
  const adapterFlow = createFlow(FLUJOS_ENTRADA)
  const adapterProvider = createProvider(BaileysProvider)

  //SS CREAR CARPETA TEMP
  RevisarTemp()
  BorrarTemp()

  //SS COMPROBAR ESTADO DE CONEXION CADA X SEGUNDOS
  ESTADO_CONEXION(adapterProvider)

  //SS ASIGNAR PROVEEDOR PARA EJECUTAR FUNCIONES
  PROVEEDOR.name = ENUNPROV.BAILEYS
  PROVEEDOR.prov = adapterProvider

  //FF CREAR BOT
  const bot = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB
  })

  //SS API REST
  APIREST(adapterProvider)

  bot.httpServer(3001)

  CronXhora()

  //SS BAILEYS API
  //DetectarMensajes(adapterProvider, bot)
}

main()
