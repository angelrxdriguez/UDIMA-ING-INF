"""Hojas de contacto del PDF: python hojas.py [dpi] [por_hoja]"""
import sys
import pymupdf
OUT = r'C:/Users/angel/AppData/Local/Temp/claude/1c3b1bbe02f34989/c2ab6475-3ee7-4b9b-80ad-5695527d74bf/scratchpad/img'
dpi = int(sys.argv[1]) if len(sys.argv) > 1 else 55
n = int(sys.argv[2]) if len(sys.argv) > 2 else 6
d = pymupdf.open(r'C:/Users/angel/Documents/UDIMA/10888 Álgebra/Guia_Algebra_UD1-UD4.pdf')
cols = 3
w, h = 595 * dpi / 72, 842 * dpi / 72
for s in range(0, len(d), n):
    rows = (min(n, len(d) - s) + cols - 1) // cols
    sheet = pymupdf.open()
    pg = sheet.new_page(width=cols * 595 + (cols - 1) * 10, height=rows * 842 + (rows - 1) * 10)
    for k in range(min(n, len(d) - s)):
        r, c = divmod(k, cols)
        rect = pymupdf.Rect(c * 605, r * 852, c * 605 + 595, r * 852 + 842)
        pg.show_pdf_page(rect, d, s + k)
        pg.draw_rect(rect, color=(.6, .6, .6), width=1)
    pg.get_pixmap(dpi=dpi).save(f'{OUT}/hoja{s // n + 1:02d}.png')
print('ok')
