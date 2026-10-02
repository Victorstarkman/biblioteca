import { Router } from 'express';
import { query } from '../db.js';
import { envolver, entero, texto, opcion, hora, booleano, id } from '../lib/validar.js';

const router = Router();

export const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const ORDEN = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 7 };

const SELECT = `
  SELECT h.id, h.dia, h.hora_inicio, h.hora_fin, h.libro_id, h.notas, h.activo,
         l.nombre AS libro, l.autor AS libro_autor, h.created_at
  FROM horarios_lectura h
  LEFT JOIN libros l ON l.id = h.libro_id`;

function cuerpo(body) {
  const dia = opcion(body.dia, 'dia', DIAS);
  const hora_inicio = hora(body.hora_inicio, 'hora_inicio');
  const hora_fin = hora(body.hora_fin, 'hora_fin', { requerido: false });
  if (hora_fin && hora_fin <= hora_inicio) {
    const e = new Error('La hora de fin debe ser posterior a la de inicio');
    e.campos = { hora_fin: e.message };
    e.status = 422;
    throw e;
  }
  return {
    dia,
    hora_inicio,
    hora_fin,
    libro_id: entero(body.libro_id, 'libro_id', { requerido: false }),
    notas: texto(body.notas, 'notas', { requerido: false, max: 255 }),
    activo: booleano(body.activo, 1),
  };
}

router.get('/', envolver(async (req, res) => {
  const dia = req.query.dia
    ? opcion(req.query.dia, 'dia', DIAS)
    : null;
  const filas = dia
    ? await query(`${SELECT} WHERE h.dia = ? ORDER BY h.hora_inicio ASC`, [dia])
    : await query(`${SELECT} ORDER BY FIELD(h.dia, ${DIAS.map((d) => `'${d}'`).join(',')}), h.hora_inicio ASC`);
  res.json(filas);
}));

router.post('/', envolver(async (req, res) => {
  const d = cuerpo(req.body);
  const result = await query(
    'INSERT INTO horarios_lectura (dia, hora_inicio, hora_fin, libro_id, notas, activo) VALUES (?, ?, ?, ?, ?, ?)',
    [d.dia, d.hora_inicio, d.hora_fin, d.libro_id, d.notas, d.activo]
  );
  const filas = await query(`${SELECT} WHERE h.id = ?`, [result.insertId]);
  res.status(201).json(filas[0]);
}));

router.put('/:id', envolver(async (req, res) => {
  const pk = id(req.params.id);
  const d = cuerpo(req.body);
  const { affectedRows } = await query(
    `UPDATE horarios_lectura
     SET dia = ?, hora_inicio = ?, hora_fin = ?, libro_id = ?, notas = ?, activo = ?
     WHERE id = ?`,
    [d.dia, d.hora_inicio, d.hora_fin, d.libro_id, d.notas, d.activo, pk]
  );
  if (!affectedRows) return res.status(404).json({ error: 'Horario no encontrado' });
  const filas = await query(`${SELECT} WHERE h.id = ?`, [pk]);
  res.json(filas[0]);
}));

router.delete('/:id', envolver(async (req, res) => {
  const { affectedRows } = await query('DELETE FROM horarios_lectura WHERE id = ?', [id(req.params.id)]);
  if (!affectedRows) return res.status(404).json({ error: 'Horario no encontrado' });
  res.status(204).end();
}));

export { ORDEN };
export default router;
