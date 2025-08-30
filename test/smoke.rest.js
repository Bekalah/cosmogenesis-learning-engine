 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/test/smoke.test.js
index 0000000000000000000000000000000000000000..74a88a32a5f005377de7f2b06cd163733f1bdf90 100644
--- a//dev/null
+++ b/test/smoke.test.js
@@ -0,0 +1,25 @@
+import { describe, it, expect } from 'vitest';
+import { readFileSync } from 'fs';
+import { fileURLToPath } from 'url';
+import path from 'path';
+import { renderPlate } from '../src/renderPlate.js';
+
+const __filename = fileURLToPath(import.meta.url);
+const __dirname = path.dirname(__filename);
+
+function loadFirstDemo() {
+  const file = path.join(__dirname, '..', 'data', 'demos.json');
+  const raw = readFileSync(file, 'utf8');
+  const clean = raw.replace(/^\+/gm, '').trim();
+  const demos = JSON.parse(clean);
+  return demos[0].config;
+}
+
+describe('renderPlate', () => {
+  it('renders first demo plate without throwing', () => {
+    const config = loadFirstDemo();
+    const plate = renderPlate(config);
+    expect(plate).toHaveProperty('layout', config.layout);
+    expect(plate.labels.length).toBe(config.mode);
+  });
+});
 
EOF
)
