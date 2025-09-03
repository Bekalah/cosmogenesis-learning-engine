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
    const gain = ctx.createGain();
    gain.gain.value = 0.1;
    gain.connect(ctx.destination);
    const base = theme === 'tesla' ? 432 : 220;
    const freqs = binaural ? [base, base * 2] : [base];
    this._osc = freqs.map(f => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(gain);
      osc.start();
      return osc;
    });
    this._ctx = ctx;
  },
  deactivate() {
    this._osc?.forEach(o => {
      try { o.stop(); } catch {}
    });
    this._osc = null;
    if (this._ctx) {
      this._ctx.close?.();
      this._ctx = null;
    }
  }
};
