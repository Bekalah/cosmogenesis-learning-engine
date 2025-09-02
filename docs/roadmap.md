# Cosmogenesis Learning Engine Roadmap

This roadmap outlines the next steps for evolving the engine into a modular hub that links other creative realms and applications.

## Core
- [ ] Normalize repository files by removing leftover patch markers and validating JSON and JS syntax.
- [ ] Establish continuous testing with `node --test` to keep modules stable.
- [ ] Provide rich documentation in `README.md` and each subdirectory.

## Data Layer (`/data`)
- [ ] Define schema for rooms, plugins, egregores, correspondences, and experiences.
- [ ] Implement loader utilities that validate datasets against the schema.
- [ ] Expand sample datasets to cover art, science, mysticism, and cross‑disciplinary mappings.

## Engine (`/src`)
- [ ] Replace placeholder rendering logic with full SVG/Canvas implementations.
- [ ] Add configuration validation with helpful errors.
- [ ] Expose a public API so external projects can generate plates programmatically.

## Application Shell (`/app`)
- [ ] Create shared UI components (tabs, dialogs, accessibility toggles).
- [ ] Flesh out each experience module with narrative pages and interactive components.
- [ ] Persist user gallery and settings in local storage.

## Plugins (`/plugins`)
- [ ] Formalize plugin interface and lifecycle hooks.
- [ ] Ship example plugins that pull external data sources (e.g., Wikipedia, Open Library) or render generative art.
- [ ] Document how other repositories can register plugins.

## Styles & Themes (`/styles`)
- [ ] Offer theme packs and accessibility presets (calm colors, reduced motion).
- [ ] Provide SASS/LESS sources for easier customization.

## Integration with Other Realms
- [ ] Publish a registry format so companion apps can announce their modules.
- [ ] Support loading experiences or plugins from sibling repositories via URL or git submodules.
- [ ] Explore WebSocket or WebRTC bridges for live collaboration across realms.

## Testing & CI
- [ ] Add linting and formatting (ESLint, Prettier) to standardize code style.
- [ ] Run tests and static analysis in GitHub Actions.

## Documentation
- [ ] Complete walkthroughs for building plates, authoring experiences, and writing plugins.
- [ ] Provide guidelines for neurodivergent‑friendly interface design.
