export default function(engine){
  if(!window.COSMO_SETTINGS?.muteAudio){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 110;
    gain.gain.value = 0.1;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  }
  engine.setConfig({labels:['Spark','Coil','Dynamo','Resonance','Voltage','Arc','Light']}).render();
  window.toast?.('Tesla smiles as sparks fly.');
}
