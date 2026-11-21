"""Renderiza páginas del PDF de la guía a PNG para revisarlas.  python ver.py 3 4 5  (o  python ver.py all)"""
import sys
import pymupdf
OUT = r'C:/Users/angel/AppData/Local/Temp/claude/1c3b1bbe02f34989/c2ab6475-3ee7-4b9b-80ad-5695527d74bf/scratchpad/img'
d = pymupdf.open(r'C:/Users/angel/Documents/UDIMA/10888 Álgebra/Guia_Algebra_UD1-UD4.pdf')
pages = range(1, len(d) + 1) if sys.argv[1:] == ['all'] else [int(x) for x in sys.argv[1:]]
dpi = 75
for p in pages:
    d[p - 1].get_pixmap(dpi=dpi).save(f'{OUT}/p{p:03d}.png')
print(len(d), 'páginas')
