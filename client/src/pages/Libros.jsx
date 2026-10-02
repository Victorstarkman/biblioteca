import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import Campo from '../components/Campo.jsx';
import Badge from '../components/Badge.jsx';
import BarraProgreso from '../components/BarraProgreso.jsx';
import Buscador from '../components/Buscador.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';
import Confirmar from '../components/Confirmar.jsx';
import { IconoMas, IconoLapiz, IconoTacho, IconoLibros } from '../components/Iconos.jsx';
import { useAviso } from '../App.jsx';

const ESTADOS = [
  ['pendiente', 'Pendiente'],
  ['leyendo', 'Leyendo'],
  ['terminado', 'Terminado'],
];

const TONO_ESTADO = { pendiente: 'zinc', leyendo: 'indigo', terminado: 'verde' };

const VACIO = { nombre: '', autor: '', contenido: '', id_tematica: '', estado: 'pendiente', progreso: 0 };

export default function Libros() {
  const avisar = useAviso();
  const [libros, setLibros] = useState([]);
  const [tematicas, setTematicas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [q, setQ] = useState('');
  const [filtroTema, setFiltroTema] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [porBorrar, setPorBorrar] = useState(null);

  async function cargar() {
    try {
      const [ls, ts] = await Promise.all([
        api.libros.listar({ q, tematica: filtroTema, estado: filtroEstado }),
        api.tematicas.listar(),
      ]);
      setLibros(ls);
      setTematicas(ts);
    } catch (e) {
      avisar(e.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(cargar, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [q, filtroTema, filtroEstado]);

  function abrirNuevo() {
    setForm(VACIO);
    setErrores({});
    setEditando('nuevo');
  }

  function abrirEdicion(libro) {
    setForm({
      nombre: libro.nombre,
      autor: libro.autor,
      contenido: libro.contenido ?? '',
      id_tematica: libro.id_tematica ?? '',
      estado: libro.estado ?? 'pendiente',
      progreso: libro.progreso ?? 0,
    });
    setErrores({});
    setEditando(libro);
  }

  function cambiarEstado(estado) {
    setForm((previo) => ({
      ...previo,
      estado,
      progreso: estado === 'terminado' ? 100 : estado === 'pendiente' ? 0 : previo.progreso,
    }));
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      const cuerpo = {
        ...form,
        id_tematica: form.id_tematica || null,
        progreso: form.estado === 'terminado' ? 100 : form.estado === 'pendiente' ? 0 : Number(form.progreso) || 0,
      };
      if (editando === 'nuevo') {
        await api.libros.crear(cuerpo);
        avisar('Libro agregado');
      } else {
        await api.libros.actualizar(editando.id, cuerpo);
        avisar('Libro actualizado');
      }
      setEditando(null);
      await cargar();
    } catch (e) {
      setErrores(e.campos || { nombre: e.message });
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar() {
    setGuardando(true);
    try {
      await api.libros.eliminar(porBorrar.id);
      avisar(`"${porBorrar.nombre}" eliminado`);
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
          <h1 className="text-xl font-semibold text-zinc-900">Libros</h1>
          <p className="text-sm text-zinc-500">
            {cargando ? 'Cargando…' : `${libros.length} ${libros.length === 1 ? 'libro' : 'libros'}`}
          </p>
        </div>
        <button className="btn-primario" onClick={abrirNuevo}>
          <IconoMas className="h-4 w-4" /> Agregar libro
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Buscador valor={q} onCambio={setQ} placeholder="Buscar por nombre, autor o contenido…" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="campo sm:w-52"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
          <select
            className="campo sm:w-52"
            value={filtroTema}
            onChange={(e) => setFiltroTema(e.target.value)}
            aria-label="Filtrar por temática"
          >
            <option value="">Todas las temáticas</option>
            {tematicas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : libros.length === 0 ? (
        <EmptyState
          titulo={q || filtroTema || filtroEstado ? 'Sin resultados' : 'Todavía no tenés libros'}
          descripcion={
            q || filtroTema || filtroEstado
              ? 'Probá con otro término de búsqueda o quitá los filtros.'
              : 'Agregá tu primer libro para empezar a armar tu biblioteca.'
          }
          accion={
            !q && !filtroTema && !filtroEstado && (
              <button className="btn-primario mt-1" onClick={abrirNuevo}>
                <IconoMas className="h-4 w-4" /> Agregar libro
              </button>
            )
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {libros.map((libro) => (
            <li key={libro.id} className="tarjeta flex flex-col gap-3 p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-zinc-900" title={libro.nombre}>
                    {libro.nombre}
                  </h2>
                  <p className="truncate text-sm text-zinc-500" title={libro.autor}>
                    {libro.autor}
                  </p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <button className="btn-icono" onClick={() => abrirEdicion(libro)} aria-label={`Editar ${libro.nombre}`}>
                    <IconoLapiz className="h-4 w-4" />
                  </button>
                  <button
                    className="btn-icono hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => setPorBorrar(libro)}
                    aria-label={`Eliminar ${libro.nombre}`}
                  >
                    <IconoTacho className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {libro.contenido && (
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">{libro.contenido}</p>
              )}

              <div className="mt-auto space-y-3">
                <BarraProgreso valor={libro.progreso} estado={libro.estado} />
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tono={TONO_ESTADO[libro.estado] ?? 'zinc'}>
                    {ESTADOS.find(([v]) => v === libro.estado)?.[1] ?? 'Pendiente'}
                  </Badge>
                  {libro.tematica ? (
                    <Badge tono="indigo">{libro.tematica}</Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                      <IconoLibros className="h-3.5 w-3.5" /> Sin temática
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editando && (
        <Modal
          titulo={editando === 'nuevo' ? 'Agregar libro' : 'Editar libro'}
          onCerrar={() => !guardando && setEditando(null)}
          pie={
            <>
              <button className="btn-secundario" onClick={() => setEditando(null)} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" form="form-libro" className="btn-primario" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="form-libro" onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Nombre del libro" required error={errores.nombre}>
              <input
                className={`campo ${errores.nombre ? 'campo-error' : ''}`}
                value={form.nombre}
                maxLength={180}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. El nombre de la rosa"
                autoFocus
              />
            </Campo>

            <Campo etiqueta="Autor" required error={errores.autor}>
              <input
                className={`campo ${errores.autor ? 'campo-error' : ''}`}
                value={form.autor}
                maxLength={150}
                onChange={(e) => setForm({ ...form, autor: e.target.value })}
                placeholder="Ej. Umberto Eco"
              />
            </Campo>

            <Campo etiqueta="Estado de lectura">
              <select
                className="campo"
                value={form.estado}
                onChange={(e) => cambiarEstado(e.target.value)}
              >
                {ESTADOS.map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo
              etiqueta="Progreso"
              error={errores.progreso}
              ayuda={
                form.estado === 'terminado'
                  ? 'Los libros terminados siempre están al 100%.'
                  : form.estado === 'pendiente'
                    ? 'Los libros pendientes arrancan en 0%.'
                    : undefined
              }
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  className="flex-1 accent-indigo-600"
                  value={form.progreso}
                  disabled={form.estado !== 'leyendo'}
                  onChange={(e) => setForm({ ...form, progreso: e.target.value })}
                  aria-label="Progreso"
                />
                <input
                  type="number"
                  className={`campo w-20 text-center ${errores.progreso ? 'campo-error' : ''}`}
                  min="0"
                  max="100"
                  value={form.progreso}
                  disabled={form.estado !== 'leyendo'}
                  onChange={(e) => setForm({ ...form, progreso: e.target.value })}
                  aria-label="Progreso en porcentaje"
                />
                <span className="text-sm text-zinc-500">%</span>
              </div>
            </Campo>

            <Campo etiqueta="Temática">
              <select
                className="campo"
                value={form.id_tematica}
                onChange={(e) => setForm({ ...form, id_tematica: e.target.value })}
              >
                <option value="">Sin temática</option>
                {tematicas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo etiqueta="Contenido" error={errores.contenido} ayuda="Sinopsis, notas o resumen.">
              <textarea
                className={`campo min-h-28 resize-y ${errores.contenido ? 'campo-error' : ''}`}
                value={form.contenido}
                onChange={(e) => setForm({ ...form, contenido: e.target.value })}
                placeholder="De qué trata el libro…"
              />
            </Campo>
          </form>
        </Modal>
      )}

      {porBorrar && (
        <Confirmar
          titulo="Eliminar libro"
          mensaje={`¿Seguro que querés eliminar "${porBorrar.nombre}"? Esta acción no se puede deshacer.`}
          onConfirmar={eliminar}
          onCancelar={() => !guardando && setPorBorrar(null)}
          ocupado={guardando}
        />
      )}
    </section>
  );
}
