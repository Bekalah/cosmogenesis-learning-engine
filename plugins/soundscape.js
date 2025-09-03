// Minimal soundscape plugin with optional binaural beats
export default {
  id: 'soundscape',
  activate(_engine, opts = {}) {
    if (typeof opts === 'string') opts = { theme: opts };
    const { theme = 'hypatia', binaural = false } = opts;
    if (global.window?.COSMO_SETTINGS?.muteAudio) return;
    const AudioCtx = global.window?.AudioContext;
    if (!AudioCtx) {
      global.window?.alert?.('Web Audio API not supported');
      return;
    }
// Minimal soundscape plugin using the Web Audio API

export function playSoundscape(theme = 'hypatia') {
  const settings = globalThis.window?.COSMO_SETTINGS;
  if (settings?.muteAudio) return;

  const AudioCtx = globalThis.window?.AudioContext || globalThis.window?.webkitAudioContext;
  if (!AudioCtx) {
    globalThis.alert?.('Web Audio API not supported');
// Simple binaural soundscape using the Web Audio API
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;
export function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;

  const AudioCtx = global.window?.AudioContext || global.window?.webkitAudioContext;
  if (!AudioCtx) {
    console.warn('Web Audio API not supported');
    return;
  }

  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.gain.value = 0.1;
  gain.connect(ctx.destination);

  const freqs = theme === 'tesla' ? [432, 864] : [220, 440];
  freqs.forEach((f) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = f;
// Simple binaural soundscape using the Web Audio API
// Ambient soundscapes honoring realm archetypes
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;

export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;
  const AudioCtx = global.window.AudioContext || global.window.webkitAudioContext;
  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  const base = { hypatia: 196, tesla: 329.63, agrippa: 261.63 }[name] || 220;

  const base = { hypatia: 220, tesla: 330 }[name] || 440;
  [base, base * 2].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  });

  ctx.close?.();
}

const soundscape = {
  id: 'soundscape',
  activate(_engine, theme) {
    playSoundscape(theme);
  },
  deactivate() {},
};

export default soundscape;

// Minimal binaural soundscape helper used by tests and examples
const soundscape = {
  id: 'soundscape',
  activate(_engine, theme = 'hypatia') {
    const settings = global.window?.COSMO_SETTINGS || {};
    if (settings.muteAudio) return;

    const AudioCtx = global.window.AudioContext || global.window.webkitAudioContext;
// Minimal soundscape plugin with optional binaural beats
export default {
  id: 'soundscape',
  activate(_engine, opts = {}) {
    if (typeof opts === 'string') opts = { theme: opts };
    const { theme = 'hypatia', binaural = false } = opts;
    if (global.window?.COSMO_SETTINGS?.muteAudio) return;
    const AudioCtx = global.window?.AudioContext;
    if (!AudioCtx) {
      global.window?.alert?.('Web Audio API not supported');
      return;
    }
    const ctx = new AudioCtx();
// Simple binaural soundscape using the Web Audio API
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;

  const AudioCtx = global.window?.AudioContext || global.window?.webkitAudioContext;
  if (!AudioCtx) {
    console.warn('Web Audio API not supported');
    return;
  }

  const ctx = new AudioCtx();
  try {
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const freqs = theme === 'tesla' ? [432, 864] : [220, 440];
    this._osc = freqs.map((f) => {
    const base = theme === 'tesla' ? 432 : 220;
    const freqs = binaural ? [base, base * 2] : [base];
    this._osc = freqs.map(f => {
    const base = theme === 'tesla' ? 432 : 220;
    const freqs = binaural ? [base, base * 2] : [base];
    this._osc = freqs.map(f => {

    const freqs = theme === 'tesla' ? [432, 864] : [220, 440];
    this._osc = freqs.map((f) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(gain);
      osc.start();
      return osc;
    });
    this._ctx = ctx;
  },
  deactivate() {
    this._osc?.forEach((o) => {
    this._osc?.forEach(o => {
    this._osc?.forEach(o => {
    this._osc?.forEach((o) => {
      try { o.stop(); } catch {}
    });
    this._osc = null;
    if (this._ctx) {
      this._ctx.close?.();
      this._ctx = null;
    }
  },
};

export default soundscape;

  const base = name === 'tesla' ? 330 : 220;
  const base = { hypatia: 196, tesla: 329.63, agrippa: 261.63 }[name] || 220;
  [base, base * 2].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  });
    const base = { hypatia: 220, tesla: 330 }[name] || 440;
    [base, base * 2].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    });
    const base = { hypatia: 220, tesla: 330 }[name] || 440;
    [base, base * 2].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    });
    const base = { hypatia: 220, tesla: 330 }[name] || 440;
    [base, base * 2].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    });
  } catch (err) {
    console.error('Failed to initialize soundscape', err);
  } finally {
    ctx.close?.();
  }
}

export default {
  id: 'soundscape',
  activate(_, theme) {
    soundscape(theme);
  },
  deactivate() {}
};
soundscape.activate = function (_engine, theme = 'hypatia') {
  if (global.window?.COSMO_SETTINGS?.muteAudio) return;
  const AudioCtx = global.window.AudioContext || global.window.webkitAudioContext;
// Minimal soundscape generator respecting global mute settings
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;

  const AudioCtx =
    global.window?.AudioContext || global.window?.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.gain.value = 0.1;
  gain.connect(ctx.destination);
  const freqs = theme === 'tesla' ? [432, 864] : [220, 440];
  soundscape._osc = freqs.map((f) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = f;
    osc.connect(gain);
    osc.start();
    return osc;
  });
  soundscape._ctx = ctx;
};

soundscape.deactivate = function () {
  soundscape._osc?.forEach((o) => {
    try {
      o.stop();
    } catch {}
  });
  soundscape._osc = null;
  if (soundscape._ctx) {
    soundscape._ctx.close?.();
    soundscape._ctx = null;
  }
};

}
