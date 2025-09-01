export async function exportPlate({ skin, nodeId, provenanceRefs, out }) {
  const { width, format } = out;
  if (width < 3840) throw new Error('4K or greater required');
  if (!provenanceRefs || provenanceRefs.some(p => !p.title || !p.creator || !p.year || !p.license || !p.source)) {
    throw new Error('Provenance Required');
  }
  const canvas = document.getElementById('stage');
  const scale = width / canvas.width;
  const off = document.createElement('canvas');
  off.width = width;
  off.height = canvas.height * scale + 40;
  const ctx = off.getContext('2d');
  ctx.drawImage(canvas, 0, 0, width, canvas.height * scale);
  const caption = provenanceRefs.map(p => `${p.title} • ${p.creator} • ${p.year} • ${p.license} • ${p.source}`).join(' | ');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, off.height - 40, off.width, 40);
  ctx.fillStyle = '#fff';
  ctx.font = '20px system-ui';
  ctx.fillText(caption, 10, off.height - 15);
  const blob = await new Promise(res => off.toBlob(res, `image/${format}`));
  const jsonSidecar = { nodeId, skin, provenance: provenanceRefs };
  return { blob, caption, jsonSidecar };
}
