 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/docs/demo_guide.md b/docs/demo_guide.md
index 49c4d39663c23b8ebcee2fae00cd10e5c67a6489..62a01409bc0f21a59015b9bfb04fb9c9c1a47588 100644
--- a/docs/demo_guide.md
+++ b/docs/demo_guide.md
@@ -1,22 +1,36 @@
 # ✦ Cosmogenesis Learning Engine — Demo Guide
 
 *A spiral teacher for pattern literacy, creative practice, and living archives.*
 
 —
 
 ## ✦ How This Guide Works
-This is not a linear manual.  
-It is a **spiral walk-through**: each turn revisits the same engine with deeper complexity.  
+This is not a linear manual.
+It is a **spiral walk-through**: each turn revisits the same engine with deeper complexity.
 
-- **First Spiral** → learn the surface (layout, labels, export).  
-- **Second Spiral** → weave correspondences (datasets, traditions).  
-- **Third Spiral** → fuse art, archive, and provenance into living plates.  
+- **First Spiral** → learn the surface (layout, labels, export).
+- **Second Spiral** → weave correspondences (datasets, traditions).
+- **Third Spiral** → fuse art, archive, and provenance into living plates.
 
 Each spiral is a *return* — not a reset.
 
 —
 
 ## ✦ First Spiral — The Basics
-1. Open the [engine](../index.html).  
-2. Choose **Layout** = Spiral.  
-3. Enter 7 labels (colors work well):  
+1. Open the [engine](../index.html).
+2. Choose **Layout** = Spiral.
+3. Enter 7 labels (colors work well): Red, Orange, Yellow, Green, Cyan, Blue, Violet.
+4. Export the plate (**Export → Copy Link** or screenshot) to save your setup.
+5. Reset to blank state with **Reset** (or refresh) and note how the spiral invites another pass.
+
+—
+
+## ✦ Second Spiral — Weaving Correspondences
+Map your labels to datasets or traditions, swap layouts, and watch relations emerge.
+See the [Engine Spiral Foundation](engine_spiral_foundation.md) for geometry and extension.
+
+—
+
+## ✦ Third Spiral — Living Plates
+Combine exported plates with provenance notes to build living archives.
+Follow-up guides (e.g., [open_source_art_index.md](open_source_art_index.md)) explore these practices further.
 
EOF
)
