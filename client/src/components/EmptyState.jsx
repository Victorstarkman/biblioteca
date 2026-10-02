export default function EmptyState({ titulo, descripcion, accion }) {
  return (
    <div className="tarjeta flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="text-sm font-medium text-zinc-800">{titulo}</p>
      {descripcion && <p className="max-w-sm text-sm text-zinc-500">{descripcion}</p>}
      {accion}
    </div>
  );
}
