import fs from "fs";
import path from "path";
import Ajv from "ajv";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const schema   = JSON.parse(fs.readFileSync(path.join(ROOT, "schemas", "node.schema.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "registry", "registry.json"), "utf8"));

const ajv = new Ajv({ allErrors:true, strict:false });
const validate = ajv.compile(schema);

let ok = true;
for (const n of registry.nodes){
  if (!validate(n)){
    ok = false;
    console.error("Schema errors for", n.id || "(missing id)");
    for (const err of validate.errors) console.error(" •", err.instancePath, err.message);
  }
}
if (!ok){ process.exit(1); }
console.log("All nodes valid:", registry.nodes.length);
