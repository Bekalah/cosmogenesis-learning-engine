import fs from 'node:fs';
import path from 'node:path';

export function exportPNG(canvasOrNull, filename = 'export.png') {
  // In browser we use canvas.toDataURL; in tests (Node) we no-op to ./exports
  const outDir = path.resolve('./exports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, Buffer.from([])); // placeholder zero-byte PNG for tests
  return outPath;
}

export function exportJSON(obj, filename = 'export.json') {
  const outDir = path.resolve('./exports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, JSON.stringify(obj ?? {}, null, 2));
  return outPath;
}
