import test from "node:test";
import assert from "node:assert/strict";
import { cfg, initCodex, isLocked } from "../src/codexConfig.js";

test("codex config locks after initialization", () => {
  initCodex({ version: "144:99", nodes: { hero: 11 } });
  assert.equal(cfg.version, "144:99");
  assert.ok(isLocked());
  assert.throws(() => initCodex({ version: "999" }));
  assert.throws(() => {
    // Attempt to mutate locked config
    cfg.version = "changed";
  });
});
