import { test } from "node:test";
import { ok, equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { EventEmitter } from "node:events";

function loadHooks() {
  const storage = {};
  const doc = new EventEmitter();
  doc.addEventListener = doc.on.bind(doc);
  doc.dispatchEvent = (evt) => doc.emit(evt.type, evt);
  const ctx = {
    localStorage: {
      getItem: (k) => storage[k] || null,
      setItem: (k, v) => {
        storage[k] = String(v);
      },
    },
    document: doc,
    window: {},
    CustomEvent: class CustomEvent extends Event {
      constructor(type, opts) {
        super(type, opts);
        this.type = type;
        this.detail = opts?.detail;
      }
    },
    console,
  };
  vm.runInNewContext(
    readFileSync("assets/js/engines/tesseract-hooks.js", "utf8"),
    ctx,
  );
  return ctx;
}

test("unlocks nodes and edges and resets", () => {
  const ctx = loadHooks();
  ctx.window.tesseractHooks.unlockNode("agrippa");
  ctx.window.tesseractHooks.unlockEdge({ from: "home", to: "agrippa" });
  ok(ctx.window.tesseractHooks.unlocked.nodes.has("agrippa"));
  ok(ctx.window.tesseractHooks.unlocked.edges.has("home->agrippa"));
  ctx.window.tesseractHooks.reset();
  equal(ctx.window.tesseractHooks.unlocked.nodes.size, 0);
  equal(ctx.window.tesseractHooks.unlocked.edges.size, 0);
});
