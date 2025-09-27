# Cosmic Helix Renderer

Static HTML + Canvas renderer for layered sacred geometry.

## Layers
1. **Vesica field** – two intersecting circles establish the seed space.
2. **Tree-of-Life scaffold** – ten nodes and twenty-two paths form the kabbalistic map.
3. **Fibonacci curve** – logarithmic spiral hints at organic growth.
4. **Double-helix lattice** – twin sine waves with vertical rungs, no motion.

## ND-safe notes
- No animation or autoplay. Canvas renders once on load.
- Palette is read from `data/palette.json`; if missing, index.html falls back to a soft default.
- Color choices favor calm contrast. Geometry uses numerology constants 3,7,9,11,22,33,99,144.

Numerology constants are exported as `NUM` from the renderer module for reuse in other scripts.

## References
- [@lawlor1982]

## Offline use
Double-click `index.html` in any modern browser. No network requests or build step.
