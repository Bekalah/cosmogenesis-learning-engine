+import { readFileSync } from 'fs';
+import path from 'path';
+
+export function loadConfig(relativePath) {
+  const file = path.resolve(process.cwd(), relativePath);
+  const raw = readFileSync(file, 'utf8');
+  const clean = raw.replace(/^\s*\+/gm, '').trim();
+  return JSON.parse(clean);
+}
+
+export function loadFirstDemo() {
+  const demos = loadConfig('data/demos.json');
+  return demos[0].config;
+}
+
