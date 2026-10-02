import { IconoBuscar } from './Iconos.jsx';

export default function Buscador({ valor, onCambio, placeholder = 'Buscar…' }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <IconoBuscar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        className="campo pl-9"
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
      />
    </div>
  );
}
