# Covenant of Calm Creation

The Cosmogenesis Learning Engine keeps every interaction neurodivergent-safe, provenance-rich, and trauma-informed. This covenant consolidates the previously scattered art guides and safety rules into a single reference for quick onboarding.

## Safety directives

- **No forced motion or autoplay** &mdash; visuals are static unless the visitor explicitly initiates motion. Audio requires intentional play. This honors the ND-safe constraints documented in the root `STYLE_GUIDE.md` and supporting research notes.
- **Layered geometry, never flattened** &mdash; sacred diagrams retain depth through stacked canvases or meshes. This preserves the compositional cues referenced throughout the codex materials.
- **Calm contrast, readable typography** &mdash; prefer dark indigo backgrounds with soft-light foreground text (`#e8e8f0` on `#0b0b12`). These palettes balance accessibility and the cathedral aesthetic.
- **Offline-first, dependency-light** &mdash; every renderer and dataset resolves without network calls. Optional bridges (tesseract-bridge, liber-arcanae, data-ingest-pipeline) remain opt-in.
- **ASCII quotes, UTF-8, LF** &mdash; maintain clean text encoding to avoid invisible failure modes.

## Provenance & consent

- **Provenance chips appear on every page** &mdash; surface authorship, codex ID, and licensing ("© Rebecca Respawn · Codex 144:99 · CC-BY-SA-4.0 · Provenance").
- **Document citations** &mdash; registries expose `citations[]` entries that point to research scrolls or historical sources. Unknown values remain empty instead of fabricated.
- **Consent-first collaboration** &mdash; art experiments, rituals, or narrative branches indicate trauma content warnings. Calm pauses and opt-out routes are mandatory.

## How to steward updates

1. **Read the covenant before shipping** &mdash; any renderer, dataset, or UI must be checked against these rules.
2. **Run `node scripts/covenant-check.js`** &mdash; this validation enforces citations, provenance chips, CSP headers, and safe asset types.
3. **Archive, do not delete** &mdash; move superseded lore into `docs/archive/*.legacy.md` to preserve history.
4. **Annotate intent** &mdash; comment every non-trivial code path with ND-safe rationale ("why this exists").

## Bridges & boundaries

- Keep heavy geometry baking, tarot overlays, and ingest engines in their dedicated repositories. Surface them as optional bridges under `/core/bridge/` without entangling this repo's runtime.
- The single source of truth at runtime is `/registry/**` filtered by `config/toggles.json` via `scripts/projection.ts`. Everything else is derived from those registries.

Guard this covenant so that the learning engine remains a sanctuary for curious, sensitive minds.
