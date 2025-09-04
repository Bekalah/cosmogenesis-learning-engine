// overlay-relief.js
// Render Rosslyn cube tracery based on ambient tone frequency.

import cubesData from '../../assets/data/cubes.json' assert { type: 'json' };

// Find cube mapping for the given tone frequency (supports exact or range match).
export function getCubeByFrequency(hz) {
  return cubesData.cubes.find(c => {
    if (typeof c.toneHz === 'number') return c.toneHz === hz;
    if (c.range) {
      const [min, max] = c.range;
      return hz >= min && hz <= max;
    }
    return false;
  });
}

// Draw the cube overlay onto a canvas context if mapping is found.
export function renderCubeOverlay(ctx, hz) {
  const cube = getCubeByFrequency(hz);
  if (!cube) return;
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  img.src = cube.overlay;
}
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
