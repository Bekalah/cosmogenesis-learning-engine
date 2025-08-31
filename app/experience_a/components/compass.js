export default function(engine){
  if(window.COSMO_SETTINGS?.muteAudio) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 432;
  gain.gain.value = 0.1;
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.5);
  engine.setConfig({labels:['Monad','Dyad','Triad','Tetrad','Pentad','Hexad','Heptad']}).render();
  window.toast?.('Hypatia hums a perfect fifth.');
}
