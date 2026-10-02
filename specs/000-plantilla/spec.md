# Spec NNN — <Nombre de la funcionalidad>

- **Estado:** borrador | activa | cerrada
- **Fecha:** AAAA-MM-DD

## Contexto y objetivo

<Qué problema resuelve y por qué merece la pena. Un párrafo.>

## Usuarios / actores

<Quién lo usa.>

## Historias de usuario

- H1: Como <rol> quiero <acción> para <beneficio>.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO <evento>, EL SISTEMA <respuesta> (salida/resultado esperado).
- RF-2: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-3: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-4: EL SISTEMA <comportamiento permanente>.

## Requisitos no funcionales

<Solo los que apliquen: rendimiento, seguridad, plataformas, idioma...>

## Casos límite

<Vacíos, duplicados, datos corruptos, límites, concurrencia...>

## Fuera de alcance

<Lo que explícitamente NO se hace en esta iteración.>

## Criterios de finalización

<Todos los RF verificados con `npm run build`, pruebas manuales contra la API y
Chrome DevTools MCP (abrir `index.html`, funcionalidad, consola y vista móvil).
Sin tests automatizados: el proyecto no tiene dependencias de test.>

## Dudas abiertas

- [NECESITA ACLARACIÓN] <duda>

---

<!-- Anexos: secciones específicas de este repo. Completar o borrar si no aplican. -->

## Alcance técnico

- **API:** <rutas y endpoints afectados>
- **Validación:** <qué valida `server/lib/validar.js`>
- **BD:** <cambios en `schema.sql` y en el array `cambios` de
  `server/scripts/migrate.js`; "ninguno" si no aplica>
- **UI:** <pantallas afectadas. Los `.jsx` solo muestran y llaman a la API.>

## Dependencias

<Ninguna, o la nueva dependencia + justificación en `memory.md`
(principio 1 de `docs/constitution.md`).>
