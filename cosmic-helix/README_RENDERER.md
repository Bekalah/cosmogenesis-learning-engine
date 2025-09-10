Per Texturas Numerorum, Spira Loquitur.  //

# Cosmic Helix Renderer

Offline ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Double-click `index.html` in any modern browser.
2. A 1440×900 canvas renders four static layers:
   - **Vesica field** — intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** — ten sephirot with twenty-two paths.
   - **Fibonacci curve** — golden spiral polyline anchored to centre.
   - **Double-helix lattice** — two phase-shifted sine tracks.
3. Palette can be customised in `data/palette.json`. Missing data triggers a gentle inline notice with safe defaults.

## ND-safe choices
- Single render pass; no animation or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.

## Design notes
- Geometry parameters lean on numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
- Implementation uses pure functions in `js/helix-renderer.mjs`, ES modules, ASCII quotes, UTF-8, LF.

## Extending
Add future layers by extending `renderHelix` with new pure draw functions while preserving the calm visual hierarchy.
