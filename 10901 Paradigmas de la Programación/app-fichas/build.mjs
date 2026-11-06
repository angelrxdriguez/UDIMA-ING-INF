// Genera dist/fichas.html: mete las fichas de ../tarjetas/ud*.json y unidades.json en fichas.src.html.
// Uso: node build.mjs [carpeta-de-tarjetas]   (por defecto ../tarjetas)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = process.argv[2] || join(here, '..', 'tarjetas');
const errors = [], warns = [];

const unidades = JSON.parse(readFileSync(join(dir, 'unidades.json'), 'utf8'));
const cards = [];
for (const u of unidades) {
  const f = join(dir, `ud${u.ud}.json`);
  if (!existsSync(f)) { errors.push(`falta ${f}`); continue; }
  const arr = JSON.parse(readFileSync(f, 'utf8'));
  if (!Array.isArray(arr)) { errors.push(`${f} no es un array`); continue; }
  for (const c of arr) cards.push(c);
}

const ids = new Set();
const KEYS = ['id', 'ud', 'tema', 'serie', 'n', 'total', 'q', 'a', 'code', 'src', 'imp'];
for (const [i, c] of cards.entries()) {
  const at = c && c.id ? c.id : `#${i}`;
  for (const k of ['id', 'tema', 'q', 'a']) if (typeof c[k] !== 'string' || !c[k].trim()) errors.push(`${at}: falta ${k}`);
  if (ids.has(c.id)) errors.push(`${at}: id repetido`); ids.add(c.id);
  if (!unidades.some(u => u.ud === c.ud)) errors.push(`${at}: ud ${c.ud} desconocida`);
  if (c.imp !== 1 && c.imp !== 2) errors.push(`${at}: imp debe ser 1 o 2`);
  if (c.code != null && typeof c.code !== 'string') errors.push(`${at}: code no es texto`);
  for (const k of Object.keys(c)) if (!KEYS.includes(k)) warns.push(`${at}: campo extra ${k}`);
  if (c.q.length > 120) warns.push(`${at}: pregunta larga (${c.q.length})`);
  if (c.a.length > 320) warns.push(`${at}: respuesta larga (${c.a.length})`);
  if (c.serie == null) { c.serie = null; c.n = null; c.total = null; }
}
// Las series deben ir seguidas y numeradas 1..total.
for (let i = 0; i < cards.length;) {
  const c = cards[i];
  if (!c.serie) { i++; continue; }
  let j = i; while (j < cards.length && cards[j].serie === c.serie && cards[j].ud === c.ud) j++;
  const g = cards.slice(i, j);
  g.forEach((x, k) => { if (x.n !== k + 1 || x.total !== g.length) errors.push(`${x.id}: serie «${c.serie}» mal numerada (${x.n}/${x.total}, esperado ${k + 1}/${g.length})`); });
  i = j;
}
const seriesSeen = new Map();
cards.forEach((c, i) => { if (!c.serie) return; const k = c.ud + '|' + c.serie; if (seriesSeen.has(k) && seriesSeen.get(k) !== i - 1) errors.push(`${c.id}: la serie «${c.serie}» está partida`); seriesSeen.set(k, i); });

for (const w of warns) console.warn('aviso:', w);
if (errors.length) { for (const e of errors) console.error('ERROR:', e); process.exit(1); }

const slim = cards.map(c => {
  const o = { id: c.id, ud: c.ud, tema: c.tema, q: c.q, a: c.a, src: c.src || '', imp: c.imp };
  if (c.serie) Object.assign(o, { serie: c.serie, n: c.n, total: c.total });
  if (c.code) o.code = c.code;
  return o;
});
const LS2 = String.fromCharCode(0x2028), PS2 = String.fromCharCode(0x2029);
const BS = String.fromCharCode(92);
const js = x => JSON.stringify(x).split('<').join(BS + 'u003c').split(LS2).join(BS + 'u2028').split(PS2).join(BS + 'u2029');
let html = readFileSync(join(here, 'fichas.src.html'), 'utf8').replace(/\r\n/g, '\n');
if (!html.includes('/*@CARDS@*/[]') || !html.includes('/*@UDS@*/[]')) { console.error('ERROR: faltan los marcadores en fichas.src.html'); process.exit(1); }
html = html.replace('/*@CARDS@*/[]', () => js(slim)).replace('/*@UDS@*/[]', () => js(unidades));
mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist', 'fichas.html'), html);
const by = unidades.map(u => `UD${u.ud}: ${slim.filter(c => c.ud === u.ud).length} (${slim.filter(c => c.ud === u.ud && c.imp === 1).length}★)`).join(' · ');
console.log(`OK ${slim.length} fichas · ${by} · ${(html.length / 1024).toFixed(0)} KB`);
