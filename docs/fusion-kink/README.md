# Sophia7 Fusion-Kink Library

## Installation
Drop the `/chapels/fusion-kink`, `/assets`, and `/docs/sources` directories into any static host. Open `chapels/fusion-kink/library.html` in a browser.

## Add a Grimoire
Append to `assets/data/fusion/grimoires.json`:
```json
{ "id":"new_id","title":"Title","author":"Author","type":"pdf","path":"/docs/sources/...","tags":[],"summary":"","rights":"","provenance_id":"prov_new" }
```

## Add an Artifact
Append to `assets/data/fusion/artifacts.json`:
```json
{ "id":"new_artifact","title":"Title","kind":"type","fusionist_id":"sophia7","primary_text_id":"new_id","display_hint":"hint","location":"shelf_x/drawer_y","unlocked":false,"spawn":[],"lore":"","provenance_id":"prov_new" }
```

## Add a Quest
Append to `assets/data/fusion/quests.json`:
```json
{ "id":"q_new","title":"Title","giver":"Sophia7","requires":[],"steps":[],"rewards":[] }
```

## Spawn All
Set `localStorage.sophia7_spawn_all = "true"` to unlock every artifact. Remove the key to veil again.

## ND-Safe Rules
- No autoplay media
- Respect `prefers-reduced-motion`
- Keyboard navigable with focus outlines

## Provenance Duties
- Do not claim rights to sources
- Always display the provided license string when viewing a source
