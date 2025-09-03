#!/usr/bin/env node
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
let manifest={meta:{project:"Circuitum99 × Stone Grimoire",updated:new Date().toISOString(),nd_safe:true}};
const assets=[];
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