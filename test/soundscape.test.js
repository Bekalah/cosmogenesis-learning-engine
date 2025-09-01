import { test } from 'node:test';
import assert from 'node:assert/strict';
import soundscape from '../plugins/soundscape.js';

function cleanup(){ delete global.window; delete global.alert; }

test('soundscape respects mute', ()=>{
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  global.alert = () => {};
  assert.doesNotThrow(()=> soundscape('hypatia'));
import soundscape from '../plugins/soundscape.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Clean window after each test
function cleanup(){ delete global.window; }

test('soundscape respects mute', ()=>{
  global.window = { COSMO_SETTINGS: { muteAudio: true } };
  assert.doesNotThrow(()=> soundscape.activate(null,'hypatia'));
  assert.doesNotThrow(()=> soundscape('hypatia'));
  cleanup();
});

test('soundscape starts oscillators when not muted', ()=>{
  let started = 0;
  class FakeOsc { constructor(){ this.frequency={value:0}; } connect(){ return this; } start(){ started++; } stop(){} }
  class FakeGain { constructor(){ this.gain={value:0}; } connect(){ return this; } }
  class FakeMerger { connect(){ return this; } }
  class FakeAudioCtx {
    constructor(){ this.currentTime = 0; this.destination = {}; }
    createOscillator(){ return new FakeOsc(); }
    createGain(){ return new FakeGain(); }
    createChannelMerger(){ return new FakeMerger(); }
  }
  global.window = { COSMO_SETTINGS: { muteAudio: false }, AudioContext: FakeAudioCtx };
  global.alert = () => {};
  assert.doesNotThrow(()=> soundscape('tesla'));
  assert.equal(started,2);
  class FakeGain { constructor(){ this.gain={value:0}; } connect(){ } }
  class FakeGain { constructor(){ this.gain={value:0}; } connect(){ }
import { strict as assert } from 'assert';
import soundscape from '../plugins/soundscape.js';

// Clean window after each test
function cleanup() {
  delete global.window;
  delete global.alert;
function cleanup() {
  delete global.window;
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
    constructor() {
      this.frequency = { value: 0 };
    }
    connect() {
      return this;
    }
    start() {
      started++;
    }
    stop() {}
  }
  class FakeGain {
    constructor() {
      this.gain = { value: 0 };
    }
    connect() {}
  }
  class FakeMerger {
    constructor() { this.frequency = { value: 0 }; }
    connect() { return this; }
    start() { started++; }
    stop() {}
  }
  class FakeGain {
    constructor() { this.gain = { value: 0 }; }
    connect() {}
  }
  global.window = {
    COSMO_SETTINGS: { muteAudio: false },
    AudioContext: class {
      constructor(){ this.currentTime = 0; this.destination = {}; }
      createOscillator(){ return new FakeOsc(); }
      createGain(){ return new FakeGain(); }
    }
  };
  assert.doesNotThrow(()=> soundscape.activate(null,'tesla'));
  assert.equal(started,2);
  soundscape.deactivate();
  assert.doesNotThrow(()=> soundscape('tesla'));
  assert.equal(started,2);
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
      createChannelMerger() {
        return new FakeMerger();
      }
    },
  };
      constructor() { this.currentTime = 0; this.destination = {}; }
      createOscillator() { return new FakeOsc(); }
      createGain() { return new FakeGain(); }
    }
  };
  assert.doesNotThrow(() => soundscape('tesla'));
  assert.equal(started, 2);
  cleanup();
});

