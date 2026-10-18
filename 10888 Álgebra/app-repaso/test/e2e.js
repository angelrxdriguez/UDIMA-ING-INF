// Genera páginas de prueba (la app + un guion que la maneja con clics) y las ejecuta en Chrome sin ventana.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dist = fs.readFileSync(path.join(__dirname, '..', 'dist', 'algebra.html'), 'utf8');
const out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
const skeleton = (body, extra) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${body}<script>${extra}</script></body></html>`;

const HELPERS = `
const REP = { errors: [], log: [], items: 0, kinds: {} };
window.addEventListener('error', e => REP.errors.push('error: ' + e.message + ' @' + (e.filename||'').slice(-20) + ':' + e.lineno));
window.addEventListener('unhandledrejection', e => REP.errors.push('rejection: ' + (e.reason && e.reason.message || e.reason)));
const oce = console.error; console.error = (...a) => { REP.errors.push('console.error: ' + a.map(String).join(' ')); oce.apply(console, a); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
function act(name, data = {}) { const b = document.createElement('button'); b.dataset.act = name; Object.assign(b.dataset, data); b.hidden = true; document.body.appendChild(b); b.click(); b.remove(); }
function click(sel) { const el = q(sel); if (!el) throw new Error('no encuentro ' + sel); el.click(); }
function report() { const pre = document.createElement('pre'); pre.id = 'REPORT'; pre.textContent = JSON.stringify(REP, null, 1); document.body.appendChild(pre); }
async function playSession(maxSteps = 4000) {
  for (let n = 0; n < maxSteps; n++) {
    await sleep(5);
    const ses = q('#ses');
    if (!ses || ses.hidden) return 'cerrada';
    if (q('#ses [data-act="ses-start"]')) { click('#ses [data-act="ses-start"]'); continue; }
    if (q('#ses .end')) return 'fin';
    if (q('#sb > .wrap.leave')) continue;
    const nextB = q('#ses [data-act="next"]');
    if (nextB) {
      if (Math.random() < 0.15) { click('#ses [data-act="sol"]'); await sleep(2); if (q('#sheet').hidden) REP.errors.push('no abre paso a paso'); act('sheet-x'); }
      nextB.click(); continue;
    }
    const slots = document.querySelectorAll('#ses .slot');
    const opts = document.querySelectorAll('#ses .opt, #ses .line');
    REP.items++;
    const tg = q('#ses .kick .tag:not(.sim)'); if (tg && REP.tags) REP.tags.push(tg.textContent);
    const r = Math.random();
    if (r < 0.2 && q('#ses [data-act="dunno"]')) { click('#ses [data-act="dunno"]'); REP.kinds.dunno = (REP.kinds.dunno||0)+1; continue; }
    if (slots.length) {
      REP.kinds.slots = (REP.kinds.slots||0)+1;
      slots.forEach((s, i) => { s.click(); const keys = ['1','−','2','√','/','3',',','0']; const k1 = keys[(i + REP.items) % keys.length]; act('key', { k: k1 === '√' || k1 === '/' || k1 === ',' ? '2' : k1 }); act('key', { k: '1' }); });
    } else if (opts.length) { REP.kinds.opts = (REP.kinds.opts||0)+1; opts[Math.floor(Math.random() * opts.length)].click(); }
    else { REP.errors.push('ejercicio sin entrada: ' + (q('#ses .q') || {}).textContent); act('ses-exit'); return 'roto'; }
    const c = q('#ses [data-act="check"]');
    if (!c || c.disabled) { REP.errors.push('Comprobar desactivado tras responder: ' + (q('#ses .q') || {}).textContent.slice(0, 80)); act('ses-exit'); return 'roto'; }
    c.click();
  }
  return 'demasiados pasos';
}
`;
const scenarios = {
  full: `(async () => { try {
    await sleep(50);
    if (!q('#view .brand')) REP.errors.push('no se ve la pantalla de inicio');
    for (const v of ['mapa','repaso','formulas','hoy']) { act('tab', { v }); await sleep(2); if (!q('#view .top')) REP.errors.push('vista vacía ' + v); }
    act('settings'); await sleep(2); if (!q('#sheet .set-row')) REP.errors.push('ajustes vacíos'); act('goal', { v: '30' }); act('sheet-x');
    for (let i = 1; i <= 21; i++) { act('lesson', { l: 'L' + i }); await sleep(2); act('theory', { l: 'L' + i }); await sleep(2); if (!q('#sheet .tc')) REP.errors.push('sin teoría L' + i); act('sheet-x');
      act('start', { l: 'L' + i }); const res = await playSession(); REP.log.push('L' + i + ': ' + res);
      if (res === 'fin') {
        const nres = document.querySelectorAll('#ses .res').length, nbad = document.querySelectorAll('#ses .res.bad').length;
        if (!nres) REP.errors.push('L' + i + ' sin lista de respuestas');
        const rb = q('#ses [data-act="retry"]');
        if (!!rb !== nbad > 0) REP.errors.push('L' + i + ' botón de reintento incoherente: ' + nbad + ' fallos');
        if (rb && i % 4 === 1) { rb.click(); const rr = await playSession(); REP.log.push('L' + i + ' reintento (' + nbad + '): ' + rr + ' · ' + document.querySelectorAll('#ses .res').length + ' en el resumen'); if (document.querySelectorAll('#ses .res').length !== nbad) REP.errors.push('el reintento no tiene ' + nbad + ' ejercicios'); }
        act('ses-exit');
      } }
    act('review'); REP.log.push('repaso: ' + await playSession()); act('ses-exit');
    act('mix'); REP.log.push('mezcla: ' + await playSession()); act('ses-exit');
    act('sim'); const rs = await playSession(); REP.log.push('simulacro: ' + rs); if (q('#ses .res')) { click('#ses .res'); await sleep(2); if (!q('#sheet .card')) REP.errors.push('sin solución de simulacro'); act('sheet-x'); } act('ses-exit');
    act('start', { l: 'L3' }); await sleep(5); act('ses-close'); await sleep(2); act('ses-exit');
    const st = JSON.parse(localStorage.getItem('algebra-bolsillo-v1'));
    REP.state = { lessons: Object.keys(st.lessons).length, srs: Object.keys(st.srs).length, days: st.days, sim: st.sim, goal: st.settings.goal };
    act('tab', { v: 'hoy' }); await sleep(2); REP.home = q('#view').textContent.replace(/\\s+/g, ' ').slice(0, 400);
    act('tab', { v: 'mapa' }); await sleep(2); REP.map = q('#view').textContent.replace(/\\s+/g, ' ').slice(0, 300);
  } catch (e) { REP.errors.push('guion: ' + e.message + ' ' + e.stack); } report(); })();`,
};
// Los ejercicios del profesor salen tal cual la primera vez y con otros números después.
scenarios.prof = `(async () => { try {
    await sleep(50); REP.tags = [];
    for (const l of ['L9', 'L9', 'L19', 'L19', 'L20', 'L20']) { REP.tags.push('— ' + l); act('start', { l }); const res = await playSession(); REP.log.push(l + ': ' + res); if (res === 'fin') act('ses-exit'); }
    REP.pv = Object.fromEntries(Object.entries(JSON.parse(localStorage.getItem('algebra-bolsillo-v1')).lessons).map(([k, v]) => [k, v.pv]));
  } catch (e) { REP.errors.push('guion: ' + e.message + ' ' + e.stack); } report(); })();`;
const which = process.argv[2] || 'full';
const file = path.join(out, which + '.html');
fs.writeFileSync(file, skeleton(dist, HELPERS + scenarios[which]));
const dom = execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--window-size=390,844', '--virtual-time-budget=600000', '--dump-dom', 'file:///' + file.replace(/\\/g, '/')], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 240000 });
const m = dom.match(/<pre id="REPORT">([\s\S]*?)<\/pre>/);
if (!m) { console.log('SIN INFORME. Final del DOM:\n', dom.slice(-1500)); process.exit(1); }
const rep = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
console.log(JSON.stringify(rep, null, 1).slice(0, 6000));
