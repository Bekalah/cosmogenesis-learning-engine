import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import path from 'path';
import { load, getByType } from '../src/pluginRegistry.js';

test('load registers plugins by type', async () => {
  const fixtures = path.resolve('test/fixtures');
  mkdirSync(fixtures, { recursive: true });
  const pluginFile = path.join(fixtures, 'testPlugin.js');
  writeFileSync(pluginFile, 'export default { id: "testPlugin", activate(){} };');
  const descFile = path.join(fixtures, 'plugins.json');
  writeFileSync(descFile, JSON.stringify([{ id: 'testPlugin', type: 'layout', src: pluginFile }]));
  const errs = await load(descFile);
  assert.equal(errs.length, 0);
  const layouts = getByType('layout');
  assert.equal(layouts.length, 1);
  rmSync(pluginFile);
  rmSync(descFile);
});
