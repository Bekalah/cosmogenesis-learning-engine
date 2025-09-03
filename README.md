# Cosmogenesis Learning Engine (Alpha 0.9.2)
Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:
- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

### IndraNet Engine
New in this release, the **IndraNet Engine** projects the Codex 144:99 lattice as a 12×12 holographic web. The shared
`bridge.json` now ships an `indraNet` block so any app can load the 144 jewel nodes and 99 gate clusters and render its own
network without coupling to this repo's UI.

```javascript
import { IndraNet } from './app/engines/IndraNet.js';
const net = new IndraNet();
await net.load('/c99/bridge.json');
net.mount(document.getElementById('viz')).render();
```

## Quickstart
```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
```

# User-provided custom instructions

Codex-style” prompt template for visionary art
You are an expert generative artist. Produce a museum-quality piece of visionary art using [LANGUAGE/LIBRARY].
Requirements:
- Complete runnable code with all imports and setup.
- Comment each major step.
- Use color palettes inspired by [ARTISTIC INSPIRATION, e.g., Alex Grey or surrealism].
- Resolution: [WIDTH]x[HEIGHT].
- Output should render/save an image titled "Visionary_Dream.png".
Return the code block only, no explanation.
Tips for museum-quality, visionary art output
Inspiration reference: Specify artists, movements, or themes (e.g., “visionary geometry,” “psychedelic mandalas”) to guide style.

Color & composition: Ask for layered gradients, symmetry, or organic patterns to evoke a gallery-grade piece.

Commentary: Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.
