// Simple binaural soundscape using the Web Audio API
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;
  const AudioCtx = global.window.AudioContext || global.window.webkitAudioContext;
  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  const base = { hypatia: 196, tesla: 329.63, agrippa: 261.63 }[name] || 220;
  [base, base * 2].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  });
}

soundscape.activate = function (_engine, theme = 'hypatia') {
  if (global.window?.COSMO_SETTINGS?.muteAudio) return;
  const AudioCtx = global.window.AudioContext || global.window.webkitAudioContext;
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

