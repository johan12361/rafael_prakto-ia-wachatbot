import { promises as fx } from 'fs'
import fs from 'fs'
import cron from 'node-cron' // Asegúrate de tener instalado 'node-cron'
import path from 'path'
const tempDir = './temp'

//TT GENERAR CARPETA TEMP
/**
 * Revisa si el directorio temporal existe y lo crea si no existe.
 */
export function RevisarTemp() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }
}

//TT BORRAR DATOS DE CARPETA TEMP
/**
 * Programa un evento cron para borrar archivos en la carpeta temporal.
 */
export async function BorrarTemp() {
  cron.schedule('0 4 * * *', async () => {
    try {
      const files = await fx.readdir(tempDir) // Lee los archivos en la carpeta
      // Verificar si la carpeta está vacía
      if (files.length === 0) {
        console.log('✅ 🧹 La carpeta está vacía, no hay archivos para borrar.')
        return // No hay archivos que borrar, termina la función
      }
      // Si la carpeta no está vacía
      for (const file of files) {
        const filePath = path.join(tempDir, file)
        try {
          await fx.unlink(filePath) // Elimina el archivo
          console.log(`🗑️ Archivo ${file} borrado exitosamente`)
        } catch (err) {
          console.error(`Error borrando el archivo ${file}:`, err)
        }
      }
      console.log('✅ 🧹 Limpieza de archivos temporales completada.')
    } catch (err) {
      console.error('Error leyendo la carpeta:', err)
    }
  })
}
