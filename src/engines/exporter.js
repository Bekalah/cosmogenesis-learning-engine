import fs from "node:fs";
import path from "node:path";

export function exportPNG(canvasOrNull, filename = "export.png") {
  // In browser we use canvas.toDataURL; in tests (Node) we write a real PNG
  const outDir = path.resolve("./exports");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);

  let buffer;
  if (canvasOrNull) {
    // Node-canvas exposes toBuffer; browser canvas exposes toDataURL
    if (typeof canvasOrNull.toBuffer === "function") {
      buffer = canvasOrNull.toBuffer("image/png");
    } else if (typeof canvasOrNull.toDataURL === "function") {
      const dataUrl = canvasOrNull.toDataURL("image/png");
      const base64 = dataUrl.split(",")[1];
      buffer = Buffer.from(base64, "base64");
    }
  }

  if (!buffer) {
    // 1x1 transparent PNG
    buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9n3ScQAAAABJRU5ErkJggg==",
      "base64",
    );
  }

  fs.writeFileSync(outPath, buffer);
  return outPath;
}

export function exportJSON(obj, filename = "export.json") {
  const outDir = path.resolve("./exports");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, JSON.stringify(obj ?? {}, null, 2));
  return outPath;
}
