export function playSoundscape(theme = 'hypatia') {
  const settings = global.window?.COSMO_SETTINGS;
  if (settings?.muteAudio) return;
  const AudioCtx = global.window?.AudioContext;
  if (!AudioCtx) {
    global.window?.alert?.('Web Audio API not supported');
    return;
  }
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  osc.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
  ctx.close?.();
}

const soundscape = {
  id: 'soundscape',
  activate(_engine, opts = {}) {
    if (typeof opts === 'string') opts = { theme: opts };
    playSoundscape(opts.theme);
  },
  deactivate() {},
};

export default soundscape;
