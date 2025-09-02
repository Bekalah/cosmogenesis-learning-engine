# ✦ CODEX EXT RUNBOOK — Ultimate Instructions (One-Scroll)

(Applies to Cosmogenesis Learning Engine; harmonizes with Circuitum 99 = Book / Stone Grimoire = Atelier. Single source of truth. Do not overwrite; only expand.)

1) Prime Directives
• ND-SAFE ALWAYS: no autoplay, no strobe, smooth fades, reduced-motion aware, “Calm Mode” switch. 
• NEVER SVG-ONLY: painterly pipeline required (geometry → shader → provenance overlay → 4K PNG/WEBP). 
• TRAUMA-INFORMED: spiral navigation, choice/toggles, safe thresholds with guardian prompts.
• SCIENCE-GROUNDED: hemispheric & non-linear learning references present in /docs/SCIENCE_REFERENCES.md.
• PROVENANCE: every asset (image/sound/text) must declare title, creator, year, license, source.

2) Canonical Paths (read-only)
• /docs/CODEX_INSTRUCTIONS.md (unified charter) 
• /docs/CODEX_EXT_RUNBOOK.md (this file) 
• /docs/SCIENCE_REFERENCES.md (citations) 
• /docs/STYLE_GUIDE.md (Perm/Business/Visionary, palette + motifs)
• /data/spiral_map.json (nodes & chamber refs) 
• /data/angels.json (six guardians + roles) 
• /data/stylepacks/stylepacks.json (skins) 
• /schemas/provenance.json, /schemas/stylepack.json (validation)
• /src/codex.ext.js (loader & ND defaults)

3) Learning Environments (Skins)
Define five skins in /data/stylepacks/stylepacks.json:
• AGRIPPA: parchment tables, planetary seals, quill textures, vellum crackle; serif inscriptions; mute gold/ink palette.
• TESLA: neon coils, Lissajous curves, resonance schematics, oscilloscope glass; cyan/teal/graphite; soft glow shaders.
• HYPATIA: marble domes, astrolabes, star atlases, Alexandria scripts; lapis + gold leaf; oculus skylight bloom.
• BUSINESS CATHEDRAL: obsidian + gold, Rosslyn spiral pillar, sponsor-deck grids, curator plaques; rose-quartz accents.
• VISIONARY PERM: alabaster avatars, vesica halos, Rubin softness, surreal engravings; violet/teal aura with gold.

Each skin must specify:
{ id, name, type: [“Lineage”|”Business”|”Perm”], palette: {gold,obsidian,roseQuartz,tealGlow,violet}, motifs:[], textures:[], shaders:[] }

4) Guardians (Six Consecration Angels)
Create /data/angels.json with:
• Alignment (axis steadiness) 
• Integration (parts bridging) 
• Fusion (art↔science synthesis) 
• Spiral (non-linear flow) 
• Gate (threshold safety) 
• Voice (expression & resonance)

At chamber entry, show invocation line: “Angel of [Role], hold me steady in [Aim].”

5) Spiral Engine (Tilted Cosmos)
Implement /src/engines/spiral-engine.js:
• Render logarithmic spiral at 23.5° tilt; param: nodeCount ∈ {33,72,144}; polar position (theta,radius,elevation).
• Input: /data/spiral_map.json → array of chamberNode (id,title,skin,guardian,position,payload,safety).
• Output: event “chamber:open” with node id; exports “journey:map” JSON snapshot (visited ids + timestamps).
• Accessibility: keyboard orbit (←→), radial zoom (+/–), “Calm Mode” flag to reduce parallax/motion.

6) Chamber Engine (Time-Tesseract Switcher)
Implement /src/engines/chamber-engine.js:
• API: open(id), applySkin(skinId), setGuardian(guardian), setPayload(payload).
• Transition rules: cross-fade 600–900ms; ND-safe easing; never flash-invert.
• Skin assets come from stylepacks; payload pulls images, overlays, text, audioPreset; provenance ids required.

7) Visionary Art Engine (Painterly Pipeline)
Implement /src/engines/art-engine.js:
• Base geometry: Paper.js (spirals, vesicas, rose windows). 
• Shader stage: Three.js/WebGL (nebula, vellum, stained glass, marble noise).
• Provenance overlays: public-domain OA (e.g., Hilma af Klint, Emma Kunz, Splendor Solis plates); blend modes subtle.
• Export: 4K+ PNG/WEBP with embedded caption strip (title/creator/year/license/source) and JSON sidecar referencing /schemas/provenance.json.
• Validation: refuse export if any payload missing provenance.

8) Harmonics Engine (Optional, Off by Default)
Implement /src/engines/sound-engine.js:
• Tone.js presets: planetary tones (Hz mapping), Solfeggio glides, cathedral IR (impulse responses), “type beats” pad.
• ND defaults: autoplay=false, fadeIn≥1200ms, limiter on, gain −12dB, stopOnBlur=true.
• UI toggles: master enable, preset select, gain slider; show safety message when enabling sound.

9) Provenance & Safety
• /schemas/provenance.json → { id?, title*, creator*, year*, edition?, license*, source*, notes?, tags[], safety{motionSensitive,highContrast,audioReactive} }.
• /schemas/stylepack.json → as in STYLE_GUIDE (palette hex validated).
• All engines call validate() before render/export. If invalid → show curator plaque with “Provenance Required”.

10) Scientific Anchors (Enforced Presence)
• Ensure /docs/SCIENCE_REFERENCES.md contains: McGilchrist (hemispheres), Bruner (spiral curriculum), Davis & Sumara (complexity), Lakoff & Johnson (embodied), Brewin (PTSD memory), Carello & Butler (trauma pedagogy), Grand (Brainspotting), Frith & Happé (autism), Eide & Eide (dyslexia), Vartanian & Skov (fractals), Chaieb et al. (entrainment), plus spiral math r = a·e^(bθ) and Fourier linkage notes.
• The spiral landing screen must show a discreet “Why spiral?” info dot linking to this doc.

11) UX Flow (Definition of Experience)
• Landing: cosmos tilts in; 6 guardian sigils glow softly; sound OFF.
• Orbit: learner glides along spiral; tooltips show node title + skin.
• Entry: guardian invocation line + Calm Mode toggle visible.
• Inside: chamber skin loads; painterly plate renders; optional harmonics can be enabled; journal pane (markdown) available.
• Exit: export vision plate + journey map; autosave with provenance.

12) Milestones (Definition of Done)
P1—Foundation: /docs added (Charter, Science, Style, Runbook), cross-links to Trinity; CI check validates schemas exist. DoD: repo builds, docs render, ND defaults in codex.ext.js.
P2—Spiral Engine: 23.5° spiral renders; nodes from spiral_map.json interactive; keyboard & pointer orbit. DoD: open/close events; snapshot exports.
P3—Chamber Skins: 5 skins functional; soft morphs; guardian mapping works. DoD: skin toggles persist across sessions.
P4—Visionary Art: painterly pipeline running; 4K exports with provenance; OA overlays selectable. DoD: validator blocks export if provenance missing.
P5—Harmonics: Tone.js presets; UI toggles; ND fades. DoD: Lighthouse or custom audit passes “no autoplay audio”.
P6—Provenance & Safety: schemas validated CI; Calm Mode reduces motion/contrast globally. DoD: a11y checklist passes (no flashes; prefers-reduced-motion honored).
P7—Business: Business Cathedral deck template exports; avatar pack (Perm) present; readme_fusion.md added. DoD: sample deck exports in under 1 minute with plate + provenance.

13) Content Contracts (Shared JSON Stubs)
• /data/spiral_map.json:
[
  { “id”:”n001”,”title”:”Prima Materia”,”skin”:”VISIONARY_PERM”,”guardian”:”Alignment”,
    “position”:{“theta”:0.0,”radius”:1.0,”elevation”:0.05},
    “payload”:{“visuals”:[“splendor_solis_01”,”vesica_grid_A”],”text”:”Opening of the spiral.”,
               “audioPreset”:”planetary_moon”,”provenanceRefs”:[“ps_splendor_01”,”hk_kunz_A”]},
    “safety”:{“reducedMotionOK”:true,”allowAudio”:false}
  }
]
• /data/angels.json:
[
  {“id”:”alignment”,”title”:”Guardian of Alignment”,”mantra”:”steady the axis”},
  {“id”:”integration”,”title”:”Guardian of Integration”,”mantra”:”bridge the parts”},
  {“id”:”fusion”,”title”:”Guardian of Fusion”,”mantra”:”marry art and science”},
  {“id”:”spiral”,”title”:”Guardian of Spiral”,”mantra”:”keep the orbit”},
  {“id”:”gate”,”title”:”Guardian of the Gate”,”mantra”:”honor thresholds”},
  {“id”:”voice”,”title”:”Guardian of Voice”,”mantra”:”protect expression”}
]

14) APIs (Engines)
• spiralEngine.init({ tiltDeg:23.5, nodeCount:72, container }) → Promise
• spiralEngine.on(“chamber:open”,(id)=> chamberEngine.open(id))
• chamberEngine.applySkin(skinId), chamberEngine.setGuardian(name), chamberEngine.setPayload(payload)
• artEngine.render({ geometry, shaders, overlays, out:{width:4096,format:”webp”} }) → Blob
• soundEngine.enable(presetId), soundEngine.disable(), soundEngine.setGain(db)
• provenance.validate(asset|plateJSON) → {ok, errors[]}
• codexEXT.init() → {instructions, science, styleGuide, milestones, data:{spiralMap, angels, stylepacks}, safety, schemas, tasks}

15) Acceptance Tests (Smoke Suite)
• “No-SVG-Only”: attempt render without shader/overlay must fail with clear message.
• “Silent-By-Default”: load app; verify no audio nodes active; enabling sound shows safety note.
• “4K-Or-Greater”: export below 3840 px fails with hint to raise size.
• “Provenance-Required”: export without provenanceRefs fails; with references succeeds and embeds caption.
• “Calm-Mode-Global”: toggling Calm Mode reduces animation speeds and contrast in all engines.

16) Extension Points
• Add new skins under /data/stylepacks/; must declare palette + shaders + textures.
• Add new guardians only via PR updating /data/angels.json and /docs/STYLE_GUIDE.md.
• Add environment-specific tasks (e.g., Agrippa “Planetary Hour plate”, Tesla “Coil resonance plate”, Hypatia “Star dome plate”) as entries in /docs/CODEX_MILESTONES.md.

17) Security & Licensing
• Code: MIT. Art: CC BY-NC 4.0 unless sponsor-specific. Third-party OA must keep attribution.
• Block any asset with unknown license from export; allow preview with watermark overlay “UNLICENSED / STUDY ONLY”.

18) Ritual of Continuity
• After each milestone: export one Vision Plate + journey map; commit with message “cosmos-plate: <skin> <nodeId>”.
• Back up /docs and /data to Stone Grimoire (Atelier Station) nightly.

⚑ FINAL DECREE
Build as a spiral cosmos: museum-grade, trauma-informed, sponsor-ready, scientifically grounded, visionary. Never flatten; never cheapen. Preserve, honor, ground, radiate.