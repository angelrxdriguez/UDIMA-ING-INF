"""Descarga los subtítulos automáticos de una clase grabada (Zoom -> Vimeo) del aula de UDIMA.

Uso:
    python clase_vimeo.py "<enlace del aula o de Vimeo>" "<carpeta destino>" "Clase UD2" "<título>"

Genera en la carpeta destino:
    <prefijo> - subtitulos.vtt     (los subtítulos tal cual)
    <prefijo> - transcripcion.txt  (párrafos de ~45 s con marca de tiempo [hh:mm:ss])

El vídeo de Vimeo solo se deja ver incrustado en aula.udima.es, así que la
configuración del reproductor se pide indicando ese origen (cabecera Referer).
"""
import json
import re
import sys
import urllib.parse
import urllib.request

REFERER = 'https://aula.udima.es/'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'


def get(url):
    req = urllib.request.Request(url, headers={'Referer': REFERER, 'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode('utf-8')


def vimeo_id(link):
    link = urllib.parse.unquote(link)
    m = re.search(r'player\.vimeo\.com/video/(\d+)', link) or re.search(r'vimeo\.com/(\d+)', link) or re.fullmatch(r'\s*(\d+)\s*', link)
    if not m:
        sys.exit('No encuentro el número de vídeo de Vimeo en el enlace.')
    return m.group(1)


def secs(t):
    h, m, s = map(int, t.split(':'))
    return h * 3600 + m * 60 + s


def vtt_to_paragraphs(vtt):
    cues = re.findall(r'(\d\d:\d\d:\d\d)\.\d+ --> [^\n]+\n(.*?)(?:\n\n|\Z)', vtt, re.S)
    paras, cur, start = [], [], None
    for t, body in cues:
        line = ' '.join(body.split())
        if not line:
            continue
        if start is None:
            start = t
        cur.append(line)
        if secs(t) - secs(start) >= 45 and re.search(r'[.?!]$', line):
            paras.append((start, ' '.join(cur)))
            cur, start = [], None
    if cur:
        paras.append((start, ' '.join(cur)))
    return paras


def main():
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    link, folder, prefix, title = sys.argv[1:]
    sys.stdout.reconfigure(encoding='utf-8')
    vid = vimeo_id(link)
    cfg = json.loads(get(f'https://player.vimeo.com/video/{vid}/config'))
    video = cfg['video']
    tracks = cfg['request'].get('text_tracks') or []
    print(f"Vídeo {vid}: {video['title']} ({video['duration'] // 60} min)")
    for t in tracks:
        print(f"  pista {t['lang']}: {t['label']}")
    if not tracks:
        sys.exit('El vídeo no tiene subtítulos: habría que transcribir el audio.')
    track = next((t for t in tracks if t['lang'] == 'es'), None) or next((t for t in tracks if t['lang'].startswith('es')), tracks[0])
    vtt = get(urllib.parse.urljoin('https://player.vimeo.com/', track['url']))

    with open(f'{folder}/{prefix} - subtitulos.vtt', 'w', encoding='utf-8', newline='\n') as f:
        f.write(vtt)
    paras = vtt_to_paragraphs(vtt)
    source = 'subtítulos automáticos de Vimeo' if 'autogen' in track['lang'] else 'subtítulos de Vimeo'
    with open(f'{folder}/{prefix} - transcripcion.txt', 'w', encoding='utf-8', newline='\n') as f:
        f.write(f"{title} (grabación Vimeo {vid}, {video['title']})\n")
        f.write(f"Fuente: {source} ({track['lang']}). Puede haber errores en términos técnicos.\n\n")
        for t, p in paras:
            f.write(f'[{t}] {p}\n\n')
    print(f'{len(paras)} párrafos guardados en "{folder}"')


if __name__ == '__main__':
    main()
