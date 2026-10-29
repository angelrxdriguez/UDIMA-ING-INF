// Prueba todos los generadores con muchas semillas: estructura, valores y que la solución correcta se acepte.
const fs = require('fs');
const path = require('path');
const src = ['math.js', 'gens1.js', 'gens2.js', 'engine.js', 'figs.js'].map(f => fs.readFileSync(path.join(__dirname, '..', 'src', f), 'utf8')).join('\n');
const extra = fs.existsSync(path.join(__dirname, '..', 'src', 'lessons.js')) ? fs.readFileSync(path.join(__dirname, '..', 'src', 'lessons.js'), 'utf8') : '';
const api = new Function(src + '\n' + extra + '\nreturn { G, buildItem, evalSlots, normSpec, val, parseNum, LESSONS: typeof LESSONS !== "undefined" ? LESSONS : null };')();
const { G, buildItem, evalSlots, val, parseNum } = api;

const SEEDS = +(process.argv[2] || 400);
const errs = [];
const strip = h => String(h).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
function badStr(h) { const t = String(h); return /undefined|NaN|\[object|Infinity/.test(t) || t.trim() === ''; }
function fmt(x) { const v = val(x); return Number.isInteger(v) ? String(v) : v.toPrecision(15); }
function checkSpec(s, ctx) {
  const where = ctx;
  if (s.q !== undefined && badStr(s.q)) errs.push(where + ' q mala: ' + strip(s.q).slice(0, 80));
  if (s.ansH !== undefined && badStr(s.ansH)) errs.push(where + ' ansH mala');
  (s.sol || []).forEach((st, i) => { if (badStr(st[0]) || st[1] === undefined) errs.push(where + ' sol[' + i + '] mala: ' + strip(st[0]).slice(0, 60)); });
  if (s.kind === 'chain') { if (!s.steps.length) errs.push(where + ' cadena vacía'); s.steps.forEach((st, i) => checkSpec(st, where + '/paso' + i)); return; }
  if (s.kind === 'slots') {
    if (s.check) {
      if (!s.sample) { errs.push(where + ' check sin sample'); return; }
      const smp = s.sample.map(val);
      if (smp.length !== s.nslots) errs.push(where + ' sample con ' + smp.length + ' huecos, form ' + s.nslots);
      if (!s.check(smp)) errs.push(where + ' sample NO pasa el check: ' + JSON.stringify(smp));
      const res = evalSlots(s, smp.map(String));
      if (!res.ok) errs.push(where + ' evalSlots rechaza sample');
      if (s.check(smp.map(() => 0)) && s.nslots > 2 && !/punto/i.test(strip(s.q))) errs.push(where + ' el check acepta todo ceros');
    } else {
      if (!s.expect || s.expect.length !== s.nslots) { errs.push(where + ' expect/huecos no cuadran ' + (s.expect || []).length + '/' + s.nslots); return; }
      for (const e of s.expect) if (!Number.isFinite(val(e))) errs.push(where + ' expect no finito');
      const res = evalSlots(s, s.expect.map(fmt));
      if (!res.ok) errs.push(where + ' rechaza su propia respuesta ' + s.expect.map(fmt).join(','));
      const wrong = s.expect.map(e => fmt(val(e) + 1.37));
      if (evalSlots(s, wrong).ok) errs.push(where + ' acepta una respuesta errónea');
    }
    return;
  }
  if (s.kind === 'mc') {
    if (!s.view || s.view.length < 2) errs.push(where + ' mc sin opciones');
    const texts = s.view.map(strip);
    if (new Set(texts).size !== texts.length) errs.push(where + ' opciones repetidas: ' + texts.join(' | '));
    if (!(s.correctView >= 0 && s.correctView < s.view.length)) errs.push(where + ' correctView fuera');
    s.view.forEach(o => { if (badStr(o)) errs.push(where + ' opción mala'); });
    return;
  }
  if (s.kind === 'spot') { if (!(s.wrong >= 0 && s.wrong < s.lines.length)) errs.push(where + ' spot wrong fuera'); s.lines.forEach(l => { if (badStr(l)) errs.push(where + ' línea mala'); }); return; }
  errs.push(where + ' tipo desconocido ' + s.type);
}
let n = 0;
for (const gid of Object.keys(G)) {
  const fixed = gid.startsWith('prof.') || gid === 'l19.errata';
  for (let seed = 1; seed <= (fixed ? 3 : SEEDS); seed++) {
    let it;
    try { it = buildItem(gid, seed * 7919); } catch (e) { errs.push(gid + '#' + seed + ' EXCEPCIÓN ' + e.message + '\n' + e.stack.split('\n').slice(1, 3).join('\n')); continue; }
    checkSpec(it, gid + '#' + seed); n++;
  }
}
// pruebas del lector de números
const P = [['3/2', 1.5], ['−1,5', -1.5], ['2√3', 2 * Math.sqrt(3)], ['√2/2', Math.SQRT2 / 2], ['1/√2', 1 / Math.SQRT2], ['-3/-2', 1.5], ['(1+√5)/2', (1 + Math.sqrt(5)) / 2], ['3√14', 3 * Math.sqrt(14)], ['0', 0], ['−√3/3', -Math.sqrt(3) / 3], ['10:5', 2]];
for (const [s, v] of P) { const got = parseNum(s); if (!(Math.abs(got - v) < 1e-9)) errs.push('parseNum ' + s + ' = ' + got); }
for (const s of ['', '3/', '√', '2..3', 'abc', '(3']) if (!Number.isNaN(parseNum(s))) errs.push('parseNum debería fallar con ' + s);
// lecciones
if (api.LESSONS) for (const L of api.LESSONS) for (const p of L.plan) for (const g of [].concat(p)) if (!G[g]) errs.push('lección ' + L.id + ' usa gen inexistente ' + g);
const uniq = [...new Set(errs)];
console.log('ejercicios generados:', n, ' generadores:', Object.keys(G).length, ' errores:', uniq.length);
console.log(uniq.slice(0, 60).join('\n'));
process.exit(uniq.length ? 1 : 0);
