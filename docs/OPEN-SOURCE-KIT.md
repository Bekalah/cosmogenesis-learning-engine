# Cosmogenesis → Stone Grimoire: Open-Source Core Kit

Purpose: single reference for additive-only, ND-safe integrations. All libraries are permissive and offline-capable. Drop these assets into `stone-grimoire/` without altering existing lore.

## Core geometry + rendering (MIT/BSD/OFL)
- **Three.js (MIT)** — primary WebGL engine for sacred geometry, phi spirals, and Rosslyn cube fields.
- **regl (MIT)** — functional WebGL layer for custom passes once Three materials are insufficient.
- **Paper.js (MIT)** — vector drafting for octagrams and vesicas with Canvas export.
- **clipper2 (Boost) or polygon-clipping (MIT)** — precise Boolean ops for sigils and grids.
- **canvas-sketch (MIT)** — repeatable generative art sketch runner for plates and study cards.

## Audio + analysis (OSS)
- **Web Audio API (native)** — browser-native synthesis and FFT; keeps builds future-proof.
- **Tone.js (MIT)** — scaffolds harmonic demos quickly for pedagogic tones.
- **Meyda (MIT)** — audio feature extraction (centroid, rolloff) to drive cymatic grids without closed libraries.

## Data + graph (fully OSS)
- **JanusGraph (Apache-2)** with **Apache TinkerPop/Gremlin** — local-first graph for correspondences (Planet ↔ Hebrew letter ↔ Sephirah ↔ Arcana).
- **SQLite (Public Domain)** — ship tiny read-only bundles of node data, ideal for tablet builds.
- **jsonld.js (BSD-3)** — JSON-LD processing for the universal node schema.

## UI + app shell (OSS)
- **Vite (MIT)** — fast dev server and bundler for ESM modules.
- **Lit (BSD-3)** — lightweight Web Components for `<tarot-card>`, `<node-panel>`, `<pillar-view>`.
- **uhtml (MIT)** — minimal templating if skipping Lit.
- **Cypress or Playwright (Apache-2/MIT)** — end-to-end tests (accessibility flows, no strobe).
- **ESLint + Prettier (MIT)** — keep code clarity consistent.
- **axe-core (MPL-2)** — accessibility assertions; respect `prefers-reduced-motion`.

## Graph viz + pedagogy UI (OSS)
- **Cytoscape.js (MIT)** — interactive correspondence map exploration.
- **Sigma.js (MIT)** — lightweight canvas graph for large lattices.
- **D3.js (BSD-3)** — radial and spiral map overlays (phi-spiral lattice).
- **tabler-icons (MIT)** — calm glyph set; avoid flashing/animated packs.

## Fonts (OFL, self-hosted)
- **Cinzel (OFL)** and **Cormorant (OFL)** — host WOFF2 under `assets/fonts/`. No CDN requests.

## Open data sources (clearly licensed)
- **Wikidata (CC0)** — structured facts for planets, deities, authors.
- **Wikimedia Commons (mixed, verify each)** — diagrams and engravings (ensure CC BY/CC0).
- **Project Gutenberg (Public Domain US)** — classic texts.
- **Internet Archive (varied)** — filter for CC or PD and log provenance links.
- **Original datasets** — license content/art as CC BY-NC-SA 4.0 and code as MIT/Apache-2.0.

## Licensing layout
- `LICENSE` → MIT (code).
- `LICENSE-content` → CC BY-NC-SA 4.0 (text/art/plates).
- `NOTICE` → list third-party libraries with their licenses.
- Each JSON/plate frontmatter:
  ```yaml
  provenance:
    author: "Rebecca Respawn"
    license: "CC BY-NC-SA 4.0"
    sources: ["Wikidata:Q2", "Gutenberg:XXXX"]
    created: "2025-09-18"
    nd_safe: true
  ```

## Repo structure (drop-in, additive-only)
```
assets/
  fonts/ (Cinzel, Cormorant WOFF2)
  img/backgrounds/stone-grimoire.png
  js/engines/
    sacred-geometry.js
    cosmogenesis-brain.js
    lattice-viz.js
    audio-cymatics.js
chapels/
  index.html
registry/
  nodes.jsonld
  correspondences.graph.json   # Gremlin seeds
  palettes.json
docs/
  OPEN-SOURCE-KIT.md
  schema/universal-node.schema.json
```

## Universal node schema (JSON-LD starter, copy-ready)
```json
{
  "@context": {
    "@vocab": "https://cathedral.example/vocab#",
    "id": "@id",
    "type": "@type",
    "name": "http://schema.org/name",
    "symbol": "Symbol",
    "planet": "Planet",
    "sephirah": "Sephirah",
    "hebrew": "HebrewLetter",
    "arcana": "TarotArcana",
    "toneHz": "TonalFrequencyHz",
    "color": "ColorHSL",
    "safety": "SafetyProfile",
    "lineage": "LineageTag"
  },
  "id": "urn:c144:node:C144N-001",
  "type": ["UniversalNode", "ArcanaNode"],
  "name": "The Fool",
  "arcana": "MAJOR_00",
  "sephirah": "Kether",
  "hebrew": "Aleph",
  "planet": "Uranus",
  "toneHz": 256,
  "color": {"h": 48, "s": 85, "l": 55},
  "lineage": ["Hermetic", "Surrealist"],
  "safety": {"strobe": false, "autoplay": false, "motion": "calm"}
}
```

## Gremlin seed (JanusGraph) — correspondences (copy-ready)
```groovy
// run in Gremlin console
g = graph.traversal()
def VERT = { label, k, v -> g.addV(label).property('key',k).property('val',v).next() }
def REL = { a, et, b -> g.V().has('key',a).next().addEdge(et, g.V().has('key',b).next()) }

VERT('Planet','Uranus','Uranus')
VERT('Sephirah','Kether','Kether')
VERT('Hebrew','Aleph','Aleph')
VERT('Arcana','MAJOR_00','The Fool')
REL('Uranus','RULER_OF','MAJOR_00')
REL('Aleph','PATH_OF','MAJOR_00')
REL('Kether','CROWNS','MAJOR_00')
```

## Cosmogenesis brain module (ESM, no deps, MIT)
```js
// assets/js/engines/cosmogenesis-brain.js
export function prefersReducedMotion(){ return matchMedia('(prefers-reduced-motion: reduce)').matches; }
export const SAFE = { stop(){ document.documentElement.style.setProperty('--motion-scale','0'); window.dispatchEvent(new CustomEvent('nd-safe-stop')); } };

export const PHI = (1+Math.sqrt(5))/2;
export function phiSpiral(n, maxR=1){ const pts=[]; for(let i=1;i<=n;i++){const a=i*2*Math.PI/PHI, r=maxR*Math.pow(i/n,1/PHI); pts.push([Math.cos(a)*r, Math.sin(a)*r]); } return pts; }

export function numerologyId(id){ const m=id.match(/\d+/g); if(!m) return 0; let s=m.join('').split('').reduce((a,b)=>a+ +b,0); while(s>=10) s=String(s).split('').reduce((a,b)=>a+ +b,0); return s; }

export function frequencyFromNumerology(n){ const base=256; return base*Math.pow(PHI, n/7); }

export function loadNodes(json){ // accepts JSON-LD array or plain array
  return Array.isArray(json) ? json : (json['@graph'] || []);
}
```

## Stone Grimoire shell (HTML + ESM, offline)
```html
<!-- chapels/index.html (OSS only) -->
<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Stone Grimoire — Cosmogenesis</title>
<style>
  @font-face{font-family:Cinzel; src:url("../assets/fonts/Cinzel-VariableFont.ttf") format("truetype"); font-display:swap;}
  @font-face{font-family:Cormorant; src:url("../assets/fonts/CormorantGaramond-Regular.ttf") format("truetype"); font-display:swap;}
  :root{--obsidian:#0a0a0a; --gold:#DAA520; --paper:#faf6ee;}
  body{margin:0; background:var(--obsidian); color:var(--paper); font-family:Cormorant,serif;}
  header{font-family:Cinzel,serif; text-align:center; padding:18px 10px; letter-spacing:0.08em;}
  .canvas{height:60vh; background:#111; border-top:1px solid #2b2b2b; border-bottom:1px solid #2b2b2b; display:flex; align-items:center; justify-content:center;}
  .grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:12px; padding:14px;}
  .card{background:#111; border:1px solid #2a2a2a; padding:12px; border-radius:8px}
  .hush{position:fixed; right:12px; bottom:12px; background:var(--gold); color:#000; padding:8px 10px; border-radius:6px; font-family:Cinzel; border:none}
</style>
</head><body>
<header>CAThedral of Circuits — Stone Grimoire</header>
<section class="canvas"><img alt="Stone Grimoire Background" src="../assets/img/backgrounds/stone-grimoire.png" style="max-width:100%; max-height:100%; object-fit:contain"/></section>
<section class="grid" id="nodes"></section>
<button class="hush" id="safeStop">SAFE STOP</button>
<script type="module">
  import {phiSpiral, numerologyId, frequencyFromNumerology, prefersReducedMotion, SAFE} from "../assets/js/engines/cosmogenesis-brain.js";
  // seed nodes (replace with registry/nodes.jsonld)
  const nodes = [
    {"id":"C144N-001","name":"The Fool","arcana":"MAJOR_00","sephirah":"Kether","hebrew":"Aleph","planet":"Uranus"},
    {"id":"C144N-017","name":"The Star","arcana":"MAJOR_17","sephirah":"Yesod","hebrew":"Tzaddi","planet":"Saturn"}
  ];
  const host = document.getElementById('nodes');
  for(const n of nodes){
    const nu = numerologyId(n.id), f = frequencyFromNumerology(nu).toFixed(2);
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<strong>${n.name}</strong><br/>${n.id}<br/><small>${n.sephirah} • ${n.hebrew} • ${n.planet} • ${f} Hz</small>`;
    host.appendChild(card);
  }
  document.getElementById('safeStop').onclick = ()=>SAFE.stop();
  if(prefersReducedMotion()){ SAFE.stop(); }
</script>
</body></html>
```

## Rosslyn cube background (open creation)
- **Preferred**: generate via `canvas-sketch` + Paper.js, export PNG, store as `assets/img/backgrounds/stone-grimoire.png` (≤5 MB).
- **Alternate**: recolor a public-domain isometric cube engraving (Wikimedia Commons) with GIMP (GPL) and export.

## Planetary-hours module (no deps, MIT)
```js
// assets/js/engines/planetary-hours.js
// Returns current planetary hour ruler (Chaldean order) for a given date/location.
export function planetaryHourRuler(date=new Date()){
  const chaldean = ['Saturn','Jupiter','Mars','Sun','Venus','Mercury','Moon'];
  const dayRuler = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn']; // Sun..Sat
  const start = new Date(date); start.setHours(6,0,0,0); // sunrise approx; replace with real sunrise when available
  const ms = date - start, hour = Math.floor((ms/ (60*60*1000)) % 24);
  const offset = chaldean.indexOf(dayRuler[date.getDay()]);
  return chaldean[(offset + hour) % 7];
}
```

## Code-bot instructions (exact)
Intent: USE OPEN-SOURCE ONLY, ADDITIVE-ONLY.
1. Add libraries: `three` (MIT), `tone` (MIT), `meyda` (MIT), `jsonld` (BSD-3), `lit` (BSD-3), `vite` (MIT).
2. Create files exactly as listed above. If a file already exists, create a `.v2` variant instead of overwriting.
3. Build with Vite ESM (no heavy frameworks).
4. Fonts: place Cinzel/Cormorant WOFF2 under `assets/fonts/`.
5. Background: store `stone-grimoire.png` under `assets/img/backgrounds/`.
6. Verify `chapels/index.html` loads offline; `SAFE STOP` works; `prefers-reduced-motion` respected.
7. Commit message: `OSS Core Kit: Cosmogenesis Brain + Stone Grimoire shell (ND-safe, additive)`.

## Safety + provenance checklist (ND-safe, OSS)
- No strobe, no autoplay; `SAFE STOP` button required on every route.
- Respect `prefers-reduced-motion`.
- Every asset lists a license (OFL/MIT/Apache-2/CC).
- Public-domain/CC sources logged in frontmatter.
- All code/JSON is additive-only; never overwrite constants or provenance.
