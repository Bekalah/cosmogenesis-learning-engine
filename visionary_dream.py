-import numpy as np
-import matplotlib.pyplot as plt
-from matplotlib.colors import LinearSegmentedColormap
+import json
+import math
+import random
+from pathlib import Path
 
-# Initialize canvas dimensions for high-definition output
+from PIL import Image, ImageDraw
+
+# --- Setup ---------------------------------------------------------------
+# High-definition canvas dimensions
 WIDTH, HEIGHT = 1920, 1080
+CENTER = (WIDTH // 2, HEIGHT // 2)
+
+# Load real-world case studies to anchor spiral levels
+DATA_FILE = Path('data/real_world_examples.json')
+CASES = json.loads(DATA_FILE.read_text()) if DATA_FILE.exists() else []
 
-# Generate complex plane grid for fractal calculation
-x = np.linspace(-1.8, 1.8, WIDTH)
-y = np.linspace(-1.0, 1.0, HEIGHT)
-X, Y = np.meshgrid(x, y)
-Z = X + 1j * Y
-
-# Seed constant shaping the Julia set's visionary geometry
-C = complex(-0.70176, -0.3842)
-
-# Iterate fractal equation with escape-time algorithm
-iterations = 300
-escape_radius = 10
-M = np.zeros((HEIGHT, WIDTH))
-for i in range(iterations):
-    mask = np.abs(Z) <= escape_radius
-    Z[mask] = Z[mask] ** 2 + C
-    M[mask] = i
-
-# Define Alex Grey-inspired spectral palette for transcendental hues
-colors = [
-    "#000000",  # cosmic void
+# Alex Grey & surrealist inspired palette
+PALETTE = [
     "#0d3b66",  # deep indigo
-    "#0336ff",  # electric blue
     "#845ec2",  # radiant violet
     "#ff6f91",  # astral magenta
     "#ff9671",  # solar orange
     "#ffc75f",  # golden ray
-    "#f9f871"   # ethereal glow
+    "#f9f871",  # ethereal glow
 ]
-cmap = LinearSegmentedColormap.from_list("alex_grey", colors, N=256)
-
-# Render fractal with palette and save as visionary artwork
-plt.figure(figsize=(WIDTH / 100, HEIGHT / 100), dpi=100)
-plt.imshow(M, cmap=cmap, extent=[-1.8, 1.8, -1.0, 1.0])
-plt.axis("off")
-plt.savefig("Visionary_Dream.png", bbox_inches="tight", pad_inches=0)
-plt.close()
+
+# Create layered gradient background for visionary ambience
+bg = Image.new('RGB', (WIDTH, HEIGHT), PALETTE[0])
+draw = ImageDraw.Draw(bg)
+for i, color in enumerate(PALETTE[1:], start=1):
+    radius = int(max(WIDTH, HEIGHT) * (i / (len(PALETTE))))
+    draw.ellipse([
+        CENTER[0] - radius,
+        CENTER[1] - radius,
+        CENTER[0] + radius,
+        CENTER[1] + radius
+    ], fill=color)
+
+# --- Spiral Construction -------------------------------------------------
+# Parameters for spiral path
+turns = 3.5
+points = 500
+max_radius = min(WIDTH, HEIGHT) * 0.45
+
+# Generate spiral coordinates
+spiral = []
+for i in range(points):
+    t = i / points
+    angle = turns * 2 * math.pi * t
+    radius = max_radius * t
+    x = CENTER[0] + radius * math.cos(angle)
+    y = CENTER[1] + radius * math.sin(angle)
+    spiral.append((x, y))
+
+# Draw spiral curve
+for i in range(len(spiral) - 1):
+    draw.line([spiral[i], spiral[i + 1]], fill=PALETTE[-1], width=3)
+
+# --- Place Case Study Nodes ---------------------------------------------
+font_color = 'white'
+node_radius = 18
+for idx, case in enumerate(CASES):
+    # Position nodes evenly along outer ring
+    phi = idx * (2 * math.pi / len(CASES))
+    r = max_radius * 0.9
+    x = CENTER[0] + r * math.cos(phi)
+    y = CENTER[1] + r * math.sin(phi)
+    draw.ellipse([
+        x - node_radius,
+        y - node_radius,
+        x + node_radius,
+        y + node_radius
+    ], fill=PALETTE[idx % len(PALETTE)])
+    # Descriptive labels for reflection checkpoints
+    text = case['title']
+    w, h = draw.textsize(text)
+    draw.text((x - w / 2, y - node_radius - h - 4), text, fill=font_color)
+
+# --- Creative Fusion Prompts --------------------------------------------
+# Remix prompts appear near center to encourage cross-domain thinking
+random.shuffle(CASES)
+prompts = [c['prompt'] for c in CASES]
+for i, prompt in enumerate(prompts):
+    angle = (i / len(prompts)) * 2 * math.pi
+    r = max_radius * 0.3
+    x = CENTER[0] + r * math.cos(angle)
+    y = CENTER[1] + r * math.sin(angle)
+    w, h = draw.textsize(prompt)
+    draw.text((x - w / 2, y - h / 2), prompt, fill=font_color)
+
+# Save visionary artwork
+bg.save('Visionary_Dream.png')
