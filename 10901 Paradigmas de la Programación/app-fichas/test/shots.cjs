// Capturas con emulación de iPhone (390×844) mediante el protocolo de DevTools de Chrome.
// Uso: node test/shots.cjs <carpeta-salida> [escena…]. Saca también una hoja de contactos si hay Python con PIL.
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const dist = fs.readFileSync(path.join(__dirname, '..', 'dist', 'fichas.html'), 'utf8');
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
const H = `const sleep=ms=>new Promise(r=>setTimeout(r,ms));const q=s=>document.querySelector(s);const click=s=>{const e=q(s);if(e)e.click();return !!e;};
const still=()=>{const i=q('#card .inner');if(i)i.style.transition='none';const c=q('#card');if(c)c.classList.remove('in');};
async function rateAll(r){for(let i=0;i<400;i++){await sleep(20);if(!q('#card'))break;if(q('#flip')){q('#flip').click();await sleep(20);}const b=q('.rate.'+r);if(b)b.click();await sleep(240);}}`;
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
};
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
    const [theme, js, wait] = SC[k];
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
    const file = path.join(out, 'cdp-' + k + '.html');
    fs.writeFileSync(file, `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body><script>try{localStorage.clear()}catch(e){}</script>${dist}<script>${H}${js}</script></body></html>`);
    logs.length = 0;
    await send('Page.navigate', { url: 'file:///' + file.split(path.sep).join('/') });
    await sleep(wait || 2000);
    const ov = await send('Runtime.evaluate', { expression: 'JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,wide:[...document.querySelectorAll("#app *")].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&!e.closest("pre")).slice(0,5).map(e=>e.className)})', returnByValue: true });
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(out, k + '.png'), Buffer.from(shot.result.data, 'base64'));
    console.log(k, theme, ov.result.result.value, logs.join(' | '));
  }
  ws.close(); ch.kill();
})();
