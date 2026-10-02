import Modal from './Modal.jsx';

export default function Confirmar({ titulo, mensaje, textoConfirmar = 'Eliminar', onConfirmar, onCancelar, ocupado }) {
  return (
    <Modal
      titulo={titulo}
      onCerrar={onCancelar}
      pie={
        <>
          <button className="btn-secundario" onClick={onCancelar} disabled={ocupado}>
            Cancelar
          </button>
          <button className="btn-peligro" onClick={onConfirmar} disabled={ocupado}>
            {ocupado ? 'Eliminando…' : textoConfirmar}
          </button>
        </>
      }
    >
      <p className="text-sm text-zinc-600">{mensaje}</p>
    </Modal>
  );
}
