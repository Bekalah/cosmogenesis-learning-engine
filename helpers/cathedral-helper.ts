// Feature flags for cathedral components.
// ND-safe defaults: audio gated, contrast enforcement optional.
export const FEATURES = {
  gatedAudio: true,
  enforceContrast: false
};

export function playTone(hz: number, durationMs = 500) {
  if (!FEATURES.gatedAudio) return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = hz;
  osc.connect(ctx.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, durationMs);
}
