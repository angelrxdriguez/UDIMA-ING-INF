# Banco de preguntas tipo test — 10901 Paradigmas de la Programación

Estas preguntas alimentan el **modo test** de la app de fichas (`../app-fichas`). Con ellas el alumno hace
simulacros de examen de 40 preguntas sacadas al azar de UD1–UD5; si saca ≥ 7 de media en tres simulacros
seguidos, la app le dice que probablemente aprueba. Por eso el banco tiene que parecerse al examen real:
cubrir todo el temario, con la dificultad de un examen (quien solo ha leído por encima falla; quien ha
estudiado acierta), y **sin un solo error**: una pregunta con la respuesta mal marcada le enseña algo falso.

## Formato: `preguntas/udN.json`

Un array JSON (UTF-8) con objetos así:

```json
{"id":"p2-014","ud":2,"tema":"Transparencia referencial","tipo":"teoria","imp":1,
 "q":"Una función recibe los mismos argumentos en dos llamadas y devuelve resultados distintos. ¿Qué propiedad incumple?",
 "code":null,
 "ops":["La transparencia referencial","La evaluación diferida","El polimorfismo paramétrico","La composición de funciones"],
 "why":"Con los mismos datos de entrada una función pura solo puede dar un valor: eso es la transparencia referencial. La evaluación diferida trata de cuándo se evalúa, no de qué devuelve.",
 "src":"Libro cap. 2 p. 5","ficha":"ud2-021"}
```

- `id`: `pN-001`, `pN-002`… correlativos y sin huecos.
- `ud`: número de la unidad.
- `tema`: **exactamente** uno de los valores de `tema` que ya usan las fichas de esa unidad (`tarjetas/udN.json`).
- `tipo`: `"teoria"` o `"codigo"` (si el enunciado o las opciones giran en torno a un fragmento de código).
- `imp`: `1` si pregunta por algo de una ficha esencial (`imp: 1` en las fichas) o de lo más seguro de examen; si no, `2`.
- `q`: enunciado, máximo ~220 caracteres. Admite `` `código en línea` `` y `**negrita**` (se ve resaltado).
- `code`: `null` o un bloque de código (texto con `\n`) que se muestra debajo del enunciado. Máx. ~12 líneas, ~46 columnas.
- `ops`: **exactamente 4 opciones; la correcta SIEMPRE en `ops[0]`** (la app las baraja). Máx. ~110 caracteres cada una.
  Admiten `` `código` `` y `**negrita**`.
- `why`: explicación de 1–2 frases (máx. ~280 caracteres) de por qué es la correcta y, si ayuda, por qué falla el
  distractor más tentador. Es lo que el alumno lee cuando falla: que enseñe.
- `src`: de dónde sale, con la misma notación que las fichas (`S1 diap. 3`, `Resumen UD1 p. 1`, `Libro cap. 2 p. 5`,
  `Guía Lisp p. 4`, `Clase UD2 min. 20`…).
- `ficha`: `id` de la ficha que mejor repasa esa pregunta (o `null` si no hay ninguna).

## Reglas de calidad

1. **Una sola respuesta correcta e indiscutible según el material del curso.** Manda lo que dicen las diapositivas
   y documentos del profesor, aunque otra fuente diga otra cosa. Si las fuentes se contradicen (p. ej. la fecha
   del cálculo lambda 1934/1936, Lisp 1958/1959, 5 o 6 pilares del funcional), **no preguntes eso** o pregúntalo
   de forma que valga para todas.
2. Ningún distractor puede ser también correcto ni «medio correcto». Son conceptos reales de la asignatura (otro
   paradigma, otro lenguaje, una propiedad vecina, un error típico), plausibles para quien no ha estudiado.
3. Las 4 opciones con forma gramatical y longitud parecidas. La correcta **no** debe ser sistemáticamente la más
   larga ni la más matizada; las palabras «siempre», «nunca», «solo» no deben delatar los distractores.
4. Prohibido: «todas las anteriores», «ninguna de las anteriores», «a y b son correctas» (las opciones se barajan).
   Nada de verdadero/falso.
5. Preguntas en negativo («¿Cuál **NO** es…?») como mucho 1 de cada 10, con el NO en negrita.
6. No copies las fichas tal cual: reformula para que se note si se ha entendido (dar la descripción y pedir el
   concepto, plantear un caso, comparar dos paradigmas o lenguajes, completar código, predecir un resultado).
   Mezcla: ~50 % reconocer/definir, ~35 % entender/distinguir/aplicar, el resto código (ver cupo de cada unidad).
7. Cubre **todos los temas** de la unidad, en proporción a las fichas que tiene cada uno, y que ~60 % de las
   preguntas trate de lo esencial (fichas `imp: 1`).
8. Código: tiene que ser correcto y el resultado de las opciones, comprobado.
   - Lisp: ejecútalo con SBCL: `"C:/Program Files/Steel Bank Common Lisp/sbcl.exe" --script fichero.lisp`
     (los ficheros de prueba, en el directorio scratchpad que te indiquen, nunca en el repositorio).
   - Prolog: no hay intérprete instalado; traza a mano con cuidado, y en caso de duda deja la pregunta fuera.
   - Hope/Haskell: solo lo que muestran las diapositivas y la guía; sintaxis sencilla y segura.
9. Español de España, registro de examen, sin faltas. Nada de emojis.

## Cómo trabajar

1. Lee las fichas de la unidad (`tarjetas/udN.json`): son el resumen ya validado del temario, con su fuente.
2. Consulta las fuentes originales cuando haga falta precisar o comprobar: los PDF de `UDn/`. Las diapositivas
   (`S*_U*_*.pdf`) son imágenes: renderízalas con pymupdf a PNG (`python -I`, `import pymupdf`,
   `page.get_pixmap(dpi=110)`) y míralas con la herramienta de lectura de imágenes; el resto se extrae con
   `pdftotext -enc UTF-8 -layout`. Guarda los PNG y textos en el scratchpad, no en el repositorio.
3. Escribe el fichero, valídalo (JSON correcto, 4 opciones, ids, temas válidos) y haz una **segunda pasada
   pregunta por pregunta** contra la fuente: ¿`ops[0]` es correcta? ¿algún distractor también lo es? ¿se puede
   adivinar sin saber? Corrige lo que falle.
