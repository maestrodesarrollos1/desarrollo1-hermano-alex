# Análisis y propuesta para un personalizador simple de plantillas

> Nota de estado (7 de agosto de 2026): el MVP descrito en este documento ya está implementado y la plantilla React se encuentra en `boda-elegante/source`. La aplicación se inicia desde la raíz con `python -m editor.run_editor`; consulta el README para el uso actual. El resto del documento se conserva como registro del análisis y de las decisiones iniciales.

## 1. Alcance

El objetivo actualizado no es construir un page builder ni una biblioteca compleja de componentes. La herramienta debe permitir:

1. Elegir una plantilla completa.
2. Cambiar sus opciones habituales desde un formulario.
3. Ver el resultado rápidamente.
4. Guardar los valores elegidos.
5. Exportar la web compilada.

Esta entrega solo contiene análisis, diseño y plan. No se ha creado la interfaz Python, no se ha movido la plantilla actual y no se ha modificado código de producción.

## 2. Fase 1 — Análisis del repositorio real

### 2.1 Aclaración sobre la carpeta plantillas

El repositorio no contiene actualmente una carpeta **plantillas**. Existe una sola plantilla completa en la raíz, distribuida entre:

~~~text
src/          aplicación y componentes React
public/       archivos públicos y backend PHP
resources/    recursos visuales y fuente
index.html    documento de entrada
package.json  dependencias y comandos
~~~

Por tanto, el inventario real contiene una plantilla de evento, no un catálogo de varias plantillas. La futura carpeta **plantillas** es una reorganización propuesta, no una estructura ya existente.

### 2.2 Inventario de páginas

| Página | Rutas | Propósito |
| --- | --- | --- |
| Plantilla de evento | **/es**, **/val**, **/eng**, **/ru** | Introducción, portada, historia, mensajes, cuenta atrás, cronograma, lugares, FAQ, RSVP y pie |
| Moderación | **/es/moderacion**, **/es/moderación** | Login y gestión de mensajes enviados |
| 404 | Rutas desconocidas | Mensaje localizado y vuelta a la portada |
| Acceso PHP a moderación | **public/es/moderacion/index.php** | Valida la sesión antes de entregar la aplicación React |

Las cuatro rutas de idioma muestran la misma composición. Hay catálogos i18n, pero gran parte del contenido principal sigue escrita directamente en español.

### 2.3 Tecnologías y build

- React 18 y TypeScript.
- Vite 5 como servidor y empaquetador.
- Tailwind CSS 3 mediante PostCSS.
- CSS global propio en **src/index.css**.
- shadcn/ui y Radix UI; hay 49 primitivas instaladas, aunque solo se usa una parte.
- lucide-react para iconos.
- i18next para idiomas.
- PHP y JSON para mensajes/moderación en producción.
- localStorage y sessionStorage como fallback local.

No se usan Alpine.js, htmx ni JavaScript inline dentro de las páginas React. Sí hay:

- JavaScript inline en **public/404.html** para restaurar rutas del SPA.
- Muchos estilos inline en **EnvelopeIntro.tsx**.
- Recursos base64 dentro de **EnvelopeIntro.tsx**.

El build actual es:

~~~text
npm run build
  -> vite build
  -> scripts/postbuild-hostinger.mjs
~~~

El postbuild copia los archivos necesarios para Apache/Hostinger. Node y Tailwind son imprescindibles para compilar esta plantilla tal como está.

### 2.4 Composición actual

**src/pages/Index.tsx** monta:

1. **EnvelopeIntro**
2. **Navbar**
3. **Hero**
4. **WeddingDetails**
5. **Contact**
6. **Footer**

**WeddingDetails** reúne varias secciones en un solo componente:

- historia;
- formulario de mensajes;
- cuenta atrás;
- cronograma;
- lugares;
- preguntas frecuentes.

La plantilla también contiene componentes no montados en la portada, como **Process**, **SideLayout** y **LanguageSelector**.

### 2.5 Qué conviene hacer personalizable

#### Datos básicos

Estos valores cambian en prácticamente cada uso y deben estar en la primera versión:

| Campo | Tipo de interfaz | Ubicación actual |
| --- | --- | --- |
| Nombre de la persona 1 | Texto corto | **src/data/weddingData.ts** |
| Nombre de la persona 2 | Texto corto | **src/data/weddingData.ts** |
| Fecha y hora | Selector de fecha/hora | **weddingData.ts**, EnvelopeIntro y textos visibles |
| Ciudad | Texto corto | **weddingData.ts** |
| Lugar del evento | Texto corto | **weddingData.ts** |
| Email y teléfono | Email/teléfono | **weddingData.ts** |
| Enlace de mapa | URL | **weddingData.ts** |
| Enlace RSVP | URL | **src/config/rsvp.ts** |

#### Textos

Conviene exponer bloques concretos, no cada palabra de la interfaz:

- frase de portada;
- título y dos párrafos de historia;
- texto previo al cronograma;
- títulos, horas y descripciones de los hitos;
- nombres y descripciones de los lugares;
- preguntas y respuestas frecuentes;
- nota configurable antes del RSVP;
- título, texto y fecha límite del CTA;
- texto del pie.

Los textos técnicos, mensajes de error, etiquetas de accesibilidad y textos del panel de moderación deben permanecer fijos en el MVP.

#### Tema visual

Para mantener la interfaz rápida, bastan inicialmente cuatro opciones:

- color principal oscuro;
- color principal;
- color suave/fondo;
- color del texto;
- tipografía de títulos, limitada a una lista compatible.

No conviene exponer clases Tailwind ni cada sombra, margen o breakpoint. El usuario debe elegir colores, no editar CSS.

#### Imágenes

Opciones razonables:

- logotipo;
- imagen de portada opcional;
- imagen de historia opcional;
- favicon.

Los adornos internos, iconos, banderas y recursos de interfaz deben quedar fijos. Las imágenes elegidas se guardarán dentro del proyecto, nunca en la plantilla base.

#### Secciones visibles u ocultas

Checkboxes útiles:

- mostrar introducción animada;
- mostrar historia;
- mostrar cuenta atrás;
- mostrar cronograma;
- mostrar lugares;
- mostrar FAQ;
- mostrar mensajes;
- mostrar RSVP;
- mostrar aviso de cookies.

La navegación debe ocultar automáticamente el enlace de una sección desactivada.

#### Contenido repetible

Cronograma y FAQ necesitan listas editables sencillas:

- añadir elemento;
- editar;
- mover arriba/abajo;
- eliminar.

No hace falta drag and drop libre en el lienzo. Dos botones de orden son suficientes y más fiables.

### 2.6 Qué debe permanecer fijo

- Estructura responsive.
- Componentes React y primitivas Radix.
- Breakpoints y espaciados internos.
- Animación y lógica del sobre.
- Comportamiento de la navegación.
- Cálculo de la cuenta atrás.
- Diseño interno de formularios.
- API, autenticación, CSRF y moderación.
- Rutas de idiomas.
- Configuración de Vite, Tailwind y PostCSS.
- Página 404 y adaptación a Hostinger.

La herramienta personaliza contenido y tema; no edita la arquitectura de la web.

### 2.7 Puntos de fricción actuales

Para adaptar hoy la plantilla hay que tocar varios lugares:

1. Los datos básicos están parcialmente en **weddingData.ts**, pero muchos textos siguen dentro de TSX.
2. La fecha aparece en datos, introducción, CTA y textos de ejemplo.
3. Los colores se repiten como hexadecimales en numerosos componentes, además de existir variables CSS y configuración Tailwind.
4. Añadir una imagen exige conocer imports de Vite y rutas entre **src**, **public** y **resources**.
5. Ocultar una sección requiere editar **Index/WeddingDetails** y revisar enlaces de Navbar.
6. Cronograma y FAQ están declarados como arrays o JSX dentro de un componente.
7. El selector de idioma existe, pero no está montado y la traducción es incompleta.
8. La exportación requiere Node, npm y conocer el comando de build.
9. Mensajes funciona de una manera en localhost y de otra con PHP en producción.
10. No hay pruebas automatizadas para comprobar que una personalización no rompa la plantilla.

Estos son los problemas que debe ocultar la herramienta. No hace falta resolverlos con un sistema general de componentes.

### 2.8 Elementos que no encajan bien en el primer MVP

#### Introducción animada

Puede activarse/desactivarse y recibir nombres/fecha, pero no conviene hacer editables sus tiempos, geometría o animaciones: concentra estilos inline y recursos base64.

#### Mensajes y moderación

Es una funcionalidad completa con React, storage local, PHP, sesión, CSRF y rate limit. El MVP solo debería permitir mostrarla u ocultarla. Cambiar su funcionamiento o backend queda fuera.

#### Multidioma

La interfaz puede editar primero un solo idioma. Ofrecer edición simultánea de cuatro catálogos multiplicaría el formulario y no aportaría rapidez inicial.

#### Primitivas shadcn no usadas

No deben aparecer como opciones de edición. Son dependencias internas, no bloques disponibles.

## 3. Fase 2 — Propuesta minimalista

### 3.1 Decisión principal

Mantener cada plantilla como una aplicación completa Vite/Tailwind y añadirle un único archivo **template.json** con:

- metadatos de catálogo;
- campos editables;
- valores por defecto;
- grupos del formulario.

No se propone una biblioteca de componentes, schemas JSON Schema, plugins, slots ni un renderer genérico.

### 3.2 Estructura mínima futura

~~~text
plantillas/
└─ boda-elegante/
   ├─ template.json
   ├─ preview.png
   └─ source/
      ├─ src/
      ├─ public/
      ├─ resources/
      ├─ package.json
      ├─ vite.config.ts
      └─ tailwind.config.ts

proyectos/
└─ evento-demo/
   ├─ project.json
   └─ assets/

editor/
├─ app.py
├─ catalog.py
├─ builder.py
└─ requirements.txt
~~~

La plantilla actual se movería a **plantillas/boda-elegante/source** en una etapa posterior y con pruebas. No se mueve en esta entrega.

### 3.3 Un solo archivo de definición

Ejemplo reducido de **template.json**:

~~~json
{
  "id": "boda-elegante",
  "name": "Boda elegante",
  "description": "Invitación con introducción, agenda, FAQ y RSVP",
  "preview": "preview.png",
  "fields": [
    {
      "key": "couple.partner1",
      "label": "Nombre 1",
      "type": "text",
      "default": "Nombre 1",
      "group": "Datos básicos"
    },
    {
      "key": "event.date",
      "label": "Fecha",
      "type": "date",
      "default": "2027-06-18",
      "group": "Datos básicos"
    },
    {
      "key": "theme.primary",
      "label": "Color principal",
      "type": "color",
      "default": "#2E7D59",
      "group": "Diseño"
    },
    {
      "key": "images.hero",
      "label": "Imagen de portada",
      "type": "image",
      "default": "",
      "group": "Imágenes"
    },
    {
      "key": "sections.faq",
      "label": "Mostrar preguntas frecuentes",
      "type": "boolean",
      "default": true,
      "group": "Secciones"
    }
  ]
}
~~~

Tipos suficientes para el MVP:

- **text**
- **textarea**
- **date**
- **time**
- **url**
- **color**
- **image**
- **boolean**
- **list**, solo para cronograma y FAQ

No hace falta JSON Schema. La app valida estos pocos tipos con reglas propias y muestra un control por tipo.

### 3.4 Archivo de proyecto

**project.json** solo guarda la plantilla elegida y los valores que cambian:

~~~json
{
  "template": "boda-elegante",
  "name": "Evento demo",
  "values": {
    "couple.partner1": "Alex",
    "couple.partner2": "Jamie",
    "event.date": "2027-06-18",
    "theme.primary": "#2E7D59",
    "sections.faq": true
  }
}
~~~

Los valores que falten se toman de **template.json**. Esto mantiene pequeños y legibles los proyectos.

### 3.5 Cómo aplicar los valores en esta plantilla

Jinja2 no es la opción más directa para el repositorio actual porque la plantilla no es un único HTML: es una aplicación React/TSX.

La opción más pequeña y segura es:

1. Centralizar en el futuro todos los valores editables en **src/generated/template-values.json**.
2. Hacer que los componentes React lean ese archivo.
3. Cambiar los colores editables a variables CSS.
4. Renderizar secciones mediante booleanos.
5. Mantener estructura, clases Tailwind y lógica React sin generar TSX desde Python.

Para previsualizar o exportar, Python crea una copia de trabajo de la plantilla, genera **template-values.json**, copia los assets del proyecto y ejecuta Vite.

Esto evita:

- reemplazos de texto frágiles;
- modificar código fuente con expresiones regulares;
- convertir toda la aplicación a Jinja;
- exponer clases Tailwind al usuario.

Una plantilla HTML futura puede seguir usando Vite y leer el mismo JSON mediante un script pequeño. Así el editor mantiene un único contrato: carpeta Vite + **template.json** + archivo de valores generado.

### 3.6 Imágenes y assets

Al seleccionar una imagen:

1. Copiarla a **proyectos/nombre/assets**.
2. Guardar en **project.json** una ruta relativa.
3. En preview/export, copiarla a **public/assets** de la copia de trabajo.
4. Generar en los valores una URL como **/assets/hero.jpg**.

Debe rechazarse cualquier ruta que salga de la carpeta del proyecto. El original elegido por el usuario no se modifica.

### 3.7 Preview

Flujo simple:

1. Crear una carpeta de trabajo en caché para la plantilla.
2. Instalar dependencias una vez.
3. Arrancar **npm run dev** en un puerto libre.
4. Escribir los valores generados con un debounce de unos 300 ms.
5. Dejar que Vite recargue el WebView.

No hace falta actualizar cada carácter a 60 fps. Una recarga rápida después de una breve pausa cumple el objetivo de “ver el resultado al momento”.

### 3.8 Exportación

Al pulsar Exportar:

1. Validar campos requeridos y URLs.
2. Crear una copia de trabajo limpia.
3. Escribir **template-values.json**.
4. Copiar assets del proyecto.
5. Ejecutar **npm run build** sin mostrar terminal.
6. Copiar **dist** al destino elegido.
7. Mostrar éxito o el error de build en lenguaje sencillo.

Node/Tailwind siguen siendo necesarios internamente. Para que el usuario final no los instale ni use terminal, la distribución de escritorio puede incluir un runtime Node y las dependencias ya preparadas. Esto se aborda después del MVP; durante desarrollo se exige Node instalado.

### 3.9 Alta de una plantilla nueva

Para que aparezca en el catálogo sin cambiar Python:

1. Crear **plantillas/nueva-plantilla**.
2. Añadir **template.json** válido.
3. Añadir **preview.png**.
4. Colocar el proyecto Vite en **source**.
5. Hacer que lea **src/generated/template-values.json**.
6. Proporcionar los scripts estándar **dev** y **build**.

La app solo escanea un nivel de carpetas y lee **template.json**. No ejecuta código Python de la plantilla ni carga plugins.

## 4. Fase 3 — Interfaz Python

### 4.1 Stack

Recomendación:

- Python 3.12.
- PySide6.
- QWebEngineView para mostrar el servidor Vite.
- Módulos estándar **json**, **pathlib**, **subprocess**, **shutil** y **tempfile**.

No se necesita base de datos, servidor Python, framework web, ORM ni sistema de plugins.

### 4.2 Pantalla

Una sola ventana:

~~~text
┌───────────────────────────────────────────────────────────┐
│ Plantilla [Boda elegante ▼]  Abrir  Guardar  Exportar    │
├──────────────────────┬────────────────────────────────────┤
│ Datos básicos        │                                    │
│ [Nombre 1          ] │                                    │
│ [Nombre 2          ] │          Previsualización          │
│ [Fecha             ] │          en QWebEngineView          │
│                      │                                    │
│ Diseño               │                                    │
│ [■ color principal ] │                                    │
│                      │                                    │
│ Secciones            │                                    │
│ [✓] Cronograma       │                                    │
│ [✓] FAQ              │                                    │
└──────────────────────┴────────────────────────────────────┘
~~~

El panel izquierdo puede usar un scroll y grupos colapsables. No necesita canvas seleccionable, árbol de capas ni drag and drop.

### 4.3 Flujo de uso

1. La app lista carpetas válidas de **plantillas**.
2. El usuario elige una miniatura.
3. La app construye el formulario desde **fields**.
4. Al cambiar un campo, guarda el estado en memoria y actualiza el preview con debounce.
5. Guardar crea o actualiza **project.json**.
6. Abrir carga otro proyecto.
7. Exportar compila y permite elegir carpeta destino.

### 4.4 Código Python mínimo

Responsabilidades:

- **app.py**: ventana, formulario, estado y acciones.
- **catalog.py**: escanear carpetas y validar **template.json**.
- **builder.py**: preparar preview, gestionar proceso Vite y exportar.

Si el código sigue siendo pequeño, **catalog.py** y **builder.py** incluso pueden empezar como funciones en **app.py** y separarse cuando superen una complejidad razonable.

## 5. Plan corto de trabajo

### Etapa 1 — Hacer configurable la plantilla actual

- Añadir **template.json** con unos 20–30 campos útiles.
- Centralizar esos valores en un JSON generado.
- Convertir cuatro colores a variables CSS.
- Conectar booleanos de secciones con portada y Navbar.
- Añadir una prueba manual de build y capturas desktop/móvil.

Resultado: la plantilla puede personalizarse cambiando un solo JSON.

### Etapa 2 — MVP Python

- Selector de plantilla.
- Formulario para text, textarea, date, url, color, image y boolean.
- Preview con Vite en QWebEngineView.
- Guardar y abrir **project.json**.

Resultado: personalización útil desde una sola ventana.

### Etapa 3 — Exportación

- Validaciones básicas.
- Copia segura de assets.
- Build automático.
- Selector de destino y mensajes de error comprensibles.

Resultado: primer flujo completo utilizable.

### Etapa 4 — Listas y segunda plantilla

- Editor sencillo de cronograma y FAQ.
- Mover la plantilla actual al catálogo.
- Añadir una segunda plantilla pequeña para comprobar que el alta no requiere cambiar Python.

Resultado: catálogo mínimo validado con dos plantillas.

### Etapa 5 — Distribución

- Cache de dependencias.
- Incluir Node o documentar instalación según tamaño final.
- Empaquetar con PyInstaller.

No se recomienda empezar por esta etapa.

## 6. Riesgos y decisiones

| Riesgo | Respuesta simple |
| --- | --- |
| Cambiar colores rompe clases Tailwind | Usar variables CSS, no construir clases dinámicas |
| Preview lento | Vite persistente + debounce |
| Plantilla inválida | Mostrarla como no disponible y explicar qué archivo falta |
| Dependencias diferentes por plantilla | Exigir scripts Vite estándar y cachear por plantilla |
| Imágenes fuera del proyecto | Copiar siempre al directorio de assets |
| Multidioma multiplica campos | Un idioma en MVP |
| Mensajes requieren PHP | Mostrar/ocultar, sin reconfigurar backend en MVP |
| Introducción demasiado compleja | Solo nombres, fecha y visible/oculta |
| Node complica instalación | Incluirlo al empaquetar, no antes de validar el MVP |

## 7. Recomendación final

El primer hito no debe ser la GUI. Debe ser conseguir que la plantilla actual cambie por completo leyendo un único archivo de valores. Cuando eso funcione, la interfaz Python será principalmente un formulario que escribe ese JSON y llama a Vite.

Es el camino con menos código nuevo, menor riesgo y una experiencia rápida para el usuario.
