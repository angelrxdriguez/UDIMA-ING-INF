// ===== Motor de ejercicios: prepara cada ejercicio y corrige respuestas =====
function normSpec(s0, rng) {
  const s = Object.assign({}, s0);
  if (s.type === 'num') {
    s.kind = 'slots';
    s.form = [s.pre ? s.pre + ' ' : '', 0, s.unit ? ' ' + s.unit : ''];
    s.expect = [s.ans];
    if (!s.ansH) s.ansH = (s.pre ? s.pre + ' ' : '') + M(N(s.ans)) + (s.unit || '');
  } else if (s.type === 'vec') {
    s.kind = 'slots';
  } else if (s.type === 'tf') {
    s.kind = 'mc'; s.view = ['Verdadero', 'Falso']; s.correctView = s.correct ? 0 : 1; s.ansH = s.correct ? 'Verdadero' : 'Falso'; s.isTF = true;
  } else if (s.type === 'mc') {
    s.kind = 'mc';
    const order = s.keep ? s.opts.map((_, i) => i) : rng.shuffle(s.opts.map((_, i) => i));
    s.view = order.map(i => s.opts[i]); s.correctView = order.indexOf(s.correct); s.ansH = s.opts[s.correct];
  } else if (s.type === 'spot') {
    s.kind = 'spot'; s.ansH = 'La línea ' + (s.wrong + 1);
  } else if (s.type === 'chain') {
    s.kind = 'chain'; s.steps = s.steps.map(st => normSpec(st, rng));
  }
  if (s.kind === 'slots') s.nslots = s.form.filter(x => typeof x === 'number').length;
  return s;
}
function buildItem(gid, seed) {
  const g = G[gid];
  const raw = g.make(new Rng(seed));
  const it = normSpec(raw, new Rng(seed ^ 0x5bd1e995));
  it.gid = gid; it.seed = seed; it.lesson = g.lesson;
  return it;
}
function evalSlots(s, strs) {
  const vals = strs.map(parseNum);
  if (vals.some(v => Number.isNaN(v))) return { ok: false, invalid: true, vals };
  if (s.check) return { ok: !!s.check(vals), vals };
  let approx = false;
  const ok = s.expect.every((e, i) => {
    const ev = val(e);
    if (s.tol && s.tol.abs !== undefined) return Math.abs(vals[i] - ev) <= s.tol.abs;
    if (near(vals[i], ev)) return true;
    if (/[.,]/.test(strs[i]) && Math.abs(vals[i] - ev) <= Math.max(0.006 * Math.abs(ev), 0.006)) { approx = true; return true; }
    return false;
  });
  return { ok, approx: ok && approx, vals };
}
function evalSpec(s, ans) {
  if (s.kind === 'slots') return evalSlots(s, ans.slots);
  if (s.kind === 'mc') return { ok: ans.pick === s.correctView };
  if (s.kind === 'spot') return { ok: ans.pick === s.wrong };
  return { ok: false };
}
function answerReady(s, ans) {
  if (s.kind === 'slots') return ans.slots.length === s.nslots && ans.slots.every(x => x.trim() !== '');
  return ans.pick !== null && ans.pick !== undefined;
}
