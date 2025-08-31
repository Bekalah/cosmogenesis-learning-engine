/*
  Cymatics Bridge -- Audio→Data interface for visuals (ESM, zero build)
  Cosmogenesis / Stone-Grimoire · ND-safe (no autoplay), mobile-friendly.

  WHAT THIS FILE DOES
  • Listens to any audio source (linked streams, local files, oscillators, or an external WebAudio node).
  • Analyzes sound in realtime (FFT) and gives you clean, normalized numbers every animation frame.
  • You subscribe with onFrame(({ rms, peak, bands, spectrum, waveform, time })) and drive your visuals.
  • Optional helper to produce a THREE.DataTexture so shaders can sample the spectrum/waveform.

  PUBLIC API (all returned on create)
    await createCymaticsBridge(options?)  →  bridge
      bridge.loadTrack(url)               // fetch & prepare a streaming track (no play yet)
      bridge.play()                       // start playback of loaded track or resume context
      bridge.stop()                       // stop any current track
      bridge.setVolume(0..1)              // master volume
      bridge.playTone({ hz, gain, type }) // tone generator (sine default); returns void
      bridge.stopTone()
      bridge.connectExternalSource(node)  // connect your own AudioNode as input
      bridge.onFrame(callback)            // subscribe to analysis frames (~60 fps)
      bridge.start()                      // start the analysis loop
      bridge.stopLoop()                   // stop the analysis loop
      bridge.destroy()                    // tear down nodes and event listeners
      bridge.makeThreeDataTexture(kind)   // "spectrum"|"waveform"→ THREE.DataTexture or null

  OPTIONS (all optional)
    {
      fftSize: 2048,          // power of two, 256..16384
      smoothing: 0.86,        // 0..0.99 analyser smoothing
      bands: {                // frequency bands in Hz (tune for your content)
        low:  [20, 200],
        mid:  [200, 2000],
        high: [2000, 16000]
      },
      autoGainDecay: 0.995    // how fast normalization envelopes decay (0.97..0.999)
    }

  ND-SAFETY
  • No autoplay. You must call play() or playTone() after a user gesture.
  • iOS/SAFARI: we attach a one-time resume handler on pointerdown/keydown.

  LICENSE
  • MIT for code. Ensure linked audio obeys its own license (e.g., Pixabay, FMA).
*/

export async function createCymaticsBridge(options = {}) {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) throw new Error("Web Audio API not supported.");

  // ---- Config --------------------------------------------------------------
  const cfg = {
    fftSize: clampPow2(options.fftSize ?? 2048, 256, 16384),
    smoothing: clamp(options.smoothing ?? 0.86, 0, 0.99),
    bands: {
      low:  toPair(options.bands?.low,  [20, 200]),
      mid:  toPair(options.bands?.mid,  [200, 2000]),
      high: toPair(options.bands?.high, [2000, 16000])
    },
    autoGainDecay: clamp(options.autoGainDecay ?? 0.995, 0.9, 0.9999)
  };

  // ---- Core graph ----------------------------------------------------------
  const ctx = new AC();
  const master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);

  // Single analysis chain shared by all sources
  const inputBus = ctx.createGain(); inputBus.gain.value = 1.0; inputBus.connect(master);

  const analyser = ctx.createAnalyser();
  analyser.fftSize = cfg.fftSize;
  analyser.smoothingTimeConstant = cfg.smoothing;
  inputBus.connect(analyser);

  // State holders
  let mediaBuffer = null;     // AudioBuffer for fully-decoded tracks (if we choose decode route)
  let bufferSource = null;    // AudioBufferSourceNode
  let mediaEl = null;         // <audio> element for remote/CORS streams
  let mediaElSource = null;   // MediaElementSourceNode
  let osc = null;             // OscillatorNode
  let externalNode = null;    // externally supplied AudioNode
  let connectedRoute = null;  // which route is currently connected to inputBus

  // Analysis data buffers
  const N = analyser.frequencyBinCount;         // half fft
  const spectrumU8 = new Uint8Array(N);         // 0..255
  const waveformU8 = new Uint8Array(N);         // 0..255
  const spectrum = new Float32Array(N);         // 0..1 normalized
  const waveform = new Float32Array(N);         // -1..1

  // Normalization envelopes
  let envPeak = 0.0001;
  let envLow = 0.0001, envMid = 0.0001, envHigh = 0.0001;

  // Band bin ranges (computed once per sampleRate/fftSize)
  let binRange = computeBinRanges(ctx.sampleRate, analyser.fftSize, cfg.bands);

  // Resume on user gesture (iOS)
  const resume = () => { if (ctx.state === "suspended") ctx.resume(); window.removeEventListener("pointerdown", resume); window.removeEventListener("keydown", resume); };
  window.addEventListener("pointerdown", resume, { passive: true });
  window.addEventListener("keydown", resume);

  // ---- Frame loop ----------------------------------------------------------
  const listeners = new Set();
  let raf = 0;
  let t0 = performance.now();

  function pump(ts) {
    const time = (ts - t0) / 1000;

    // Pull analyser data
    analyser.getByteFrequencyData(spectrumU8);
    analyser.getByteTimeDomainData(waveformU8);

    // Normalize to floats
    for (let i = 0; i < N; i++) {
      spectrum[i] = spectrumU8[i] / 255;        // 0..1
      waveform[i] = (waveformU8[i] - 128) / 128; // -1..1
    }

    // Compute RMS and peak in time domain
    let sumSq = 0, peak = 0;
    for (let i = 0; i < N; i++) {
      const v = waveform[i];
      sumSq += v * v;
      const a = Math.abs(v);
      if (a > peak) peak = a;
    }
    const rms = Math.sqrt(sumSq / N);

    // Band energies from frequency domain
    const low = bandEnergy(spectrum, binRange.low);
    const mid = bandEnergy(spectrum, binRange.mid);
    const high = bandEnergy(spectrum, binRange.high);

    // Auto-gain normalization (slowly decaying maxima)
    envPeak = Math.max(peak, envPeak * cfg.autoGainDecay);
    envLow  = Math.max(low,  envLow  * cfg.autoGainDecay);
    envMid  = Math.max(mid,  envMid  * cfg.autoGainDecay);
    envHigh = Math.max(high, envHigh * cfg.autoGainDecay);

    const out = {
      time,
      rms:  safeDiv(rms,  envPeak),          // 0..1 approx
      peak: safeDiv(peak, envPeak),          // 0..1
      bands: {
        low:  safeDiv(low,  envLow),
        mid:  safeDiv(mid,  envMid),
        high: safeDiv(high, envHigh)
      },
      spectrum,  // Float32Array (0..1), same reference each frame
      waveform   // Float32Array (-1..1), same reference each frame
    };

    // Notify subscribers
    listeners.forEach(fn => {
      try { fn(out); } catch (e) { /* swallow to keep loop alive */ }
    });

    raf = requestAnimationFrame(pump);
  }

  // ---- Connection helpers --------------------------------------------------
  function connect(node) {
    if (connectedRoute === node) return;
    disconnectAll();
    node.connect(inputBus);
    connectedRoute = node;
  }
  function disconnectAll() {
    try { bufferSource?.disconnect(); } catch {}
    try { mediaElSource?.disconnect(); } catch {}
    try { osc?.disconnect(); } catch {}
    try { externalNode?.disconnect?.(); } catch {}
    connectedRoute = null;
  }
  function stopAllSources() {
    try { bufferSource?.stop(); } catch {}
    try { mediaEl?.pause?.(); } catch {}
    try { osc?.stop?.(); } catch {}
    bufferSource = null;
    mediaElSource = null;
    osc = null;
  }

  // ---- Public API ----------------------------------------------------------
  async function loadTrack(url) {
    // Prefer <audio> element route for remote (CORS) streaming to reduce memory
    // It also supports unknown MIME types better than manual decode.
    destroyMediaElement();
    mediaEl = new Audio(url);
    mediaEl.crossOrigin = "anonymous";
    mediaEl.loop = true;
    mediaEl.preload = "auto";
    mediaEl.controls = false;

    // Wire to graph
    mediaElSource = ctx.createMediaElementSource(mediaEl);
    connect(mediaElSource);
    return true;
  }

  async function play() {
    if (ctx.state === "suspended") await ctx.resume();
    if (mediaEl) {
      await mediaEl.play().catch(() => {/* user gesture required until resumed */});
      return;
    }
    if (bufferSource && !mediaEl) {
      // If someone loaded a decoded buffer route later, start it
      try { bufferSource.start(); } catch {}
      return;
    }
    // Nothing to play yet; no-op
  }

  async function stop() {
    if (mediaEl) { try { mediaEl.pause(); mediaEl.currentTime = 0; } catch {} }
    stopAllSources();
  }

  function setVolume(v = 0.6) {
    master.gain.value = clamp(v, 0, 1);
  }

  async function playTone({ hz = 432, gain = 0.12, type = "sine" } = {}) {
    if (ctx.state === "suspended") await ctx.resume();
    stopAllSources();
    osc = ctx.createOscillator();
    const g = ctx.createGain(); g.gain.value = clamp(gain, 0, 1);
    osc.type = type; osc.frequency.value = clamp(hz, 20, 20000);
    osc.connect(g); g.connect(inputBus);
    osc.start();
    connectedRoute = g;
  }

  function stopTone() {
    if (!osc) return;
    try { osc.stop(); } catch {}
    try { osc.disconnect(); } catch {}
    osc = null;
  }

  function connectExternalSource(node) {
    // Caller owns lifecycle; we only connect/disconnect
    externalNode = node;
    connect(externalNode);
  }

  function onFrame(cb) {
    if (typeof cb === "function") listeners.add(cb);
    return () => listeners.delete(cb);
  }

  async function start() {
    if (!raf) raf = requestAnimationFrame(pump);
  }

  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function destroy() {
    stopLoop();
    stopAllSources();
    disconnectAll();
    destroyMediaElement();
    window.removeEventListener("pointerdown", resume);
    window.removeEventListener("keydown", resume);
    try { ctx.close(); } catch {}
  }

  function makeThreeDataTexture(kind = "spectrum") {
    // Optional: if THREE is present, return a DataTexture for shaders
    const THREE = globalThis.THREE;
    if (!THREE || !THREE.DataTexture) return null;

    const src = kind === "waveform" ? waveform : spectrum;
    // Pack into Uint8 for texture
    const data = new Uint8Array(src.length);
    if (kind === "waveform") {
      for (let i = 0; i < src.length; i++) data[i] = clampInt(((src[i] + 1) * 0.5) * 255, 0, 255);
    } else {
      for (let i = 0; i < src.length; i++) data[i] = clampInt(src[i] * 255, 0, 255);
    }
    const tex = new THREE.DataTexture(data, src.length, 1, THREE.LuminanceFormat);
    tex.needsUpdate = true;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // ---- Utilities -----------------------------------------------------------
  function destroyMediaElement() {
    if (!mediaEl) return;
    try { mediaEl.pause(); } catch {}
    try { mediaEl.srcObject = null; } catch {}
    try { mediaEl.remove(); } catch {}
    mediaEl = null;
  }

  function recomputeBins() {
    analyser.fftSize = cfg.fftSize = clampPow2(cfg.fftSize, 256, 16384);
    analyser.smoothingTimeConstant = cfg.smoothing;
    binRange = computeBinRanges(ctx.sampleRate, analyser.fftSize, cfg.bands);
  }

  // Return the bridge
  return {
    // playback
    loadTrack, play, stop, setVolume,
    playTone, stopTone,
    connectExternalSource,
    // analysis loop
    onFrame, start, stopLoop,
    // lifecycle
    destroy,
    // optional three helper
    makeThreeDataTexture,
    // expose config tweaks (if you want to retune at runtime)
    setSmoothing(v) { cfg.smoothing = clamp(v, 0, 0.99); analyser.smoothingTimeConstant = cfg.smoothing; },
    setFFT(n) { cfg.fftSize = clampPow2(n, 256, 16384); recomputeBins(); },
    setBands(next = {}) {
      if (next.low)  cfg.bands.low  = toPair(next.low,  cfg.bands.low);
      if (next.mid)  cfg.bands.mid  = toPair(next.mid,  cfg.bands.mid);
      if (next.high) cfg.bands.high = toPair(next.high, cfg.bands.high);
      recomputeBins();
    }
  };

  // ---- math helpers --------------------------------------------------------
  function safeDiv(a, b) { return b > 1e-6 ? clamp(a / b, 0, 1) : 0; }

  function bandEnergy(arr, [lo, hi]) {
    let sum = 0, count = 0;
    for (let i = lo; i <= hi; i++) { sum += arr[i] || 0; count++; }
    return count ? (sum / count) : 0;
  }

  function computeBinRanges(sampleRate, fftSize, bandsHz) {
    const hzPerBin = sampleRate / fftSize;
    const toBin = (hz) => clampInt(Math.round(hz / hzPerBin), 0, analyser.frequencyBinCount - 1);
    return {
      low:  [toBin(bandsHz.low[0]),  toBin(bandsHz.low[1])],
      mid:  [toBin(bandsHz.mid[0]),  toBin(bandsHz.mid[1])],
      high: [toBin(bandsHz.high[0]), toBin(bandsHz.high[1])]
    };
  }
}

// ---- tiny utils ------------------------------------------------------------
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
function clampInt(n, lo, hi) { return Math.max(lo, Math.min(hi, n | 0)); }
function isPow2(n) { return n && (n & (n - 1)) === 0; }
function clampPow2(n, lo, hi) {
  // force to nearest power-of-two within [lo, hi]
  let x = n | 0;
  if (!isPow2(x)) x = 1 << Math.round(Math.log2(Math.max(2, x)));
  return clamp(x, lo, hi);
}
function toPair(v, def) {
  if (!v) return def.slice();
  if (Array.isArray(v) && v.length === 2) return [Number(v[0]), Number(v[1])];
  return def.slice();
}