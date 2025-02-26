import 'dotenv/config'
import cron from 'node-cron' // Asegúrate de tener instalado 'node-cron'

//TT MODULOS
import { EnviarRecordatorios } from '../config/enviarRecordatorios.mjs'

//TT ENVIAR NOTIFICACIONES
export async function CronXhora() {
  console.log('✅ CRON X HORA INICIADO')
  cron.schedule('58 * * * *', async () => {
    EnviarRecordatorios()
  })
}
