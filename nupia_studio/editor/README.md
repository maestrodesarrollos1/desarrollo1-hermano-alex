# Editor visual de plantillas

Aplicación de escritorio en Python para elegir una plantilla, editarla visualmente, guardar proyectos y exportar una web compilada. El editor es independiente del código de cada plantilla.

## Puesta en marcha

Requisitos: Python 3.12 o superior, Node.js 20 y npm 10 o superiores.

Desde la raíz `plantillas`, instala las dependencias una vez:

```powershell
python -m pip install -r editor/requirements.txt
npm install --prefix boda-elegante/source
```

Abre el editor con doble clic en `editor/iniciar_editor.bat` o ejecuta:

```powershell
python -m editor.run_editor
```

Para comprobar el entorno sin abrir la interfaz:

```powershell
python -m editor.run_editor --check
```

## Funciones principales

- Selector de plantilla fijado en la parte superior y paleta justo debajo.
- Vista previa a la izquierda y controles desplazables a la derecha.
- Edición directa de textos al hacer clic en la vista previa.
- Sincronización del desplazamiento entre la web y la configuración visible.
- Paletas globales y colores ajustables individualmente.
- Briefings Word por plantilla: se pueden rellenar y reimportar con los campos de contenido.
- Al importar un briefing, Studio pide la carpeta de fotos definitivas o de stock y aplica la convención de nombres.
- Componentes propios de cada plantilla y componentes `.compt` compartidos.
- Importación `.compt` desde archivo o URL HTTPS, siempre con HTML, CSS y JavaScript.
- Guardado y apertura de proyectos JSON.
- Build de producción y exportación de `dist`.

## Briefings Word y fotos

Los formularios listos para enviar se guardan en `nupia_studio/briefings/`. Hay uno por cada plantilla y se pueden regenerar con:

```powershell
python -m editor.briefing_document
```

La persona que prepara la boda solo tiene que rellenar la columna **Respuesta** y conservar la columna **Clave Studio**. En la barra superior del editor:

1. Pulsa el icono **Crear briefing Word** si necesitas un documento nuevo para la plantilla activa.
2. Pulsa **Importar briefing Word** y elige el documento completado.
3. Confirma la carpeta de fotos. Studio reconoce `landing`, `historia1`, `historia2`, `galeria1` a `galeria6` y `despedida`, en JPG/JPEG/PNG/WebP/AVIF.

El propio Word indica qué fotografía se debe solicitar en cada hueco. Puede ser una foto definitiva de la pareja o una foto provisional de stock con licencia de publicación.

## Organización

```text
plantillas/
├─ editor/
│  ├─ app.py
│  ├─ builder.py
│  ├─ catalog.py
│  ├─ component_catalog.py
│  ├─ run_editor.py
│  └─ tests/
├─ componentes/                 biblioteca compartida
└─ boda-elegante/
   ├─ template.json             descriptor para el editor
   └─ source/                   aplicación React/Vite aislada
      └─ src/generated/
         ├─ template-values.json
         └─ installed-components.json
```

`catalog.py` descubre `*/template.json` directamente bajo la raíz. Cada descriptor resuelve su propia carpeta `source`; el editor no contiene rutas fijas a Boda elegante.

## Componentes compartidos

Los `.compt` instalados se guardan una sola vez en `componentes/`. Al importar, activar o desactivar uno, el editor regenera `src/generated/installed-components.json` dentro de **todas** las plantillas registradas. Por eso el mismo catálogo está disponible al cambiar de plantilla o abrir otro proyecto.

Consulta la [especificación del formato](../componentes/README.md) y copia `componentes/EJEMPLO.compt` como base. HTML, CSS y JavaScript son obligatorios y se ejecutan dentro de un iframe aislado.

## Añadir otra plantilla

1. Crea una carpeta hermana, por ejemplo `cumpleanos/source`.
2. Añade `cumpleanos/template.json` con `id`, `name`, `source`, `previewPath`, `valuesFile` y `fields`.
3. Incluye un `package.json` con scripts `dev` y `build` dentro de `source`.
4. Haz que la aplicación lea `src/generated/template-values.json`.
5. Para mostrar `.compt`, implementa el lector de `src/generated/installed-components.json`; puedes reutilizar el renderer de Boda elegante.
6. Instala sus dependencias y reinicia el editor. No es necesario modificar Python.

Ejemplo mínimo de descriptor:

```json
{
  "id": "cumpleanos",
  "name": "Cumpleaños",
  "source": "source",
  "previewPath": "/",
  "valuesFile": "src/generated/template-values.json",
  "fields": [
    {
      "key": "hero.title",
      "label": "Título",
      "type": "text",
      "default": "Mi celebración",
      "group": "Portada"
    }
  ]
}
```

Tipos admitidos: `text`, `textarea`, `datetime`, `url`, `color`, `image` y `boolean`.

## Validación

Desde la raíz:

```powershell
python -m unittest discover -s editor/tests -v
python -m compileall -q editor
npm exec --prefix boda-elegante/source tsc -- --noEmit
npm run --prefix boda-elegante/source build
```

El [análisis arquitectónico](docs/analisis-arquitectura-y-plan.md) se conserva como historial de las decisiones iniciales.
