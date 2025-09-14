import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

function readJson(p){ return JSON.parse(fs.readFileSync(p, "utf8")); }

const sources = readJson(path.join(ROOT, "registry", "sources.json"));

function findReposRoot(){ return path.resolve(ROOT, ".."); }

// simple glob with ** and *
function globSync(startDir, pattern){
  const parts = pattern.split("/");
  const out = [];
  function walk(dir, i){
    if (i === parts.length){ out.push(dir); return; }
    const part = parts[i];
    if (part === "**"){
      walk(dir, i+1);
      for (const e of fs.readdirSync(dir, { withFileTypes:true })){
        if (e.isDirectory()) walk(path.join(dir, e.name), i);
      }
    } else if (part.includes("*")){
      const rx = new RegExp("^" + part.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*") + "$");
      for (const e of fs.readdirSync(dir, { withFileTypes:true })){
        if (rx.test(e.name)) walk(path.join(dir, e.name), i+1);
      }
    } else {
      const p = path.join(dir, part);
      if (fs.existsSync(p)) walk(p, i+1);
    }
  }
  walk(startDir, 0);
  return out;
}

function collect(){
  const reposRoot = findReposRoot();
  const nodes = [];
  for (const src of sources.sources){
    const repoRoot = path.join(reposRoot, src.repo);
    if (!fs.existsSync(repoRoot)) { console.warn("skip missing repo:", src.repo); continue; }
    for (const g of src.globs){
      const matches = globSync(repoRoot, g);
      for (const m of matches){
        if (m.endsWith("node.json")){
          try{
            const json = readJson(m);
            json.links = json.links || {};
            json.links.repo    = json.links.repo    || src.repo;
            json.links.relpath = json.links.relpath || path.relative(repoRoot, path.dirname(m)).replace(/\\/g,"/");
            nodes.push(json);
          }catch(e){
            console.error("Invalid JSON:", m, e.message);
          }
        }
      }
    }
  }
  return nodes;
}

const registry = { version: new Date().toISOString().slice(0,10), nodes: collect() };
fs.mkdirSync(path.join(ROOT, "registry"), { recursive:true });
fs.writeFileSync(path.join(ROOT, "registry", "registry.json"), JSON.stringify(registry, null, 2));
console.log("Registry built. Nodes:", registry.nodes.length);
