# Confirmaciones de asistencia

La invitación muestra un botón `Confirma asistencia`. Abre `/es/confirmar-asistencia` en la misma pestaña; el navegador permite volver atrás. Cada respuesta incluye nombre, teléfono de contacto, asistencia y hasta cinco acompañantes con sus nombres. Cada persona puede indicar varias necesidades de menú a la vez: alergias, intolerancias, dieta vegana y embarazo. Las alergias e intolerancias requieren una descripción. El CSV exporta una fila por persona para facilitar el trabajo con el menú.

## Vista previa local

Vite no ejecuta PHP. En `localhost`, las respuestas de prueba se guardan **solo en localStorage del navegador**. No se envían a los novios ni se sincronizan con otros dispositivos. La pantalla `/es/moderacion` permite ver estas pruebas después de introducir cualquier contraseña no vacía; esto es exclusivo del entorno de desarrollo.

## Publicación

El despliegue debe servir el contenido de `dist/` mediante Apache con PHP y las reglas de `public/.htaccess`. Antes de compartir el enlace con invitados:

1. Definir `WEDDING_TEMPLATE_MODERATION_PASSWORD` en el entorno del servidor. Nunca incluir la contraseña en el repositorio.
2. Comprobar que PHP puede crear y escribir `../_private/rsvp.json` respecto al directorio web publicado. Es una carpeta **fuera del document root**. Si el alojamiento requiere otra ubicación, definir `WEDDING_RSVP_STORE_PATH` con una ruta absoluta privada y escribible.
3. Opcionalmente, definir `WEDDING_RSVP_NOTIFY_EMAIL` para recibir un aviso por cada nueva respuesta. El correo es solo un aviso; el registro y el CSV del panel son la fuente de verdad. `mail()` depende de que el alojamiento tenga correo saliente configurado.
4. En el dominio publicado, enviar una respuesta de prueba y comprobar que aparece en `/es/moderacion`, que el CSV se descarga y que la ruta privada no es accesible por HTTP. Después, borrar esa respuesta desde el panel.
5. Configurar copias de seguridad del archivo privado y restringir el acceso al panel a quienes gestionan la boda.

Los datos de menú son opcionales y pueden incluir información sensible. Antes de publicar, revisar el texto de privacidad y el acceso al registro con la persona responsable de protección de datos; no compartir el CSV con más personas de las necesarias.

El endpoint público es `/api/rsvp-public.php`. El listado, borrado y CSV se sirven desde `/api/rsvp-admin.php` y exigen la sesión protegida existente. No se utiliza Google Forms.
