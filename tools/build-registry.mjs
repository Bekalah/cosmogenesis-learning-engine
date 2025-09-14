import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'registry', 'sources.json'), 'utf8'));

function findReposRoot() {
  // Assume parent folder holds sibling repos (Option 1)
  return path.resolve(ROOT, '..');
}

function globSync(startDir, patternParts) {
  const results = [];
  function walk(dir, idx) {
    if (idx === patternParts.length) {
      results.push(dir);
      return;
    }
    const part = patternParts[idx];
    if (part === '**') {
      walk(dir, idx + 1);
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) walk(path.join(dir, e.name), idx);
      }
    } else if (part.includes('*')) {
      const rx = new RegExp('^' + part.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (rx.test(e.name)) walk(path.join(dir, e.name), idx + 1);
      }
    } else {
      const p = path.join(dir, part);
      if (fs.existsSync(p)) walk(p, idx + 1);
    }
  }
  walk(startDir, 0);
  return results;
}

function collect() {
  const reposRoot = findReposRoot();
  const nodes = [];
  for (const src of sources.sources) {
    const repoRoot = path.join(reposRoot, src.repo);
    if (!fs.existsSync(repoRoot)) continue;
    for (const g of src.globs) {
      const matches = globSync(repoRoot, g.split('/'));
      for (const m of matches) {
        if (m.endsWith('node.json')) {
          const txt = fs.readFileSync(m, 'utf8');
          try {
            const json = JSON.parse(txt);
            if (!json.links) json.links = {};
            json.links.repo = json.links.repo || src.repo;
            json.links.relpath = json.links.relpath || path.relative(repoRoot, path.dirname(m));
            nodes.push(json);
          } catch (e) {
            console.error('Invalid JSON:', m, e.message);
          }
        }
      }
    }
  }
  return nodes;
}

const registry = {
  version: new Date().toISOString().slice(0, 10),
  nodes: collect()
};

fs.mkdirSync(path.join(ROOT, 'registry'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'registry', 'registry.json'), JSON.stringify(registry, null, 2));
console.log('Registry built. Nodes:', registry.nodes.length);
