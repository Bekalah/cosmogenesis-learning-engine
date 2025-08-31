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

