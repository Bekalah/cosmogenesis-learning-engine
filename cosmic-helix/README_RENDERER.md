*Seal Motto: Per Texturas Numerorum, Spira Loquitur.*

```text
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

## Usage
1. Double-click `index.html` in any modern browser (no server needed).
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette colours live in `data/palette.json`. Missing data triggers a gentle notice and safe defaults.

## ND-safe notes
- Static drawing; no animation, autoplay, or flashing.
- Muted contrast palette and generous spacing reduce sensory strain.
- Layer order clarifies depth without motion.
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.

## Design notes
- Pure ES module `js/helix-renderer.mjs`; functions are small and well commented.
- ASCII quotes only, UTF-8, LF newlines.
- Works fully offline by opening `index.html` directly.

## Extending
Add new layers by extending `renderHelix` while preserving the calm visual hierarchy and ND-safe choices.

## Related lore
See `docs/tesseract_spiritual.md` for cosmological context.
