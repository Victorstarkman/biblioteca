import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import Campo from '../components/Campo.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';
import Confirmar from '../components/Confirmar.jsx';
import { IconoMas, IconoLapiz, IconoTacho, IconoReloj } from '../components/Iconos.jsx';
import { useAviso } from '../App.jsx';

const DIAS = [
  ['lunes', 'Lunes'],
  ['martes', 'Martes'],
  ['miercoles', 'Miércoles'],
  ['jueves', 'Jueves'],
  ['viernes', 'Viernes'],
  ['sabado', 'Sábado'],
  ['domingo', 'Domingo'],
];

const VACIO = { dia: 'lunes', hora_inicio: '', hora_fin: '', libro_id: '', notas: '', activo: 1 };

const hhmm = (v) => (v ? String(v).slice(0, 5) : '');

export default function Horarios() {
  const avisar = useAviso();
  const [horarios, setHorarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [porBorrar, setPorBorrar] = useState(null);

  async function cargar() {
    try {
      const [hs, ls] = await Promise.all([api.horarios.listar(), api.libros.listar()]);
      setHorarios(hs);
      setLibros(ls);
    } catch (e) {
      avisar(e.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const porDia = useMemo(
    () => DIAS.map(([clave, etiqueta]) => [clave, etiqueta, horarios.filter((h) => h.dia === clave)]),
    [horarios]
  );

  function abrirNuevo() {
    setForm(VACIO);
    setErrores({});
    setEditando('nuevo');
  }

  function abrirEdicion(horario) {
    setForm({
      dia: horario.dia,
      hora_inicio: hhmm(horario.hora_inicio),
      hora_fin: hhmm(horario.hora_fin),
      libro_id: horario.libro_id ?? '',
      notas: horario.notas ?? '',
      activo: horario.activo,
    });
    setErrores({});
    setEditando(horario);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      const cuerpo = { ...form, libro_id: form.libro_id || null, hora_fin: form.hora_fin || null };
      if (editando === 'nuevo') {
        await api.horarios.crear(cuerpo);
        avisar('Horario creado');
      } else {
        await api.horarios.actualizar(editando.id, cuerpo);
        avisar('Horario actualizado');
      }
      setEditando(null);
      await cargar();
    } catch (e) {
      setErrores(e.campos || { hora_inicio: e.message });
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar() {
    setGuardando(true);
    try {
      await api.horarios.eliminar(porBorrar.id);
      avisar('Horario eliminado');
      setPorBorrar(null);
      await cargar();
    } catch (e) {
      avisar(e.message, 'error');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Horarios de lectura</h1>
          <p className="text-sm text-zinc-500">
            {cargando ? 'Cargando…' : `${horarios.length} ${horarios.length === 1 ? 'horario' : 'horarios'} en la semana`}
          </p>
        </div>
        <button className="btn-primario" onClick={abrirNuevo}>
          <IconoMas className="h-4 w-4" /> Agregar horario
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : horarios.length === 0 ? (
        <EmptyState
          titulo="Todavía no definiste horarios"
          descripcion="Planificá los momentos del día que dedicás a leer para sostener el hábito."
          accion={
            <button className="btn-primario mt-1" onClick={abrirNuevo}>
              <IconoMas className="h-4 w-4" /> Agregar horario
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {porDia.map(([clave, etiqueta, items]) => (
            <section key={clave} className="tarjeta overflow-hidden">
              <header className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5">
                <h2 className="text-sm font-semibold text-zinc-900">{etiqueta}</h2>
                <span className="text-xs text-zinc-400">
                  {items.length ? `${items.length} ${items.length === 1 ? 'bloque' : 'bloques'}` : 'Libre'}
                </span>
              </header>

              {items.length === 0 ? (
                <p className="px-4 py-5 text-sm text-zinc-400">Sin lecturas programadas.</p>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {items.map((h) => (
                    <li key={h.id} className="flex items-center gap-4 px-4 py-3">
                      <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-900">
                        <IconoReloj className="h-4 w-4 text-zinc-400" />
                        <span className="tabular-nums">
                          {hhmm(h.hora_inicio)}
                          {h.hora_fin && ` – ${hhmm(h.hora_fin)}`}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        {h.libro ? (
                          <p className="truncate text-sm text-zinc-600">
                            {h.libro} <span className="text-zinc-400">· {h.libro_autor}</span>
                          </p>
                        ) : (
                          <p className="text-sm text-zinc-400">Lectura libre</p>
                        )}
                        {h.notas && <p className="truncate text-xs text-zinc-400">{h.notas}</p>}
                      </div>

                      {!h.activo && <Badge tono="apagado">Inactivo</Badge>}

                      <div className="flex shrink-0 gap-0.5">
                        <button className="btn-icono" onClick={() => abrirEdicion(h)} aria-label="Editar horario">
                          <IconoLapiz className="h-4 w-4" />
                        </button>
                        <button
                          className="btn-icono hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setPorBorrar(h)}
                          aria-label="Eliminar horario"
                        >
                          <IconoTacho className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {editando && (
        <Modal
          titulo={editando === 'nuevo' ? 'Agregar horario' : 'Editar horario'}
          onCerrar={() => !guardando && setEditando(null)}
          pie={
            <>
              <button className="btn-secundario" onClick={() => setEditando(null)} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" form="form-horario" className="btn-primario" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="form-horario" onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Día" required error={errores.dia}>
              <select
                className="campo"
                value={form.dia}
                onChange={(e) => setForm({ ...form, dia: e.target.value })}
              >
                {DIAS.map(([clave, etiqueta]) => (
                  <option key={clave} value={clave}>
                    {etiqueta}
                  </option>
                ))}
              </select>
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Hora de inicio" required error={errores.hora_inicio}>
                <input
                  type="time"
                  className={`campo ${errores.hora_inicio ? 'campo-error' : ''}`}
                  value={form.hora_inicio}
                  onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
                />
              </Campo>
              <Campo etiqueta="Hora de fin" error={errores.hora_fin} ayuda="Opcional">
                <input
                  type="time"
                  className={`campo ${errores.hora_fin ? 'campo-error' : ''}`}
                  value={form.hora_fin}
                  onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
                />
              </Campo>
            </div>

            <Campo etiqueta="Libro" ayuda="Opcional: dejalo vacío si es lectura libre.">
              <select
                className="campo"
                value={form.libro_id}
                onChange={(e) => setForm({ ...form, libro_id: e.target.value })}
              >
                <option value="">Lectura libre</option>
                {libros.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre} — {l.autor}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo etiqueta="Notas" error={errores.notas}>
              <input
                className="campo"
                value={form.notas}
                maxLength={255}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                placeholder="Ej. audiobook los días de semana"
              />
            </Campo>

            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 accent-indigo-600"
                checked={form.activo === 1}
                onChange={(e) => setForm({ ...form, activo: e.target.checked ? 1 : 0 })}
              />
              Horario activo
            </label>
          </form>
        </Modal>
      )}

      {porBorrar && (
        <Confirmar
          titulo="Eliminar horario"
          mensaje={`¿Seguro que querés eliminar el bloque de ${DIAS.find(([c]) => c === porBorrar.dia)?.[1]} a las ${hhmm(
            porBorrar.hora_inicio
          )}?`}
          onConfirmar={eliminar}
          onCancelar={() => !guardando && setPorBorrar(null)}
          ocupado={guardando}
        />
      )}
    </section>
  );
}
