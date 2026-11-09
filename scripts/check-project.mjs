// Static project check (no dependencies): verifies relative imports, named/default exports.
// Run: npm run check
import fs from 'fs'; import path from 'path';
const root=process.argv[2]||'src'; const files=[];
(function walk(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);fs.statSync(p).isDirectory()?walk(p):files.push(p)}})(root);
const exts=['','.js','.jsx','.css','/index.js','/index.jsx'];
let bad=0;
for(const f of files.filter(f=>/\.(jsx?|css)$/.test(f))){
  const s=fs.readFileSync(f,'utf8');
  const re=/(?:import\s[^'"]*?from\s*|import\s*|@import\s*(?:url\()?)['"](\.[^'"]+)['"]/g; let m;
  while((m=re.exec(s))){const t=path.resolve(path.dirname(f),m[1]);
    if(!exts.some(e=>fs.existsSync(t+e)&&fs.statSync(t+e).isFile())){console.log('MISSING',f,m[1]);bad++}}
  // named imports check
  const re2=/import\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g;
  while((m=re2.exec(s))){const t=path.resolve(path.dirname(f),m[2]);const rf=exts.map(e=>t+e).find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());
    if(!rf||!/\.jsx?$/.test(rf))continue;const src=fs.readFileSync(rf,'utf8');
    for(const n of m[1].split(',').map(x=>x.trim().split(/\s+as\s+/)[0]).filter(Boolean)){
      if(!new RegExp(`export\\s+(const|function|let|class)\\s+${n}\\b|export\\s*\\{[^}]*\\b${n}\\b`).test(src)){console.log('NO EXPORT',n,'from',rf,'in',f);bad++}}}
  const re3=/import\s+(\w+)\s+from\s*['"](\.[^'"]+)['"]/g;
  while((m=re3.exec(s))){const t=path.resolve(path.dirname(f),m[2]);const rf=exts.map(e=>t+e).find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());
    if(rf&&/\.jsx?$/.test(rf)&&!/export\s+default/.test(fs.readFileSync(rf,'utf8'))){console.log('NO DEFAULT',rf,'in',f);bad++}}
}

// ---- Assets: every public path named in src/data/assets.js and src/data/content.js must exist.
const pub = path.resolve('public');
for (const f of ['src/data/assets.js', 'src/data/content.js', 'src/data/resort.js']) {
  if (!fs.existsSync(f)) continue;
  const text = fs.readFileSync(f, 'utf8').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  for (const m of text.matchAll(/['"](\/assets\/[^'"]+)['"]/g)) {
    if (!fs.existsSync(path.join(pub, m[1]))) { console.log('MISSING ASSET', m[1], 'in', f); bad++; }
  }
}
// ---- Navigation: every nav href must match an element id in the page sections.
if (fs.existsSync('src/data/nav.js')) {
  const nav = fs.readFileSync('src/data/nav.js', 'utf8');
  const allSrc = files.filter((f) => /\.jsx$/.test(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  for (const m of nav.matchAll(/href:\s*'#([\w-]+)'/g)) {
    if (m[1] === 'top') continue;
    if (!new RegExp(`id=["']${m[1]}["']`).test(allSrc)) { console.log('NAV TARGET NOT FOUND #' + m[1]); bad++; }
  }
}
console.log('files',files.length,'problems',bad);
process.exit(bad ? 1 : 0);
