// Capturas con emulación de iPhone (390×844) mediante el protocolo de DevTools de Chrome.
// Uso: node test/shots.cjs <carpeta-salida> [escena…]. Saca también una hoja de contactos si hay Python con PIL.
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dist = fs.readFileSync(path.join(__dirname, '..', 'dist', 'fichas.html'), 'utf8');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const H = `const sleep=ms=>new Promise(r=>setTimeout(r,ms));const q=s=>document.querySelector(s);const click=s=>{const e=q(s);if(e)e.click();return !!e;};
const still=()=>{const i=q('#card .inner');if(i)i.style.transition='none';const c=q('#card');if(c)c.classList.remove('in');};
async function pickRight(){q('.op[data-k="0"]').click();await sleep(30);const r=q('.op.right');if(r&&!q('.op.wrong')){return;}}
async function pickWrong(){for(let k=0;k<4;k++){const b=q('.op[data-k="'+k+'"]');b.click();await sleep(30);if(q('.op.wrong'))return;q('#qnext').click();await sleep(30);}}
async function simAll(p){for(let i=0;i<80;i++){await sleep(12);if(!q('.op'))break;if(Math.random()<p){const k=Math.floor(Math.random()*4);q('.op[data-k="'+k+'"]').click();await sleep(10);}q('#qnext').click();}}
const LONG=['La **evaluación perezosa** retrasa el cálculo de una expresión hasta que su valor hace falta.','','- Permite trabajar con **estructuras infinitas**.','- Evita cálculos que nunca se usan.','- Se llama también llamada por necesidad.','','En cambio, la evaluación **ansiosa** evalúa los argumentos antes de llamar a la función (llamada por valor).','','Ejemplo:','\`\`\`haskell','primeros = take 3 [1..]','-- [1,2,3]','\`\`\`','','Por eso Haskell puede definir listas sin fin y quedarse solo con lo que necesita, y Lisp, que es ansioso, no.'].join(String.fromCharCode(10));
async function until(f){for(let i=0;i<150&&!f();i++)await sleep(20);}
function report(tag){const sc=q('#chatsc'),u=[...document.querySelectorAll('.msg-u')].pop();console.error('POS '+tag+': pregunta '+document.querySelectorAll('.msg-u').length+' a '+Math.round(u.getBoundingClientRect().top-sc.getBoundingClientRect().top)+'px del borde superior; scrollTop '+Math.round(sc.scrollTop)+' de '+Math.round(sc.scrollHeight-sc.clientHeight)+'; ventana '+window.scrollY);}
async function rateAll(r){for(let i=0;i<400;i++){await sleep(20);if(!q('#card'))break;if(q('#flip')){q('#flip').click();await sleep(20);}const b=q('.rate.'+r);if(b)b.click();await sleep(240);}}`;
// Claude falso para las capturas: «sample» contesta con window.__answer (o un texto fijo) y guarda lo que recibe.
function mockClaude() {
  window.__inputs = [];
  const A = ['El **corte** (`!`) poda el árbol de búsqueda: una vez que Prolog lo cruza, ya no vuelve atrás para probar otras cláusulas de ese predicado.', '',
    '- Hace el programa más **eficiente**.', '- Puede cambiar el significado lógico del programa si se usa mal.', '',
    '```prolog', 'max(X, Y, X) :- X >= Y, !.', 'max(_, Y, Y).', '```'].join(String.fromCharCode(10));
  const S = async (input, o) => {
    o = o || {};
    const rec = { input, modelTier: o.modelTier, effort: o.effort, images: (o.images || []).map(b => ({ type: b.type, size: b.size })), tools: (o.tools || []).map(t => t.name) };
    window.__inputs.push(rec);
    if (window.__fail) { await new Promise(r => setTimeout(r, 60)); throw { code: window.__fail, message: 'x' }; }
    let acc = '';
    const say = async txt => {
      for (let k = 0; k < txt.length; k += 30) {
        await new Promise(r => setTimeout(r, window.__slow || 12));
        if (o.signal && o.signal.aborted) throw { code: 'cancelled', message: 'x', text: acc };
        const part = txt.slice(k, k + 30); acc += part; if (o.onText) o.onText({ text: acc, delta: part });
      }
    };
    // Con herramienta: narra algo (la app no debe enseñarlo), busca y luego responde.
    if (o.tools && o.tools.length) {
      await say('Voy a buscar en el temario.');
      const out = await o.tools[0].execute({ consulta: 'corte prolog backtracking' }, { signal: o.signal });
      rec.toolOut = String(out).length; rec.toolHead = String(out).slice(0, 160);
      await say(String.fromCharCode(10, 10));
    }
    await say(window.__answer || A);
    return { text: acc, truncated: false, modelTierApplied: o.modelTier || 'default' };
  };
  S.limits = async () => ({ maxPromptBytes: 262144, modelTiers: ['default', 'complex', 'quick'],
    images: { maxCount: 1, maxInputBytes: 20000000, mediaTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] }, tools: { maxCount: 8 } });
  window.claude = { use: async n => (n === 'sample' ? S : null) };
}
const MOCK = '(' + mockClaude.toString() + ')();';
// Imágenes de prueba: una diapositiva apaisada y una página de libro vertical (renderizadas del temario).
const PAGS = process.env.PAGS || path.join(require('os').tmpdir(), 'pags');
const FOTO = path.join(PAGS, 'S5', 'S5-11.png'), FOTO2 = path.join(PAGS, 'Cap2', 'Cap2-05.png');
const SC = {
  home: ['light', `(async()=>{})()`],
  front: ['light', `(async()=>{await sleep(30);click('#go');await sleep(30);still();})()`],
  back: ['dark', `(async()=>{await sleep(30);click('#go');await sleep(30);still();click('#flip');})()`],
  serie: ['light', `(async()=>{await sleep(30);click('#go');await sleep(30);click('#flip');await sleep(30);click('.rate.good');await sleep(300);still();click('#flip');})()`, 3000],
  done: ['light', `(async()=>{await sleep(30);click('#go');await rateAll('hard');})()`, 6000],
  code: ['light', `(async()=>{await sleep(30);click('#uds-all');await sleep(20);click('.ud[data-ud="5"]');await sleep(20);click('#go');await sleep(30);still();click('#flip');})()`],
  serieL: ['dark', `(async()=>{await sleep(30);click('#uds-all');await sleep(20);click('.ud[data-ud="4"]');await sleep(20);click('#go');for(let i=0;i<14;i++){await sleep(20);click('#flip');await sleep(20);click('.rate.good');await sleep(250);}still();click('#flip');})()`, 6000],
  list: ['dark', `(async()=>{await sleep(30);click('#list');})()`],
  homeDark: ['dark', `(async()=>{await sleep(30);for(const u of [2,3,4,5])click('.ud[data-ud="'+u+'"]');})()`],
  // ---- modo test ----
  tHome: ['light', `(async()=>{await sleep(30);click('[data-modo="test"]');})()`],
  tHist: ['dark', `(async()=>{})()`, 2000, TPRE([6.2, 4.8, 7.4, 7.9, 6.6])],
  tHistOk: ['light', `(async()=>{})()`, 2000, TPRE([5.1, 7.3, 7.8, 8.2])],
  tSim: ['light', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tsim');await sleep(30);click('.op[data-k="2"]');})()`],
  tPracOk: ['light', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tprac');await sleep(30);await pickRight();})()`],
  tPracBad: ['dark', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tprac');await sleep(30);await pickWrong();})()`],
  tConfirm: ['light', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tsim');await simAll(0.85);})()`, 5000],
  tDone: ['light', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tsim');await simAll(0.85);await sleep(30);click('#deliver');})()`, 5000],
  tDoneDark: ['dark', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tsim');await simAll(0.85);await sleep(30);click('#deliver');await sleep(60);const s=q('.scroll');s.scrollTop=s.scrollHeight;})()`, 5000],
  tCode: ['dark', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);for(const u of [1,2,3,4])click('.ud[data-ud="'+u+'"]');await sleep(20);click('[data-tanda="0"]');await sleep(20);click('#tprac');await sleep(30);for(let i=0;i<45&&!q('pre');i++){q('#qblank').click();await sleep(20);q('#qnext').click();await sleep(20);}await pickWrong();})()`, 4000],
  tResume: ['light', `(async()=>{await sleep(30);click('[data-modo="test"]');await sleep(20);click('#tsim');await sleep(30);click('.op[data-k="1"]');click('#qnext');await sleep(30);click('#qquit');})()`],
  // ---- pregúntale ----
  aHome: ['light', `(async()=>{await sleep(200);})()`],
  aEmpty: ['light', `(async()=>{await sleep(200);click('#askopen');})()`],
  aAnswer: ['dark', `(async()=>{await sleep(200);click('#askopen');await sleep(30);const b=q('#askbox');b.value='¿Qué hace el corte en Prolog?';b.dispatchEvent(new Event('input'));click('#asksend');await sleep(1500);})()`, 2600],
  aStream: ['light', `(async()=>{window.__slow=400;await sleep(200);click('#askopen');await sleep(30);click('[data-sug="0"]');await sleep(1000);})()`, 1800],
  aCard: ['light', `(async()=>{await sleep(200);click('#go');await sleep(30);still();click('#flip');await sleep(60);})()`],
  aCardAsk: ['light', `(async()=>{await sleep(200);click('#go');await sleep(30);click('#flip');await sleep(30);click('#askcard');await sleep(30);click('[data-sug="1"]');await sleep(1500);click('[data-deep="0"]');await sleep(1500);})()`, 3600],
  aBack: ['light', `(async()=>{await sleep(200);click('#go');await sleep(30);click('#flip');await sleep(30);click('#askcard');await sleep(30);click('#askback');await sleep(30);still();})()`],
  aQuiz: ['light', `(async()=>{await sleep(200);click('[data-modo="test"]');await sleep(20);click('#tprac');await sleep(30);await pickWrong();await sleep(30);const s=q('.stage');s.scrollTop=s.scrollHeight;})()`],
  aQuizAsk: ['dark', `(async()=>{await sleep(200);click('[data-modo="test"]');await sleep(20);click('#tprac');await sleep(30);await pickWrong();await sleep(30);click('#askq');})()`],
  // Conversación de varias preguntas con respuestas largas: al terminar, la última pregunta debe seguir arriba (antes saltaba al principio).
  aMulti: ['light', `(async()=>{window.__answer=LONG;await sleep(200);click('#askopen');await sleep(30);click('[data-sug="0"]');await sleep(2200);
    const b=q('#askbox');b.value='¿Y en Haskell cómo sería?';b.dispatchEvent(new Event('input'));click('#asksend');await sleep(2600);report('fin');})()`, 5600],
  aMultiMid: ['dark', `(async()=>{window.__answer=LONG;await sleep(200);click('#askopen');await sleep(30);click('[data-sug="0"]');await sleep(2200);
    window.__slow=60;const b=q('#askbox');b.value='¿Y en Haskell cómo sería?';b.dispatchEvent(new Event('input'));click('#asksend');await sleep(900);report('a medias');})()`, 3600],
  // ---- fotos (el 5.º elemento es la imagen que se mete en el botón de la cámara) ----
  // La foto se envía sola en cuanto llega: las escenas no pulsan «Enviar».
  pAtt: ['light', `(async()=>{window.__slow=400;await sleep(200);click('#askopen');})()`, 1100, '', FOTO],
  pAnswer: ['dark', `(async()=>{await sleep(200);click('#askopen');})()`, 3200, '', FOTO],
  pFollow: ['light', `(async()=>{await sleep(200);click('#askopen');await sleep(40);const b=q('#askbox');b.value='¿Qué falla aquí?';b.dispatchEvent(new Event('input'));await until(()=>q('.msg-u.has-img'));await sleep(1800);
    b.value='¿Y si quito el corte?';b.dispatchEvent(new Event('input'));click('#asksend');await sleep(1500);report('foto');})()`, 4600, '', FOTO],
  pBig: ['light', `(async()=>{await sleep(200);click('#askopen');await sleep(2000);const sc=q('#chatsc');sc.scrollTop=0;})()`, 3200, '', FOTO2],
  aErr: ['light', `(async()=>{window.__fail='rate_limited';await sleep(200);click('#askopen');await sleep(30);click('[data-sug="2"]');await sleep(400);})()`],
  aDenied: ['light', `(async()=>{window.__fail='not_granted';await sleep(200);click('#askopen');await sleep(30);click('[data-sug="2"]');await sleep(400);})()`],
};
// Progreso de test inventado para ver el gráfico del veredicto (solo en las capturas).
function TPRE(notas) {
  const t0 = Date.UTC(2026, 10, 1);
  const sims = notas.map((nota, i) => ({ t: t0 + i * 86400000, n: 40, ok: Math.round(nota * 4) + 2, bad: 6, blank: 34 - Math.round(nota * 4), nota, ud: { 1: [6, 1, 8], 2: [7, 1, 9], 3: [5, 2, 7], 4: [4, 3, 9], 5: [5, 1, 7] } }));
  return `localStorage.setItem('test-paradigmas-v1', ${JSON.stringify(JSON.stringify({ v: 1, epoch: 0, qs: {}, sims }))});localStorage.setItem('fichas-paradigmas-prefs', JSON.stringify({ modo: 'test' }));`;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const userDir = path.join(out, 'prof'); fs.mkdirSync(userDir, { recursive: true });
  const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9234', '--user-data-dir=' + userDir, 'about:blank'], { stdio: 'ignore' });
  let ver; for (let i = 0; i < 50 && !ver; i++) { await sleep(200); try { ver = await (await fetch('http://127.0.0.1:9234/json/version')).json(); } catch (e) { /* esperando */ } }
  const tgt = (await (await fetch('http://127.0.0.1:9234/json/list')).json()).find(t => t.type === 'page');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pend = new Map(); const logs = [];
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + JSON.stringify(m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description || m.params.exceptionDetails.text));
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('ERR ' + m.params.args.map(a => a.value || a.description).join(' '));
  });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const names = process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(SC);
  for (const k of names) {
    const [theme, js, wait, pre, foto] = SC[k];
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
    const file = path.join(out, 'cdp-' + k + '.html');
    fs.writeFileSync(file, `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body><script>try{localStorage.clear();${pre || ''}}catch(e){}</script><script>${MOCK}</script>${dist}<script>${H}${js}</script></body></html>`);
    logs.length = 0;
    await send('Page.navigate', { url: 'file:///' + file.split(path.sep).join('/') });
    if (foto) {
      if (!fs.existsSync(foto)) console.log('  (falta la imagen de prueba ' + foto + '; define PAGS)');
      await sleep(500);
      const doc = await send('DOM.getDocument', { depth: -1 });
      const n = await send('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: '#askfile' });
      if (n.result && n.result.nodeId) await send('DOM.setFileInputFiles', { files: [foto], nodeId: n.result.nodeId });
      else console.log('  (no hay botón de foto)');
      await sleep(Math.max(0, (wait || 2000) - 500));
    } else await sleep(wait || 2000);
    const ov = await send('Runtime.evaluate', { expression: 'JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,wide:[...document.querySelectorAll("#app *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&!e.closest("pre")).slice(0,5).map(e=>e.className)})', returnByValue: true });
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(out, k + '.png'), Buffer.from(shot.result.data, 'base64'));
    console.log(k, theme, ov.result.result.value, logs.join(' | '));
    const inp = await send('Runtime.evaluate', { expression: 'JSON.stringify(window.__inputs||[])', returnByValue: true });
    if (inp.result.result.value && inp.result.result.value !== '[]') fs.writeFileSync(path.join(out, k + '-enviado.json'), inp.result.result.value);
  }
  ws.close(); ch.kill();
})();
