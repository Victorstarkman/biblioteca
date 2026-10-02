import { createContext, useCallback, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Libros from './pages/Libros.jsx';
import Tematicas from './pages/Tematicas.jsx';
import Horarios from './pages/Horarios.jsx';
import { IconoAlerta } from './components/Iconos.jsx';

const AvisoContext = createContext(null);

export function useAviso() {
  return useContext(AvisoContext);
}

export default function App() {
  const [avisos, setAvisos] = useState([]);

  const avisar = useCallback((mensaje, tipo = 'ok') => {
    const id = Date.now() + Math.random();
    setAvisos((previos) => [...previos, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAvisos((previos) => previos.filter((a) => a.id !== id));
    }, 3200);
  }, []);

  const cerrar = (id) => setAvisos((previos) => previos.filter((a) => a.id !== id));

  return (
    <AvisoContext.Provider value={avisar}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/libros" replace />} />
          <Route path="libros" element={<Libros />} />
          <Route path="tematicas" element={<Tematicas />} />
          <Route path="horarios" element={<Horarios />} />
          <Route path="*" element={<Navigate to="/libros" replace />} />
        </Route>
      </Routes>

      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {avisos.map((a) => (
          <div
            key={a.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg ${
              a.tipo === 'error' ? 'bg-rose-600' : 'bg-zinc-800'
            }`}
          >
            {a.tipo === 'error' && <IconoAlerta className="h-4 w-4" />}
            <span>{a.mensaje}</span>
            <button
              onClick={() => cerrar(a.id)}
              className="ml-1 opacity-60 transition hover:opacity-100"
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  );
}
