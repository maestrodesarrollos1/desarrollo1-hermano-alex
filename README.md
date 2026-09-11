# Nupia

Nupia crea experiencias web de boda personalizadas. El repositorio separa la marca, la biblioteca de plantillas y la herramienta de produccion para que cada boda pueda evolucionar sin afectar a las demas.

```text
web_corporativa/   web comercial de Nupia
plantillas/        biblioteca de invitaciones React/Vite
nupia_studio/      editor visual y gestion de proyectos
proyectos/         copias de trabajo de bodas reales
config/            catalogo de plantillas y paletas compartidas
scripts/           lanzadores de Windows
```

## Arranque

En una maquina nueva, abre [01_instalar_requisitos.bat](01_instalar_requisitos.bat). Instala Git, Node.js LTS, Python 3.12, las dependencias de cada web y el entorno aislado de Nupia Studio.

- [02_abrir_plantilla.bat](02_abrir_plantilla.bat): muestra un menu y abre una invitacion concreta.
- [03_abrir_nupia_studio.bat](03_abrir_nupia_studio.bat): abre el editor para crear y trabajar proyectos.

La web corporativa se ejecuta desde `web_corporativa/nupia_estudio/source` con `npm run dev`.

## Fotos y color

Dentro de cada proyecto de `proyectos/`, coloca las fotos en `fotos/` y usa los nombres `landing`, `historia1`, `historia2`, `galeria1` a `galeria6` y `despedida`. Se admiten `.jpg`, `.jpeg`, `.png`, `.webp` y `.avif`. En Nupia Studio usa **Importar fotos** para copiarlas y enlazarlas correctamente.

Las paletas de todas las invitaciones y la paleta generica viven en [config/paletas.json](config/paletas.json). Studio las ofrece como presets y tambien permite ajustar cada color en caliente.

Consulta [PROMPT_MAESTRO.md](PROMPT_MAESTRO.md) antes de ampliar el producto y [ESTADO_DEL_PROYECTO.md](ESTADO_DEL_PROYECTO.md) para una fotografia tecnica breve.
