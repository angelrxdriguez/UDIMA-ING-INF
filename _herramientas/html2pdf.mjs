// HTML de estudio -> PDF A4 con el aspecto de los tutoriales.
//   node html2pdf.mjs entrada.html salida.pdf
// Las fórmulas se escriben entre $...$ (en línea) o $$...$$ (aparte) y se pasan por KaTeX.
// La hoja estilo-tutorial.css se añade sola. Chrome imprime sin ventana y con un perfil
// temporal, así que no toca el Chrome del usuario.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import katex from 'katex';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const HERE = dirname(fileURLToPath(import.meta.url));

// Los colores van sin # (KaTeX los acepta así), porque en un macro # marca un argumento.
// Macros comunes: \M{rr|r}{1&2\\3&4} matriz con corchetes, \piv{1} pivote resaltado,
// \op{F_2-2F_1} operación en naranja a la derecha de una fila, \ok marca verde.
const macros = {
  '\\M': '\\left[\\begin{array}{#1}#2\\end{array}\\right]',
  '\\piv': '\\colorbox{e0e6ec}{$\\mathbf{#1}$}',
  '\\op': '\\textcolor{b8620b}{\\scriptstyle\\leftarrow #1}',
  '\\ok': '\\textcolor{2e7d32}{\\checkmark}',
};

function renderMath(html) {
  // Dentro de las fórmulas vale escribir < > & tal cual o como entidades HTML.
  const unescape = src => src.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const tex = (src, displayMode) => katex.renderToString(unescape(src), { displayMode, macros, output: 'html', throwOnError: true });
  return html
    .replace(/\\\$/g, '\u0000')
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, s) => tex(s, true))
    .replace(/\$([^$]+?)\$/g, (_, s) => tex(s, false))
    .replace(/\u0000/g, '$');
}

async function printPdf(htmlFile, pdfFile) {
  const profile = mkdtempSync(join(tmpdir(), 'html2pdf-'));
  const port = 9300 + Math.floor(Math.random() * 500);
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
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
    await send('Page.navigate', { url: pathToFileURL(htmlFile).href });
    for (let i = 0; i < 200 && !events.includes('Page.loadEventFired'); i++) await new Promise(r => setTimeout(r, 50));
    await send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => document.fonts.size)', awaitPromise: true });
    const { data } = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
    writeFileSync(pdfFile, Buffer.from(data, 'base64'));
    await send('Browser.close').catch(() => {});
    ws.close();
  } finally {
    chrome.kill();
    await new Promise(r => setTimeout(r, 300));
    rmSync(profile, { recursive: true, force: true });
  }
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Uso: node html2pdf.mjs entrada.html salida.pdf');
  process.exit(1);
}
const css = ['node_modules/katex/dist/katex.min.css', 'node_modules/computer-modern/cmu-serif.css', 'estilo-tutorial.css']
  .map(f => `<link rel="stylesheet" href="${pathToFileURL(join(HERE, f)).href}">`).join('\n');
const src = readFileSync(input, 'utf8');
// Al principio del <head>, para que los <style> del propio documento puedan cambiar cosas.
const html = renderMath(src).replace(/<head>/i, `<head>\n${css}`);
const tmp = join(dirname(resolve(input)), '.render-' + Date.now() + '.html');
writeFileSync(tmp, html);
try {
  await printPdf(tmp, resolve(output));
  console.log('PDF generado:', resolve(output));
} finally {
  rmSync(tmp, { force: true });
}
