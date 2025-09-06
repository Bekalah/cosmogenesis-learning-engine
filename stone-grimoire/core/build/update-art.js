#!/usr/bin/env node
const fs=require('fs'); const path=require('path');
const root=path.resolve(__dirname,'../../');
const ART=path.join(root,'assets','art');
const inbox=path.join(ART,'inbox'), originals=path.join(ART,'originals'), processed=path.join(ART,'processed'), thumbs=path.join(ART,'thumbs'), webp=path.join(ART,'webp');
[originals,processed,thumbs,webp].forEach(p=>fs.mkdirSync(p,{recursive:true}));
let sharp=null; try{ sharp=require('sharp'); }catch{ console.log('sharp not found — skipping webp/thumbs'); }
const allowed=new Set(['.png','.jpg','.jpeg','.webp','.svg']);
const list=fs.existsSync(inbox)?fs.readdirSync(inbox):[];
const assets=[];
for(const file of list){
  const src=path.join(inbox,file); const ext=path.extname(file).toLowerCase();
  if(!allowed.has(ext)) continue;
  const safe=file.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9._-]/g,'').replace(/-+/g,'-');
  const orig=path.join(originals,safe); fs.renameSync(src,orig);
  const proc=path.join(processed,safe); fs.copyFileSync(orig,proc);
  const isRaster=['.png','.jpg','.jpeg','.webp'].includes(ext);
  let thumbPath='', webpPath='';
  if(sharp&&isRaster){
    const base=safe.replace(ext,'');
    thumbPath=`assets/art/thumbs/${base}-512.jpg`; webpPath=`assets/art/webp/${base}.webp`;
    try{ await sharp(orig).removeAlpha().resize({width:512,withoutEnlargement:true}).jpeg({quality:82}).toFile(path.join(thumbs,`${base}-512.jpg`)); }catch{}
    try{ await sharp(orig).webp({quality:82}).toFile(path.join(webp,`${base}.webp`)); }catch{}
  }
  assets.push({ name:safe, type:ext.slice(1), original:`assets/art/originals/${safe}`, processed:`assets/art/processed/${safe}`, thumb:thumbPath, webp:webpPath, nd_safe:true });
}

function safeReadJSON(p){ try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch{ return null; } }

const sgStruct = safeReadJSON(path.resolve(root,'structure.json')) || safeReadJSON(path.resolve(root,'../structure.json'));
const angels72 = safeReadJSON(path.resolve(root,'../cosmogenesis_learning_engine/registry/datasets/angels72.json')) || safeReadJSON(path.resolve(root,'../cosmogenesis_learning_engine/registry/datasets/shem72.json'));
const styleTokens = safeReadJSON(path.resolve(root,'assets/tokens/perm-style.json')) || { palette:{}, secondary:{}, layers:{} };

const defaultRooms = [
  { id:"crypt", title:"The Crypt", element:"earth", stylepack:"Rosicrucian Black", tone:110, geometry:"vesica" },
  { id:"nave", title:"The Nave", element:"air", stylepack:"Angelic Chorus", tone:222, geometry:"rose-window" },
  { id:"apprentice_pillar", title:"Apprentice Pillar", element:"water", stylepack:"Hilma Spiral", tone:333, geometry:"fibonacci" },
  { id:"respawn_gate", title:"Respawn Gate", element:"fire", stylepack:"Alchemical Bloom", tone:432, geometry:"merkaba" }
];
const rooms = Array.isArray(sgStruct?.rooms)&&sgStruct.rooms.length?sgStruct.rooms:defaultRooms;

function tagFor(a){ if(/crypt/.test(a.name)) return 'crypt'; if(/nave/.test(a.name)) return 'nave'; if(/apprentice|pillar/.test(a.name)) return 'apprentice_pillar'; if(/respawn|gate/.test(a.name)) return 'respawn_gate'; return 'misc'; }
const assetsByRoom={}; for(const a of assets){ const t=tagFor(a); (assetsByRoom[t] ||= []).push(a); }

let angels=[]; if(Array.isArray(angels72)){ angels=angels72.slice(0,12).map((x,i)=>({ id:x.id||`angel-${i+1}`, name:x.name||x.shem||`Shem-${i+1}`, virtue:x.virtue||x.keyword||'', seal:(assets.find(a=>a.name.includes((x.id||`${i+1}`).toString().padStart(2,'0')))||{}).processed||'', gate:x.gate||(i+1) })); }

const creatures={ dragons:[], daimons:[] };
for(const a of assets){
  if(/dragon/.test(a.name)) creatures.dragons.push({ id:a.name.replace(/\..+$/,''), title:"Dragon", frame_class:"lava-brim obsidian-sculpt obsidian-glint obsidian-facets visionary-grid", seal_filter:"obsidianSheen", src:`/${a.processed}`, thumb:a.thumb?`/${a.thumb}`:'', webp:a.webp?`/${a.webp}`:'' });
  if(/daimon/.test(a.name)) creatures.daimons.push({ id:a.name.replace(/\..+$/,''), title:"Daimon", frame_class:"raku-seal obsidian-sculpt visionary-grid", seal_filter:"rakuCopperIridescence", src:`/${a.processed}`, thumb:a.thumb?`/${a.thumb}`:'', webp:a.webp?`/${a.webp}`:'' });
}
const visionaryAssets = assets.filter(a=>/alex[-_ ]?grey|visionary|sacred|grid/.test(a.name));

const manifest={
<<  meta:{ project:"circuitum99 × Stone Grimoire", updated:new Date().toISOString(), nd_safe:true, generator:"update-art.js (manual)" },
>>>>>>>+Updated upstrea
====
>>>>>>> Stashed changes
  meta:{ project:"Circuitum99 × Stone Grimoire", updated:new Date().toISOString(), nd_safe:true, generator:"update-art.js (manual)" },
  tokens:{ css:"/assets/css/perm-style.css", json:"/assets/tokens/perm-style.json", palette:styleTokens.palette||{}, secondary:styleTokens.secondary||{}, layers:styleTokens.layers||{} },
  routes:{ stone_grimoire:{ base:"/", chapels:"/chapels/", assets:"/assets/", bridge:"/bridge/c99-bridge.json" }, cosmogenesis:{ tokens:"/c99/tokens/perm-style.json", css:"/c99/css/perm-style.css", public:"/c99/", bridge:"/bridge/c99-bridge.json" } },
  rooms: rooms.map(r=>({ id:r.id, title:r.title, element:r.element, tone:r.tone, geometry:r.geometry, stylepack:r.stylepack, assets:(assetsByRoom[r.id]||[]).map(a=>({name:a.name,thumb:`/${a.thumb}`,webp:a.webp?`/${a.webp}`:'',src:`/${a.processed}`,type:a.type})) })),
  angels, creatures,
  visionary: { overlays: visionaryAssets.map(a=>({ name:a.name, src:`/${a.processed}`, thumb:a.thumb?`/${a.thumb}`:'', webp:a.webp?`/${a.webp}`:'' })) },
  assets: assets.map(a=>({ name:a.name, src:`/${a.processed}`, thumb:a.thumb?`/${a.thumb}`:'', webp:a.webp?`/${a.webp}`:'', type:a.type }))
};

const bridgeRoot=path.resolve(root,'../../bridge'); fs.mkdirSync(bridgeRoot,{recursive:true});
fs.writeFileSync(path.join(bridgeRoot,'c99-bridge.json'), JSON.stringify(manifest,null,2));
console.log("Bridge manifest written: /bridge/c99-bridge.json");

try{
  const c99=path.resolve(root,'../../cosmogenesis_learning_engine/public/c99');
  if(fs.existsSync(c99)){
    fs.mkdirSync(path.join(c99,'tokens'),{recursive:true});
    fs.mkdirSync(path.join(c99,'css'),{recursive:true});
    fs.copyFileSync(path.resolve(root,'assets','tokens','perm-style.json'), path.join(c99,'tokens','perm-style.json'));
    fs.copyFileSync(path.resolve(root,'assets','css','perm-style.css'), path.join(c99,'css','perm-style.css'));
    console.log("Mirrored tokens+css to C99/public.");
  }
}catch(e){ console.warn("Mirror step skipped:", e.message); }
console.log("Art ingest complete. ND-safe ✓");
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// root of stone-grimoire
const root=path.resolve(__dirname,'..','..');
const repoRoot=path.resolve(root,'..');
// paths
const tokensSrc=path.join(root,'assets','tokens','perm-style.json');
const cssSrc=path.join(root,'assets','css','perm-style.css');
const tokensDest=path.join(repoRoot,'public','c99','tokens','perm-style.json');
const cssDest=path.join(repoRoot,'public','c99','css','perm-style.css');
fs.mkdirSync(path.dirname(tokensDest),{recursive:true});
fs.mkdirSync(path.dirname(cssDest),{recursive:true});
fs.copyFileSync(tokensSrc,tokensDest);
fs.copyFileSync(cssSrc,cssDest);
const styleTokens=JSON.parse(fs.readFileSync(tokensSrc,'utf8'));
<<<<<<let manifest={meta:{project:"circuitum99 × Stone Grimoire",updated:new Date().toISOString(),nd_safe:true}};
>>>>>>>+Updated upstrea

let manlet manifest={meta:{project:"Circuitum99 × Stone Grimoire",updated:new Date().toISOString(),nd_safe:true}};
>>>>>>>+Stashed changes
sets=[];
function safeReadJSON(p){ try{ return JSON.parse(fs.readFileSync(p,'utf8')); }catch{ return null; } }
const cgDataRoot=path.resolve(repoRoot,'assets','data');
const angels72=safeReadJSON(path.join(cgDataRoot,'angels72.json'))||[];
manifest.adventure=Object.assign({},styleTokens.adventure_modes||{},manifest.adventure||{});
manifest.avalon=manifest.avalon||styleTokens.avalon||null;
manifest.between_realm=manifest.between_realm||styleTokens.between_realm||null;
const respawnSteps=styleTokens?.rituals?.respawn_gate?.steps||styleTokens?.rituals?.violet_flame_steps||["Invoke","Rotate","Transmute","Replace"];
manifest.respawn_gate=Object.assign({},manifest.respawn_gate,{alias:(styleTokens?.rituals?.respawn_gate?.alias)||"violet_flame_gate",ray:(styleTokens?.rituals?.respawn_gate?.ray)??6,optional:true,steps:respawnSteps,style:Object.assign({class:"respawn-gate",layer:"respawnGate"},manifest?.respawn_gate?.style||{})});
function collect(regex,css){return(assets||[]).filter(a=>regex.test(a.name)).map(a=>({id:a.name.replace(/\..*$/,''),name:a.name,css,src:`/${a.processed}`,thumb:a.thumb?`/${a.thumb}`:'',webp:a.webp?`/${a.webp}`:''}));}
manifest.oracle_art=collect(/oracle|luminous|gonz|velvet/i,"oracle-velvet luminous-heart");
manifest.angel_seals=collect(/angel|shem|seal|consecrate/i,"consecration-angel");
manifest.pillar_art=collect(/pillar|column|left|right|middle/i,"egregore-card");
const egregoreArt=collect(/egregore|eg-|arcana-|tarot-/i,"egregore-card gonz-velvet");
manifest.egregores=manifest.egregores||{schema:styleTokens.egregores?.schema||{},list:[]};
manifest.egregores.list=(manifest.egregores.list||[]).concat(egregoreArt.map(e=>({id:e.id,title:e.id.replace(/[-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),domain:"oracle",pillar:null,ray:styleTokens.egregores?.defaults?.ray??6,solfeggio:528,angel:null,tarot:null,color:null,css:e.css,art:e})));
if(Array.isArray(angels72)&&angels72.length){manifest.angels=Object.assign({},manifest.angels,{consecration:angels72.map((x,i)=>({id:x.id||`angel-${i+1}`,name:x.name||x.shem||`Shem-${i+1}`,virtue:x.virtue||x.keyword||'',seal:(assets.find(a=>a.name.includes(String(i+1).toString().padStart(2,'0')))||{}).processed||''}))});}
const betweenAssets=collect(/between|liminal|narthex|veil|threshold/i,"between-narthex");
if(betweenAssets.length){manifest.between_realm=manifest.between_realm||{id:"in_between_astral",title:"The Narthex Between",optional:true};manifest.between_realm.assets=(manifest.between_realm.assets||[]).concat(betweenAssets);manifest.between_realm.style=manifest.between_realm.style||{class:"between-narthex",layer:"inBetweenVeil"};}
const wardAssets=collect(/hamsa|evil[- ]?eye|protection[-_ ]?hand|rebecca[-_ ]?respawn[-_ ]?sigil/i,"protection-handsigil visionary-grid");
if(wardAssets.length){manifest.protection=Object.assign({},manifest.protection||{},{sigil:{layer:"protectionSigil",geometry:"protection_hand",assets:wardAssets,css:"protection-handsigil"},rite:styleTokens.rituals?.witch_as_coven_protection||null});}
const bridgeOut=path.join(repoRoot,'bridge','c99-bridge.json');
fs.mkdirSync(path.dirname(bridgeOut),{recursive:true});
fs.writeFileSync(bridgeOut,JSON.stringify(manifest,null,2));
console.log('c99-bridge.json written and tokens/css mirrored');
