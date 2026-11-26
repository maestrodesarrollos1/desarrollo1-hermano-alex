# Catalogo de plantillas

Esta carpeta contiene las invitaciones React/Vite de Nupia. Cada carpeta tiene un `template.json` y un `source/` aislado, por lo que sus decisiones artisticas, dependencias y datos no se mezclan con otras bodas.

```text
plantillas/
|- componentes/             biblioteca global .compt
|- boda-elegante/
|- boda_ADRIAN_GEMA/
|- boda_ANILLO_VERDE/
|- boda_PRIMOS_CARLES/
`- boda_PUERTAS_ROSA/
```

Desde la raiz usa `02_abrir_plantilla.bat` para abrir una plantilla. Para crear una boda real y editarla, abre `03_abrir_nupia_studio.bat`: Studio crea una copia independiente en `../proyectos/`.

Cada direccion visual se divide comercialmente en `ediciones/esencia`, `ediciones/historia` y `ediciones/firma`. No son tres copias del codigo: son tres alcances configurables sobre la misma plantilla, para mantener calidad y evitar que las mejoras se desincronicen. Consulta [EDICIONES.md](EDICIONES.md) y `../config/modelos-nupia.json` para ver el contrato completo.

## Demostraciones comerciales

Las carpetas `boda-nupia-esencia`, `boda-nupia-historia` y `boda-nupia-firma` son ejemplos ficticios de los tres niveles comerciales de Nupia. Comparten una base técnica probada, pero no contienen datos ni fotografías de bodas de cliente.

Las fotos se importan desde una carpeta del proyecto con los nombres `landing`, `historia1`, `historia2`, `galeria1` a `galeria6` y `despedida`. La paleta se controla con `primaryDark`, `primary`, `soft` y `text` desde el editor o `../config/paletas.json`.
