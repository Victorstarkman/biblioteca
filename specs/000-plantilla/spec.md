# NNN — Título de la spec

- **Estado:** borrador | activa | cerrada
- **Fecha:** AAAA-MM-DD

## Problema

Qué falta hoy y por qué hace falta. Sin esto no se toca código.

## Regla de negocio

Descripción precisa, en una frase por caso. Evitar "se hace lo razonable".

## Casos borde

| Entrada | Resultado esperado | Código |
| --- | --- | --- |
| … | … | 200 / 422 / 404 |

## Alcance técnico

- **API:** rutas y endpoints afectados.
- **Validación:** qué valida `server/lib/validar.js`.
- **BD:** cambios de esquema en `schema.sql` **y** en el array `cambios` de
  `server/scripts/migrate.js` (si los hay).
- **UI:** pantallas afectadas y qué muestran los `.jsx` (solo llaman a la API).

## Fuera de alcance

Lo que explícitamente no se hace en esta spec.

## Dependencias

Dependencias nuevas (con justificación en `memory.md`, principio 1) o `ninguna`.
