 All engine state can be represented as a JSON config (share/import/export):
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
 
```js
 const STYLEPACKS = {
   hilma_spiral: {
-    bg:”#f8f5ef”, ink:”#141414”, monad:”#0b0b0b”, spiral:”#b8860b”, border:”#2a2a2a”,
-    nodes:[“#b7410e”,”#c56a1a”,”#d7a21a”,”#2e7d32”,”#1f6feb”,”#4338ca”,”#6d28d9”]
    bg: "#f8f5ef", ink: "#141414", monad: "#0b0b0b", spiral: "#b8860b", border: "#2a2a2a",
    nodes: ["#b7410e", "#c56a1a", "#d7a21a", "#2e7d32", "#1f6feb", "#4338ca", "#6d28d9"]
   },
-  // ...
  // additional stylepacks here
 };
```
 
Each stylepack defines core colors for the interface: background (`bg`), ink (`ink`), monad center, spiral stroke, border, and an array of node colors. To register a new stylepack, extend the `STYLEPACKS` object in the UI and expose its key through a selector or query parameter.

—
