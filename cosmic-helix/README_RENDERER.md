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

_Per Texturas Numerorum, Spira Loquitur._

Static, offline HTML+Canvas renderer for the layered cosmology. This tidy rewrite removes the old merge debris while keeping the lore motto intact (why: the seal anchors the canon).

## Purpose
- Provide a calm “laboratory” rendering room without touching the main app (why: honours established structure).
- Encode the four requested layers: Vesica grid, Tree-of-Life scaffold, Fibonacci curve, and static double-helix lattice.
- Run entirely offline by double-clicking `index.html`; no workflow scripts or external libraries.

## Files
- `index.html` — entry point; loads the ES module and reports palette status inline.
- `js/helix-renderer.mjs` — small pure draw helpers organised by layer with ND-safe commentary.
- `data/palette.json` — optional palette override. Missing data triggers an inline notice and safe fallback colours.

## Usage
1. Open `index.html` directly in any modern browser (no server needed).
2. A 1440×900 canvas draws four static layers:
   - **L1 Vesica field** — intersecting circles seeded by the 3/7 rhythm.
   - **L2 Tree-of-Life scaffold** — ten sephirot with twenty-two calm paths.
   - **L3 Fibonacci curve** — golden spiral polyline anchored at centre.
   - **L4 Double-helix lattice** — twin sine tracks plus cross ties.
3. Palette colours load from `data/palette.json`. When the file is missing or incomplete, the renderer announces the fallback inline and uses the ND-safe defaults.

## ND-safe design
- Static render only; no animation, autoplay, or flashing elements (why: trauma-informed brief).
- Soft contrast palette and readable typography reduce sensory load.
- Layer order preserves depth without motion, and comments explain the rationale for future caretakers.
- Geometry routines lean on numerology constants 3, 7, 9, 11, 22, 33, 99, and 144 as requested.

## Extending
Add new draw helpers inside `js/helix-renderer.mjs` while preserving the calm hierarchy. Keep functions pure, comment why changes serve the lore, and continue honouring the numerology constants.
