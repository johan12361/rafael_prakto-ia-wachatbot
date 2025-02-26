import 'dotenv/config'
import fs from 'fs'
import sirv from 'sirv'
//import path from 'path'

//TT MODULOS
import { ObtenerEstadoServidor } from './ApiResFunciones/estadoServidor.mjs'
import {
  ActualizarBot,
  ActualizarContactos,
  ActualizarNotificaciones,
  ActualizarMensajes,
  ActualizarComunicados
} from '../config/bot.mjs'

//XX ADICIONALES
import { EnviarMensaje } from '../funciones/proveedor.mjs'
import { EnviarComunicado } from '../config/enviarComunicado.mjs'
import { AgregarMensajeHistorial } from './OpenAi/historial.mjs'

//TT REST
export function APIREST(PROV) {
  PROV.server.use(sirv('.', { dev: true }))
  //TT ACTUALIZAR INFO
  PROV.server.get('/actualizar', async (req, res) => {
    // Acceder a los valores de 'clave' e 'id' desde los headers
    const clave = req.headers['x-clave']
    const id = req.headers['x-id']

    if (clave === process.env.REST_CLAVE) {
      console.log(`DATO RECIBIDO: actualizar con clave = ${clave} y solicitud ${id}`)
      try {
        //SS 1 actualizar bot
        if (id === 'bot') {
          console.log('actualizar bot')
          ActualizarBot()
        }
        //SS 2 actualizar comportamiento
        else if (id === 'contactos') {
          console.log('actualizar contactos')
          ActualizarContactos()
        }
        //SS 3 actualizar notificaciones
        else if (id === 'notificaciones') {
          console.log('actualizar notificaciones')
          ActualizarNotificaciones()
        }
        //SS 4 actualizar mensajes
        else if (id === 'mensajes') {
          console.log('actualizar mensajes')
          ActualizarMensajes()
        }

        //XX ADICIONALES

        //SS 5 actualizar comunicados
        else if (id === 'comunicados') {
          console.log('actualizar comunicados')
          await ActualizarComunicados()
        }
        return res.end('la peticion de actualizacion se realizó con éxito.')
      } catch (error) {
        console.error('Error durante la actualización:', error)
        return res.status(500).end('ocurrió un error durante la actualización.')
      }
    } else {
      console.log(`la calve: ${clave} no es valida`)
      return res.end(`la calve: ${clave} no es valida`)
    }
  })

  //XX ADICIONALES

  //TT ACCIONES
  PROV.server.post('/accion', async (req, res) => {
    // Acceder a los valores de 'clave' e 'id' desde los headers
    const clave = req.headers['x-clave']
    const id = req.headers['x-id']

    if (clave === process.env.REST_CLAVE) {
      console.log(`DATO RECIBIDO: accion con clave = ${clave} y solicitud ${id}`)
      try {
        //SS 1 enviar mensaje
        if (id === 'enviar_mensaje') {
          console.log('accion crear enviar mensaje')
          console.log(req.body)
          const estado = await EnviarMensaje(req.body.number, req.body.message)
          res.setHeader('Content-Type', 'application/json')
          if (estado === 'OK') {
            const json = JSON.stringify({ estado: 'OK' })
            //agregar a historial
            if (req.body.addHistorial) {
              AgregarMensajeHistorial(req.body.number, req.body.message)
            }
            return res.end(json)
          } else {
            const json = JSON.stringify({ estado: 'ERROR' })
            return res.end(json)
          }
        }
        //SS 2 enviar comunicado
        else if (id === 'enviar_comunicado') {
          console.log('accion crear enviar comunicado')
          console.log(req.body)
          const estado = await EnviarComunicado(req.body.id)
          res.setHeader('Content-Type', 'application/json')
          const json = JSON.stringify(estado)
          return res.end(json)
        }
      } catch (error) {
        console.error('Error durante la accion:', error)
        return res.status(500).end('ocurrió un error durante la accion.')
      }
    } else {
      console.log(`la calve: ${clave} no es valida`)
      return res.end(`la calve: ${clave} no es valida`)
    }
  })

  //SS IMAGEN DE ESTADO DEL SERVIDOR
  PROV.server.get('/img/estado', (req, res) => {
    const imagePath = ObtenerEstadoServidor() // Cambia esto según la ruta de tu imagen

    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error('Error enviando la imagen:', err)
        return res.status(500).end('Error enviando la imagen')
      } else {
        res.setHeader('Content-Type', 'image/png')
        return res.end(data)
      }
    })
  })

  //SS HMTL DE ESTADO DE LA CONEXION DEL BOT
  PROV.server.get('/vincular', (req, res) => {
    let _num = ''
    let ruta = './src/res/html/Vincular.html'
    if (PROV.store?.state?.connection === 'open') {
      _num = PROV.globalVendorArgs?.host?.phone
      ruta = './src/res/html/Conectado.html' // Cambia esto según la ruta de tu imagen
    }
    fs.readFile(ruta, 'utf8', (err, data) => {
      if (err) {
        console.error('Error enviando la pagina:', err)
        return res.status(500).end('Error enviando la pagina')
      } else {
        const _new = _num !== '' ? data.replaceAll('##TELEFONO##', _num) : data
        res.setHeader('Content-Type', 'text/html')
        return res.end(_new)
      }
    })
  })
}
