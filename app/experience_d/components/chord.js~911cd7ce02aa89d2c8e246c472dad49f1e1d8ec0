export default function(engine){
  if(!window.COSMO_SETTINGS?.muteAudio){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = [261.63, 329.63, 392.00];
    freqs.forEach(f=>{
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = f;
      gain.gain.value = 0.05;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    });
  }
  engine.setConfig({labels:['Sappho','Scroll','Lyre','Muse','Sea','Flame','Memory']}).render();
  window.toast?.('Sapphic chords linger in the scriptorium.');
}
