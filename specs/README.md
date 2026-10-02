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

La spec sigue la plantilla de `000-plantilla/spec.md`. Las secciones y para qué
sirven:

| Sección | Para qué |
| --- | --- |
| Contexto y objetivo | Qué problema resuelve y por qué merece la pena. |
| Usuarios / actores | Quién lo usa. |
| Historias de usuario | La necesidad desde el punto de vista de quien la tiene. |
| Requisitos funcionales | Los RF en notación EARS: `CUANDO`, `SI/ENTONCES`, `MIENTRAS`, `EL SISTEMA`. |
| Requisitos no funcionales | Rendimiento, seguridad, plataformas, idioma. Solo si aplican. |
| Casos límite | Vacíos, duplicados, datos corruptos, límites, concurrencia. |
| Fuera de alcance | Lo que explícitamente no se hace en esta iteración. |
| Criterios de finalización | Cómo se verifica que está terminado. Sin tests automatizados. |
| Dudas abiertas | Lo que hay que aclarar antes de codear. |
| Alcance técnico | Rutas, validación, esquema de BD y pantallas. |
| Dependencias | Si se agrega alguna. Se justifica en `memory.md`. |

Los RF de la plantilla son **ejemplos a borrar**, no casillas obligatorias: si
una spec solo necesita un comportamiento permanente, se queda con un `RF-1: EL
SISTEMA ...` y borra el resto.

Si al implementar aparece una decisión que la spec no cubre, se actualiza la
spec y se anota en `memory.md` antes de seguir con el código.

## Plantilla

Copiar `000-plantilla/spec.md` y renombrarla al número y nombre que toque.
