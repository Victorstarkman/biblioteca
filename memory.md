# Memoria del proyecto

Bitácora de actividad. Solo se agregan entradas; las anteriores no se reescriben.
Etiquetas: `[fix]` `[feat]` `[docs]` `[decisión]` `[nota]`

## 2026-10-02

- [feat] Creación del proyecto en `C:\Users\Victor\opencode\biblioteca`.
- [decisión] Node + Vite/React + Tailwind v4 + Express, con npm workspaces
  (`client` y `server`).
- [decisión] Base `biblioteca` nueva y dedicada; no se tocan las bases existentes
  de MySQL (api_rest, blog, crm, etc.).
- [feat] Esquema `biblioteca`: tablas `tematicas`, `libros`, `horarios_lectura`
  con FK e índices. `npm run db:migrate` es idempotente.
- [decisión] `horarios_lectura.dia` es ENUM **sin acentos** (`miercoles`, `sabado`)
  para que la tabla sea legible al inspeccionarla; la UI muestra las etiquetas
  con acento. La lista está duplicada en `server/routes/horarios.js` y
  `client/src/pages/Horarios.jsx` — cambiar en los dos lados.
- [feat] API REST de los tres recursos con validación en `server/lib/validar.js`
  y errores en español por campo (422 con `{ error, campos }`).
- [feat] Frontend en español: páginas de Libros, Temáticas y Horarios, con
  buscador, filtros, modales de alta/edición y confirmación de borrado.
- [fix] `client/src/index.css`: Tailwind v4 no permite `@apply` de clases propias
  dentro de `@layer components` (rompía el build con "Cannot apply unknown utility
  class"). Las clases pasaron a `@utility`.
- [fix] `server/routes/horarios.js`: un `UPDATE` de varias líneas usaba comillas
  simples y provocaba `SyntaxError`. Ahora usa backticks.
- [nota] El API funcionaba (19/19 pruebas) pero en el navegador fallaba al guardar:
  `api.libros.crear is not a function`.
- [fix] Causa raíz del fallo de guardado: en `client/src/lib/api.js`, el helper
  `json('POST')('/api/libros')` **ejecutaba el POST al importar el módulo** y
  guardaba la Promise en vez de una función. Además disparaba 3 POST vacíos en
  cada carga de página (422). Reemplazado por las fábricas `crear`/`actualizar`/
  `eliminar`.
- [nota] Para diagnosticar fallos de UI se usó Chromium headless (Playwright) en
  una carpeta temporal fuera del proyecto, porque los errores del backend sí
  quedan en el log pero los del navegador no. Se cerró y eliminó al terminar.
- [nota] El servidor **no tiene logging de requests**: `dev.log` solo muestra
  errores 500. Para saber si un request llegó hay que consultar la base o
  agregar logging.
- [decisión] Corregido el README: los comandos SÍ funcionan directo desde WSL
  con `npm run`, no hace falta `cmd.exe /c`.
- [docs] Creado `AGENTS.md` con las reglas del proyecto y este archivo como
  memoria. `memory.md` queda fuera de git por ser bitácora personal.
- [feat] Creado el comando `/feature` en `.opencode/commands/feature.md`: pide un
  plan de implementación antes de tocar código (agente `plan`).
- [fix] `/feature` no aparecía en el listado porque el archivo arrancaba con una
  línea en blanco antes del `---`. **El frontmatter YAML tiene que ser lo primero
  del archivo**; con una línea de por medio opencode no lo parsea y no registra
  el comando. Además se corrigió `@MEMORY.md` → `@memory.md` (minúsculas).
- [nota] La config de opencode se carga al arrancar y **no se recarga en caliente**:
  después de crear o editar un comando hay que cerrar y reabrir opencode.
- [feat] Estado de lectura y progreso: `libros.estado` ENUM
  (`pendiente`/`leyendo`/`terminado`, default `pendiente`) y `libros.progreso`
  TINYINT 0–100 (default 0), con `CHECK chk_libros_progreso`. Los 7 libros que
  había quedaron en `pendiente/0`.
- [decisión] `terminado` fuerza 100 y `pendiente` fuerza 0; el backend rechaza con
  422 las combinaciones inconsistentes en vez de corregirlas solo. Cambiar de
  `terminado` a `leyendo` conserva el 100% (no inventa datos).
- [fix] `opcion()` tiene `requerido = true` por default e ignora `defecto`: sin
  `{ requerido: false }` devolvía 422 en vez de aplicar el default `pendiente`.
- [decisión] La migración de cambios de esquema vive en el array `cambios` de
  `server/scripts/migrate.js` (consulta `information_schema` antes de aplicar),
  no en archivos sueltos: MySQL 8 no tiene `ADD COLUMN IF NOT EXISTS` y
  `CREATE TABLE IF NOT EXISTS` no altera tablas existentes.
- [feat] UI: `BarraProgreso` en las cards, badge de estado, filtro por estado en
  `/libros` y control de progreso en el modal (deshabilitado salvo en `leyendo`).
- [nota] `npm run db:seed` inserta estados variados a propósito, pero **no es
  idempotente en `libros`**: correrlo dos veces duplica los 6 libros de ejemplo.
- [nota] Verificado con `npm run build`, 14/14 pruebas de API y 20/20 de UI con
  Chromium headless (la UI se prueba en una carpeta temporal fuera del proyecto y
  se elimina al terminar).
- [fix] El middleware de errores de `server/index.js` devolvía **500** ante un JSON
  malformado o un body >100kb: los errores de `express.json()` traen `status` 4xx
  pero no `campos`, así que caían en la rama genérica. Agregada una rama 4xx con
  mensajes en español (`entity.parse.failed` → 400, `entity.too.large` → 413).
- [fix] Como efecto, los errores del cliente ya no pasan por `console.error(err)` y
  `dev.log` dejó de llenarse de stacks de `raw-body`. Los 500 reales se siguen
  logueando (verificado en un Express aparte, sin tocar el server).
- [feat] Agregada temática "Novela" en `server/scripts/seed.js` y aplicada en BD.
- [docs] AGENTS.md: agregada regla para hacer commit tras aprobación explícita de tarea.
- [feat] MCP: agregado `chrome-devtools` (npx chrome-devtools-mcp@latest) a `.mcp.json` en el proyecto.
- [docs] Creado `docs/constitution.md` con 6 principios innegociables para el proyecto.
- [docs] AGENTS.md: agregada regla de leer `docs/constitution.md` y la spec activa
  (`specs/NNN-*/`) antes de tocar código.
- [decisión] `memory.md` sale de `.gitignore`: era imposible cumplir la regla de
  incluir los cambios de memoria en el commit si el archivo no lo ve git.
- [docs] `specs/README.md` con la convención de specs y `specs/000-plantilla/spec.md`
  como plantilla. La primera spec real (`001-*`) todavía no existe: hay que definir
  de qué feature va a ser.
- [docs] Plantilla de spec reescrita con la estructura genérica (contexto, actores,
  historias, RF en EARS, no funcionales, casos límite, fuera de alcance, criterios
  de finalización, dudas abiertas) más los anexos de `Alcance técnico` y
  `Dependencias`.
- [decisión] Los dos anexos van aparte del bloque central: son específicos de este
  repo (la trampa de tocar `schema.sql` **y** el array `cambios` de
  `migrate.js`, y el principio 1 de justificar dependencias en `memory.md`).
- [decisión] `Criterios de finalización` habla de `npm run build`, pruebas manuales
  y Chrome DevTools MCP, no de "tests en verde": el proyecto no tiene dependencias
  de test (principio 4) y ese ejemplo era imposible de cumplir.
- [decisión] Se conservan `Estado` y `Fecha` bajo el título: `Estado` distingue
  borrador de cerrada y "la spec activa es la de número más alto" no funciona sin
  poder marcar que algo quedó en borrador.
- [decisión] Los RF de la plantilla son ejemplos a borrar, no casillas
  obligatorias. Una spec puede quedar con un solo `RF-1`.
- [nota] La carpeta `.git` tiene el atributo `Hidden` de Windows: ni el Explorador
  ni el explorador de VS Code la muestran. `attrib -h .git` para verla.
- [feat] Remoto `origin` agregado: `https://github.com/Victorstarkman/biblioteca.git`.
  Rama `master` renombrada a `main` y los 8 commits subidos. `README.md` quedó
  intacto: el repo ya existía y **no** hizo falta `git init` ni un commit
  "first commit".
- [nota] Trampa de WSL: `echo "texto" >> archivo` dentro de `powershell.exe` usa el
  redireccionador de PowerShell, no el de bash, y en PS 5.1 escribe en UTF-16
  (archivo corrupto). Para anexar texto usar `Add-Content -Encoding UTF8`.
- [docs] `specs/001-editoriales/spec.md`: editorial como catálogo cerrado (no texto
  suelto), con filtro, orden y búsqueda. 11 RF en EARS, 5 dudas abiertas sin
  resolver. La spec no define implementación: eso va en el plan aparte.
- [nota] `git` no está instalado en WSL, solo en Windows. Para commitear hay que
  usar `powershell.exe -NoProfile -Command "git ..."` con la ruta `C:\...`. Por eso
  el entorno reporta "Is directory a git repo: no" aunque `.git` sí existe.
