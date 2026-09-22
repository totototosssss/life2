import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=fs.existsSync(path.join(here,'index.html'))?here:path.resolve(here,'..');
const site=root;
const out=path.join(root,'release');
fs.mkdirSync(out,{recursive:true});
const scripts=['universities.js','data.js','world.js','systems.js','chapters.js','admission-data.js','admissions.js','quiz.js','next.js','engine.js','app.js'];
const entries=[];
function add(source,base=root){const name=path.basename(source),file=fs.existsSync(path.join(base,source))?path.join(base,source):path.join(base,name);let data=fs.readFileSync(file);if(name==='package.json'){const pkg=JSON.parse(data);pkg.scripts={dev:'node serve.mjs',test:'node test-engine.cjs && node test-systems.cjs && node test-chapters.cjs && node test-v4.cjs',build:'node package.mjs'};data=Buffer.from(JSON.stringify(pkg,null,2)+'\n');}entries.push({name,data});}
for(const n of ['index.html','style.css',...scripts,'.nojekyll'])add(n,site);
const pictures=fs.readdirSync(site).filter(n=>/^sticker-\d\d\.png$/.test(n)).sort();
if(pictures.length!==16)throw Error('Expected all 16 character expressions');
for(const n of pictures)add(n,site);
for(const n of ['README.md','package.json','docs/GAME_RULES.md','docs/SOURCES.md','docs/TEST_REPORT.md','tools/serve.mjs','tools/package.mjs','tools/test-engine.cjs','tools/test-systems.cjs','tools/test-chapters.cjs','tools/test-v4.cjs','qa/simulation-results.json','qa/expanded-results.json','qa/chapters-results.json','qa/v4-results.json','research/admissions/coverage.json','research/asset_sources.json'])add(n);
if(entries.some(e=>e.name.includes('/')||e.name.includes('\\'))||new Set(entries.map(e=>e.name)).size!==entries.length)throw Error('Release must have unique root-level files');

const images=pictures.map(n=>'data:image/png;base64,'+fs.readFileSync(path.join(site,n)).toString('base64'));
let html=fs.readFileSync(path.join(site,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="style.css">','<style>\n'+fs.readFileSync(path.join(site,'style.css'),'utf8')+'\n</style>');
for(const n of scripts)html=html.replace(`<script defer src="${n}"></script>`,'');
const javascript='window.LIFE_ASSETS='+JSON.stringify(images)+';\n'+scripts.map(n=>fs.readFileSync(path.join(site,n),'utf8')).join('\n;\n');
// Inline scripts run after the document nodes exist; defer has no effect on inline scripts.
html=html.replace('</body>','<script>\n'+javascript.replace(/<\/script/gi,'<\\/script')+'\n</script>\n</body>');
fs.writeFileSync(path.join(out,'Jinsei_Note_Standalone.html'),html);

// A small ZIP writer keeps packaging independent of npm packages and shell tools.
const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(data){let c=0xffffffff;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
entries.push({name:'SHA256.json',data:Buffer.from(JSON.stringify(Object.fromEntries(entries.map(e=>[e.name,createHash('sha256').update(e.data).digest('hex')])),null,2)+'\n')});
const local=[],central=[];let offset=0;
for(const e of entries){
 const name=Buffer.from(e.name),data=deflateRawSync(e.data,{level:9}),crc=crc32(e.data);
 const h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50,0);h.writeUInt16LE(20,4);h.writeUInt16LE(0x0800,6);h.writeUInt16LE(8,8);
 h.writeUInt16LE(((2026-1980)<<9)|(9<<5)|22,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(data.length,18);h.writeUInt32LE(e.data.length,22);h.writeUInt16LE(name.length,26);
 local.push(h,name,data);
 const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(0x0800,8);c.writeUInt16LE(8,10);
 c.writeUInt16LE(((2026-1980)<<9)|(9<<5)|22,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(data.length,20);c.writeUInt32LE(e.data.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);
 central.push(c,name);offset+=h.length+name.length+data.length;
}
const cd=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);
fs.writeFileSync(path.join(out,'Jinsei_Note_GitHub_Pages.zip'),Buffer.concat([...local,cd,end]));
for(const name of ['Jinsei_Note_GitHub_Pages.zip','Jinsei_Note_Standalone.html'])console.log(name+' — '+fs.statSync(path.join(out,name)).size+' bytes');
