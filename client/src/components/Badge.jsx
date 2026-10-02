export default function Badge({ children, tono = 'zinc' }) {
  const tonos = {
    zinc: 'bg-zinc-100 text-zinc-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    verde: 'bg-emerald-50 text-emerald-700',
    apagado: 'bg-zinc-100 text-zinc-400 line-through',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tonos[tono]}`}>
      {children}
    </span>
  );
}
