# Modelos comerciales

Cada direccion visual de Nupia se presenta en tres alcances. Las carpetas
`ediciones/esencia`, `ediciones/historia` y `ediciones/firma` que hay dentro de
cada plantilla son descriptores comerciales: no contienen una copia del codigo.

Esto es intencionado. Una plantilla conserva una sola base tecnica y visual; sus
modelos indican que bloques se incluyen al crear el proyecto de una pareja. Asi una
mejora de accesibilidad, responsive o rendimiento se aplica una vez y llega a los
tres modelos.

La definicion central de precios, contenidos y secciones vive en
`../config/modelos-nupia.json`. Cada `modelo.json` local solo relaciona ese alcance
con la plantilla que le corresponde.

```text
plantillas/boda_ANILLO_VERDE/
|- source/                    codigo y recursos de la direccion visual
`- ediciones/
   |- esencia/modelo.json
   |- historia/modelo.json
   `- firma/modelo.json
```

Nunca se crean bodas de cliente dentro de estas carpetas. Nupia Studio parte de la
plantilla elegida y genera una copia aislada en `proyectos/`.
