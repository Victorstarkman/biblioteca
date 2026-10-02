import { Router } from 'express';
import { query } from '../db.js';
import { envolver, texto, id } from '../lib/validar.js';

const router = Router();

router.get('/', envolver(async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const filas = q
    ? await query(
        `SELECT t.id, t.nombre, t.descripcion, t.created_at,
                (SELECT COUNT(*) FROM libros l WHERE l.id_tematica = t.id) AS total_libros
         FROM tematicas t
         WHERE t.nombre LIKE ?
         ORDER BY t.nombre ASC`,
        [`%${q}%`]
      )
    : await query(
        `SELECT t.id, t.nombre, t.descripcion, t.created_at,
                (SELECT COUNT(*) FROM libros l WHERE l.id_tematica = t.id) AS total_libros
         FROM tematicas t
         ORDER BY t.nombre ASC`
      );
  res.json(filas);
}));

router.post('/', envolver(async (req, res) => {
  const nombre = texto(req.body.nombre, 'nombre', { max: 80 });
  const descripcion = texto(req.body.descripcion, 'descripcion', { requerido: false, max: 255 });
  try {
    const result = await query(
      'INSERT INTO tematicas (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    const filas = await query('SELECT * FROM tematicas WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...filas[0], total_libros: 0 });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: `Ya existe una temática llamada "${nombre}"` });
    }
    throw err;
  }
}));

router.put('/:id', envolver(async (req, res) => {
  const pk = id(req.params.id);
  const nombre = texto(req.body.nombre, 'nombre', { max: 80 });
  const descripcion = texto(req.body.descripcion, 'descripcion', { requerido: false, max: 255 });
  try {
    const { affectedRows } = await query(
      'UPDATE tematicas SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion, pk]
    );
    if (!affectedRows) return res.status(404).json({ error: 'Temática no encontrada' });
    const filas = await query('SELECT * FROM tematicas WHERE id = ?', [pk]);
    res.json({ ...filas[0], total_libros: 0 });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: `Ya existe una temática llamada "${nombre}"` });
    }
    throw err;
  }
}));

router.delete('/:id', envolver(async (req, res) => {
  const { affectedRows } = await query('DELETE FROM tematicas WHERE id = ?', [id(req.params.id)]);
  if (!affectedRows) return res.status(404).json({ error: 'Temática no encontrada' });
  res.status(204).end();
}));

export default router;
