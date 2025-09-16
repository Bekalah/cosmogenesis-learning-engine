# Cosmic Helix Renderer

_Per Texturas Numerorum, Spira Loquitur._

Offline, ND-safe canvas sketch for layered sacred geometry.

## Purpose
This renderer provides a calm, offline illustration of the cosmogenesis layered cosmology without disturbing the primary application. The bundle lives inside `cosmic-helix/` so the root `index.html` stays intact—honouring established lore while giving the helix its own contemplative room.

## Files
- `index.html` — static entry point; double-click to open offline.
- `js/helix-renderer.mjs` — small ES module with pure draw routines.
- `data/palette.json` — optional palette override; safe defaults kick in when missing.
- `README_RENDERER.md` — this guide.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **L1 Vesica field** — intersecting circles seeded by the 3/7 rhythm.
   - **L2 Tree-of-Life nodes and paths** — ten sephirot linked by twenty-two gentle lines.
   - **L3 Fibonacci curve** — golden spiral polyline anchored to centre.
   - **L4 Double-helix lattice** — two still sine tracks phased to mirror twin pillars.
3. Palette colours live in `data/palette.json`. When the file cannot be read (for example `file://` security blocks), the renderer announces the fallback inline and uses the ND-safe defaults.

## ND-safe design notes
- Static drawing only; no animation, autoplay, or flashing elements.
- Soft contrast palette and generous spacing reduce sensory strain.
- Layer order is explicit to preserve depth without overwhelming contrast.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, and 144.

## Palette tuning
Edit `data/palette.json` to adapt the colours. The loader first tries `fetch`, then falls back to a hidden iframe so double-click `file://` openings still pick up your edits when the browser allows it. Missing or invalid data shows a gentle status message and the calm defaults.

## Extending
Add new draw helpers to `js/helix-renderer.mjs` while preserving the ND-safe choices above. Keep additions modular, well-commented, and built from numerology-friendly constants.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*
