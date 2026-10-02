import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import mysql from 'mysql2/promise';

const __dirname = dirname(fileURLToPath(import.meta.url));

const admin = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ?? '',
  multipleStatements: true,
  charset: 'utf8mb4_unicode_ci',
};

const DB = process.env.DB_NAME || 'biblioteca';

// Cambios sobre tablas YA existentes. schema.sql solo crea tablas nuevas
// (CREATE TABLE IF NOT EXISTS no altera las que ya están), así que agregar una
// columna a `libros` hay que hacerlo acá. MySQL 8 no tiene
// `ADD COLUMN IF NOT EXISTS`, por eso se consulta information_schema antes.
// Si tocás este archivo, actualizá también schema.sql para que las
// instalaciones nuevas nazcan con lo mismo.
const cambios = [
  {
    tipo: 'columna',
    tabla: 'libros',
    nombre: 'estado',
    definicion: "ENUM('pendiente','leyendo','terminado') NOT NULL DEFAULT 'pendiente'",
  },
  {
    tipo: 'columna',
    tabla: 'libros',
    nombre: 'progreso',
    definicion: 'TINYINT UNSIGNED NOT NULL DEFAULT 0',
  },
  {
    tipo: 'indice',
    tabla: 'libros',
    nombre: 'idx_libros_estado',
    definicion: '`estado`',
  },
  {
    tipo: 'check',
    tabla: 'libros',
    nombre: 'chk_libros_progreso',
    definicion: '`progreso` BETWEEN 0 AND 100',
  },
];

const consulta = {
  columna: (c) =>
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
  indice: (c) =>
    `SELECT 1 FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
  check: (c) =>
    `SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ?`,
};

const sql = {
  columna: (c) => `ALTER TABLE \`${c.tabla}\` ADD COLUMN \`${c.nombre}\` ${c.definicion}`,
  indice: (c) => `ALTER TABLE \`${c.tabla}\` ADD INDEX \`${c.nombre}\` (${c.definicion})`,
  check: (c) =>
    `ALTER TABLE \`${c.tabla}\` ADD CONSTRAINT \`${c.nombre}\` CHECK (${c.definicion})`,
};

const sqlEsquema = await readFile(join(__dirname, '..', 'schema.sql'), 'utf8');
const conexion = await mysql.createConnection(admin);

let aplicados = 0;
let omitidos = 0;

try {
  await conexion.query(sqlEsquema);

  for (const cambio of cambios) {
    const [existe] = await conexion.execute(consulta[cambio.tipo](cambio), [
      DB,
      cambio.tabla,
      cambio.nombre,
    ]);
    if (existe.length) {
      omitidos++;
      continue;
    }
    await conexion.query(sql[cambio.tipo](cambio));
    aplicados++;
    console.log(`  + ${cambio.tipo} ${cambio.tabla}.${cambio.nombre}`);
  }

  console.log(`Base "${DB}" lista: tematicas, libros y horarios_lectura`);
  console.log(
    aplicados
      ? `Esquema actualizado (${aplicados} cambios aplicados, ${omitidos} ya existían).`
      : 'Esquema sin cambios: todo ya estaba aplicado.'
  );
} catch (err) {
  console.error(`Error aplicando el esquema: ${err.message}`);
  process.exitCode = 1;
} finally {
  await conexion.end();
}
