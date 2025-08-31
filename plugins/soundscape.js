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
