#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(__dirname,'..');
const data=p=>path.join(root,'assets','data',p);
const outDir=path.join(root,'public','c99'); fs.mkdirSync(outDir,{recursive:true});
const read=p=>{try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch{return null}};
const codex=read(data('codex.144_99.json'))||{};
const indra=read(data('indra_net.144_99.json'))||{};
const harmony=read(data('harmony_map.json'))||{};
const angels=read(data('angels72.json'))||[];
const witch=read(data('profiles/default.witch.json'))||{};
const coven=read(data('covens/default.coven.json'))||{};
const pack=read(data('packs/sample-world.pack.json'))||{};
const tokensPath=path.join(outDir,'tokens','perm-style.json');
const cssPath=path.join(outDir,'css','perm-style.css');
const manifest={
meta:{project:"Cosmogenesis Learning Engine", updated:new Date().toISOString(), nd_safe:true},
routes:{ tokens:"/c99/tokens/perm-style.json", css:"/c99/css/perm-style.css" },
codex, indraNet: Object.assign(indra,{ harmony }), witch, coven, pack,
codex, indraNet: indra, witch, coven, pack,
codex, indraNet: Object.assign(indra,{ harmony, angels }), witch, coven, pack,
codex, indraNet: indra, witch, coven, pack,
style:{ tokens: fs.existsSync(tokensPath)?"/c99/tokens/perm-style.json":"", css: fs.existsSync(cssPath)?"/c99/css/perm-style.css":"" }
};
fs.writeFileSync(path.join(outDir,'bridge.json'), JSON.stringify(manifest,null,2));
console.log('Cosmogenesis bridge.json written');
