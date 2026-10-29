// ===== Generadores de ejercicios · Partes I y II (herramientas y vectores) =====
const G = {};
function gen(id, lesson, make, opt = {}) { G[id] = Object.assign({ id, lesson, make }, opt); }

// formularios de huecos: números = hueco, cadenas = texto entre huecos
const fV = n => { const f = ['[']; for (let i = 0; i < n; i++) f.push(i, i < n - 1 ? ', ' : ']'); return f; };
const fP = n => { const f = ['(']; for (let i = 0; i < n; i++) f.push(i, i < n - 1 ? ', ' : ')'); return f; };
const fEq = (vars, lead) => { const f = lead ? [lead] : []; vars.forEach((v, i) => f.push(i, M(iv(v)) + (i < vars.length - 1 ? ' + ' : ' = '))); f.push(vars.length); return f; };
const fLine = n => {
  const L = (n === 2 ? ['x', 'y'] : ['x', 'y', 'z']).map(iv).join(', ');
  const f = [M('[' + L + '] = [')];
  for (let i = 0; i < n; i++) f.push(i, i < n - 1 ? ', ' : M('] + ' + iv('t') + '['));
  for (let i = 0; i < n; i++) f.push(n + i, i < n - 1 ? ', ' : ']');
  return f;
};
const rv = (r, n, lo = -4, hi = 4) => Array.from({ length: n }, () => r.int(lo, hi));
const rvnz = (r, n, lo = -4, hi = 4) => { let v; do v = rv(r, n, lo, hi); while (vzero(v)); return v; };
const rvAllNz = (r, n, lo = -4, hi = 4) => Array.from({ length: n }, () => r.nz(lo, hi));
function rootH(n2) { const s = sqrtInt(n2); return Sq(n2) + (s.r === n2 && n2 > 1 && s.c.n === 1 && s.c.d === 1 ? '' : ' = ' + N(s)); }
function rootFrH(f) { f = Fr.of(f); if (f.d === 1) return rootH(f.n); const s = sqrtFr(f); return Sq(hFr(f)) + ' = ' + N(s); }
function CombH(cs, names) {
  let s = '';
  cs.forEach((c0, i) => {
    const c = Fr.of(c0); if (c.n === 0) return;
    const a = c.abs();
    const t = (a.n === 1 && a.d === 1 ? '' : hFr(a)) + names[i];
    s += s === '' ? (c.n < 0 ? MINUS : '') + t : (c.n < 0 ? SUB : ADD) + t;
  });
  return s === '' ? bv('0') : s;
}
const proyH = (a, b) => `proy<sub>${a}</sub>(${b})`;
const ynMC = (q, yes, sol, extra = {}) => Object.assign({ type: 'mc', keep: true, q, opts: ['Sí', 'No'], correct: yes ? 0 : 1, sol }, extra);
const QUADS = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15]];
const TRIPS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17]];
function niceVec(r, n) {
  const t = n === 2 ? r.pick(TRIPS) : r.pick(QUADS);
  return { v: r.shuffle(t.slice(0, n)).map(x => x * r.sign()), len: t[n] };
}
const rf = (n, d) => (n < 0 ? MINUS : '') + Fh(Math.abs(n), d);

// ===== L1 · Signos, fracciones y raíces =====
gen('l1.signos', 'L1', r => {
  const v = r.int(0, 3);
  if (v === 0) {
    const a = r.int(-9, 9), b = r.int(1, 9);
    return { type: 'num', q: `Calcula ${M(N(a) + SUB + '(' + N(-b) + ')')}.`, ans: a + b,
      sol: [[M(`${N(a)}${SUB}(${N(-b)}) = ${N(a)}${ADD}${b} = ${N(a + b)}`), 'Restar un número negativo es lo mismo que sumarlo: los dos signos menos juntos se convierten en un más.']] };
  }
  if (v === 1) {
    const k = r.int(2, 5), a = r.int(1, 9); let b; do b = r.int(1, 9); while (b === a);
    const res = -k * a + k * b;
    return { type: 'num', q: `Calcula ${M(MINUS + k + '(' + a + SUB + b + ')')}.`, ans: res,
      sol: [[M(`(${MINUS}${k})·${a} = ${N(-k * a)}  y  (${MINUS}${k})·(${MINUS}${b}) = ${N(k * b)}`), 'El número de delante multiplica a cada cosa de dentro, con su signo.'],
        [M(`${N(-k * a)}${ADD}${N(k * b)} = ${N(res)}`), 'Y se suman los dos resultados.']] };
  }
  if (v === 2) {
    const a = r.int(2, 12);
    return { type: 'num', q: `Calcula ${M('(' + MINUS + a + ')²')}.`, ans: a * a,
      sol: [[M(`(${MINUS}${a})·(${MINUS}${a}) = ${a * a}`), 'Al elevar al cuadrado, el número se multiplica por sí mismo con su signo. Menos por menos es más: siempre sale positivo.']] };
  }
  const a = r.int(1, 9); let b; do b = r.int(1, 9); while (b === a);
  return { type: 'num', q: `Calcula ${M(MINUS + '(' + b + SUB + a + ')')}.`, ans: a - b,
    sol: [[M(`${MINUS}(${b}${SUB}${a}) = ${MINUS}${b}${ADD}${a} = ${N(a - b)}`), 'Un menos delante de un paréntesis cambia el signo de todo lo de dentro.']] };
});

gen('l1.fracsuma', 'L1', r => {
  const b = r.pick([2, 3, 4, 5, 6]); let d; do d = r.pick([2, 3, 4, 5, 6]); while (d === b);
  const a = r.nz(-5, 5), c = r.int(1, 5);
  const L = lcm(b, d), A = a * (L / b), C = c * (L / d), res = new Fr(a, b).add(new Fr(c, d));
  const sol = [
    [M(`${rf(a, b)} = ${rf(A, L)},  ${rf(c, d)} = ${rf(C, L)}`), `Se pasan las dos al mismo denominador: ${L} se puede dividir entre ${b} y entre ${d}.`],
    [M(`${rf(A, L)}${ADD}${rf(C, L)} = ${rf(A + C, L)}`), 'Con el mismo denominador, se suman los de arriba y se deja el de abajo.'],
  ];
  if (res.d !== L || res.n !== A + C) sol.push([M(`${rf(A + C, L)} = ${N(res)}`), 'Y se simplifica.']);
  return { type: 'num', q: `Calcula ${M(rf(a, b) + ADD + rf(c, d))}. Puedes dar el resultado como fracción, por ejemplo 7/6.`, ans: res, sol };
});

gen('l1.fracdiv', 'L1', r => {
  const c = r.int(2, 7); let d; do d = r.int(2, 7); while (d === c);
  const p = r.int(2, 12), res = new Fr(p * d, c);
  const sol = [[M(`${p} : ${Fh(c, d)} = ${p}·${Fh(d, c)}`), 'Dividir entre una fracción es multiplicar por esa fracción dada la vuelta.'],
    [M(`= ${Fh(p * d, c)}` + (res.d !== c || res.n !== p * d ? ' = ' + N(res) : '')), 'Arriba por arriba y abajo por abajo. Después se simplifica.']];
  return { type: 'num', q: `Calcula ${M(p + ' : ' + Fh(c, d))}.`, ans: res, sol };
});

gen('l1.raiz', 'L1', r => {
  let k, m; do { k = r.int(2, 9); m = r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]); } while (k * k * m > 700);
  const n = k * k * m, c = r.pick([1, 1, 1, 2, 3]);
  const o = (a, b) => M((a === 1 ? '' : a) + Sq(b));
  const opts = [o(c * k, m)], seen = new Set(opts);
  for (const x of [o(c * m, k), o(c * k * k, m), o(c * k, k * m), o(k, m), o(c + k, m), o(c * k, m * k * k)]) if (opts.length < 4 && !seen.has(x)) { seen.add(x); opts.push(x); }
  const sol = [[M(`${n} = ${k * k}·${m}`), `${k * k} es un cuadrado (${k}²) que divide a ${n}.`],
    [M(`${Sq(n)} = ${Sq(k * k)}·${Sq(m)} = ${k}${Sq(m)}`), `La raíz de ${k * k} es ${k} y sale fuera. El ${m} no tiene raíz exacta y se queda dentro.`]];
  if (c > 1) sol.push([M(`${c}·${k}${Sq(m)} = ${c * k}${Sq(m)}`), `Y el ${c} que ya estaba fuera multiplica al ${k}.`]);
  return { type: 'mc', q: `Simplifica ${M((c === 1 ? '' : c) + Sq(n))}.`, opts, correct: 0, sol };
});

gen('l1.racio', 'L1', r => {
  const m = r.pick([2, 3, 5, 6, 7, 10, 11]), b = r.int(1, 5), a = r.int(1, 12);
  const bS = (b === 1 ? '' : b) + Sq(m);
  const correct = new Surd(new Fr(a, b * m), m);
  const opts = [correct, new Surd(new Fr(a, b), m), new Fr(a, b * m), new Surd(new Fr(a, b * m * m), m)].map(x => M(N(x)));
  const sol = [[M(`${Fh(a, bS)} = ${Fh(a + '·' + Sq(m), bS + '·' + Sq(m))}`), `Multiplico arriba y abajo por ${'√' + m}: es como multiplicar por 1, la fracción no cambia de valor.`],
    [M(`= ${Fh((a === 1 ? '' : a) + Sq(m), b * m)}`), `Abajo, √${m}·√${m} = ${m}: la raíz ha desaparecido.`]];
  if (N(correct) !== Fh((a === 1 ? '' : a) + Sq(m), b * m)) sol.push([M('= ' + N(correct)), 'Y se simplifica.']);
  return { type: 'mc', q: `Racionaliza ${M(Fh(a, bS))}.`, opts, correct: 0, sol };
});

// Cada plantilla elige números nuevos y decide al azar si la afirmación es verdadera o falsa.
const SQS = [4, 9, 16, 25, 36, 49, 64, 81, 100];
const TF_L1 = [
  r => { const [p, q] = r.shuffle(SQS).slice(0, 2), sp = Math.sqrt(p), sq = Math.sqrt(q), s = Math.sqrt(p + q), sum = r.chance(0.6);
    if (sum) return [M(Sq(p + ' + ' + q, true) + ' = ' + Sq(p) + ADD + Sq(q)), false, `Primero se hace lo de dentro: √${p + q}${Number.isInteger(s) ? ' = ' + s : ''}. En cambio √${p} + √${q} = ${sp} + ${sq} = ${sp + sq}. La raíz de una suma no se separa nunca.`];
    return [M(Sq(p + '·' + q, true) + ' = ' + Sq(p) + '·' + Sq(q)), true, `Con un producto sí se puede separar: √${p * q} = ${Math.sqrt(p * q)} y ${sp}·${sq} = ${sp * sq}.`]; },
  r => { const k = r.int(2, 12), ok = r.chance(0.5);
    return [M(`(${MINUS}${k})² = ${ok ? k * k : MINUS + k * k}`), ok, `Menos por menos es más: (−${k})·(−${k}) = ${k * k}. Al cuadrado siempre sale positivo.`]; },
  r => { const c = r.int(2, 7), m = r.pick([2, 3, 5, 6, 7]), ok = r.chance(0.5), inn = ok ? c * c * m : c * m;
    return [M(`${c}${Sq(m)} = ${Sq(inn)}`), ok, `Si elevas ${c}√${m} al cuadrado sale ${c * c}·${m} = ${c * c * m}: ${c}√${m} es √${c * c * m}.${ok ? '' : ' Al meter el ' + c + ' dentro de la raíz entra al cuadrado.'}`]; },
  r => { const a = r.int(1, 6), m = r.pick([2, 3, 5, 6, 7]), ok = r.chance(0.5), right = ok ? Fh((a === 1 ? '' : a) + Sq(m), m) : (a === 1 ? '' : a) + Sq(m);
    return [M(`${Fh(a, Sq(m))} = ${right}`), ok, `Al racionalizar se multiplica arriba y abajo por √${m}: ${a}/√${m} = ${a === 1 ? '' : a}√${m}/${m}.${ok ? ' Es el mismo número escrito de otra forma.' : ' Se te ha olvidado el ' + m + ' de abajo.'}`]; },
  r => { const [x, y] = r.pick([['a', 'b'], ['x', 'y'], ['p', 'q'], ['m', 'n']]), ok = r.chance(0.5);
    return [M(`${MINUS}(${iv(y)}${SUB}${iv(x)}) = ${MINUS}${iv(y)}${ok ? ADD : SUB}${iv(x)}`), ok, `El menos cambia el signo de todo lo de dentro: −(${y} − ${x}) = −${y} + ${x}.`]; },
  r => { const p = r.int(1, 9), q = r.int(1, 9), ok = r.chance(0.5);
    return [M(`${p}${SUB}(${MINUS}${q}) = ${N(ok ? p + q : p - q)}`), ok, `Restar −${q} es sumar ${q}: ${p} − (−${q}) = ${p} + ${q} = ${p + q}.`]; },
  r => { const k = r.int(2, 6), a = r.int(1, 9); let b; do b = r.int(1, 9); while (b === a); const ok = r.chance(0.5);
    return [M(`${MINUS}${k}(${a}${SUB}${b}) = ${N(-k * a)}${ok ? ADD : SUB}${k * b}`), ok, `El −${k} multiplica a cada cosa con su signo: (−${k})·${a} = ${N(-k * a)} y (−${k})·(−${b}) = +${k * b}. Sale ${N(-k * a)} + ${k * b} = ${N(k * b - k * a)}.`]; },
];
gen('l1.tf', 'L1', r => {
  const [s, c, why] = r.pick(TF_L1)(r);
  return { type: 'tf', q: s, correct: c, sol: [[c ? 'Verdadero' : 'Falso', why]] };
});

gen('l1.despeja', 'L1', r => {
  const a = r.nz(-5, 5), b = r.pick([2, 3, 4, 5, -2, -3]), c = r.nz(-9, 9), s = b < 0 ? -1 : 1, D = Math.abs(b);
  const opt = (k0, k1, d) => M(iv('y') + ' = ' + (d === 1 ? Aff(k0, [[k1, 'x']]) : Fh(Aff(k0, [[k1, 'x']]), d, true)));
  const opts = [opt(s * c, -s * a, D), opt(s * c, s * a, D), opt(-s * c, s * a, D), opt(c - b, -a, 1)];
  const sol = [[M(`${N(b)}${iv('y')} = ${Aff(c, [[-a, 'x']])}`), `El término con ${iv('x')} pasa al otro lado con el signo cambiado.`],
    [M(`${iv('y')} = ${Fh(Aff(c, [[-a, 'x']]), N(b), true)}`), `El ${N(b)} multiplica a la ${iv('y')}: pasa dividiendo, con su signo.`]];
  if (b < 0) sol.push([opts[0], 'Cambiando el signo arriba y abajo, el denominador queda positivo.']);
  return { type: 'mc', q: `Despeja ${M(iv('y'))} en ${M(Lin([a, b], c, ['x', 'y']))}.`, opts, correct: 0, sol };
});

// ===== L2 · Pitágoras y el coseno =====
gen('l2.dist0', 'L2', r => {
  let p, ans;
  if (r.chance(0.7)) { const n = r.pick([2, 3, 3]); const nv = niceVec(r, n); p = nv.v; ans = nv.len; }
  else { p = rvnz(r, 3, -4, 4); ans = sqrtInt(vn2(p)); }
  const n2 = vn2(p);
  return { type: 'num', q: `¿A qué distancia del origen está el punto ${M(Ph(p))}?`, pre: M(iv('d') + ' ='), ans,
    sol: [[M(`${iv('d')} = ${Sq(sqSum(p), true)}`), 'Pitágoras: las coordenadas son los catetos. En 3D se suma un cuadrado más.'],
      [M(`= ${Sq(sqVals(p), true)} = ${rootH(n2)}`), 'Los cuadrados siempre son positivos. Primero se suma y después se hace la raíz.']] };
});

const COS_TAB = [[30, () => new Surd(new Fr(1, 2), 3)], [45, () => new Surd(new Fr(1, 2), 2)], [60, () => new Fr(1, 2)], [90, () => 0],
  [120, () => new Fr(-1, 2)], [135, () => new Surd(new Fr(-1, 2), 2)], [150, () => new Surd(new Fr(-1, 2), 3)]];
const cosOf = deg => { const e = COS_TAB.find(x => x[0] === deg); return e ? e[1]() : deg === 0 ? 1 : -1; };
gen('l2.cosang', 'L2', r => {
  const [ang, f] = r.pick(COS_TAB);
  let cosH = N(f());
  if ((ang === 45 || ang === 135) && r.chance(0.4)) cosH = (ang > 90 ? MINUS : '') + Fh(1, Sq(2));
  let opts = ang === 90 ? [90, 0, 180, 45] : [ang, 180 - ang];
  const pool = r.shuffle([30, 45, 60, 90, 120, 135, 150].filter(x => !opts.includes(x)));
  while (opts.length < 4) opts.push(pool.shift());
  const base = ang > 90 ? 180 - ang : ang;
  const sol = ang === 90 ? [[M('cos 90° = 0'), 'Coseno cero: ángulo recto.']]
    : ang < 90 ? [[M(`cos ${ang}° = ${N(f())}`), 'El coseno es positivo, así que el ángulo es agudo. En la tabla, ese coseno es de ' + ang + '°.']]
      : [[M(`cos ${base}° = ${N(cosOf(base))}`), `El signo es negativo: el ángulo es obtuso. Sin el signo, la tabla da ${base}°.`],
        [M(`${iv('φ')} = 180°${SUB}${base}° = ${ang}°`), 'Como era negativo, se resta a 180°.']];
  return { type: 'mc', q: `¿Qué ángulo tiene ${M('cos ' + iv('φ') + ' = ' + cosH)}?`, opts: opts.map(a => M(a + '°')), correct: 0, sol };
});

gen('l2.signo', 'L2', r => {
  const c = r.chance(0.15) ? 0 : r.sign() * r.int(1, 99) / 100;
  const k = c > 0 ? 0 : c === 0 ? 1 : 2;
  return { type: 'mc', keep: true, q: `Si ${M('cos ' + iv('φ') + ' = ' + dec(c))}, ¿cómo es el ángulo?`, opts: ['Agudo (menos de 90°)', 'Recto (90°)', 'Obtuso (más de 90°)'], correct: k,
    sol: [[M('cos ' + iv('φ') + ' = ' + dec(c)), 'El coseno es la sombra horizontal de una flecha de longitud 1: positivo, agudo; cero, recto; negativo, obtuso.']] };
});

const RADS = [[45, Fh('π', 4)], [90, Fh('π', 2)], [60, Fh('π', 3)], [30, Fh('π', 6)], [180, 'π'], [120, Fh('2π', 3)], [135, Fh('3π', 4)], [150, Fh('5π', 6)]];
gen('l2.rad', 'L2', r => {
  const [deg, h] = r.pick(RADS), toRad = r.chance(0.5);
  const others = r.shuffle(RADS.filter(x => x[0] !== deg)).slice(0, 3), plain = h.replace(/<[^>]+>/g, '');
  const sol = [[M('π rad = 180°'), `Es la equivalencia clave. Así que ${plain} rad son ${deg}°.`]];
  if (toRad) return { type: 'mc', q: `¿Cuántos radianes son ${M(deg + '°')}?`, opts: [h, ...others.map(x => x[1])].map(x => M(x + ' rad')), correct: 0, sol };
  return { type: 'mc', q: `¿Cuántos grados son ${M(h + ' rad')}?`, opts: [deg, ...others.map(x => x[0])].map(a => M(a + '°')), correct: 0, sol };
});

// ===== L3 · Qué es un vector =====
function abItem(A, B, extra = {}) {
  const d = vsub(B, A), hasNeg = A.some(x => x < 0);
  return Object.assign({ type: 'vec', q: `Con ${M('A = ' + Ph(A))} y ${M('B = ' + Ph(B))}, calcula ${M(ar('AB'))}.`, form: fV(A.length), expect: d, ansH: M(ar('AB') + ' = ' + Vh(d)),
    sol: [[M(`${ar('AB')} = B${SUB}A = [${A.map((x, i) => N(B[i]) + SUB + P(x)).join(', ')}]`), 'Final menos inicial, coordenada a coordenada. Con paréntesis en los negativos.'],
      [M(`= ${Vh(d)}`), hasNeg ? 'Restar un negativo es sumar.' : 'Resultado.']] }, extra);
}
const twoPts = (r, n) => { const A = rv(r, n, -5, 5); let B; do B = rv(r, n, -5, 5); while (vzero(vsub(B, A))); return [A, B]; };
gen('l3.AB', 'L3', r => { const [A, B] = twoPts(r, r.pick([2, 3, 3])); return abItem(A, B); });
gen('l3.BA', 'L3', r => {
  const [A, B] = twoPts(r, r.pick([2, 3])), d = vsub(A, B);
  return { type: 'vec', q: `Con ${M('A = ' + Ph(A))} y ${M('B = ' + Ph(B))}, calcula ${M(ar('BA'))}. Fíjate en cuál es el punto de llegada.`, form: fV(A.length), expect: d, ansH: M(ar('BA') + ' = ' + Vh(d)),
    sol: [[M(`${ar('BA')} = A${SUB}B = [${B.map((x, i) => N(A[i]) + SUB + P(x)).join(', ')}] = ${Vh(d)}`), 'Ahora el vector sale de B y llega a A: final (A) menos inicial (B).'],
      [M(`${ar('BA')} = ${MINUS}${ar('AB')}`), 'Es el opuesto de AB: mide lo mismo, misma dirección, pero apunta al revés.']] };
});
gen('l3.B', 'L3', r => {
  const n = r.pick([2, 3]), A = rv(r, n, -5, 5), v = rvnz(r, n, -4, 4), B = vadd(A, v);
  return { type: 'vec', q: `El vector ${M(ar('AB') + ' = ' + Vh(v))} sale del punto ${M('A = ' + Ph(A))}. ¿Cuáles son las coordenadas de B?`, form: fP(n), expect: B, ansH: M('B = ' + Ph(B)),
    sol: [[M(`${ar('AB')} = B${SUB}A  ⟹  B = A${ADD}${ar('AB')}`), 'Si el vector es final menos inicial, el final es el inicio más el vector.'],
      [M(`B = (${A.map((x, i) => N(x) + ADD + P(v[i])).join(', ')}) = ${Ph(B)}`), 'Coordenada a coordenada.']] };
});
gen('l3.same', 'L3', r => {
  const [A, B] = twoPts(r, 2), d = vsub(B, A), C = rv(r, 2, -5, 5), same = r.chance(0.5);
  let D = vadd(C, d);
  if (!same) { const i = r.int(0, 1); D = D.slice(); D[i] += r.pick([-1, 1]); }
  const cd = vsub(D, C);
  return { type: 'tf', q: `Con ${M('A = ' + Ph(A))}, ${M('B = ' + Ph(B))}, ${M('C = ' + Ph(C))} y ${M('D = ' + Ph(D))}: ${M(ar('AB'))} y ${M(ar('CD'))} son el mismo vector.`, correct: same,
    sol: [[M(`${ar('AB')} = ${Vh(d)},  ${ar('CD')} = ${Vh(cd)}`), same ? 'Tienen las mismas componentes: son el mismo vector dibujado en otro sitio. La posición no importa.' : 'Las componentes no coinciden, así que no son el mismo vector.']] };
});
const MC_L3 = [
  ['¿Qué tres cosas definen un vector?', ['Dirección, sentido y módulo', 'Punto de inicio, punto final y color', 'Solo su longitud', 'Su posición en el plano'], 'Dos flechas con la misma dirección, sentido y módulo son el mismo vector, aunque estén en sitios distintos.'],
  ['Si calculas A − B en lugar de B − A, ¿qué obtienes?', ['El vector opuesto: mismo módulo, apunta al revés', 'El mismo vector', 'Un vector perpendicular', 'El vector cero'], 'En los ejercicios eso es un error: fíjate bien en cuál es el punto de llegada.'],
  ['¿Importa dónde esté dibujada la flecha de un vector?', ['No, por eso todos se dibujan saliendo del origen', 'Sí, cambia el vector', 'Solo en el espacio', 'Solo si es unitario'], 'Lo que define un vector es su dirección, sentido y módulo. Por eso en álgebra lineal se anclan en el origen.'],
];
gen('l3.concept', 'L3', r => { const [q, opts, why] = r.pick(MC_L3); return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });

// ===== L4 · Suma, resta y producto por un número =====
const coefName = (c, name) => (c === 1 ? '' : c === -1 ? MINUS : N(c)) + name;
const comb2H = (a, b) => coefName(a, Bu) + (b < 0 ? SUB + (b === -1 ? '' : N(-b)) : ADD + (b === 1 ? '' : N(b))) + Bv;
gen('l4.comb', 'L4', r => {
  const u = rvnz(r, 3, -5, 5), v = rvnz(r, 3, -5, 5), a = r.nz(-3, 3), b = r.nz(-3, 3);
  const au = vsc(a, u), bw = vsc(b, v), res = vadd(au, bw);
  return { type: 'vec', q: `Con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}, calcula ${M(comb2H(a, b))}.`, form: fV(3), expect: res, ansH: M(Vh(res)),
    sol: [[M(`${coefName(a, Bu)} = ${Vh(au)}`), `Primero cada producto por número: el ${sInt(a)} multiplica a las tres componentes con su signo.`],
      [M(`${coefName(b, Bv)} = ${Vh(bw)}`), b < 0 ? 'Fíjate en que el número va con su signo menos.' : 'Igual con el segundo.'],
      [M(`[${au.map((x, i) => N(x) + (bw[i] < 0 ? SUB + N(-bw[i]) : ADD + N(bw[i]))).join(', ')}] = ${Vh(res)}`), 'Luego se suma componente a componente.']] };
});
gen('l4.par', 'L4', r => {
  const n = r.pick([2, 3]); const base = rvAllNz(r, n, -3, 3);
  const p = r.pick([1, 2, -1]); let q; do q = r.pick([2, 3, -2, -1, 1, -3]); while (q === p);
  const u = vsc(p, base); let v = vsc(q, base); const par = r.chance(0.5);
  if (!par) { v = v.slice(); v[r.int(0, n - 1)] += r.pick([-1, 1]); }
  const k = new Fr(q, p);
  let sol;
  if (par) sol = [[M(`${Bv} = ${N(k)}·${Bu}`), 'Las componentes son proporcionales: cada una de v es la de u multiplicada por el mismo número. Son paralelos.']];
  else {
    let i = 0, j = 1;
    outer: for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (u[i] * v[j] !== u[j] * v[i]) break outer;
    sol = [[M(`${P(u[i])}·${P(v[j])} = ${N(u[i] * v[j])}  pero  ${P(u[j])}·${P(v[i])} = ${N(u[j] * v[i])}`), 'Si fueran proporcionales, al multiplicar en cruz dos parejas de componentes saldría lo mismo. No sale: no son paralelos.']];
  }
  return { type: 'tf', q: `${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))} son paralelos.`, correct: par, sol };
});
gen('l4.k', 'L4', r => {
  const n = 3, w = rvAllNz(r, n, -3, 3), lam = r.pick([2, 3, -2, -1, -3]), i = r.int(1, 2), k = lam * w[i];
  const u = vsc(lam, w), uH = '[' + u.map((x, j) => (j === i ? iv('k') : N(x))).join(', ') + ']';
  return { type: 'num', q: `¿Qué valor de ${M(iv('k'))} hace que ${M(Bu + ' = ' + uH)} y ${M(Bv + ' = ' + Vh(w))} sean paralelos?`, pre: M(iv('k') + ' ='), ans: k,
    sol: [[M(`${N(u[0])} = ${N(lam)}·${P(w[0])}`), `Para pasar de v a u en la primera componente se multiplica por ${sInt(lam)}.`],
      [M(`${iv('k')} = ${N(lam)}·${P(w[i])} = ${N(k)}`), 'Para que sean paralelos, todas las componentes van con el mismo número.']] };
});
const MC_L4 = [
  ['¿Qué le pasa a un vector al multiplicarlo por −2?', ['Mide el doble y apunta al revés', 'Gira 90°', 'Mide la mitad y apunta al revés', 'Mide el doble y apunta igual'], 'Un número negativo, además de estirar o encoger, da la vuelta a la flecha.'],
  ['¿Y al multiplicarlo por 1/2?', ['Mide la mitad y apunta igual', 'Mide la mitad y apunta al revés', 'Gira 45°', 'No cambia nada'], 'Entre 0 y 1 se encoge, sin cambiar el sentido.'],
  ['¿Qué no puede hacer nunca multiplicar un vector por un número?', ['Girarlo', 'Estirarlo', 'Encogerlo', 'Darle la vuelta'], 'Por eso dos vectores son paralelos cuando uno es un número por el otro.'],
  ['¿Por qué u + v = v + u pero u − v ≠ v − u?', ['Porque v − u es el camino al revés: −(u − v)', 'Porque la resta no está definida', 'Porque u − v siempre es cero', 'Sí son iguales'], 'Sumar es recorrer los dos en cualquier orden; restar invierte el sentido.'],
];
gen('l4.esc', 'L4', r => { const [q, opts, why] = r.pick(MC_L4); return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });
gen('l4.spot', 'L4', r => {
  let u, v; do { u = rvnz(r, 3, -5, 5); v = rvnz(r, 3, -5, 5); } while (!v.some(x => x < 0));
  const a = r.pick([2, 3]), b = r.pick([2, 3]);
  const au = vsc(a, u), bw = vsc(b, v), res = vsub(au, bw);
  const i = v.findIndex(x => x < 0), errType = r.int(0, 1);
  let l1 = bw.slice(), lr = res.slice(), wrong, why;
  if (errType === 0) { l1[i] = -bw[i]; lr = vsub(au, l1); wrong = 1; why = `${b}·(${sInt(v[i])}) = ${sInt(bw[i])}, no ${sInt(-bw[i])}: el signo se ha perdido.`; }
  else { lr[i] = au[i] + bw[i]; wrong = 2; why = `En la componente ${i + 1}: ${sInt(au[i])} − (${sInt(bw[i])}) = ${sInt(res[i])}. Restar un negativo es sumar.`; }
  return { type: 'spot', q: `Esta resolución de ${M(a + Bu + SUB + b + Bv)} con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))} tiene un error. Toca la línea equivocada.`,
    lines: [M(`${a}${Bu} = ${Vh(au)}`), M(`${b}${Bv} = ${Vh(l1)}`), M(`${a}${Bu}${SUB}${b}${Bv} = ${Vh(lr)}`)], wrong,
    sol: [[M(`${a}${Bu}${SUB}${b}${Bv} = ${Vh(res)}`), why]] };
});

// ===== L5 · Vectores en función de otros (hexágono) =====
const HEX = { O: [0, 0], A: [1, 0], B: [0, 1], C: [-1, 1], D: [-1, 0], E: [0, -1], F: [1, -1] };
const HEXV = ['A', 'B', 'C', 'D', 'E', 'F'];
// Base girada: a = O→(vértice k), b = O→(vértice k+1). Las coordenadas de un vértice se leen girando la tabla HEX.
const hexBase = k => [HEXV[k], HEXV[(k + 1) % 6]];
const hexC = (k, V) => (V === 'O' ? [0, 0] : HEX[HEXV[(HEXV.indexOf(V) - k + 6) % 6]]);
function hexPair(r) { const ks = Object.keys(HEX); let X, Y; do { X = r.pick(ks); Y = r.pick(ks); } while (X === Y); return [X, Y]; }
function hexSol(X, Y, k = 0) {
  const c = vsub(hexC(k, Y), hexC(k, X)), ab = [Ba, Bb], [A0, B0] = hexBase(k);
  const rest = HEXV.filter(V => V !== A0 && V !== B0).map(V => `O${V} = ${CombH(hexC(k, V), ['a', 'b'])}`).join(', ');
  const know = `Desde el centro conoces la flecha a cada vértice: ${rest}.`;
  if (X === 'O') return [[M(`${ar('O' + Y)} = ${CombH(c, ab)}`), know]];
  if (Y === 'O') return [[M(`${ar(X + 'O')} = ${MINUS}${ar('O' + X)} = ${CombH(c, ab)}`), 'Recorrer una flecha al revés es ponerle un signo menos.']];
  return [[M(`${ar('O' + X)} = ${CombH(hexC(k, X), ab)},  ${ar('O' + Y)} = ${CombH(hexC(k, Y), ab)}`), know],
    [M(`${ar(X + Y)} = ${ar('O' + Y)}${SUB}${ar('O' + X)} = ${CombH(c, ab)}`), 'Camino por el centro: final menos inicial, escrito con vectores.']];
}
const hexQ = (X, Y, k = 0) => { const [A0, B0] = hexBase(k); return `En el hexágono regular de centro O, con ${M(Ba + ' = ' + ar('O' + A0))} y ${M(Bb + ' = ' + ar('O' + B0))}, expresa ${M(ar(X + Y))} en función de ${M(Ba)} y ${M(Bb)}.`; };
const hexK = r => (r.chance(0.4) ? 0 : r.int(1, 5));
gen('l5.hex', 'L5', r => {
  const [X, Y] = hexPair(r), k = hexK(r), c = vsub(hexC(k, Y), hexC(k, X));
  return { type: 'vec', fig: { k: 'hex', X, Y, base: k }, q: hexQ(X, Y, k) + ' Escribe 0 si no aparece y −1 si va con signo menos.',
    form: [M(ar(X + Y) + ' = '), 0, M(' ' + Ba + ADD), 1, M(' ' + Bb)], expect: c, ansH: M(ar(X + Y) + ' = ' + CombH(c, [Ba, Bb])), sol: hexSol(X, Y, k) };
});
gen('l5.hexmc', 'L5', r => {
  const [X, Y] = hexPair(r), k = hexK(r), c = vsub(hexC(k, Y), hexC(k, X));
  const cands = [[-c[0], -c[1]], [c[1], c[0]], [c[0], -c[1]], [-c[0], c[1]], [c[0] + 1, c[1]], [c[0], c[1] - 1]];
  const seen = new Set([c.join()]), opts = [c];
  for (const x of r.shuffle(cands)) { if (opts.length >= 4) break; if (!seen.has(x.join()) && !vzero(x)) { seen.add(x.join()); opts.push(x); } }
  return { type: 'mc', fig: { k: 'hex', X, Y, base: k }, q: hexQ(X, Y, k), opts: opts.map(x => M(ar(X + Y) + ' = ' + CombH(x, [Ba, Bb]))), correct: 0, sol: hexSol(X, Y, k) };
});
const MC_L5 = [
  ['Si para ir de A a C pasas por B, entonces…', [M(ar('AC') + ' = ' + ar('AB') + ADD + ar('BC')), M(ar('AC') + ' = ' + ar('AB') + SUB + ar('BC')), M(ar('AC') + ' = ' + ar('BC') + SUB + ar('AB')), M(ar('AC') + ' = ' + ar('AB') + '·' + ar('BC'))], 'Una flecha es igual a cualquier camino que vaya del mismo inicio al mismo final.'],
  ['Recorrer una flecha al revés es…', ['Ponerle un signo menos', 'Multiplicarla por 2', 'Dejarla igual', 'Girarla 90°'], M(ar('BA') + ' = ' + MINUS + ar('AB')) + '.'],
  ['¿Cómo sé qué camino elegir?', ['Cualquiera sirve; mejor uno con flechas que ya conozcas', 'Siempre el más corto', 'Siempre por el vértice A', 'Solo vale un camino'], 'Todos llevan al mismo resultado. Si dudas, pasa por el centro O.'],
];
gen('l5.camino', 'L5', r => { const [q, opts, why] = r.pick(MC_L5); return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });

// ===== L6 · Combinación lineal =====
function combItem(u, v, a, b, extra = {}) {
  const w = [0, 1].map(i => F(a).mul(u[i]).add(F(b).mul(v[i])));
  const sys = Sys([M(Lin([u[0], v[0]], w[0], ['a', 'b'])), M(Lin([u[1], v[1]], w[1], ['a', 'b']))]);
  return Object.assign({ type: 'vec', q: `Escribe ${M(Bw + ' = ' + Vh(w))} como combinación lineal de ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}.`,
    form: [M(Bw + ' = '), 0, M(' ' + Bu + ADD), 1, M(' ' + Bv)], expect: [a, b], ansH: M(Bw + ' = ' + CombH([a, b], [Bu, Bv])),
    sol: [[M(`${Vh(w)} = ${iv('a')}${Vh(u)}${ADD}${iv('b')}${Vh(v)}`), 'Escribo lo que busco, con a y b como incógnitas.'],
      [sys, 'Dos vectores son iguales si lo son sus componentes: primera con primera, segunda con segunda.'],
      [M(`${iv('a')} = ${N(a)},  ${iv('b')} = ${N(b)}`), 'Resuelvo el sistema: despeja una letra en la ecuación más sencilla y sustitúyela en la otra (o resta las ecuaciones).'],
      [M(`${N(a)}·${Vh(u)}${ADD}${P(b)}·${Vh(v)} = ${Vh(w)} ✓`), 'Comprobación: con tus números tiene que salir w.']] }, extra);
}
gen('l6.ab', 'L6', r => {
  let u, v; do { u = rvnz(r, 2, -3, 3); v = rvnz(r, 2, -3, 3); } while (u[0] * v[1] - u[1] * v[0] === 0);
  const a = r.nz(-3, 3); let b = new Fr(r.nz(-3, 3));
  if (r.chance(0.25)) { v = vsc(2, v); b = new Fr(r.pick([1, -1, 3]), 2); }
  return combItem(u, v, a, b);
});
gen('l6.check', 'L6', r => {
  const u = rvnz(r, 2, -4, 4), v = rvnz(r, 2, -4, 4), a = r.nz(-3, 3), b = r.nz(-3, 3), ok = r.chance(0.5);
  const real = vadd(vsc(a, u), vsc(b, v)); let w = real.slice();
  if (!ok) w[r.int(0, 1)] += r.pick([-2, -1, 1, 2]);
  return { type: 'tf', q: `Con ${M(Bu + ' = ' + Vh(u))}, ${M(Bv + ' = ' + Vh(v))} y ${M(Bw + ' = ' + Vh(w))}, se cumple ${M(Bw + ' = ' + comb2H(a, b))}.`, correct: ok,
    sol: [[M(`${comb2H(a, b)} = ${Vh(real)}`), ok ? 'Sale exactamente w: es esa combinación lineal.' : 'No sale w, así que esa combinación no es la buena.']] };
});
gen('l6.imp', 'L6', r => {
  const base = rvAllNz(r, 2, -3, 3), k = r.pick([2, -2, 3, -1]), u = base, v = vsc(k, base), w = vred([-base[1] * r.pick([1, 2]), base[0] * r.pick([1, 2])]);
  const fa = r.nz(-3, 3), fb = r.nz(-3, 3);
  return { type: 'mc', q: `¿Es ${M(Bw + ' = ' + Vh(w))} combinación lineal de ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}?`,
    opts: ['No: u y v son paralelos y w no está en su línea', `Sí: ${M(Bw + ' = ' + comb2H(fa, fb))}`, 'Sí: cualquier vector del plano lo es', 'Sí, con a = b = 1'], correct: 0,
    sol: [[M(`${Bv} = ${N(k)}·${Bu}`), 'u y v son paralelos: solo puedes moverte sobre una línea.'],
      [Sys([M(Lin([u[0], v[0]], w[0], ['a', 'b'])), M(Lin([u[1], v[1]], w[1], ['a', 'b']))]), `Las dos partes izquierdas son ${sInt(u[0])}·(a + ${sInt(k)}b) y ${sInt(u[1])}·(a + ${sInt(k)}b): la misma expresión a + ${sInt(k)}b tendría que valer dos cosas distintas. Imposible.`]] };
});
gen('l6.canon', 'L6', r => {
  const v = rvnz(r, 3, -5, 5), e = [sub(bv('e'), 1), sub(bv('e'), 2), sub(bv('e'), 3)];
  const alt = [[v[1], v[0], v[2]], [v[0], -v[1], v[2]], [1, 1, 1], [v[2], v[1], v[0]]].filter(x => x.join() !== v.join());
  const seen = new Set([v.join()]), opts = [v];
  for (const x of alt) { if (opts.length < 4 && !seen.has(x.join())) { seen.add(x.join()); opts.push(x); } }
  return { type: 'mc', q: `Con los vectores canónicos ${M(sub(bv('e'), 1) + ' = [1, 0, 0]')}, ${M(sub(bv('e'), 2) + ' = [0, 1, 0]')} y ${M(sub(bv('e'), 3) + ' = [0, 0, 1]')}, ¿cómo se escribe ${M(Vh(v))}?`,
    opts: opts.map(x => M(CombH(x, e))), correct: 0, sol: [[M(`${Vh(v)} = ${CombH(v, e)}`), 'Cualquier vector es combinación de los canónicos con sus propias componentes.']] };
});

// ===== L7 · Producto escalar =====
function dotItem(u, v, extra = {}) {
  const d = vdot(u, v), terms = u.map((x, i) => x * v[i]);
  return Object.assign({ type: 'num', q: `Calcula ${M(Bu + '·' + Bv)} con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}.`, pre: M(Bu + '·' + Bv + ' ='), ans: d,
    sol: [[M(`${Bu}·${Bv} = ${dotExpand(u, v)}`), 'Se multiplican las componentes que están en la misma posición.'],
      [M(`= ${sumTerms(terms)} = ${N(d)}`), 'Y se suman los resultados. Da un número, no un vector.']] }, extra);
}
gen('l7.dot2', 'L7', r => dotItem(rvnz(r, 2, -6, 6), rvnz(r, 2, -6, 6)));
gen('l7.dot3', 'L7', r => dotItem(rvnz(r, 3, -5, 5), rvnz(r, 3, -5, 5)));
gen('prof.e3', 'L7', () => dotItem([1, 2, -1], [-1, 0, -2], { tag: 'Ejercicio 3 del profesor' }), { sib: 'l7.dot3' });
gen('l7.sign', 'L7', r => {
  const u = rvnz(r, 3, -4, 4); let v = rvnz(r, 3, -4, 4);
  if (r.chance(0.3)) { const c = vcross(u, rvnz(r, 3, -2, 2)); if (!vzero(c)) v = vred(c); }
  const d = vdot(u, v), base = dotItem(u, v);
  return { type: 'chain', q: `${M(Bu + ' = ' + Vh(u))},  ${M(Bv + ' = ' + Vh(v))}`, steps: [
    { type: 'num', q: `Calcula ${M(Bu + '·' + Bv)}.`, pre: base.pre, ans: d, sol: base.sol },
    { type: 'mc', keep: true, q: '¿Qué ángulo forman?', opts: ['Agudo (menos de 90°)', 'Recto: son perpendiculares', 'Obtuso (más de 90°)'], correct: d > 0 ? 0 : d === 0 ? 1 : 2,
      sol: [[M(`${Bu}·${Bv} = ${N(d)}`), 'Positivo: apuntan más o menos hacia el mismo lado (agudo). Cero: perpendiculares. Negativo: hacia lados contrarios (obtuso).']] }] };
});
const MC_L7 = [
  ['¿Qué tipo de resultado da el producto escalar u·v?', ['Un número', 'Un vector', 'Un vector perpendicular a los dos', 'Una matriz'], 'Se multiplican por parejas y se suman: sale un número.'],
  ['¿Y qué da k·v (un número por un vector)?', ['Un vector', 'Un número', 'Cero', 'Un ángulo'], '2·[1, 3] = [2, 6]. Son operaciones distintas aunque las dos se llamen “producto”.'],
  ['Si u·v = 0, los vectores son…', ['Perpendiculares', 'Paralelos', 'Iguales', 'Opuestos'], 'El producto escalar cero es justo la condición de ortogonalidad.'],
  r => { const u = rvAllNz(r, 2, -5, 5), v = rvAllNz(r, 3, -5, 5), a = u[0] * v[0] + u[1] * v[1]; let b = a + u[1] * v[2]; if (b === a) b = a + r.pick([-3, 3]);
    return [`¿Se puede calcular ${M(Vh(u) + '·' + Vh(v))}?`, ['No: tienen distinto número de componentes', 'Sí, da ' + N(a), 'Sí, da ' + N(b), 'Sí, se rellena con ceros'], 'Los dos vectores tienen que tener el mismo número de componentes.']; },
];
gen('l7.tipo', 'L7', r => { const e = r.pick(MC_L7), [q, opts, why] = typeof e === 'function' ? e(r) : e; return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });
gen('l7.spot', 'L7', r => {
  let u, v, i;
  do { u = rvnz(r, 3, -4, 4); v = rvnz(r, 3, -4, 4); i = [0, 1, 2].find(k => u[k] < 0 && v[k] < 0); } while (i === undefined);
  const terms = u.map((x, k) => x * v[k]), wt = terms.slice(); wt[i] = -terms[i];
  const ws = wt.reduce((a, b) => a + b, 0), good = vdot(u, v);
  return { type: 'spot', q: `Esta resolución de ${M(Bu + '·' + Bv)} con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))} tiene un error. Toca la línea equivocada.`,
    lines: [M(`${Bu}·${Bv} = ${dotExpand(u, v)}`), M(`= ${sumTerms(wt)}`), M(`= ${N(ws)}`)], wrong: 1,
    sol: [[M(`${P(u[i])}·${P(v[i])} = ${N(terms[i])}`), `Menos por menos es más. El resultado bueno es ${sInt(good)}.`]] };
});

// ===== L8 · Módulo y vectores unitarios =====
function normItem(v, extra = {}) {
  const n2 = vn2(v);
  return Object.assign({ type: 'num', q: `Calcula el módulo de ${M(Bv + ' = ' + Vh(v))}.`, pre: M('‖' + Bv + '‖ ='), ans: sqrtInt(n2),
    sol: [[M(`‖${Bv}‖ = ${Sq(sqSum(v), true)}`), 'Pitágoras: las componentes son los catetos. Cada una al cuadrado.'],
      [M(`= ${Sq(sqVals(v), true)} = ${rootH(n2)}`), 'Se suma y después se hace la raíz. Si no es exacta, se deja así o se simplifica.']] }, extra);
}
gen('l8.norm', 'L8', r => { if (r.chance(0.6)) return normItem(niceVec(r, r.pick([2, 3])).v); return normItem(rvnz(r, r.pick([2, 3]), -5, 5)); });
function unitItem(v, extra = {}) {
  const n2 = vn2(v), len = sqrtInt(n2), q = v.map(x => (len.r === 1 ? new Fr(x).div(len.c) : divSqrt(x, n2)));
  const lenH = N(len);
  return Object.assign({ type: 'vec', q: `Normaliza ${M(Bv + ' = ' + Vh(v))}: encuentra el vector unitario que apunta igual.`, form: fV(v.length), expect: q, ansH: M(Bq + ' = ' + Vh(q)),
    sol: [[M(`‖${Bv}‖ = ${rootH(n2)}`), 'Primero el módulo.'],
      [M(`${Bq} = ${Fh(1, lenH)}${Vh(v)} = ${Vh(q)}`), 'Divido cada componente entre el módulo' + (len.r === 1 ? '.' : ' y racionalizo.')],
      [M(q.map(x => '(' + N(x) + ')²').join(ADD) + ' = 1 ✓'), 'Comprobación: un vector normalizado mide 1, la suma de los cuadrados de sus componentes da 1.']] }, extra);
}
gen('l8.unit', 'L8', r => { if (r.chance(0.8)) return unitItem(niceVec(r, r.pick([2, 3])).v); let v; do v = rvnz(r, r.pick([2, 3]), -3, 3); while (Number.isInteger(Math.sqrt(vn2(v)))); return unitItem(v); });
gen('prof.e4', 'L8', () => unitItem([1, 1], { tag: 'Ejercicio 4 del profesor' }), { sib: 'l8.unit' });
gen('prof.e5', 'L8', () => unitItem([4, 3], { tag: 'Ejercicio 5 del profesor' }), { sib: 'l8.unit' });
gen('l8.err', 'L8', r => {
  const n = r.pick([2, 2, 3]), { v, len } = niceVec(r, n), k = n === 2 && len <= 10 ? r.pick([1, 1, 2, 3]) : 1, w = v.map(x => x * k), L = len * k;
  const n2 = vn2(w), sAbs = w.reduce((s, x) => s + Math.abs(x), 0), opts = [L], seen = new Set([L]);
  for (const x of [sAbs, n2, Math.abs(w.reduce((s, x) => s + x, 0)), L + 1, 2 * L]) if (opts.length < 4 && x > 0 && !seen.has(x)) { seen.add(x); opts.push(x); }
  return { type: 'mc', q: `¿Cuánto mide ${M(Vh(w))}?`, opts: opts.map(x => M(String(x))), correct: 0,
    sol: [[M(`${Sq(sqSum(w), true)} = ${Sq(sqVals(w), true)} = ${Sq(n2)} = ${L}`), `Cada componente al cuadrado (con su signo desaparece), se suma y se hace la raíz. Los errores típicos: sumar las componentes (${sAbs}) u olvidar la raíz (${n2}).`]] };
});
// Cuadrado exacto de una componente (fracción o c·√r).
const sqX = x => (x instanceof Surd ? x.c.mul(x.c).mul(x.r) : F(x).mul(F(x)));
gen('l8.tfunit', 'L8', r => {
  const ok = r.chance(0.5), n = r.pick([2, 3]);
  let q;
  if (r.chance(0.25)) { const sg = Array.from({ length: n }, () => r.sign()); q = sg.map(x => (ok ? divSqrt(x, n) : new Fr(x, n))); }
  else { const { v, len } = niceVec(r, n), den = ok ? len : r.chance(0.5) ? v.reduce((s, x) => s + Math.abs(x), 0) : len + r.pick([-1, 1]); q = v.map(x => new Fr(x, den)); }
  const s = q.reduce((acc, x) => acc.add(sqX(x)), new Fr(0)), good = s.n === 1 && s.d === 1;
  return { type: 'tf', q: `${M(Vh(q))} es un vector unitario.`, correct: good,
    sol: [[M(q.map(x => '(' + N(x) + ')²').join(ADD) + ' = ' + N(s)), good ? 'La suma de los cuadrados da 1: mide 1.' : 'La suma de los cuadrados no da 1, así que no mide 1.']] };
});
gen('l8.k', 'L8', r => {
  const L = r.chance(0.7) ? new Surd(1, r.int(2, 12) ** 2) : new Surd(r.int(1, 3), r.pick([2, 3, 5, 6, 7]));
  const c = r.chance(0.75) ? new Fr(r.sign() * r.int(2, 9)) : new Fr(r.sign(), r.int(2, 4)), ac = c.abs(), res = new Surd(ac.mul(L.c), L.r);
  const cv = (c.n < 0 ? MINUS : '') + (c.d === 1 ? N(ac) : '(' + N(ac) + ')') + Bv;
  return { type: 'num', q: `Si ${M('‖' + Bv + '‖ = ' + N(L))}, ¿cuánto mide ${M(cv)}?`, pre: M('‖' + cv + '‖ ='), ans: res,
    sol: [[M(`‖${cv}‖ = |${N(c)}|·‖${Bv}‖ = ${N(ac)}·${N(L)} = ${N(res)}`), 'Multiplicar por c multiplica la longitud por c sin el signo: un módulo nunca es negativo.']] };
});

// ===== L9 · Distancia =====
function distItem(u, v, extra = {}) {
  const d = vsub(u, v), n2 = vn2(d);
  return Object.assign({ type: 'num', q: `Calcula la distancia entre ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}.`, pre: M(iv('d') + '(' + Bu + ', ' + Bv + ') ='), ans: sqrtInt(n2),
    sol: [[M(`${Bu}${SUB}${Bv} = [${u.map((x, i) => N(x) + SUB + P(v[i])).join(', ')}] = ${Vh(d)}`), 'La distancia es lo que mide la flecha que une las dos puntas: primero la resta.'],
      [M(`‖${Vh(d)}‖ = ${Sq(sqVals(d), true)} = ${rootH(n2)}`), 'Y después su módulo.']] }, extra);
}
gen('l9.distv', 'L9', r => { const n = r.pick([2, 3]); return distItem(rv(r, n, -5, 5), rv(r, n, -5, 5)); });
gen('prof.e6', 'L9', () => distItem([1, 2], [3, 1], { tag: 'Ejercicio 6 del profesor' }), { sib: 'l9.distv' });
gen('l9.distp', 'L9', r => {
  const A = rv(r, 3, -4, 4); const dv = r.chance(0.6) ? niceVec(r, 3).v : rvnz(r, 3, -4, 4); const B = vadd(A, dv), n2 = vn2(dv);
  return { type: 'num', q: `Distancia entre los puntos ${M('A = ' + Ph(A))} y ${M('B = ' + Ph(B))}.`, pre: M(iv('d') + '(A, B) ='), ans: sqrtInt(n2),
    sol: [[M(`${ar('AB')} = ${Vh(dv)}`), 'Para dos puntos: la flecha de uno a otro.'], [M(`‖${ar('AB')}‖ = ${Sq(sqVals(dv), true)} = ${rootH(n2)}`), 'Y su módulo.']] };
});
const TF_L9 = [
  [M(iv('d') + '(' + Bu + ', ' + Bv + ') = ' + iv('d') + '(' + Bv + ', ' + Bu + ')'), true, 'v − u es la misma flecha al revés y mide lo mismo: al elevar al cuadrado los signos desaparecen.'],
  ['La distancia entre dos vectores puede ser negativa.', false, 'Es un módulo: una raíz de una suma de cuadrados. Nunca es negativa.'],
  [M(iv('d') + '(' + Bu + ', ' + Bv + ') = ‖' + Bu + '‖' + SUB + '‖' + Bv + '‖'), false, 'Primero se restan los vectores y luego se hace el módulo: d(u, v) = ‖u − v‖.'],
];
gen('l9.tf', 'L9', r => { const [s, c, why] = r.pick(TF_L9); return { type: 'tf', q: s, correct: c, sol: [[c ? 'Verdadero' : 'Falso', why]] }; });

// ===== L10 · Ángulo entre dos vectores =====
const ANG_PAIRS = [
  [45, [1, 0], [1, 1]], [45, [1, 2], [3, 1]], [45, [2, 1], [3, -1]], [45, [1, 0, 0], [1, 1, 0]],
  [60, [1, 0, 1], [0, 1, 1]], [60, [1, 1, 0], [1, 0, 1]], [60, [1, 1, 0], [0, 1, 1]],
  [90, [1, 2], [-2, 1]], [90, [1, 2, 0], [2, -1, 0]], [90, [2, -3, 1], [4, 1, -5]],
  [120, [1, 1, 0], [-1, 0, 1]], [120, [1, 0, 1], [0, -1, -1]], [120, [1, 1, 0], [0, -1, -1]],
  [135, [1, 1], [-1, 0]], [135, [1, 0], [-1, 1]], [135, [1, 2], [-3, -1]],
  [30, [2, 1, 1], [1, 1, 0]], [30, [2, 1, 1], [1, 0, 1]], [150, [2, 1, 1], [-1, -1, 0]], [150, [1, 2, 1], [0, -1, -1]]];
function angPair(r) {
  const [deg, u0, v0] = r.pick(ANG_PAIRS), n = u0.length, perm = r.shuffle([...Array(n).keys()]), sg = perm.map(() => r.sign());
  const tr = (w, k) => perm.map((p, i) => w[p] * sg[i] * k);
  return { deg, u: tr(u0, r.pick([1, 1, 2])), v: tr(v0, r.pick([1, 1, 1, 2])) };
}
function angleSteps(u, v) {
  const d = vdot(u, v), uu = vn2(u), vv = vn2(v), cos = divSqrt(d, uu * vv), deg = Math.acos(Math.max(-1, Math.min(1, cos.v))) * 180 / Math.PI;
  const rd = Math.round(deg), table = Math.abs(deg - rd) < 1e-6 && [0, 30, 45, 60, 90, 120, 135, 150, 180].includes(rd);
  const base = rd > 90 ? 180 - rd : rd;
  const angSol = !table ? [[M(`${iv('φ')} = arccos(${dec(cos.v, 3)}) ≈ ${dec(deg, 1)}°`), 'No está en la tabla: calculadora, SHIFT + cos (arccos), en modo DEG.']]
    : rd <= 90 ? [[M(`${iv('φ')} = ${rd}°`), rd === 90 ? 'Coseno cero: ángulo recto.' : 'Coseno positivo: agudo. En la tabla, ese coseno es de ' + rd + '°.']]
      : [[M(`${iv('φ')} = 180°${SUB}${base}° = ${rd}°`), `Coseno negativo: obtuso. Sin el signo la tabla da ${base}°, y se resta a 180°.`]];
  return { d, uu, vv, cos, deg, table, steps: [
    { type: 'num', q: `Calcula ${M(Bu + '·' + Bv)}.`, pre: M(Bu + '·' + Bv + ' ='), ans: d, sol: dotItem(u, v).sol },
    { type: 'num', q: `Calcula ${M('cos ' + iv('φ'))}.`, pre: M('cos ' + iv('φ') + ' ='), ans: cos,
      sol: [[M(`‖${Bu}‖ = ${rootH(uu)},  ‖${Bv}‖ = ${rootH(vv)}`), 'Los dos módulos.'],
        [M(`cos ${iv('φ')} = ${Fh(N(d), N(sqrtInt(uu)) + '·' + N(sqrtInt(vv)))} = ${N(cos)}`), 'Producto escalar entre el producto de los módulos; simplifico y racionalizo. Tiene que estar entre −1 y 1 y con el signo de u·v.']] },
    { type: 'num', q: `¿Qué ángulo forman? En grados.`, pre: M(iv('φ') + ' ='), unit: '°', ans: table ? rd : deg, tol: { abs: 0.6 }, ansH: M((table ? '' : '≈ ') + dec(table ? rd : deg, 1) + '°'), sol: angSol }] };
}
gen('l10.chain', 'L10', r => { const { u, v } = angPair(r); const a = angleSteps(u, v); return { type: 'chain', q: `Ángulo entre ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}.`, steps: a.steps }; });
gen('prof.e7', 'L10', () => { const a = angleSteps([1, 2], [3, 1]); return { type: 'chain', tag: 'Ejercicio 7 del profesor', q: `Calcula el ángulo que forman ${M(Bu + ' = [1, 2]')} y ${M(Bv + ' = [3, 1]')}.`, steps: a.steps }; }, { sib: 'l10.chain' });
function angDirect(u, v, extra = {}) {
  const a = angleSteps(u, v), last = a.steps[2];
  return Object.assign({ type: 'num', q: `¿Qué ángulo forman ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}? En grados.` + (a.table ? '' : ' Usa la calculadora.'),
    pre: last.pre, unit: '°', ans: last.ans, tol: last.tol, ansH: last.ansH, sol: [...a.steps[0].sol, ...a.steps[1].sol, ...last.sol] }, extra);
}
gen('l10.table', 'L10', r => { const { u, v } = angPair(r); return angDirect(u, v); });
gen('l10.calc', 'L10', r => {
  let u, v, a;
  do { u = rvnz(r, 3, -3, 3); v = rvnz(r, 3, -3, 3); a = angleSteps(u, v); } while (a.table || isParallel(u, v));
  return angDirect(u, v);
});
const TF_L10 = [
  r => { const c = r.sign() * r.int(101, 190) / 100; return [`Si al calcular te sale ${M('cos ' + iv('φ') + ' = ' + dec(c))}, hay un error.`, true, `El coseno siempre está entre −1 y 1. Si sale ${dec(c)}, revisa algún módulo.`]; },
  r => { const [ang, f] = r.pick(COS_TAB.filter(x => x[0] !== 90)), base = ang > 90 ? 180 - ang : ang, claim = r.pick([ang, ang, base === ang ? 180 - ang : base]), ok = claim === ang;
    return [`${M('cos ' + iv('φ') + ' = ' + N(f()))} corresponde a ${M(claim + '°')}.`, ok, ang > 90 ? `Sin el signo sería ${base}°, pero como es negativo el ángulo es 180° − ${base}° = ${ang}°.` : `Es positivo, así que el ángulo es agudo: ${ang}°, el de la tabla.`]; },
  ['El ángulo entre dos vectores puede ser de 200°.', false, 'Con la fórmula del coseno el ángulo siempre está entre 0° y 180°.'],
  ['Si u·v < 0, el ángulo que forman es obtuso.', true, 'El signo del producto escalar ya te dice si el ángulo es agudo (+), recto (0) u obtuso (−).'],
];
gen('l10.tf', 'L10', r => { const e = r.pick(TF_L10), [s, c, why] = typeof e === 'function' ? e(r) : e; return { type: 'tf', q: s, correct: c, sol: [[c ? 'Verdadero' : 'Falso', why]] }; });

// ===== L11 · Vectores ortogonales =====
gen('l11.tf', 'L11', r => {
  const u = rvnz(r, 3, -4, 4); let v; const ort = r.chance(0.5);
  if (ort) { let c; do c = vcross(u, rvnz(r, 3, -2, 2)); while (vzero(c)); v = vred(c); } else { do v = rvnz(r, 3, -4, 4); while (vdot(u, v) === 0); }
  return { type: 'tf', q: `${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))} son ortogonales.`, correct: ort,
    sol: [[M(`${Bu}·${Bv} = ${dotExpand(u, v)} = ${N(vdot(u, v))}`), ort ? 'Da 0: son perpendiculares.' : 'No da 0: no son perpendiculares.']] };
});
gen('prof.e8', 'L11', () => ({ type: 'tf', tag: 'Ejercicio 8 del profesor', q: `${M(Bu + ' = (1, 2, 0)')} y ${M(Bv + ' = (2, ' + MINUS + '1, 0)')} son ortogonales.`, correct: true,
  sol: [[M(`${Bu}·${Bv} = 1·2${ADD}2·(${MINUS}1)${ADD}0·0 = 2${SUB}2 = 0`), 'Basta con hacer el producto escalar: da 0, son ortogonales.']] }), { sib: 'l11.tf' });
gen('l11.k', 'L11', r => {
  let i, j, u, v, coef, C;
  do {
    i = r.int(0, 2); do j = r.int(0, 2); while (j === i);
    u = rv(r, 3, -4, 4); v = rv(r, 3, -4, 4); u[i] = 0; v[j] = 0;
    coef = v[i] + u[j]; C = [0, 1, 2].filter(l => l !== i && l !== j).reduce((s, l) => s + u[l] * v[l], 0);
  } while (coef === 0 || C === 0);
  const k = new Fr(-C, coef), K = iv('k');
  const uH = '[' + u.map((x, l) => (l === i ? K : N(x))).join(', ') + ']', vH = '[' + v.map((x, l) => (l === j ? K : N(x))).join(', ') + ']';
  const exp = [0, 1, 2].map(l => (l === i ? K + '·' + P(v[l]) : l === j ? P(u[l]) + '·' + K : P(u[l]) + '·' + P(v[l]))).join(ADD);
  return { type: 'num', q: `Halla ${M(K)} para que ${M(Bu + ' = ' + uH)} y ${M(Bv + ' = ' + vH)} sean ortogonales.`, pre: M(K + ' ='), ans: k,
    sol: [[M(`${Bu}·${Bv} = ${exp}`), 'Escribo el producto escalar con la k dentro.'],
      [M(`${Lin([coef], undefined, ['k'])}${C < 0 ? SUB + N(-C) : ADD + N(C)} = 0`), 'Lo igualo a 0, que es la condición de ortogonalidad.'],
      [M(`${K} = ${N(k)}`), 'Despejo.']] };
});
gen('l11.perp', 'L11', r => {
  const a = r.nz(-6, 6), b = r.nz(-6, 6);
  return { type: 'vec', q: `Da un vector perpendicular a ${M(Vh([a, b]))} (distinto de cero).`, form: fV(2), check: x => !vzero(x.map(Math.round)) && near(x[0] * a + x[1] * b, 0) && x.some(y => Math.abs(y) > 1e-9), ansH: M(Vh([-b, a])), sample: [-b, a],
    sol: [[M(`${Vh([a, b])} ⟂ ${Vh([-b, a])}`), 'Truco en el plano: se intercambian las componentes y a una se le cambia el signo. Cualquier múltiplo también vale.'],
      [M(`${P(a)}·${P(-b)}${ADD}${P(b)}·${P(a)} = 0 ✓`), 'Comprobación.']] };
});
const MC_L11 = [
  ['Si u ⟂ v, entonces ‖u + v‖² = …', [M('‖' + Bu + '‖²' + ADD + '‖' + Bv + '‖²'), M('‖' + Bu + '‖' + ADD + '‖' + Bv + '‖'), M('0'), M('‖' + Bu + '‖·‖' + Bv + '‖')], 'Es Pitágoras con vectores: u y v son los catetos y la suma, la hipotenusa.'],
  ['“Ortogonal” significa…', ['Perpendicular: forman 90°', 'Paralelo', 'De longitud 1', 'Opuesto'], 'Como cos 90° = 0, la condición es u·v = 0.'],
];
gen('l11.pit', 'L11', r => { const [q, opts, why] = r.pick(MC_L11); return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });

// ===== L12 · Proyección ortogonal =====
function proyData(u, v) { const uv = vdot(u, v), uu = vn2(u), k = new Fr(uv, uu), pr = u.map(x => k.mul(x)), perp = v.map((x, i) => F(x).sub(pr[i])); return { uv, uu, k, pr, perp }; }
function proySteps(u, v) {
  const p = proyData(u, v), PH = M(proyH(Bu, Bv));
  return [
    { type: 'vec', q: 'Calcula las dos piezas de la fórmula.', form: [M(Bu + '·' + Bv + ' = '), 0, M(',   ' + Bu + '·' + Bu + ' = '), 1], expect: [p.uv, p.uu], ansH: M(`${Bu}·${Bv} = ${N(p.uv)},  ${Bu}·${Bu} = ${p.uu}`),
      sol: [[M(`${Bu}·${Bv} = ${dotExpand(u, v)} = ${N(p.uv)}`), 'Arriba: cuánto “va” v en la dirección de u.'], [M(`${Bu}·${Bu} = ${sqVals(u)} = ${p.uu}`), 'Abajo: la suma de los cuadrados de u, sin raíz.']] },
    { type: 'vec', q: `Calcula ${PH}.`, form: fV(u.length), expect: p.pr, ansH: M(proyH(Bu, Bv) + ' = ' + Vh(p.pr)),
      sol: [[M(`${proyH(Bu, Bv)} = ${Fh(N(p.uv), p.uu)}${Vh(u)} = ${N(p.k)}·${Vh(u)} = ${Vh(p.pr)}`), 'El número de delante multiplica a u: el resultado está en la línea de u.']] },
    { type: 'vec', q: `Calcula la parte perpendicular ${M(Bv + SUB + proyH(Bu, Bv))}.`, form: fV(u.length), expect: p.perp, ansH: M(Vh(p.perp)),
      sol: [[M(`${Vh(v)}${SUB}${Vh(p.pr)} = ${Vh(p.perp)}`), 'v menos la sombra.'], [M(`${Vh(p.perp)}·${Vh(u)} = 0 ✓`), 'Comprobación: la parte perpendicular siempre da producto escalar 0 con u.']] }];
}
const proyPair = r => { const n = r.pick([2, 3]); let u, v; do { u = rvnz(r, n, -3, 3); v = rvnz(r, n, -4, 4); } while (vdot(u, v) === 0 || isParallel(u, v)); return [u, v]; };
gen('l12.chain', 'L12', r => { const [u, v] = proyPair(r); return { type: 'chain', fig: { k: 'proj' }, q: `Proyección de ${M(Bv + ' = ' + Vh(v))} sobre ${M(Bu + ' = ' + Vh(u))}.`, steps: proySteps(u, v) }; });
gen('prof.e9', 'L12', () => ({ type: 'chain', tag: 'Ejercicio 9 del profesor', fig: { k: 'proj' }, q: `Calcula la proyección ortogonal de ${M(Bv + ' = (2, 2)')} sobre ${M(Bu + ' = (0, 4)')}.`, steps: proySteps([0, 4], [2, 2]) }), { sib: 'l12.chain' });
gen('l12.vec', 'L12', r => {
  const [u, v] = proyPair(r), s = proySteps(u, v);
  return { type: 'vec', q: `Calcula ${M(proyH(Bu, Bv))} con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}.`, form: s[1].form, expect: s[1].expect, ansH: s[1].ansH, sol: [...s[0].sol, ...s[1].sol] };
});
const MC_L12 = [
  ['En la fórmula de proy_u(v), ¿qué va abajo?', [M(Bu + '·' + Bu + ' (sin raíz)'), M('‖' + Bu + '‖ (con raíz)'), M(Bv + '·' + Bv), M(Bu + '·' + Bv)], 'Abajo va siempre el vector sobre el que proyectas, multiplicado por sí mismo: ‖u‖², sin raíz.'],
  ['¿Qué tipo de resultado da proy_u(v)?', ['Un vector en la línea de u', 'Un número', 'Un vector perpendicular a u', 'Un ángulo'], 'El paréntesis es un número que multiplica a u.'],
  ['La parte perpendicular v − proy_u(v)…', ['Da producto escalar 0 con u', 'Es paralela a u', 'Siempre es el vector cero', 'Mide lo mismo que v'], 'Su longitud es la distancia de la punta de v a la línea de u: la base de las distancias.'],
];
gen('l12.abajo', 'L12', r => { const [q, opts, why] = r.pick(MC_L12); return { type: 'mc', q: q.replace('proy_u(v)', M(proyH(Bu, Bv))), opts, correct: 0, sol: [[opts[0], why]] }; });
const TF_L12 = [
  [M(proyH(Bu, Bv) + ' = ' + proyH(Bv, Bu)) + ' siempre.', false, 'Abajo va el vector sobre el que proyectas: cambiarlo cambia el resultado.'],
  ['En la proyección, abajo se hace la raíz de u·u.', false, 'Abajo es u·u = ‖u‖², sin raíz.'],
  ['Si el ángulo entre u y v es obtuso, la sombra apunta al revés que u.', true, 'u·v es negativo, así que el número que multiplica a u es negativo.'],
];
gen('l12.tf', 'L12', r => { const [s, c, why] = r.pick(TF_L12); return { type: 'tf', q: s, correct: c, sol: [[c ? 'Verdadero' : 'Falso', why]] }; });

// ===== L13 · Producto vectorial =====
function crossSol(u, v) {
  const c = vcross(u, v);
  return [[M(`1.ª: ${P(u[1])}·${P(v[2])}${SUB}${P(u[2])}·${P(v[1])} = ${N(c[0])}`), 'Tapo la columna 1 y hago la cruz con los cuatro números que quedan.'],
    [M(`2.ª: ${MINUS}(${P(u[0])}·${P(v[2])}${SUB}${P(u[2])}·${P(v[0])}) = ${N(c[1])}`), 'Tapo la columna 2, hago la cruz y cambio el signo.'],
    [M(`3.ª: ${P(u[0])}·${P(v[1])}${SUB}${P(u[1])}·${P(v[0])} = ${N(c[2])}`), 'Tapo la columna 3.'],
    [M(`${Bu}×${Bv} = ${Vh(c)}`), 'Comprobación: tiene que dar producto escalar 0 con u y con v.']];
}
function crossItem(u, v, extra = {}) { const c = vcross(u, v); return Object.assign({ type: 'vec', q: `Calcula ${M(Bu + '×' + Bv)} con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}.`, form: fV(3), expect: c, ansH: M(Bu + '×' + Bv + ' = ' + Vh(c)), sol: crossSol(u, v) }, extra); }
const crossPair = r => { let u, v; do { u = rvnz(r, 3, -3, 3); v = rvnz(r, 3, -3, 3); } while (vzero(vcross(u, v))); return [u, v]; };
gen('l13.cross', 'L13', r => { const [u, v] = crossPair(r); return crossItem(u, v); });
gen('prof.e10', 'L13', () => crossItem([1, 2, 3], [-1, 0, 4], { tag: 'Ejercicio 10 del profesor' }), { sib: 'l13.cross' });
gen('l13.c2', 'L13', r => {
  const [u, v] = crossPair(r), c = vcross(u, v);
  return { type: 'num', q: `Con ${M(Bu + ' = ' + Vh(u))} y ${M(Bv + ' = ' + Vh(v))}, ¿cuál es la segunda componente de ${M(Bu + '×' + Bv)}? (la del signo cambiado)`, pre: M('2.ª ='), ans: c[1], sol: [crossSol(u, v)[1]] };
});
const TF_L13 = [
  [M(Bv + '×' + Bu + ' = ' + MINUS + '(' + Bu + '×' + Bv + ')'), true, 'Si los multiplicas al revés sale el opuesto. Para un vector normal a un plano, cualquiera de los dos sirve.'],
  [M(Bu + '×' + Bv + ' = ' + Bv + '×' + Bu), false, 'Sale el opuesto: v×u = −(u×v).'],
  [M(Bu + '×' + Bv) + ' es perpendicular a u y a v a la vez.', true, 'Es justo para lo que sirve. Por eso se comprueba con dos productos escalares.'],
  ['El producto vectorial se puede calcular en el plano ℝ².', false, 'Solo existe en ℝ³.'],
];
gen('l13.tf', 'L13', r => { const [s, c, why] = r.pick(TF_L13); return { type: 'tf', q: s, correct: c, sol: [[c ? 'Verdadero' : 'Falso', why]] }; });
gen('l13.chk', 'L13', r => {
  const [u, v] = crossPair(r), c = vcross(u, v);
  return { type: 'chain', q: `${M(Bu + ' = ' + Vh(u))},  ${M(Bv + ' = ' + Vh(v))}`, steps: [
    { type: 'vec', q: `Calcula ${M(Bu + '×' + Bv)}.`, form: fV(3), expect: c, ansH: M(Vh(c)), sol: crossSol(u, v) },
    { type: 'num', q: `Compruébalo: calcula ${M('(' + Bu + '×' + Bv + ')·' + Bu)}.`, pre: M('(' + Bu + '×' + Bv + ')·' + Bu + ' ='), ans: 0,
      sol: [[M(`${Vh(c)}·${Vh(u)} = ${dotExpand(c, u)} = 0`), 'Siempre da 0. Si no, repasa los signos, sobre todo en la segunda componente.']] }] };
});
const MC_L13 = [
  ['¿Para qué sirve u × v en este tema?', ['Para sacar el vector normal de un plano a partir de dos direcciones del plano', 'Para calcular el ángulo entre u y v', 'Para normalizar un vector', 'Para sumar vectores'], 'Lo usarás en la lección 16: n = u × v.'],
  ['¿Hacia dónde apunta u × v?', ['Perpendicular a los dos, según la regla del sacacorchos de u hacia v', 'En la dirección de u', 'Entre u y v', 'En la dirección de u + v'], 'Gira de u hacia v y el vector avanza como el sacacorchos.'],
];
gen('l13.uso', 'L13', r => { const [q, opts, why] = r.pick(MC_L13); return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });
