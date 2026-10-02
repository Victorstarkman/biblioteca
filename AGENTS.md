# AGENTS.md — Mi Biblioteca

## Al empezar

1. Leer este archivo.
2. Leer `memory.md` de la raíz (si existe) para conocer las actividades previas.
3. Trabajar en español: código, comentarios, mensajes y commits.

## Reglas de trabajo

- **Confirmar antes de cambiar.** No modificar archivos sin aprobación explícita.
- Avisar qué archivos se van a tocar y esperar confirmación.
- Ante la duda, preguntar antes de actuar.

## Memoria (`memory.md`)

- `memory.md` en la raíz lleva la bitácora de actividad del proyecto.
- **Después de cada cambio** escribir una entrada. También cuando algo parezca
  importante y no sea un cambio: decisiones tomadas, trampas encontradas, ideas
  descartadas.
- Solo agregar entradas. Nunca reescribir ni borrar las anteriores.
- No hace falta pedir permiso para escribir en `memory.md`.
- Formato: un encabezado `## AAAA-MM-DD` por día y una línea por evento,
  etiquetteando con `[fix]`, `[feat]`, `[docs]`, `[decisión]` o `[nota]`.

```markdown
## 2026-10-02
- [fix] `api.js`: las fábricas devolvían Promises, los formularios no guardaban.
- [decisión] Base `biblioteca` nueva; no se tocan las bases existentes.
```

## Comandos

```bash
npm install
npm run db:migrate   # crea la base `biblioteca` (idempotente) — correr antes de dev
npm run db:seed      # datos de ejemplo
npm run dev          # API :3000 + web :5173
npm run build        # compila client/dist
npm start            # API + SPA compilada en :3000
```

- **No existe `npm test`, ni lint, ni typecheck.** No inventarlos.
- Verificación disponible: `npm run build` + pruebas manuales contra la API.

## Entorno (WSL ↔ Windows)

- El repo está en `/mnt/c`, pero Node y MySQL corren en Windows.
- `npm run …` funciona desde WSL. `node` pelado **no** existe ahí.
- Los puertos 3000/5173 no responden por TCP desde WSL. Para probarlos:
  `powershell.exe -NoProfile -Command "Invoke-RestMethod 'http://localhost:5173/api/libros'"`

## Base de datos

- MySQL WAMP 8.0.27 · `root` sin contraseña · `127.0.0.1:3306` · base `biblioteca`.
- `.env` está en `.gitignore` pero es **obligatorio**: sin él los scripts fallan con
  `node: .env: not found`.
- Los scripts de raíz usan `--env-file=.env`; los de `server/` usan `--env-file=../.env`.
- Para contar filas usar `COUNT(*)`, no `information_schema.TABLE_ROWS`
  (es una estimación de InnoDB y da números falsos).
- **Cambios de esquema**: `schema.sql` solo crea tablas si no existen; no altera
  las que ya están. Para agregar columnas/índices/constraints hay que declarar el
  cambio en el array `cambios` de `server/scripts/migrate.js`, que consulta
  `information_schema` y lo aplica solo si falta (MySQL 8 no tiene
  `ADD COLUMN IF NOT EXISTS`). Actualizá `schema.sql` en el mismo commit para que
  las instalaciones nuevas nazcan iguales.

## Arquitectura

- El cliente pide `/api` relativo; Vite (`:5173`) lo proxea hacia Express (`:3000`).
- `server/index.js` sirve el SPA **solo si existe `client/dist`** (`existsSync`).
  Sin `npm run build`, `npm start` es solo API.
- `app.get('*')` es sintaxis de Express 4; no funciona en Express 5.

## Convenciones (trampas conocidas)

- **Errores**: `server/lib/validar.js` lanza con la propiedad `campos`; el middleware de
  `server/index.js` la traduce a 422. Las rutas deben envolver los handlers con
  `envolver()` o el rechazo nunca llega al middleware.
- **Errores de `express.json()`**: traen `status` 4xx y `type` (`entity.parse.failed`,
  `entity.too.large`), no `campos`. El middleware tiene una rama 4xx aparte; sin ella el
  JSON malformado o un body >100kb devolvían 500 y metían stacks de `raw-body` en el log.
- **Tailwind v4**: usar `@utility`, no `@layer components`. `@apply` de clases propias
  rompe el build.
- **`dia` sin acentos**: el ENUM usa `miercoles`, `sabado`; la UI muestra `Miércoles`,
  `Sábado`. La lista está duplicada en `server/routes/horarios.js` y
  `client/src/pages/Horarios.jsx`.
- **`client/src/lib/api.js`**: las fábricas `crear`/`actualizar`/`eliminar` devuelven
  funciones. No reemplazarlas por helpers curados: ese error dejó los tres
  formularios sin guardar.
- **`opcion()` de `server/lib/validar.js`**: el default `requerido` es `true`, así que
  ignora `defecto` y lanza 422 si el valor viene vacío. Para que un campo sea
  opcional con valor por defecto hay que pasar `{ requerido: false, defecto: … }`.
