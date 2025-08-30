-+export function renderPlate(config) {
-+  if (!config || typeof config.layout !== 'string' || typeof config.mode !== 'number' || !Array.isArray(config.labels)) {
-+    throw new Error('Invalid plate configuration');
-+  }
-+  if (config.labels.length !== config.mode) {
-+    throw new Error('Label count must match mode');
-+  }
-+  return { ...config, rendered: true };
-+}
- 
+// Render a plate configuration into coordinates and export helpers
+
+function spiralPositions(count) {
+  const points = [];
+  const a = 5;
+  const b = 5;
+  for (let i = 0; i < count; i++) {
+    const angle = 0.5 * i;
+    const radius = a + b * angle;
+    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
+  }
+  return points;
+}
+
+function twinConePositions(count) {
+  const points = [];
+  const spacing = 20;
+  for (let i = 0; i < count; i++) {
+    const sign = i % 2 === 0 ? 1 : -1;
+    const step = Math.floor(i / 2) + 1;
+    points.push({ x: 0, y: sign * step * spacing });
+  }
+  return points;
+}
+
+function wheelPositions(count) {
+  const points = [];
+  const radius = 100;
+  for (let i = 0; i < count; i++) {
+    const angle = (2 * Math.PI * i) / count;
+    points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
+  }
+  return points;
+}
+
+function gridPositions(count) {
+  const points = [];
+  const cols = Math.ceil(Math.sqrt(count));
+  const size = 40;
+  for (let i = 0; i < count; i++) {
+    const row = Math.floor(i / cols);
+    const col = i % cols;
+    points.push({ x: col * size, y: row * size });
+  }
+  return points;
+}
+
+export function renderPlate(config) {
+  if (!config || typeof config.layout !== 'string' || typeof config.mode !== 'number' || !Array.isArray(config.labels)) {
+    throw new Error('Invalid plate configuration');
+  }
+  if (config.labels.length !== config.mode) {
+    throw new Error('Label count must match mode');
+  }
+
+  const layouts = {
+    spiral: spiralPositions,
+    'twin-cone': twinConePositions,
+    wheel: wheelPositions,
+    grid: gridPositions,
+  };
+
+  const create = layouts[config.layout];
+  if (!create) {
+    throw new Error(`Unsupported layout: ${config.layout}`);
+  }
+
+  const positions = create(config.mode);
+  const items = config.labels.map((text, i) => ({ text, ...positions[i] }));
+
+  function exportAsJSON() {
+    return JSON.stringify(config, null, 2);
+  }
+
+  function exportAsSVG() {
+    const size = 500;
+    const center = size / 2;
+    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
+    items.forEach(({ text, x, y }) => {
+      svg += `<text x="${center + x}" y="${center + y}" text-anchor="middle" dominant-baseline="central">${text}</text>`;
+    });
+    svg += '</svg>';
+    return svg;
+  }
+
+  function exportAsPNG() {
+    return Buffer.from(exportAsSVG());
+  }
+
+  return { ...config, items, exportAsJSON, exportAsSVG, exportAsPNG };
+}
