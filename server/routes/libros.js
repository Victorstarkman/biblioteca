import { Router } from 'express';
import { query } from '../db.js';
import { envolver, entero, texto, opcion, id, ErrorValidacion } from '../lib/validar.js';

const router = Router();

export const ESTADOS = ['pendiente', 'leyendo', 'terminado'];

const SELECT = `
  SELECT l.id, l.nombre, l.autor, l.contenido, l.id_tematica, l.estado, l.progreso,
         t.nombre AS tematica, l.created_at, l.updated_at
  FROM libros l
  LEFT JOIN tematicas t ON t.id = l.id_tematica`;

function cuerpo(body) {
  const estado = opcion(body.estado, 'estado', ESTADOS, { requerido: false, defecto: 'pendiente' });
  const progreso = entero(body.progreso, 'progreso', { requerido: false, min: 0, max: 100 }) ?? 0;

  const campos = {};
  if (estado === 'terminado' && progreso !== 100) {
    campos.progreso = 'Un libro terminado debe estar al 100%';
  }
  if (estado === 'pendiente' && progreso !== 0) {
    campos.progreso = 'Un libro pendiente no puede tener progreso';
  }
  if (Object.keys(campos).length) {
    throw new ErrorValidacion(campos);
  }

  return {
    nombre: texto(body.nombre, 'nombre', { max: 180 }),
    autor: texto(body.autor, 'autor', { max: 150 }),
    contenido: texto(body.contenido, 'contenido', { requerido: false, max: 20000 }),
    id_tematica: entero(body.id_tematica, 'id_tematica', { requerido: false }),
    estado,
    progreso,
  };
}

router.get('/', envolver(async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const tematica = req.query.tematica ? Number(req.query.tematica) : null;
  const estado = req.query.estado
    ? opcion(req.query.estado, 'estado', ESTADOS)
    : null;

  const cond = [];
  const params = [];
  if (q) {
    cond.push('(l.nombre LIKE ? OR l.autor LIKE ? OR l.contenido LIKE ?)');
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (tematica) {
    cond.push('l.id_tematica = ?');
    params.push(tematica);
  }
  if (estado) {
    cond.push('l.estado = ?');
    params.push(estado);
  }
  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

  const filas = await query(`${SELECT} ${where} ORDER BY l.nombre ASC`, params);
  res.json(filas);
}));

router.get('/:id', envolver(async (req, res) => {
  const filas = await query(`${SELECT} WHERE l.id = ?`, [id(req.params.id)]);
  if (!filas.length) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(filas[0]);
}));

router.post('/', envolver(async (req, res) => {
  const d = cuerpo(req.body);
  const result = await query(
    'INSERT INTO libros (nombre, autor, contenido, id_tematica, estado, progreso) VALUES (?, ?, ?, ?, ?, ?)',
    [d.nombre, d.autor, d.contenido, d.id_tematica, d.estado, d.progreso]
  );
  const filas = await query(`${SELECT} WHERE l.id = ?`, [result.insertId]);
  res.status(201).json(filas[0]);
}));

router.put('/:id', envolver(async (req, res) => {
  const pk = id(req.params.id);
  const d = cuerpo(req.body);
  const { affectedRows } = await query(
    `UPDATE libros
     SET nombre = ?, autor = ?, contenido = ?, id_tematica = ?, estado = ?, progreso = ?
     WHERE id = ?`,
    [d.nombre, d.autor, d.contenido, d.id_tematica, d.estado, d.progreso, pk]
  );
  if (!affectedRows) return res.status(404).json({ error: 'Libro no encontrado' });
  const filas = await query(`${SELECT} WHERE l.id = ?`, [pk]);
  res.json(filas[0]);
}));

router.delete('/:id', envolver(async (req, res) => {
  const { affectedRows } = await query('DELETE FROM libros WHERE id = ?', [id(req.params.id)]);
  if (!affectedRows) return res.status(404).json({ error: 'Libro no encontrado' });
  res.status(204).end();
}));

export default router;
