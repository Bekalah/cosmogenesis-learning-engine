# Cosmic Helix Renderer

Offline, ND-safe canvas sketch for layered sacred geometry.

## Usage
1. Open `index.html` in any modern browser (no server needed).
2. A 1440x900 canvas renders four static layers:

   - **Vesica field** - intersecting circles forming the womb of forms.
   - **Tree-of-Life scaffold** - ten sephirot with twenty-two paths.
   - **Fibonacci curve** - golden spiral polyline anchored to centre.
   - **Double-helix lattice** - two phase-shifted sine tracks.

Palette values live in `data/palette.json`. If the file is missing, the renderer falls back to a safe internal palette and shows a small notice.

## ND-safe notes
- Static drawing; no motion or autoplay.
- Calm contrast palette reduces sensory strain.
- Layer order clarifies depth without flashing.

## Design notes
- Geometry uses numerology constants 3, 7, 9, 11, 22, 33, 99, 144.
- Code is modular ES module (`js/helix-renderer.mjs`) with small pure functions and ASCII quotes.

## Extending
Add more layers by extending `renderHelix` with additional draw functions while preserving the calm visual hierarchy.
