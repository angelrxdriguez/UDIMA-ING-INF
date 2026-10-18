# Apuntes de UDIMA

Repositorio de estudio del grado: una carpeta por asignatura (`10888 Álgebra`, `10892 Tecnología de Computadores`,
`10901 Paradigmas de la Programación`) y dentro una por unidad (`UD1 …`, `UD2 …`) con los PDF del profesor y lo que
generamos (tutoriales, resúmenes, transcripciones). Habla siempre en español. `_herramientas/` contiene los scripts
compartidos y las fuentes HTML de los PDF generados.

## Clases grabadas de Zoom: transcribir y sacar apuntes

Tarea habitual: el usuario pega el enlace de una clase del aula (`https://aula.udima.es/blocks/zoom_udima/player.php?url=…player.vimeo.com%2Fvideo%2F<id>…`)
y pide apuntes, un resumen o mejorar el material de esa unidad.

1. **Transcripción.** Sin navegador:
   `python -I _herramientas/clase_vimeo.py "<enlace>" "<carpeta de la UD>" "Clase UDn" "<Asignatura> - Clase UDn: <tema> (sesión del dd/mm/aaaa)"`.
   Guarda `Clase UDn - subtitulos.vtt` y `Clase UDn - transcripcion.txt` (párrafos con `[hh:mm:ss]`). El vídeo solo se
   deja ver incrustado en el aula, por eso el script pide la configuración de Vimeo con `Referer: https://aula.udima.es/`.
   Si hiciera falta un navegador, usar el **navegador secundario** con la extensión de Claude: el 18/10/2026 el usuario
   pidió no usar su Chrome principal para esto.
2. **Leer la clase entera** y las diapositivas de esa unidad (el profesor sigue sus diapositivas y las sube después: en
   Álgebra UD2 eran `algebra_ejercicios-2-paginado.pdf`). Los subtítulos son automáticos: fallan números, signos («menos»
   desaparece) y nombres («Luche-Frobenius», «ECE 1» = AEC 1). Las matrices y resultados se sacan de las diapositivas y se
   comprueban a mano; no atribuir al profesor algo que solo puede ser un error del subtitulado. Citas literales y cortas.
3. **Entregables**, en la carpeta de la unidad:
   - La transcripción y los subtítulos del paso 1.
   - `Resumen Clase UDn - <tema>.pdf`: **máximo 12 páginas**, en orden cronológico, con marcas de minuto `▶ mm:ss`,
     los ejemplos con sus matrices, lo que el profesor dijo de palabra (criterios de corrección, trucos, avisos),
     las preguntas de los alumnos y una lista final para el examen.
   - Si la unidad ya tiene tutorial (`Tutorial_*.pdf`), mejorarlo con **páginas de notas de clase** insertadas detrás de
     la lección que complementan, numeradas con letra (`8a` va detrás de la 8) para no romper la numeración, el índice
     ni las referencias; etiqueta verde «En clase → p. 8a» en la cabecera de las páginas relacionadas, sección nueva al
     final del índice y marcadores. Se regenera siempre desde una copia del tutorial sin notas guardada en
     `_herramientas/fuentes/<asignatura>-UDn/`. Modelo completo: `_herramientas/fuentes/10888-UD2/`.

## Cómo se hacen los PDF

No hay LaTeX instalado. Los PDF se escriben en HTML y se imprimen con Chrome sin ventana, con el aspecto de los tutoriales:

- `node _herramientas/html2pdf.mjs entrada.html salida.pdf` — fórmulas entre `$…$` / `$$…$$` con KaTeX; macros `\M{rr|r}{…}`
  (matriz), `\piv{1}` (pivote resaltado), `\op{F_2-2F_1}`, `\ok`. Estilos en `_herramientas/estilo-tutorial.css`: cajas
  `.caja.{clase,ejemplo,faq,turno,resumen,metodo}` con `.tit`/`.cue`, notas `.nota.{error,comprueba,idea,clase}`, marca de
  minuto `.min`, filas de matrices `.cadena`, portada `.primera > .portada` (con `@page :first { margin: 0 }`).
- `python _herramientas/cabecera.py entrada.pdf salida.pdf "Asignatura · Tema n · …"` — cabecera y número de página (la
  portada queda sin cabecera).
- Primera vez en un equipo: `npm install` dentro de `_herramientas` (`node_modules` no va al repositorio).
- Revisar siempre las páginas renderizadas (pymupdf → PNG): cada página de notas debe caber en una sola hoja; vigilar
  títulos huérfanos al pie y cadenas de matrices que saltan de línea (partirlas en varias `.cadena`).
- Trampas conocidas: en los macros de KaTeX los colores van sin `#`; Chrome recorta lo que se sale de los márgenes de
  `@page`; con pymupdf, insertar solo las fuentes que se usan y guardar con `subset_fonts()` + `garbage=4`, o el PDF
  se dispara de tamaño.
- Disponibles: Python 3.12 (pymupdf, pypdf, reportlab), Node 24, Chrome en `C:/Program Files/Google/Chrome/Application/`,
  `pdftotext`.
