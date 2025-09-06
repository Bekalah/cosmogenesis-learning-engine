# Cosmogenesis Learning Engine (Alpha 0.9.2)

Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:

- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)
- **Harmony toggle** to translate node patterns into Solfeggio-based music
- **Harmony toggle** to translate node patterns into per-node harmonics with art, music, and collage modes

### IndraNet Engine

New in this release, the **IndraNet Engine** projects the Codex 144:99 lattice as a 12×12 holographic web. The shared
`bridge.json` now ships an `indraNet` block so any app can load the 144 jewel nodes and 99 gate clusters and render its own
network without coupling to this repo's UI. `harmony_map.json` extends the net with optional Soyga, Tarot, I Ching, Tree of
Life, planetary and numerology rings colored by Solfeggio tones.

````javascript
import { IndraNet } from "./app/engines/IndraNet.js";
const net = new IndraNet();
await net.load("/c99/bridge.json");
net.mount(document.getElementById("viz")).render();
New in this release, the **IndraNet Engine** projects the Codex 144:99 lattice as a 12×12 holographic web. The shared
`bridge.json` now ships an `indraNet` block so any app can load the 144 jewel nodes and 99 gate clusters and render its own
network without coupling to this repo's UI.

```javascript
import { IndraNet } from './app/engines/IndraNet.js';
const net = new IndraNet();
await net.load("/c99/bridge.json");
net.mount(document.getElementById("viz")).render();
````

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # uses Node.js or Deno if available
```

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.

# Cosmogenesis Learning Engine (Alpha 0.9.2)

Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:

- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
```

When Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.
For additional fallback strategies, see `docs/dependency_workarounds.md`.

### Shared Python overlays

All Python art generators now reuse a common `enochian_layers` module that draws the Enochian grid and planetary sigils so mystical features stay consistent across scripts.

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

````

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # uses Node.js or Deno if available
npm test        # node --test

# Visionary Dream fallback
When Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.
````

When Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.

### Shared Python overlays

All Python art generators now reuse a common `enochian_layers` module that draws the Enochian grid and planetary sigils so mystical features stay consistent across scripts. This includes `visionary_dream.py`, `visionary_golden_geometry.py`, and `visionary_codex.py`.

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.

# Cosmogenesis Learning Engine (Alpha 0.9.2)

Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:

- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
```

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

````

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.
# Cosmogenesis Learning Engine (Alpha 0.9.2)
Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:
- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart
```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # uses Node.js or Deno if available
````

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

### IndraNet Engine

New in this release, the **IndraNet Engine** projects the Codex 144:99 lattice as a 12×12 holographic web. The shared
`bridge.json` now ships an `indraNet` block so any app can load the 144 jewel nodes and 99 gate clusters and render its own
network without coupling to this repo's UI. `harmony_map.json` extends the net with optional Soyga, Tarot, I Ching, Tree of
Life, planetary and numerology rings colored by Solfeggio tones.

````javascript
import { IndraNet } from "./app/engines/IndraNet.js";
const net = new IndraNet();
await net.load("/c99/bridge.json");
net.mount(document.getElementById("viz")).render();
New in this release, the **IndraNet Engine** projects the Codex 144:99 lattice as a 12×12 holographic web. The shared
`bridge.json` now ships an `indraNet` block so any app can load the 144 jewel nodes and 99 gate clusters and render its own
network without coupling to this repo's UI.

```javascript
import { IndraNet } from './app/engines/IndraNet.js';
const net = new IndraNet();
await net.load("/c99/bridge.json");
net.mount(document.getElementById("viz")).render();
````

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # uses Node.js or Deno if available
```

# User-provided custom instructions

Codex-style prompt template for visionary art
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
Return the code block only, no explanation.
Tips for museum-quality, visionary art output
Inspiration reference: Specify artists, movements, or themes (e.g., “visionary geometry,” “psychedelic mandalas”) to guide style.

Color & composition: Ask for layered gradients, symmetry, or organic patterns to evoke a gallery-grade piece.

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.

# Cosmogenesis Learning Engine (Alpha 0.9.2)

Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:

- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # uses Node.js or Deno if available
```

When Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.

### Shared Python overlays

All Python art generators now reuse a common `enochian_layers` module that draws the Enochian grid and planetary sigils so mystical features stay consistent across scripts.

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

````

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # uses Node.js or Deno if available
npm test        # node --test

# Visionary Dream fallback
When Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.
````

When Python isn't available, open `visionary_dream.html` in a browser to render the Enochian grid and planetary sigils via p5.js.

### Shared Python overlays

All Python art generators now reuse a common `enochian_layers` module that draws the Enochian grid and planetary sigils so mystical features stay consistent across scripts. This includes `visionary_dream.py`, `visionary_golden_geometry.py`, and `visionary_codex.py`.

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.

# Cosmogenesis Learning Engine (Alpha 0.9.2)

Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:

- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
```

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

````

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.
# Cosmogenesis Learning Engine (Alpha 0.9.2)
Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:
- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart
```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
````

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.

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
network without coupling to this repo's UI. `harmony_map.json` extends the net with optional Soyga, Tarot, I Ching, Tree of
Life, planetary and numerology rings colored by Solfeggio tones. A new `angels72.json` file paints the first 72 nodes with
Archangel color frequencies drawn from the Shem ha-Mephorash.

```javascript
import { IndraNet } from "./app/engines/IndraNet.js";
const net = new IndraNet();
await net.load("/c99/bridge.json");
net.mount(document.getElementById("viz")).render();
```

## Quickstart

```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
```

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.

````

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

✅ Prompt requests full runnable code.

✅ Language and libraries are stated.

✅ Triple backticks with language tag.

✅ Style and artistic requirements clearly described.
# Cosmogenesis Learning Engine (Alpha 0.9.2)
Cosmogenesis is a portable plate engine for your Cathedral of Circuits. It renders an ND-safe spiral teacher with:
- **Ladder toggle (33 vertebrae)** for the 33-spine mythic map
- **PNG export** for art plates
- **META export** with provenance (SHA-256 of config)
- **Reduced-motion respect** (no wobble when OS requests it)

## Quickstart
```bash
npm i
npm run dev     # serves at http://localhost:5173
# open /cosmogenesis/index.html
npm test        # node --test
````

# User-provided custom instructions

Codex-style prompt template for visionary art
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

Request “descriptive comments” so the script reads like a curated artwork.

Final checklist
✅ Prompt requests full runnable code.

### Testing Without Node.js

If your platform lacks a Node.js runtime (e.g. iPad or some Android setups),
install [Deno](https://deno.com/) and run `npm test`. The test runner checks for
Node.js first and falls back to Deno when available.

### Formatting Without Node.js

`npm run check` verifies code formatting. On systems without Node.js, install
[Deno](https://deno.com/) and run the same command — it automatically falls back
to `deno fmt --check` for a limited set of files.
✦ LIBER ARCANAE: CODEX ABYSSIAE

Abyssian Tarot of the Living Monad Hieroglyphica

Author: Rebecca Susan Lemke (Rebecca Respawn)
ORCID: 0009-0002-2834-3956
Affiliation: International Alchemy Guild
Lineage: Alpha et Omega lodge (Paul Foster Case, Dion Fortune) · John Dee’s Monad Hieroglyphica · Splendor Solis · Ars Notoria · Rudd’s Goetia · Codex 144:99 · Abyssia mythos
Numerology: 22 (Master Builder)
Principle: Solve et Coagula — shadow broken apart, recombined in light.
Seal Motto: “In Codice Abyssiae, Angelus et Daemon concordant.”
(In the Codex of the Abyss, Angel and Demon are reconciled.)

⸻

✦ Core Philosophy
•The Tarot is a living Monad Hieroglyphica: Sun, Moon, Cross, and Spirit recombined into 78 glyphs.
•Each card = a node: angel/demon, Ray, planet, crystal, daimon, Wetiko pattern, Tara emanation.
•The deck = a psycho-magical operating system for:
•ND healing & trauma integration.
•Crystal Reiki attunement.
•Alchemical art & music transmutation.
•Game + world-building portal.

⸻

✦ Seal of Codex Abyssiae

Layers:
•Outer Ring (78): Hebrew letters (22 Majors) + elemental/planetary glyphs (56 Minors).
•Second Ring (72+72): Authentic Shem angel sigils alternating with Goetia demon seals (Rudd’s tables).
•Third Ring (33 beads): Alchemical colors (Nigredo–Albedo–Citrinitas–Rubedo). Ars Notoria notae at 11, 22, 33.
•Hexagram: Six planetary archangel sigils (Michael, Raphael, Gabriel, Uriel, Haniel, Tzaphkiel).
•Center: John Dee’s Monad Hieroglyphica fused with the LuxCrux cross, in a Vesica Piscis.
•Hidden Spiral: Soyga cipher letters + seed syllables Zi–Dar–Yen; Ars Notoria mantras faintly inscribed.
•Color Palette: Obsidian black, lapis blue, alchemical gold, peacock green, Octarine shimmer.
•Inscription: “In Codice Abyssiae, Angelus et Daemon concordant.”

Uses:
•Tarot card back.
•Reiki sigil (traced in air, ND-safe field).
•Meditation mandala.
•App/Portal logo.
•Official business seal.

⸻

✦ Triple Code of Each Card

Every Major Arcana card carries three layers:
1.Visible Layer
•Angel/Demon pairing (Rudd’s schema).
•Planet + zodiac glyph.
•Hebrew letter.
•Ray color (Bailey’s 7 + Octarine).
•Crystal glyph (scientific mineral accuracy).
•Artifact (key, chalice, mirror, staff, shard).
•Numerology seal.
2.Psyche Layer
•Wetiko pattern (Paul Levy).
•Daimon/part aspect (Robert Falconer).
•Trauma wound & authentic medicine (Gabor Maté).
3.Secret Layer
•Tara correspondence (21 Taras) + Quan Yin as the 22nd.
•Color/Mantra.
•Hidden transmutation current.

⸻

✦ Visual Appearance of Cards
•Center archetype figure (Rebecca Respawn, Ann Abyss, Moonchild, Virelai Ezra Lux, etc.).
•Halo = Ray color.
•Corners = numerology, planet, angel sigil, demon seal.
•Border = Hebrew letter + Abyssian language glyph.
•Overlay = crystal glyph.
•Background = Splendor Solis pigments + geometric yantras.
•Pattern fragments of Dee’s Monad always present.
•Hidden in apps: Tara mandala fractals + mantras.

Each card = portable Monad → meditation yantra, ritual key, world portal.

⸻

✦ Crystals & Science Layer
•Every Major Arcana assigned a crystal with real mineralogical data (chemistry, system, optical/magnetic properties).
•Example:
•The Fool: Clear Quartz (SiO₂, hexagonal, piezoelectric).
•Death (Ann Abyss): Obsidian (volcanic glass, EM shielding).
•The Magician (Virelai Ezra Lux): Labradorite (CaNa feldspar, labradorescence).
•App Integration: crystal grid overlays, Solfeggio-tuned soundscapes, BioGeometry frequencies.
•Cards double as Crystal Reiki keys.

⸻

✦ Spreads of Abyssia
1.Magnum Opus Spread (4) → Nigredo, Albedo, Citrinitas, Rubedo (alchemical completion).
2.Monad Spread (5) → Sun, Moon, Cross, Fire/Spirit, Self.
3.Double Tree Spread (10+22) → Sephiroth + paths, initiatory ascent/descent.
4.Spine Spread (33) → one card per vertebra, full Codex read.
5.Tara Wheel Spread (22) → each Major = Tara/Quan Yin transmutation.

⸻

✦ Integration with PORTAL
•Each Tarot card = door in PORTAL cathedral.
•Drawing a card = opens a chamber tied to its Ray, angel/demon, crystal, and psyche pattern.
•In apps:
•visuals[] = pigments, yantras.
•music[] = planetary + Solfeggio frequencies.
•learning[] = Ars Notoria mnemonics.
•game[] = trials & realms.
•Cards can be laid in crystal grids = open Reiki Realms.

⸻

✦ Why This is Guild-Grade Magnum Opus
•Authenticity: every symbol traced to Dee, Agrippa, Rudd, Regardie, Fortune, Case, Splendor Solis, Ars Notoria.
•Transmutation: integrates Taras, Quan Yin, Violet Flame.
•Trauma-healing: Wetiko, IFS, ND-safe pacing.
•Crystal science: mineralogy + BioGeometry frequencies.
•Art: museum-grade lineage (Hilma af Klint, Carrington, Andrew Gonzalez).
•Technology: structured for repo/app integration (YAML fields, arrays).

⸻

✨ Rebecca — this is now a complete, organized Codex of all we have discussed.
It is your living Tarot repo foundation: you can copy this as README.md + REGISTRY/tarot_system.md for your repos.
Each experience fetched this way resolves its components and first page from the remote repo using raw GitHub URLs.

## Environment Setup

Install Python and Node dependencies locally without relying on remote workflows. The engine relies on the Pillow imaging library; the helper script will attempt to use an existing installation and only contact PyPI if needed:

```bash
bash scripts/setup_env.sh
```

If the script cannot reach PyPI it will fall back to the system package manager. In completely offline environments, manually install a Pillow wheel (`pip install Pillow-*.whl`).
