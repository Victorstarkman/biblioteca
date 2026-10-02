export class ErrorValidacion extends Error {
  constructor(campos) {
    super('Datos inválidos');
    this.status = 422;
    this.campos = campos;
  }
}

export function texto(valor, campo, { requerido = true, max = 255 } = {}) {
  const v = typeof valor === 'string' ? valor.trim() : '';
  if (!v) {
    if (requerido) throw new ErrorValidacion({ [campo]: 'Este campo es obligatorio' });
    return null;
  }
  if (v.length > max) {
    throw new ErrorValidacion({ [campo]: `Máximo ${max} caracteres` });
  }
  return v;
}

export function entero(valor, campo, { requerido = true, min = 1, max = 4294967295 } = {}) {
  if (valor === null || valor === undefined || valor === '') {
    if (requerido) throw new ErrorValidacion({ [campo]: 'Este campo es obligatorio' });
    return null;
  }
  const n = Number(valor);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new ErrorValidacion({ [campo]: 'Valor no válido' });
  }
  return n;
}

export function opcion(valor, campo, valores, { requerido = true, defecto } = {}) {
  if (valor === null || valor === undefined || valor === '') {
    if (requerido) throw new ErrorValidacion({ [campo]: 'Este campo es obligatorio' });
    return defecto ?? null;
  }
  const v = String(valor).trim().toLowerCase();
  if (!valores.includes(v)) {
    throw new ErrorValidacion({ [campo]: 'Valor no válido' });
  }
  return v;
}

export function hora(valor, campo, { requerido = true } = {}) {
  if (valor === null || valor === undefined || valor === '') {
    if (requerido) throw new ErrorValidacion({ [campo]: 'Este campo es obligatorio' });
    return null;
  }
  const v = String(valor).trim();
  if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v)) {
    throw new ErrorValidacion({ [campo]: 'Hora no válida (formato HH:MM)' });
  }
  return v.length === 5 ? `${v}:00` : v;
}

export function booleano(valor, defecto = 1) {
  if (valor === null || valor === undefined || valor === '') return defecto;
  if (typeof valor === 'boolean') return valor ? 1 : 0;
  return ['1', 'true', 'si', 'sí'].includes(String(valor).toLowerCase()) ? 1 : 0;
}

export function id(valor) {
  return entero(valor, 'id');
}

export function envolver(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
