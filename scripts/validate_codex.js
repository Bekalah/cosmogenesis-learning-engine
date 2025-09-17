#!/usr/bin/env node
/* Validate Codex 144:99 repo tasks & node numerology mappings */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.cwd();

const fail = (m) => { console.error("❌", m); process.exitCode = 1; };
const ok   = (m) => console.log("✅", m);

function readJSON(p){ return JSON.parse(fs.readFileSync(p, "utf8")); }
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }
function isDir(p){ try { return fs.statSync(p).isDirectory(); } catch { return false; } }

function globJSON(dir){
  if(!isDir(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => path.join(dir,f));
}

// ---- load tasks.json
const tasksPath = path.join(root, "docs/modernization/tasks.json");
if(!exists(tasksPath)){ fail("docs/modernization/tasks.json missing"); process.exit(1); }
const tasks = readJSON(tasksPath);

// ---- basic path checks
const p = tasks.paths;
if(!exists(path.join(root, p.protect_covenant))) fail("PROTECT.md missing");
else ok("PROTECT.md present");

if(!exists(path.join(root, p.design_tokens))) fail("Design tokens missing");
else ok("Design tokens present");

if(!isDir(path.join(root, p.codex_bundle))) fail("Codex bundle dir missing");
else ok("Codex bundle dir present");

if(!isDir(path.join(root, p.nodes))) fail("Nodes dir missing");
else ok("Nodes dir present");

if(!exists(path.join(root, p.numerology_map))) fail("numerology_map.json missing");
else ok("numerology_map.json present");

// ---- schema validator (minimal, inlined)
function validateNodeSchema(obj){
  const errs = [];
  if(!/^C144N-\d{3}$/.test(obj.id||"")) errs.push("id must match C144N-###");
  if(!obj.numerology || typeof obj.numerology.value!=="number" || typeof obj.numerology.digit!=="number")
    errs.push("numerology.value and numerology.digit required");
  if(!obj.layers || !obj.layers.study_seed || !obj.layers.art || !obj.layers.research)
    errs.push("layers.study_seed/art/research required");
  if(!obj.safety || obj.safety.strobe!==false || obj.safety.autoplay!==false)
    errs.push("safety.strobe=false and safety.autoplay=false required");
  if(!obj.safety || !["calm","reduced"].includes(obj.safety.motion||""))
    errs.push("safety.motion must be 'calm' or 'reduced'");
  return errs;
}

// ---- load numerology map
const numap = readJSON(path.join(root, p.numerology_map)).digits || {};
const nodeFiles = globJSON(path.join(root, p.nodes));

let bad = 0;
for(const f of nodeFiles){
  const n = readJSON(f);
  const errs = validateNodeSchema(n);
  // number-symbolism rule
  if(n.numerology){
    const digit = n.numerology.digit;
    const value = n.numerology.value;
    if(value % 10 !== digit) errs.push(`numerology.digit (${digit}) must equal value%10 (${value%10})`);
    const dmap = numap[String(digit)];
    if(!dmap) errs.push(`digit ${digit} not found in numerology_map.json`);
    else {
      const hasCosmo = Array.isArray(dmap.cosmology) && dmap.cosmology.length>0;
      if(!hasCosmo) errs.push(`digit ${digit} has no cosmology links in numerology_map.json`);
      if(!Array.isArray(n.numerology.links) || n.numerology.links.length === 0){
        errs.push("numerology.links must include at least one cross-cosmology reference");
      }
    }
  }
  if(errs.length){
    console.error("—", f);
    errs.forEach(e => console.error("   •", e));
    bad++;
  }
}

if(bad===0) ok(`Validated ${nodeFiles.length} node(s) successfully`);
else fail(`${bad} node(s) failed validation`);

process.exit(process.exitCode || 0);
