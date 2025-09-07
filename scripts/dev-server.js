import { createServer } from "http";
import { promises as fs } from "fs";
import { extname, join, resolve } from "path";

const root = resolve(process.argv[2] || "..");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
};

const server = createServer(async (req, res) => {
  let filePath = join(root, decodeURIComponent(req.url));
  try {
    let stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = join(filePath, "index.html");
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end("Not found");
  }
});

const port = 8080;
server.listen(port, () => {
  console.log(
    `Dev server running at http://localhost:${port}/ serving ${root}`,
  );
});
