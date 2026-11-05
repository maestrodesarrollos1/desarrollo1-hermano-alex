# Protección de datos y seguridad

Esta invitación recoge confirmaciones, teléfonos, mensajes y, opcionalmente, datos de salud necesarios para el menú. Adrián y Gema son responsables del tratamiento; el alojamiento actúa como proveedor técnico.

## Medidas incorporadas

- Los datos dinámicos se guardan en `_private/`, fuera de la carpeta pública del dominio.
- Los ficheros privados se crean con permisos restringidos para el proceso del servidor.
- Confirmaciones, moderación y ranking no se cachean. El panel requiere sesión, token CSRF y caduca tras 30 minutos sin actividad.
- Las API públicas rechazan solicitudes de otro origen, cuerpos excesivos y aplican límites antiabuso con huellas hash temporales de la conexión, no direcciones IP en claro.
- Los datos de alergias, intolerancias, embarazo y dieta requieren consentimiento explícito y separado. No se incluyen en los avisos por correo.
- Mensajes, RSVP y reto muestran información de privacidad antes de enviarse. El ranking del reto no se publica.
- La cabecera del sitio restringe scripts, conexiones, iframes y recursos a la propia web; los archivos de configuración y copias accidentales quedan bloqueados.

## Antes de publicar

1. Publicar todo el contenido de `source/dist`, incluido `.htaccess` y `spa-fallback.js`.
2. Mantener `_private/` fuera de `public_html` y no activar opciones SFTP que borren archivos remotos ajenos a la subida.
3. Configurar una contraseña de moderación única y larga mediante `WEDDING_TEMPLATE_MODERATION_PASSWORD` en `source/.server.env` o en la configuración segura del hosting. Nunca subir `.server.env` ni compartir esa contraseña.
4. Configurar `WEDDING_RSVP_NOTIFY_EMAIL` si se quieren avisos por correo. Si no se configura, las confirmaciones siguen guardándose en el panel privado, pero no se envía aviso.
5. Confirmar que existe un canal real de contacto con la organización para atender solicitudes de privacidad, como indica la política publicada.
6. Comprobar tras la subida que `https://invitacion-adrian-y-gema.cmsj.es/api/_bootstrap.php` y cualquier ruta bajo `/_private/` no son accesibles públicamente.

## Operación responsable

- El panel de moderación y sus CSV contienen datos personales: acceder solo desde equipos confiables, cerrar sesión al terminar y no reenviar exportaciones.
- Compartir con la finca o el catering únicamente las necesidades de menú imprescindibles, no la exportación completa si no hace falta.
- Antes del **30 de junio de 2027**, descargar únicamente lo necesario para el cierre de la boda y eliminar del hosting `_private/rsvp.json`, `_private/messages.json`, `_private/game-scores.json`, `_private/login-attempts.json` y `_private/public-rate-limits.json`.
- Ante una pérdida de acceso, publicación accidental o acceso no autorizado, cambiar la contraseña de moderación, conservar evidencias y valorar la notificación a las personas afectadas y a la AEPD según el riesgo.

## Referencias

- AEPD: [seguridad de los tratamientos](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/seguridad-de-los-tratamientos).
- AEPD: [datos de salud y categorías especiales](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/5-bases-legitimadoras-del-tratamiento/FAQ-0215-cuales-son-las-bases-de-legitimacion-para-el-tratamiento-de-las-categorias-especiales-de-datos).
- AEPD: [gestión y notificación de brechas](https://www.aepd.es/es/documento/guia-brechas-seguridad.pdf).

Este documento es una guía operativa del proyecto, no sustituye asesoramiento jurídico profesional para casos particulares.
