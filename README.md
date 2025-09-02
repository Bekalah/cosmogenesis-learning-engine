--- # ✦ Cosmogenesis Learning Engine
--- 
--- *A spiral teacher for living art, pattern recognition, and visionary learning.*
--- 
---+Created by **Rebecca Susan Lemke** (Rebecca Respawn) – architect‑scribe of the Cosmogenesis project.
---+
--- —
--- 
--- ## ✦ Overview
----The **Cosmogenesis Learning Engine** is a browser-native app for **spiral learning**.  
---+The **Cosmogenesis Learning Engine** is a browser-native app for **spiral learning**.
--- It transforms ideas, texts, or archives into **living plates** — interactive diagrams that reveal hidden patterns.
--- 
----This project exists for artists, mystics, educators, and anyone who cannot learn in flat, linear ways.  
---+This project exists for artists, mystics, educators, and anyone who cannot learn in flat, linear ways.
--- It is built to be **dynamic, recursive, and healing**: every return deepens the pattern.
--- 
--- —
--- 
--- ## ✦ Features
----- **Plate Builder** — generate spirals, twin-cones, wheels, or grids.  
----- **Any Dataset** — paste text, JSON, CSV, or archives; the engine adapts.  
----- **Export** — save plates as SVG/PNG or share JSON configs.  
----- **Gallery** — save your own collection locally.  
----- **ND-Safe** — no autoplay, calm motion, optional Ward Mode.  
---+- **Plate Builder** — generate spirals, twin-cones, wheels, or grids.
---+- **Any Dataset** — paste text, JSON, CSV, or archives; the engine adapts.
---+- **Export** — save plates as SVG/PNG or share JSON configs.
---+- **Gallery** — save your own collection locally.
---+- **ND-Safe** — no autoplay, calm motion, optional Ward Mode.
--- - **Offline-Ready** — open `index.html` in any browser; no install required.
---+- **Plugins** — load open knowledge connectors or generative art modules on demand, with optional local `vendor/` scripts for offline use.
---+- **Egregore Tarot** — summon helper personas as learning companions.
---+- **Trauma-aware** — see `docs/neurodivergent_learning.md` for ND & PTSD guidance.
---+- **Experience Modules** — step into realms like Hypatia's Library, Tesla's Workshop, Agrippa's Study, and the Alexandrian Scriptorium.
---+- **Correspondence Library** — sample mappings for chakras ↔ planets, runes, and I Ching.
---+- **Accessibility Settings** — toggle calm colors, reduced motion, or mute audio; preferences persist locally.
--- 
--- —
--- 
--- ## ✦ Why It Matters
----- For **artists & designers**: a tool to turn archives into living art.  
----- For **mystics & researchers**: a way to trace correspondences across traditions.  
----- For **educators & facilitators**: an interactive, non-linear teaching aid.  
----- For **neurodivergent learners**: a system that respects spiral, recursive learning.  
---+- For **artists & designers**: a tool to turn archives into living art.
---+- For **mystics & researchers**: a way to trace correspondences across traditions.
---+- For **educators & facilitators**: an interactive, non-linear teaching aid.
---+- For **neurodivergent learners**: a system that respects spiral, recursive learning.
--- 
--- —
--- 
--- ## ✦ Quick Start
--- 1. Clone this repository:
---    ```bash
---    git clone https://github.com/bekalah/cosmogenesis-learning-engine.git
----   cd cosmogenesis-learning-engine
---+   cd cosmogenesis-learning-engine
---+   ```
---+2. Open `index.html` in your browser.
---+3. Load sample **Rooms** or craft your own dataset.
---+4. Visit the **Experiences** tab to read narrative prologues and choose a realm.
---+
---+Cross-discipline rooms live in `data/rooms.json` and load automatically.
---+Prototype egregore cards live in `data/egregores.json` and are described in `docs/egregore_tarot.md`.
---+Plugin descriptors live in `data/plugins.json` with docs in `docs/plugins.md`.
---+Correspondence examples live in `data/correspondences.json` for cross-tradition study.
---+
---+—
---+
---+## ✦ App Structure
---+```
---+app/
---+├── shared/          # utilities reused across experiences
---+│   ├── auth/
---+│   └── utils/
---+├── experience_a/    # Hypatia's Library
---+│   ├── components/
---+│   ├── pages/
---+│   └── config.json
---+├── experience_b/    # Tesla's Workshop
---+│   ├── components/
---+│   ├── pages/
---+│   └── config.json
---+├── experience_c/    # Agrippa's Study
---+│   ├── components/
---+│   ├── pages/
---+│   └── config.json
---+└── experience_d/    # Alexandrian Scriptorium
---+    ├── components/
---+    ├── pages/
---+    └── config.json
---+```
---+Each experience declares its own `config.json` and can be loaded dynamically at runtime.
---+
---+—
---+
---+## ✦ Cross-Repository Growth
---+The engine can link with other creative realms or data sources. Companion projects may live in separate repositories and expose
---+their own modules, datasets, or plugins.
---+
---+- Use Git submodules or APIs to register external realms.
---+- Store module descriptors in a registry so the app can discover them at runtime.
---+- See `docs/repo_integration.md` for patterns that keep multi-repo ecosystems cohesive.
--+# ✦ Cosmogenesis Learning Engine
--+
--+*A spiral teacher for living art, pattern recognition, and visionary learning.*
--+
--+Created by **Rebecca Susan Lemke** (Rebecca Respawn) – architect‑scribe of the Cosmogenesis project.
--+
--+## ✦ Overview
--+The Cosmogenesis Learning Engine is a browser‑native app for **spiral learning**. It transforms ideas, texts, or archives into **living plates**—interactive diagrams that reveal hidden patterns. Built for artists, mystics, educators, and anyone who cannot learn in flat, linear ways. Every return deepens the pattern.
--+
--+## ✦ Features
--+- Plate Builder — generate spirals, twin-cones, wheels, or grids.
--+- Any Dataset — paste text, JSON, CSV, or archives; the engine adapts.
--+- Export — save plates as SVG/PNG or share JSON configs.
--+- Gallery — save your own collection locally.
--+- ND-Safe — no autoplay, calm motion, optional Ward Mode.
--+- Offline-Ready — open `index.html` in any browser; no install required.
--+- Plugins — load open knowledge connectors or generative art modules on demand, with optional local `vendor/` scripts for offline use.
--+- Egregore Tarot — summon helper personas as learning companions.
--+- Trauma-aware — see `docs/neurodivergent_learning.md` for ND & PTSD guidance.
--+- Experience Modules — step into realms like Hypatia's Library, Tesla's Workshop, Agrippa's Study, and the Alexandrian Scriptorium.
--+- Correspondence Library — sample mappings for chakras ↔ planets, runes, and I Ching.
--+- Accessibility Settings — toggle calm colors, reduced motion, or mute audio; preferences persist locally.
--+
--+## ✦ Quick Start
--+1. Clone this repository:
--+   ```bash
--+   git clone https://github.com/bekalah/cosmogenesis-learning-engine.git
--+   cd cosmogenesis-learning-engine
--+   ```
--+2. Open `index.html` in your browser.
--+3. Load sample rooms or craft your own dataset.
--+4. Visit the Experiences tab to explore realms.
--+
--+Cross-discipline rooms live in `data/rooms.json`. Prototype egregore cards live in `data/egregores.json` and are described in `docs/egregore_tarot.md`. Plugin descriptors live in `data/plugins.json` with docs in `docs/plugins.md`. Correspondence examples live in `data/correspondences.json` for cross-tradition study.
--+
--+## ✦ App Structure
--+```
--+app/
--+├── shared/          # utilities reused across experiences
--+│   ├── auth/
--+│   └── utils/
--+├── experience_a/    # Hypatia's Library
--+│   ├── components/
--+│   ├── pages/
--+│   └── config.json
--+├── experience_b/    # Tesla's Workshop
--+│   ├── components/
--+│   ├── pages/
--+│   └── config.json
--+├── experience_c/    # Agrippa's Study
--+│   ├── components/
--+│   ├── pages/
--+│   └── config.json
--+└── experience_d/    # Alexandrian Scriptorium
--+    ├── components/
--+    ├── pages/
--+    └── config.json
--+```
--+Each experience declares its own `config.json` and can be loaded dynamically at runtime.
--+
--+## ✦ Cross-Repository Growth
--+The engine can link with other creative realms or data sources. Companion projects may live in separate repositories and expose their own modules, datasets, or plugins.
--+
--+- Use Git submodules or APIs to register external realms.
--+- Store module descriptors in a registry so the app can discover them at runtime.
--+- See `docs/repo_integration.md` for patterns that keep multi-repo ecosystems cohesive.
--+
-+# Cosmogenesis Learning Engine
-+
-+*A spiral teacher for living art, pattern recognition, and visionary learning.*
-+
-+Created by **Rebecca Susan Lemke** (Rebecca Respawn) – architect‑scribe of the Cosmogenesis project.
-+
-+## Overview
-+
-+The **Cosmogenesis Learning Engine** is a browser-native app for spiral learning. It transforms ideas, texts, or archives into living plates—interactive diagrams that reveal hidden patterns. This project exists for artists, mystics, educators, and anyone who cannot learn in flat, linear ways.
-+
-+## Features
-+
-+- Plate Builder — generate spirals, twin-cones, wheels, or grids.
-+- Any Dataset — paste text, JSON, CSV, or archives; the engine adapts.
-+- Export — save plates as SVG/PNG or share JSON configs.
-+- Gallery — save your own collection locally.
-+- ND-Safe — no autoplay, calm motion, optional Ward Mode.
-+- Offline-Ready — open `index.html` in any browser; no install required.
-+- Plugins — load open knowledge connectors or generative art modules on demand.
-+- Egregore Tarot — summon helper personas as learning companions.
-+- Trauma-aware — see `docs/neurodivergent_learning.md` for ND & PTSD guidance.
-+- Experience Modules — step into realms like Hypatia's Library, Tesla's Workshop, Agrippa's Study, and the Alexandrian Scriptorium.
-+
-+## Quick Start
-+
-+1. Clone this repository and open the project directory.
-+2. Open `index.html` in your browser.
-+3. Load sample rooms or craft your own dataset.
-+
-+Sample datasets live in `data/`. Plugins reside in `plugins/`. Experience modules are under `app/`.
-+
-+## Development
-+
-+Run tests with:
-+
-+```bash
-+npm test
-+```
+# Cosmogenesis Learning Engine
+
+*A spiral teacher for living art, pattern recognition, and visionary learning.*
+
+Created by **Rebecca Respawn** – architect-scribe of the Cosmogenesis project.
+
+## Overview
+The Cosmogenesis Learning Engine is a browser-native app for spiral learning. It transforms ideas, texts, or archives into living plates—interactive diagrams that reveal hidden patterns. Built for artists, mystics, educators, and anyone who learns beyond linear paths.
+
+## Features
+- Plate Builder — generate spirals, twin-cones, wheels, or grids
+- Any Dataset — paste text, JSON, CSV, or archives; the engine adapts
+- Export — save plates as SVG/PNG or share JSON configs
+- Gallery — save your own collection locally
+- ND-Safe — no autoplay, calm motion, optional Ward Mode
+- Offline-Ready — open `index.html` in any browser; no install required
+- Plugins — add open knowledge connectors or generative art modules
+- Egregore Tarot — summon helper personas as learning companions
+- Trauma-aware — see `docs/neurodivergent_learning.md` for ND & PTSD guidance
+- Experience Modules — explore realms like Hypatia's Library, Tesla's Workshop, Agrippa's Study, and the Alexandrian Scriptorium
+
+## Quick Start
+1. Clone this repository and open the project directory.
+2. Open `index.html` in your browser.
+3. Load sample rooms from `data/` or craft your own dataset.
+
Plugins live in `plugins/` and experience modules in `app/`.

## Development
# Cosmogenesis Learning Engine

*A spiral teacher for living art, pattern recognition, and visionary learning.*

Created by **Rebecca Susan Lemke** (Rebecca Respawn) – architect‑scribe of the Cosmogenesis project.

## Overview

The **Cosmogenesis Learning Engine** is a browser-native app for spiral learning. It transforms ideas, texts, or archives into living plates—interactive diagrams that reveal hidden patterns. This project exists for artists, mystics, educators, and anyone who cannot learn in flat, linear ways.

## Features

- Plate Builder — generate spirals, twin-cones, wheels, or grids.
- Any Dataset — paste text, JSON, CSV, or archives; the engine adapts.
- Export — save plates as SVG/PNG or share JSON configs.
- Gallery — save your own collection locally.
- ND-Safe — no autoplay, calm motion, optional Ward Mode.
- Offline-Ready — open `index.html` in any browser; no install required.
- Plugins — load open knowledge connectors or generative art modules on demand.
- Egregore Tarot — summon helper personas as learning companions.
- Trauma-aware — see `docs/neurodivergent_learning.md` for ND & PTSD guidance.
- Experience Modules — step into realms like Hypatia's Library, Tesla's Workshop, Agrippa's Study, and the Alexandrian Scriptorium.

## Quick Start

1. Clone this repository and open the project directory.
2. Open `index.html` in your browser.
3. Load sample rooms or craft your own dataset.

Sample datasets live in `data/`. Plugins reside in `plugins/`. Experience modules are under `app/`.

## Development

Run tests with:

```bash
npm test
```

## Visionary Dream Generator

Render a static spiral plate from the command line:

```bash
pip install pillow
python visionary_dream.py --palette calm --width 1280 --height 720
```

The script outputs `Visionary_Dream.png` and a brief alt-text file for accessible viewing.

### Visionary Fractal Art

Generate a museum‑quality Julia set infused with Alex Grey hues:

```bash
python3 scripts/visionary_fractal.py --width 1920 --height 1080
```

The image saves as `Visionary_Dream.png` in the project root.

## Remote Experiences

Use the helper `src/remoteExperienceLoader.js` to load experiences directly from another public GitHub repository without cloning it.

```html
<script type="module">
import { fetchRemoteExperiences } from './src/remoteExperienceLoader.js';

const experiences = await fetchRemoteExperiences('user/other-repo');
console.log(experiences);
</script>
```

Each experience fetched this way resolves its components and first page from the remote repo using raw GitHub URLs.
