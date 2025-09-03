import { test } from 'node:test';
import assert from 'node:assert/strict';
import { soundscape } from '../plugins/soundscape.js';

function cleanup() {
  delete global.window;
  delete global.alert;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  global.alert = () => {};
  assert.doesNotThrow(() => soundscape('hypatia'));
  cleanup();
});

test('soundscape starts oscillators when not muted', () => {
  let started = 0;
  class FakeOsc {
    constructor() { this.frequency = { value: 0 }; }
    connect() { return this; }
    start() { started++; }
    stop() {}
  }
  class FakeGain { constructor() { this.gain = { value: 0 }; } connect() { return this; } }
  class FakeMerger { connect() { return this; } }
  class FakeAudioCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
    createChannelMerger() { return new FakeMerger(); }
    close() {}
  }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeAudioCtx };
  global.alert = () => {};
  assert.doesNotThrow(() => soundscape('tesla'));
  assert.equal(started, 2);
  cleanup();
});

test('soundscape handles missing AudioContext', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: false } };
  const warnings = [];
  console.warn = (msg) => warnings.push(msg);
  assert.doesNotThrow(() => soundscape('hypatia'));
  assert.ok(warnings.some((m) => /Web Audio API not supported/.test(m)));
  cleanup();
});
