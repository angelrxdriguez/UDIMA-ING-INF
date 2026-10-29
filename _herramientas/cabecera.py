"""Cabecera de página como la de los tutoriales: título a la izquierda, número a la derecha
y un filete gris debajo. La portada (primera página) se deja sin cabecera.

    python cabecera.py entrada.pdf salida.pdf "Álgebra · Tema 2 · Resumen de la clase"
"""
import sys

import pymupdf

ARIAL, ARIAL_BOLD = 'C:/Windows/Fonts/arial.ttf', 'C:/Windows/Fonts/arialbd.ttf'
GRIS = (0x5f / 255, 0x6b / 255, 0x73 / 255)
FILETE = (0xbf / 255, 0xc4 / 255, 0xc7 / 255)
LEFT, RIGHT = 68.03, 527.2


def header(page, text, label):
    page.insert_font('arial', fontfile=ARIAL)
    page.insert_text((LEFT, 29.58), text, fontname='arial', fontsize=10, color=GRIS)
    w = pymupdf.Font(fontfile=ARIAL).text_length(label, fontsize=10)
    page.insert_text((RIGHT - w, 29.58), label, fontname='arial', fontsize=10, color=GRIS)
    page.draw_line((LEFT, 42.92), (RIGHT, 42.92), color=FILETE, width=0.4)


def main(src, dst, text):
    doc = pymupdf.open(src)
    for i, page in enumerate(doc):
        if i:
            header(page, text, str(i + 1))
    doc.subset_fonts()
    doc.save(dst, garbage=4, deflate=True)
    print(f'{dst}: {len(doc)} páginas')


if __name__ == '__main__':
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])
