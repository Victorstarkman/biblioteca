# Spec 001 — Editorial de libros

- **Estado:** activa
- **Fecha:** 2026-10-02

## Contexto y objetivo

Hoy la biblioteca permite catalogar libros por temática y explicar de qué va
cada uno, pero no registra quién lo publicó. Cuando alguien tiene varios libros
de la misma editorial y quiere agruparlos, reponer un título o comparar
catálogos de una colección, no hay forma de hacerlo: la información no está, y
por lo tanto tampoco se puede filtrar, ordenar ni buscar por ella.

Esta funcionalidad incorpora la editorial al libro y, al mismo tiempo, la
convierte en una dimensión de consulta comparable a la temática. Busca que se
pueda encontrar un grupo de libros de una misma editorial sin revisarlos uno por
uno.

La editorial no se escribe como texto suelto: se administra como un catálogo
propio, igual que las temáticas, para que la lista de opciones del filtro no se
llene de variantes repetidas del mismo nombre.

## Usuarios / actores

- ** Dueño de la biblioteca.** Es el único usuario de la app. Carga y organiza
  sus libros, las lee y los mantiene.
- No hay otros actores ni roles diferenciados, ni usuarios múltiples ni
  permisos por rol.

## Historias de usuario

- H1: Como dueño de la biblioteca, quiero registrar la editorial de cada libro
  para saber quién lo publicó.
- H2: Como dueño de la biblioteca, quiero filtrar mis libros por editorial para
  ver de un vistazo todo lo que tengo de una misma casa editorial.
- H3: Como dueño de la biblioteca, quiero ordenar mis libros por editorial para
  agruparlos y detectar títulos repetidos de una misma editorial.
- H4: Como dueño de la biblioteca, quiero buscar por editorial para encontrar un
  título rápido cuando recuerdo la editorial pero no el nombre del libro.
- H5: Como dueño de la biblioteca, quiero dar de alta una editorial nueva desde
  la aplicación para poder asignarla a un libro sin entrar a la base de datos.

## Requisitos funcionales (criterios de aceptación en EARS)

### Editorial

- RF-1: CUANDO el dueño de la biblioteca da de alta una editorial con un nombre,
  EL SISTEMA la registra y la muestra en el listado de editoriales.
- RF-2: SI se intenta dar de alta una editorial cuyo nombre ya existe, ENTONCES EL
  SISTEMA rechaza la operación y explica que el nombre está repetido, sin crear un
  registro nuevo.
- RF-3: CUANDO el dueño de la biblioteca edita el nombre de una editorial,
  EL SISTEMA guarda el cambio y el nombre nuevo queda reflejado en el listado y en
  el selector de libros.
- RF-4: EL SISTEMA no ofrece la baja de editoriales.

### Libros

- RF-5: CUANDO se crea o se edita un libro, EL SISTEMA permite elegir su editorial
  de entre las registradas, y también dejarlo sin editorial.
- RF-6: CUANDO se consulta la lista de libros, EL SISTEMA muestra la editorial de
  cada libro.
- RF-7: CUANDO un libro no tiene editorial, EL SISTEMA muestra el texto
  "Editorial no ingresada" en lugar de la editorial.
- RF-8: MIENTRAS un libro no tenga editorial, EL SISTEMA trata su editorial como
  ausente, y no la muestra como si fuera una editorial del catálogo.

### Consulta

- RF-9: CUANDO el dueño de la biblioteca filtra por una editorial, EL SISTEMA
  muestra únicamente los libros asociados a esa editorial.
- RF-10: CUANDO el dueño de la biblioteca ordena por editorial, EL SISTEMA ordena
  los libros según ese criterio.
- RF-11: CUANDO el dueño de la biblioteca busca texto en el buscador, EL SISTEMA
  devuelve también los libros que coinciden por su editorial.

## Requisitos no funcionales

- **Idioma.** Todos los textos visibles, nombres de campos de error y mensajes al
  usuario están en español.
- **Rendimiento.** Filtrar, ordenar y buscar por editorial se comportan igual que
  hoy los filtros existentes, sin degradación perceptible con el volumen actual.
- **Integridad referencial.** Un libro no puede quedar asociado a una editorial
  que no exista.
- **Sin dependencias nuevas.** La funcionalidad no introduce bibliotecas de
  terceros.
- **Sin cambios destructivos.** La incorporación de la editorial no borra ni
  altera los libros, las temáticas ni los horarios ya cargados.

## Casos límite

- **Libro sin editorial.** Es un estado válido y frecuente, no un error. Los
  libros existentes al incorporar la funcionalidad quedan en este estado. En un
  listado sin filtro se muestran con el aviso; al filtrar por una editorial
  concreta, no aparecen.
- **Editorial repetida.** Dos intentos de alta con el mismo nombre producen un
  solo registro; la segunda se rechaza.
- **Editorial homónima con variantes de escritura.** "Bantam", "BANTAM" y
  "bantam" son nombres distintos para el catálogo y conviven como registros
  separados. El sistema no los unifica ni avisa que son parecidos.
- **Editorial usada por varios libros.** Es lo normal. Editar el nombre de esa
  editorial cambia lo que se ve en todos sus libros, sin pedir confirmación.
- **Editorial sin libros asociados.** Puede existir: se dio de alta y todavía no
  se usó. Aparece en el listado y en el selector.
- **Espacios al principio o al final del nombre.** Ver "Dudas abiertas".
- **Nombre muy largo.** Ver "Dudas abiertas".
- **Búsqueda del texto del aviso.** Buscar un texto que coincide con
  "Editorial no ingresada" no devuelve los libros sin editorial: ese texto es
  solo de la interfaz.
- **Búsqueda sin resultados.** Mostrar el estado vacío que ya usa la aplicación,
  sin un mensaje específico de editorial.
- **Borrado de un libro.** Como la baja de editoriales no existe, el borrado de
  un libro no deja referencias colgantes.
- **Coincidencia parcial en la búsqueda.** El texto buscado puede aparecer en
  medio del nombre de la editorial, no solo al principio.

## Fuera de alcance

- La baja de editoriales.
- La descripción, el país o el año de fundación de una editorial: el catálogo es
  solo un nombre.
- Que un libro tenga varias editoriales (co-edición o publicación conjunta). Cada
  libro tiene como máximo una.
- Buscar o filtrar dentro del catálogo de editoriales: ese listado es para
  elegir, no para explorar.
- Unificar variantes de un mismo nombre de editorial.
- Un contador de cuántos libros tiene cada editorial.
- Cualquier permiso o control de acceso por usuario.
- Un historial de cambios en la editorial de un libro.

## Criterios de finalización

- Todos los RF verificados con `npm run build`, pruebas manuales contra la API y
  Chrome DevTools MCP (abrir `index.html`, funcionalidad, consola y vista móvil).
- Los libros que ya existían siguen visibles y sin editorial, con el aviso
  "Editorial no ingresada" en la tarjeta.
- Un libro con editorial muestra el nombre real y responde a filtro, orden y
  búsqueda.
- Sin tests automatizados: el proyecto no tiene dependencias de test.

## Dudas abiertas

- [NECESITA ACLARACIÓN] Si el nombre de la editorial viene con espacios al
  principio o al final, ¿se guardan tal cual, se limpian, o se rechazan? Lo mismo
  para títulos repetidos que solo difieren en mayúsculas o espacios.
- [NECESITA ACLARACIÓN] ¿Cuál es el límite de longitud del nombre de la editorial
  y qué se responde si se supera?
- [NECESITA ACLARACIÓN] Al ordenar por editorial, ¿dónde se ubican los libros que
  no tienen editorial: al principio, al final, o entre medio de forma fija?
- [NECESITA ACLARACIÓN] ¿La búsqueda por editorial debe distinguir mayúsculas,
  como la búsqueda por nombre y autor actual? La respuesta define si "bantam"
  encuentra "Bantam".
- [NECESITA ACLARACIÓN] Al filtrar por una editorial, ¿los libros sin editorial
  se pueden ver de alguna forma (por ejemplo, un filtro "Sin editorial"), o quedan
  directamente fuera del resultado?
