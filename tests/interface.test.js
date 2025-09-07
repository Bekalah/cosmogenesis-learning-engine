import { createServer } from "http";
import { readFile } from "fs/promises";
import { validateInterface } from "../engines/interface-guard.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sample = JSON.parse(
  await readFile(
    join(__dirname, "../assets/data/sample_interface.json"),
    "utf8",
  ),
);
const schemaPath = join(__dirname, "../assets/data/interface.schema.json");

const server = createServer(async (req, res) => {
  try {
    const data = await readFile(schemaPath);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end(e.message);
  }
});
server.listen(0);
await new Promise((r) => server.once("listening", r));
const { port } = server.address();
const res = await validateInterface(sample, `http://localhost:${port}/schema`);
server.close();
if (!res.valid) {
  throw new Error("Interface schema failed: " + JSON.stringify(res.errors));
}
console.log("Interface schema OK");
