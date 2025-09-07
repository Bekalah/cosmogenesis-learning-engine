import { test } from "node:test";
import assert from "node:assert/strict";
import { writeFileSync, rmSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { load, getByType } from "../src/pluginRegistry.js";

test("load registers plugins by type", async () => {
  // create isolated temp directory for plugin fixtures
  const fixturesDir = mkdtempSync(path.join(tmpdir(), "plugin-test-"));
  const pluginFile = path.join(fixturesDir, "testPlugin.js");
  writeFileSync(
    pluginFile,
    'export default { id: "testPlugin", activate(){} };',
  );
  const descFile = path.join(fixturesDir, "plugins.json");
  writeFileSync(
    descFile,
    JSON.stringify([{ id: "testPlugin", type: "layout", src: pluginFile }]),
  );

  const errs = await load(descFile);
  assert.equal(errs.length, 0);
  const layouts = getByType("layout");
  assert.equal(layouts.length, 1);

  // clean up temporary fixtures directory
  rmSync(fixturesDir, { recursive: true, force: true });
});
