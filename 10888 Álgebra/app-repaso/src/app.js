// ===== App: estado, sincronización, vistas, sesiones y Claude =====
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function txt(h) {
  const d = document.createElement('div');
  d.innerHTML = String(h || '').replace(/<br\s*\/?>/g, '\n');
  return d.textContent.replace(/[ \t ]+/g, ' ').replace(/ *\n */g, '\n').trim();
}
const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  x: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  book: ic('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/>'),
  gear: ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>'),
  home: ic('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
  path: ic('<circle cx="6" cy="5" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="19" r="2"/><path d="M8 6l8 5M16 13l-8 5"/>'),
  repeat: ic('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
  sigma: ic('<path d="M18 5H6l6 7-6 7h12"/>'),
  check: ic('<path d="M5 12.5l4.5 4.5L19 7"/>'),
  cross: ic('<path d="M6 6l12 12M18 6L6 18"/>'),
  chev: ic('<path d="M9 6l6 6-6 6"/>'),
  spark: ic('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z"/>'),
  target: ic('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  vec: ic('<path d="M4 20L18 6"/><path d="M11 6h7v7"/>'),
  chat: ic('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
};
const LOGO = `<svg viewBox="0 0 42 42" aria-hidden="true"><rect x="1" y="1" width="40" height="40" rx="11" style="fill:var(--accent)"/><path d="M11 1v40M21 1v40M31 1v40M1 11h40M1 21h40M1 31h40" style="stroke:var(--accent-ink);stroke-opacity:.2;stroke-width:1"/><path d="M10 31L28 13" style="stroke:var(--accent-ink);stroke-width:3.4;stroke-linecap:round"/><path d="M19 12.5h9.5v9.5" style="fill:none;stroke:var(--accent-ink);stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round"/><circle cx="10" cy="31" r="3" style="fill:var(--accent-ink)"/></svg>`;

// ---------- almacenamiento ----------
const KEY = 'algebra-bolsillo-v1';
const LS = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento local */ } },
};
const DEV = (() => { let d = LS.get('algebra-bolsillo-dev'); if (!d) { d = 'd' + Math.random().toString(36).slice(2, 8); LS.set('algebra-bolsillo-dev', d); } return d; })();
const isObj = x => !!x && typeof x === 'object' && !Array.isArray(x);
const obj = x => (isObj(x) ? x : {});
function blank() { return { v: 1, epoch: 0, days: {}, lessons: {}, srs: {}, sim: { best: 0, runs: 0, last: 0, lastScore: 0 }, settings: { goal: 60, examDate: '', theoryKnown: false, u: 0 } }; }
function sanitize(s) {
  const b = blank(); if (!isObj(s)) return b;
  return { v: 1, epoch: +s.epoch || 0, days: obj(s.days), lessons: obj(s.lessons), srs: obj(s.srs), sim: Object.assign(b.sim, obj(s.sim)), settings: Object.assign(b.settings, obj(s.settings)) };
}
const safeParse = t => { try { return JSON.parse(t); } catch (e) { return null; } };
let S = sanitize(safeParse(LS.get(KEY)));
const saveLocal = () => LS.set(KEY, JSON.stringify(S));
function stable(x) {
  if (Array.isArray(x)) return '[' + x.map(stable).join(',') + ']';
  if (isObj(x)) return '{' + Object.keys(x).sort().filter(k => x[k] !== undefined).map(k => JSON.stringify(k) + ':' + stable(x[k])).join(',') + '}';
  return JSON.stringify(x === undefined ? null : x);
}
const keysOf = (a, b) => [...new Set([...Object.keys(obj(a)), ...Object.keys(obj(b))])];
// Mezcla sin pérdidas: máximos por campo, el registro más reciente en el repaso, puntos por dispositivo.
function mergeState(a, b) {
  if (!b) return a; if (!a) return b;
  if ((a.epoch || 0) !== (b.epoch || 0)) return (a.epoch || 0) > (b.epoch || 0) ? a : b;
  const o = blank(); o.epoch = a.epoch || 0;
  for (const d of keysOf(a.days, b.days)) { const x = obj(a.days[d]), y = obj(b.days[d]), m = {}; for (const k of keysOf(x, y)) m[k] = Math.max(+x[k] || 0, +y[k] || 0); o.days[d] = m; }
  for (const k of keysOf(a.lessons, b.lessons)) { const x = obj(a.lessons[k]), y = obj(b.lessons[k]), m = {}; for (const f of ['stars', 'best', 'runs', 'last', 'ok', 'seen']) m[f] = Math.max(+x[f] || 0, +y[f] || 0); o.lessons[k] = m; }
  for (const k of keysOf(a.srs, b.srs)) { const x = a.srs[k], y = b.srs[k]; o.srs[k] = !isObj(x) ? y : !isObj(y) ? x : (x.last !== y.last ? (x.last > y.last ? x : y) : (stable(x) >= stable(y) ? x : y)); }
  const sa = obj(a.sim), sb = obj(b.sim); const newer = (+sa.last || 0) >= (+sb.last || 0) ? sa : sb;
  o.sim = { best: Math.max(+sa.best || 0, +sb.best || 0), runs: Math.max(+sa.runs || 0, +sb.runs || 0), last: +newer.last || 0, lastScore: +newer.lastScore || 0 };
  const ta = obj(a.settings), tb = obj(b.settings); o.settings = Object.assign(o.settings, (+ta.u || 0) >= (+tb.u || 0) ? ta : tb);
  return o;
}

// ---------- fechas, puntos y repaso ----------
const pad2 = n => String(n).padStart(2, '0');
const dayKey = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const today = () => dayKey(new Date());
const addDays = (k, n) => { const [y, m, d] = k.split('-').map(Number); return dayKey(new Date(y, m - 1, d + n)); };
const diffDays = (a, b) => { const [y1, m1, d1] = a.split('-').map(Number), [y2, m2, d2] = b.split('-').map(Number); return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5); };
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fmtDay = k => { const [, m, d] = k.split('-').map(Number); return `${d} de ${MESES[m - 1]}`; };
const DIAS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const xpOn = d => { const o = S.days[d]; return isObj(o) ? Object.values(o).reduce((a, b) => a + (+b || 0), 0) : 0; };
const totalXP = () => Object.keys(S.days).reduce((s, d) => s + xpOn(d), 0);
function addXP(n) { const d = today(), o = Object.assign({}, obj(S.days[d])); o[DEV] = (+o[DEV] || 0) + n; S.days[d] = o; }
function streak() { let d = today(), n = 0; if (!xpOn(d)) d = addDays(d, -1); while (xpOn(d) > 0) { n++; d = addDays(d, -1); } return n; }
const lp = id => Object.assign({ stars: 0, best: 0, runs: 0, last: 0, ok: 0, seen: 0 }, obj(S.lessons[id]));
const lpSet = (id, patch) => { S.lessons[id] = Object.assign(lp(id), patch); };
const INTERVALS = [0, 1, 3, 7, 14, 30];
function srsUpdate(gid, outcome) {
  const id = (G[gid] && G[gid].sib) || gid, t = today(), isNew = !isObj(S.srs[id]);
  const e = Object.assign({ box: 0, due: t, last: 0, n: 0, ok: 0 }, obj(S.srs[id]));
  if (outcome === 'ok') { e.n++; e.ok++; e.box = isNew ? 2 : Math.min(e.box + 1, 5); e.due = addDays(t, INTERVALS[e.box]); }
  else if (outcome === 'bad') { e.n++; e.box = 0; e.due = t; }
  else { e.box = 1; e.due = addDays(t, 1); }
  e.last = Date.now(); S.srs[id] = e;
}
const srsIds = () => Object.keys(S.srs).filter(id => G[id] && isObj(S.srs[id]));
const dueIds = () => { const t = today(); return srsIds().filter(id => S.srs[id].due <= t).sort((a, b) => S.srs[a].box - S.srs[b].box || (S.srs[a].due < S.srs[b].due ? -1 : 1)); };
const ratio = id => { const e = S.srs[id]; return ((+e.ok || 0) + 1) / ((+e.n || 0) + 2); };

// ---------- sincronización con la cuenta (capacidad db) ----------
const Remote = { ref: null, status: 'local', writing: false, again: false, lastRemote: null, t: 0 };
function syncHTML() {
  const m = { local: ['', 'Guardado solo en este dispositivo'], connecting: ['', 'Conectando con tu cuenta…'], ok: ['ok', 'Sincronizado con tu cuenta'], error: ['err', 'No se ha podido sincronizar; se reintentará'] }[Remote.status];
  return `<span class="sync ${m[0]}" id="sync-st"><i></i>${m[1]}</span>`;
}
function setSync(st) { Remote.status = st; const el = document.getElementById('sync-st'); if (el) el.outerHTML = syncHTML(); }
const hasData = () => Object.keys(S.days).length || Object.keys(S.lessons).length || Object.keys(S.srs).length || S.epoch;
async function initRemote() {
  if (!(window.claude && typeof window.claude.use === 'function')) return;
  try {
    const [user, db] = await Promise.all([window.claude.use('user'), window.claude.use('db')]);
    if (!user || !db) return;
    const id = await user.id(); if (!id) return;
    Remote.ref = db.doc('data/users/' + id + '/progreso');
    setSync('connecting');
    Remote.ref.onSnapshot(snap => {
      const remote = snap.exists ? sanitize(snap.data()) : null;
      Remote.lastRemote = remote ? stable(remote) : null;
      if (remote) { const m = mergeState(S, remote); if (stable(m) !== stable(S)) { S = m; saveLocal(); if (!session) render(); } }
      setSync('ok');
      if (stable(S) !== Remote.lastRemote && hasData()) scheduleWrite(1200);
    }, () => { Remote.ref = null; setSync('local'); });
  } catch (e) { setSync('local'); }
}
function scheduleWrite(ms = 600) { if (!Remote.ref) return; clearTimeout(Remote.t); Remote.t = setTimeout(flushWrite, ms); }
async function flushWrite() {
  if (!Remote.ref) return;
  if (Remote.writing) { Remote.again = true; return; }
  const body = stable(S); if (body === Remote.lastRemote) return;
  Remote.writing = true;
  try { await Remote.ref.set(JSON.parse(body)); Remote.lastRemote = body; setSync('ok'); }
  catch (e) { if (e && e.code === 'invalid_argument') { Remote.ref = null; setSync('local'); } else setSync('error'); }
  finally { Remote.writing = false; if (Remote.again) { Remote.again = false; scheduleWrite(800); } }
}
function commit() { saveLocal(); scheduleWrite(400); }

// ---------- vistas principales ----------
let view = 'hoy', session = null;
const PARTOF = l => PARTS[l.part - 1];
const KNOWN = l => l.n < START_N;
function nextLesson() {
  const order = [...LESSONS.filter(l => !KNOWN(l)), ...LESSONS.filter(KNOWN)];
  return order.find(l => lp(l.id).runs === 0) || LESSONS.slice().sort((a, b) => lp(a.id).stars - lp(b.id).stars || lp(a.id).last - lp(b.id).last)[0];
}
function examInfo() {
  const t = today(), d = S.settings.examDate;
  if (d) { const n = diffDays(t, d); if (n < 0) return { days: null, num: '—', lab: 'examen pasado', exact: true }; return { days: n, num: n > 13 ? Math.floor(n / 7) : n, lab: n > 13 ? 'semanas al examen' : n === 1 ? 'día al examen' : 'días al examen', exact: true }; }
  const n = Math.max(0, diffDays(t, '2027-01-01')); return { days: n, num: Math.floor(n / 7), lab: 'semanas a enero', exact: false };
}
const weeksTxt = d => (d >= 14 ? `${Math.floor(d / 7)} semanas` : `${d} ${d === 1 ? 'día' : 'días'}`);
const starsH = n => `<span class="stars" aria-label="${n} de 3 estrellas">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`;
function homeHTML() {
  const t = today(), xp = xpOn(t), goal = S.settings.goal, st = streak(), C = 2 * Math.PI * 19, pct = Math.min(1, xp / goal);
  const ring = `<svg class="ring" viewBox="0 0 46 46" aria-hidden="true"><circle class="bg" cx="23" cy="23" r="19"/><circle class="fg" cx="23" cy="23" r="19" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}"/></svg>`;
  const ex = examInfo();
  const week = Array.from({ length: 7 }, (_, i) => addDays(t, i - 6)).map(d => {
    const x = xpOn(d), [y, m, dd] = d.split('-').map(Number);
    return `<div class="wd ${x >= goal ? 'full' : x > 0 ? 'half' : ''} ${d === t ? 'today' : ''}"><i></i>${DIAS[new Date(y, m - 1, dd).getDay()]}</div>`;
  }).join('');
  const nx = nextLesson(), np = PARTOF(nx), due = dueIds().length;
  const newLeft = LESSONS.filter(l => !KNOWN(l) && lp(l.id).runs === 0).length;
  let plan;
  if (newLeft) {
    plan = `Te quedan ${newLeft} lecciones nuevas (de la ${START_N} a la ${LESSONS.length}). Con una al día las terminas el ${fmtDay(addDays(t, newLeft - 1))}`;
    if (ex.days != null && ex.days > newLeft) plan += `, y te quedan ${weeksTxt(ex.days - newLeft)} de margen ${ex.exact ? 'antes del examen' : 'hasta enero'}.`; else plan += '.';
  } else plan = 'Ya has pasado por todas las lecciones de la UD1. Ahora toca repasar y hacer simulacros.';
  return `<header class="top"><div class="brand">${LOGO}<div><h1>Álgebra de bolsillo</h1><p class="sub">UD1 · Vectores, rectas y planos</p></div></div><button class="icon-btn" data-act="settings" aria-label="Ajustes">${ICON.gear}</button></header>
  <section class="stats">
    <div class="stat"><span class="num">${st}</span><span class="lab">${st === 1 ? 'día' : 'días'} de racha</span></div>
    <div class="stat">${ring}<span class="lab">${xp}/${goal} hoy</span></div>
    <div class="stat"><span class="num">${ex.num}</span><span class="lab">${ex.lab}</span></div>
  </section>
  <section class="week" aria-label="Tu última semana">${week}</section>
  <button class="cta" data-act="start" data-l="${nx.id}"><span class="cta-k">${lp(nx.id).runs ? 'Para repasar' : 'Siguiente lección'}</span><span class="cta-t">${nx.n} · ${nx.title}</span><span class="cta-s">Parte ${np.roman} · ${KNOWN(nx) ? 'ya lo controlas' : 'nuevo para ti'}</span></button>
  <button class="row-btn" data-act="review"><span class="ic">${ICON.repeat}</span><span><b>Repaso del día</b><small>${due ? `${due} ejercicio${due === 1 ? '' : 's'} para hoy` : 'Lo que falles volverá aquí'}</small></span>${due ? `<span class="pill">${due}</span>` : ''}<span class="chev">${ICON.chev}</span></button>
  <button class="row-btn" data-act="mix"><span class="ic warm">${ICON.vec}</span><span><b>Repaso de lo que ya sabes</b><small>10 ejercicios mezclados de las lecciones 1 a ${START_N - 1}</small></span><span class="chev">${ICON.chev}</span></button>
  <button class="row-btn" data-act="sim"><span class="ic violet">${ICON.clock}</span><span><b>Simulacro de examen</b><small>${S.sim.runs ? 'Mejor nota: ' + dec(S.sim.best, 1) : '10 ejercicios de toda la UD1, sin ayudas'}</small></span><span class="chev">${ICON.chev}</span></button>
  <p class="note">${plan}</p>`;
}
function mapHTML() {
  const nx = nextLesson().id, done = LESSONS.filter(l => lp(l.id).runs).length;
  return `<header class="top"><div><h1>Temario</h1><p class="sub">UD1 · ${LESSONS.length} lecciones · ${done} hechas</p></div></header>` + PARTS.map(p => { const pk = LESSONS.filter(l => l.part === p.n).every(KNOWN); return `<section class="part">
    <div class="part-h"><div class="part-t"><span class="part-n">Parte ${p.roman}</span><h2>${p.title}</h2></div><span class="chip ${pk ? '' : 'new'}">${pk ? 'Repaso' : 'Nuevo para ti'}</span></div>
    <ol class="path">${LESSONS.filter(l => l.part === p.n).map(l => {
      const s = lp(l.id), cls = s.runs ? 'done' : l.id === nx ? 'cur' : '';
      const sub = s.runs ? `${starsH(s.stars)} · ${Math.round(s.best * 100)} % a la primera` : l.id === nx ? 'Sigue por aquí' : KNOWN(l) ? 'Ya lo controlas' : 'Sin empezar';
      return `<li class="node ${cls}"><button data-act="lesson" data-l="${l.id}"><span class="dot">${l.n}</span><span class="nt"><b>${l.title}</b><small>${sub}</small></span></button></li>`;
    }).join('')}</ol></section>`; }).join('');
}
function repasoHTML() {
  const due = dueIds().length, seen = srsIds().length;
  const weak = LESSONS.map(l => ({ l, s: lp(l.id) })).filter(x => x.s.seen >= 4).sort((a, b) => a.s.ok / a.s.seen - b.s.ok / b.s.seen).slice(0, 3);
  return `<header class="top"><div><h1>Repaso</h1><p class="sub">Lo que fallas vuelve hasta que lo dominas</p></div></header>
  <div class="card"><h2>${due ? due + (due === 1 ? ' ejercicio pendiente' : ' ejercicios pendientes') : 'Nada pendiente hoy'}</h2>
    <p>${seen ? 'Los que fallaste y los que toca recordar para que no se te olviden.' : 'Cuando hagas lecciones, aquí aparecerá lo que toca repasar cada día.'}</p>
    <button class="btn primary big" data-act="review">${due ? 'Repasar ahora' : seen ? 'Repasar igualmente' : 'Hacer un repaso de vectores'}</button></div>
  <div class="card"><h3>Simulacro de examen</h3><p>10 ejercicios de toda la UD1, sin ayudas ni soluciones hasta el final. Nota sobre 10.</p>
    ${S.sim.runs ? `<p>Mejor nota: <b>${dec(S.sim.best, 1)}</b> · última: ${dec(S.sim.lastScore, 1)}</p>` : ''}<button class="btn big" data-act="sim">Empezar simulacro</button></div>
  <div class="card"><h3>Repaso de lo que ya sabes</h3><p>10 ejercicios mezclados de las lecciones 1 a ${START_N - 1}, para no perder lo que ya dominas.</p><button class="btn big" data-act="mix">Empezar</button></div>
  ${weak.length ? `<div class="card"><h3>Tus puntos flojos</h3>${weak.map(x => `<button class="row-btn" data-act="start" data-l="${x.l.id}"><span class="ic warm">${ICON.target}</span><span><b>${x.l.n} · ${x.l.title}</b><small>${Math.round(100 * x.s.ok / x.s.seen)} % de aciertos a la primera</small></span><span class="chev">${ICON.chev}</span></button>`).join('')}</div>` : ''}`;
}
function formulasHTML() {
  return `<header class="top"><div><h1>Fórmulas</h1><p class="sub">El formulario de la UD1 y las erratas del material</p></div></header>` +
    FORMULAS.map(([t, rows]) => `<section class="card"><h3>${t}</h3>${rows.map(([a, b]) => `<div class="formula"><span>${a}</span>${/[a-záéíóúñ]{4,}/i.test(b.replace(/<[^>]+>/g, '')) ? `<span>${b}</span>` : M(b)}</div>`).join('')}</section>`).join('') +
    `<section class="card"><h3>Tabla de cosenos</h3><div class="cos-wrap"><div class="cos-row">${COS_ROWS.map(([a]) => `<div class="h">${a}</div>`).join('')}${COS_ROWS.map(([, b]) => `<div>${M(b)}</div>`).join('')}</div></div><p class="note">Obtusos: el mismo valor con signo menos y el ángulo 180° − α.</p></section>` +
    `<section class="card"><h3>Erratas del material</h3><p class="note">Si un resultado no te cuadra, mira aquí antes de dar vueltas.</p><div class="tbl"><table><thead><tr><th>Dónde</th><th>Pone</th><th>Debe poner</th></tr></thead><tbody>${ERRATAS.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
}
const VIEWS = { hoy: homeHTML, mapa: mapHTML, repaso: repasoHTML, formulas: formulasHTML };
const TABS = [['hoy', 'home', 'Hoy'], ['mapa', 'path', 'Temario'], ['repaso', 'repeat', 'Repaso'], ['formulas', 'sigma', 'Fórmulas']];
function render() {
  const v = $('#view'); if (!v) return;
  v.innerHTML = `<div class="wrap">${(VIEWS[view] || homeHTML)()}</div>`;
  const due = dueIds().length;
  $('#tabs').innerHTML = `<div class="in">${TABS.map(([k, i, l]) => `<button class="tab ${view === k ? 'on' : ''}" data-act="tab" data-v="${k}" ${view === k ? 'aria-current="page"' : ''}>${ICON[i]}<span>${l}${k === 'repaso' && due ? ` <span class="pill">${due}</span>` : ''}</span></button>`).join('')}</div>`;
}
function theoryHTML(L) {
  const p = PARTOF(L);
  return `<div class="theory-h"><span class="chip ${KNOWN(L) ? '' : 'new'}">Parte ${p.roman} · Lección ${L.n}</span><h2>${L.title}</h2><p class="goal"><b>Al terminar sabrás:</b> ${L.goal}</p></div>` +
    L.theory.join('') + `<button class="btn small ai-only" data-act="ask" data-l="${L.id}">${ICON.chat} Preguntar una duda a Claude</button>`;
}

// ---------- hojas inferiores y avisos ----------
let aiCtl = null, sheetClose = null;
function openSheet(title, body, onClose) {
  if (aiCtl) { aiCtl.abort(); aiCtl = null; }
  const el = $('#sheet');
  el.innerHTML = `<div class="sheet-bg" data-act="sheet-x"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(txt(title))}"><div class="sheet-h"><h2>${title}</h2><button class="icon-btn" data-act="sheet-x" aria-label="Cerrar">${ICON.x}</button></div><div class="sheet-b" id="shb">${body}</div></div>`;
  el.hidden = false; sheetClose = onClose || null;
}
function closeSheet() {
  const el = $('#sheet'); if (el.hidden) return;
  if (aiCtl) { aiCtl.abort(); aiCtl = null; }
  el.hidden = true; el.innerHTML = '';
  if (sheetClose) { const f = sheetClose; sheetClose = null; f(); }
}
let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2800); }
function lessonSheet(id) {
  const L = LESSON[id], s = lp(id), p = PARTOF(L);
  openSheet(`${L.n} · ${L.title}`, `<p class="goal"><b>Al terminar sabrás:</b> ${L.goal}</p>
    <p>${s.runs ? `${starsH(s.stars)} · ${s.runs} ${s.runs === 1 ? 'vez' : 'veces'} · mejor ${Math.round(s.best * 100)} % a la primera` : KNOWN(L) ? 'Ya lo controlas: empiezas directamente con los ejercicios.' : 'Primero verás la teoría paso a paso y después los ejercicios.'}</p>
    <div class="end-btns"><button class="btn primary big" data-act="start" data-l="${id}">${s.runs ? 'Practicar otra vez' : 'Empezar'}</button><button class="btn big" data-act="theory" data-l="${id}">${ICON.book} Ver la teoría</button></div>`);
}
function settingsBody() {
  const s = S.settings;
  return `<div class="set-row"><div class="lb">Objetivo diario<small>Puntos por día; una lección da unos 90</small></div><div class="seg" role="group" aria-label="Objetivo diario">${[30, 60, 100].map(v => `<button data-act="goal" data-v="${v}" class="${s.goal === v ? 'on' : ''}" aria-pressed="${s.goal === v}">${v}</button>`).join('')}</div></div>
  <div class="set-row"><label for="exam-d">Fecha del examen<small>${s.examDate ? 'La cuenta atrás de inicio usa esta fecha' : 'De momento cuento hasta enero de 2027'}</small></label><input type="date" id="exam-d" value="${esc(s.examDate)}" min="${today()}"></div>
  <div class="set-row"><div class="lb">Teoría al empezar en las lecciones 1 a ${START_N - 1}<small>Si está apagado, vas directo a los ejercicios</small></div><button class="switch" role="switch" aria-checked="${!!s.theoryKnown}" data-act="tk" aria-label="Mostrar la teoría al empezar"></button></div>
  <div class="set-row"><div class="lb">Tu progreso<small>${totalXP()} puntos en total</small></div>${syncHTML()}</div>
  <div class="set-row"><div class="lb">Borrar el progreso<small>Empiezas de cero en todos tus dispositivos</small></div><button class="btn small" data-act="reset">Borrar</button></div>`;
}
const refreshSettings = () => { const b = $('#shb'); if (b) b.innerHTML = settingsBody(); };

// ---------- sesiones ----------
const newSeed = () => (Math.random() * 4294967296) >>> 0;
const curSpec = () => (session.item.kind === 'chain' ? session.item.steps[session.step] : session.item);
const freshAns = sp => ({ slots: Array(sp.nslots || 0).fill(''), focus: 0, pick: null });
function beginSession(o) {
  session = Object.assign({ idx: 0, results: [], xp: 0, started: Date.now(), phase: 'q', stepRes: [] }, o);
  closeSheet(); document.body.classList.add('in-ses'); $('#ses').hidden = false;
}
function startLesson(id) {
  const L = LESSON[id]; if (!L) return;
  const r = new Rng(newSeed()), known = KNOWN(L);
  beginSession({ mode: 'lesson', lessonId: id, queue: L.plan.map(p => ({ g: Array.isArray(p) ? r.pick(p) : p, seed: newSeed(), re: 0 })) });
  if ((!known && lp(id).runs === 0) || (known && S.settings.theoryKnown)) { session.phase = 'theory'; renderSession(true); } else loadItem();
}
function startReview() {
  let ids = dueIds();
  if (ids.length < 10) ids = ids.concat(srsIds().filter(id => !ids.includes(id)).sort((a, b) => ratio(a) - ratio(b)).slice(0, 10 - ids.length));
  ids = ids.slice(0, 10);
  if (!ids.length) return startMix();
  beginSession({ mode: 'review', queue: ids.map(g => ({ g, seed: newSeed(), re: 0 })) }); loadItem();
}
function startMix() {
  const r = new Rng(newSeed()), pool = [...new Set(LESSONS.filter(KNOWN).flatMap(l => l.plan.flat()).filter(g => !g.startsWith('prof.')))];
  beginSession({ mode: 'mix', queue: r.shuffle(pool).slice(0, 10).map(g => ({ g, seed: newSeed(), re: 0 })) }); loadItem();
}
function startSim() {
  const r = new Rng(newSeed());
  beginSession({ mode: 'sim', queue: SIM_POOL.map(p => ({ g: Array.isArray(p) ? r.pick(p) : p, seed: newSeed(), re: 0 })) }); loadItem();
}
function loadItem() {
  const s = session, e = s.queue[s.idx];
  try { s.item = buildItem(e.g, e.seed); }
  catch (err) { console.error('Ejercicio con error', e, err); s.idx++; return s.idx < s.queue.length ? loadItem() : endSession(); }
  s.step = 0; s.stepRes = []; s.ans = freshAns(curSpec()); s.phase = 'q'; s.fb = null; renderSession(true);
}
function userText(sp, a) {
  if (sp.kind === 'slots') return sp.form.map(x => (typeof x === 'number' ? (a.slots[x] || '□') : txt(x))).join('').replace(/\s+/g, ' ').trim();
  if (sp.kind === 'mc') return a.pick == null ? '—' : txt(sp.view[a.pick]);
  if (sp.kind === 'spot') return a.pick == null ? '—' : 'la línea ' + (a.pick + 1);
  return '';
}
const PRAISE = ['¡Bien!', '¡Correcto!', '¡Eso es!', '¡Muy bien!'];
function doCheck() {
  const s = session; if (!s || s.phase !== 'q') return;
  const sp = curSpec(); if (!answerReady(sp, s.ans)) return;
  const res = evalSpec(sp, s.ans);
  if (res.invalid) { toast('No entiendo alguno de los números. Escribe, por ejemplo, 3/2, −1,5 o 2√3.'); return; }
  s.stepRes.push({ ok: res.ok, approx: !!res.approx, user: userText(sp, s.ans), ans: JSON.parse(JSON.stringify(s.ans)) });
  if (s.mode === 'sim') return advance();
  s.phase = 'fb'; s.fb = { ok: res.ok, praise: PRAISE[Math.floor(Math.random() * PRAISE.length)] }; renderSession();
}
function dunno() {
  const s = session; if (!s || s.phase !== 'q' || s.mode === 'sim') return;
  s.stepRes.push({ ok: false, user: '(no lo sé)', ans: s.ans, dunno: true }); s.phase = 'fb'; s.fb = { ok: false }; renderSession();
}
function advance() {
  const s = session, it = s.item;
  if (it.kind === 'chain' && s.step < it.steps.length - 1) { s.step++; s.ans = freshAns(curSpec()); s.phase = 'q'; s.fb = null; renderSession(); return; }
  finishItem();
}
function finishItem() {
  const s = session, it = s.item, e = s.queue[s.idx], ok = s.stepRes.every(x => x.ok), first = !e.re;
  if (s.mode !== 'sim') {
    const xp = ok ? (first ? (it.kind === 'chain' ? 15 : 10) : 5) : 0;
    if (xp) { addXP(xp); s.xp += xp; }
    srsUpdate(e.g, first ? (ok ? 'ok' : 'bad') : ok ? 'fixed' : 'bad');
    if (!ok && (e.re || 0) < 2) s.queue.push({ g: e.g, seed: newSeed(), re: (e.re || 0) + 1 });
  }
  if (first) { const p = lp(it.lesson); lpSet(it.lesson, { seen: p.seen + 1, ok: p.ok + (ok ? 1 : 0) }); }
  s.results.push({ g: e.g, seed: e.seed, ok, first, steps: s.stepRes.map(x => ({ ok: x.ok, user: x.user })) });
  saveLocal();
  s.idx++;
  if (s.idx >= s.queue.length) endSession(); else loadItem();
}
function endSession() {
  const s = session, firsts = s.results.filter(r => r.first), okN = firsts.filter(r => r.ok).length;
  s.acc = firsts.length ? okN / firsts.length : 0;
  if (s.mode === 'lesson') {
    const p = lp(s.lessonId), stars = s.acc >= 0.9 ? 3 : s.acc >= 0.7 ? 2 : 1, bonus = 10 + (s.acc === 1 ? 10 : 0);
    addXP(bonus); s.xp += bonus; s.stars = stars;
    lpSet(s.lessonId, { stars: Math.max(p.stars, stars), best: Math.max(p.best, s.acc), runs: p.runs + 1, last: Date.now() });
  } else if (s.mode === 'sim') {
    const score = Math.round((100 * okN) / Math.max(1, s.results.length)) / 10;
    s.score = score;
    S.sim = { best: Math.max(+S.sim.best || 0, score), runs: (+S.sim.runs || 0) + 1, last: Date.now(), lastScore: score };
    s.results.forEach(r => srsUpdate(r.g, r.ok ? 'ok' : 'bad'));
    if (okN) { addXP(okN * 10); s.xp += okN * 10; }
  } else { addXP(10); s.xp += 10; }
  s.phase = 'end'; commit(); renderSession(true);
}
function exitSession() {
  session = null; closeSheet(); $('#ses').hidden = true; $('#ses').innerHTML = ''; document.body.classList.remove('in-ses');
  commit(); render(); window.scrollTo(0, 0);
}
const PAD = ['7', '8', '9', '⌫', '4', '5', '6', '√', '1', '2', '3', '/', '−', '0', ',', '→'];
const KEYLAB = { '⌫': 'Borrar', '√': 'Raíz cuadrada', '/': 'Fracción', '−': 'Menos', ',': 'Coma decimal', '→': 'Siguiente hueco' };
const padHTML = () => `<div class="pad" role="group" aria-label="Teclado numérico">${PAD.map(k => `<button class="key ${'⌫√/→'.includes(k) ? 'fn' : ''}" data-act="key" data-k="${k}" aria-label="${KEYLAB[k] || k}">${k}</button>`).join('')}</div>`;
function inputHTML(sp) {
  const s = session, fb = s.phase === 'fb', a = s.ans, last = fb ? s.stepRes[s.stepRes.length - 1] : null;
  if (sp.kind === 'slots') return `<div class="form">${sp.form.map(x => (typeof x === 'number'
    ? `<button class="slot ${!fb && a.focus === x ? 'on' : ''} ${fb ? (last.ok ? 'ok' : 'bad') : ''}" data-act="slot" data-i="${x}" ${fb ? 'disabled' : ''} aria-label="Hueco ${x + 1}">${esc(a.slots[x]) || '&nbsp;'}</button>`
    : `<span class="ft">${x}</span>`)).join('')}</div>`;
  if (sp.kind === 'mc') return `<div class="opts ${sp.isTF ? 'tf' : ''}">${sp.view.map((o, i) => {
    const c = fb ? (i === sp.correctView ? 'right' : a.pick === i ? 'wrong' : '') : a.pick === i ? 'sel' : '';
    return `<button class="opt ${c}" data-act="pick" data-i="${i}" ${fb ? 'disabled' : ''} aria-pressed="${a.pick === i}">${o}</button>`;
  }).join('')}</div>`;
  if (sp.kind === 'spot') return `<div class="lines">${sp.lines.map((l, i) => {
    const c = fb ? (i === sp.wrong ? 'right' : a.pick === i ? 'wrong' : '') : a.pick === i ? 'sel' : '';
    return `<button class="line ${c}" data-act="pick" data-i="${i}" ${fb ? 'disabled' : ''} aria-pressed="${a.pick === i}"><span class="ln">${i + 1}</span><span>${l}</span></button>`;
  }).join('')}</div>`;
  return '';
}
function qHTML(sp, cls = '') { return `<div class="q ${cls}">${sp.isTF ? '<span class="qk">¿Verdadero o falso?</span>' : ''}${sp.q}</div>`; }
function itemHTML() {
  const s = session, it = s.item, L = LESSON[it.lesson];
  let h = `<div class="kick"><span>${L.n} · ${L.title}</span>${it.tag ? `<span class="tag">${it.tag}</span>` : ''}${s.mode === 'sim' ? '<span class="tag sim">Simulacro</span>' : ''}</div>` + figHTML(it.fig);
  if (it.kind !== 'chain') return h + qHTML(it) + inputHTML(it);
  h += `<div class="q intro">${it.q}</div><ol class="chain">`;
  it.steps.forEach((st, i) => {
    if (i < s.step) {
      const r = s.stepRes[i];
      h += s.mode === 'sim' ? `<li class="done"><div class="sn">Paso ${i + 1} · respondido</div><div class="ans-line">${esc(r.user)}</div></li>`
        : `<li class="done ${r.ok ? 'ok' : 'bad'}"><div class="sn">Paso ${i + 1} ${r.ok ? '✓' : '✗'}</div><div class="q small">${st.q}</div><div class="ans-line">${r.ok ? 'Tu respuesta: ' + esc(r.user) : 'Tú: ' + esc(r.user) + ' · Correcto: ' + st.ansH}</div></li>`;
    } else if (i === s.step) h += `<li class="cur"><div class="sn">Paso ${i + 1} de ${it.steps.length}</div>${qHTML(st)}${inputHTML(st)}</li>`;
  });
  return h + '</ol>';
}
function footHTML() {
  const s = session, sp = curSpec();
  if (s.phase === 'q') {
    return (sp.kind === 'slots' ? padHTML() : '') + `<div class="foot-row">${s.mode !== 'sim' ? '<button class="btn ghost" data-act="dunno">No lo sé</button>' : ''}<button class="btn primary big" data-act="check" ${answerReady(sp, s.ans) ? '' : 'disabled'}>${s.mode === 'sim' ? 'Siguiente' : 'Comprobar'}</button></div>`;
  }
  const last = s.stepRes[s.stepRes.length - 1], ok = last.ok, mid = s.item.kind === 'chain' && s.step < s.item.steps.length - 1;
  const head = ok ? `${ICON.check} ${s.fb.praise || '¡Bien!'}` : `${ICON.cross} ${last.dunno ? 'Así se hace' : 'No es correcto'}`;
  const ans = ok ? (last.approx ? `<div class="fb-a">Vale, aunque es aproximado. El valor exacto es ${sp.ansH}</div>` : sp.check ? `<div class="fb-a">Hay muchas respuestas correctas; una es ${sp.ansH}</div>` : '') : `<div class="fb-a">${sp.check ? 'Una respuesta correcta' : 'Respuesta correcta'}: ${sp.ansH}</div>`;
  return `<div class="fb ${ok ? 'ok' : 'bad'}" role="status"><div class="fb-h">${head}</div>${ans}<div class="fb-row"><button class="btn small" data-act="sol">Paso a paso</button><button class="btn small ai-only" data-act="ai">${ICON.spark} Explícamelo</button></div><button class="btn ${ok ? 'okb' : 'primary'} big" data-act="next">${mid ? 'Siguiente paso' : 'Continuar'}</button></div>`;
}
function endHTML() {
  const s = session, st = streak();
  let h = '<div class="end">';
  if (s.mode === 'sim') {
    h += `<p class="sn">Simulacro de examen</p><div class="grade">${dec(s.score, 1)}</div><h2>${s.score >= 8 ? 'Estás preparado' : s.score >= 5 ? 'Vas bien, pero repasa' : 'Toca repasar'}</h2>
      <p class="note">${s.score >= 8 ? 'Con un 8 o más, esta parte del examen la tienes.' : s.score >= 5 ? 'Repite las lecciones de los ejercicios que fallaste y vuelve a intentarlo en unos días.' : 'Vuelve a las lecciones de los ejercicios fallados antes de repetir el simulacro.'} Los fallos ya están en tu repaso.</p>
      <div class="res-list">${s.results.map((r, i) => `<button class="res ${r.ok ? 'ok' : 'bad'}" data-act="simsol" data-i="${i}"><span class="mk">${r.ok ? '✓' : '✗'}</span><span><b>${i + 1}. ${LESSON[G[r.g].lesson].title}</b><small>${r.ok ? 'Bien · ver la solución' : 'Ver la solución'}</small></span></button>`).join('')}</div>`;
  } else {
    const L = LESSON[s.lessonId];
    h += (s.mode === 'lesson' ? `<div class="big-stars" aria-label="${s.stars} de 3 estrellas">${'★'.repeat(s.stars)}<span class="off">${'★'.repeat(3 - s.stars)}</span></div>` : '') +
      `<h2>${s.mode === 'lesson' ? 'Lección completada' : 'Repaso hecho'}</h2><p class="note">${s.mode === 'lesson' ? `${L.n} · ${L.title}` : 'Lo que has fallado volverá mañana.'}</p>`;
  }
  h += `<div class="end-stats"><div><b>+${s.xp}</b><span>puntos</span></div><div><b>${Math.round(s.acc * 100)} %</b><span>a la primera</span></div><div><b>${st}</b><span>${st === 1 ? 'día' : 'días'} de racha</span></div></div>`;
  if (xpOn(today()) >= S.settings.goal) h += '<p class="note">Objetivo diario conseguido.</p>';
  return h + '</div>';
}
function endButtons() {
  const s = session;
  const again = s.mode === 'lesson' ? `<button class="btn big" data-act="start" data-l="${s.lessonId}">Repetir la lección</button>` : s.mode === 'sim' ? '<button class="btn big" data-act="sim">Otro simulacro</button>' : '';
  return `<div class="end-btns"><button class="btn primary big" data-act="ses-exit">Continuar</button>${again}</div>`;
}
function renderSession(top) {
  const s = session; if (!s) return;
  const root = $('#ses'), old = root.querySelector('#sb'), keep = !top && old ? old.scrollTop : 0;
  const done = s.phase === 'end' ? 1 : s.idx / s.queue.length;
  const thL = s.mode === 'lesson' ? s.lessonId : s.item ? s.item.lesson : null;
  const showTh = thL && s.phase !== 'theory' && s.phase !== 'end' && s.mode !== 'sim';
  const head = `<header class="ses-top gut"><div class="wrap"><button class="icon-btn" data-act="${s.phase === 'end' ? 'ses-exit' : 'ses-close'}" aria-label="Salir">${ICON.x}</button>
    <div class="bar" role="progressbar" aria-label="Progreso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(done * 100)}"><span style="width:${(done * 100).toFixed(1)}%"></span></div>
    ${showTh ? `<button class="icon-btn" data-act="theory" data-l="${thL}" aria-label="Ver la teoría">${ICON.book}</button>` : '<span style="width:44px;flex:none"></span>'}</div></header>`;
  let body, foot;
  if (s.phase === 'theory') { body = theoryHTML(LESSON[s.lessonId]); foot = '<button class="btn primary big" data-act="ses-start">Empezar los ejercicios</button>'; }
  else if (s.phase === 'end') { body = endHTML(); foot = endButtons(); }
  else { body = itemHTML(); foot = footHTML(); }
  root.innerHTML = head + `<div class="ses-body gut" id="sb"><div class="wrap">${body}</div></div><footer class="ses-foot gut"><div class="wrap">${foot}</div></footer>`;
  const sb = root.querySelector('#sb'); sb.scrollTop = top ? 0 : keep;
  const cur = sb.querySelector('.chain li.cur');
  if (cur && s.step > 0 && s.phase === 'q') { const r = cur.getBoundingClientRect(), b = sb.getBoundingClientRect(); if (r.bottom > b.bottom || r.top < b.top) sb.scrollTop += r.top - b.top - 8; }
}
function refreshInputs() {
  const a = session.ans;
  document.querySelectorAll('#ses .slot').forEach(b => { const i = +b.dataset.i; b.textContent = a.slots[i] || ' '; b.classList.toggle('on', i === a.focus); });
  const c = document.querySelector('#ses [data-act="check"]'); if (c) c.disabled = !answerReady(curSpec(), a);
}
function keyPress(k) {
  const s = session; if (!s || s.phase !== 'q') return;
  const sp = curSpec(); if (sp.kind !== 'slots') return;
  const a = s.ans; let v = a.slots[a.focus] || '';
  if (k === '→') { a.focus = (a.focus + 1) % sp.nslots; return refreshInputs(); }
  if (k === '⌫') v = v.slice(0, -1); else if (v.length < 14) v += k;
  a.slots[a.focus] = v; refreshInputs();
}
function solBody(sp) {
  return (sp.sol && sp.sol.length ? stepsH(sp.sol) : '<p>Este ejercicio no tiene pasos guardados.</p>') + `<div class="sheet-row"><button class="btn small ai-only" data-act="ai">${ICON.spark} Explícamelo con Claude</button></div>`;
}
function simSolSheet(i) {
  const r = session.results[i], it = buildItem(r.g, r.seed), specs = it.kind === 'chain' ? it.steps : [it];
  let h = figHTML(it.fig) + `<div class="q intro">${it.q}</div>`;
  specs.forEach((sp, j) => {
    const u = r.steps[j];
    h += `<div class="card">${it.kind === 'chain' ? `<p class="sn">Paso ${j + 1}</p><p>${sp.q}</p>` : ''}<p><b>Tú:</b> ${esc(u ? u.user : '—')} ${u ? (u.ok ? '✓' : '✗') : ''}</p><p><b>Correcto:</b> ${sp.ansH}</p>${stepsH(sp.sol || [])}</div>`;
  });
  openSheet(`Ejercicio ${i + 1}`, h);
}

// ---------- Claude (capacidad sample) ----------
let SAMPLE = null, chat = null;
function initAI() {
  if (!(window.claude && typeof window.claude.use === 'function')) return;
  window.claude.use('sample').then(s => { SAMPLE = s || null; document.body.classList.toggle('ai-on', !!s); }).catch(() => {});
}
const HIDE_CODES = ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'];
const AI_ERR = {
  not_granted: 'No has dado permiso a esta página para usar Claude. Puedes cambiarlo en el menú de permisos del artefacto.',
  sampling_disabled: 'Claude no está disponible para esta cuenta.', not_declared: 'Esta versión de la página no puede usar Claude.',
  capability_disabled: 'Claude no está disponible en esta vista.', capability_removed: 'Claude no está disponible en esta vista.',
  rate_limited: 'Has hecho muchas preguntas seguidas o has llegado a tu límite de uso. Prueba dentro de un rato.',
  session_expired: 'Tu sesión de Claude ha caducado. Vuelve a iniciar sesión.', refused: 'Claude no ha podido responder a esto. Prueba a preguntarlo de otra forma.',
  empty_completion: 'Claude no ha devuelto respuesta. Prueba a preguntarlo de otra forma.', prompt_too_large: 'La pregunta es demasiado larga. Acórtala un poco.',
  upstream_error: 'Se ha cortado la conexión con Claude. Vuelve a intentarlo.',
};
const AI_RULES = `Eres el profesor particular de Álgebra de un estudiante de Ingeniería Informática a distancia (UDIMA, asignatura Álgebra, unidad 1: vectores, rectas y planos). Le ayudas desde una app de repaso que usa en el móvil.
Escribe en español de España, de tú, con frases cortas y claras, como en una buena tutoría.
Formato: solo texto plano, sin Markdown, sin asteriscos y sin LaTeX. Usa saltos de línea y, si ayudan, viñetas con "•". Escribe los vectores como [1, −2, 3], los puntos como (1, 2, 3), las fracciones como 3/2, las raíces como √5 y los productos como 2·3.
Usa el mismo método y notación que el material del profesor J. J. Moreno: final menos inicial, tapar columnas en el producto vectorial, eliminación con E2 ← E2 − 3E1, proyección (u·v / u·u)·u, distancia como parte perpendicular de la proyección.`;
function aiCtxText() {
  const s = session; if (!s || !s.item) return '';
  const it = s.item, sp = curSpec(), L = LESSON[it.lesson], lines = [`Lección ${L.n}: ${L.title}.`];
  if (it.kind === 'chain') { lines.push('Ejercicio: ' + txt(it.q)); lines.push(`Paso ${s.step + 1} de ${it.steps.length}: ` + txt(sp.q)); } else lines.push('Ejercicio: ' + txt(sp.q));
  if (sp.kind === 'mc') lines.push('Opciones: ' + sp.view.map((o, i) => `(${i + 1}) ${txt(o)}`).join('; '));
  if (sp.kind === 'spot') lines.push('Resolución que contiene un error: ' + sp.lines.map((l, i) => `(${i + 1}) ${txt(l)}`).join('; '));
  const last = s.phase === 'fb' ? s.stepRes[s.stepRes.length - 1] : null;
  if (last) lines.push('Respuesta del alumno: ' + last.user + (last.dunno ? ' (no lo sabía)' : last.ok ? ' (correcta)' : ' (incorrecta)'));
  lines.push('Respuesta correcta: ' + txt(sp.ansH));
  if (sp.sol && sp.sol.length) lines.push('Solución de referencia:\n' + sp.sol.map(([a, b], i) => `${i + 1}. ${txt(a)}${b ? ' — ' + txt(b) : ''}`).join('\n'));
  return lines.join('\n');
}
function lessonCtx(id) { const L = LESSON[id]; if (!L) return 'Unidad 1 de Álgebra: vectores, rectas y planos.'; return `Lección ${L.n}: ${L.title}. Objetivo: ${L.goal}\nTeoría que está leyendo:\n${txt(L.theory.join('\n')).slice(0, 3500)}`; }
async function runAI(input, opts, out, onDone) {
  const st = $('#ai-st'), stop = $('#ai-stop');
  if (!SAMPLE) { if (st) st.textContent = 'Claude no está disponible en esta vista.'; return; }
  const ctl = new AbortController(); aiCtl = ctl;
  const alive = () => document.body.contains(out);
  st.textContent = 'Pensando…'; st.className = 'ai-st thinking'; if (stop) stop.hidden = false;
  try {
    const { text, truncated } = await SAMPLE(input, Object.assign({ signal: ctl.signal, onText: u => { if (alive()) { out.textContent = u.text; st.textContent = ''; st.className = 'ai-st'; } } }, opts));
    if (!alive()) return;
    out.textContent = text; st.className = 'ai-st'; st.textContent = truncated ? 'La respuesta se ha cortado: pregunta algo más concreto.' : '';
    if (onDone) onDone(text);
  } catch (e) {
    if (!alive()) return;
    const code = e && e.code; st.className = 'ai-st';
    if (code === 'cancelled') st.textContent = 'Parado.';
    else {
      if (HIDE_CODES.includes(code)) { SAMPLE = null; document.body.classList.remove('ai-on'); }
      out.textContent = code === 'refused' ? '' : (e && e.text) || out.textContent;
      st.textContent = AI_ERR[code] || AI_ERR.upstream_error;
    }
  } finally { if (aiCtl === ctl) aiCtl = null; if (stop && alive()) stop.hidden = true; }
}
function explain() {
  if (!session || !session.item) return;
  const last = session.phase === 'fb' ? session.stepRes[session.stepRes.length - 1] : null;
  const ask = !last ? 'Explícale cómo se resuelve este ejercicio, paso a paso y sin rodeos.'
    : last.ok ? 'Lo ha hecho bien. Explícale en pocas frases por qué es correcto y cuál es la idea clave para que no se le olvide.'
      : 'Explícale dónde está su error concreto (dedúcelo comparando su respuesta con la correcta; si no se puede saber, di cuál es el fallo más probable) y cómo se hace bien. Termina con una forma de comprobarlo él solo.';
  const ctx = aiCtxText();
  openSheet('Explicación de Claude', `<div class="ai-out" id="ai-out" aria-live="polite"></div><p class="ai-st" id="ai-st"></p><div class="sheet-row"><button class="btn small" data-act="ai-stop" id="ai-stop">Parar</button><button class="btn small" data-act="ask">${ICON.chat} Preguntar otra cosa</button></div>`);
  runAI(`${AI_RULES}\nResponde en un máximo de unas 140 palabras.\n\n${ctx}\n\n${ask}`, { modelTier: 'quick' }, $('#ai-out'));
}
function askSheet(lessonId) {
  const inItem = session && session.item && session.phase !== 'theory' && session.phase !== 'end';
  chat = { ctx: inItem ? aiCtxText() : lessonCtx(lessonId || (session && session.lessonId)), turns: [] };
  openSheet('Pregunta a Claude', `<div class="chat" id="chat"></div><form class="ask-f" id="ask-f"><label class="sr" for="ask-q">Tu duda</label><textarea id="ask-q" rows="2" placeholder="Por ejemplo: ¿por qué el director es [−b, a]?"></textarea><button class="btn primary" type="submit">Preguntar</button></form><p class="ai-st" id="ai-st"></p><div class="sheet-row"><button class="btn small" data-act="ai-stop" id="ai-stop" hidden>Parar</button></div>`);
  if (!SAMPLE) $('#ai-st').textContent = 'Claude no está disponible en esta vista.';
}
function sendDoubt() {
  const q = $('#ask-q'); if (!q || !chat || aiCtl) return;
  const text = q.value.trim(); if (!text) return;
  q.value = '';
  chat.turns.push({ role: 'user', content: chat.turns.length ? text : `${AI_RULES}\nResponde en un máximo de unas 180 palabras.\n\nContexto de lo que está estudiando:\n${chat.ctx}\n\nSu pregunta: ${text}` });
  const box = $('#chat');
  box.insertAdjacentHTML('beforeend', `<div class="bub me">${esc(text)}</div><div class="bub cl"></div>`);
  const out = box.lastElementChild, turns = chat.turns.slice(-9);
  if (turns[0].role !== 'user') turns.unshift(chat.turns[0]);
  runAI(turns.map(t => ({ role: t.role, content: t.content })), { cache: false }, out, reply => { if (chat) chat.turns.push({ role: 'assistant', content: reply }); });
}

// ---------- acciones ----------
const ACT = {
  tab: b => { view = b.dataset.v; render(); window.scrollTo(0, 0); },
  settings: () => openSheet('Ajustes', settingsBody()),
  lesson: b => lessonSheet(b.dataset.l),
  start: b => startLesson(b.dataset.l),
  theory: b => openSheet('Teoría', theoryHTML(LESSON[b.dataset.l])),
  review: () => startReview(), mix: () => startMix(), sim: () => startSim(),
  'ses-start': () => loadItem(),
  'ses-close': () => {
    if (session.phase === 'theory' || (!session.results.length && !session.stepRes.length)) return exitSession();
    openSheet('¿Salir?', `<p>Los puntos que llevas y lo que has fallado se guardan, pero ${session.mode === 'lesson' ? 'la lección no se marcará como hecha' : 'este repaso no quedará completo'}.</p><div class="end-btns"><button class="btn primary big" data-act="sheet-x">Seguir</button><button class="btn big" data-act="ses-exit">Salir</button></div>`);
  },
  'ses-exit': () => exitSession(),
  check: () => doCheck(), next: () => { if (session && session.phase === 'fb') advance(); }, dunno: () => dunno(),
  key: b => keyPress(b.dataset.k),
  slot: b => { if (session.phase !== 'q') return; session.ans.focus = +b.dataset.i; refreshInputs(); },
  pick: b => { if (!session || session.phase !== 'q') return; session.ans.pick = +b.dataset.i; renderSession(); },
  sol: () => openSheet('Paso a paso', solBody(curSpec())),
  ai: () => explain(), ask: b => askSheet(b.dataset.l), 'ai-stop': () => { if (aiCtl) aiCtl.abort(); },
  simsol: b => simSolSheet(+b.dataset.i),
  'sheet-x': () => closeSheet(),
  goal: b => { S.settings.goal = +b.dataset.v; S.settings.u = Date.now(); commit(); refreshSettings(); render(); },
  tk: () => { S.settings.theoryKnown = !S.settings.theoryKnown; S.settings.u = Date.now(); commit(); refreshSettings(); },
  reset: b => { b.textContent = 'Sí, borrar todo'; b.dataset.act = 'reset2'; b.classList.add('primary'); },
  reset2: () => { const ep = Date.now(); S = blank(); S.epoch = ep; commit(); closeSheet(); render(); toast('Progreso borrado'); },
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
  const f = ACT[b.dataset.act]; if (f) { e.preventDefault(); f(b, e); }
});
document.addEventListener('submit', e => { if (e.target && e.target.id === 'ask-f') { e.preventDefault(); sendDoubt(); } });
document.addEventListener('change', e => {
  if (e.target && e.target.id === 'exam-d') { S.settings.examDate = e.target.value || ''; S.settings.u = Date.now(); commit(); render(); refreshSettings(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#sheet').hidden) { closeSheet(); return; }
  if (!session || !$('#sheet').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
  if (session.phase === 'fb' && e.key === 'Enter') { e.preventDefault(); advance(); return; }
  if (session.phase !== 'q') return;
  const sp = curSpec();
  if (sp.kind === 'slots') {
    const map = { '-': '−', '.': ',', ',': ',', '/': '/', r: '√', s: '√' };
    if (/^[0-9]$/.test(e.key)) keyPress(e.key);
    else if (map[e.key]) keyPress(map[e.key]);
    else if (e.key === 'Backspace') keyPress('⌫');
    else if (e.key === 'Tab') keyPress('→');
    else if (e.key === 'Enter') doCheck();
    else return;
    e.preventDefault();
  } else if (/^[1-9]$/.test(e.key) && +e.key <= (sp.view || sp.lines).length) { session.ans.pick = +e.key - 1; renderSession(); }
  else if (e.key === 'Enter') doCheck();
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { saveLocal(); flushWrite(); } });

// ---------- arranque (y conservar la sesión si la página se actualiza mientras estudias) ----------
function snap() {
  try {
    if (session && session.phase !== 'end') return { view, session: { mode: session.mode, lessonId: session.lessonId || null, queue: session.queue, idx: session.idx, results: session.results, xp: session.xp, started: session.started } };
  } catch (e) { /* sin sesión que guardar */ }
  return { view };
}
function restore(d) {
  if (!isObj(d)) return;
  if (VIEWS[d.view]) view = d.view;
  const ss = d.session;
  if (isObj(ss) && Array.isArray(ss.queue) && ss.idx < ss.queue.length && ss.queue.every(e => e && G[e.g])) { beginSession(ss); loadItem(); }
}
render(); initAI(); initRemote();
let booted = false;
function boot(data) {
  if (booted) return; booted = true;
  try { restore(data); } catch (e) { session = null; }
  render();
}
const HOT = window.claude && window.claude.hot;
try { if (HOT && typeof HOT.snapshot === 'function') HOT.snapshot(snap); } catch (e) { /* sin recarga en caliente */ }
if (HOT && typeof HOT.ready === 'function') {
  try { HOT.ready(boot); } catch (e) { boot({}); }
  setTimeout(() => boot((HOT && HOT.data) || {}), 1500);
} else boot((HOT && HOT.data) || {});
