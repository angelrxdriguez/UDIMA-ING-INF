// HTML -> PNG recortado al elemento #captura, a doble resolución.
//   node html2png.mjs entrada.html salida.png [entrada2.html salida2.png ...]
// Mismo Chrome sin ventana y con perfil temporal que html2pdf.mjs.
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) {
  console.error('Uso: node html2png.mjs entrada.html salida.png [entrada2.html salida2.png ...]');
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), 'html2png-'));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
try {
  let target;
  for (let i = 0; i < 100 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  if (!target) throw new Error('Chrome no ha arrancado');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, ko) => { ws.onopen = ok; ws.onerror = ko; });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = m => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) events.push(msg.method);
  };
  const send = (method, params = {}) => new Promise((ok, ko) => {
    const n = ++id;
    pending.set(n, msg => msg.error ? ko(new Error(`${method}: ${msg.error.message}`)) : ok(msg.result));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 2200, height: 1200, deviceScaleFactor: 2, mobile: false });
  for (let i = 0; i < args.length; i += 2) {
    events.length = 0;
    await send('Page.navigate', { url: pathToFileURL(resolve(args[i])).href });
    for (let k = 0; k < 200 && !events.includes('Page.loadEventFired'); k++) await new Promise(r => setTimeout(r, 50));
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => 1)', awaitPromise: true });
    const { result } = await send('Runtime.evaluate', {
      expression: 'JSON.stringify((r => [r.x, r.y, r.width, r.height])(document.querySelector("#captura").getBoundingClientRect()))',
      returnByValue: true,
    });
    const [x, y, w, h] = JSON.parse(result.value);
    const clip = { x: Math.floor(x), y: Math.floor(y), width: Math.ceil(w), height: Math.ceil(h), scale: 1 };
    const { data } = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
    writeFileSync(resolve(args[i + 1]), Buffer.from(data, 'base64'));
    console.log('PNG:', resolve(args[i + 1]));
  }
  await send('Browser.close').catch(() => {});
  ws.close();
} finally {
  chrome.kill();
  await new Promise(r => setTimeout(r, 300));
  rmSync(profile, { recursive: true, force: true });
}
