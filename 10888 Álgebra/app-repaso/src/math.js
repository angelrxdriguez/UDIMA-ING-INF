// ===== Motor matemático: aleatorio con semilla, fracciones, raíces, HTML de fórmulas, lector de respuestas =====
const MINUS = '−';
const SUB = ' − ';
const ADD = ' + ';

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
class Rng {
  constructor(seed) { this.r = mulberry32(seed >>> 0); }
  f() { return this.r(); }
  int(a, b) { return a + Math.floor(this.r() * (b - a + 1)); }
  nz(a, b) { let x; do { x = this.int(a, b); } while (x === 0); return x; }
  pick(arr) { return arr[Math.floor(this.r() * arr.length)]; }
  shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  sign() { return this.r() < 0.5 ? -1 : 1; }
  chance(p) { return this.r() < p; }
}

function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }

class Fr {
  constructor(n, d = 1) {
    if (!Number.isInteger(n) || !Number.isInteger(d)) throw new Error('Fr no entera ' + n + '/' + d);
    if (d === 0) throw new Error('Fr entre 0');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    this.n = n / g; this.d = d / g;
    if (this.n === 0) { this.n = 0; this.d = 1; }
  }
  static of(x) { return x instanceof Fr ? x : new Fr(x, 1); }
  add(o) { o = Fr.of(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Fr.of(o); return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Fr.of(o); return new Fr(this.n * o.n, this.d * o.d); }
  div(o) { o = Fr.of(o); return new Fr(this.n * o.d, this.d * o.n); }
  neg() { return new Fr(-this.n, this.d); }
  abs() { return new Fr(Math.abs(this.n), this.d); }
  get v() { return this.n / this.d; }
  isInt() { return this.d === 1; }
}

function sqrtParts(n) { let k = 1, m = n; for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return [k, m]; }
// c·√r con r libre de cuadrados
class Surd {
  constructor(c, r) {
    c = Fr.of(c);
    if (r === 0 || c.n === 0) { this.c = new Fr(0); this.r = 1; return; }
    const [k, m] = sqrtParts(r);
    this.c = c.mul(k); this.r = m;
  }
  get v() { return this.c.v * Math.sqrt(this.r); }
}
const sqrtInt = n => new Surd(1, n);
const sqrtFr = f => { f = Fr.of(f); return new Surd(new Fr(1, f.d), f.n * f.d); };
// x / √P, racionalizado
const divSqrt = (x, P) => { x = Fr.of(x); const s = new Surd(1, P); return new Surd(x.div(s.c.n * s.r), s.r); };
const val = x => (typeof x === 'number' ? x : x.v);

// ---------- HTML de fórmulas ----------
const SR = s => `<span class="sr">${s}</span>`;
const sInt = n => (n < 0 ? MINUS + Math.abs(n) : String(n));
function dec(x, p = 2) { const s = (Math.round(x * 10 ** p) / 10 ** p).toString().replace('.', ','); return s[0] === '-' ? MINUS + s.slice(1) : s; }
const Fh = (n, d, cx) => `<span class="fr"><span class="fr-n">${cx ? SR('(') : ''}${n}${cx ? SR(')') : ''}</span>${SR('/')}<span class="fr-d">${d}</span></span>`;
const Sq = (x, cx) => `<span class="sq">√<span class="sq-in">${cx ? SR('(') : ''}${x}${cx ? SR(')') : ''}</span></span>`;
function hFr(f) { f = Fr.of(f); if (f.d === 1) return sInt(f.n); return (f.n < 0 ? MINUS : '') + Fh(String(Math.abs(f.n)), String(f.d)); }
function hSurd(s) {
  if (s.r === 1) return hFr(s.c);
  const an = Math.abs(s.c.n);
  const top = (an === 1 ? '' : an) + Sq(s.r);
  return (s.c.n < 0 ? MINUS : '') + (s.c.d === 1 ? top : Fh(top, s.c.d));
}
function N(x) {
  if (x instanceof Surd) return hSurd(x);
  if (x instanceof Fr) return hFr(x);
  if (Number.isInteger(x)) return sInt(x);
  return dec(x);
}
const P = x => (val(x) < 0 ? '(' + N(x) + ')' : N(x));
const M = s => `<span class="m">${s}</span>`;
const Vh = a => `[${a.map(N).join(', ')}]`;
const Ph = a => `(${a.map(N).join(', ')})`;
const bv = s => `<b class="bv">${s}</b>`;
const ar = s => `<span class="ar">${s}</span>`;
const iv = s => `<i>${s}</i>`;
const sub = (s, k) => `${s}<sub>${k}</sub>`;
const Bu = bv('u'), Bv = bv('v'), Bw = bv('w'), Bn = bv('n'), Bd = bv('d'), Ba = bv('a'), Bb = bv('b'), Bx = bv('x'), Bp = bv('p'), Bq = bv('q');

// a·x + b·y + c·z (= rhs)
function Lin(co, rhs, vars = ['x', 'y', 'z']) {
  let s = '';
  co.forEach((c0, i) => {
    const c = Fr.of(c0); if (c.n === 0) return;
    const a = c.abs();
    const t = (a.n === 1 && a.d === 1 ? '' : hFr(a)) + iv(vars[i]);
    s += s === '' ? (c.n < 0 ? MINUS : '') + t : (c.n < 0 ? SUB : ADD) + t;
  });
  if (s === '') s = '0';
  return rhs === undefined ? s : s + ' = ' + N(rhs);
}
// c0 + c1·t + ...
function Aff(c0, terms) {
  c0 = Fr.of(c0);
  let s = c0.n !== 0 ? hFr(c0) : '';
  for (const [c1, v] of terms) {
    const c = Fr.of(c1); if (c.n === 0) continue;
    const a = c.abs();
    const t = (a.n === 1 && a.d === 1 ? '' : hFr(a)) + iv(v);
    s += s === '' ? (c.n < 0 ? MINUS : '') + t : (c.n < 0 ? SUB : ADD) + t;
  }
  return s === '' ? '0' : s;
}
const Sys = lines => `<span class="sys">${SR('{ ')}<span class="sys-l">${lines.map(l => `<span>${l}</span>`).join(SR('; '))}</span>${SR(' }')}</span>`;
function Mat(rows, aug = true) {
  const n = rows[0].length;
  const body = rows.map((r, i) => '<tr>' + r.map((x, j) => {
    const sep = j < n - 1 ? SR(aug && j === n - 2 ? ' | ' : ' ') : (i < rows.length - 1 ? SR('; ') : '');
    return `<td${aug && j === n - 1 ? ' class="rhs"' : ''}>${N(x)}${sep}</td>`;
  }).join('') + '</tr>').join('');
  return `<span class="mat${aug ? ' aug' : ''}">${SR('[')}<table><tbody>${body}</tbody></table>${SR(']')}</span>`;
}
// suma de términos numéricos con signos: 2 − 3 + 5
const negx = t => (t instanceof Fr ? t.neg() : t instanceof Surd ? new Surd(t.c.neg(), t.r) : -t);
function sumTerms(ts) { return ts.map((t, i) => (i === 0 ? N(t) : (val(t) < 0 ? SUB + N(negx(t)) : ADD + N(t)))).join(''); }
function dotExpand(u, v) { return u.map((x, i) => P(x) + '·' + P(v[i])).join(ADD); }
function sqSum(u) { return u.map(x => P(x) + '²').join(ADD); }
function sqVals(u) { return u.map(x => N(Fr.of(x).mul(Fr.of(x)))).join(ADD); }

// ---------- vectores ----------
const vadd = (a, b) => a.map((x, i) => x + b[i]);
const vsub = (a, b) => a.map((x, i) => x - b[i]);
const vsc = (k, a) => a.map(x => k * x);
const vdot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const vn2 = a => vdot(a, a);
const vgcd = a => a.reduce((g, x) => gcd(g, x), 0) || 1;
const vred = a => { const g = vgcd(a); const s = (a.find(x => x !== 0) || 1) < 0 ? -1 : 1; return a.map(x => (x / g) * s); };
const vzero = a => a.every(x => x === 0);
// con fracciones
const F = x => Fr.of(x);
const fsub = (a, b) => a.map((x, i) => F(x).sub(F(b[i])));
const fadd = (a, b) => a.map((x, i) => F(x).add(F(b[i])));
const fsc = (k, a) => a.map(x => F(k).mul(F(x)));
const fdot = (a, b) => a.reduce((s, x, i) => s.add(F(x).mul(F(b[i]))), new Fr(0));
const fv = a => a.map(val);

// ---------- comprobación de respuestas ----------
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
function isParallel(u, v) {
  if (!u.some(x => Math.abs(x) > 1e-9)) return false;
  const sc = Math.max(1, ...u.map(Math.abs), ...v.map(Math.abs));
  for (let i = 0; i < u.length; i++) for (let j = i + 1; j < u.length; j++)
    if (Math.abs(u[i] * v[j] - u[j] * v[i]) > 1e-6 * sc * sc) return false;
  return true;
}
function onLine(p, p0, d) { const w = p.map((x, i) => x - val(p0[i])); if (w.every(x => Math.abs(x) < 1e-9)) return true; return isParallel(w, d.map(val)); }
function satisfies(pt, co, rhs) { return near(pt.reduce((s, x, i) => s + x * val(co[i]), 0), val(rhs)); }
function propEq(user, ref, nCoef) {
  if (!user.slice(0, nCoef).some(x => Math.abs(x) > 1e-9)) return false;
  return isParallel(user, ref.map(val));
}

// Lee lo que escribe el alumno: 3/2, −1,5, 2√3, √2/2, 1/√2, (1+√5)/2
function parseNum(str) {
  const s = String(str).replace(/\s+/g, '').replace(/−/g, '-').replace(/,/g, '.').replace(/[·×*]/g, '*').replace(/sqrt|raiz|r/gi, '√').replace(/÷|:/g, '/');
  let i = 0;
  const peek = () => s[i];
  function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const op = s[i++]; const t = term(); v = op === '+' ? v + t : v - t; } return v; }
  function term() {
    let v = unary();
    for (;;) {
      const c = peek();
      if (c === '*') { i++; v *= unary(); }
      else if (c === '/') { i++; v /= unary(); }
      else if (c !== undefined && /[0-9√(]/.test(c)) { v *= unary(); }
      else break;
    }
    return v;
  }
  function unary() { if (peek() === '-') { i++; return -unary(); } if (peek() === '+') { i++; return unary(); } return atom(); }
  function atom() {
    const c = peek();
    if (c === '√') { i++; return Math.sqrt(atom()); }
    if (c === '(') { i++; const v = expr(); if (peek() !== ')') throw new Error('par'); i++; return v; }
    const m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
    if (!m) throw new Error('num');
    i += m[0].length;
    return parseFloat(m[0]);
  }
  try { if (!s) return NaN; const v = expr(); if (i !== s.length || !Number.isFinite(v)) return NaN; return v; } catch (e) { return NaN; }
}
