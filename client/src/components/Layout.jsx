import { NavLink, Outlet } from 'react-router-dom';
import { IconoLibros, IconoEtiqueta, IconoCalendario } from './Iconos.jsx';

const enlaces = [
  { to: '/libros', label: 'Libros', Icono: IconoLibros },
  { to: '/tematicas', label: 'Temáticas', Icono: IconoEtiqueta },
  { to: '/horarios', label: 'Horarios', Icono: IconoCalendario },
];

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <IconoLibros className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-zinc-900">Mi Biblioteca</p>
              <p className="text-xs text-zinc-500">Libros, temáticas y horarios</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {enlaces.map(({ to, label, Icono }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`
                }
              >
                <Icono className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
