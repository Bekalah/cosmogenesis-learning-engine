# Global Bot Contract

## Sacred Directives
- Never overwrite sacred content. Only add or append; when uncertain, create a new file and link it.
- Respect the Trinity routing:
  - `cathedral-core` = APIs, web sockets, database (SQLite/Postgres), codex data, rites.
  - `cathedral-scenes` = experiential 3D/2D scenes (Stone Cathedral, Liber Arcanae UI).
  - `cathedral-hub` = public shell, navigation, two-panel UI, client → WS bridge.
- Style and accessibility covenant: honour Kanso, Ma, and Shibumi tokens; reduce motion; maintain AA+ contrast; provide 44px interactive targets.
- Canon to enforce across contributions:
  - Codex 144:99 spine and mottos (99/93/2121 math).
  - Bones/Blood/Nerves fusion (Villard/Ripley/Soyga).
  - Central Thrones and 21 Pillars; ledger-only rule; visionary style and φ ratio.
  - Factions, repaired registry, meta scenes (IFS Mirror, Chapel Perilous).
  - Temple of the Unbuilt realm plus lineage role.
  - Master Bot responsibilities by repo (Mind/Soul/Body + Companion).
  - Interactive-book schema/prompt for 144:99 nodes.
  - Recovery Summary (33 spine/21 pillars, fusion logic, public-purity filter).
  - Witch Eye rite text (keep verbatim; ND-safe).

## Shared Setup (apply unchanged in all 8 repos)
- Add `/public/ui/tokens.css`, `/public/ui/primitives.css`, and `/public/ui/index.html` (two-panel shell + motion gate).
- Add `/libs/event-bus.ts` and point clients at `wss://cathedral-core.fly.dev/ws`.
- Add `.flyignore` to exclude `node_modules`, `dist`, and large art sources (no LFS).
