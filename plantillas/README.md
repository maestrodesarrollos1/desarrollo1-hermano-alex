# Catálogo de plantillas

Este repositorio separa el editor, la biblioteca global de componentes y el código de cada plantilla. Puedes añadir nuevas plantillas como carpetas hermanas sin mezclar sus dependencias ni sus componentes propios.

```text
plantillas/
├─ editor/                       editor visual en Python
├─ componentes/                  biblioteca `.compt` compartida
└─ boda-elegante/
   ├─ template.json              configuración para el editor
   └─ source/                    proyecto React/Vite de la plantilla
```

## Abrir el editor

Desde esta carpeta:

```powershell
python -m pip install -r editor/requirements.txt
npm install --prefix boda-elegante/source
python -m editor.run_editor
```

En Windows también puedes abrir `editor/iniciar_editor.bat` con doble clic. La documentación completa está en [editor/README.md](editor/README.md).

## Añadir una plantilla

Crea una carpeta directa bajo esta raíz con esta forma:

```text
nueva-plantilla/
├─ template.json
└─ source/
   ├─ package.json
   └─ src/generated/
```

En `template.json`, usa `"source": "source"` y define los campos editables. El editor descubre automáticamente todos los descriptores `*/template.json` al arrancar.

## Componentes compartidos

Los componentes importados se guardan en `componentes/`, no dentro de una plantilla. El editor copia el catálogo generado a todas las plantillas registradas, de modo que los `.compt` quedan disponibles en todos los espacios de trabajo. Cada `.compt` debe incluir siempre HTML, CSS y JavaScript según [componentes/README.md](componentes/README.md).

Los componentes nativos de una plantilla permanecen dentro de su propia carpeta `source`; solo los `.compt` instalados forman parte de la biblioteca global.
