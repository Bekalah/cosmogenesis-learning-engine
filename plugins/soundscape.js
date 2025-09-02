// Minimal soundscape plugin using the Web Audio API

export function playSoundscape(theme = 'hypatia') {
  const settings = globalThis.window?.COSMO_SETTINGS;
  if (settings?.muteAudio) return;

  const AudioCtx = globalThis.window?.AudioContext || globalThis.window?.webkitAudioContext;
  if (!AudioCtx) {
    globalThis.alert?.('Web Audio API not supported');
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

