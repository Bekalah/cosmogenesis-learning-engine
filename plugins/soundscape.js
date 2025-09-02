export default {
  id: 'soundscape',
  activate(_engine, theme = 'hypatia') {
    if (window.COSMO_SETTINGS?.muteAudio) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const gain = ctx.createGain();
    gain.gain.value = 0.1;
    gain.connect(ctx.destination);

    const freqs = theme === 'tesla' ? [432, 864] : [220, 440];
    this._osc = freqs.map(f => {
      const osc = ctx.createOscillator();
      osc.frequency.value = f;
      osc.connect(gain).start();
      return osc;
    });
    this._ctx = ctx;
  },
  deactivate() {
    this._osc?.forEach(o => { try { o.stop(); } catch {} });
    this._osc = null;
    if (this._ctx) {
      this._ctx.close?.();
      this._ctx = null;
    }
  }
};
