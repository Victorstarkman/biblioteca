import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { verificarConexion } from './db.js';
import libros from './routes/libros.js';
import tematicas from './routes/tematicas.js';
import horarios from './routes/horarios.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/api/salud', async (req, res) => {
  const info = await verificarConexion();
  res.json({ estado: 'ok', mysql: info });
});

app.use('/api/libros', libros);
app.use('/api/tematicas', tematicas);
app.use('/api/horarios', horarios);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

const dist = join(__dirname, '..', 'client', 'dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res) => res.sendFile(join(dist, 'index.html')));
}

// express.json() ya marca los errores del cliente con status 4xx y
// `expose: true`. Sin esta rama caían en el 500 de abajo y ensuciaban el log
// con stacks de errores que son culpa del cliente, no del servidor.
const ERRORES_CLIENTE = {
  'entity.parse.failed': 'El cuerpo de la petición no es JSON válido',
  'entity.too.large': 'El cuerpo de la petición es demasiado grande',
};

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.campos) return res.status(err.status || 422).json({ error: err.message, campos: err.campos });
  if (Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: ERRORES_CLIENTE[err.type] ?? 'Petición inválida' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(422).json({ error: 'La temática o el libro seleccionado no existe' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API de la biblioteca escuchando en http://localhost:${PORT}`);
  verificarConexion()
    .then((info) => console.log(`MySQL conectado → base "${info.db}" (${info.version})`))
    .catch((err) => console.error(`Sin conexión a MySQL: ${err.message}`));
});
