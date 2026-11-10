// Genera dist/fichas.html: mete las fichas de ../tarjetas/ud*.json, unidades.json y las preguntas tipo test de
// ../preguntas/ud*.json en fichas.src.html. Valida ids, series y preguntas.
// Uso: node build.mjs [carpeta-de-tarjetas] [carpeta-de-preguntas]   (por defecto ../tarjetas y ../preguntas)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = process.argv[2] || join(here, '..', 'tarjetas');
const qdir = process.argv[3] || join(here, '..', 'preguntas');
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

// ---------- preguntas tipo test ----------
const qs = [], qids = new Set();
const QKEYS = ['id', 'ud', 'tema', 'tipo', 'imp', 'q', 'code', 'ops', 'why', 'src', 'ficha'];
const temasDe = ud => new Set(cards.filter(c => c.ud === ud).map(c => c.tema));
const cardIds = new Set(cards.map(c => c.id));
const plain = s => String(s).replace(/[`*]/g, '').trim();
const PROHIB = /todas las anteriores|ninguna de las anteriores|son correctas|son falsas|ambas son/i;
for (const u of unidades) {
  const f = join(qdir, `ud${u.ud}.json`);
  if (!existsSync(f)) { warns.push(`sin preguntas: falta ${f}`); continue; }
  let arr; try { arr = JSON.parse(readFileSync(f, 'utf8')); } catch (e) { errors.push(`${f}: JSON mal formado (${e.message})`); continue; }
  if (!Array.isArray(arr)) { errors.push(`${f} no es un array`); continue; }
  const temas = temasDe(u.ud);
  for (const [i, q] of arr.entries()) {
    const at = q && q.id ? q.id : `ud${u.ud}#${i}`;
    for (const k of ['id', 'tema', 'q', 'why']) if (typeof q[k] !== 'string' || !q[k].trim()) errors.push(`${at}: falta ${k}`);
    if (qids.has(q.id)) errors.push(`${at}: id repetido`); qids.add(q.id);
    if (q.ud !== u.ud) errors.push(`${at}: ud ${q.ud} en el fichero de la UD${u.ud}`);
    if (!temas.has(q.tema)) errors.push(`${at}: tema «${q.tema}» no existe en las fichas de la UD${u.ud}`);
    if (!['teoria', 'codigo'].includes(q.tipo)) errors.push(`${at}: tipo debe ser teoria o codigo`);
    if (q.imp !== 1 && q.imp !== 2) errors.push(`${at}: imp debe ser 1 o 2`);
    if (q.code != null && typeof q.code !== 'string') errors.push(`${at}: code no es texto`);
    if (!Array.isArray(q.ops) || q.ops.length !== 4 || q.ops.some(o => typeof o !== 'string' || !o.trim())) { errors.push(`${at}: ops debe tener 4 opciones de texto`); continue; }
    if (new Set(q.ops.map(o => plain(o).toLowerCase())).size !== 4) errors.push(`${at}: opciones repetidas`);
    if (q.ops.some(o => PROHIB.test(o))) errors.push(`${at}: opción prohibida («todas/ninguna de las anteriores»…)`);
    if (q.ficha != null && !cardIds.has(q.ficha)) errors.push(`${at}: la ficha ${q.ficha} no existe`);
    for (const k of Object.keys(q)) if (!QKEYS.includes(k)) warns.push(`${at}: campo extra ${k}`);
    if (q.q.length > 260) warns.push(`${at}: enunciado largo (${q.q.length})`);
    if (q.why.length > 340) warns.push(`${at}: explicación larga (${q.why.length})`);
    for (const o of q.ops) if (o.length > 130) warns.push(`${at}: opción larga (${o.length})`);
    if (q.code) for (const l of q.code.split(String.fromCharCode(10))) if (l.length > 48) warns.push(`${at}: línea de código ancha (${l.length})`);
    qs.push(q);
  }
}
// Sesgo de longitud: si la correcta suele ser la más larga, se acierta sin saber.
for (const u of unidades) {
  const l = qs.filter(q => q.ud === u.ud); if (!l.length) continue;
  const longest = l.filter(q => { const len = q.ops.map(o => plain(o).length); return len[0] > Math.max(...len.slice(1)); }).length;
  const r = longest / l.length;
  console.log(`UD${u.ud}: ${l.length} preguntas (${l.filter(q => q.tipo === 'codigo').length} de código, ${l.filter(q => q.imp === 1).length}★) · la correcta es la más larga en ${Math.round(100 * r)} %`);
  if (r > 0.4) warns.push(`UD${u.ud}: la correcta es la opción más larga en el ${Math.round(100 * r)} % (aleatorio = 25 %)`);
}

// ---------- temario para «Pregúntale» (../temario/*.md, una sección «## …» por diapositiva o página) ----------
// Se trocea en pasajes de ~1500 caracteres; la app busca los que tocan y se los pasa a Claude con cada pregunta.
const tdir = join(here, '..', 'temario');
const FUENTES = {
  'S1': ['S1', 1], 'Estado del arte': ['Estado del arte', 1], 'Resumen UD1': ['Resumen UD1', 1],
  'Cap2': ['Cap. 2', 2], 'Guía Lisp': ['Guía Lisp', 2], 'Resumen clase UD2': ['Resumen clase UD2', 2], 'introduccion.lisp': ['introduccion.lisp', 2],
  'S3': ['S3', 3], 'Guía Haskell': ['Guía Haskell', 3],
  'S4': ['S4', 4], 'Unidad 4': ['Unidad 4', 4], 'Ejercicios Prolog UD4': ['Ejercicios Prolog', 4], 'S5': ['S5', 5],
};
function trocea(text, max) {
  if (text.length <= max) return [text];
  const out = []; let cur = [], len = 0, fence = false;
  for (const l of text.split('\n')) {
    if (/^\s*```/.test(l)) fence = !fence;
    cur.push(l); len += l.length + 1;
    if (!fence && len >= max * 0.6 && (!l.trim() || len >= max)) { out.push(cur.join('\n').trim()); cur = []; len = 0; }
  }
  const last = cur.join('\n').trim();
  if (last) { if (out.length && last.length < 300) out[out.length - 1] += '\n' + last; else out.push(last); }
  return out.filter(Boolean);
}
const docs = [];
if (existsSync(tdir)) for (const [file, [cita, ud]] of Object.entries(FUENTES)) {
  const f = join(tdir, file + '.md');
  if (!existsSync(f)) { warns.push(`temario: falta ${file}.md`); continue; }
  const secs = readFileSync(f, 'utf8').replace(/\r\n/g, '\n').split(/^## /m).slice(1);
  for (const sec of secs) {
    const nl = sec.indexOf('\n');
    const head = (nl < 0 ? sec : sec.slice(0, nl)).trim(), body = (nl < 0 ? '' : sec.slice(nl + 1)).trim();
    const [lab, ...rest] = head.split(' · ');
    if (body.replace(/\[Figura:[^\]]*\]/g, '').trim().length < 40) continue; // portadas y diapositivas decorativas
    for (const x of trocea(body, 1500)) docs.push({ s: cita + ' ' + lab.replace(/\s*\(impresa[^)]*\)/, '').trim(), u: ud, t: rest.join(' · ').trim(), x });
  }
} else warns.push('sin temario: falta la carpeta ../temario (la app no podrá buscar en él)');
console.log(`temario: ${docs.length} pasajes · ${(docs.reduce((a, d) => a + d.x.length, 0) / 1024).toFixed(0)} KB · ` +
  [1, 2, 3, 4, 5].map(u => `UD${u} ${docs.filter(d => d.u === u).length}`).join(' · '));

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
if (!['/*@CARDS@*/[]', '/*@UDS@*/[]', '/*@QS@*/[]', '/*@DOCS@*/[]'].every(m => html.includes(m))) { console.error('ERROR: faltan los marcadores en fichas.src.html'); process.exit(1); }
const qslim = qs.map(q => {
  const o = { id: q.id, ud: q.ud, tema: q.tema, q: q.q, ops: q.ops, why: q.why, src: q.src || '', imp: q.imp };
  if (q.code) o.code = q.code;
  if (q.ficha) o.ficha = q.ficha;
  return o;
});
html = html.replace('/*@CARDS@*/[]', () => js(slim)).replace('/*@UDS@*/[]', () => js(unidades)).replace('/*@QS@*/[]', () => js(qslim)).replace('/*@DOCS@*/[]', () => js(docs));
mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist', 'fichas.html'), html);
const by = unidades.map(u => `UD${u.ud}: ${slim.filter(c => c.ud === u.ud).length} (${slim.filter(c => c.ud === u.ud && c.imp === 1).length}★)`).join(' · ');
console.log(`OK ${slim.length} fichas · ${by} · ${qslim.length} preguntas · ${(html.length / 1024).toFixed(0)} KB`);
