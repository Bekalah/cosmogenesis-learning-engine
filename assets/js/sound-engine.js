// ND-Friendly Sound Engine (extended for atmosphere.json)
import tracks from "../sound/atmosphere.json" assert { type: "json" };

export class Atmosphere {
  constructor(ctx = new (window.AudioContext || window.webkitAudioContext)()) {
    this.ctx = ctx;
    this.current = null;
  }

  async play(trackId) {
    const track = tracks.tracks.find(t => t.id === trackId);
    if (!track) throw new Error("Track not found: " + trackId);

    const response = await fetch(track.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

    const source = this.ctx.createBufferSource();
    source.buffer = audioBuffer;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.6; // gentle volume for background

    source.connect(gain).connect(this.ctx.destination);
    source.start();

    this.current = { source, track };
  }

  stop() {
    if (this.current?.source) {
      this.current.source.stop();
      this.current = null;
    }
  }
}