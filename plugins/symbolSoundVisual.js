// Render sigil, tone, geometry, and invocation for a node
export function renderNode(target, node) {
  // Create container
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) return;

  // Canvas sigil
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = node.color || '#fff';
  ctx.lineWidth = 2;
  const r = (node.node_id % 100) + 50;
  ctx.beginPath();
  ctx.arc(128, 128, r / 2, 0, Math.PI * 2);
  ctx.moveTo(128, 128);
  ctx.lineTo(128 + r / 2, 128);
  ctx.stroke();

  // Text invocation
  const text = document.createElement('div');
  text.textContent = node.name || `Node ${node.node_id}`;
  text.style.color = ctx.strokeStyle;
  container.appendChild(text);

  // Soundscape tone
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 200 + node.node_id; // simple mapping
  osc.connect(audioCtx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 1000);

  // Animated sacred geometry
  let angle = 0;
  function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(128, 128);
    ctx.rotate(angle);
    ctx.strokeStyle = ctx.strokeStyle;
    ctx.strokeRect(-r / 4, -r / 4, r / 2, r / 2);
    ctx.restore();
    angle += 0.02;
    requestAnimationFrame(animate);
  }
  animate();
}
