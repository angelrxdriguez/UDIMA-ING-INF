// Mide cuántos enunciados distintos produce cada generador con semillas aleatorias.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = ['math.js', 'gens1.js', 'gens2.js', 'engine.js', 'figs.js', 'lessons.js'].map(f => fs.readFileSync(path.join(root, 'src', f), 'utf8')).join('\n');
const { G, buildItem, LESSONS } = new Function(src + '\nreturn { G, buildItem, LESSONS };')();
const N = +(process.argv[2] || 3000);
const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const prompt = it => strip(it.q) + (it.kind === 'chain' ? ' || ' + it.steps.map(s => strip(s.q)).join(' | ') : '') + (it.kind === 'spot' ? ' || ' + it.lines.map(strip).join(' | ') : '');
const rows = [];
for (const gid of Object.keys(G)) {
  const m = new Map();
  for (let i = 0; i < N; i++) { const it = buildItem(gid, (Math.random() * 4294967296) >>> 0); const p = prompt(it); m.set(p, (m.get(p) || 0) + 1); }
  const top = Math.max(...m.values());
  rows.push({ gid, type: buildItem(gid, 1).kind + (buildItem(gid, 1).isTF ? '/tf' : ''), distinct: m.size, topPct: +(100 * top / N).toFixed(1), ex: strip(buildItem(gid, 12345).q).slice(0, 90) });
}
rows.sort((a, b) => a.distinct - b.distinct);
for (const r of rows) console.log(String(r.distinct).padStart(5), String(r.topPct).padStart(5) + '%', r.type.padEnd(9), r.gid.padEnd(14), r.ex);
