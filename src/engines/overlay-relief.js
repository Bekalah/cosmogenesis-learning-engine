import { loadImage } from 'canvas';
import cubes from '../../data/cubes.json' assert { type: 'json' };

// Find the cube definition with a tone closest to the provided frequency
export function findCubeByHz(hz) {
  let best = null;
  let bestDiff = Infinity;
  for (const cube of cubes) {
    const diff = Math.abs(hz - cube.toneHz);
    if (diff < bestDiff) {
      best = cube;
      bestDiff = diff;
    }
  }
  return best;
}

// Render the matching cube overlay onto a canvas context
export async function renderOverlay(ctx, hz) {
  const cube = findCubeByHz(hz);
  if (!cube || !cube.overlay) return;
  try {
    const img = await loadImage(cube.overlay);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  } catch {
    // ignore missing overlay assets
  }
}

export default { findCubeByHz, renderOverlay };
