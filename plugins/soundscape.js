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
