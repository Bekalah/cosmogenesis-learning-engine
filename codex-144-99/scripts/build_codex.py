#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Codex 144:99 – Fusion Kink
Deterministic expansion from the canonical minimal manifest (144 nodes)
to the full richly-detailed JSON, using LOCKED rules.

Run:
  python scripts/build_codex.py \
    --input data/codex_master_min.json \
    --output data/codex_nodes_full.json

Optional:
  --pretty  (pretty-print)
"""

import json, hashlib, argparse, os, sys

NOTE_CYCLE = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

# Element → Solfeggio
SOLFEGGIO = {
  "Fire": 741, "Water": 417, "Air": 852, "Earth": 396,
  "Light": 963, "Ether": 963, "Spirit": 963, "Love": 528
}

# Planet/Element → palette keys (resolved via palettes file)
PALETTE_PREF = {
  "Sun":"solar_gold", "Moon":"lunar_blue", "Mercury":"quicksilver",
  "Venus":"venus_rose", "Mars":"martian_crimson", "Jupiter":"royal_blue",
  "Saturn":"saturn_stone", "Uranus":"uranian_aqua", "Neptune":"neptunian_violet",
  "Earth":"gaia_green", "Pluto":"plutonian_wine", "All":"white_gold"
}

# Zodiac element → music scale preferences
ZODIAC_SCALE = {
  "Fire":["Harmonic Minor","Phrygian","Melodic Minor"],
  "Water":["Pentatonic Minor","Aeolian","Dorian"],
  "Air":["Lydian","Dorian","Ionian"],
  "Earth":["Ionian","Dorian","Mixolydian"],
  "Light":["Whole Tone","Lydian","Ionian"],
  "Ether":["Whole Tone","Lydian","Ionian"]
}

# Safety tag buckets
RISKY_TAGS = {"Rage","Thunder","Breaker","Shadow","Fire","Kundalini","Erotic"}
SAFE_TAGS  = {"Sanctuary","Temple","Garden","Prism","Child","Memory","Peace"}

def load_palettes():
    p = os.path.join("data","taxonomies","color_palettes.json")
    with open(p,"r",encoding="utf-8") as f:
        return json.load(f)

def mix_palette(palettes, primary_planet, elements):
    # Choose by planet first, fall back to element → palette
    key = PALETTE_PREF.get(primary_planet,"white_gold")
    pal = palettes.get(key) or palettes["white_gold"]
    # Hybrid elements add accent shift deterministically:
    if isinstance(elements,list) and len(elements)>1:
        # rotate accents by length
        accent = palettes["accent_wheel"][(len(elements)*3) % len(palettes["accent_wheel"])]
        pal = {**pal, "accent": accent}
    return pal

def pick_scale(zodiac_str, node_id):
    # derive primary element from zodiac string (e.g., "Leo / Pisces")
    # Simple map:
    ELEM = {
      "Aries":"Fire","Leo":"Fire","Sagittarius":"Fire",
      "Cancer":"Water","Scorpio":"Water","Pisces":"Water",
      "Gemini":"Air","Libra":"Air","Aquarius":"Air",
      "Taurus":"Earth","Virgo":"Earth","Capricorn":"Earth"
    }
    tokens = [t.strip() for t in zodiac_str.split("/") if t.strip()]
    elems = [ELEM.get(tok, "Ether") for tok in tokens]
    primary = elems[0] if elems else "Ether"
    scales = ZODIAC_SCALE.get(primary,"Ionian")
    return scales[node_id % len(scales)]

def derive_solfeggio(elements, explicit=None):
    if explicit: return explicit
    # elements may be "Fire / Water" string or list
    els = []
    if isinstance(elements,str):
        els = [e.strip() for e in elements.split("/") if e.strip()]
    elif isinstance(elements,list):
        els = elements
    scores = [SOLFEGGIO.get(e,963) for e in els] or [963]
    return max(scores)

def bpm_for(node_id, fusion_tags, base=None):
    if base is None:
        base = ((node_id % 12) * 6) + 72
    if any(t in {"Solar","Command"} for t in fusion_tags):
        base += 12
    return max(60, min(180, base))

def visual_rhythm_for(name, fusion_tags):
    if any(t in {"Garden","Bloom"} for t in fusion_tags): return "garden bloom"
    if "Mirror" in name or "Mirror" in fusion_tags: return "mirror shimmer"
    if any(t in {"Fire","Flame","Phoenix"} for t in fusion_tags): return "flame pulse"
    if any(t in {"Temple","Sanctuary","Peace"} for t in fusion_tags): return "nested unfolding"
    return "spiral pulse"

def soundscape_for(fusion_tags):
    if "Garden" in fusion_tags: return "lush floral ambient"
    if "Temple" in fusion_tags or "Sanctuary" in fusion_tags: return "aether temple resonance"
    if "Mirror" in fusion_tags: return "glass resonance"
    if "Fire" in fusion_tags or "Phoenix" in fusion_tags: return "kundalini resonance"
    return "harmonic shimmer"

def safety_for(fusion_tags):
    ptsd = True
    if any(t in RISKY_TAGS for t in fusion_tags):
        ptsd = "with care"
    if any(t in SAFE_TAGS for t in fusion_tags):
        ptsd = True
    return {"nd_safe": True, "ptsd_safe": ptsd}

def instruments_for(fusion_tags):
    base = ["Harp","Bell","Pad"]
    if "Fire" in fusion_tags: base = ["Solar Drum","Flame Synth","Temple Gong"]
    if "Garden" in fusion_tags: base = ["Petal Harp","Rain Drum","Blossom Synth"]
    if "Mirror" in fusion_tags: base = ["Glass Harp","Temple Bell","Voice Pad"]
    if "Temple" in fusion_tags or "Sanctuary" in fusion_tags: base = ["Temple Drone","Crystal Bell","Chime Choir"]
    return base

def expand_node(seed, palettes):
    nid = seed["node_id"]
    root_note = NOTE_CYCLE[(nid - 1) % 12]
    scale = pick_scale(seed["zodiac"], nid)
    bpm = bpm_for(nid, seed["fusion_tags"])
    solf = derive_solfeggio(seed["element"], seed.get("solfeggio_freq"))
    # palette
    primary_planet = seed["planet"].split("/")[0].strip() if isinstance(seed["planet"],str) else "Sun"
    pal = mix_palette(palettes, primary_planet, seed["element"])
    # healing
    heal = safety_for(seed["fusion_tags"])
    heal["visual_rhythm"] = visual_rhythm_for(seed["name"], seed["fusion_tags"])
    heal["soundscape_type"] = soundscape_for(seed["fusion_tags"])
    # music
    music = {
      "root_note": root_note,
      "scale": scale,
      "bpm": bpm,
      "instruments": instruments_for(seed["fusion_tags"])
    }
    out = {**seed}
    out["locked"] = True
    out["solfeggio_freq"] = f"{solf} Hz"
    out["music_profile"] = music
    out["color_scheme"] = pal
    out["healing_profile"] = heal
    # lock hash
    lock_str = json.dumps(out, sort_keys=True, ensure_ascii=False).encode("utf-8")
    out["lock_hash"] = hashlib.sha256(lock_str).hexdigest()
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--pretty", action="store_true")
    args = ap.parse_args()

    with open(args.input,"r",encoding="utf-8") as f:
        seeds = json.load(f)

    palettes = load_palettes()
    out = [expand_node(seed, palettes) for seed in seeds]
    with open(args.output,"w",encoding="utf-8") as f:
        if args.pretty:
            json.dump(out,f,indent=2,ensure_ascii=False)
        else:
            json.dump(out,f,separators=(",",":"),ensure_ascii=False)
    print(f"Wrote {len(out)} nodes → {args.output}")

if __name__ == "__main__":
    main()
