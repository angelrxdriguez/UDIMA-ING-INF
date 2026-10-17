const fs=require('fs'),path=require('path');
const src=['math.js','gens1.js','gens2.js','engine.js'].map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const {G,buildItem,val}=new Function(src+'\nreturn {G,buildItem,val};')();
const txt=h=>String(h).replace(/<br>/g,' / ').replace(/<span class="sr">([^<]*)<\/span>/g,'$1').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
function show(s,ind=''){ console.log(ind+'Q: '+txt(s.q||''));
 if(s.kind==='slots'){ console.log(ind+'  FORM: '+s.form.map(x=>typeof x==='number'?'□':txt(x)).join('')); console.log(ind+'  ANS: '+txt(s.ansH)); }
 if(s.kind==='mc'){ s.view.forEach((o,i)=>console.log(ind+'  '+(i===s.correctView?'*':' ')+' '+txt(o))); }
 if(s.kind==='spot'){ s.lines.forEach((o,i)=>console.log(ind+'  '+(i===s.wrong?'X':' ')+' '+txt(o))); }
 (s.sol||[]).forEach(([a,b])=>console.log(ind+'   · '+txt(a)+'   — '+txt(b)));
 if(s.kind==='chain') s.steps.forEach(st=>show(st,ind+'    ')); }
for(const g of process.argv.slice(2)){ const [id,seed]=g.split('@'); console.log('\n=== '+id); show(buildItem(id,+(seed||11))); }
