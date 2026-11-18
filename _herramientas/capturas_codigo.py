"""Capturas de código Python con colores, para memorias de prácticas.

    python _herramientas/capturas_codigo.py <capturas.json>

El JSON dice qué trozos de qué archivos capturar. Las rutas son relativas a la raíz
del repositorio (la carpeta que contiene _herramientas):

    {
      "codigo":  "10901 Paradigmas de la Programación/ACTIVIDADES_REPASO",
      "salida":  "10901 Paradigmas de la Programación/ACTIVIDADES_REPASO/Capturas",
      "prompt":  "PS C:\\…\\ACTIVIDADES_REPASO>",
      "capturas": [
        {"png": "01 - a.png", "archivo": "ejercicio1.py", "titulo": "Ejercicio 1 · a)",
         "bloques": ["concatenarCadenas"]},
        {"png": "05 - pruebas.png", "archivo": "ejercicio1.py", "titulo": "Pruebas",
         "bloques": ["@pruebas"], "ejecutar": true}
      ]
    }

Cada bloque es el nombre de una función o de una variable de primer nivel del archivo,
o "@pruebas" (todo lo que va después de la última función). Se copian las líneas tal
cual, con su número real. Los comentarios pegados justo debajo de una función van con
ella. Con "ejecutar", debajo del código sale una terminal con la salida real de
`python <archivo>`. El PNG lo hace html2png.mjs con Chrome sin ventana.
"""
import ast
import builtins
import html
import io
import json
import keyword
import os
import subprocess
import sys
import tempfile
import tokenize
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent
BUILTINS = set(dir(builtins))
PUNTUACION = set("()[]{},:.;")

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #ffffff; }
#captura {
  display: inline-block; padding: 34px;
  background: linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 55%, #f5d0fe 100%);
}
.ventana {
  background: #282a36; border-radius: 12px; overflow: hidden;
  box-shadow: 0 18px 40px rgba(30, 27, 75, .35), 0 0 0 1px rgba(0, 0, 0, .25);
}
.ventana + .ventana { margin-top: 20px; }
.barra {
  display: flex; align-items: center; gap: 14px; padding: 11px 16px;
  background: #21222c; border-bottom: 1px solid #191a21;
  font: 600 13px "Segoe UI", system-ui, sans-serif; color: #b6b9cf;
}
.puntos { display: flex; gap: 7px; }
.puntos i { width: 12px; height: 12px; border-radius: 50%; display: block; }
.puntos i:nth-child(1) { background: #ff5f56; }
.puntos i:nth-child(2) { background: #ffbd2e; }
.puntos i:nth-child(3) { background: #27c93f; }
.archivo { letter-spacing: .2px; }
.etiqueta {
  margin-left: auto; padding: 3px 11px; border-radius: 999px;
  background: #bd93f9; color: #1e1f29; font-weight: 700; font-size: 12.5px;
}
.terminal .etiqueta { background: #50fa7b; }
pre {
  padding: 16px 22px 18px 0; color: #f8f8f2;
  font: 15px/1.62 "Cascadia Mono", Consolas, monospace;
  font-variant-ligatures: none; white-space: pre;
}
.l { display: block; }
.n {
  display: inline-block; width: 3.4em; padding-right: 1.1em; margin-right: 1.2em;
  text-align: right; color: #5f6488; border-right: 1px solid #383a4a; user-select: none;
}
.plegado { color: #7d82a8; font-weight: 700; }
.terminal { background: #1b1c24; }
.terminal pre { padding: 14px 22px 16px; }
.ps { color: #8be9fd; }
.cmd { color: #f8f8f2; font-weight: 700; }
.err { color: #ff6e6e; }
/* colores del código (paleta Dracula) */
.kw  { color: #ff79c6; }
.op  { color: #ff79c6; }
.pu  { color: #d6d7e0; }
.st  { color: #f1fa8c; }
.nu, .co { color: #bd93f9; }
.de  { color: #50fa7b; font-weight: 700; }
.fn  { color: #50fa7b; }
.bi  { color: #8be9fd; font-style: italic; }
.pa  { color: #ffb86c; font-style: italic; }
.cm  { color: #8a94c4; font-style: italic; }
"""


def colorear(fuente):
    """Devuelve {fila: [(col_ini, col_fin, clase)]} con la clase de cada token."""
    tokens = list(tokenize.generate_tokens(io.StringIO(fuente).readline))
    ignorar = {tokenize.NL, tokenize.NEWLINE, tokenize.INDENT, tokenize.DEDENT, tokenize.ENDMARKER}
    sig = [t for t in tokens if t.type not in ignorar and t.type != tokenize.COMMENT]
    clases = {}
    en_def = en_lambda = False
    prof = 0
    for i, t in enumerate(sig):
        ant = sig[i - 1] if i else None
        sig_t = sig[i + 1] if i + 1 < len(sig) else None
        clase = None
        if t.type == tokenize.NAME:
            if keyword.iskeyword(t.string):
                clase = 'co' if t.string in ('True', 'False', 'None') else 'kw'
                if t.string == 'lambda':
                    en_lambda = True
            elif ant is not None and ant.string == 'def':
                clase = 'de'
            elif en_def and prof == 1 and ant is not None and ant.string in ('(', ','):
                clase = 'pa'
            elif en_lambda:
                clase = 'pa'
            elif t.string in BUILTINS and (ant is None or ant.string != '.'):
                clase = 'bi'
            elif sig_t is not None and sig_t.string == '(':
                clase = 'fn'
        elif t.type == tokenize.OP:
            if t.string == '(' and i >= 2 and sig[i - 2].string == 'def':
                en_def, prof = True, 0
            if en_def:
                if t.string in ('(', '[', '{'):
                    prof += 1
                elif t.string in (')', ']', '}'):
                    prof -= 1
                    if prof == 0:
                        en_def = False
            if en_lambda and t.string == ':':
                en_lambda = False
            clase = 'pu' if t.string in PUNTUACION else 'op'
        elif t.type == tokenize.NUMBER:
            clase = 'nu'
        elif t.type == tokenize.STRING or tokenize.tok_name.get(t.type, '').startswith('FSTRING'):
            clase = 'st'
        if clase and t.start[0] == t.end[0]:
            clases.setdefault(t.start[0], []).append((t.start[1], t.end[1], clase))
    for t in tokens:
        if t.type == tokenize.COMMENT:
            clases.setdefault(t.start[0], []).append((t.start[1], t.end[1], 'cm'))
    return clases


def linea_html(texto, trozos):
    res, col = [], 0
    for ini, fin, clase in sorted(trozos):
        if ini < col:
            continue
        res.append(html.escape(texto[col:ini]))
        res.append(f'<span class="{clase}">{html.escape(texto[ini:fin])}</span>')
        col = fin
    res.append(html.escape(texto[col:]))
    return ''.join(res)


def rangos(fuente, lineas, bloques):
    arbol = ast.parse(fuente)
    nodos = arbol.body
    funciones = [n for n in nodos if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
    res = []
    for b in bloques:
        if b == '@pruebas':
            ultima = max(f.end_lineno for f in funciones)
            resto = [n for n in nodos if n.lineno > ultima]
            res.append((resto[0].lineno, resto[-1].end_lineno))
            continue
        nodo = next((n for n in nodos if
                     (isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name == b) or
                     (isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == b for t in n.targets))), None)
        if nodo is None:
            sys.exit(f'No encuentro «{b}» en el archivo')
        fin = nodo.end_lineno
        # comentarios propios pegados debajo (no los separadores del enunciado)
        while fin < len(lineas):
            s = lineas[fin].strip()
            if s.startswith('#') and not s.startswith(('# -', '# =')):
                fin += 1
            else:
                break
        res.append((nodo.lineno, fin))
    # unir bloques separados solo por líneas en blanco
    unidos = []
    for ini, fin in sorted(res):
        if unidos and all(not lineas[k - 1].strip() for k in range(unidos[-1][1] + 1, ini)):
            unidos[-1] = (unidos[-1][0], max(fin, unidos[-1][1]))
        else:
            unidos.append((ini, fin))
    return unidos


def ventana(archivo, titulo, cuerpo, terminal=False):
    clase = 'ventana terminal' if terminal else 'ventana'
    return (f'<div class="{clase}"><div class="barra"><span class="puntos"><i></i><i></i><i></i></span>'
            f'<span class="archivo">{html.escape(archivo)}</span>'
            f'<span class="etiqueta">{html.escape(titulo)}</span></div><pre>{cuerpo}</pre></div>')


def captura_html(dir_codigo, cap, prompt):
    ruta = dir_codigo / cap['archivo']
    fuente = ruta.read_text(encoding='utf-8')
    lineas = fuente.splitlines()
    clases = colorear(fuente)
    filas = []
    for k, (ini, fin) in enumerate(rangos(fuente, lineas, cap['bloques'])):
        if k:
            filas.append(f'<span class="l plegado"><span class="n">⋮</span></span>')
        while fin > ini and not lineas[fin - 1].strip():
            fin -= 1
        for n in range(ini, fin + 1):
            filas.append(f'<span class="l"><span class="n">{n}</span>{linea_html(lineas[n - 1], clases.get(n, []))}</span>')
    partes = [ventana(cap['archivo'], cap['titulo'], ''.join(filas))]
    if cap.get('ejecutar'):
        env = {**os.environ, 'PYTHONIOENCODING': 'utf-8'}
        r = subprocess.run([sys.executable, cap['archivo']], cwd=dir_codigo, capture_output=True,
                           text=True, encoding='utf-8', env=env)
        salida = (r.stdout + r.stderr).rstrip('\n').splitlines()
        cuerpo = [f'<span class="l"><span class="ps">{html.escape(prompt)}</span> '
                  f'<span class="cmd">python {html.escape(cap["archivo"])}</span></span>']
        en_error = False
        for s in salida:
            en_error = en_error or s.startswith('Traceback')
            cuerpo.append(f'<span class="l{" err" if en_error else ""}">{html.escape(s) or " "}</span>')
        partes.append(ventana('Terminal · PowerShell', 'Salida', ''.join(cuerpo), terminal=True))
        if r.returncode:
            print(f'  ¡Ojo! {cap["archivo"]} termina con error (código {r.returncode})')
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head>'
            f'<body><div id="captura">{"".join(partes)}</div></body></html>')


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    spec = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    dir_codigo = RAIZ / spec['codigo']
    dir_salida = RAIZ / spec['salida']
    dir_salida.mkdir(parents=True, exist_ok=True)
    solo = sys.argv[2:]  # opcional: solo las capturas cuyo PNG empiece así ("06", "07"...)
    pares = []
    with tempfile.TemporaryDirectory() as tmp:
        for i, cap in enumerate(spec['capturas']):
            if solo and not cap['png'].startswith(tuple(solo)):
                continue
            h = Path(tmp) / f'c{i}.html'
            h.write_text(captura_html(dir_codigo, cap, spec.get('prompt', 'PS>')), encoding='utf-8')
            pares += [str(h), str(dir_salida / cap['png'])]
        subprocess.run(['node', str(AQUI / 'html2png.mjs'), *pares], check=True)


if __name__ == '__main__':
    main()
