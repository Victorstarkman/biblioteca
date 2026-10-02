# Constitución

Esta app es un gestor de biblioteca y de costumbres de lectura: permite catalogar libros por temática y explica de qué va cada libro. Debes leer `AGENTS.md` y `memory.md` antes de tocar nada. Si chocan con esta lista, gana esta constitución.

## Principios (innegociables)

1. **Simplicidad del stack.** Usamos Node+Express+MySQL+React/Vite. No se añade ninguna dependencia sin justificarla en `memory.md`.
2. **Relación entre spec y código.** Toda regla de negocio debe estar clara antes de implementar; no se improvisa.
3. **Separación lógica/interfaz.** La lógica va en `server/routes`/`server/lib`; los `.jsx` solo muestran y llaman a la API.
4. **Política de tests.** Sin instalar dependencias de tests. La verificación es `npm run build`, pruebas manuales de API y Chrome DevTools MCP (abrir `index.html`, funcionalidad, consola y vista móvil).
5. **Protección de datos del usuario.** `.env` nunca va a git. No se borra nada sin confirmación explícita.
6. **Idioma del código y textos.** Todo en español (código, comentarios, errores, UI, commits). En los ENUM de BD no se usan acentos.
