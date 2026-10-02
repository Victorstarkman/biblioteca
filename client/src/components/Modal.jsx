import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconoCerrar } from './Iconos.jsx';

export default function Modal({ titulo, onCerrar, children, pie }) {
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', alPresionar);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', alPresionar);
      document.body.style.overflow = '';
    };
  }, [onCerrar]);

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-zinc-900/40 p-4 backdrop-blur-sm sm:items-center">
      <div
        className="absolute inset-0"
        onClick={onCerrar}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="relative z-10 my-auto w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
          <h2 className="text-base font-semibold text-zinc-900">{titulo}</h2>
          <button onClick={onCerrar} className="btn-icono" aria-label="Cerrar">
            <IconoCerrar className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {pie && <div className="flex justify-end gap-2 border-t border-zinc-200 px-5 py-3.5">{pie}</div>}
      </div>
    </div>,
    document.body
  );
}
