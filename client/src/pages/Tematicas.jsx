import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import Campo from '../components/Campo.jsx';
import Badge from '../components/Badge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Spinner from '../components/Spinner.jsx';
import Confirmar from '../components/Confirmar.jsx';
import { IconoMas, IconoLapiz, IconoTacho } from '../components/Iconos.jsx';
import { useAviso } from '../App.jsx';

const VACIO = { nombre: '', descripcion: '' };

export default function Tematicas() {
  const avisar = useAviso();
  const [tematicas, setTematicas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [porBorrar, setPorBorrar] = useState(null);

  async function cargar() {
    try {
      setTematicas(await api.tematicas.listar());
    } catch (e) {
      avisar(e.message, 'error');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function abrirNueva() {
    setForm(VACIO);
    setErrores({});
    setEditando('nueva');
  }

  function abrirEdicion(tematica) {
    setForm({ nombre: tematica.nombre, descripcion: tematica.descripcion ?? '' });
    setErrores({});
    setEditando(tematica);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrores({});
    try {
      if (editando === 'nueva') {
        await api.tematicas.crear(form);
        avisar('Temática creada');
      } else {
        await api.tematicas.actualizar(editando.id, form);
        avisar('Temática actualizada');
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
      await api.tematicas.eliminar(porBorrar.id);
      avisar(`Temática "${porBorrar.nombre}" eliminada`);
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
          <h1 className="text-xl font-semibold text-zinc-900">Temáticas</h1>
          <p className="text-sm text-zinc-500">
            {cargando ? 'Cargando…' : `${tematicas.length} ${tematicas.length === 1 ? 'temática' : 'temáticas'}`}
          </p>
        </div>
        <button className="btn-primario" onClick={abrirNueva}>
          <IconoMas className="h-4 w-4" /> Agregar temática
        </button>
      </div>

      {cargando ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : tematicas.length === 0 ? (
        <EmptyState
          titulo="Todavía no definiste temáticas"
          descripcion="Las temáticas te permiten agrupar tus libros por género o tema."
          accion={
            <button className="btn-primario mt-1" onClick={abrirNueva}>
              <IconoMas className="h-4 w-4" /> Agregar temática
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tematicas.map((tematica) => (
            <li key={tematica.id} className="tarjeta flex flex-col gap-2 p-4 transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-zinc-900">{tematica.nombre}</h2>
                  {tematica.descripcion && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500">{tematica.descripcion}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <button
                    className="btn-icono"
                    onClick={() => abrirEdicion(tematica)}
                    aria-label={`Editar ${tematica.nombre}`}
                  >
                    <IconoLapiz className="h-4 w-4" />
                  </button>
                  <button
                    className="btn-icono hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => setPorBorrar(tematica)}
                    aria-label={`Eliminar ${tematica.nombre}`}
                  >
                    <IconoTacho className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-auto">
                <Badge tono={tematica.total_libros ? 'indigo' : 'zinc'}>
                  {tematica.total_libros}{' '}
                  {tematica.total_libros === 1 ? 'libro' : 'libros'}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editando && (
        <Modal
          titulo={editando === 'nueva' ? 'Agregar temática' : 'Editar temática'}
          onCerrar={() => !guardando && setEditando(null)}
          pie={
            <>
              <button className="btn-secundario" onClick={() => setEditando(null)} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" form="form-tematica" className="btn-primario" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="form-tematica" onSubmit={guardar} className="space-y-4">
            <Campo etiqueta="Nombre" required error={errores.nombre}>
              <input
                className={`campo ${errores.nombre ? 'campo-error' : ''}`}
                value={form.nombre}
                maxLength={80}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Ciencia ficción"
                autoFocus
              />
            </Campo>

            <Campo etiqueta="Descripción" error={errores.descripcion}>
              <textarea
                className="campo min-h-20 resize-y"
                value={form.descripcion}
                maxLength={255}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Opcional: una breve descripción"
              />
            </Campo>
          </form>
        </Modal>
      )}

      {porBorrar && (
        <Confirmar
          titulo="Eliminar temática"
          mensaje={
            porBorrar.total_libros
              ? `"${porBorrar.nombre}" tiene ${porBorrar.total_libros} ${
                  porBorrar.total_libros === 1 ? 'libro' : 'libros'
                }. Los libros se conservan, pero quedarán sin temática.`
              : `¿Seguro que querés eliminar la temática "${porBorrar.nombre}"?`
          }
          onConfirmar={eliminar}
          onCancelar={() => !guardando && setPorBorrar(null)}
          ocupado={guardando}
        />
      )}
    </section>
  );
}
