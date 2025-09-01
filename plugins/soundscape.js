// Simple binaural soundscape using the Web Audio API
export default function soundscape(){
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if(!AudioCtx){
    alert('Web Audio API not supported');
    return;
  }
  const ctx = new AudioCtx();
  const oscL = ctx.createOscillator();
  const oscR = ctx.createOscillator();
  const merger = ctx.createChannelMerger(2);

  oscL.frequency.value = 440; // left ear frequency
  oscR.frequency.value = 446; // right ear slightly higher for binaural beat
  oscL.connect(merger,0,0);
  oscR.connect(merger,0,1);
  merger.connect(ctx.destination);
  oscL.start();
  oscR.start();

  return {
    stop(){
      oscL.stop();
      oscR.stop();
      ctx.close();
    }
  };
}
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
// Ambient soundscapes honoring realm archetypes
export default function soundscape(realm){
  // Respect global mute setting for neurodivergent care
  if(window.COSMO_SETTINGS?.muteAudio) return;

  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Tone pairs inspired by each visionary realm
  const tones = {
    hypatia: [196.0, 392.0],              // Hypatia's Library – contemplative hum
    tesla: [329.63, 659.25],              // Tesla's Workshop – electric overtones
    agrippa: [261.63, 523.25],            // Agrippa's Study – occult resonance
    'alexandrian-scriptorium': [440.0]    // Sappho's Chord – lyric center
  };
  const freqs = tones[realm] || [220.0];  // Default tonic if realm unknown

  // Layer gentle oscillators for a balanced chord
  freqs.forEach((f, idx)=>{
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f;
    gain.gain.value = 0.03 / freqs.length;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2 + idx);
  });
}
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;

  const ctx = new window.AudioContext();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  const base = { hypatia: 220, tesla: 330 }[name] || 440;
  [base, base * 2].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  });
}

