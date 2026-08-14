# Estado del proyecto

## State of the art

Nupia ya funciona como una plataforma de produccion local para webs de boda: dispone de una web corporativa, cinco direcciones visuales de plantilla, un editor de escritorio con vista previa Vite y proyectos aislados para cada pareja.

## Estructura actual

- **Web corporativa:** `web_corporativa/nupia_estudio/source` presenta la marca y su propuesta premium.
- **Plantillas:** `plantillas/` contiene Boda elegante, Adrian y Gema, Primos Carles, Anillo Verde y Puertas Rosa. Son proyectos Vite aislados y editables.
- **Nupia Studio:** `nupia_studio/editor` permite elegir plantilla, cambiar contenido y paleta en caliente, importar componentes, crear copias de trabajo, abrir el navegador, usar VS Code y publicar a GitHub.
- **Proyectos:** `proyectos/` es el unico lugar destinado a bodas activas. Cada proyecto incluye `fotos/`, manifiesto Nupia y un `.gitignore` propio.

## Cambios relevantes de esta etapa

- Reorganizacion del repositorio en dominios de responsabilidad claros.
- Tres lanzadores de raiz para instalar requisitos, abrir una plantilla o iniciar Studio.
- Catalogo comun de plantillas y paletas reales extraidas de los disenos existentes.
- Convencion universal de fotos y accion de importacion desde Nupia Studio.
- Flujo Git local y GitHub privado con token temporal no persistente.

## Siguientes mejoras recomendadas

1. Unificar los campos editables de horarios, FAQ, regalos y RSVP en todos los descriptores.
2. Anadir pruebas automatizadas de importacion de fotos, creacion de proyectos y contratos de `template.json`.
3. Incorporar despliegue controlado por proyecto despues de definir proveedor y dominios.
4. Convertir la biblioteca de componentes compartidos en un catalogo visual con previews versionados.
