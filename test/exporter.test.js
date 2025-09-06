import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { exportPNG } from '../src/engines/exporter.js';

// Verify that exportPNG writes a non-empty PNG file
test('writes a valid PNG file', () => {
  const outPath = exportPNG(null, 'test.png');
  const stats = fs.statSync(outPath);
  assert.ok(stats.size > 0);
  const signature = fs.readFileSync(outPath).slice(0, 8).toString('hex');
  assert.equal(signature, '89504e470d0a1a0a');
  fs.unlinkSync(outPath);
});
