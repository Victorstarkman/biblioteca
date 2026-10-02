# Specs

Cada carpeta `NNN-nombre/` es una spec: la definición de una regla de negocio
**antes** de escribir el código que la implementa (principio 2 de
`docs/constitution.md`).

## Convención

- El número es correlativo y de tres dígitos: `001`, `002`, `003`…
- El nombre es corto y en minúsculas con guiones: `001-horarios-semanal`.
- El archivo de la spec es `spec.md`.
- La spec **activa** es la de número más alto. Es la que hay que leer junto con
  `AGENTS.md`, `memory.md` y `docs/constitution.md` antes de tocar código.
- Al terminar una spec, su carpeta no se borra: pasa a ser historial y el
  número queda consumido. No se reutiliza.

## Antes de implementar

La spec tiene que responder, como mínimo:

1. **Qué** regla de negocio se agrega o cambia.
2. **Por qué** hace falta.
3. **Casos borde** y qué se rechaza (código de error esperado).
4. **Dónde** vive la lógica (rutas, validación, esquema de BD, UI).

Si al implementar aparece una decisión que la spec no cubre, se actualiza la
spec y se anota en `memory.md` antes de seguir con el código.

## Plantilla

Copiar `000-plantilla/spec.md` y renombrarla al número y nombre que toque.
