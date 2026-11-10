# Pasa a ../temario/*.md los materiales que ya tienen texto (una sección «## p. N» por página), para el asistente
# «Pregúntale al temario» de la app. Los PDF que son imágenes (S1, S3, S4, S5 y el capítulo 2) se transcribieron
# aparte leyendo las páginas; aquí no se tocan.
# Uso: python -X utf8 -I extraer_temario.py
import pathlib
import re
import sys

import pymupdf

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent
DEST = RAIZ / 'temario'

PDFS = [
    ('Estado del arte', 'UD1/Estado del arte de los paradigmas de programación.pdf', 'Estado del arte de los paradigmas de programación (UD1)'),
    ('Resumen UD1', 'UD1/Resumen_unidad1.pdf', 'Resumen de la unidad 1 (aula)'),
    ('Guía Lisp', 'UD2/Guia_Lisp.pdf', 'Guía de Common Lisp (UD2)'),
    ('Resumen clase UD2', 'UD2/Resumen UD2 - Paradigma funcional.pdf', 'Resumen de la clase grabada de la UD2 (apuntes)'),
    ('Guía Haskell', 'UD3/Guía de lenguaje Haskell.pdf', 'Guía del lenguaje Haskell (UD3)'),
    ('Unidad 4', 'UD4/Unidad 4 - El Paradigma Lógico.pdf', 'Unidad 4 — El paradigma lógico (texto de la unidad; cubre UD4 y UD5)'),
]


def limpia(t: str) -> str:
    t = t.replace('\r', '').replace('­', '').replace('', '•').replace('', '•')
    t = re.sub(r'(\w)-\n(\w)', r'\1\2', t)            # palabras partidas con guion al final de línea
    t = re.sub(r'[ \t]+\n', '\n', t)
    t = re.sub(r'^([•▪◦●-])[ \t]*\n(?=\S)', r'\1 ', t, flags=re.M)  # viñeta sola en su línea y el texto debajo
    t = re.sub(r'\n{3,}', '\n\n', t)
    return t.strip()


def pdf_a_md(cita: str, ruta: str, titulo: str) -> str:
    doc = pymupdf.open(RAIZ / ruta)
    partes = [f'# {cita} · {titulo}', f'Fuente: {ruta}', '']
    for i, pag in enumerate(doc, 1):
        txt = limpia(pag.get_text('text'))
        if not txt:
            continue
        partes += [f'## p. {i}', txt, '']
    return '\n'.join(partes)


def codigo_md() -> None:
    lisp = (RAIZ / 'UD3/introduccion.lisp').read_text(encoding='utf8', errors='replace')
    # Una sección por bloque grande de comentarios para que el buscador pueda citar trozos manejables.
    bloques, cur = [], []
    for linea in lisp.splitlines():
        if re.match(r'^;\s*-{5,}|^;{3,}', linea) and cur:
            bloques.append(cur); cur = []
        cur.append(linea)
    if cur:
        bloques.append(cur)
    # Si el fichero no tiene separadores, se trocea cada ~45 líneas.
    if len(bloques) < 3:
        lin = lisp.splitlines()
        bloques = [lin[i:i + 45] for i in range(0, len(lin), 45)]
    out = ['# introduccion.lisp · Introducción a Lisp comentada por el profesor (aula, UD3)', 'Fuente: UD3/introduccion.lisp', '']
    for k, b in enumerate(bloques, 1):
        out += [f'## parte {k}', '```lisp', *b, '```', '']
    (DEST / 'introduccion.lisp.md').write_text('\n'.join(out), encoding='utf8')

    ej = RAIZ / 'UD4/Unidad_4'
    out = ['# Ejercicios Prolog UD4 · Programas y consultas de ejemplo del aula (UD4)', 'Fuente: UD4/Unidad_4/', '']
    for f in sorted(ej.glob('ejm*.pl')):
        out += [f'## {f.name}', '```prolog', f.read_text(encoding='utf8', errors='replace').strip(), '```', '']
    pq = ej / 'Preguntas_1.txt'
    if pq.exists():
        out += ['## Preguntas_1.txt (consultas de los ejemplos)', '```prolog', pq.read_text(encoding='utf8', errors='replace').strip(), '```', '']
    (DEST / 'Ejercicios Prolog UD4.md').write_text('\n'.join(out), encoding='utf8')


def main() -> None:
    DEST.mkdir(exist_ok=True)
    for cita, ruta, titulo in PDFS:
        md = pdf_a_md(cita, ruta, titulo)
        (DEST / f'{cita}.md').write_text(md, encoding='utf8')
        print(f'{cita}: {len(md):>7} caracteres')
    codigo_md()
    print('introduccion.lisp y Ejercicios Prolog UD4: OK')


if __name__ == '__main__':
    sys.exit(main())
