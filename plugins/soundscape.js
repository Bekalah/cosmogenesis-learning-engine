// Ambient soundscapes honoring realm archetypes
export default function soundscape(name) {
  const settings = global.window?.COSMO_SETTINGS || {};
  if (settings.muteAudio) return;

  const AudioCtx = global.window.AudioContext || global.window.webkitAudioContext;
  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  const base = name === 'tesla' ? 330 : 220;
  [base, base * 2].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  });
}
