"""Guía de Álgebra UD1–UD4: une las partes, calcula las cadenas de matrices y genera el PDF.

    python build.py            -> 10888 Álgebra/Guia_Algebra_UD1-UD4.pdf

Antes de tocar un resultado, añádelo a verifica.py (python verifica.py comprueba con fracciones exactas todos los
de la guía). ver.py y hojas.py sacan PNG de las páginas para revisarlas.

Macro de cadena (las matrices intermedias se calculan con fracciones exactas, no se copian a mano):

    {{chain rrr|r : 1 2 1 1 ; 3 5 1 0 ; 2 2 3 6 :: F2-3F1, F3-2F1 :: -F2 :: F1-2F2, F3+2F2 ! piv}}

  - antes de « : » el formato de columnas de \\M; después, las filas separadas por « ; »
  - cada « :: » es una flecha; dentro, operaciones separadas por comas que se aplican en orden:
      F2-3F1   F3+1/2F1   F1<->F2   -F2   1/5F2   -1/4F3
  - « ! piv » resalta los pivotes de la última matriz; « ! wrap » deja que la cadena salte de línea
    (por defecto cada matriz va en un bloque y el navegador las reparte en líneas).
"""
import re
import subprocess
import sys
from fractions import Fraction as Fr
from pathlib import Path

import pymupdf

HERE = Path(__file__).resolve().parent
TOOLS = HERE.parent.parent
OUT = TOOLS.parent / '10888 Álgebra' / 'Guia_Algebra_UD1-UD4.pdf'
PARTS = ['00-inicio.html', 'ud1.html', 'ud2.html', 'ud3.html', 'ud4.html', '99-final.html']
HEADER = 'Álgebra · Guía para dominar las unidades 1 a 4'


def num(s):
    s = s.strip()
    return Fr(s)


def tex(x):
    if x.denominator == 1:
        return str(x.numerator)
    sign = '-' if x < 0 else ''
    return f'{sign}\\tfrac{{{abs(x.numerator)}}}{{{x.denominator}}}'


def coef_tex(c):
    """Coeficiente delante de F_j en una etiqueta: 1 -> '', 1/2 -> \\tfrac12."""
    if c == 1:
        return ''
    if c.denominator == 1:
        return str(c.numerator)
    return f'\\tfrac{{{c.numerator}}}{{{c.denominator}}}'


OP_ADD = re.compile(r'^F(\d)([+-])(\d+(?:/\d+)?)?F(\d)$')
OP_SWAP = re.compile(r'^F(\d)<->F(\d)$')
OP_SCALE = re.compile(r'^(-?\d*(?:/\d+)?|-)F(\d)$')


def apply(M, op):
    op = op.replace(' ', '')
    if m := OP_ADD.match(op):
        i, sg, c, j = int(m[1]) - 1, m[2], Fr(m[3] or 1), int(m[4]) - 1
        k = c if sg == '+' else -c
        M[i] = [a + k * b for a, b in zip(M[i], M[j])]
        return f'F_{i+1}{sg}{coef_tex(c)}F_{j+1}'
    if m := OP_SWAP.match(op):
        i, j = int(m[1]) - 1, int(m[2]) - 1
        M[i], M[j] = M[j], M[i]
        return f'F_{i+1}\\leftrightarrow F_{j+1}'
    if m := OP_SCALE.match(op):
        c = m[1]
        c = Fr(-1) if c == '-' else Fr(c)
        i = int(m[2]) - 1
        assert c != 0, op
        M[i] = [c * a for a in M[i]]
        if c == -1:
            return f'-F_{i+1}'
        sign = '-' if c < 0 else ''
        return f'{sign}{coef_tex(abs(c))}F_{i+1}'
    raise ValueError(f'Operación no reconocida: {op}')


def mtex(fmt, M, piv=False):
    rows = []
    for r in M:
        cells = [tex(x) for x in r]
        if piv:
            for k, x in enumerate(r):
                if x != 0:
                    cells[k] = f'\\piv{{{cells[k]}}}'
                    break
        rows.append('&'.join(cells))
    return f'\\M{{{fmt}}}{{' + '\\\\'.join(rows) + '}'


def chain(body):
    flags = []
    if '!' in body:
        body, fl = body.split('!', 1)
        flags = fl.split()
    head, *steps = body.split('::')
    fmt, data = head.split(':', 1)
    M = [[num(x) for x in row.split()] for row in data.split(';')]
    n = len(M[0])
    assert all(len(r) == n for r in M), body
    parts = [f'<span>${mtex(fmt.strip(), M)}$</span>']
    for k, step in enumerate(steps):
        labels = [apply(M, op) for op in step.split(',') if op.strip()]
        last = k == len(steps) - 1
        lab = labels[0] if len(labels) == 1 else '\\substack{' + '\\\\'.join(labels) + '}'
        parts.append(f'<span>$\\xrightarrow{{{lab}}}{mtex(fmt.strip(), M, piv=last and "piv" in flags)}$</span>')
    return '<div class="cadena">' + ''.join(parts) + '</div>'


MATH = re.compile(r'\$\$[\s\S]+?\$\$|\$[^$]+?\$')


def ok_fuera_de_formulas(html):
    """\\ok solo existe dentro de $...$: fuera de las fórmulas se mete en una fórmula."""
    out, last = [], 0
    for m in MATH.finditer(html):
        out.append(html[last:m.start()].replace('\\ok', '$\\ok$'))
        out.append(m[0])
        last = m.end()
    out.append(html[last:].replace('\\ok', '$\\ok$'))
    return ''.join(out)


def expand(html):
    html = re.sub(r'\{\{chain (.+?)\}\}', lambda m: chain(m[1]), html, flags=re.S)
    # La etiqueta de una solución no se separa de la cadena que la sigue.
    html = re.sub(r'(<p class="sol[^"]*"><span class="id">[^<]*</span></p>)\s*(<div class="cadena">.*?</div>)',
                  r'<div class="junto">\1\2</div>', html, flags=re.S)
    # Cabecera de lección (etiqueta + título + «Al terminar sabrás») en un bloque que no se queda solo al pie.
    html = re.sub(r'(<div class="etq">Lección[^<]*</div>\s*<h1>.*?</h1>\s*<p class="sabras">.*?</p>)',
                  r'<div class="cab">\1</div>', html, flags=re.S)
    # Puntos guía del índice.
    html = html.replace('</span><span class="pg" data-l=', '</span><span class="dots"></span><span class="pg" data-l=')
    return ok_fuera_de_formulas(html)


def pages_of_labels(pdf, labels):
    """Página (1..n) en la que aparece por primera vez cada etiqueta «LECCIÓN x.y» (tras el índice)."""
    doc = pymupdf.open(pdf)
    found = {}
    for i, page in enumerate(doc):
        text = page.get_text()
        for lab in labels:
            if lab in found:
                continue
            if re.search(r'(^|\n)' + re.escape(lab) + r'\s*\n', text):
                found[lab] = i + 1
    return found


def render(html_text, pdf):
    tmp = HERE / 'guia.html'
    tmp.write_text(html_text, encoding='utf-8')
    subprocess.run(['node', str(TOOLS / 'html2pdf.mjs'), str(tmp), str(pdf)], check=True)


def main():
    head = (HERE / 'cabeza.html').read_text(encoding='utf-8')
    body = ''.join((HERE / p).read_text(encoding='utf-8') for p in PARTS if (HERE / p).exists())
    html = expand(head + body + '\n</body>\n</html>\n')

    # Índice: cada entrada lleva <span class="pg" data-l="LECCIÓN 1.3"></span>; primera pasada para saber las páginas.
    refs = list(dict.fromkeys(re.findall(r'data-l="([^"]+)"', html) + re.findall(r'<!--toc level=\d label="([^"]+)"', html)))
    raw = HERE / 'guia-sin-cabecera.pdf'
    pages = {}
    for _ in range(2):
        filled = re.sub(r'<span class="pg" data-l="([^"]+)">[^<]*</span>',
                        lambda m: f'<span class="pg" data-l="{m[1]}">{pages.get(m[1], "00")}</span>', html)
        render(filled, raw)
        new = pages_of_labels(raw, refs)
        missing = [r for r in refs if r not in new]
        if missing:
            print('AVISO: etiquetas sin página:', missing)
        if new == pages:
            break
        pages = new

    # Cabecera, número de página y marcadores.
    subprocess.run([sys.executable, str(TOOLS / 'cabecera.py'), str(raw), str(OUT), HEADER], check=True)
    doc = pymupdf.open(OUT)
    toc = []
    for m in re.finditer(r'<!--toc level=(\d) label="([^"]+)" title="([^"]+)"-->', html):
        level, lab, title = int(m[1]), m[2], m[3]
        if lab in pages:
            toc.append([level, title, pages[lab]])
    if toc:
        doc.set_toc(toc)
    tmp = OUT.with_suffix('.tmp.pdf')
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    tmp.replace(OUT)
    doc = pymupdf.open(OUT)
    print(f'{OUT}: {len(doc)} páginas')
    raw.unlink(missing_ok=True)
    (HERE / 'guia.html').unlink(missing_ok=True)


if __name__ == '__main__':
    main()
