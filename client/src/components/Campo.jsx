export default function Campo({ etiqueta, error, ayuda, required, children, className = '' }) {
  return (
    <div className={className}>
      {etiqueta && (
        <label className="etiqueta">
          {etiqueta}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-xs text-rose-600">{error}</p>
      ) : (
        ayuda && <p className="mt-1 text-xs text-zinc-500">{ayuda}</p>
      )}
    </div>
  );
}
