// ===== Dibujos (SVG en línea, con los colores del tema) =====
const f1 = n => (Math.round(n * 10) / 10).toString();
function arw(x1, y1, x2, y2, cls, w = 2.4) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 10, s = 5, bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
  return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(bx)}" y2="${f1(by)}" class="${cls}" stroke-width="${w}"/>` +
    `<polygon points="${f1(x2)},${f1(y2)} ${f1(bx + s * Math.sin(a))},${f1(by - s * Math.cos(a))} ${f1(bx - s * Math.sin(a))},${f1(by + s * Math.cos(a))}" class="${cls} hd"/>`;
}
const svgW = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" class="fig-svg" role="img" aria-label="${label}">${body}</svg>`;
const tx = (x, y, s, cls = '') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}">${s}</text>`;
const dot = (x, y, cls = 'ink') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.6" class="${cls} pt"/>`;
const seg = (x1, y1, x2, y2, cls, extra = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" ${extra}/>`;
const poly = (pts, cls) => `<polygon points="${pts.map(p => p.map(f1).join(',')).join(' ')}" class="${cls}"/>`;

function hexFig(X, Y, base = 0) {
  const cx = 130, cy = 100, R = 72, ang = { A: 0, B: 60, C: 120, D: 180, E: 240, F: 300 }, ks = Object.keys(ang);
  const pos = k => (k === 'O' ? [cx, cy] : [cx + R * Math.cos(ang[k] * Math.PI / 180), cy - R * Math.sin(ang[k] * Math.PI / 180)]);
  const A0 = ks[base % 6], B0 = ks[(base + 1) % 6];
  // etiqueta junto a la mitad de la flecha: a por el lado de las agujas del reloj, b por el contrario
  const lab = (k, side, d) => { const t = ang[k] * Math.PI / 180, ux = Math.cos(t), uy = -Math.sin(t); return [cx + ux * R * 0.32 - side * uy * d - 4, cy + uy * R * 0.32 + side * ux * d + 5]; };
  let b = poly(ks.map(pos), 'mut fillno');
  b += arw(cx, cy, ...pos(A0), 'dir') + arw(cx, cy, ...pos(B0), 'turn');
  b += tx(...lab(A0, 1, 13), 'a', 'lab bold dirt') + tx(...lab(B0, -1, 13), 'b', 'lab bold turnt');
  for (const k of Object.keys(ang)) { const [x, y] = pos(k), dx = (x - cx) * 0.22, dy = (y - cy) * 0.22; b += dot(x, y) + tx(x + dx - 5, y + dy + 5, k, 'lab'); }
  b += dot(cx, cy) + tx(cx - 16, cy + 5, 'O', 'lab');
  if (X && Y) { const p = pos(X), q = pos(Y); b += arw(p[0], p[1], q[0], q[1], 'acc', 3.4); }
  return svgW(260, 200, b, 'Hexágono regular de centro O con los vectores a y b');
}
function projFig() {
  let b = arw(30, 130, 250, 130, 'dir') + tx(238, 150, 'u', 'lab bold dirt');
  b += arw(30, 130, 160, 40, 'acc') + tx(82, 72, 'v', 'lab bold acct');
  b += arw(30, 130, 160, 130, 'ok', 4) + tx(70, 150, 'proy', 'lab okt');
  b += seg(160, 40, 160, 130, 'nor', 'stroke-dasharray="5 4" stroke-width="2"') + tx(168, 92, 'v − proy', 'lab nort');
  b += `<path d="M150 130 V120 H160" class="mut fillno"/>`;
  return svgW(270, 165, b, 'Proyección de v sobre u: la sombra y la parte perpendicular');
}
function lineFig() {
  let b = '';
  for (let i = 0; i <= 10; i++) b += seg(20 + i * 24, 10, 20 + i * 24, 190, 'grid') + seg(20, 10 + i * 18, 260, 10 + i * 18, 'grid');
  b += seg(30, 175, 250, 30, 'ink', 'stroke-width="2.2"');
  const t =[220, -145], L = Math.hypot(...t), d = [t[0] / L, t[1] / L], n = [-d[1], d[0]];
  const P0 = [30 + 0.4 * 220, 175 - 0.4 * 145];
  b += arw(P0[0], P0[1], P0[0] + 70 * d[0], P0[1] + 70 * d[1], 'dir', 3) + tx(P0[0] + 72 * d[0], P0[1] + 72 * d[1] + 20, 'd', 'lab bold dirt');
  b += arw(P0[0], P0[1], P0[0] - 60 * n[0], P0[1] - 60 * n[1], 'nor', 3) + tx(P0[0] - 62 * n[0] - 16, P0[1] - 62 * n[1], 'n', 'lab bold nort');
  b += dot(P0[0], P0[1]) + tx(P0[0] + 8, P0[1] + 20, 'P', 'lab');
  return svgW(280, 200, b, 'Recta con su vector director d y su vector normal n');
}
function planeFig() {
  let b = poly([[30, 150], [190, 150], [250, 95], [90, 95]], 'mut soft');
  b += arw(110, 128, 180, 128, 'dir') + tx(178, 146, 'u', 'lab bold dirt');
  b += arw(110, 128, 140, 102, 'turn') + tx(146, 104, 'v', 'lab bold turnt');
  b += arw(110, 128, 110, 30, 'nor', 3) + tx(118, 40, 'n', 'lab bold nort');
  b += dot(110, 128) + tx(92, 142, 'P', 'lab');
  return svgW(270, 165, b, 'Plano con dos direcciones u y v y su vector normal n');
}
function threeFig() {
  const W = 104, gap = 8; let b = '';
  const panel = (i, body, cap) => `<g transform="translate(${i * (W + gap)},0)">${body}${tx(W / 2, 128, cap, 'cap')}</g>`;
  const p1 = poly([[10, 92], [64, 92], [94, 70], [40, 70]], 'mut soft') + poly([[40, 70], [40, 18], [94, 18], [94, 70]], 'mut soft2') + poly([[40, 70], [40, 18], [10, 40], [10, 92]], 'mut soft3') + dot(40, 70, 'acc');
  const p2 = seg(52, 12, 52, 104, 'acc', 'stroke-width="3"') + poly([[52, 12], [92, 26], [92, 108], [52, 104]], 'mut soft') + poly([[52, 12], [14, 26], [14, 108], [52, 104]], 'mut soft2') + poly([[52, 12], [70, 40], [70, 112], [52, 104]], 'mut soft3');
  const p3 = poly([[8, 96], [70, 96], [96, 78], [34, 78]], 'mut soft') + poly([[8, 34], [70, 34], [96, 16], [34, 16]], 'mut soft') + poly([[50, 104], [50, 10], [62, 2], [62, 96]], 'mut soft3');
  b += panel(0, p1, 'Un punto') + panel(1, p2, 'Una recta') + panel(2, p3, 'Ningún punto');
  return svgW(3 * W + 2 * gap, 138, b, 'Las tres posiciones de tres planos: un punto, una recta o ningún punto');
}
function dlineFig() {
  let b = seg(20, 140, 260, 110, 'ink', 'stroke-width="2.2"') + tx(232, 104, 'recta', 'cap');
  const P0 = [60, 135], dir = [240, -30], L = Math.hypot(...dir), u = [dir[0] / L, dir[1] / L];
  const Q = [190, 40], v = [Q[0] - P0[0], Q[1] - P0[1]], k = v[0] * u[0] + v[1] * u[1], F0 = [P0[0] + k * u[0], P0[1] + k * u[1]];
  b += arw(P0[0], P0[1], Q[0], Q[1], 'acc') + tx(108, 76, 'v', 'lab bold acct');
  b += arw(P0[0], P0[1], F0[0], F0[1], 'ok', 4) + tx(118, 146, 'sombra', 'lab okt');
  b += seg(Q[0], Q[1], F0[0], F0[1], 'nor', 'stroke-dasharray="5 4" stroke-width="2.4"') + tx(Q[0] + 8, (Q[1] + F0[1]) / 2, 'distancia', 'lab nort');
  b += dot(...P0) + tx(P0[0] - 8, P0[1] + 20, 'P', 'lab') + dot(...Q) + tx(Q[0] - 4, Q[1] - 10, 'Q', 'lab');
  return svgW(290, 165, b, 'Distancia de un punto Q a una recta: parte perpendicular de v');
}
function dplaneFig() {
  let b = poly([[20, 150], [180, 150], [250, 100], [90, 100]], 'mut soft');
  const A = [80, 135], B = [190, 36], H = [190, 126];
  b += arw(A[0], A[1], A[0], A[1] - 70, 'nor', 3) + tx(A[0] - 18, A[1] - 60, 'n', 'lab bold nort');
  b += arw(A[0], A[1], B[0], B[1], 'acc') + tx(128, 78, 'v', 'lab bold acct');
  b += seg(B[0], B[1], H[0], H[1], 'ok', 'stroke-dasharray="5 4" stroke-width="2.4"') + tx(B[0] + 8, 86, 'altura', 'lab okt');
  b += dot(...A) + tx(A[0] - 8, A[1] + 18, 'A', 'lab') + dot(...B) + tx(B[0] + 6, B[1] - 6, 'B', 'lab');
  return svgW(270, 165, b, 'Distancia de un punto B a un plano: la altura, sombra de v sobre el normal');
}
function figHTML(f) {
  if (!f) return '';
  const k = f.k;
  const s = k === 'hex' ? hexFig(f.X, f.Y, f.base) : k === 'proj' ? projFig() : k === 'line' ? lineFig() : k === 'plane' ? planeFig() : k === 'three' ? threeFig() : k === 'dline' ? dlineFig() : k === 'dplane' ? dplaneFig() : '';
  return s ? `<figure class="fig">${s}</figure>` : '';
}
