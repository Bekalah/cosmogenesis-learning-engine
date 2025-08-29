# ✦ Cosmogenesis Engine — Spiral Foundation & Builder’s Guide

*A museum-grade, practical guide to how the engine teaches in spirals, how the geometry works, and how to extend it without breaking its dignity.*

—

## ✦ Core Idea — A Spiral Teacher (Not a Flat Syllabus)

Flat systems march: 1 → 2 → 3 → done.  
This engine returns: **Center → Spiral → Ring → Border → Return** — every pass reveals more structure.  
Pedagogically, that means:
- **Recursion over sequence**: you revisit the same set with new relations (labels, palettes, radii, layouts).
- **Progressive complexity**: small changes (turns, inner/outer radius, phase) produce qualitatively new insights.
- **Embodied safety**: Ward Mode, calm motion, legible contrast, no autoplay — usable under stress.

—

## ✦ Visual Grammar (Layouts)

The engine is **data-agnostic**. Layouts are just ways to *see* relations among items.

- **Spiral**: Center (Monad) emits a logarithmic/Archimedean arm; nodes sit on a circular ring.  
- **Twin Cones**: Two opposing arms/arcs symbolize tension of opposites; nodes divide across arcs.  
- **Wheel**: Pure perimeter constellation (no spiral line), good for taxonomies or cycles.  
- **Grid**: Centered matrix for quick scanning and line-of-sight comparisons.

All layouts share a **common border** (frame of reference) and a **monad** (center), so switching layouts preserves orientation: you are still in the same world, from a different angle.

—

## ✦ Geometry — The Spiral

### Archimedean spiral (default)
For samples `i = 0..N`, with `t = i/N`:
θ(t) = t * (turns * 2π)
r(t) = rInner + (rOuter - rInner) * t
x(t) = r(t) * cos(θ(t))
y(t) = r(t) * sin(θ(t))

- **turns**: how many revolutions between `rInner` and `rOuter`
- **rInner / rOuter**: bounds for the learning field
- **samples**: line quality (render fidelity)

### Node ring
For `n` items, each node index `k = 0..n-1`:

φk = phase + k * (2π / n)
xk = rRing * cos(φk) ,  yk = rRing * sin(φk)
rRing ≈ 0.88 * rOuter

- **phase** introduces gentle rotation each render (keeps the experience alive).

### Twin cones (oppositions)
Two arms sweep from `rInner → rOuter` in opposite phases, and nodes split across two semicircular arcs:
- even indices → arc A (0..π), odd indices → arc B (π..2π)  
- use when teaching polarity (logic/creativity, structure/flow, silence/voice).

⸻

## ✦ Pedagogy — Why This Works

1. **Center (Monad)**  
   Anchor. The “why” (intention) and identity of the study.

2. **Spiral (Formation)**  
   Time and deepening. Each pass across the same ideas arrives with a new angle of relation.

3. **Ring (Community of Ideas)**  
   Items as peers in orbit; the ring prevents “ranking,” encourages constellation thinking.

4. **Border (Context / Boundaries)**  
   Aesthetic edge, cognitive guardrail, and the place for provenance plaques.

5. **Return**  
   Small parameter changes create **qualitative** shifts (not just more detail). The student returns, spirals, and internalizes patterns.

⸻

## ✦ Config Schema (Public API)

All engine state can be represented as a JSON config (share/import/export):

```json
{
  “layout”: “spiral”, 
  “mode”: “auto”,
  “turns”: 12,
  “samples”: 2600,
  “rInner”: 64,
  “rOuter”: 460,
  “nodeSize”: 24,
  “borderWidth”: 2.5,
  “style”: “hilma_spiral”,
  “labels”: [“Red”,”Orange”,”Yellow”,”Green”,”Cyan”,”Blue”,”Violet”],
  “phase”: 1.0471975512
}

⸻

•	layout: “spiral” | “twin_cones” | “wheel” | “grid”
	•	mode: “auto” or a number (7, 12, 22, 33, 72, …). If “auto”, count is derived from labels.length or defaults to 7.
	•	labels: any array of strings (concepts, names, steps).
	•	style: palette & stroke set; unlockable variants (evolves with use).

Share link format (already supported in the app):
?cfg=BASE64(JSON) → paste on any machine, the engine restores the exact plate.

⸻

✦ Stylepacks (Aesthetic System)

A stylepack defines UI paper/ink plus art palette:

const STYLEPACKS = {
  hilma_spiral: {
    bg:”#f8f5ef”, ink:”#141414”, monad:”#0b0b0b”, spiral:”#b8860b”, border:”#2a2a2a”,
    nodes:[“#b7410e”,”#c56a1a”,”#d7a21a”,”#2e7d32”,”#1f6feb”,”#4338ca”,”#6d28d9”]
  },
  // ...
};

