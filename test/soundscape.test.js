import test from 'node:test';
import assert from 'node:assert/strict';
import soundscape, { playSoundscape } from '../plugins/soundscape.js';
import { soundscape } from '../plugins/soundscape.js';

function cleanup() {
  delete global.window;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  delete global.alert;
}

test('soundscape respects mute', () => {
  delete global.alert;
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true }, AudioContext: class {} };
  global.alert = () => {};
  assert.doesNotThrow(() => playSoundscape('hypatia'));
function cleanup() { delete global.window; }

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true }, AudioContext: class {} };
}

test('soundscape respects mute', () => {
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  assert.doesNotThrow(() => soundscape.activate(null, 'hypatia'));
  cleanup();
});

test('soundscape starts single oscillator by default', () => {
import test from "node:test";
import assert from "node:assert/strict";
import soundscape from "../plugins/soundscape.js";

// Clean window after each test
function cleanup() {
  delete global.window;
}

test("soundscape respects mute", () => {
  global.window = {
    COSMO_SETTINGS: { muteAudio: true },
    AudioContext: class {},
  };
  assert.doesNotThrow(() => soundscape("hypatia"));
  cleanup();
});

test("soundscape starts oscillators when not muted", () => {
  let started = 0;

  class FakeOsc {
    constructor() { this.frequency = { value: 0 }; }
    connect() { return this; }
    start() { started++; }
    stop() {}
  }

  class FakeGain {
    constructor() { this.gain = { value: 0 }; }
    connect() { return this; }
  }

  class FakeCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
  }

  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, { theme: 'tesla' }));
  assert.equal(started, 1);
  soundscape.deactivate();
  cleanup();
});

test('soundscape enables binaural beats when requested', () => {
  let started = 0;

  class FakeOsc {
    constructor() { this.frequency = { value: 0 }; }
    connect() { return this; }
    start() { started++; }
    stop() {}
  }

  class FakeGain {
    constructor() { this.gain = { value: 0 }; }
    connect() { return this; }
  }

  class FakeCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
  }

  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, { theme: 'tesla', binaural: true }));
  class FakeAudioCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
    close() {}
  }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeAudioCtx };
  assert.doesNotThrow(() => playSoundscape('tesla'));
  class FakeCtx {
    constructor() { this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
  }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, 'tesla'));
  class FakeGain { constructor() { this.gain = { value: 0 }; } connect() { return this; } }
  class FakeMerger { connect() { return this; } }
  class FakeAudioCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
    createChannelMerger() { return new FakeMerger(); }
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
  class FakeGain {
    constructor() { this.gain = { value: 0 }; }
    connect() { return this; }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeAudioCtx };
  global.alert = () => {};
  }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeAudioCtx };
  class FakeGain { constructor() { this.gain = { value: 0 }; } connect() { return this; } }
  class FakeMerger { connect() { return this; } }
  class FakeAudioCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
    createChannelMerger() { return new FakeMerger(); }
    close() {}
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

  class FakeCtx {
    constructor() { this.currentTime = 0; this.destination = {}; }
    createOscillator() { return new FakeOsc(); }
    createGain() { return new FakeGain(); }
  }

  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeCtx };
  assert.doesNotThrow(() => soundscape.activate(null, { theme: 'tesla', binaural: true }));
    constructor() {
      this.gain = { value: 0 };
    }
    connect() {
      return this;
    }
  }
  class FakeAudioCtx {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
    }
    createOscillator() {
      return new FakeOsc();
    }
    createGain() {
      return new FakeGain();
    }
  }
  global.window = {
    COSMO_SETTINGS: { muteAudio: false },
    AudioContext: FakeAudioCtx,
  };
  assert.doesNotThrow(() => soundscape("tesla"));
  assert.equal(started, 2);
  soundscape.deactivate();
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
