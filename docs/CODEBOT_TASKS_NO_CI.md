# CODEBOT_TASKS_NO_CI.md

# PURPOSE: Manual-only pipeline (Working Copy friendly). No GitHub Actions. Establish perm style, ingest art, and populate a rich bridge manifest that both stone_grimoire and cosmogenesis_learning_engine can read to render the interactive book and chapels in sync.

# TOPOLOGY
stone_grimoire/ chapels/ assets/ css/ fonts/ img/ textures/ overlays/ shaders/ tokens/ art/ inbox/ originals/ processed/ thumbs/ webp/ core/ build/ scripts/ docs/ plans/ cosmogenesis_learning_engine/ public/ c99/ css/ img/ tokens/ registry/ datasets/ pages/ engines/ docs/ bridge/ c99-bridge.json c99-bridge.js README.md

# GIT SUBTREE (manual-friendly; avoids submodule auth quirks)
git subtree add —prefix stone_grimoire <REMOTE_URL_STONE> main —squash
git subtree add —prefix cosmogenesis_learning_engine <REMOTE_URL_C99> main —squash

# PERM STYLE TOKENS
stone_grimoire/assets/tokens/perm-style.json
{
>>>>>>>+Updated upstrea
le”, “ve  “meta”: { “name”: “Circuitum99 — Perm Style”, “version”: “1.0.0”, “author”: “Virelai Ezra Lux”, “nd_safe”: true, “notes”: “High-end couture × ancient arcana. No autoplay, no strobe.” },
>>>>>>>+Stashed changes
#460082”,”blue”:”#0080FF”,”green”:”#00FF80”,”amber”:”#FFC800”,”light”:”#FFFFFF”,”crimson”:”#B7410E”,”gold”:”#C9A227”,”obsidian”:”#0B0B0B”,”rose_quartz”:”#FFB6C1”,”teal_glow”:”#00CED1”,”violet_alt”:”#8A2BE2”,”gonzalez_palette”:[“#0b0b0b”,”#16121b”,”#2a2140”,”#5e4ba8”,”#e6e6e6”] },
  “line”: { “hair”: 1, “primary”: 2, “pillar”: 3 },
  “typography”: { “display”: “’EB Garamond’,’Junicode’,serif”, “gothic”: “’Cinzel’,serif”, “ui”: “’Inter’,system-ui,sans-serif”, “scale”: { “h1”: 1.888, “h2”: 1.555, “h3”: 1.333, “body”: 1.0, “small”: 0.888 } },
  “geometry”: { “vesica_ratio”: 1.732, “spine_33”: true, “pillars_21”: true, “gates_99”: true },
  “a11y”: { “min_contrast”: 4.5, “motion”: “reduce”, “autoplay”: false, “strobe”: false }
}

# PERM STYLE CSS
stone_grimoire/assets/css/perm-style.css
:root{—void:#0B0B0B;—ink:#141414;—bone:#F8F5EF;—indigo:#280050;—violet:#460082;—blue:#0080FF;—green:#00FF80;—amber:#FFC800;—light:#FFFFFF;—crimson:#B7410E;—gold:#C9A227;—obsidian:#0B0B0B;—rose-quartz:#FFB6C1;—teal-glow:#00CED1;—violet-alt:#8A2BE2;—gonz-0:#0b0b0b;—gonz-1:#16121b;—gonz-2:#2a2140;—gonz-3:#5e4ba8;—gonz-4:#e6e6e6;—line-hair:1px;—line-primary:2px;—line-pillar:3px;—font-display:”EB Garamond”,”Junicode”,serif;—font-gothic:”Cinzel”,serif;—font-ui:”Inter”,system-ui,sans-serif;—scale-h1:1.888rem;—scale-h2:1.555rem;—scale-h3:1.333rem;—scale-body:1rem;—scale-small:.888rem;—min-contrast:4.5}html{color-scheme:light dark}body{margin:0;padding:0;color:var(—bone);background:radial-gradient(1200px 700px at 50% 10%,var(—gonz-2) 0%,var(—gonz-1) 45%,var(—void) 100%);font-family:var(—font-ui);-webkit-font-smoothing:antialiased}h1,h2,h3{font-family:var(—font-display);letter-spacing:.01em;text-rendering:optimizeLegibility}h1{font-size:var(—scale-h1)}h2{font-size:var(—scale-h2)}h3{font-size:var(—scale-h3)}.sigil{stroke:var(—violet);stroke-width:var(—line-primary);fill:none}.sigil—hair{stroke-width:var(—line-hair)}.sigil—pillar{stroke-width:var(—line-pillar)}.portal{border:var(—line-primary) solid var(—gold);box-shadow:0 0 24px 4px rgba(110,0,255,.25);background:linear-gradient(180deg,var(—gonz-2),transparent)}@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}

# BRIDGE RUNTIME (shared helper)
bridge/c99-bridge.js
(function(global){const Bridge={async loadTokens(u){const r=await fetch(u,{cache:’no-store’});return r.json();},async loadManifest(u){const r=await fetch(u,{cache:’no-store’});return r.json();},applyCSSVars(t){const r=document.documentElement,p=t.palette||{};for(const[k,v]of Object.entries(p)){r.style.setProperty(`—${k}`,v);}},ndSafe(){const st=document.createElement(‘style’);st.textContent=“@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}”;document.head.appendChild(st);}};global.C99Bridge=Bridge;})(window);

# UPDATE ART (manual; no CI). Also builds a RICH bridge manifest that includes rooms/chapels if structure files are present. Falls back to defaults if not found.
stone_grimoire/core/build/update-art.js
#!/usr/bin/env node
const fs=require(‘fs’); const path=require(‘path’);
const root=path.resolve(__dirname,’../../‘);
const ART=path.join(root,’assets’,’art’);
const inbox=path.join(ART,’inbox’), originals=path.join(ART,’originals’), processed=path.join(ART,’processed’), thumbs=path.join(ART,’thumbs’), webp=path.join(ART,’webp’);
[originals,processed,thumbs,webp].forEach(p=>fs.mkdirSync(p,{recursive:true}));
let sharp=null; try{ sharp=require(‘sharp’); }catch{ console.log(‘sharp not found — skipping webp/thumbs’); }
const allowed=new Set([‘.png’,’.jpg’,’.jpeg’,’.webp’,’.svg’]);
const list=fs.existsSync(inbox)?fs.readdirSync(inbox):[];
const assets=[];
for(const file of list){
  const src=path.join(inbox,file); const ext=path.extname(file).toLowerCase();
  if(!allowed.has(ext)) continue;
  const safe=file.toLowerCase().replace(/\s+/g,’-‘).replace(/[^a-z0-9._-]/g,’’).replace(/-+/g,’-‘);
  const orig=path.join(originals,safe); fs.renameSync(src,orig);
  const proc=path.join(processed,safe); fs.copyFileSync(orig,proc);
  const isRaster=[‘.png’,’.jpg’,’.jpeg’,’.webp’].includes(ext);
  let thumbPath=‘’, webpPath=‘’;
  if(sharp&&isRaster){
    const base=safe.replace(ext,’’);
    thumbPath=`assets/art/thumbs/${base}-512.jpg`; webpPath=`assets/art/webp/${base}.webp`;
    awaitWrap(sharp(orig).removeAlpha().resize({width:512,withoutEnlargement:true}).jpeg({quality:82}).toFile(path.join(thumbs,`${base}-512.jpg`)));
    awaitWrap(sharp(orig).webp({quality:82}).toFile(path.join(webp,`${base}.webp`)));
  }
  assets.push({ name:safe, type:ext.slice(1), original:`assets/art/originals/${safe}`, processed:`assets/art/processed/${safe}`, thumb:thumbPath, webp:webpPath, nd_safe:true });
}
function awaitWrap(p){ return p.then(()=>true).catch(()=>false); }

function safeReadJSON(pth){ try{ return JSON.parse(fs.readFileSync(pth,’utf8’)); }catch{ return null; } }

// Try to enrich with structure files if present
const sgStruct = safeReadJSON(path.resolve(root,’structure.json’)) || safeReadJSON(path.resolve(root,’../structure.json’));
const angels72 = safeReadJSON(path.resolve(root,’../cosmogenesis_learning_engine/registry/datasets/angels72.json’)) || safeReadJSON(path.resolve(root,’../cosmogenesis_learning_engine/registry/datasets/shem72.json’));
const styleTokens = safeReadJSON(path.resolve(root,’assets/tokens/perm-style.json’)) || { palette:{} };

// Fallback rooms if none present
const defaultRooms = [
  { id:”crypt”, title:”The Crypt”, element:”earth”, stylepack:”Rosicrucian Black”, tone:110, geometry:”vesica” },
  { id:”nave”, title:”The Nave”, element:”air”, stylepack:”Angelic Chorus”, tone:222, geometry:”rose-window” },
  { id:”apprentice_pillar”, title:”Apprentice Pillar”, element:”water”, stylepack:”Hilma Spiral”, tone:333, geometry:”fibonacci” },
  { id:”respawn_gate”, title:”Respawn Gate”, element:”fire”, stylepack:”Alchemical Bloom”, tone:432, geometry:”merkaba” }
];

const rooms = Array.isArray(sgStruct?.rooms) && sgStruct.rooms.length ? sgStruct.rooms : defaultRooms;

// Link assets to rooms by filename hint (e.g., portal_crypt.*, sigil_ann-abyss.*, gate-07.*)
function tagFor(a){
  if(/crypt/.test(a.name)) return ‘crypt’;
  if(/nave/.test(a.name)) return ‘nave’;
  if(/apprentice/.test(a.name)||/pillar/.test(a.name)) return ‘apprentice_pillar’;
  if(/respawn/.test(a.name)||/gate/.test(a.name)) return ‘respawn_gate’;
  return ‘misc’;
}
const assetsByRoom = {};
for(const a of assets){
  const tag = tagFor(a);
  assetsByRoom[tag] = assetsByRoom[tag] || [];
  assetsByRoom[tag].push(a);
}

// If angels dataset exists, index a few exemplars
let angels = [];
if(Array.isArray(angels72)){
  angels = angels72.slice(0,12).map((x,i)=>({
    id: x.id || `angel-${i+1}`,
    name: x.name || x.shem || `Shem-${i+1}`,
    virtue: x.virtue || x.keyword || ‘’,
    seal: (assets.find(a=>a.name.includes((x.id||`${i+1}`).toString().padStart(2,’0’)))||{}).processed || ‘’,
    gate: x.gate || (i+1)
  }));
}

// Build bridge manifest (MEAT)
const manifest = {
  meta: {
<<<<<<< Updated upstream
    project: “circuitum99 × Stone Grimoire”,
    project: “Circuitum99 × Stone Grimoire”,
    updated: new Date().toISOString(),
    nd_safe: true,
    generator: “update-art.js (manual)”
  },
  tokens: {
    css: “/assets/css/perm-style.css”,
    json: “/assets/tokens/perm-style.json”,
    palette: styleTokens.palette || {}
  },
  routes: {
    stone_grimoire: { base: “/“,
      chapels: “/chapels/“,
      assets: “/assets/“,
      bridge: “/bridge/c99-bridge.json”
    },
    cosmogenesis: {
      tokens: “/c99/tokens/perm-style.json”,
      css: “/c99/css/perm-style.css”,
      public: “/c99/“,
      bridge: “/bridge/c99-bridge.json”
    }
  },
  rooms: rooms.map(r=>({
    id: r.id,    project: “circuitum99 × Stone Grimoire”,
>>>>>>>-Updated upstrea
ylepack:    project: “Circuitum99 × Stone Grimoire”,
>>>>>>>+Stashed changes
umb:`/${a.thumb}`,webp:a.webp?`/${a.webp}`:’’,src:`/${a.processed}`,type:a.type}))
  })),
  angels: angels,
  assets: assets.map(a=>({name:a.name,src:`/${a.processed}`,thumb:a.thumb?`/${a.thumb}`:’’,webp:a.webp?`/${a.webp}`:’’,type:a.type}))
};

// Ensure bridge directory at super-repo root
const bridgeRoot = path.resolve(root,’../../bridge’); fs.mkdirSync(bridgeRoot,{recursive:true});
const out = path.join(bridgeRoot,’c99-bridge.json’); fs.writeFileSync(out, JSON.stringify(manifest,null,2));
console.log(“Bridge manifest written:”, out);

// Mirror tokens for C99 consumption (no CI)
try{
  const c99 = path.resolve(root,’../../cosmogenesis_learning_engine/public/c99’);
  if(fs.existsSync(c99)){
    fs.mkdirSync(path.join(c99,’tokens’),{recursive:true});
    fs.mkdirSync(path.join(c99,’css’),{recursive:true});
    fs.copyFileSync(path.resolve(root,’assets’,’tokens’,’perm-style.json’), path.join(c99,’tokens’,’perm-style.json’));
    fs.copyFileSync(path.resolve(root,’assets’,’css’,’perm-style.css’), path.join(c99,’css’,’perm-style.css’));
    console.log(“Mirrored tokens+css to C99/public.”);
  }
}catch(e){ console.warn(“Mirror step skipped:”, e.message); }

console.log(“Art ingest complete. ND-safe ✓”);

# NOTE: run manually (no CI). From repo root:
# node stone_grimoire/core/build/update-art.js

# A MEATY STARTING BRIDGE (writes automatically, but here is a ready-to-use rich example you can drop in if you want to seed the system right now)
bridge/c99-bridge.json
{
  “meta”: { “project”: “circuitum99 × Stone Grimoire”, “updated”: “2025-09-02T12:00:00.000Z”, “nd_safe”: true, “generator”: “manual seed” },
  “meta”: { “project”: “Circuitum99 × Stone Grimoire”, “updated”: “2025-09-02T12:00:00.000Z”, “nd_safe”: true, “generator”: “manual seed” },
  “tokens”: {
    “css”: “/assets/css/perm-style.css”,
    “json”: “/assets/tokens/perm-style.json”,
    “palette”: { “void”:”#0B0B0B”,”ink”:”#141414”,”bone”:”#F8F5EF”,”indigo”:”#280050”,”violet”:”#460082”,”blue”:”#0080FF”,”green”:”#00FF80”,”amber”:”#FFC800”,”light”:”#FFFFFF” }
  },
  “routes”: {
    “stone_grimoire”: { “base”: “/“, “chapels”: “/chapels/“, “assets”: “/assets/“, “bridge”: “/bridge/c99-bridge.json” },
    “cosmogenesis”: { “tokens”: “/c99/tokens/perm-style.json”, “css”: “/c99/css/perm-style.css”, “public”: “/c99/“, “bridge”: “/bridge/  “meta”: { “project”: “circuitum99 × Stone Grimoire”, “updated”: “2025-09-02T12:00:00.000Z”, “nd_safe”: true, “generator”: “manual seed” },
>>>>>>>+Updated upstrea
_crypt-a  “meta”: { “project”: “Circuitum99 × Stone Grimoire”, “updated”: “2025-09-02T12:00:00.000Z”, “nd_safe”: true, “generator”: “manual seed” },
>>>>>>>+Stashed changes
il_ann-abyss.svg”,”thumb”:””,”webp”:””,”src”:”/assets/art/processed/sigil_ann-abyss.svg”,”type”:”svg” }
      ]
    },
    { “id”:”nave”,”title”:”The Nave”,”element”:”air”,”tone”:222,”geometry”:”rose-window”,”stylepack”:”Angelic Chorus”,
      “assets”:[
        { “name”:”portal_nave-a02.png”,”thumb”:”/assets/art/thumbs/portal_nave-a02-512.jpg”,”webp”:”/assets/art/webp/portal_nave-a02.webp”,”src”:”/assets/art/processed/portal_nave-a02.png”,”type”:”png” }
      ]
    },
    { “id”:”apprentice_pillar”,”title”:”Apprentice Pillar”,”element”:”water”,”tone”:333,”geometry”:”fibonacci”,”stylepack”:”Hilma Spiral”,
      “assets”:[
        { “name”:”border_apprentice.svg”,”thumb”:””,”webp”:””,”src”:”/assets/art/processed/border_apprentice.svg”,”type”:”svg” }
      ]
    },
    { “id”:”respawn_gate”,”title”:”Respawn Gate”,”element”:”fire”,”tone”:432,”geometry”:”merkaba”,”stylepack”:”Alchemical Bloom”,
      “assets”:[
        { “name”:”portal_respawn-a01.png”,”thumb”:”/assets/art/thumbs/portal_respawn-a01-512.jpg”,”webp”:”/assets/art/webp/portal_respawn-a01.webp”,”src”:”/assets/art/processed/portal_respawn-a01.png”,”type”:”png” }
      ]
    }
  ],
  “angels”: [
    { “id”:”angel-01”,”name”:”Vehuiah”,”virtue”:”Initiation”,”seal”:”/assets/art/processed/seal_gate-01.svg”,”gate”:1 },
    { “id”:”angel-02”,”name”:”Jeliel”,”virtue”:”Union”,”seal”:”/assets/art/processed/seal_gate-02.svg”,”gate”:2 },
    { “id”:”angel-03”,”name”:”Sitael”,”virtue”:”Refuge”,”seal”:”/assets/art/processed/seal_gate-03.svg”,”gate”:3 },
    { “id”:”angel-04”,”name”:”Elemiah”,”virtue”:”Orientation”,”seal”:”/assets/art/processed/seal_gate-04.svg”,”gate”:4 }
  ],
  “assets”: [
    { “name”:”portal_crypt-a01.png”,”src”:”/assets/art/processed/portal_crypt-a01.png”,”thumb”:”/assets/art/thumbs/portal_crypt-a01-512.jpg”,”webp”:”/assets/art/webp/portal_crypt-a01.webp”,”type”:”png” },
    { “name”:”sigil_ann-abyss.svg”,”src”:”/assets/art/processed/sigil_ann-abyss.svg”,”thumb”:””,”webp”:””,”type”:”svg” },
    { “name”:”portal_nave-a02.png”,”src”:”/assets/art/processed/portal_nave-a02.png”,”thumb”:”/assets/art/thumbs/portal_nave-a02-512.jpg”,”webp”:”/assets/art/webp/portal_nave-a02.webp”,”type”:”png” },
    { “name”:”portal_respawn-a01.png”,”src”:”/assets/art/processed/portal_respawn-a01.png”,”thumb”:”/assets/art/thumbs/portal_respawn-a01-512.jpg”,”webp”:”/assets/art/webp/portal_respawn-a01.webp”,”type”:”png” }
  ]
}

# QUICK TEST (no frameworks). Stone Grimoire page to render bridge manifest.
stone_grimoire/chapels/test.html
<!doctype html><html lang=“en”><head><meta charset=“utf-8”/><meta name=“viewport” content=“width=device-width,initial-scale=1”/><title>Chapel Test — C99</title><link rel=“stylesheet” href=“/assets/css/perm-style.css”/><script src=“/bridge/c99-bridge.js” defer></script><style>.frame{max-width:960px;margin:5rem auto;padding:2rem;border:var(—line-primary) solid var(—gold)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}.card{padding:1rem;background:rgba(20,20,26,.5);border:1px solid var(—indigo)}.card img{width:100%;height:auto;display:block}</style></head><body><div class=“frame”><h1>Portal Gallery (ND-safe)</h1><div class=“grid” id=“gallery”></div></div><script>document.addEventListener(‘DOMContentLoaded’,async()=>{C99Bridge.ndSafe();const m=await C99Bridge.loadManifest(‘/bridge/c99-bridge.json’);const g=document.getElementById(‘gallery’);(m.assets||[]).slice(0,24).forEach(a=>{const el=document.createElement(‘div’);el.className=‘card’;const img=document.createElement(‘img’);img.src=(a.webp&&a.webp.endsWith(‘.webp’))?a.webp:a.src;img.alt=a.name;g.appendChild(el);el.appendChild(img);});});</script></body></html>

# MANUAL RITUAL (Working Copy)
# 1) Export art from Affinity into stone_grimoire/assets/art/inbox/
# 2) Commit in Working Copy
# 3) From repo root (local node or small server): node stone_grimoire/core/build/update-art.js
# 4) Commit generated outputs (originals/ processed/ thumbs/ webp/ bridge/c99-bridge.json)
# 5) Open /chapels/test.html and verify images appear; motion is reduced; colors from perm-style load.

# END