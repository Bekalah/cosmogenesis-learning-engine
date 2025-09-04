// ✦ Codex 144:99 — preserve original intention

/**
 * Jacob's Ladder utilities for the 33-node spine.
 * Provides deterministic geometry helpers for spiral and ring layouts,
 * and a simple label mapper.
 */

// Compute positions along a spiral between inner and outer radii
export function spiralPositions({ rInner = 60, rOuter = 440, turns = 3, phase = 0, count = 33 } = {}) {
  const pts = [];
  const totalAngle = turns * Math.PI * 2;
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1, count - 1);
    const angle = phase + t * totalAngle;
    const radius = rInner + t * (rOuter - rInner);
    pts.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }
  return pts;
}

// Compute positions around a ring of given radius
export function ringPositions({ radius = 240, phase = 0, count = 33 } = {}) {
  const pts = [];
  const step = (Math.PI * 2) / count;
  for (let i = 0; i < count; i++) {
    const angle = phase + i * step;
    pts.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }
  return pts;
}

// Map provided labels to count, defaulting to 1..N
export function labelMapper(labels = [], count = 33) {
  return Array.from({ length: count }, (_, i) => String(labels[i] ?? i + 1));
}

