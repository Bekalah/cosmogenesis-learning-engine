import { test } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, rmSync, mkdirSync } from 'fs';
import path from 'path';
import { load, getByType } from '../src/pluginRegistry.js';

test('load registers plugins by type', async () => {
  const fixturesDir = path.resolve('test/fixtures');
  mkdirSync(fixturesDir, { recursive: true });
  const pluginFile = path.join(fixturesDir, 'testPlugin.js');
  writeFileSync(pluginFile, 'export default { id: "testPlugin", activate(){} };');
  const descFile = path.join(fixturesDir, 'plugins.json');
  writeFileSync(descFile, JSON.stringify([{ id: 'testPlugin', type: 'layout', src: pluginFile }]));
  const errs = await load(descFile);
  assert.equal(errs.length, 0);
  const layouts = getByType('layout');
  assert.equal(layouts.length, 1);
  rmSync(pluginFile);
  rmSync(descFile);
});
