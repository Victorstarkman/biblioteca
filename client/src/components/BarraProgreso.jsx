const TONOS = {
  pendiente: 'bg-zinc-300',
  leyendo: 'bg-indigo-500',
  terminado: 'bg-emerald-500',
};

export default function BarraProgreso({ valor = 0, estado = 'pendiente', className = '' }) {
  const pct = Math.max(0, Math.min(100, Number(valor) || 0));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all ${TONOS[estado] ?? TONOS.pendiente}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs tabular-nums text-zinc-500">{pct}%</span>
    </div>
  );
}
