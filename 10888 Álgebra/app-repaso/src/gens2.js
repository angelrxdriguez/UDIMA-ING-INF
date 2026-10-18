// ===== Generadores · Partes III a V (rectas, planos, sistemas, distancias) =====
const E = k => `E<sub>${k}</sub>`;
// "E2 − 3·E1" con el signo bien puesto
const opH = (k, i = 2, j = 1) => M(`${E(i)} ← ${E(i)}${k >= 0 ? SUB : ADD}${Math.abs(k) === 1 ? '' : Math.abs(k)}${E(j)}`);
const vmc = (v, c) => (c === 0 ? iv(v) : iv(v) + (c > 0 ? SUB + N(c) : ADD + N(-c)));
const XYZ = ['x', 'y', 'z'];
const bankMC = (id, lesson, bank) => gen(id, lesson, r => { const [q, opts, why] = r.pick(bank); return { type: 'mc', q, opts, correct: 0, sol: [[opts[0], why]] }; });
const bankTF = (id, lesson, bank) => gen(id, lesson, r => { const [s, c, why] = r.pick(bank); return { type: 'tf', q: s, correct: c, sol: [[c ? 'Verdadero' : 'Falso', why]] }; });

// ===== L14 · Rectas en el plano =====
function line2(r) { let a, b; do { a = r.nz(-5, 5); b = r.nz(-5, 5); } while (Math.abs(a) === Math.abs(b) || gcd(a, b) !== 1); const p = rv(r, 2, -3, 3); return { a, b, c: a * p[0] + b * p[1], p }; }
const eq2 = L => M(Lin([L.a, L.b], L.c, ['x', 'y']));
const par2 = (p, d) => M(`${iv('x')} = ${Aff(p[0], [[d[0], 't']])},  ${iv('y')} = ${Aff(p[1], [[d[1], 't']])}`);
gen('l14.normal', 'L14', r => {
  const L = line2(r), opts = [[L.a, L.b], [-L.b, L.a], [L.b, L.a], [L.a, L.b, L.c]];
  return { type: 'mc', q: `¿Cuál es un vector normal de la recta ${eq2(L)}?`, opts: opts.map(x => M(Vh(x))), correct: 0,
    sol: [[M(`${Bn} = ${Vh([L.a, L.b])}`), 'Los números que acompañan a x e y forman el vector normal, perpendicular a la recta. El término independiente no entra.']] };
});
gen('l14.dir', 'L14', r => {
  const L = line2(r), d = r.chance(0.5) ? [-L.b, L.a] : [L.b, -L.a], opts = [d, [L.a, L.b], [L.b, L.a], [-L.a, L.b]];
  return { type: 'mc', q: `¿Cuál es un vector director de la recta ${eq2(L)}?`, opts: opts.map(x => M(Vh(x))), correct: 0,
    sol: [[M(`${Bn} = ${Vh([L.a, L.b])}  ⟹  ${Bd} = ${Vh([-L.b, L.a])}`), 'El director es perpendicular al normal: se intercambian las componentes y a una se le cambia el signo. Su opuesto también vale.'],
      [M(`${Vh(d)}·${Vh([L.a, L.b])} = 0 ✓`), 'Comprobación: d·n = 0.']] };
});
gen('l14.tpt', 'L14', r => {
  const p = rv(r, 2, -4, 4), d = rvnz(r, 2, -3, 3), t = r.pick([-2, -1, 2, 3]), X = vadd(p, vsc(t, d));
  return { type: 'vec', q: `En la recta ${par2(p, d)}, ¿qué punto corresponde a ${M(iv('t') + ' = ' + N(t))}?`, form: fP(2), expect: X, ansH: M(Ph(X)),
    sol: [[M(`${iv('x')} = ${N(p[0])}${ADD}${P(d[0])}·${P(t)} = ${N(X[0])},  ${iv('y')} = ${N(p[1])}${ADD}${P(d[1])}·${P(t)} = ${N(X[1])}`), 'Sustituyo t en cada ecuación. Piensa en t como el tiempo: en t = 0 estás en el punto de partida y cada unidad avanzas una vez el director.']] };
});
gen('l14.pt', 'L14', r => {
  const L = line2(r);
  return { type: 'vec', q: `Da un punto cualquiera de la recta ${eq2(L)}.`, form: fP(2), check: x => near(L.a * x[0] + L.b * x[1], L.c), ansH: M(Ph(L.p)), sample: L.p,
    sol: [[M(`${iv('x')} = ${N(L.p[0])}  ⟹  ${Lin([L.b], L.c - L.a * L.p[0], ['y'])}  ⟹  ${iv('y')} = ${N(L.p[1])}`), 'Doy a x un valor cómodo y despejo y. Hay infinitos puntos: vale cualquiera que cumpla la ecuación.'],
      [M(`${N(L.a)}·${P(L.p[0])}${ADD}${P(L.b)}·${P(L.p[1])} = ${N(L.c)} ✓`), 'Comprobación: sustituyo en la ecuación.']] };
});
gen('l14.pn', 'L14', r => {
  const n = rvAllNz(r, 2, -5, 5), p = rv(r, 2, -4, 4), c = vdot(n, p);
  return { type: 'vec', q: `Escribe la recta que pasa por ${M('P = ' + Ph(p))} con vector normal ${M(Bn + ' = ' + Vh(n))}.`, form: [M(Lin(n, undefined, ['x', 'y']) + ' = '), 0], expect: [c], ansH: M(Lin(n, c, ['x', 'y'])),
    sol: [[M(`${Bn}·${Bx} = ${Bn}·${Bp}`), 'Forma normal: el normal por un punto cualquiera (x, y) es igual al normal por el punto P.'],
      [M(`${Lin(n, undefined, ['x', 'y'])} = ${dotExpand(n, p)} = ${N(c)}`), 'Los números de x e y son los del normal; el de la derecha sale de sustituir P.']] };
});
gen('l14.vect', 'L14', r => {
  const L = line2(r), d = [-L.b, L.a];
  return { type: 'vec', q: `Escribe la recta ${eq2(L)} en forma vectorial.`, form: fLine(2),
    check: x => near(L.a * x[0] + L.b * x[1], L.c) && near(L.a * x[2] + L.b * x[3], 0) && (Math.abs(x[2]) + Math.abs(x[3]) > 1e-9),
    ansH: M(`[${iv('x')}, ${iv('y')}] = ${Vh(L.p)} + ${iv('t')}${Vh(d)}`), sample: [...L.p, ...d],
    sol: [[M(`${Bn} = ${Vh([L.a, L.b])}`), 'Leo el normal en los coeficientes de x e y.'],
      [M(`P = ${Ph(L.p)}`), 'Un punto: doy un valor cómodo a una letra y despejo la otra.'],
      [M(`${Bd} = ${Vh(d)}`), 'El director, perpendicular al normal: intercambio y cambio un signo.'],
      [M(`[${iv('x')}, ${iv('y')}] = ${Vh(L.p)} + ${iv('t')}${Vh(d)}`), 'Punto más t por director. Cualquier punto de la recta y cualquier múltiplo del director también valen.']] };
});
gen('l14.gen', 'L14', r => {
  const p = rv(r, 2, -4, 4); let d; do d = rvAllNz(r, 2, -3, 3); while (gcd(d[0], d[1]) !== 1);
  const A = d[1], B = -d[0], C = A * p[0] + B * p[1];
  const tH = d[0] === 1 ? vmc('x', p[0]) : Fh(vmc('x', p[0]), N(d[0]), true);
  return { type: 'vec', q: `Pasa a forma general la recta ${par2(p, d)}.`, form: fEq(['x', 'y']), check: x => propEq(x, [A, B, C], 2), sample: [A, B, C], ansH: M(Lin([A, B], C, ['x', 'y'])),
    sol: [[M(`${iv('t')} = ${tH}`), 'Despejo t en la primera ecuación.'],
      [M(`${iv('y')} = ${p[1] !== 0 ? N(p[1]) + ADD : ''}${d[1] === 1 ? '' : P(d[1]) + '·'}${d[0] === 1 ? (d[1] === 1 && p[1] === 0 ? tH : '(' + tH + ')') : tH}`), 'Lo sustituyo en la segunda.'],
      [M(Lin([A, B], C, ['x', 'y'])), 'Quito denominadores y paso las letras a un lado. Cualquier múltiplo de esta ecuación también es correcto.'],
      [M(`${Vh([A, B])}·${Vh(d)} = 0 ✓`), 'Comprobación: el normal que sale es perpendicular al director.']] };
});
gen('l14.par', 'L14', r => {
  const L = line2(r); let p; do p = rv(r, 2, -4, 4); while (L.a * p[0] + L.b * p[1] === L.c);
  const c2 = L.a * p[0] + L.b * p[1];
  return { type: 'vec', q: `Escribe la recta paralela a ${eq2(L)} que pasa por ${M('P = ' + Ph(p))}.`, form: [M(Lin([L.a, L.b], undefined, ['x', 'y']) + ' = '), 0], expect: [c2], ansH: M(Lin([L.a, L.b], c2, ['x', 'y'])),
    sol: [[M(`${Lin([L.a, L.b], undefined, ['x', 'y'])} = ${iv('k')}`), 'Paralela: el mismo normal, así que la misma parte izquierda. Solo cambia el número de la derecha.'],
      [M(`${iv('k')} = ${dotExpand([L.a, L.b], p)} = ${N(c2)}`), 'Lo saco sustituyendo el punto.']] };
});
bankTF('l14.tf', 'L14', [
  ['Una recta tiene una única ecuación vectorial correcta.', false, 'Tiene infinitas: cambia el punto de partida o multiplica el director. Si la tuya no coincide con la de la solución, compruébala sustituyendo puntos.'],
  [`En la recta ${M(Lin([3, -2], 5, ['x', 'y']))}, el vector [3, −2] es un vector director.`, false, 'Es el normal: los coeficientes de x e y. Un director sería [2, 3].'],
  ['Dos rectas paralelas tienen el mismo vector normal.', true, 'Por eso la paralela por un punto conserva la parte izquierda y solo cambia el número de la derecha.'],
  [`${par2([1, 5], [1, 2])} y ${par2([0, 3], [1, 2])} son la misma recta.`, true, 'Mismo director; y con t = 1 la segunda pasa por (1, 5), que es el punto de la primera.'],
  ['En el plano, el director y el normal de una recta son perpendiculares.', true, 'Si n = [a, b], un director es d = [−b, a], y d·n = 0.'],
]);
gen('prof.e11', 'L14', () => {
  const ok = x => near(-2 * x[0] + x[1], 3);
  return { type: 'chain', tag: 'Ejercicio 11 del profesor', q: `Calcula la forma normal, vectorial y paramétrica de la recta ${M(Lin([-2, 1], 3, ['x', 'y']))}.`, steps: [
    { type: 'vec', q: 'Un vector normal.', form: fV(2), check: x => isParallel(x, [-2, 1]), sample: [-2, 1], ansH: M(Bn + ' = ' + Vh([-2, 1])), sol: [[M(Bn + ' = ' + Vh([-2, 1])), 'Los coeficientes de x e y.']] },
    { type: 'vec', q: 'Un punto de la recta.', form: fP(2), check: ok, sample: [1, 5], ansH: M('(1, 5)'), sol: [[M(`${iv('x')} = 1  ⟹  ${MINUS}2${ADD}${iv('y')} = 3  ⟹  ${iv('y')} = 5`), 'Doy a x un valor cómodo y despejo y. El profesor usa (1, 5).']] },
    { type: 'num', q: `Forma normal: ${M(Vh([-2, 1]) + '·[' + iv('x') + ', ' + iv('y') + '] = ' + Vh([-2, 1]) + '·' + Vh([1, 5]))}. ¿Cuánto vale el lado derecho?`, pre: M(Bn + '·' + Bp + ' ='), ans: 3,
      sol: [[M(`${Vh([-2, 1])}·${Vh([1, 5])} = ${MINUS}2${ADD}5 = 3`), 'Es la general escrita con productos escalares: n·x = n·p.']] },
    { type: 'vec', q: 'Forma vectorial: punto más t por director.', form: fLine(2), check: x => ok(x) && near(-2 * x[2] + x[3], 0) && (Math.abs(x[2]) + Math.abs(x[3]) > 1e-9), sample: [1, 5, 1, 2], ansH: M(`[${iv('x')}, ${iv('y')}] = [1, 5] + ${iv('t')}[1, 2]`),
      sol: [[M(`${iv('x')} = ${iv('t')}  ⟹  ${iv('y')} = 3${ADD}2${iv('t')}`), 'Para el director, llamo t a la x y despejo la y: d = [1, 2].'],
        [M(`[${iv('x')}, ${iv('y')}] = [1, 5] + ${iv('t')}[1, 2]  ⟹  ${iv('x')} = 1${ADD}${iv('t')},  ${iv('y')} = 5${ADD}2${iv('t')}`), 'Vectorial y, fila a fila, paramétricas. [0, 3] + t[1, 2] también es correcta.']] }] };
}, { sib: 'l14.chain' });
gen('l14.chain', 'L14', r => {
  const L = line2(r), n = [L.a, L.b], p = L.p, d = vred([-L.b, L.a]), ok = x => near(L.a * x[0] + L.b * x[1], L.c);
  return { type: 'chain', q: `Calcula la forma normal, vectorial y paramétrica de la recta ${eq2(L)}.`, steps: [
    { type: 'vec', q: 'Un vector normal.', form: fV(2), check: x => isParallel(x, n), sample: n, ansH: M(Bn + ' = ' + Vh(n)), sol: [[M(Bn + ' = ' + Vh(n)), 'Los coeficientes de x e y.']] },
    { type: 'vec', q: 'Un punto de la recta.', form: fP(2), check: ok, sample: p, ansH: M(Ph(p)),
      sol: [[M(`${iv('x')} = ${N(p[0])}  ⟹  ${Lin([L.b], L.c - L.a * p[0], ['y'])}  ⟹  ${iv('y')} = ${N(p[1])}`), 'Doy a x un valor cómodo y despejo y. Vale cualquier punto que cumpla la ecuación.']] },
    { type: 'num', q: `Forma normal: ${M(Vh(n) + '·[' + iv('x') + ', ' + iv('y') + '] = ' + Vh(n) + '·' + Vh(p))}. ¿Cuánto vale el lado derecho?`, pre: M(Bn + '·' + Bp + ' ='), ans: L.c,
      sol: [[M(`${Vh(n)}·${Vh(p)} = ${dotExpand(n, p)} = ${N(L.c)}`), 'Es la general escrita con productos escalares: n·x = n·p.']] },
    { type: 'vec', q: 'Forma vectorial: punto más t por director.', form: fLine(2), check: x => ok(x) && near(L.a * x[2] + L.b * x[3], 0) && (Math.abs(x[2]) + Math.abs(x[3]) > 1e-9), sample: [...p, ...d],
      ansH: M(`[${iv('x')}, ${iv('y')}] = ${Vh(p)} + ${iv('t')}${Vh(d)}`),
      sol: [[M(`${Bn} = ${Vh(n)}  ⟹  ${Bd} = ${Vh(d)}`), 'El director es perpendicular al normal: intercambio las componentes y cambio un signo.'],
        [M(`[${iv('x')}, ${iv('y')}] = ${Vh(p)} + ${iv('t')}${Vh(d)}  ⟹  ${iv('x')} = ${Aff(p[0], [[d[0], 't']])},  ${iv('y')} = ${Aff(p[1], [[d[1], 't']])}`), 'Vectorial y, fila a fila, paramétricas. Con otro punto o un múltiplo del director también es correcta.']] }] };
});

// ===== L15 · Rectas en el espacio =====
function line3(r) { const p = rv(r, 3, -4, 4); let d; do d = rvnz(r, 3, -3, 3); while (vgcd(d) !== 1); return { p, d }; }
const par3 = (p, d) => M(XYZ.map((v, i) => iv(v) + ' = ' + Aff(p[i], [[d[i], 't']])).join(',  '));
const vecForm3 = (p, d) => M(`[${iv('x')}, ${iv('y')}, ${iv('z')}] = ${Vh(p)} + ${iv('t')}${Vh(d)}`);
function vectLine3(p, d, q, sol, extra = {}) {
  return Object.assign({ type: 'vec', q, form: fLine(3), check: x => onLine(x.slice(0, 3), p, d) && isParallel(x.slice(3), d.map(val)), sample: [...p, ...d].map(val), ansH: vecForm3(p, d), sol }, extra);
}
bankTF('l15.tf', 'L15', [
  [`En ℝ³, ${M(Lin([2, 1, -1], 3))} es una recta.`, false, 'Una sola ecuación ax + by + cz = d en ℝ³ es un plano. La recta se escribe en vectorial o paramétricas, o como corte de dos planos.'],
  ['Por dos puntos distintos pasa una única recta.', true, 'Y su director es la flecha que va de uno a otro.'],
  ['En ℝ³ una recta tiene una “forma general” con una sola ecuación, como en el plano.', false, 'En ℝ³ eso sería un plano.'],
  ['En una recta en paramétricas, si una coordenada no lleva t, su componente del director es 0.', true, 'Por ejemplo, x = 2, y = 1 − t, z = t tiene director [0, −1, 1].'],
]);
gen('l15.leer', 'L15', r => {
  const { p, d } = line3(r);
  if (r.chance(0.6)) return { type: 'vec', q: `Lee un vector director de la recta ${par3(p, d)}.`, form: fV(3), check: x => isParallel(x, d), sample: d, ansH: M(Bd + ' = ' + Vh(d)),
    sol: [[M(Bd + ' = ' + Vh(d)), 'Son los números que multiplican a t, en orden. Si una coordenada no lleva t, su componente es 0. Cualquier múltiplo también vale.']] };
  return { type: 'vec', q: `Da un punto de la recta ${par3(p, d)}.`, form: fP(3), check: x => onLine(x, p, d), sample: p, ansH: M(Ph(p)),
    sol: [[M(`${iv('t')} = 0  ⟹  ${Ph(p)}`), 'Con t = 0 te quedas con los números sueltos. Con cualquier otro valor de t sale otro punto igual de válido.']] };
});
gen('l15.dir2p', 'L15', r => {
  const P0 = rv(r, 3, -4, 4), d = rvnz(r, 3, -3, 3), Q = vadd(P0, d);
  return { type: 'vec', q: `Da un vector director de la recta que pasa por ${M('P = ' + Ph(P0))} y ${M('Q = ' + Ph(Q))}.`, form: fV(3), check: x => isParallel(x, d), sample: d, ansH: M(Bd + ' = ' + Vh(d)),
    sol: [[M(`${Bd} = ${ar('PQ')} = [${Q.map((x, i) => N(x) + SUB + P(P0[i])).join(', ')}] = ${Vh(d)}`), 'Con dos puntos, el director es la flecha que va de uno a otro: final menos inicial.']] };
});
gen('l15.vect2p', 'L15', r => {
  const P0 = rv(r, 3, -4, 4), d = rvnz(r, 3, -3, 3), Q = vadd(P0, d);
  return vectLine3(P0, d, `Escribe en forma vectorial la recta que pasa por ${M('P = ' + Ph(P0))} y ${M('Q = ' + Ph(Q))}.`, [
    [M(`${Bd} = ${ar('PQ')} = [${Q.map((x, i) => N(x) + SUB + P(P0[i])).join(', ')}] = ${Vh(d)}`), 'Con dos puntos, el director es la flecha que va de uno a otro.'],
    [vecForm3(P0, d), 'Uso P como punto (también valdría Q).'],
    [M(`${iv('t')} = 1:  ${Ph(Q)} = Q ✓`), 'Comprobación: con t = 1 sale el otro punto.']]);
});
gen('l15.pert', 'L15', r => {
  const { p, d } = line3(r), t0 = r.pick([-2, -1, 1, 2, 3]), yes = r.chance(0.5);
  let R = vadd(p, vsc(t0, d));
  if (!yes) { let R2; do { R2 = R.slice(); R2[r.int(0, 2)] += r.pick([-1, 1]); } while (onLine(R2, p, d)); R = R2; }
  const i0 = d.findIndex(x => x !== 0), t = new Fr(R[i0] - p[i0], d[i0]);
  const lines = [0, 1, 2].map(k => { const vk = F(p[k]).add(t.mul(d[k])); return `${iv(XYZ[k])}: ${N(p[k])}${ADD}${P(d[k])}·${P(t)} = ${N(vk)} ${near(vk.v, R[k]) ? '✓' : '≠ ' + N(R[k])}`; });
  return ynMC(`¿Está el punto ${M('R = ' + Ph(R))} en la recta ${par3(p, d)}?`, yes, [
    [M(`${N(R[i0])} = ${Aff(p[i0], [[d[i0], 't']])}  ⟹  ${iv('t')} = ${N(t)}`), 'Saco t de una ecuación que tenga t.'],
    [M(lines.join('<br>')), yes ? 'Con ese mismo t cuadran las tres coordenadas: el punto sí está.' : 'Con ese t alguna coordenada no cuadra: el punto no está.']]);
});
gen('l15.tpt', 'L15', r => {
  const { p, d } = line3(r), t = r.pick([-2, -1, 2, 3]), X = vadd(p, vsc(t, d));
  return { type: 'vec', q: `¿Qué punto de la recta ${par3(p, d)} corresponde a ${M(iv('t') + ' = ' + N(t))}?`, form: fP(3), expect: X, ansH: M(Ph(X)),
    sol: [[M(XYZ.map((v, i) => `${iv(v)} = ${N(p[i])}${ADD}${P(d[i])}·${P(t)} = ${N(X[i])}`).join('<br>')), 'Sustituyo t en las tres ecuaciones.']] };
});
gen('prof.e12', 'L15', () => vectLine3([1, -5, 1], [-3, 2, -1], `Calcula la forma vectorial de la recta en ℝ³ que contiene al punto ${M('P = (1, ' + MINUS + '5, 1)')} y es paralela a ${M(Bd + ' = [' + MINUS + '3, 2, ' + MINUS + '1]')}.`, [
  [vecForm3([1, -5, 1], [-3, 2, -1]), 'Forma vectorial: punto más t por director. Cualquier múltiplo de d también vale.'],
  [par3([1, -5, 1], [-3, 2, -1]), 'Paramétricas: cada fila es coordenada del punto + t por componente del director.']], { tag: 'Ejercicio 12 del profesor' }), { sib: 'l15.vectpd' });
gen('l15.vectpd', 'L15', r => {
  const { p, d } = line3(r);
  return vectLine3(p, d, `Calcula la forma vectorial de la recta en ℝ³ que contiene al punto ${M('P = ' + Ph(p))} y es paralela a ${M(Bd + ' = ' + Vh(d))}.`, [
    [vecForm3(p, d), 'Forma vectorial: punto más t por director. Cualquier múltiplo de d también vale.'],
    [par3(p, d), 'Paramétricas: cada fila es coordenada del punto + t por componente del director.']]);
});
gen('prof.e20', 'L15', () => vectLine3([-1, 2, 1], [3, 1, 0], `Calcula la forma vectorial de la recta en ℝ³ que pasa por ${M('P = (' + MINUS + '1, 2, 1)')} y ${M('Q = (2, 3, 1)')}.`, [
  [M(`${Bd} = ${ar('PQ')} = [2${SUB}(${MINUS}1), 3${SUB}2, 1${SUB}1] = [3, 1, 0]`), 'Con dos puntos, el director es la flecha que va de uno a otro.'],
  [vecForm3([-1, 2, 1], [3, 1, 0]), 'Uso P como punto (también valdría Q).'],
  [M(`${iv('t')} = 1:  (2, 3, 1) = Q ✓`), 'Comprobación.']], { tag: 'Ejercicio 20 del profesor (propuesto)' }), { sib: 'l15.vect2p' });

// ===== L16 · Planos en el espacio =====
const lead = n => ((n.find(x => x !== 0) || 1) < 0 ? n.map(x => -x) : n);
function plane(r) { let n; do n = rvnz(r, 3, -4, 4); while (vgcd(n) !== 1 || n.filter(x => x !== 0).length < 2); n = lead(n); const p = rv(r, 3, -3, 3); return { n, p, d: vdot(n, p) }; }
const eq3 = Pl => M(Lin(Pl.n, Pl.d));
bankMC('l16.param', 'L16', [
  ['¿Cuántos parámetros tiene la ecuación vectorial de un plano?', ['Dos: en un plano te mueves en dos direcciones independientes', 'Uno, como la recta', 'Tres, uno por coordenada', 'Ninguno'], 'Como en un folio: a lo ancho y a lo largo. Un plano tiene dos grados de libertad.'],
  ['¿Por qué las dos direcciones u y v de un plano no pueden ser paralelas?', ['Porque serían la misma dirección y solo tendrías una recta', 'Porque su producto vectorial sería muy grande', 'Sí pueden serlo', 'Porque el plano no tendría normal'], 'Hacen falta dos direcciones distintas del plano.'],
  ['En la ecuación general ax + by + cz = d de un plano, ¿qué es [a, b, c]?', ['Un vector normal (perpendicular al plano)', 'Un vector del plano', 'Un punto del plano', 'La distancia al origen'], 'Igual que en las rectas del plano: los coeficientes de las letras forman el normal.'],
]);
gen('l16.normal', 'L16', r => {
  const Pl = plane(r);
  return { type: 'vec', q: `Da un vector normal del plano ${eq3(Pl)}.`, form: fV(3), check: x => isParallel(x, Pl.n), sample: Pl.n, ansH: M(Bn + ' = ' + Vh(Pl.n)),
    sol: [[M(Bn + ' = ' + Vh(Pl.n)), 'Los coeficientes de x, y, z, en orden (0 si falta una letra). Cualquier múltiplo también vale.']] };
});
gen('l16.pert', 'L16', r => {
  const Pl = plane(r); let B = rv(r, 3, -3, 3); const yes = r.chance(0.5);
  if (yes) B = Pl.p; else while (vdot(Pl.n, B) === Pl.d) B = rv(r, 3, -3, 3);
  const s = vdot(Pl.n, B);
  return ynMC(`¿Está el punto ${M(Ph(B))} en el plano ${eq3(Pl)}?`, yes, [[M(`${dotExpand(Pl.n, B)} = ${N(s)}`), yes ? `Sale ${sInt(Pl.d)}: el punto cumple la ecuación, está en el plano.` : `Sale ${sInt(s)} y no ${sInt(Pl.d)}: no está en el plano.`]]);
});
gen('l16.pn', 'L16', r => {
  const Pl = plane(r);
  return { type: 'vec', q: `Escribe el plano que pasa por ${M('P = ' + Ph(Pl.p))} con vector normal ${M(Bn + ' = ' + Vh(Pl.n))}.`, form: [M(Lin(Pl.n) + ' = '), 0], expect: [Pl.d], ansH: eq3(Pl),
    sol: [[M(`${Bn}·${Bx} = ${Bn}·${Bp}`), 'Forma normal.'], [M(`${Lin(Pl.n)} = ${dotExpand(Pl.n, Pl.p)} = ${N(Pl.d)}`), 'La parte izquierda sale del normal y el número de la derecha, de sustituir P.']] };
});
gen('l16.par', 'L16', r => {
  const Pl = plane(r); let B; do B = rv(r, 3, -3, 3); while (vdot(Pl.n, B) === Pl.d);
  const d2 = vdot(Pl.n, B);
  return { type: 'vec', q: `Escribe el plano paralelo a ${eq3(Pl)} que pasa por ${M(Ph(B))}.`, form: [M(Lin(Pl.n) + ' = '), 0], expect: [d2], ansH: M(Lin(Pl.n, d2)),
    sol: [[M(`${Lin(Pl.n)} = ${dotExpand(Pl.n, B)} = ${N(d2)}`), 'Paralelo: el mismo normal y un término independiente nuevo, que sale de sustituir el punto.']] };
});
gen('l16.pos', 'L16', r => {
  const A = plane(r), kind = r.int(0, 3); let n2, d2, k = 1;
  if (kind === 0) { k = r.pick([2, -1, 3, -2]); n2 = vsc(k, A.n); do d2 = r.int(-12, 12); while (d2 === k * A.d); }
  else if (kind === 1) { k = r.pick([2, -1, 3]); n2 = vsc(k, A.n); d2 = k * A.d; }
  else if (kind === 2) { let c; do c = vcross(A.n, rvnz(r, 3, -2, 2)); while (vzero(c)); n2 = vred(c); d2 = r.int(-6, 6); }
  else { do n2 = rvnz(r, 3, -3, 3); while (isParallel(n2, A.n) || vdot(n2, A.n) === 0); d2 = r.int(-6, 6); }
  const sol = kind === 0 ? [[M(`${Vh(n2)} = ${N(k)}·${Vh(A.n)}`), 'Normales proporcionales: planos paralelos. El término independiente no va en la misma proporción, así que no son el mismo plano.']]
    : kind === 1 ? [[M(`${Lin(n2, d2)} = ${N(k)}·(${Lin(A.n, A.d)})`), 'Todo va en la misma proporción, también el término independiente: es la misma ecuación multiplicada, el mismo plano.']]
      : kind === 2 ? [[M(`${Vh(A.n)}·${Vh(n2)} = 0`), 'Normales perpendiculares: los planos son perpendiculares. Se cortan en una recta.']]
        : [[M(`${Vh(A.n)}·${Vh(n2)} = ${N(vdot(A.n, n2))} ≠ 0`), 'Los normales no son proporcionales (así que se cortan en una recta) ni perpendiculares.']];
  return { type: 'mc', keep: true, q: `¿Cuál es la posición relativa de ${eq3(A)} y ${M(Lin(n2, d2))}?`,
    opts: ['Paralelos: no se tocan', 'Son el mismo plano', 'Se cortan y son perpendiculares', 'Se cortan en una recta, sin ser perpendiculares'], correct: kind, sol };
});
function plane3Steps(P0, Q, R) {
  const u = vsub(Q, P0), v = vsub(R, P0), n = vcross(u, v), nr = vred(n), d = vdot(nr, P0), same = nr.join() === n.join();
  return [
    { type: 'vec', q: `Primera dirección: ${M(ar('PQ'))}.`, form: fV(3), expect: u, ansH: M(ar('PQ') + ' = ' + Vh(u)), sol: [[M(`${ar('PQ')} = Q${SUB}P = ${Vh(u)}`), 'Flecha desde un punto a otro: final menos inicial.']] },
    { type: 'vec', q: `Segunda dirección: ${M(ar('PR'))}.`, form: fV(3), expect: v, ansH: M(ar('PR') + ' = ' + Vh(v)), sol: [[M(`${ar('PR')} = R${SUB}P = ${Vh(v)}`), 'Desde el mismo punto P al tercero.']] },
    { type: 'vec', q: `Vector normal: ${M(Bn + ' = ' + ar('PQ') + '×' + ar('PR'))}. Vale cualquier múltiplo.`, form: fV(3), check: x => isParallel(x, n), sample: n, ansH: M(Bn + ' = ' + Vh(n) + (same ? '' : ', o simplificado ' + Vh(nr))),
      sol: [[M(`${Bu} = ${Vh(u)},  ${Bv} = ${Vh(v)}`), 'Llamo u y v a las dos direcciones.'], ...crossSol(u, v).slice(0, 3),
        [M(`${Bn} = ${Vh(n)}` + (same ? '' : `  ~  ${Vh(nr)}`)), 'Es perpendicular a las dos direcciones, así que perpendicular al plano.' + (same ? '' : ' Puedo simplificarlo dividiendo.')]] },
    { type: 'vec', q: 'Ecuación general del plano.', form: fEq(XYZ), check: x => propEq(x, [...nr, d], 3), sample: [...nr, d], ansH: M(Lin(nr, d)),
      sol: [[M(`${iv('d')} = ${Bn}·P = ${dotExpand(nr, P0)} = ${N(d)}`), 'El término independiente sale de sustituir un punto del plano.'],
        [M(Lin(nr, d)), 'Forma general. Comprobación: Q y R también la cumplen.'],
        [M(`[${iv('x')}, ${iv('y')}, ${iv('z')}] = ${Vh(P0)} + ${iv('s')}${Vh(u)} + ${iv('t')}${Vh(v)}`), 'Y la forma vectorial: un punto y las dos direcciones, con dos parámetros.']] }];
}
gen('l16.chain3p', 'L16', r => {
  let P0, u, v;
  do { P0 = rv(r, 3, -3, 3); u = rvnz(r, 3, -2, 2); v = rvnz(r, 3, -2, 2); } while (vzero(vcross(u, v)) || Math.max(...vcross(u, v).map(Math.abs)) > 8);
  const Q = vadd(P0, u), R = vadd(P0, v);
  return { type: 'chain', fig: { k: 'plane' }, q: `Plano que pasa por ${M('P = ' + Ph(P0))}, ${M('Q = ' + Ph(Q))} y ${M('R = ' + Ph(R))}.`, steps: plane3Steps(P0, Q, R) };
});
gen('prof.e13', 'L16', () => ({ type: 'chain', tag: 'Ejercicio 13 del profesor', fig: { k: 'plane' }, q: `Obtén las ecuaciones del plano que contiene a ${M('P = (3, 0, 0)')}, ${M('Q = (0, 1, 0)')} y ${M('R = (0, 0, 2)')}.`, steps: plane3Steps([3, 0, 0], [0, 1, 0], [0, 0, 2]) }), { sib: 'l16.chain3p' });

// ===== L17 · El método de eliminación =====
bankMC('l17.perm', 'L17', [
  ['¿Cuál de estas operaciones NO está permitida en el método de eliminación?', ['Multiplicar una ecuación por 0', 'Intercambiar dos ecuaciones', 'Multiplicar una ecuación por −2', 'Sumar a la segunda ecuación 3 veces la primera'], 'Multiplicar por 0 borra la ecuación y se pierde información. Por un número distinto de 0, sí.'],
  ['¿Qué significa E2 ← E2 − 3E1?', ['La nueva ecuación 2 es la ecuación 2 menos 3 veces la ecuación 1', 'La ecuación 1 menos 3 veces la 2', 'Multiplicar la ecuación 2 por −3', 'Intercambiar las ecuaciones 1 y 2'], 'La flecha indica qué ecuación se sustituye por el resultado.'],
  ['¿Por qué estas operaciones no cambian las soluciones?', ['Porque se hace lo mismo a los dos lados y se pueden deshacer', 'Porque siempre dan cero', 'Sí las cambian, por eso hay que comprobar', 'Porque solo cambian la x'], 'Como en una balanza: si quitas lo mismo de los dos platos, sigue equilibrada.'],
]);
const sysH = rows => Sys(rows.map(e => M(Lin(e.slice(0, e.length - 1), e[e.length - 1], XYZ.slice(0, e.length - 1)))));
gen('l17.factor', 'L17', r => {
  const a1 = r.pick([1, 1, 1, 2]), k = r.pick([2, 3, -1, -2, 4, -3]);
  const E1 = [a1, r.nz(-4, 4), r.int(-4, 4), r.int(-6, 6)], E2 = [a1 * k, r.int(-5, 5), r.int(-5, 5), r.int(-9, 9)];
  return { type: 'num', q: `${sysH([E1, E2])}<br>¿Por qué número multiplicas ${M(E(1))} para quitar la ${M(iv('x'))} de la segunda? ${M(E(2) + ' ← ' + E(2) + SUB + '□·' + E(1))}`, pre: M('□ ='), ans: k,
    sol: [[M(`${Lin([a1 * k], undefined, ['x'])}${SUB}${P(k)}·${Lin([a1], undefined, ['x'])} = 0`), `La segunda tiene ${sInt(a1 * k)}x y la primera ${sInt(a1)}x: ${sInt(a1 * k)} entre ${sInt(a1)} es ${sInt(k)}.`]] };
});
function restaParts(E1, E2, k) { return E2.map((x, i) => x - k * E1[i]); }
function restaSol(E1, E2, k, vars = XYZ) {
  const R = restaParts(E1, E2, k), out = [];
  vars.forEach((v, i) => { out.push([M(`${iv(v)}: ${N(E2[i])}${SUB}${P(k)}·${P(E1[i])} = ${N(R[i])}`), i === 0 ? 'La x desaparece: para eso se elige el número.' : 'Columna a columna.']); });
  const j = vars.length;
  out.push([M(`${N(E2[j])}${SUB}${P(k)}·${P(E1[j])} = ${N(R[j])}`), 'La última columna, por separado: es donde más se falla.']);
  return out;
}
gen('l17.resta', 'L17', r => {
  let E1, E2, k, R;
  do { k = r.pick([2, 3, -1, -2, -3]); E1 = [1, r.nz(-3, 3), r.nz(-3, 3), r.nz(-5, 5)]; E2 = [k, r.int(-5, 5), r.int(-5, 5), r.int(-9, 9)]; R = restaParts(E1, E2, k); } while (R[1] === 0 && R[2] === 0);
  return { type: 'vec', q: `${sysH([E1, E2])}<br>Calcula ${opH(k)}.`, form: fEq(['y', 'z']), expect: [R[1], R[2], R[3]], ansH: M(Lin([R[1], R[2]], R[3], ['y', 'z'])), sol: restaSol(E1, E2, k) };
});
gen('l17.mat', 'L17', r => {
  const n = r.pick([2, 3]); const rows = [];
  for (let i = 0; i < n; i++) rows.push([r.nz(-4, 4), r.nz(-4, 4), r.nz(-4, 4), r.int(-6, 6)]);
  const zi = r.int(0, n - 1), zc = r.int(0, 2); rows[zi][zc] = 0;
  if (rows.every(x => x[3] === 0)) rows[0][3] = 5;
  const d1 = rows.map(x => x.slice()); { let i, j; do { i = r.int(0, n - 1); j = r.int(0, 2); } while (d1[i][j] === 0); d1[i][j] = -d1[i][j]; }
  const d2 = rows.map(x => [x[0], x[1], x[2], -x[3]]);
  const d3 = rows.map(x => x.slice()); { const j2 = zc === 2 ? 1 : zc + 1; [d3[zi][zc], d3[zi][j2]] = [d3[zi][j2], d3[zi][zc]]; }
  const opts = [rows, d1, d2, d3].filter((m, i, all) => all.findIndex(o => JSON.stringify(o) === JSON.stringify(m)) === i).map(m => Mat(m));
  return { type: 'mc', q: `¿Cuál es la matriz ampliada de este sistema?<br>${sysH(rows)}`, opts, correct: 0,
    sol: [[Mat(rows), 'Cada fila es una ecuación y cada columna una incógnita (x, y, z); la barra separa el lado derecho. Si falta una letra, su hueco lleva un 0.']] };
});
gen('l17.spot', 'L17', r => {
  let E1, E2, k, R, wrong;
  do { k = r.pick([2, 3, -2, -3]); E1 = [1, r.nz(-3, 3), r.nz(-3, 3), r.nz(-5, 5)]; E2 = [k, r.int(-5, 5), r.int(-5, 5), r.int(-9, 9)]; R = restaParts(E1, E2, k); } while (R[1] === 0 && R[2] === 0);
  wrong = r.pick([1, 2, 3, 3]);
  const lines = [0, 1, 2, 3].map(i => { const lab = i < 3 ? iv(XYZ[i]) + ':' : 'derecha:'; const v = i === wrong ? E2[i] + k * E1[i] : R[i]; return M(`${lab} ${N(E2[i])}${SUB}${P(k)}·${P(E1[i])} = ${N(v)}`); });
  return { type: 'spot', q: `${sysH([E1, E2])}<br>Al hacer ${opH(k)} alguien ha cometido un error. Toca la línea equivocada.`, lines, wrong,
    sol: [[M(`${N(E2[wrong])}${SUB}${P(k)}·${P(E1[wrong])} = ${N(E2[wrong])}${SUB}${P(k * E1[wrong])} = ${N(R[wrong])}`), 'Se ha restado con el signo cambiado. Escribe siempre el producto entre paréntesis antes de restarlo.']] };
});
gen('l17.2x2', 'L17', r => {
  let x, y, p, a, b;
  do { x = r.int(-3, 3); y = r.int(-3, 3); p = r.nz(-3, 3); a = r.pick([2, 3, -1, -2]); b = r.nz(-4, 4); } while (b - a * p === 0);
  const c1 = x + p * y, c2 = a * x + b * y, m = b - a * p, rr = c2 - a * c1;
  return { type: 'chain', q: sysH([[1, p, c1], [a, b, c2]]), steps: [
    { type: 'vec', q: `Quita la ${M(iv('x'))} de la segunda: ${opH(a)}.`, form: fEq(['y']), expect: [m, rr], ansH: M(Lin([m], rr, ['y'])), sol: restaSol([1, p, c1], [a, b, c2], a, ['x', 'y']) },
    { type: 'num', q: `Despeja ${M(iv('y'))}.`, pre: M(iv('y') + ' ='), ans: y, sol: [[M(`${iv('y')} = ${Fh(N(rr), N(m))} = ${N(y)}`), 'Divido entre el número que acompaña a la y.']] },
    { type: 'num', q: `Sustituye en la primera y despeja ${M(iv('x'))}.`, pre: M(iv('x') + ' ='), ans: x, sol: [[M(`${iv('x')}${ADD}${P(p)}·${P(y)} = ${N(c1)}  ⟹  ${iv('x')} = ${N(x)}`), 'Hacia atrás: con la y ya conocida.']] }] };
});

// ===== L18 · Recta intersección de dos planos =====
function intBuild(o) {
  const { x0, y0, p, q, a, m, n } = o, b = -p - a * q, c1 = x0 + a * y0, rz = -m * p - n * q, c2 = m * x0 + n * y0;
  return Object.assign({ E1: [1, a, b, c1], E2: [m, n, rz, c2], piv: n - m * a }, o);
}
function intParams(r) {
  for (;;) {
    const o = { x0: r.int(-3, 4), y0: r.int(-3, 3), p: r.nz(-3, 3), q: r.nz(-2, 2), a: r.int(-2, 2), m: r.pick([2, 3, -1, -2]), n: r.int(-3, 3) };
    const B = intBuild(o);
    if (B.piv === 0 || Math.abs(B.E1[2]) > 6 || Math.abs(B.E2[2]) > 9 || Math.abs(B.E2[3]) > 15) continue;
    return o;
  }
}
const lineXYZ = (x0, p, y0, q) => M(`${iv('x')} = ${Aff(x0, [[p, 't']])},  ${iv('y')} = ${Aff(y0, [[q, 't']])},  ${iv('z')} = ${iv('t')}`);
function intSteps(o) {
  const B = intBuild(o), { E1, E2, piv, x0, y0, p, q, a, m } = B;
  const steps = [
    { type: 'vec', q: `Quita la ${M(iv('x'))} de la segunda: ${opH(m)}.`, form: fEq(['y', 'z']), expect: [piv, -q * piv, y0 * piv], ansH: M(Lin([piv, -q * piv], y0 * piv, ['y', 'z'])), sol: restaSol(E1, E2, m) },
    { type: 'vec', q: `Divide para que la ${M(iv('y'))} quede con un 1.`, form: [M(iv('y') + ' + '), 0, M(iv('z') + ' = '), 1], expect: [-q, y0], ansH: M(Lin([1, -q], y0, ['y', 'z'])),
      sol: [[M(Lin([1, -q], y0, ['y', 'z'])), `Divido toda la ecuación entre ${sInt(piv)}, también el lado derecho.`]] }];
  if (a !== 0) steps.push({ type: 'vec', q: `Quita la ${M(iv('y'))} de la primera: ${opH(a, 1, 2)}.`, form: [M(iv('x') + ' + '), 0, M(iv('z') + ' = '), 1], expect: [-p, x0], ansH: M(Lin([1, 0, -p], x0)),
    sol: [[M(`(${Lin(E1.slice(0, 3))})${SUB}${P(a)}·(${Lin([1, -q], undefined, ['y', 'z'])}) = ${N(E1[3])}${SUB}${P(a)}·${P(y0)}`), 'Resto a la primera la nueva segunda multiplicada, para que se quede solo con x y z.'],
      [M(Lin([1, 0, -p], x0)), 'La y ha desaparecido de la primera.']] });
  steps.push({ type: 'vec', q: `Escribe las paramétricas, llamando ${M(iv('t'))} a la ${M(iv('z'))}.`,
    form: [M(iv('x') + ' = '), 0, ' + ', 1, M(iv('t') + ',   ' + iv('y') + ' = '), 2, ' + ', 3, M(iv('t') + ',   ' + iv('z') + ' = ' + iv('t'))], expect: [x0, p, y0, q], ansH: lineXYZ(x0, p, y0, q),
    sol: [[M(`${iv('x')} = ${Aff(x0, [[p, 'z']])},  ${iv('y')} = ${Aff(y0, [[q, 'z']])}`), 'Paso la z al otro lado en cada ecuación.'],
      [lineXYZ(x0, p, y0, q), 'Llamo t a la z: son las paramétricas de la recta.'],
      [M(`${iv('t')} = 0: ${Ph([x0, y0, 0])},   ${iv('t')} = 1: ${Ph([x0 + p, y0 + q, 1])}`), 'Comprobación: estos dos puntos tienen que cumplir las dos ecuaciones originales.']] });
  return { B, steps };
}
gen('l18.chain', 'L18', r => { const o = intParams(r), { B, steps } = intSteps(o); return { type: 'chain', q: `Recta intersección de los planos ${sysH([B.E1, B.E2])}`, steps }; });
gen('prof.e14', 'L18', () => { const { B, steps } = intSteps({ x0: 3, y0: -2, p: -3, q: 1, a: 2, m: 3, n: 2 }); return { type: 'chain', tag: 'Ejercicio 14 del profesor', q: `Halla las paramétricas de la recta intersección de ${sysH([B.E1, B.E2])}`, steps }; }, { sib: 'l18.chain' });
gen('prof.e21', 'L18', () => { const { steps } = intSteps({ x0: 5, y0: -3, p: -3, q: 1, a: 2, m: 3, n: 4 }); return { type: 'chain', tag: 'Ejercicio 21 del profesor (propuesto)', q: `Obtén mediante Gauss-Jordan las paramétricas de la recta intersección de ${M(Lin([1, 2, 1], -1))} y ${M(Lin([3, 4, 5], 3))}. Matriz ampliada: ${Mat([[1, 2, 1, -1], [3, 4, 5, 3]])}`, steps }; }, { sib: 'l18.chain' });
gen('l18.vect', 'L18', r => {
  const B = intBuild(intParams(r)), n1 = B.E1.slice(0, 3), n2 = B.E2.slice(0, 3), dir = vcross(n1, n2);
  return { type: 'vec', q: `Da la recta intersección de ${sysH([B.E1, B.E2])} en forma vectorial.`, form: fLine(3),
    check: x => satisfies(x.slice(0, 3), n1, B.E1[3]) && satisfies(x.slice(0, 3), n2, B.E2[3]) && isParallel(x.slice(3), dir), sample: [B.x0, B.y0, 0, B.p, B.q, 1], ansH: vecForm3([B.x0, B.y0, 0], [B.p, B.q, 1]),
    sol: [[lineXYZ(B.x0, B.p, B.y0, B.q), 'Elimina x de la segunda, deja la y con un 1, elimina y de la primera y llama t a la z.'],
      [vecForm3([B.x0, B.y0, 0], [B.p, B.q, 1]), 'Números sueltos al punto, lo que va con t al director. Cualquier punto de la recta y cualquier múltiplo del director valen.']] };
});
gen('l18.tf', 'L18', r => {
  const B = intBuild(intParams(r)), ok = r.chance(0.5);
  let x0 = B.x0, p = B.p, y0 = B.y0, q = B.q;
  if (!ok) { if (r.chance(0.5)) q = -q; else y0 += r.pick([-1, 1]); }
  const pts = [[x0, y0, 0], [x0 + p, y0 + q, 1]];
  const chk = pts.map(pt => `${Ph(pt)}: ${N(vdot(B.E1.slice(0, 3), pt))} ${vdot(B.E1.slice(0, 3), pt) === B.E1[3] ? '✓' : '≠ ' + N(B.E1[3])},  ${N(vdot(B.E2.slice(0, 3), pt))} ${vdot(B.E2.slice(0, 3), pt) === B.E2[3] ? '✓' : '≠ ' + N(B.E2[3])}`);
  return { type: 'tf', q: `La recta ${lineXYZ(x0, p, y0, q)} es la intersección de ${sysH([B.E1, B.E2])}`, correct: ok,
    sol: [[M(chk.join('<br>')), ok ? 'Con t = 0 y t = 1, los puntos cumplen las dos ecuaciones: es la recta.' : 'Algún punto no cumple las ecuaciones: hay un error (muchas veces, un signo).'], [lineXYZ(B.x0, B.p, B.y0, B.q), 'La recta correcta.']] };
});
bankMC('l18.que', 'L18', [
  ['Dos planos que no son paralelos se cortan en…', ['Una recta', 'Un punto', 'Nada', 'Otro plano'], 'Como dos paredes de una habitación se cortan en la arista vertical de la esquina.'],
  ['Dos ecuaciones con tres incógnitas: ¿cuántas letras quedan libres?', ['Una, que hace de parámetro', 'Ninguna', 'Dos', 'Tres'], 'No hay una única solución: una letra queda libre. El plan es dejar x e y en función de z y llamar t a la z.'],
  ['¿Cómo compruebas las paramétricas de la recta intersección?', ['Sustituyendo dos valores de t en las dos ecuaciones originales', 'Calculando el producto vectorial', 'Mirando si t es positivo', 'No se puede comprobar'], 'Por ejemplo t = 0 y t = 1: los dos puntos tienen que cumplir las dos ecuaciones.'],
]);

// ===== L19 · Tres planos: posiciones relativas =====
const sys3 = rows => sysH(rows);
function punto3Build(o) { const E1 = [1, o.p, o.q], E2 = vadd(vsc(o.a, E1), [0, o.m[0], o.m[1]]), E3 = vadd(vsc(o.b, E1), [0, o.m[2], o.m[3]]); return [E1, E2, E3].map(e => [...e, vdot(e, o.S)]); }
function punto3Params(r) {
  for (;;) {
    const o = { S: rv(r, 3, -3, 3), p: r.int(-2, 2), q: r.int(-2, 2), a: r.pick([1, 2, 3, -1, -2]), b: r.pick([1, 2, 3, -1, -2]), m: [r.nz(-3, 3), r.int(-3, 3), r.int(-3, 3), r.nz(-3, 3)] };
    if (o.a === o.b || o.m[0] * o.m[3] - o.m[1] * o.m[2] === 0) continue;
    const Es = punto3Build(o); if (Es.some(e => e.some(x => Math.abs(x) > 14))) continue;
    return o;
  }
}
const CLASES = ['Compatible determinado: los tres planos se cortan en un punto', 'Compatible indeterminado: los tres planos comparten una recta', 'Incompatible: no hay ningún punto común'];
function punto3Steps(o) {
  const Es = punto3Build(o), S = o.S, e2 = [o.m[0], o.m[1], o.m[0] * S[1] + o.m[1] * S[2]], e3 = [o.m[2], o.m[3], o.m[2] * S[1] + o.m[3] * S[2]];
  return { Es, steps: [
    { type: 'vec', q: `Quita la ${M(iv('x'))} de la segunda: ${opH(o.a)}.`, form: fEq(['y', 'z']), expect: e2, ansH: M(Lin([e2[0], e2[1]], e2[2], ['y', 'z'])), sol: restaSol(Es[0], Es[1], o.a) },
    { type: 'vec', q: `Quita la ${M(iv('x'))} de la tercera: ${opH(o.b, 3, 1)}.`, form: fEq(['y', 'z']), expect: e3, ansH: M(Lin([e3[0], e3[1]], e3[2], ['y', 'z'])), sol: restaSol(Es[0], Es[2], o.b) },
    { type: 'vec', q: 'Termina de resolver. ¿Cuál es la solución?', form: fP(3), expect: S, ansH: M(Ph(S)),
      sol: [[sysH([[e2[0], e2[1], e2[2]], [e3[0], e3[1], e3[2]]].map(x => [0, ...x])), 'Con estas dos, quita la y de una de ellas: te queda una sola incógnita.'],
        [M(`${iv('z')} = ${N(S[2])},  ${iv('y')} = ${N(S[1])},  ${iv('x')} = ${N(S[0])}`), 'Y hacia atrás: sustituyes en las ecuaciones anteriores.'],
        [M(Es.map(e => `${dotExpand(e.slice(0, 3), S)} = ${N(e[3])} ✓`).join('<br>')), 'Comprobación en las tres ecuaciones originales.']] },
    { type: 'mc', keep: true, q: '¿Cómo se clasifica el sistema?', opts: CLASES, correct: 0, sol: [[CLASES[0], 'Cada letra acaba con un valor concreto: un único punto. Es la esquina de una habitación.']] }] };
}
gen('l19.punto', 'L19', r => { const { Es, steps } = punto3Steps(punto3Params(r)); return { type: 'chain', q: `Resuelve e interpreta: ${sys3(Es)}`, steps }; });
gen('prof.e15', 'L19', () => { const { Es, steps } = punto3Steps({ S: [1, 3, 5], p: 1, q: 1, a: 2, b: 2, m: [-3, 1, -1, -3] }); return { type: 'chain', tag: 'Ejercicio 15 del profesor', q: `Deduce la posición relativa de estos tres planos: ${sys3(Es)}`, steps }; }, { sib: 'l19.punto' });
function recta3Build(o) { const E1 = [1, o.p, o.q], E2 = vadd(vsc(o.a, E1), [0, o.m[0], o.m[1]]), E3 = vadd(vsc(o.al, E1), vsc(o.be, E2)); return [E1, E2, E3].map(e => [...e, vdot(e, o.S)]); }
function recta3Params(r) {
  for (;;) {
    const o = { S: rv(r, 3, -3, 3), p: r.int(-2, 2), q: r.int(-2, 2), a: r.pick([1, 2, -1, -2, 3]), m: [r.int(-3, 3), r.int(-3, 3)], al: r.int(-2, 2), be: r.pick([1, -1, 2]) };
    if (vzero(o.m) || (o.al === 0 && o.be === 1)) continue;
    const Es = recta3Build(o); if (Es.some(e => e.some(x => Math.abs(x) > 14)) || vzero(Es[2].slice(0, 3))) continue;
    return o;
  }
}
const combE = (al, be) => M(`${E(3)} = ${CombH([al, be], [E(1), E(2)])}`);
function recta3Steps(o) {
  const Es = recta3Build(o);
  return { Es, steps: [
    { type: 'mc', keep: true, q: 'Al eliminar la x de la segunda y de la tercera, y luego la y de la tercera, ¿qué pasa con la última ecuación?', opts: ['Queda 0 = 0: sobra una ecuación', 'Sale un valor concreto para z', 'Queda 0 = un número distinto de 0'], correct: 0,
      sol: [[combE(o.al, o.be), 'La tercera ecuación es combinación de las otras dos: no aporta nada nuevo. Al eliminar queda 0 = 0.']] },
    { type: 'mc', keep: true, q: '¿Cómo se clasifica el sistema?', opts: CLASES, correct: 1, sol: [[CLASES[1], 'Quedan 2 ecuaciones para 3 letras: hay un parámetro. Infinitas soluciones que forman una recta, como las hojas de un libro abierto.']] },
    { type: 'vec', q: 'Da un punto cualquiera de esa recta.', form: fP(3), check: x => Es.every(e => satisfies(x, e.slice(0, 3), e[3])), sample: o.S, ansH: M(Ph(o.S)),
      sol: [[M(Ph(o.S)), 'Por ejemplo este. Vale cualquiera que cumpla las tres ecuaciones: para la recta entera, deja x e y en función de z = t como en la lección 18.'],
        [M(Es.map(e => `${dotExpand(e.slice(0, 3), o.S)} = ${N(e[3])} ✓`).join('<br>')), 'Comprobación.']] }] };
}
gen('l19.recta', 'L19', r => { const { Es, steps } = recta3Steps(recta3Params(r)); return { type: 'chain', q: `Resuelve e interpreta: ${sys3(Es)}`, steps }; });
gen('prof.e16', 'L19', () => {
  const { Es, steps } = recta3Steps({ S: [6, 0, 0], p: 2, q: -1, a: 2, m: [-1, -2], al: 1, be: 1 });
  steps[2].sol.unshift([lineXYZ(6, 5, 0, -2), 'La recta completa es x = 6 + 5t, y = −2t, z = t. Ojo: la diapositiva 44 pone y = 2t, que es una errata.']);
  return { type: 'chain', tag: 'Ejercicio 16 del profesor', q: `Resuelve e interpreta geométricamente: ${sys3(Es)}`, steps };
}, { sib: 'l19.recta' });
function incompBuild(o) {
  const n1 = [1, o.p, o.q], n2 = vadd(vsc(o.a, n1), [0, o.m[0], o.m[1]]);
  const E3 = o.v === 'A' ? [...vsc(o.k, n1), o.k * o.d1 + o.delta] : [...vadd(n1, n2), o.d1 + o.d2 + o.delta];
  return [[...n1, o.d1], [...n2, o.d2], E3];
}
function incompParams(r) {
  for (;;) {
    const o = { v: r.pick(['A', 'B']), p: r.int(-2, 2), q: r.int(-2, 2), a: r.pick([1, 2, 3, -1, -2]), m: [r.int(-3, 3), r.int(-3, 3)], d1: r.int(-5, 5), d2: r.int(-6, 6), k: r.pick([2, -1, 3, -2]), delta: r.nz(-3, 3) };
    if (vzero(o.m)) continue;
    const Es = incompBuild(o); if (Es.some(e => e.some(x => Math.abs(x) > 14))) continue;
    if (o.v === 'B' && (isParallel(Es[2].slice(0, 3), Es[0].slice(0, 3)) || isParallel(Es[2].slice(0, 3), Es[1].slice(0, 3)))) continue;
    return o;
  }
}
const INTERP = ['Los planos 1 y 3 son paralelos y el 2 corta a ambos', 'Se cortan dos a dos en tres rectas paralelas, sin punto común', 'Los tres planos son paralelos', 'Los tres planos se cortan en una recta'];
function incompSteps(o) {
  const Es = incompBuild(o);
  const s1 = o.v === 'A' ? [[M(`${E(3)}${SUB}${o.k === 1 ? '' : P(o.k) + '·'}${E(1)}:  0${iv('x')}${ADD}0${iv('y')}${ADD}0${iv('z')} = ${N(o.delta)}`), 'Desaparecen todas las letras y queda 0 = un número distinto de 0: imposible.']]
    : [[M(`${E(3)}${SUB}${E(1)}${SUB}${E(2)}:  0 = ${N(o.delta)}`), 'La parte izquierda de la tercera es la suma de las otras dos, pero el lado derecho no: queda 0 = número. Imposible.']];
  const s2 = o.v === 'A' ? [[M(`${Vh(Es[2].slice(0, 3))} = ${N(o.k)}·${Vh(Es[0].slice(0, 3))}`), 'Los normales de 1 y 3 son proporcionales y el término independiente no: son paralelos (suelo y techo). El 2 no es paralelo a ninguno, así que los corta.']]
    : [[INTERP[1], 'Ningún par de normales es proporcional, así que no hay planos paralelos: cada pareja se corta en una recta, pero las tres rectas son paralelas y no hay punto común.']];
  return { Es, steps: [
    { type: 'mc', keep: true, q: '¿Cómo se clasifica el sistema?', opts: CLASES, correct: 2, sol: s1 },
    { type: 'mc', keep: true, q: 'Interpretación geométrica:', opts: INTERP, correct: o.v === 'A' ? 0 : 1, sol: s2 }] };
}
gen('l19.incomp', 'L19', r => { const { Es, steps } = incompSteps(incompParams(r)); return { type: 'chain', q: `Resuelve e interpreta: ${sys3(Es)}`, steps }; });
gen('prof.e17', 'L19', () => { const { Es, steps } = incompSteps({ v: 'A', p: 2, q: 1, a: 3, m: [-4, 4], d1: -1, d2: 5, k: 2, delta: 1 }); return { type: 'chain', tag: 'Ejercicio 17 del profesor', q: `Resuelve e interpreta geométricamente: ${sys3(Es)}`, steps }; }, { sib: 'l19.incomp' });
bankMC('l19.rec', 'L19', [
  ['Al eliminar te queda 0 = 5. ¿Qué significa?', ['Sistema incompatible: no hay ningún punto común', 'Que hay que volver a empezar', 'Compatible determinado', 'Que z = 5'], 'Ningún valor de x, y, z hace que 0 valga 5. Es una respuesta completa: “no hay solución”.'],
  ['Al eliminar, una ecuación se convierte en 0 = 0 y queda una letra libre.', ['Compatible indeterminado: infinitas soluciones en una recta', 'Incompatible', 'Compatible determinado', 'El sistema está mal planteado'], 'Una ecuación sobra: quedan 2 ecuaciones para 3 letras y aparece un parámetro.'],
  ['Al eliminar te sale z = 3 y, hacia atrás, un valor para cada letra.', ['Compatible determinado: un único punto', 'Compatible indeterminado', 'Incompatible', 'Hay tres soluciones'], 'Los tres planos se cortan en un solo punto.'],
]);
bankMC('l19.img', 'L19', [
  ['“Las hojas de un libro abierto” representan…', ['Tres planos que comparten una recta (compatible indeterminado)', 'Tres planos que se cortan en un punto', 'Tres planos sin punto común', 'Tres planos paralelos'], 'Las hojas giran alrededor del lomo y comparten toda esa línea.'],
  ['“La esquina de una habitación” (suelo y dos paredes) representa…', ['Tres planos que se cortan en un único punto', 'Tres planos que comparten una recta', 'Tres planos sin punto común', 'Dos planos paralelos'], 'Las paredes se cortan en una arista y el suelo corta esa arista en un solo punto: compatible determinado.'],
  ['“Suelo, techo y una pared” representa…', ['Un sistema incompatible: suelo y techo son paralelos', 'Un único punto común', 'Una recta común', 'Tres planos iguales'], 'Ningún punto está en el suelo y en el techo a la vez.'],
]);
gen('l19.errata', 'L19', () => ({ type: 'tf', q: `En el ejercicio 16, de ${M(MINUS + iv('y') + SUB + '2' + iv('z') + ' = 0')} la diapositiva 44 saca ${M(iv('y') + ' = 2' + iv('t'))}. Es correcto.`, correct: false,
  sol: [[M(`${MINUS}${iv('y')}${SUB}2${iv('z')} = 0  ⟹  ${iv('y')} = ${MINUS}2${iv('z')} = ${MINUS}2${iv('t')}`), 'Es una errata. Con y = 2t y t = 1, el punto (11, 2, 1) no cumple la primera ecuación: 11 + 4 − 1 = 14 ≠ 6.']] }));

// ===== L20 · Distancia de un punto a una recta =====
function dprRandom(r) {
  for (;;) {
    const P0 = rv(r, 3, -3, 3); let d; do d = rvnz(r, 3, -2, 2); while (vgcd(d) !== 1);
    let w = vcross(d, rvnz(r, 3, -2, 2)); if (vzero(w)) continue; w = vred(w); if (vn2(w) > 40) continue;
    return { P0, d, Q: vadd(vadd(P0, vsc(r.int(-2, 2), d)), w) };
  }
}
function dprSteps(P0, d, Q) {
  const v = fsub(Q, P0), dv = fdot(d, v), dd = fdot(d, d), k = dv.div(dd), pr = d.map(x => k.mul(x)), perp = v.map((x, i) => x.sub(pr[i])), n2 = fdot(perp, perp), dist = sqrtFr(n2);
  return { dist, perp, steps: [
    { type: 'vec', q: `Flecha de P a Q: ${M(Bv + ' = Q' + SUB + 'P')}.`, form: fV(3), expect: v, ansH: M(Bv + ' = ' + Vh(v)), sol: [[M(`${Bv} = Q${SUB}P = [${Q.map((x, i) => N(x) + SUB + P(P0[i])).join(', ')}] = ${Vh(v)}`), 'Final menos inicial.']] },
    { type: 'vec', q: 'Las dos piezas de la sombra.', form: [M(Bd + '·' + Bv + ' = '), 0, M(',   ' + Bd + '·' + Bd + ' = '), 1], expect: [dv, dd], ansH: M(`${Bd}·${Bv} = ${N(dv)},  ${Bd}·${Bd} = ${N(dd)}`),
      sol: [[M(`${Bd}·${Bv} = ${dotExpand(d, v)} = ${N(dv)}`), 'Arriba de la proyección.'], [M(`${Bd}·${Bd} = ${sqVals(d)} = ${N(dd)}`), 'Abajo, sin raíz.']] },
    { type: 'vec', q: `Parte perpendicular: ${M(Bv + SUB + proyH(Bd, Bv))}.`, form: fV(3), expect: perp, ansH: M(Vh(perp)),
      sol: [[M(`${proyH(Bd, Bv)} = ${Fh(N(dv), N(dd))}${Vh(d)} = ${Vh(pr)}`), 'La sombra de v sobre la recta.'],
        [M(`${Vh(v)}${SUB}${Vh(pr)} = ${Vh(perp)}`), 'Lo que le falta a la sombra para llegar a Q: el camino más corto.'],
        [M(`${Vh(perp)}·${Vh(d)} = 0 ✓`), 'Comprobación: tiene que ser perpendicular al director.']] },
    { type: 'num', q: 'Distancia de Q a la recta.', pre: M(iv('d') + ' ='), ans: dist, sol: [[M(`‖${Vh(perp)}‖ = ${Sq(sqVals(perp), true)} = ${N(dist)}`), 'La distancia es lo que mide la parte perpendicular.']] }] };
}
gen('l20.chain', 'L20', r => {
  const { P0, d, Q } = dprRandom(r), { steps } = dprSteps(P0, d, Q);
  return { type: 'chain', fig: { k: 'dline' }, q: `Distancia de ${M('Q = ' + Ph(Q))} a la recta ${par3(P0, d)}. Toma ${M('P = ' + Ph(P0))} (con t = 0) y ${M(Bd + ' = ' + Vh(d))}.`, steps };
});
gen('l20.num', 'L20', r => {
  const { P0, d, Q } = dprRandom(r), { steps, dist } = dprSteps(P0, d, Q);
  return { type: 'num', q: `Distancia del punto ${M('Q = ' + Ph(Q))} a la recta ${par3(P0, d)}.`, pre: M(iv('d') + ' ='), ans: dist, sol: steps.flatMap(s => s.sol) };
});
gen('prof.e18', 'L20', () => {
  const h = new Fr(-1, 2), { steps } = dprSteps([2, h, 0], [0, -1, 2], [3, h, 10]);
  return { type: 'chain', tag: 'Ejercicio 18 del profesor', fig: { k: 'dline' }, q: `Calcula la distancia desde ${M('Q = (3, ' + N(h) + ', 10)')} a la recta ${M(`${iv('x')} = 2,  ${iv('y')} = ${N(h)}${SUB}${Fh(1, 2)}${iv('t')},  ${iv('z')} = ${iv('t')}`)}. Toma ${M('P = (2, ' + N(h) + ', 0)')} y, para quitar fracciones, ${M(Bd + ' = [0, ' + MINUS + '1, 2]')} (el director multiplicado por 2).`, steps };
}, { sib: 'l20.chain' });
gen('prof.e22', 'L20', () => {
  const h = new Fr(-1, 2), { steps } = dprSteps([2, h, 0], [0, -1, 2], [3, h, 5]);
  steps[1].q = `Usa ${M(Bd + ' = [0, ' + MINUS + '1, 2]')}. Las dos piezas de la sombra.`;
  return { type: 'chain', tag: 'Ejercicio 22 del profesor (propuesto)', fig: { k: 'dline' }, q: `Calcula la distancia desde ${M('Q = (3, ' + N(h) + ', 5)')} a la recta intersección de ${sysH([[1, 2, 1, 1], [3, -4, -2, 8]])}`, steps: [
    { type: 'vec', q: `Primero la recta: un punto P con ${M(iv('z') + ' = 0')}.`, form: fP(3), expect: [2, h, 0], ansH: M('P = (2, ' + N(h) + ', 0)'),
      sol: [[sysH([[1, 2, 1], [3, -4, 8]]), 'Con z = 0 quedan dos ecuaciones en x e y.'], [M(`${iv('x')} = 2,  ${iv('y')} = ${N(h)}`), 'Resolviendo (por ejemplo, 2·E1 + E2 da 5x = 10).']] },
    { type: 'vec', q: 'Un vector director de la recta.', form: fV(3), check: x => isParallel(x, [0, -1, 2]), sample: [0, -1, 2], ansH: M(Bd + ' = [0, ' + MINUS + '1, 2]'),
      sol: [[lineXYZ(2, 0, h, new Fr(-1, 2)), 'Haciendo la eliminación como en la lección 18 sale x = 2, y = −1/2 − t/2, z = t. El director, multiplicado por 2: [0, −1, 2]. (También sirve n₁ × n₂.)']] },
    ...steps] };
}, { sib: 'l20.chainint' });
gen('l20.chainint', 'L20', r => {
  for (;;) {
    const o = intParams(r), B = intBuild(o), P0 = [o.x0, o.y0, 0], d = [o.p, o.q, 1];
    let w = vcross(d, rvnz(r, 3, -2, 2)); if (vzero(w)) continue; w = vred(w); if (vn2(w) > 40) continue;
    const Q = vadd(vadd(P0, vsc(r.int(-2, 2), d)), w); if (Q.some(x => Math.abs(x) > 9)) continue;
    const { steps } = dprSteps(P0, d, Q);
    steps[1].q = `Usa ${M(Bd + ' = ' + Vh(d))}. Las dos piezas de la sombra.`;
    return { type: 'chain', fig: { k: 'dline' }, q: `Calcula la distancia desde ${M('Q = ' + Ph(Q))} a la recta intersección de ${sysH([B.E1, B.E2])}`, steps: [
      { type: 'vec', q: `Primero la recta: un punto P con ${M(iv('z') + ' = 0')}.`, form: fP(3), expect: P0, ansH: M('P = ' + Ph(P0)),
        sol: [[sysH([[B.E1[0], B.E1[1], B.E1[3]], [B.E2[0], B.E2[1], B.E2[3]]]), 'Con z = 0 quedan dos ecuaciones en x e y.'], [M(`${iv('x')} = ${N(o.x0)},  ${iv('y')} = ${N(o.y0)}`), 'Resolviendo ese sistema de dos ecuaciones.']] },
      { type: 'vec', q: 'Un vector director de la recta.', form: fV(3), check: x => isParallel(x, d), sample: d, ansH: M(Bd + ' = ' + Vh(d)),
        sol: [[lineXYZ(o.x0, o.p, o.y0, o.q), 'Haciendo la eliminación como en la lección 18 y llamando t a la z salen las paramétricas. El director son los números que multiplican a t. (También sirve n₁ × n₂.)']] },
      ...steps] };
  }
});
bankMC('l20.concept', 'L20', [
  ['¿Por qué puedes coger cualquier punto P de la recta?', ['Porque la parte perpendicular es siempre el mismo segmento; solo cambia la sombra', 'Porque la distancia siempre es 0', 'No se puede: hay que coger el más cercano', 'Porque todos los puntos están a la misma distancia del origen'], 'Elijas el que elijas, el camino perpendicular hasta Q es el mismo.'],
  ['La distancia de un punto a una recta es…', ['El camino más corto, que es el perpendicular', 'La distancia al punto P de la recta', 'El módulo del director', 'La sombra de PQ sobre la recta'], 'Por eso se usa la parte perpendicular de la proyección.'],
  ['Si la recta viene como corte de dos planos, ¿qué haces primero?', ['Pasarla a paramétricas para tener un punto y un director', 'Calcular directamente el producto escalar', 'Sumar las dos ecuaciones', 'Nada: no se puede'], 'Lección 18: elimina, llama t a la z, y saca P (con t = 0) y d.'],
]);

// ===== L21 · Distancia de un punto a un plano =====
const NICE_N = [[1, 2, 2], [2, 1, 2], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [6, 6, 7]];
function dppRandom(r) {
  let n;
  if (r.chance(0.7)) n = r.shuffle(r.pick(NICE_N)).map(x => x * r.sign()); else do n = rvnz(r, 3, -3, 3); while (vgcd(n) !== 1);
  n = lead(n);
  const A = rv(r, 3, -3, 3), dd = vdot(n, A); let B; do B = rv(r, 3, -4, 4); while (vdot(n, B) === dd);
  return { n, dd, A, B };
}
const dppDist = (n, dd, B) => divSqrt(Math.abs(vdot(n, B) - dd), vn2(n));
function dppFormula(n, dd, B) {
  const s = vdot(n, B) - dd;
  return [[M(`${iv('d')} = ${Fh('|' + dotExpand(n, B) + SUB + P(dd) + '|', Sq(sqVals(n), true))}`), 'Fórmula directa: sustituyo el punto en ax + by + cz − d, quito el signo y divido entre el módulo del normal.'],
    [M(`= ${Fh('|' + N(s) + '|', Sq(vn2(n)))} = ${N(dppDist(n, dd, B))}`), 'Las barras quitan el signo. Si hace falta, se racionaliza.']];
}
gen('l21.num', 'L21', r => {
  const { n, dd, B } = dppRandom(r);
  return { type: 'num', fig: { k: 'dplane' }, q: `Distancia del punto ${M('B = ' + Ph(B))} al plano ${M(Lin(n, dd))}.`, pre: M(iv('d') + ' ='), ans: dppDist(n, dd, B), sol: dppFormula(n, dd, B) };
});
function dppSteps(n, dd, A, B) {
  const v = vsub(B, A), nv = vdot(n, v), dist = dppDist(n, dd, B);
  return [
    { type: 'vec', q: `Flecha del punto del plano al punto: ${M(Bv + ' = ' + ar('AB'))}.`, form: fV(3), expect: v, ansH: M(Bv + ' = ' + Vh(v)), sol: [[M(`${Bv} = B${SUB}A = ${Vh(v)}`), 'Final menos inicial.']] },
    { type: 'num', q: `Calcula ${M(Bn + '·' + Bv)}.`, pre: M(Bn + '·' + Bv + ' ='), ans: nv, sol: [[M(`${Bn}·${Bv} = ${dotExpand(n, v)} = ${N(nv)}`), 'Cuánto va v en la dirección del normal. El signo solo dice hacia qué lado del plano está B.']] },
    { type: 'num', q: `Calcula ${M('‖' + Bn + '‖')}.`, pre: M('‖' + Bn + '‖ ='), ans: sqrtInt(vn2(n)), sol: [[M(`‖${Bn}‖ = ${Sq(sqVals(n), true)} = ${rootH(vn2(n))}`), 'Módulo del normal.']] },
    { type: 'num', q: 'Distancia de B al plano.', pre: M(iv('d') + ' ='), ans: dist, sol: [[M(`${iv('d')} = ${Fh('|' + N(nv) + '|', N(sqrtInt(vn2(n))))} = ${N(dist)}`), 'Es el módulo de la sombra de v sobre el normal: |n·v| / ‖n‖.'], ...dppFormula(n, dd, B).map(([h]) => [h, 'Comprobación con la fórmula directa.'])] }];
}
gen('l21.chain', 'L21', r => {
  const { n, dd, A, B } = dppRandom(r);
  return { type: 'chain', fig: { k: 'dplane' }, q: `Distancia de ${M('B = ' + Ph(B))} al plano ${M(Lin(n, dd))}, usando el punto del plano ${M('A = ' + Ph(A))}.`, steps: dppSteps(n, dd, A, B) };
});
gen('prof.e19', 'L21', () => ({ type: 'chain', tag: 'Ejercicio 19 del profesor', fig: { k: 'dplane' }, q: `Calcula la distancia desde ${M('B = (1, 2, 3)')} hasta el plano ${M(Lin([1, 1, -1], 1))}. El profesor usa el punto del plano ${M('A = (1, 1, 1)')}.`, steps: dppSteps([1, 1, -1], 1, [1, 1, 1], [1, 2, 3]) }), { sib: 'l21.chain' });
gen('l21.pt', 'L21', r => {
  const { n, dd, A } = dppRandom(r), i = n.findIndex(x => x !== 0 && dd % x === 0);
  const ex = [0, 0, 0]; let exH;
  if (i >= 0) { ex[i] = dd / n[i]; exH = M(Ph(ex)); } else exH = M('por ejemplo, da valor 0 a dos letras y despeja la tercera');
  return { type: 'vec', q: `Da un punto cualquiera del plano ${M(Lin(n, dd))}.`, form: fP(3), check: x => satisfies(x, n, dd), sample: A, ansH: exH,
    sol: [[exH, 'Truco: da valor 0 a dos letras y despeja la tercera. Cualquier punto que cumpla la ecuación vale.']] };
});
bankMC('l21.mc', 'L21', [
  ['En la distancia de un punto a un plano, proyectas v = AB sobre…', [M('el vector normal ' + Bn), M('un director del plano'), M(Bv + ' mismo'), 'el eje z'], 'El normal es la dirección “vertical” respecto al plano. La diapositiva 54 dice “sobre d”, pero es una errata.'],
  ['¿Hace falta saber cuál es el punto del plano justo debajo de B?', ['No: basta con un punto A cualquiera del plano', 'Sí, siempre', 'Solo si B está encima', 'Sí, es el origen'], 'La sombra de AB sobre el normal mide la altura, sea cual sea A.'],
]);
bankTF('l21.tf', 'L21', [
  ['Si el punto está en el plano, la distancia es 0.', true, 'En la fórmula directa, ax₀ + by₀ + cz₀ − d da 0.'],
  ['La distancia de un punto a un plano puede ser negativa.', false, 'Las barras | | quitan el signo: el signo de n·v solo dice a qué lado del plano está el punto.'],
  ['En la fórmula directa se divide entre el módulo del vector normal.', true, 'd = |ax₀ + by₀ + cz₀ − d| / √(a² + b² + c²).'],
]);
