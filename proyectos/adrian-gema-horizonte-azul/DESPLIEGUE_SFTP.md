# Subir la invitación por SFTP

La carpeta que se publica es `source/dist`. Su contenido se sube a la carpeta web del dominio, normalmente `public_html` o la carpeta indicada por el alojamiento.

## Datos que no se deben tocar

La web guarda la información real fuera de la carpeta pública:

```text
carpeta privada del hosting/
├── public_html/                 ← aquí se sube el contenido de source/dist
└── _private/
    ├── rsvp.json                ← confirmaciones, teléfonos y menú
    ├── messages.json            ← mensajes pendientes y aprobados
    ├── game-scores.json         ← ranking del juego
    └── login-attempts.json      ← protección del acceso de moderación
```

`_private` se crea automáticamente al recibir la primera confirmación, mensaje, intento de acceso o partida. Está fuera de la web pública y no se incluye en `dist`, así que nunca se debe subir ni borrar desde SFTP.

## Publicar una actualización

1. Desde `source`, ejecuta `npm run build`.
2. Abre `source/dist`.
3. Sube **todo su contenido**, incluido `.htaccess`, a la carpeta pública del dominio.
4. No borres la carpeta privada `_private` del servidor.
5. No actives en el cliente SFTP ninguna opción que elimine archivos remotos que no existan localmente.

El archivo `.htaccess` es necesario: protege los endpoints internos y permite que funcionen las URLs como `/es`, `/es/moderacion` y `/es/confirmar-asistencia`.

La contraseña de moderación se mantiene solo en `source/.server.env`, que no se guarda en Git. La compilación la incorpora automáticamente a `dist/.htaccess`; por ello hay que subir también ese archivo oculto.

## Primera actualización después de este cambio

Si el servidor ya tenía una carpeta `_messages`, la primera petición de mensajes, moderación o juego copiará su contenido a `_private` automáticamente. Después los datos seguirán viviendo solo allí.

## Comprobación tras subir

1. Envía una confirmación de prueba desde la web.
2. Comprueba que aparece en `/es/moderacion`.
3. Borra la prueba desde moderación.
4. Comprueba que la web sigue funcionando tras una segunda subida de `dist`.
