"""Mete las páginas de notas de clase en el tutorial del Tema 2.

    node ../../html2pdf.mjs notas-clase-tutorial.html notas.pdf
    python insertar_notas.py notas.pdf "<ruta del tutorial de salida>"

Parte siempre de Tutorial_Tema2_base.pdf (el tutorial sin notas), así que se puede
volver a ejecutar cuantas veces haga falta. Cada página de notas lleva un número con
letra (2a = va detrás de la página 2) para que el índice y las referencias del
tutorial original sigan valiendo.
"""
import sys
from pathlib import Path

import pymupdf

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent.parent))
from cabecera import ARIAL, ARIAL_BOLD, LEFT, RIGHT, header  # noqa: E402

BASE = HERE / 'Tutorial_Tema2_base.pdf'
SERIF = HERE.parent.parent / 'node_modules' / 'computer-modern' / 'fonts' / 'cmu-serif-500-roman.ttf'

HEADER = 'Álgebra · Tema 2 · Sistemas y método de Gauss'
AZUL, VERDE = (0x1f / 255, 0x4e / 255, 0x79 / 255), (0, 0x79 / 255, 0x6b / 255)

# (etiqueta, va detrás de la página impresa n, título en el índice, páginas impresas que enlazan a ella)
NOTAS = [
    ('2a', 2, 'Lo que dijo el profesor en clase', []),
    ('8a', 8, 'Operar por filas como lo hace el profesor', range(4, 9)),
    ('17a', 17, 'Gauss o Gauss-Jordan: qué se da por bueno', [*range(10, 18), 46]),
    ('28a', 28, 'Rango, Rouché-Frobenius y soluciones con parámetros', range(19, 29)),
    ('37a', 37, 'Independencia lineal y sistemas con parámetro', [30, 31, *range(33, 38)]),
]

TOC_AFTER = ['Cómo estudiar con este tutorial', 'Las operaciones por filas', 'Gauss-Jordan: la forma escalonada reducida',
             'Sistemas homogéneos', 'Discutir un sistema con parámetro']


def tag(page, label, target):
    """Etiqueta verde en la cabecera que lleva a la página de notas."""
    page.insert_font('arialbd', fontfile=ARIAL_BOLD)
    text = f'En clase → p. {label}'
    w = pymupdf.Font(fontfile=ARIAL_BOLD).text_length(text, fontsize=7.5)
    x1 = 500
    r = pymupdf.Rect(x1 - w - 10, 21.0, x1, 32.5)
    page.draw_rect(r, color=None, fill=VERDE, radius=0.25)
    page.insert_text((r.x0 + 5, 29.4), text, fontname='arialbd', fontsize=7.5, color=(1, 1, 1))
    page.insert_link({'kind': pymupdf.LINK_GOTO, 'from': r, 'page': target, 'to': pymupdf.Point(0, 0)})


def index_entries(page, targets):
    """Sección nueva al final del índice, con el mismo formato que las demás."""
    page.insert_font('arialbd', fontfile=ARIAL_BOLD)
    page.insert_font('cmu', fontfile=str(SERIF))
    serif = pymupdf.Font(fontfile=str(SERIF))
    y = 454.72 + 21.0
    page.insert_text((LEFT, y), 'Notas de la clase del 5 de octubre', fontname='arialbd', fontsize=10, color=AZUL)
    for (label, _, title, _), target in zip(NOTAS, targets):
        y += 11.955
        page.insert_text((76.0, y), title, fontname='cmu', fontsize=10, color=(0, 0, 0))
        wl = serif.text_length(label, fontsize=10)
        page.insert_text((RIGHT - wl, y), label, fontname='cmu', fontsize=10, color=(0, 0, 0))
        x = 76.0 + serif.text_length(title, fontsize=10) + 6
        dot = 504.59  # puntos cada 7,75 pt sobre la misma rejilla que los del índice original
        while dot - 7.75 > x:
            dot -= 7.75
        while dot <= min(505, RIGHT - wl - 8):
            page.insert_text((dot, y), '.', fontname='cmu', fontsize=10, color=(0, 0, 0))
            dot += 7.75
        r = pymupdf.Rect(76.0, y - 9, 237.6, y + 3)
        page.insert_link({'kind': pymupdf.LINK_GOTO, 'from': r, 'page': target, 'to': pymupdf.Point(0, 0)})


def main(notes_pdf, out_pdf):
    doc = pymupdf.open(BASE)
    notes = pymupdf.open(notes_pdf)
    assert len(notes) == len(NOTAS), f'{notes_pdf} tiene {len(notes)} páginas y hacen falta {len(NOTAS)}'
    for (label, *_), page in zip(NOTAS, notes):
        header(page, HEADER, label)

    # La página impresa n es la n (base 0) del PDF, porque la portada no lleva número.
    for i in reversed(range(len(NOTAS))):
        doc.insert_pdf(notes, from_page=i, to_page=i, start_at=NOTAS[i][1] + 1, links=False, annots=False)
    pos = {label: after + 1 + i for i, (label, after, _, _) in enumerate(NOTAS)}

    def pdf_index(printed):
        return printed + sum(1 for _, after, _, _ in NOTAS if after < printed)

    for label, _, _, pages in NOTAS:
        for printed in pages:
            tag(doc[pdf_index(printed)], label, pos[label])
    index_entries(doc[2], [pos[label] for label, *_ in NOTAS])

    # Marcadores: los del tutorial (ya desplazados) más uno por página de notas, detrás
    # del marcador de la lección a la que acompaña y con su mismo nivel.
    toc = doc.get_toc(simple=True)
    for (label, _, title, _), prev in zip(NOTAS, TOC_AFTER):
        at = next(k for k, e in enumerate(toc) if e[1] == prev)
        toc.insert(at + 1, [toc[at][0], f'Notas de clase {label} · {title}', pos[label] + 1])
    doc.set_toc(toc)

    labels = [{'startpage': 0, 'prefix': 'Portada', 'style': '', 'firstpagenum': 1}]
    printed = 1
    start = 1
    for label, after, _, _ in NOTAS:
        labels.append({'startpage': start, 'prefix': '', 'style': 'D', 'firstpagenum': printed})
        labels.append({'startpage': pos[label], 'prefix': label, 'style': '', 'firstpagenum': 1})
        start, printed = pos[label] + 1, after + 1
    labels.append({'startpage': start, 'prefix': '', 'style': 'D', 'firstpagenum': printed})
    doc.set_page_labels(labels)

    meta = doc.metadata
    meta['subject'] = 'Tutorial del Tema 2 con las notas de la clase del 05/10/2026'
    doc.set_metadata(meta)
    doc.subset_fonts()
    doc.save(out_pdf, garbage=4, deflate=True)
    print(f'{out_pdf}: {len(doc)} páginas')


if __name__ == '__main__':
    main(*sys.argv[1:])
