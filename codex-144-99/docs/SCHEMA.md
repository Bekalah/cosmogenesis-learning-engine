# Codex 144:99 Schema

Each expanded node follows this structure:

```
{
  "node_id": 1,
  "name": "string",
  "locked": true,
  "egregore_id": "string-snake_case",
  "shem_angel": "string",
  "goetic_demon": "string",
  "gods": [{"name": "...","culture": "..."}, ...],
  "goddesses": [{"name": "...","culture": "..."}, ...],
  "chakra": "enum",
  "planet": "enum|hybrid",
  "zodiac": "enum|hybrid",
  "element": "enum|hybrid",
  "platonic_solid": "enum|hybrid",
  "solfeggio_freq": "enum",
  "music_profile": {
    "root_note": "A|A#|B|C|...|G#",
    "scale": "enum",
    "bpm": "int|range",
    "instruments": ["..."]
  },
  "color_scheme": {"primary": "#RRGGBB", "secondary": "#RRGGBB", "accent": "#RRGGBB"},
  "geometry": "string",
  "art_style": "string",
  "function": "string",
  "healing_profile": {"nd_safe": true, "ptsd_safe": true|false|"with care", "visual_rhythm": "...", "soundscape_type": "..."},
  "symbolic_keywords": ["...", "..."],
  "ritual_use": "string",
  "fusion_tags": ["...", "..."]
}
```

Deterministic rules map element to solfeggio frequency, planet to color palette, and zodiac element to music scale. BPM is calculated from `node_id` with optional Solar/Command offset. Healing profile safety flags depend on fusion tags. A SHA256 `lock_hash` guards against drift.
