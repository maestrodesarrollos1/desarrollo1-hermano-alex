# Web comercial de Nupia

React 18 y Vite. Servidor local: http://localhost:8084.

## Recorrido comercial

- Entrada fotografica con propuesta explicita: webs de boda personalizadas.
- Presentacion del servicio centrada en la pareja y sus invitados.
- Coleccion de dos estilos con aperturas interactivas, lectura sin cierre automatico,
  entrada a la celebracion y opcion de repetir.
- Proceso en tres pasos basado en el documento universal y la produccion de Studio.
- Preguntas frecuentes sobre contenido, personalizacion, cambios, plazos y confirmacion.
- Consulta por correo que incorpora el diseno seleccionado y ofrece copia manual.

Las demos importan los componentes `EnvelopeIntro` de Anillo Verde y Puertas Rosa,
con contenido de ejemplo (Alma y Hugo; Clara y Leo). No son testimonios ni bodas de
clientes. Se montan en `opening.html`, dentro de un iframe que aisla sus estilos
y animaciones. Tras abrir la tarjeta, el boton de entrar muestra una bienvenida
de ejemplo: esta es una demo de apertura, no la web completa de una boda.
Vite compila esta entrada junto a la corporativa; no depende de otros localhost.
Las plantillas base no se modifican.

La identidad corporativa usa blanco papel, grafito y un acento salvia. Las
fotografias de portada y portfolio tienen un tratamiento monocromo. Los colores
propios de cada plantilla aparecen dentro de la demo, sin recolorear la marca.

## Mantenimiento

- Seleccion editorial: `src/data/designs.ts`.
- Preguntas: `src/components/Questions.tsx`.
- Correo de contacto: `src/components/ContactMoment.tsx`, `BrandClosing.tsx`.
- Estilos corporativos y responsive: `src/index.css`.
- Demos interactivas: `src/demo/` y `src/components/OpeningPreview.tsx`.
- Vite resuelve los datos de las aperturas a `demo-values.ts` y sus imagenes
  a las versiones WebP locales. Solo importa los dos componentes necesarios.
- Imagenes WebP: `public/images`. Se conservan los originales.

No hay backend de contacto: el visitante debe enviar el correo preparado desde
su aplicacion. No se declara un envio exitoso al abrirla. Los datos del formulario
permanecen en memoria y no se envian ni persisten desde la web.
El RSVP de las plantillas seleccionadas enlaza a un formulario configurable;
no se presenta como un sistema propio de gestion de invitados.

## Verificacion

```sh
npm run dev -- --host 127.0.0.1 --port 8084 --strictPort
npm run lint
npm run typecheck
npm run build
```

Revision responsive realizada a 375, 390, 768, 1024, 1440 y 1920 px:
sin desbordamiento horizontal; comprobados selector de diseno, vistas del
dialogo, cierre con Escape y retorno del foco, seleccion trasladada a la
consulta, preguntas, menu movil y copia del mensaje.

## Antes de publicarla

Definir el dominio publico para las URL canonicas, imagen social absoluta y
sitemap. No se ha inventado un dominio ni publicado la web.
Completar la identidad del titular y los textos legales con los datos reales
del negocio. El formulario actual no precisa credenciales; un envio directo
requerira un servicio de correo y su configuracion de servidor.

No hay precios, plazos garantizados, volumen de clientes o testimonios
inventados. Estos contenidos deben incorporarse cuando esten definidos.
