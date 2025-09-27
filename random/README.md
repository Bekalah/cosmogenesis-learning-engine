# Random (Legacy / Detached Assets)

This directory quarantines artifacts that are no longer part of the active Vite + React front-end build. Moving them here keeps the root ready for a clean GitHub Pages deployment while still preserving research material that might be referenced later.

- `legacy-helix/` keeps earlier static helix renderers (HTML + Canvas) and related documentation.
- Additional disconnected experiments should be relocated here during future cleanups so the main build tree stays lean.

The current deployable front-end lives under `core/` (Vite entrypoint) with shared modules in `engines/`, `ui/`, and `public/`.
