# Componentes `.compt` — formato 2

Un `.compt` es un componente web instalable que contiene siempre tres partes: **HTML, CSS y JavaScript**. El archivo completo es JSON UTF-8 y puede importarse desde el equipo o mediante una URL HTTPS.

El componente se ejecuta dentro de un `iframe` con sandbox. Su CSS no contamina la plantilla y su JavaScript no puede acceder al documento padre, cookies, `localStorage`, formularios ni navegación superior.

Puedes copiar [EJEMPLO.compt](EJEMPLO.compt) como punto de partida.

## Importación

En la barra superior del editor pulsa **Añadir componente**:

- **Desde archivo**: selecciona un archivo `.compt` local.
- **Desde Internet**: pega una URL HTTPS directa como `https://ejemplo.com/componentes/galeria.compt`.

Después aparecerá en el desplegable **Componentes**. Desde allí puede activarse, desactivarse y previsualizarse.

## Estructura mínima obligatoria

```json
{
  "format": "plantilla-compt",
  "formatVersion": 2,
  "id": "mi-componente",
  "name": "Mi componente",
  "version": "1.0.0",
  "description": "Descripción breve para el editor.",
  "variant": "feature",
  "slot": "before-rsvp",
  "height": 420,
  "enabled": true,
  "code": {
    "html": "<section class=\"box\"><h2>Mi componente</h2><button id=\"action\">Pulsar</button></section>",
    "css": ".box{padding:40px;background:var(--template-surface);color:var(--template-text)}button{background:var(--template-primary);color:white}",
    "js": "document.querySelector('#action').addEventListener('click',()=>alert('Funciona'));"
  }
}
```

Las claves `code.html`, `code.css` y `code.js` son siempre obligatorias y deben contener texto no vacío.

## Metadatos

| Propiedad | Regla |
| --- | --- |
| `format` | Siempre `plantilla-compt` |
| `formatVersion` | Siempre `2` para este contrato |
| `id` | 3–48 caracteres: minúsculas, números y guiones |
| `name` | Nombre mostrado en el desplegable |
| `version` | Versión informativa |
| `description` | Texto usado en la miniatura flotante |
| `variant` | Forma de la miniatura en el editor |
| `slot` | Posición del componente en la página |
| `height` | Altura del iframe, entre 180 y 1200 píxeles |
| `enabled` | Estado inicial booleano |

## HTML

`code.html` debe ser un fragmento, no un documento completo. No incluyas `<html>`, `<head>` ni `<script>`.

```html
<section class="agenda-extra">
  <h2>Actividad adicional</h2>
  <p>Información del componente.</p>
  <button id="more-info">Más información</button>
</section>
```

Las etiquetas `<script>` dentro del HTML se rechazan. Todo el comportamiento debe estar en `code.js`.

## CSS

El CSS vive exclusivamente dentro del iframe. El editor proporciona estas variables para que el componente siga la paleta activa:

```css
:root {
  --template-primary-dark: #0F3D2E;
  --template-primary: #2E7D59;
  --template-soft: #DDF0E1;
  --template-text: #1F5E46;
  --template-surface: /* tono claro derivado */;
  --template-border: /* borde derivado */;
}
```

Ejemplo:

```css
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--template-surface);
  color: var(--template-text);
}
.agenda-extra {
  padding: 48px;
  border: 1px solid var(--template-border);
}
h2 { color: var(--template-primary-dark); }
button { background: var(--template-primary); color: white; }
```

## JavaScript

`code.js` usa JavaScript estándar del navegador. No requiere etiquetas `<script>`:

```js
const button = document.querySelector('#more-info');
button.addEventListener('click', () => {
  button.textContent = 'Información mostrada';
});
```

El sandbox permite ejecutar JavaScript y hacer solicitudes HTTPS, pero no acceder a la página principal ni a su almacenamiento. No se permiten scripts externos mediante `<script src>`.

## Posiciones (`slot`)

- `after-hero`: después de la portada.
- `before-rsvp`: antes de la confirmación.
- `after-rsvp`: después de la confirmación y antes del pie.

## Variantes de miniatura

`feature`, `split`, `quote`, `banner` y `cards` cambian la miniatura que aparece al pasar el ratón. El diseño real siempre lo determinan `html`, `css` y `js`.

## Seguridad y límites

- Tamaño total máximo: 500 KB.
- HTML y CSS: máximo 80 000 caracteres cada uno.
- JavaScript: máximo 120 000 caracteres.
- Descargas únicamente por HTTPS, incluidas redirecciones.
- CSP restrictiva dentro del iframe.
- Sandbox sin `allow-same-origin`, formularios, ventanas emergentes ni navegación superior.
- Los identificadores repetidos requieren confirmación antes de reemplazarse.

El servidor puede entregar el archivo como `application/json` o `application/vnd.plantilla.component+json`.
