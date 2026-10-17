// Capturas con emulación real de iPhone (390×844, retina) mediante el protocolo de DevTools.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const out = path.join(__dirname, 'out');
const dist = fs.readFileSync(path.join(__dirname, '..', 'dist', 'algebra.html'), 'utf8');
const H = fs.readFileSync(path.join(__dirname, 'shots.js'), 'utf8').match(/const H=`([\s\S]*?)`;\nconst S=/)[1];
const SC = {
  home: ['light', `(async()=>{await seedProgress(); act('tab',{v:'hoy'});})()`],
  theory: ['light', `(async()=>{act('start',{l:'L14'});})()`],
  slots: ['dark', `(async()=>{await toKind('L14',()=>document.querySelectorAll('#ses .slot').length>=4 && !q('#ses .fb')); const s=document.querySelectorAll('#ses .slot'); s[0].click(); act('key',{k:'2'}); s[1].click(); act('key',{k:'−'}); act('key',{k:'1'});})()`],
  mcfb: ['light', `(async()=>{await toKind('L16',()=>q('#ses .opt') && !q('#ses .fb')); q('#ses .opt').click(); q('#ses [data-act="check"]').click();})()`],
  chain: ['light', `(async()=>{act('start',{l:'L18'}); for(let i=0;i<30;i++){ await sleep(5); if(q('#ses [data-act="ses-start"]')){q('#ses [data-act="ses-start"]').click();continue;} if(q('#ses .chain li.done') && !q('#ses .fb')) break; const n=q('#ses [data-act="next"]'); if(n){n.click();continue;} q('#ses [data-act="dunno"]').click(); } })()`],
  map: ['dark', `(async()=>{await seedProgress(); act('tab',{v:'mapa'});})()`],
  formulas: ['light', `(async()=>{act('tab',{v:'formulas'});})()`],
  hex: ['dark', `(async()=>{await toKind('L5',()=>q('#ses .fig') && document.querySelectorAll('#ses .slot').length===2 && !q('#ses .fb'));})()`],
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const userDir = path.join(out, 'prof'); fs.mkdirSync(userDir, { recursive: true });
  const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9233', '--user-data-dir=' + userDir, 'about:blank'], { stdio: 'ignore' });
  let ver; for (let i = 0; i < 50 && !ver; i++) { await sleep(200); try { ver = await (await fetch('http://127.0.0.1:9233/json/version')).json(); } catch (e) { /* esperando */ } }
  const tgt = (await (await fetch('http://127.0.0.1:9233/json/list')).json()).find(t => t.type === 'page');
  const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const pend = new Map();
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SC);
  for (const k of names) {
    const [theme, js] = SC[k];
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
    const file = path.join(out, 'cdp-' + k + '.html');
    fs.writeFileSync(file, `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${dist}<script>try{localStorage.clear()}catch(e){};${H}${js}</script></body></html>`);
    await send('Page.navigate', { url: 'file:///' + file.split(path.sep).join('/') });
    await sleep(2500);
    const ov = await send('Runtime.evaluate', { expression: 'JSON.stringify({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, ses:(document.querySelector("#ses .ses-body")||{}).scrollWidth||0})', returnByValue: true });
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(out, 'm-' + k + '.png'), Buffer.from(shot.result.data, 'base64'));
    console.log(k, theme, ov.result.result.value);
  }
  ws.close(); ch.kill();
})();
