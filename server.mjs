import express from "express";
import compression from "compression";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "dist");

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.use(compression());

// Calm headers keep offline mirrors deterministic.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

function mountStatic(prefix, relativeDir, options = {}) {
  const full = path.join(__dirname, relativeDir);
  if (!fs.existsSync(full)) return;
  app.use(prefix, express.static(full, options));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, status: "online" });
});

app.use(
  express.static(DIST_DIR, {
    extensions: ["html"],
    setHeaders(res, filePath) {
      if (filePath.endsWith("service-worker.js")) {
        res.setHeader("Cache-Control", "no-store");
      }
    },
  }),
);

mountStatic("/assets", "assets");
mountStatic("/registry", "registry");

app.use((req, res) => {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`hub listening on http://0.0.0.0:${PORT}`);
});
