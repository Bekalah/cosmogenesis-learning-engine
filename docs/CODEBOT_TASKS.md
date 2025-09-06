# CODEBOT_TASKS.md

stone_grimoire/ chapels/ assets/ css/ fonts/ img/ textures/ overlays/ shaders/ tokens/ art/ inbox/ originals/ processed/ thumbs/ webp/ core/ build/ scripts/ docs/ plans/ cosmogenesis_learning_engine/ public/ c99/ css/ img/ tokens/ registry/ datasets/ pages/ engines/ docs/ bridge/ c99-bridge.json c99-bridge.js README.md

git subtree add —prefix stone_grimoire <REMOTE_URL_STONE> main —squash
git subtree add —prefix cosmogenesis_learning_engine <REMOTE_URL_C99> main —squash
git subtree push —prefix stone_grimoire <REMOTE_URL_STONE> main
git subtree push —prefix cosmogenesis_learning_engine <REMOTE_URL_C99> main

stone_grimoire/assets/tokens/perm-style.json
{
  “meta”: {
>>>>>>>+Updated upstrea
itum99 —    “name”: “Circuitum99 — Perm Style”,
>>>>>>>+Stashed changes
: “Virelai Ezra Lux”,
    “nd_safe”: true,
    “notes”: “High-end couture × ancient arcana. No autoplay, no strobe.”
  },
  “palette”: {
    “void”: “#0B0B0B”,
    “ink”: “#141414”,
    “bone”: “#F8F5EF”,
    “indigo”: “#280050”,
    “violet”: “#460082”,
    “blue”: “#0080FF”,
    “green”: “#00FF80”,
    “amber”: “#FFC800”,
    “light”: “#FFFFFF”,
    “crimson”: “#B7410E”,
    “gold”: “#C9A227”,
    “obsidian”: “#0B0B0B”,
    “rose_quartz”: “#FFB6C1”,
    “teal_glow”: “#00CED1”,
    “violet_alt”: “#8A2BE2”,
    “gonzalez_palette”: [“#0b0b0b”,”#16121b”,”#2a2140”,”#5e4ba8”,”#e6e6e6”]
  },
  “line”: { “hair”: 1, “primary”: 2, “pillar”: 3 },
  “typography”: {
    “display”: “’EB Garamond’,’Junicode’,serif”,
    “gothic”: “’Cinzel’,serif”,
    “ui”: “’Inter’,system-ui,sans-serif”,
    “scale”: { “h1”: 1.888, “h2”: 1.555, “h3”: 1.333, “body”: 1.0, “small”: 0.888 }
  },
  “geometry”: { “vesica_ratio”: 1.732, “spine_33”: true, “pillars_21”: true, “gates_99”: true },
  “a11y”: { “min_contrast”: 4.5, “motion”: “reduce”, “autoplay”: false, “strobe”: false }
}

stone_grimoire/assets/css/perm-style.css
:root{—void:#0B0B0B;—ink:#141414;—bone:#F8F5EF;—indigo:#280050;—violet:#460082;—blue:#0080FF;—green:#00FF80;—amber:#FFC800;—light:#FFFFFF;—crimson:#B7410E;—gold:#C9A227;—obsidian:#0B0B0B;—rose-quartz:#FFB6C1;—teal-glow:#00CED1;—violet-alt:#8A2BE2;—gonz-0:#0b0b0b;—gonz-1:#16121b;—gonz-2:#2a2140;—gonz-3:#5e4ba8;—gonz-4:#e6e6e6;—line-hair:1px;—line-primary:2px;—line-pillar:3px;—font-display:”EB Garamond”,”Junicode”,serif;—font-gothic:”Cinzel”,serif;—font-ui:”Inter”,system-ui,sans-serif;—scale-h1:1.888rem;—scale-h2:1.555rem;—scale-h3:1.333rem;—scale-body:1rem;—scale-small:.888rem;—min-contrast:4.5}html{color-scheme:light dark}body{margin:0;padding:0;color:var(—bone);background:radial-gradient(1200px 700px at 50% 10%,var(—gonz-2) 0%,var(—gonz-1) 45%,var(—void) 100%);font-family:var(—font-ui);-webkit-font-smoothing:antialiased}h1,h2,h3{font-family:var(—font-display);letter-spacing:.01em;text-rendering:optimizeLegibility}h1{font-size:var(—scale-h1)}h2{font-size:var(—scale-h2)}h3{font-size:var(—scale-h3)}.sigil{stroke:var(—violet);stroke-width:var(—line-primary);fill:none}.sigil—hair{stroke-width:var(—line-hair)}.sigil—pillar{stroke-width:var(—line-pillar)}.portal{border:var(—line-primary) solid var(—gold);box-shadow:0 0 24px 4px rgba(110,0,255,.25);background:linear-gradient(180deg,var(—gonz-2),transparent)}@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

stone_grimoire/core/build/update-art.js
#!/usr/bin/env node
const fs=require(‘fs’);const path=require(‘path’);const exec=(cmd)=>require(‘child_process’).execSync(cmd,{stdio:’inherit’});const root=path.resolve(__dirname,’../../‘);const A=path.join(root,’assets’,’art’);const inbox=path.join(A,’inbox’),originals=path.join(A,’originals’),processed=path.join(A,’processed’),thumbs=path.join(A,’thumbs’),webp=path.join(A,’webp’);[originals,processed,thumbs,webp].forEach(p=>fs.mkdirSync(p,{recursive:true}));let sharp=null;try{sharp=require(‘sharp’);}catch{console.log(‘sharp not found — skipping webp/thumbs’);}const allowed=new Set([‘.png’,’.jpg’,’.jpeg’,’.webp’,’.svg’]);const list=fs.existsSync(inbox)?fs.readdirSync(inbox):[];const manifest=[];for(const file of list){const src=path.join(inbox,file);const ext=path.extname(file).toLowerCase();if(!allowed.has(ext))continue;const safe=file.toLowerCase().replace(/\s+/g,’-‘).replace(/[^a-z0-9._-]/g,’’).replace(/-+/g,’-‘);const destOrig=path.join(originals,safe);fs.renameSync(src,destOrig);const destProc=path.join(processed,safe);fs.copyFileSync(destOrig,destProc);const raster=[‘.png’,’.jpg’,’.jpeg’,’.webp’].includes(ext);if(sharp&&raster){const img=sharp(destOrig).removeAlpha();const base=safe.replace(ext,’’);const tDest=path.join(thumbs,base+’-512.jpg’);img.resize({width:512,withoutEnlargement:true}).jpeg({quality:82}).toFile(tDest).catch(()=>{});const wDest=path.join(webp,base+’.webp’);sharp(destOrig).webp({quality:82}).toFile(wDest).catch(()=>{});}manifest.push({name:safe,original:`assets/art/originals/${safe}`,processed:`assets/art/processed/${safe}`,thumb:`assets/art/thumbs/${safe.replace(ext,’’)}-512.jpg`,webp:`assets/art/webp/${safe.replace(ext,’’)}.webp`,type:ext.replace(‘.’,’’),nd_safe:true});}const bridgeDir=path.resolve(root,’../../bridge’);fs.mkdirSync(bridgeDir,{recursive:true});const bridgePath=path.join(bridgeDir,’c99-bridge.json’);fs.writeFileSync(bridgePath,JSON.stringify({updated:new Date().toISOString(),assets:manifest},null,2));console.log(‘Updated manifest:’,bridgePath);const c99Public=path.resolve(root,’../../cosmogenesis_learning_engine/public/c99’);try{if(fs.existsSync(c99Public)){fs.mkdirSync(path.join(c99Public,’img’),{recursive:true});fs.mkdirSync(path.join(c99Public,’tokens’),{recursive:true});fs.copyFileSync(path.resolve(root,’assets/tokens/perm-style.json’),path.join(c99Public,’tokens’,’perm-style.json’));console.log(‘Mirrored tokens to C99 public.’);}}catch(e){console.warn(‘Mirror step skipped:’,e.message);}console.log(‘Art ingest complete. ND-safe ✓’);

stone_grimoire/core/build/package.json
{“name”:”stone-grimoire-build”,”version”:”1.0.0”,”type”:”module”,”bin”:{“update-art”:”./update-art.js”},”dependencies”:{},”optionalDependencies”:{“sharp”:”^0.33.4”}}

bridge/c99-bridge.js
(function(global){const Bridge={async loadTokens(url){const res=await fetch(url,{cache:’no-store’});return await res.json();},async loadManifest(url){const res=await fetch(url,{cache:’no-store’});return await res.json();},applyCSSVars(tokens){const r=document.documentElement;const p=tokens.palette||{};for(const [k,v]of Object.entries(p)){r.style.setProperty(`—${k}`,v);}},ndSafe(){const root=document.documentElement;root.style.setProperty(‘—min-contrast’,’4.5’);const style=document.createElement(‘style’);style.textContent=“@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}”;document.head.appendChild(style);}};global.C99Bridge=Bridge;})(window);

bridge/README.md
c99-bridge.json is generated by update-art.js inside stone_grimoire. Both apps reference the same tokens and manifest: Tokens (CSS/JSON): /assets/css/perm-style.css and /assets/tokens/perm-style.json (SG) Bridge manifest: /bridge/c99-bridge.json (root of super-repo) In C99 (cosmogenesis_learning_engine), load tokens into /public/c99/tokens/perm-style.json (mirrored automatically).

stone_grimoire/chapels/test.html
<!doctype html><html lang=“en”><head><meta charset=“utf-8”/><meta name=“viewport” content=“width=device-width,initial-scale=1”/><title>Chapel Test — C99</title><link rel=“stylesheet” href=“/assets/css/perm-style.css”/><script src=“/bridge/c99-bridge.js” defer></script><style>.frame{max-width:960px;margin:5rem auto;padding:2rem;border:var(—line-primary) solid var(—gold)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}.card{padding:1rem;background:rgba(20,20,26,.5);border:1px solid var(—indigo)}.card img{width:100%;height:auto;display:block}</style></head><body><div class=“frame”><h1>Portal Gallery (ND-safe)</h1><div class=“grid” id=“gallery”></div></div><script>document.addEventListener(‘DOMContentLoaded’,async()=>{C99Bridge.ndSafe();const tokens=await C99Bridge.loadTokens(‘/assets/tokens/perm-style.json’);C99Bridge.applyCSSVars(tokens);const m=await C99Bridge.loadManifest(‘/bridge/c99-bridge.json’);const g=document.getElementById(‘gallery’);m.assets.slice(0,24).forEach(a=>{const el=document.createElement(‘div’);el.className=‘card’;const img=document.createElement(‘img’);img.src=(a.webp&&a.webp.endsWith(‘.webp’))?’/‘+a.webp:’/‘+a.processed;img.alt=a.name;g.appendChild(el);el.appendChild(img);});});</script></body></html>

END# CODEBOT_TASKS.md

stone_grimoire/ chapels/ assets/ css/ fonts/ img/ textures/ overlays/ shaders/ tokens/ art/ inbox/ originals/ processed/ thumbs/ webp/ core/ build/ scripts/ docs/ plans/ cosmogenesis_learning_engine/ public/ c99/ css/ img/ tokens/ registry/ datasets/ pages/ engines/ docs/ bridge/ c99-bridge.json c99-bridge.js README.md

git subtree add —prefix stone_grimoire <REMOTE_URL_STONE> main —squash
git subtree add —prefix cosmogenesis_learning_engine <REMOTE_URL_C99> main —squash
git subtree push —prefix stone_grimoire <REMOTE_URL_STONE> main
git subtree push —prefix cosmogenesis_learning_engine <REMOTE_URL_C99> main

stone_grimoire/assets/tokens/perm-style.json
{
  “meta”: {
<<<<<<< Updated     “name”: “circuitum99 — Perm Style”,
>>>>>>>+Updated upstrea
itum99 —    “name”: “Circuitum99 — Perm Style”,
>>>>>>>+Stashed changes
: “Virelai Ezra Lux”,
    “nd_safe”: true,
    “notes”: “High-end couture × ancient arcana. No autoplay, no strobe.”
  },
  “palette”: {
    “void”: “#0B0B0B”,
    “ink”: “#141414”,
    “bone”: “#F8F5EF”,
    “indigo”: “#280050”,
    “violet”: “#460082”,
    “blue”: “#0080FF”,
    “green”: “#00FF80”,
    “amber”: “#FFC800”,
    “light”: “#FFFFFF”,
    “crimson”: “#B7410E”,
    “gold”: “#C9A227”,
    “obsidian”: “#0B0B0B”,
    “rose_quartz”: “#FFB6C1”,
    “teal_glow”: “#00CED1”,
    “violet_alt”: “#8A2BE2”,
    “gonzalez_palette”: [“#0b0b0b”,”#16121b”,”#2a2140”,”#5e4ba8”,”#e6e6e6”]
  },
  “line”: { “hair”: 1, “primary”: 2, “pillar”: 3 },
  “typography”: {
    “display”: “’EB Garamond’,’Junicode’,serif”,
    “gothic”: “’Cinzel’,serif”,
    “ui”: “’Inter’,system-ui,sans-serif”,
    “scale”: { “h1”: 1.888, “h2”: 1.555, “h3”: 1.333, “body”: 1.0, “small”: 0.888 }
  },
  “geometry”: { “vesica_ratio”: 1.732, “spine_33”: true, “pillars_21”: true, “gates_99”: true },
  “a11y”: { “min_contrast”: 4.5, “motion”: “reduce”, “autoplay”: false, “strobe”: false }
}

stone_grimoire/assets/css/perm-style.css
:root{—void:#0B0B0B;—ink:#141414;—bone:#F8F5EF;—indigo:#280050;—violet:#460082;—blue:#0080FF;—green:#00FF80;—amber:#FFC800;—light:#FFFFFF;—crimson:#B7410E;—gold:#C9A227;—obsidian:#0B0B0B;—rose-quartz:#FFB6C1;—teal-glow:#00CED1;—violet-alt:#8A2BE2;—gonz-0:#0b0b0b;—gonz-1:#16121b;—gonz-2:#2a2140;—gonz-3:#5e4ba8;—gonz-4:#e6e6e6;—line-hair:1px;—line-primary:2px;—line-pillar:3px;—font-display:”EB Garamond”,”Junicode”,serif;—font-gothic:”Cinzel”,serif;—font-ui:”Inter”,system-ui,sans-serif;—scale-h1:1.888rem;—scale-h2:1.555rem;—scale-h3:1.333rem;—scale-body:1rem;—scale-small:.888rem;—min-contrast:4.5}html{color-scheme:light dark}body{margin:0;padding:0;color:var(—bone);background:radial-gradient(1200px 700px at 50% 10%,var(—gonz-2) 0%,var(—gonz-1) 45%,var(—void) 100%);font-family:var(—font-ui);-webkit-font-smoothing:antialiased}h1,h2,h3{font-family:var(—font-display);letter-spacing:.01em;text-rendering:optimizeLegibility}h1{font-size:var(—scale-h1)}h2{font-size:var(—scale-h2)}h3{font-size:var(—scale-h3)}.sigil{stroke:var(—violet);stroke-width:var(—line-primary);fill:none}.sigil—hair{stroke-width:var(—line-hair)}.sigil—pillar{stroke-width:var(—line-pillar)}.portal{border:var(—line-primary) solid var(—gold);box-shadow:0 0 24px 4px rgba(110,0,255,.25);background:linear-gradient(180deg,var(—gonz-2),transparent)}@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

stone_grimoire/core/build/update-art.js
#!/usr/bin/env node
const fs=require(‘fs’);const path=require(‘path’);const exec=(cmd)=>require(‘child_process’).execSync(cmd,{stdio:’inherit’});const root=path.resolve(__dirname,’../../‘);const A=path.join(root,’assets’,’art’);const inbox=path.join(A,’inbox’),originals=path.join(A,’originals’),processed=path.join(A,’processed’),thumbs=path.join(A,’thumbs’),webp=path.join(A,’webp’);[originals,processed,thumbs,webp].forEach(p=>fs.mkdirSync(p,{recursive:true}));let sharp=null;try{sharp=require(‘sharp’);}catch{console.log(‘sharp not found — skipping webp/thumbs’);}const allowed=new Set([‘.png’,’.jpg’,’.jpeg’,’.webp’,’.svg’]);const list=fs.existsSync(inbox)?fs.readdirSync(inbox):[];const manifest=[];for(const file of list){const src=path.join(inbox,file);const ext=path.extname(file).toLowerCase();if(!allowed.has(ext))continue;const safe=file.toLowerCase().replace(/\s+/g,’-‘).replace(/[^a-z0-9._-]/g,’’).replace(/-+/g,’-‘);const destOrig=path.join(originals,safe);fs.renameSync(src,destOrig);const destProc=path.join(processed,safe);fs.copyFileSync(destOrig,destProc);const raster=[‘.png’,’.jpg’,’.jpeg’,’.webp’].includes(ext);if(sharp&&raster){const img=sharp(destOrig).removeAlpha();const base=safe.replace(ext,’’);const tDest=path.join(thumbs,base+’-512.jpg’);img.resize({width:512,withoutEnlargement:true}).jpeg({quality:82}).toFile(tDest).catch(()=>{});const wDest=path.join(webp,base+’.webp’);sharp(destOrig).webp({quality:82}).toFile(wDest).catch(()=>{});}manifest.push({name:safe,original:`assets/art/originals/${safe}`,processed:`assets/art/processed/${safe}`,thumb:`assets/art/thumbs/${safe.replace(ext,’’)}-512.jpg`,webp:`assets/art/webp/${safe.replace(ext,’’)}.webp`,type:ext.replace(‘.’,’’),nd_safe:true});}const bridgeDir=path.resolve(root,’../../bridge’);fs.mkdirSync(bridgeDir,{recursive:true});const bridgePath=path.join(bridgeDir,’c99-bridge.json’);fs.writeFileSync(bridgePath,JSON.stringify({updated:new Date().toISOString(),assets:manifest},null,2));console.log(‘Updated manifest:’,bridgePath);const c99Public=path.resolve(root,’../../cosmogenesis_learning_engine/public/c99’);try{if(fs.existsSync(c99Public)){fs.mkdirSync(path.join(c99Public,’img’),{recursive:true});fs.mkdirSync(path.join(c99Public,’tokens’),{recursive:true});fs.copyFileSync(path.resolve(root,’assets/tokens/perm-style.json’),path.join(c99Public,’tokens’,’perm-style.json’));console.log(‘Mirrored tokens to C99 public.’);}}catch(e){console.warn(‘Mirror step skipped:’,e.message);}console.log(‘Art ingest complete. ND-safe ✓’);

stone_grimoire/core/build/package.json
{“name”:”stone-grimoire-build”,”version”:”1.0.0”,”type”:”module”,”bin”:{“update-art”:”./update-art.js”},”dependencies”:{},”optionalDependencies”:{“sharp”:”^0.33.4”}}

bridge/c99-bridge.js
(function(global){const Bridge={async loadTokens(url){const res=await fetch(url,{cache:’no-store’});return await res.json();},async loadManifest(url){const res=await fetch(url,{cache:’no-store’});return await res.json();},applyCSSVars(tokens){const r=document.documentElement;const p=tokens.palette||{};for(const [k,v]of Object.entries(p)){r.style.setProperty(`—${k}`,v);}},ndSafe(){const root=document.documentElement;root.style.setProperty(‘—min-contrast’,’4.5’);const style=document.createElement(‘style’);style.textContent=“@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}”;document.head.appendChild(style);}};global.C99Bridge=Bridge;})(window);

bridge/README.md
c99-bridge.json is generated by update-art.js inside stone_grimoire. Both apps reference the same tokens and manifest: Tokens (CSS/JSON): /assets/css/perm-style.css and /assets/tokens/perm-style.json (SG) Bridge manifest: /bridge/c99-bridge.json (root of super-repo) In C99 (cosmogenesis_learning_engine), load tokens into /public/c99/tokens/perm-style.json (mirrored automatically).

stone_grimoire/chapels/test.html
<!doctype html><html lang=“en”><head><meta charset=“utf-8”/><meta name=“viewport” content=“width=device-width,initial-scale=1”/><title>Chapel Test — C99</title><link rel=“stylesheet” href=“/assets/css/perm-style.css”/><script src=“/bridge/c99-bridge.js” defer></script><style>.frame{max-width:960px;margin:5rem auto;padding:2rem;border:var(—line-primary) solid var(—gold)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}.card{padding:1rem;background:rgba(20,20,26,.5);border:1px solid var(—indigo)}.card img{width:100%;height:auto;display:block}</style></head><body><div class=“frame”><h1>Portal Gallery (ND-safe)</h1><div class=“grid” id=“gallery”></div></div><script>document.addEventListener(‘DOMContentLoaded’,async()=>{C99Bridge.ndSafe();const tokens=await C99Bridge.loadTokens(‘/assets/tokens/perm-style.json’);C99Bridge.applyCSSVars(tokens);const m=await C99Bridge.loadManifest(‘/bridge/c99-bridge.json’);const g=document.getElementById(‘gallery’);m.assets.slice(0,24).forEach(a=>{const el=document.createElement(‘div’);el.className=‘card’;const img=document.createElement(‘img’);img.src=(a.webp&&a.webp.endsWith(‘.webp’))?’/‘+a.webp:’/‘+a.processed;img.alt=a.name;g.appendChild(el);el.appendChild(img);});});</script></body></html>

END