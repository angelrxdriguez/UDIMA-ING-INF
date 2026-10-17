const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const dist=fs.readFileSync(path.join(__dirname,'..','dist','algebra.html'),'utf8');
const out=path.join(__dirname,'out');fs.mkdirSync(out,{recursive:true});
const H=`const sleep=ms=>new Promise(r=>setTimeout(r,ms));const q=s=>document.querySelector(s);function act(n,d={}){const b=document.createElement('button');b.dataset.act=n;Object.assign(b.dataset,d);b.hidden=true;document.body.appendChild(b);b.click();b.remove();}
async function seedProgress(){ act('start',{l:'L3'}); for(let i=0;i<40;i++){await sleep(5); if(q('#ses .end'))break; const n=q('#ses [data-act="next"]'); if(n){n.click();continue;} const o=q('#ses .opt'); if(o){o.click();} else { document.querySelectorAll('#ses .slot').forEach(s=>{s.click();act('key',{k:'1'});}); } const c=q('#ses [data-act="check"]'); if(c) c.click(); } act('ses-exit'); }
async function toKind(lesson, pred, tries=60){ act('start',{l:lesson}); for(let i=0;i<tries;i++){ await sleep(5); if(q('#ses [data-act="ses-start"]')){q('#ses [data-act="ses-start"]').click();continue;} if(pred()) return true; const n=q('#ses [data-act="next"]'); if(n){n.click();continue;} if(q('#ses [data-act="dunno"]')) q('#ses [data-act="dunno"]').click(); } return false; }`;
const S={
 home:{dark:false, js:`(async()=>{await seedProgress(); act('tab',{v:'hoy'});})()`},
 theory:{dark:false, js:`(async()=>{act('start',{l:'L14'});})()`},
 slots:{dark:true, js:`(async()=>{await toKind('L14',()=>document.querySelectorAll('#ses .slot').length>=4 && !q('#ses .fb')); const s=document.querySelectorAll('#ses .slot'); s[0].click(); act('key',{k:'2'}); s[1].click(); act('key',{k:'−'}); act('key',{k:'1'});})()`},
 mcfb:{dark:false, js:`(async()=>{await toKind('L16',()=>q('#ses .opt') && !q('#ses .fb')); q('#ses .opt').click(); q('#ses [data-act="check"]').click();})()`},
 chain:{dark:true, js:`(async()=>{act('start',{l:'L18'}); for(let i=0;i<30;i++){ await sleep(5); if(q('#ses [data-act="ses-start"]')){q('#ses [data-act="ses-start"]').click();continue;} if(q('#ses .chain li.done') && !q('#ses .fb')) break; const n=q('#ses [data-act="next"]'); if(n){n.click();continue;} if(q('#ses .chain')) { q('#ses [data-act="dunno"]').click(); continue;} q('#ses [data-act="dunno"]').click(); } })()`},
 map:{dark:true, js:`(async()=>{await seedProgress(); act('tab',{v:'mapa'}); window.scrollTo(0,520);})()`},
 formulas:{dark:false, js:`(async()=>{act('tab',{v:'formulas'}); window.scrollTo(0,0);})()`},
 hex:{dark:false, js:`(async()=>{await toKind('L5',()=>q('#ses .fig') && document.querySelectorAll('#ses .slot').length===2 && !q('#ses .fb'));})()`},
};
for(const [k,v] of Object.entries(S)){
 const file=path.join(out,'shot-'+k+'.html');
 fs.writeFileSync(file,`<!doctype html><html lang="es"${v.dark?' data-theme="dark"':''}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>${dist}<script>${H}${v.js}</script></body></html>`);
 execFileSync(CHROME,['--headless=new','--disable-gpu','--hide-scrollbars','--window-size=390,844','--force-device-scale-factor=1','--virtual-time-budget=8000','--screenshot='+path.join(out,k+'.png'),'file:///'+file.split(path.sep).join('/')],{stdio:'ignore',timeout:60000});
 console.log('ok',k);
}
