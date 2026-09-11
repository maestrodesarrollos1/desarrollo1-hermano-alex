# Adrian y Gema Horizonte Azul

Proyecto de cliente independiente creado desde `plantillas/boda-elegante`. Se abre en Nupia Studio mediante su `template.json`. La plantilla base conserva su estado anterior.

## Vista previa

Ejecutar `abrir-vista-previa.bat` en esta carpeta. Usa el puerto 8080 y falla si ya esta ocupado, para evitar mostrar otra boda por error. Requiere las dependencias instaladas con el lanzador general; si esta copia no tiene `node_modules`, ejecutar `npm ci` dentro de `source`.

Tambien puede iniciarse desde `source` con `npm run dev -- --host 127.0.0.1 --port 8080 --strictPort`. URL: http://127.0.0.1:8080/es

## Contenido y fotos

- Fuente: Word de briefing entregado por el usuario el 10/09/2026. Fecha: 27/03/2027, ceremonia 12:00 en Finca Ronesa; coctel 13:30, banquete 15:00, fiesta 17:00 a 00:00.
- Fotografias: seleccion de 16 originales del ZIP de WhatsApp, con una variante reutilizada para el cierre, optimizadas a WebP sin metadatos EXIF. Se incluye a Nala. El ZIP y el Word originales no se incorporan a Git.
- `source/src/generated/template-values.json`: datos, fotos, horarios, FAQ y cuatro colores globales. `template.json` registra cada campo para que Studio lo conserve al guardar.
- Paleta: azul ceramica `#193E59`, terracota `#A84631`, azul claro `#E8F0F3`, texto `#243D47`. Blanco como superficie y oliva como acento secundario.
- `source/public/images/pareja/`: contrato de fotos `landing`, `historia1`, `historia2`, `galeria1` a `galeria12`, `despedida`. La imagen de la finca es una ilustracion representativa heredada; no una fotografia verificada del lugar. Reemplazarla cuando se reciba la imagen oficial.
- La fecha usa el huso horario de Espana peninsular en marzo; el calendario exporta la hora UTC equivalente.

## Pendiente de la pareja

Formulario RSVP y fecha limite, ubicacion exacta/enlace de acceso, transporte desde Elche o Alicante, historia personal definitiva y posibles instrucciones sobre regalos. No se publica ciudad: el Word menciona Elche/Alicante en transporte, no como ubicacion de la finca.

El quiz personalizado, ranking y premios son una peticion del briefing, pero aun faltan preguntas, respuestas y condiciones. No se anuncia como disponible. La ruta de juego de velocidad heredada sigue en el codigo para compatibilidad, sin enlace en la invitacion.

En localhost los mensajes se guardan solo en el navegador y asi se indica en el formulario. Para compartirlos entre invitados, desplegar y configurar el backend PHP existente, la moderacion y su almacenamiento. No se ha publicado la web ni enviado ningun mensaje externo.

## Comprobacion

`npm run lint`, `npx tsc --noEmit -p tsconfig.app.json` y `npm run build`. Se revisan apertura sin avance automatico, navegacion movil, fotos ampliables con teclado, calendario y formulario local. El proyecto hereda siete avisos de Fast Refresh de los componentes shadcn, sin errores de lint.
