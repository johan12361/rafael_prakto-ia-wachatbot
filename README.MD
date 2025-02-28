# Introducción

Este proyecto es un chatbot de WhatsApp potenciado con inteligencia artificial, diseñado para automatizar la comunicación con clientes, responder preguntas de manera eficiente y gestionar interacciones en tiempo real. Utiliza la API de OpenAI para generar respuestas inteligentes y está integrado con AppSheet para manejar información estructurada. Las variables de entorno descritas en este documento permiten configurar y personalizar el comportamiento del bot de acuerdo con las necesidades específicas de cada implementación.

# Configuración de Variables de Entorno

Este archivo describe el uso de las variables de entorno necesarias para el correcto funcionamiento del sistema.

## Variables de Entorno

### APPSHEET
Estas variables son utilizadas para la integración con la API de AppSheet.

- `APPSHEET_ID`: Identificador único de la aplicación en AppSheet.
- `APPSHEET_KEY`: Clave de autenticación para acceder a la API de AppSheet.

### GENERALES
Variables generales de configuración del bot y la zona horaria.

- `TZ`: Zona horaria en la que opera el bot (Ejemplo: `America/Mexico_City`).
- `REST_CLAVE`: Clave utilizada para autenticación en peticiones REST.

### OPENAI API KEY
Clave utilizada para autenticar las solicitudes a la API de OpenAI.

- `OPENAI_API_KEY`: Clave secreta para acceder a los servicios de OpenAI.

## Uso
Asegúrese de definir estas variables en el entorno de ejecución o configurarlas en su sistema antes de ejecutar la aplicación.

Ejemplo de archivo `.env`:

```
APPSHEET_ID=tu_appsheet_id
APPSHEET_KEY=tu_appsheet_key
TZ=America/Mexico_City
REST_CLAVE=tu_rest_clave
OPENAI_API_KEY=tu_openai_api_key
```

## Notas
- **No compartir estas claves** con terceros, ya que pueden comprometer la seguridad del sistema.
- Se recomienda utilizar un gestor de secretos para almacenar estas credenciales de manera segura.
- Si necesita cambiar la zona horaria, puede consultar [esta lista](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) de zonas horarias soportadas.

# Ruta de volumen virtual del contenedor

Para permitir al bot mantener la sesión de WhatsApp sin desconectarse en caso de reinicios o actualizaciones, se debe usar la ruta "/app/bot_sessions" para mantener las credenciales guardadas. 
```
/app/bot_sessions
```

## Puerto de conexion
```
3001
```

# Créditos
Desarrollado por: Johan S.
Contacto: johan12361@gmaill.com
Fecha de creación: 2025