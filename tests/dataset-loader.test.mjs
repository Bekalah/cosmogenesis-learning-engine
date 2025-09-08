import { createServer } from "http";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadRegistry } from "../engines/registry-loader.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const palettePath = join(__dirname, "../data/palette.json");

const server = createServer(async (req, res) => {
  try {
    const data = await readFile(palettePath);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end(err.message);
  }
});
server.listen(0);
await new Promise(r => server.once("listening", r));
const { port } = server.address();
const url = `http://localhost:${port}/palette.json`;

const palette = await loadRegistry(url);
if (!palette.fuchs_palette) throw new Error("Palette load failed");

globalThis.Deno = {};
const palette2 = await loadRegistry(url);
if (!palette2.fuchs_palette) throw new Error("Palette load failed under Deno");
delete globalThis.Deno;

server.close();
console.log("Dataset loader palette OK");
