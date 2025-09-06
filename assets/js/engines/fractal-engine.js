async function fetchJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetch ${path} ${res.status}`);
  return res.json();
}

async function sha256Hex(text) {
  if (window.crypto && window.crypto.subtle) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  // Fallback (non-cryptographic) to avoid breaking export if subtle is unavailable
  let h = 2166136261; for (let i=0;i<text.length;i++){ h ^= text.charCodeAt(i); h += (h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24); }
  return (h>>>0).toString(16);
}

function nowStamp() {
  const d = new Date();
  const z = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`;
}

function dl(filename, dataUrlOrBlob) {
  const a = document.createElement('a');
  if (typeof dataUrlOrBlob === 'string') a.href = dataUrlOrBlob;
  else a.href = URL.createObjectURL(dataUrlOrBlob);
  a.download = filename; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
}

function drawBackground(ctx, w, h, palette) {
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0, palette[0]); g.addColorStop(1, palette[2] || palette[palette.length-1] || '#111');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
}

function drawSpiral(ctx, w, h, spiralCfg, palette) {
  const cx = w/2, cy = h/2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((spiralCfg.axis_deg || 23.5) * Math.PI/180);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = palette[4] || '#e6e6e6';
  ctx.beginPath();
  const a = spiralCfg.a || 1.0;
  const b = spiralCfg.b || 0.18;
  const tmax = spiralCfg.theta_max || 24.0;
  const pts = spiralCfg.points || 2400;
  const k = Math.min(w,h) * 0.015;
  for (let i=0;i<=pts;i++){
    const t = (i/pts)*tmax;
    const r = a + b*t;
    const x = (r*Math.cos(t))*k;
    const y = (r*Math.sin(t))*k;
    if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawHalos(ctx, w, h, halos, radiusFrac, palette) {
  const cx = w/2, cy = h/2;
  const R = Math.min(w,h) * radiusFrac;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  ctx.strokeStyle = palette[3] || '#5e4ba8';
  for (let i=1;i<=halos;i++){
    const r = (i/halos) * R;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();
  }
  ctx.restore();
}

function drawLadder(ctx, w, h, enabled, vertebrae, thicknessFrac, palette) {
  if (!enabled) return;
  const cx = w/2, cy = h/2;
  const H = Math.min(w,h) * 0.8;
  const top = cy - H/2, bot = cy + H/2;
  const railX = Math.min(w,h) * 0.09;
  ctx.save();
  ctx.strokeStyle = palette[4] || '#e6e6e6';
  ctx.lineWidth = (Math.min(w,h) * thicknessFrac);
  // rails
  ctx.beginPath();
  ctx.moveTo(cx - railX, top); ctx.lineTo(cx - railX, bot);
  ctx.moveTo(cx + railX, top); ctx.lineTo(cx + railX, bot);
  ctx.stroke();
  // rungs
  ctx.lineWidth *= 0.8;
  for (let i=0;i<vertebrae;i++){
    const y = top + (i/(vertebrae-1)) * (bot - top);
    ctx.beginPath();
    ctx.moveTo(cx - railX, y); ctx.lineTo(cx + railX, y); ctx.stroke();
  }
  ctx.restore();
}

function setPlaque(el, {version, paletteId, ladderOn}) {
  el.textContent = `Cosmogenesis • Palette: ${paletteId} • Ladder: ${ladderOn?'On':'Off'} • Version: ${version}`;
}

async function buildProvenance({config, paletteId, ladderOn, canvas}) {
  const stamp = new Date().toISOString();
  const configStr = JSON.stringify(config);
  const digest = await sha256Hex(configStr);
  return {
    project: "Cosmogenesis Learning Engine",
    author: "Rebecca Susan Lemke",
    license: "MIT",
    version: config.version || "0.0.0",
    palette_id: paletteId,
    timestamp: stamp,
    ladder: ladderOn,
    canvas: { width: canvas.width, height: canvas.height },
    hash: { sha256_config: digest }
  };
}

export async function bootCosmogenesis({ prefers }) {
  const canvas = document.getElementById('plate');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const plaque = document.getElementById('plaque');
  const ladderBtn = document.getElementById('ladder-btn');
  const pngBtn = document.getElementById('png-btn');
  const metaBtn = document.getElementById('meta-btn');

  const config = await fetchJSON('./registry/structure.json');
  const palettes = await fetchJSON('./registry/datasets/palettes.core.json');
  const palette = palettes.palettes?.[config.palette_id] || ["#0b0b0b","#111","#222","#5e4ba8","#e6e6e6"];

  let ladderOn = !!config.plate?.ladder?.enabled;

  function renderFrame(t=0) {
    const w = canvas.width, h = canvas.height;
    ctx.save();
    if (!prefers.reducedMotion) {
      const wobblePx = Math.round(Math.sin(t*config.motion.hz) * (canvas.width*config.motion.gentle_wobble));
      ctx.translate(wobblePx, 0);
    }
    drawBackground(ctx, w, h, palette);
    drawSpiral(ctx, w, h, { ...config.plate.spiral, axis_deg: config.plate.axis_deg }, palette);
    drawHalos(ctx, w, h, config.plate.halos, config.plate.halo_radius, palette);
    drawLadder(ctx, w, h, ladderOn, config.plate.ladder.vertebrae, config.plate.ladder.thickness, palette);
    ctx.restore();
  }

  function loop() {
    if (prefers.reducedMotion) { renderFrame(0); return; }
    let start;
    function raf(ts){
      if (!start) start = ts;
      const t = (ts - start)/1000;
      renderFrame(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  setPlaque(plaque, {version: config.version, paletteId: config.palette_id, ladderOn});
  ladderBtn.setAttribute('aria-pressed', String(ladderOn));
  ladderBtn.textContent = `Ladder: ${ladderOn ? 'On' : 'Off'}`;

  ladderBtn.addEventListener('click', () => {
    ladderOn = !ladderOn;
    setPlaque(plaque, {version: config.version, paletteId: config.palette_id, ladderOn});
    ladderBtn.setAttribute('aria-pressed', String(ladderOn));
    ladderBtn.textContent = `Ladder: ${ladderOn ? 'On' : 'Off'}`;
    renderFrame(0);
  });

  pngBtn.addEventListener('click', () => {
    try {
      const url = canvas.toDataURL('image/png');
      dl(`cosmogenesis_plate_${nowStamp()}.png`, url);
    } catch (e) {
      console.error(e);
      alert('PNG export failed.');
    }
  });

  metaBtn.addEventListener('click', async () => {
    try {
      const meta = await buildProvenance({ config, paletteId: config.palette_id, ladderOn, canvas });
      const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
      dl(`cosmogenesis_meta_${nowStamp()}.json`, blob);
    } catch (e) {
      console.error(e);
      alert('META export failed.');
    }
  });

  // first render / loop
  if (prefers.reducedMotion) renderFrame(0); else loop();
}
