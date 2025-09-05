import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deepEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { EventEmitter } from 'node:events';
function loadEngine() {
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
    readFileSync('assets/js/engines/progress-engine.js', 'utf8'),
    ctx,
  );
  return ctx;
}

test('progress export JSON writes a file', () => {
  const path = exportJSON({ ok: true }, 'progress.json');
  assert.ok(typeof path === 'string' && path.endsWith('progress.json'));
});

test('records progress and resets', () => {
  ctx.window.roomsProgress.markRoomEnter('agrippa');
  ctx.window.roomsProgress.markQuestComplete('agrippa', 'read');
  deepEqual(ctx.window.roomsProgress.state.rooms, {
    agrippa: { quests: { read: true }, entered: true },
  });
  ctx.window.roomsProgress.reset();
  const reset = JSON.parse(
    JSON.stringify(ctx.window.roomsProgress.state.rooms),
  );
  deepEqual(reset, {});
});

