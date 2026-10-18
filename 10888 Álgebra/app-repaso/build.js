// Une los fuentes en un único HTML publicable: dist/algebra.html
const fs = require('fs');
const path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const JS = ['math.js', 'gens1.js', 'gens2.js', 'engine.js', 'figs.js', 'lessons.js', 'app.js'].map(f => `// ---- ${f} ----\n` + src(f)).join('\n');
const js = `(() => {\n'use strict';\n${JS}\n})();`;
new Function(js); // falla aquí si hay un error de sintaxis
const html = `<title>Álgebra de bolsillo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Repaso tipo Duolingo de Álgebra (UDIMA), UD1: vectores, rectas y planos.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&display=swap">
<style>
${src('style.css')}
</style>
<main id="view" class="gut"></main>
<nav class="tabs" id="tabs" aria-label="Secciones"></nav>
<div id="ses" hidden></div>
<div id="sheet" hidden></div>
<div class="toast" id="toast" role="status" hidden></div>
<script>
${js.replace(/<\/script/gi, '<\\/script')}
</script>
`;
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'algebra.html'), html);
console.log('dist/algebra.html', (html.length / 1024).toFixed(0) + ' KB');
