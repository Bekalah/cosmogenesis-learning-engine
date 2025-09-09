#!/usr/bin/env bash
# add_tesseract_module.sh
# ✦ Codex 144:99 — Tesseract Module (Chariot / Inner Ring) ✦
# - Adds tesseract/ (schema + data + style-skins)
# - Adds docs/chapels/tesseract.html (ND-safe, step-rotate—no autoplay)
# - Adds Grand Stand hub + ateliers stubs
# - Wires Pages index links
# - Keeps everything data-driven; no hardcoding; no flattening.
set -euo pipefail
OVERWRITE="${OVERWRITE:-0}"

wf(){ # write unless exists or OVERWRITE=1
  local p="$1"; shift
  if [ -e "$p" ] && [ "$OVERWRITE" != "1" ]; then echo "skip (exists): $p"; return; fi
  mkdir -p "$(dirname "$p")"; cat >"$p"; echo "wrote: $p"
}
ap(){ # append unique line to file
  local p="$1" line="$2"; mkdir -p "$(dirname "$p")"
  grep -Fqx "$line" "$p" 2>/dev/null || { echo "$line" >> "$p"; echo "appended: $line -> $p"; }
}

# 0) Folders
mkdir -p tesseract/schemas tesseract/data tesseract/skins \
         docs/chapels docs/ateliers docs/assets/js docs/assets/css tesseract/research

# 1) Schemas (strict enough to guide, flexible enough to grow)
wf tesseract/schemas/tesseract.schema.json <<'JSON'
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "TesseractManifest",
  "type": "object",
  "required": ["id","title","modes","tarot_skins","spiritual","rooms","ring_map"],
  "properties": {
    "id":{"type":"string","pattern":"^[a-z0-9_\\-]+$"},
    "title":{"type":"string"},
    "modes":{"type":"array","items":{"type":"object","required":["id","label"],"properties":{
      "id":{"type":"string"},"label":{"type":"string"},"note":{"type":"string"}
    }}},
    "tarot_skins":{"type":"array","items":{"type":"object","required":["id","label"],"properties":{
      "id":{"type":"string"},"label":{"type":"string"},"palette":{"type":"object"}
    }}},
    "spiritual":{"type":"object","properties":{
      "higher_consciousness":{"type":"array","items":{"type":"string"}},
      "interconnectedness":{"type":"array","items":{"type":"string"}},
      "time_space":{"type":"array","items":{"type":"string"}},
      "true_self":{"type":"array","items":{"type":"string"}},
      "practice":{"type":"array","items":{"type":"string"}}
    }},
    "rooms":{"type":"array","items":{"type":"object","required":["id","label"],"properties":{
      "id":{"type":"string"},"label":{"type":"string"},"href":{"type":"string"}
    }}},
    "ring_map":{"type":"object","required":["rings","rooms_per_ring","axis_nodes"],"properties":{
      "rings":{"type":"integer","minimum":1},
      "rooms_per_ring":{"type":"integer","minimum":1},
      "axis_nodes":{"type":"array","items":{"type":"integer"}}
    }}
  },
  "additionalProperties": true
}
JSON

wf tesseract/schemas/skin.schema.json <<'JSON'
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "TarotSkin",
  "type": "object",
  "required":["id","label","palette","labels"],
  "properties":{
    "id":{"type":"string"},
    "label":{"type":"string"},
    "palette":{"type":"object"},
    "labels":{"type":"object"}
  }
}
JSON

# 2) Core manifest (you can edit text peacefully later)
wf tesseract/data/manifest.json <<'JSON'
{
  "id": "tesseract_chariot",
  "title": "Tesseract — Chariot of Open-World Discovery",
  "modes": [
    {"id":"still","label":"Still Cube","note":"Study in place; no motion."},
    {"id":"net","label":"Unfolded Net","note":"Lay the cube as a cross for mapping."},
    {"id":"step","label":"Step Rotation","note":"Button-based 90° steps; no autoplay."}
  ],
  "tarot_skins": [
    {"id":"liber_arcanae","label":"Liber Arcanae"},
    {"id":"rws","label":"Rider–Waite Study"},
    {"id":"thoth","label":"Thoth Study"},
    {"id":"marseilles","label":"Marseilles Study"}
  ],
  "spiritual": {
    "higher_consciousness": [
      "Transcend 3D constraints through contemplative geometry",
      "Expand perception with gentle, focused seeing"
    ],
    "interconnectedness":[
      "Unify lineages as one weave",
      "Move through the cosmic tapestry with care"
    ],
    "time_space":[
      "Wrinkle linear time into insight",
      "Touch timeless libraries of wisdom"
    ],
    "true_self":[
      "Release karmic patterns in a kind container",
      "Return to clear, sovereign self"
    ],
    "practice":[
      "Jnana-style visualization (after Ouspensky)",
      "Parts-safe focus: opt-in, stepwise"
    ]
  },
  "rooms": [
    {"id":"ouspensky","label":"Ouspensky Room","href":"/docs/ateliers/ouspensky.html"},
    {"id":"atelier_constellation","label":"Atelier Constellation","href":"/docs/ateliers/atelier_constellation.html"},
    {"id":"wisdom_towers","label":"Wisdom Towers","href":"/docs/ateliers/wisdom_towers.html"},
    {"id":"vault_of_treasures","label":"Vault of Treasures","href":"/docs/ateliers/vault_of_treasures.html"}
  ],
  "ring_map": { "rings": 12, "rooms_per_ring": 12, "axis_nodes": [1,36,72,108,144] }
}
JSON

# 3) Skin palettes (labels only—no visuals forced; you can refine anytime)
wf tesseract/skins/liber_arcanae.json <<'JSON'
{ "id":"liber_arcanae","label":"Liber Arcanae",
  "palette":{"bg":"#0d0b12","fg":"#eae6ff","accent":"#8a7fff"},
  "labels":{"major":"Liber Seal","wands":"Sulphur","cups":"Salt","swords":"Air","pentacles":"Earth"}
}
JSON
wf tesseract/skins/rws.json <<'JSON'
{ "id":"rws","label":"Rider–Waite Study",
  "palette":{"bg":"#0f1012","fg":"#f2f2f2","accent":"#ffd54d"},
  "labels":{"major":"Major Arcana","wands":"Wands","cups":"Cups","swords":"Swords","pentacles":"Pentacles"}
}
JSON
wf tesseract/skins/thoth.json <<'JSON'
{ "id":"thoth","label":"Thoth Study",
  "palette":{"bg":"#0b0d10","fg":"#e6f0ff","accent":"#6de0ff"},
  "labels":{"major":"Atu","wands":"Wands","cups":"Cups","swords":"Swords","pentacles":"Disks"}
}
JSON
wf tesseract/skins/marseilles.json <<'JSON'
{ "id":"marseilles","label":"Marseilles Study",
  "palette":{"bg":"#0a0c0f","fg":"#fffaf0","accent":"#ff6b6b"},
  "labels":{"major":"Triomphes","wands":"Bâtons","cups":"Coupes","swords":"Épées","pentacles":"Deniers"}
}
JSON

# 4) Chapel (Pages) — ND-safe 3D with step controls, skin loader
wf docs/chapels/tesseract.html <<'HTML'
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><title>Tesseract — Chariot</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="../assets/css/core.css">
<link rel="stylesheet" href="../assets/css/chapel.css">
<style>
.tesseract-wrap{perspective:900px; margin:1rem auto; max-width:820px}
.cube{position:relative; margin:0 auto; transform-style:preserve-3d; width:260px; height:260px; transition:transform .6s ease}
.face{position:absolute; width:260px; height:260px; border:1px solid rgba(255,255,255,.20); display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.03)}
.face .label{opacity:.9; font-size:1rem}
.controls .pill{margin-right:.4rem}
.mode-note{font-size:.9rem; opacity:.85}
.skin{font-size:.85rem; opacity:.9}
</style>
<script defer src="../assets/js/tesseract.js"></script>
</head>
<body data-motion="reduced">
<header>
  <h1>Tesseract — Chariot of Open-World Discovery</h1>
  <nav><a href="../index.html">← Exit / Ground</a> · <a href="grand-stand.html">Grand Stand</a></nav>
  <p class="ethics">ND-safe: no autoplay; button-based step rotation; high-contrast toggle supported.</p>
</header>
<main>
  <section class="controls">
    <h2>Modes & Skin</h2>
    <div>
      <button class="pill is-on" data-mode="still" aria-pressed="true">Still</button>
      <button class="pill" data-mode="net" aria-pressed="false">Unfolded Net</button>
      <button class="pill" data-mode="step" aria-pressed="false">Step Rotation</button>
      <span class="mode-note" id="modeNote"></span>
    </div>
    <div style="margin-top:.5rem">
      <label for="skinSel">Tarot Skin:</label>
      <select id="skinSel" class="skin" aria-label="Tarot skin"></select>
    </div>
  </section>
  <section class="tesseract-wrap">
    <div class="cube" id="cube" aria-live="polite">
      <div class="face" id="f1" style="transform:translateZ(130px)"><span class="label">Major</span></div>
      <div class="face" id="f2" style="transform:rotateY(90deg) translateZ(130px)"><span class="label">Wands</span></div>
      <div class="face" id="f3" style="transform:rotateY(180deg) translateZ(130px)"><span class="label">Cups</span></div>
      <div class="face" id="f4" style="transform:rotateY(-90deg) translateZ(130px)"><span class="label">Swords</span></div>
      <div class="face" id="f5" style="transform:rotateX(90deg) translateZ(130px)"><span class="label">Pentacles</span></div>
      <div class="face" id="f6" style="transform:rotateX(-90deg) translateZ(130px)"><span class="label">Liber Seal</span></div>
    </div>
    <div style="margin-top:.5rem">
      <button class="pill" id="stLeft">◀ Step Left</button>
      <button class="pill" id="stRight">Step Right ▶</button>
      <button class="pill" id="stUp">▲ Step Up</button>
      <button class="pill" id="stDown">▼ Step Down</button>
    </div>
    <p class="caption" id="caption">Choose a mode. Use step to rotate one face at a time.</p>
  </section>
  <section>
    <h2>Why the Tesseract</h2>
    <p id="spirit"></p>
  </section>
</main>
</body></html>
HTML

# 5) Grand Stand + atelier stubs (you can fill curation later)
wf docs/chapels/grand-stand.html <<'HTML'
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><title>Grand Stand — Chariot Hub</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="../assets/css/core.css">
</head>
<body data-motion="reduced">
<header>
  <h1>Grand Stand — Chariot Hub</h1>
  <nav><a href="../index.html">← Return</a> · <a href="tesseract.html">Tesseract</a></nav>
  <p class="ethics">Opt-in, stepwise exploration. Rooms cite sources; ND-safe by design.</p>
</header>
<main>
  <ul>
    <li><a href="../ateliers/ouspensky.html">Ouspensky Room — Visualizing the 4th</a></li>
    <li><a href="../ateliers/atelier_constellation.html">Atelier Constellation — Visionary Artists’ POV</a></li>
    <li><a href="../ateliers/wisdom_towers.html">Wisdom Towers — Cross-Maps</a></li>
    <li><a href="../ateliers/vault_of_treasures.html">Vault of Treasures — Public-Domain Masterworks</a></li>
  </ul>
</main>
</body></html>
HTML

for p in ouspensky atelier_constellation wisdom_towers vault_of_treasures; do
  wf "docs/ateliers/${p}.html" <<HTML
<!doctype html><html lang="en"><head>
<meta charset="utf-8"><title>${p//_/ } — Atelier</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="../assets/css/core.css">
</head>
<body data-motion="reduced">
<header>
  <h1>${p//_/ } — Atelier</h1>
  <nav><a href="../chapels/grand-stand.html">← Grand Stand</a></nav>
</header>
<main>
  <p class="caption">Curate texts, plates, and prompts here. Source with CSL JSON in docs/assets/bib/citations.json.</p>
  <ul>
    <li><em>Drop curated items and study prompts as you go.</em></li>
  </ul>
</main>
</body></html>
HTML
  done

# 6) JS — data-driven skin + modes; pulls manifest + skins (no autoplay)
wf docs/assets/js/tesseract.js <<'JS'
(async function(){
  const cube = document.getElementById('cube');
  const modeBtns = Array.from(document.querySelectorAll('button[data-mode]'));
  const note = document.getElementById('modeNote');
  const skinSel = document.getElementById('skinSel');
  const caption = document.getElementById('caption');
  const spirit = document.getElementById('spirit');

  // Paths for GitHub Pages (/docs is the web root)
  const manifest = await fetch('/tesseract/data/manifest.json').then(r=>r.json()).catch(()=>null);
  const skinsIds = (manifest?.tarot_skins||[]).map(s=>s.id);
  const skins = {};
  for (const id of skinsIds){
    try { skins[id] = await fetch(`/tesseract/skins/${id}.json`).then(r=>r.json()); } catch(e){}
  }

  // Populate skin select
  (manifest?.tarot_skins||[]).forEach(s=>{
    const o=document.createElement('option'); o.value=s.id; o.textContent=s.label; skinSel.appendChild(o);
  });

  function applySkin(){
    const id = skinSel.value || (manifest?.tarot_skins?.[0]?.id);
    const skin = skins[id]; if(!skin) return;
    document.body.style.setProperty('--bg', skin.palette?.bg||'');
    document.body.style.setProperty('--fg', skin.palette?.fg||'');
    document.body.style.setProperty('--accent', skin.palette?.accent||'');
    // face labels
    const L = skin.labels||{};
    const set = (q, text)=>{ const el=document.querySelector(q+' .label'); if(el) el.textContent=text||el.textContent; };
    set('#f1', L.major||'Major');
    set('#f2', L.wands||'Wands');
    set('#f3', L.cups||'Cups');
    set('#f4', L.swords||'Swords');
    set('#f5', L.pentacles||'Pentacles');
    set('#f6', 'Liber Seal');
    caption.textContent = `Skin: ${skin.label} — study palette only; no animations added.`;
  }

  function setMode(m){
    modeBtns.forEach(b=>{
      const on=b.dataset.mode===m;
      b.classList.toggle('is-on',on);
      b.setAttribute('aria-pressed', on?'true':'false');
    });
    if(m==='still'){ cube.style.transform='rotateX(0deg) rotateY(0deg)'; note.textContent='Still study mode.'; }
    if(m==='net'){ cube.style.transform='rotateX(0deg) rotateY(0deg)'; note.textContent='Unfolded net (visual mapping).'; }
    if(m==='step'){ note.textContent='Use step buttons to rotate by 90°.'; }
  }

  let stepX=0, stepY=0;
  function step(dir){
    if(dir==='left') stepY -= 90;
    if(dir==='right') stepY += 90;
    if(dir==='up') stepX += 90;
    if(dir==='down') stepX -= 90;
    cube.style.transform=`rotateX(${stepX}deg) rotateY(${stepY}deg)`;
  }

  document.getElementById('stLeft')?.addEventListener('click',()=>step('left'));
  document.getElementById('stRight')?.addEventListener('click',()=>step('right'));
  document.getElementById('stUp')?.addEventListener('click',()=>step('up'));
  document.getElementById('stDown')?.addEventListener('click',()=>step('down'));
  modeBtns.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));

  // Spiritual copy
  if (manifest?.spiritual){
    const S = manifest.spiritual;
    const bullets = [
      ...(S.higher_consciousness||[]),
      ...(S.interconnectedness||[]),
      ...(S.time_space||[]),
      ...(S.true_self||[]),
      ...(S.practice||[])
    ].slice(0,8).map(x=>`• ${x}`).join('<br>');
    spirit.innerHTML = bullets;
  }

  // start
  setMode('still');
  // pick first skin
  if (manifest?.tarot_skins?.length){ skinSel.value = manifest.tarot_skins[0].id; }
  applySkin();
  skinSel.addEventListener('change',applySkin);
})();
JS

# 7) Index links (safe append; your index already exists)
ap docs/index.html '<a href="chapels/tesseract.html">Tesseract (Chariot)</a> ·'
ap docs/index.html '<a href="chapels/grand-stand.html">Grand Stand / Chariot Hub</a> ·'

# 8) A tiny README for the module
wf tesseract/README.md <<'MD'
# Tesseract — Chariot Module (Codex 144:99)
- Data-driven 3D study object: **no autoplay, stepwise rotations**, ND-safe.
- Skins for Tarot study (RWS/Thoth/Marseilles + Liber Arcanae), palette only.
- Rooms route to ateliers and research vaults.
- Never flatten: all labels/palettes load from `/tesseract/data` & `/tesseract/skins`.

## Customize
- Edit `tesseract/data/manifest.json` — modes, spiritual copy, room links.
- Edit any skin JSON in `tesseract/skins/*.json` — palettes & face labels.

## Pages
- Open `/docs/chapels/tesseract.html` and `/docs/chapels/grand-stand.html`.
MD

echo "Tesseract Module installed. Open docs/chapels/tesseract.html"

