# ✦ TASKS — Cosmogenesis Learning Engine (Pro)

## Rhythm
- Commit little, commit often. Message format:
  - `docs: add <doc>`
  - `engine(spiral): <change>`
  - `data(stylepacks): <change>`
  - `safety: <change>`

## Priority Spiral (P1 → P3)

### P1 — Foundation (today)
- [ ] Add docs: `docs/CODEX_EXT_RUNBOOK.md`, `docs/SCIENCE_REFERENCES.md`, `docs/STYLE_GUIDE.md`
- [ ] Add schemas: `schemas/provenance.json`, `schemas/stylepack.json`
- [ ] Add data stubs: `data/angels.json`, `data/stylepacks/stylepacks.json`, `data/spiral_map.json`
- [ ] Add loader: `src/codex.ext.js`
- [ ] Add engines stubs: `src/engines/spiral-engine.js`, `src/engines/chamber-engine.js`, `src/engines/art-engine.js`, `src/engines/sound-engine.js`
- [ ] Wire minimal page (if not present): `index.html` that imports `src/codex.ext.js`
- [ ] Enable CI validation: `.github/workflows/validate.yml`

**Definition of Done (P1):** Repo installs, JSON validates in CI, page loads, no audio, ND-safe defaults.

### P2 — Spiral Engine (first render)
- [ ] Implement tilted spiral (23.5°), nodeCount = 33/72/144
- [ ] Read `data/spiral_map.json`
- [ ] Emit event `chamber:open`
- [ ] Keyboard orbit (← →), zoom (+ −), Calm Mode flag

**DoD (P2):** visible spiral; opening a node logs its id; settings persist.

### P3 — Skins + Chamber
- [ ] Load 5 skins from `stylepacks.json`
- [ ] Cross-fade 600–900ms; never flash invert
- [ ] Render plaque if provenance missing

**DoD (P3):** switching skins persists; missing provenance blocks export.

### P4 — Esoteric Node Matrix & Rosslyn Integration
- [ ] Map 144 nodes to 72 Shem angels and demons (3° zodiac segments)
- [ ] Encode Soyga/zodiac color scheme in `data/angels.json`
- [ ] Build Jacob's Ladder interface modeled after Rosslyn apprentice pillar
- [ ] Infuse Rosslyn Cathedral motifs into UI templates and chapels
- [ ] Cross-reference node colors with Codex 144:99 palette

**DoD (P4):** each node resolves to a color, angel, and zodiac degree; Jacob's Ladder scene renders with Rosslyn accents.

—

## Commands (Working Copy / local)
- Initialize (if needed):
  - `git init && git add . && git commit -m “init: cosmogenesis spine”`
- Feature branch:
  - `git checkout -b feat/p1-foundation`
- Commit P1 chunks in order above.
- Push:
  - `git push -u origin feat/p1-foundation`
- Open PR with title: `P1 — Foundation (Docs+Schemas+Stubs)`