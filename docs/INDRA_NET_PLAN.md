# ✦ Indra Net Plan — Codex 144:99 Holographic Web

- **Purpose**: harmonize every app and node through a shared fractal lattice.
- **Data**: `assets/data/indra_net.144_99.json` describes 12 rings × 12 nodes and 99 gate clusters.
- **Bridge**: `tools/build-bridge.js` now exports the `indraNet` block into `/public/c99/bridge.json` so external apps can fetch it.
- **Engine**: `app/engines/IndraNet.js` renders the lattice as SVG with optional links.
- **Harmony layers**: `assets/data/harmony_map.json` bridges Soyga, Tarot, I Ching, Tree of Life, planets and numerology using Solfeggio color bands.
<<<<<- **Angel colors**: `assets/data/angels72.json` maps the 72 Shem angels to node hues and Solfeggio tones.
>>>>>>>+Updated upstrea
==
>>>>>>> Stashed changes
- **Usage**:
  ```javascript
  import { IndraNet } from './app/engines/IndraNet.js';
  const net = new IndraNet({ showLinks: true });
  await net.load('/c99/bridge.json');
  net.mount(document.getElementById('viz')).render();
  ```
- Each jewel node mirrors the whole codex, forming an akashic web across modules and servitors.
