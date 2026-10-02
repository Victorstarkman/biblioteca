# Mi Biblioteca

App para gestionar tu biblioteca personal: **libros**, **temáticas** y **horarios de lectura**.
Interfaz en español, diseño liviano, datos en MySQL.

## Stack

| Capa     | Tecnología                          |
| -------- | ----------------------------------- |
| Frontend | Vite + React 18 + React Router + Tailwind CSS v4 |
| Backend  | Express 4 + mysql2/promise          |
| Datos    | MySQL 8 (base `biblioteca`)         |

## Requisitos

- Node.js 20.6 o superior (probado con Node 22)
- MySQL 8 en `127.0.0.1:3306` con un usuario que pueda crear la base

## Puesta en marcha

```bash
npm install        # instala las dependencias
npm run db:migrate # crea la base y las 3 tablas (idempotente)
npm run db:seed    # opcional: carga datos de ejemplo
npm run dev        # levanta API (3000) + web (5173)
```

Abrí <http://localhost:5173>.

> **Desde WSL:** Node y MySQL corren del lado Windows. Ejecutá los comandos con
> `cmd.exe /c "npm run dev"` desde este directorio.

## Otros comandos

```bash
npm run dev:api    # solo la API en http://localhost:3000
npm run dev:web    # solo el frontend en http://localhost:5173
npm run build      # compila el frontend a client/dist
npm start          # sirve la API + el frontend compilado desde un solo puerto (3000)
```

## Configuración

Las variables están en `.env` (no se versiona):

```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=biblioteca
PORT=3000
```

## Estructura

```
biblioteca/
├── server/
│   ├── index.js            Express, middlewares, manejo de errores
│   ├── db.js               Pool de conexiones MySQL
│   ├── schema.sql          Definición de la base y las tablas
│   ├── lib/validar.js      Validación de datos y errores en español
│   ├── routes/             libros.js · tematicas.js · horarios.js
│   └── scripts/            migrate.js · seed.js
└── client/
    ├── vite.config.js      Tailwind v4 + proxy /api → 3000
    └── src/
        ├── components/     Layout, Modal, Campo, Badge, Buscador, Confirmar, Iconos…
        ├── pages/          Libros.jsx · Tematicas.jsx · Horarios.jsx
        └── lib/api.js      Cliente HTTP
```

## Modelo de datos

**tematicas** — `id`, `nombre` (único), `descripcion`, `created_at`

**libros** — `id`, `nombre`, `autor`, `contenido` (texto libre), `id_tematica`
(FK → `tematicas`, `ON DELETE SET NULL`), `created_at`, `updated_at`

**horarios_lectura** — `id`, `dia` (enum lunes…domingo), `hora_inicio`, `hora_fin`,
`libro_id` (FK → `libros`, `ON DELETE CASCADE`), `notas`, `activo`, `created_at`

## API

| Método   | Ruta                | Descripción                          |
| -------- | ------------------- | ------------------------------------ |
| `GET`    | `/api/salud`        | Estado del servidor y de MySQL       |
| `GET`    | `/api/libros`       | Listar (`?q=` busca, `?tematica=`)  |
| `GET`    | `/api/libros/:id`   | Obtener uno                          |
| `POST`   | `/api/libros`       | Crear                                |
| `PUT`    | `/api/libros/:id`   | Actualizar                           |
| `DELETE` | `/api/libros/:id`   | Eliminar                             |
| `GET`    | `/api/tematicas`    | Listar (incluye `total_libros`)      |
| `POST`   | `/api/tematicas`    | Crear (409 si el nombre ya existe)   |
| `PUT`    | `/api/tematicas/:id`| Actualizar                           |
| `DELETE` | `/api/tematicas/:id`| Eliminar                             |
| `GET`    | `/api/horarios`     | Listar (`?dia=` filtra)              |
| `POST`   | `/api/horarios`     | Crear                                |
| `PUT`    | `/api/horarios/:id` | Actualizar                           |
| `DELETE` | `/api/horarios/:id` | Eliminar                             |

Los errores de validación devuelven `422` con `{ error, campos }`, donde `campos`
mapea cada campo al mensaje en español para mostrarlo bajo el input.

## Próximos pasos posibles

- Estado de lectura (`pendiente` / `leyendo` / `terminado`) y % de progreso
- Portada o portada por URL para cada libro
- Estadísticas: libros por temática, minutos leídos por semana
- Exportar a CSV
