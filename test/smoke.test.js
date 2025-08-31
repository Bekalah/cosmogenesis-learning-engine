import { test } from 'node:test';
import { strict as assert } from 'assert';
import { renderPlate } from '../src/renderPlate.js';

test('renderPlate creates items for basic wheel', () => {
  const plate = renderPlate({ layout: 'wheel', mode: 3, labels: ['a', 'b', 'c'] });
  assert.equal(plate.items.length, 3);
});

