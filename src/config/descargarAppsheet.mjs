import axios from 'axios'
import fs from 'fs'
import path from 'path'

export async function descargarAppsheet(idFile, table, localPath = './src/res/catalogo', name) {
  const url = `https://www.appsheet.com/template/gettablefileurl?appName=${process.env.APPSHEET_NAME}&tableName=${table}&fileName=${idFile}`
  try {
    // Crear la carpeta si no existe (sincrónicamente)
    await fs.promises.mkdir(localPath, { recursive: true })
    const response = await axios.get(url, { responseType: 'arraybuffer' })

    if (response.status !== 200) {
      throw new Error('Error al descargar el archivo')
    }

    // Especificar la ruta donde se guardará el archivo
    const filePath = path.join(localPath, name + obtenerExtension(idFile))

    // Guardar el archivo en el sistema de archivos
    fs.writeFileSync(filePath, response.data)

    console.log('Archivo descargado correctamente:', filePath)
    return filePath
  } catch (error) {
    console.error('Error al descargar el archivo:', error)
    return null
  }
}

function obtenerExtension(url) {
  // Eliminar parámetros de consulta y fragmentos
  const urlSinQuery = url.split('?')[0].split('#')[0]
  // Extraer y devolver la extensión
  return path.extname(urlSinQuery)
}
