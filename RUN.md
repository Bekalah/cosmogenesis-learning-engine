# Codex 144:99 — Helix Viewer (ND-safe, static)

This viewer reads three data files and shows **Node • Tarot • Realm** links.  
It’s static: no builds, no frameworks, no server beyond a simple local host.

## Files it expects

- `index.html` — UI
- `styles.css` — calm, ND-safe visuals
- `scripts/app.js`, `scripts/utils.js` — logic (no frameworks)
- `data/codex_nodes.json` — your nodes (Mind)
- `data/realm_map.json` — your realms (Body)
- `data/tarot_hooks.json` — your helper bindings (Companions)

> Tip: If you’re using **tesseract-bridge**, you can *generate* the three `data/*.json` files from its maps. See “Bridge Sync” below.

---

## Run locally (Mac)

Open Terminal, then:

```bash
cd ~/path/to/cosmogenesis-learning-engine

# (optional) make sure structure exists
mkdir -p scripts data

# serve folder at http://localhost:8000
python3 -m http.server 8000
```
