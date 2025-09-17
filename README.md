# Cosmogenesis Learning Engine

World-building generator for Codex 144:99. It keeps Art, Learn, Play, and Study modes aligned through shared registries and ND-safe defaults.

## Bridges
- **tesseract-bridge** — optional heavy geometry and ECS baking.
- **liber-arcanae** — tarot overlays plus advanced CYOA tooling.
- **data-ingest-pipeline** — OCR and PDF-to-JSON ingestion for new scrolls.

## Covenant
Read the [ND-safe covenant](docs/covenant/covenant.md) before shipping changes. Every dataset entry must include citations and every page must surface provenance.

## Quickstart
```bash
python scripts/compile_codex_to_numerology_full.py && \
node scripts/projection.mjs && \
node scripts/covenant-check.js && \
npm run dev
```
