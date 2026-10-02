async function pedir(url, opciones = {}) {
  const respuesta = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  });

  if (respuesta.status === 204) return null;

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(datos?.error || 'No se pudo completar la operación');
    error.campos = datos?.campos;
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}

const crear = (url) => (cuerpo) => pedir(url, { method: 'POST', body: JSON.stringify(cuerpo) });

const actualizar = (url) => (id, cuerpo) =>
  pedir(`${url}/${id}`, { method: 'PUT', body: JSON.stringify(cuerpo) });

const eliminar = (url) => (id) => pedir(`${url}/${id}`, { method: 'DELETE' });

export const api = {
  libros: {
    listar: (params = {}) => {
      const q = new URLSearchParams();
      if (params.q) q.set('q', params.q);
      if (params.tematica) q.set('tematica', params.tematica);
      if (params.estado) q.set('estado', params.estado);
      const s = q.toString();
      return pedir(`/api/libros${s ? `?${s}` : ''}`);
    },
    crear: crear('/api/libros'),
    actualizar: actualizar('/api/libros'),
    eliminar: eliminar('/api/libros'),
  },
  tematicas: {
    listar: () => pedir('/api/tematicas'),
    crear: crear('/api/tematicas'),
    actualizar: actualizar('/api/tematicas'),
    eliminar: eliminar('/api/tematicas'),
  },
  horarios: {
    listar: (dia) => pedir(`/api/horarios${dia ? `?dia=${dia}` : ''}`),
    crear: crear('/api/horarios'),
    actualizar: actualizar('/api/horarios'),
    eliminar: eliminar('/api/horarios'),
  },
};
