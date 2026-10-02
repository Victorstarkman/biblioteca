import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS ?? '',
  database: process.env.DB_NAME || 'biblioteca',
  charset: 'utf8mb4_unicode_ci',
});

const tematicas = [
  ['Ciencia ficción', 'Novelas y relatos de ciencia ficción y especulación'],
  ['Fantasía', 'Mundos mágicos, épica y fantasía alternativa'],
  ['Novela', 'Narrativa en prosa con desarrollo de personajes y trama extensa'],
  ['Historia', 'Ensayo y narrativa histórica'],
  ['Tecnología', 'Computación, ingeniería y desarrollo de software'],
  ['Autoayuda', 'Hábitos, productividad y desarrollo personal'],
  ['Misterio', 'Thrillers, novelas de detectives y suspense'],
];

const libros = [
  ['Fundación', 'Isaac Asimov', 'La caída del Imperio y el intento de acortar la era oscura mediante la psicohistoria. Primera parte de la saga.', 'Ciencia ficción', 'leyendo', 72],
  ['Neuromante', 'William Gibson', 'Un pirata computer con implante en la nuca busca su pasado dentro de una matriz digital.', 'Ciencia ficción', 'pendiente', 0],
  ['El nombre de la rosa', 'Umberto Eco', 'Un monasterio medieval, una biblioteca laberíntica y una serie de muertes inexplicables.', 'Fantasía', 'terminado', 100],
  ['Sapiens', 'Yuval Noah Harari', 'Recorrido por la historia de la humanidad y las ideas que la sostienen.', 'Historia', 'leyendo', 35],
  ['Clean Code', 'Robert C. Martin', 'Principios y prácticas para escribir código legible y mantenible.', 'Tecnología', 'pendiente', 0],
  ['El código Da Vinci', 'Dan Brown', 'Un análisis de símbolos que apunta a un secreto de la historia de la Iglesia.', 'Misterio', 'terminado', 100],
];

const horarios = [
  ['lunes', '20:00:00', '21:30:00', 'Lectura tranquila con té'],
  ['miercoles', '19:30:00', '20:30:00', 'Audiobook entre semana'],
  ['sabado', '10:00:00', '12:00:00', 'Rato largo de lectura'],
  ['domingo', '21:00:00', '22:00:00', 'Repaso semanal'],
];

const [resT] = await pool.query('INSERT IGNORE INTO tematicas (nombre, descripcion) VALUES ?', [
  tematicas,
]);
console.log(`Temáticas insertadas: ${resT.affectedRows} de ${tematicas.length}`);

const [filasT] = await pool.query('SELECT id, nombre FROM tematicas');
const porNombre = new Map(filasT.map((t) => [t.nombre, t.id]));

for (const [nombre, autor, contenido, tematica, estado, progreso] of libros) {
  await pool.query(
    'INSERT INTO libros (nombre, autor, contenido, id_tematica, estado, progreso) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, autor, contenido, porNombre.get(tematica) ?? null, estado, progreso]
  );
}
const [resL] = await pool.query('SELECT COUNT(*) AS n FROM libros');
console.log(`Libros en la tabla: ${resL[0].n}`);

await pool.query(
  'INSERT INTO horarios_lectura (dia, hora_inicio, hora_fin, notas) VALUES ?',
  [horarios]
);
const [resH] = await pool.query('SELECT COUNT(*) AS n FROM horarios_lectura');
console.log(`Horarios en la tabla: ${resH[0].n}`);

await pool.end();
console.log('Datos de ejemplo cargados.');
