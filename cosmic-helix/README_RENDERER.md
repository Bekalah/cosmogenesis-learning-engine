# Cosmic Helix Renderer
Per Texturas Numerorum, Spira Loquitur.

*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*

```
0101010101010101010101010101010101010101
\\    COSMIC HELIX RENDERER MATRIX     //
0101010101010101010101010101010101010101
        /\        /\        /\
       /  \      /  \      /  \
      / /\ \    / /\ \    / /\ \
     /_/  \_\  /_/  \_\  /_/  \_\
      \ \  / /  \ \  / /  \ \  / /
       \ \/ /    \ \/ /    \ \/ /
        \  /      \  /      \  /
         \/        \/        \/
```

Offline, ND-safe canvas sketch for layered sacred geometry.

Static HTML and Canvas were chosen so the geometry renders locally without
network calls or heavy libraries, keeping the experience deterministic and
motion-free.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree‑of‑Life scaffold** — ten sephirot with twenty‑two straight paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be customized in `data/palette.json`. Missing data triggers a gentle inline notice with safe defaults.

## ND-safe notes
- Static drawing; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design Notes
- No animation, autoplay, or flashing; a single render call ensures ND safety.
- Muted colors and generous spacing improve readability in dark and light modes.
- Geometry routines use numerology constants (3,7,9,11,22,33,99,144) to honour
  project canon.
- Numerology constants live in `index.html` and are passed to the renderer so the
  symbolic values remain explicit and easy to tweak.
- Code is modular ES module (`js/helix-renderer.mjs`) with pure functions and
  ASCII quotes only.

## Extending
The renderer is intentionally minimal. Future layers or overlays can be added by
extending `renderHelix` with new draw functions while preserving the calm visual
hierarchy.

## Task List
- [ ] Weave cathedral-scale vesica grids to frame expansive worlds.
- [ ] Map Tree-of-Life nodes to sanctuaries like Avalon and mountain temples.
- [ ] Layer Fibonacci paths through oceans, rivers, and volcanic corridors.
- [ ] Cross-link double-helix lattices with rune, tarot, and reiki lore.
- [ ] Keep all additions ND-safe: no motion, high contrast, pure functions.

## Related Lore
For a meditation on the tesseract as symbol of higher consciousness and non-linear learning, see [docs/tesseract_spiritual.md](../docs/tesseract_spiritual.md). This companion note situates the helix within a wider cosmological frame.

