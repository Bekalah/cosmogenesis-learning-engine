/*
  executors.js
  Offline geometry executor table for the cosmogenesis learning engine.

  Each executor is a small pure function that returns configuration data.
  Consumers may merge overrides to tailor layer-specific rendering while
  staying inside the ND-safe covenant (no motion, no network, layered depth).
*/

const NUM = Object.freeze({
  THREE: 3,
  SEVEN: 7,
  NINE: 9,
  ELEVEN: 11,
  TWENTYTWO: 22,
  THIRTYTHREE: 33,
  NINETYNINE: 99,
  ONEFORTYFOUR: 144
});

const executors = Object.freeze({
  vesicaGrid: () => ({
    id: "vesicaGrid",
    layer: 1,
    description: "Intersecting circle lattice sized by 3-7-11 cadences.",
    geometry: {
      rows: NUM.NINE,
      columns: NUM.ELEVEN,
      paddingDivisor: NUM.ELEVEN,
      radiusScale: NUM.SEVEN / NUM.THIRTYTHREE,
      strokeDivisor: NUM.NINETYNINE,
      alpha: 0.55
    }
  }),
  treeOfLife: () => ({
    id: "treeOfLife",
    layer: 2,
    description: "Ten sephirot and twenty-two paths spanning the three pillars.",
    geometry: {
      marginDivisor: NUM.ELEVEN,
      radiusDivisor: NUM.THIRTYTHREE,
      pathDivisor: NUM.NINETYNINE,
      nodeAlpha: 0.88,
      pathAlpha: 0.62,
      labelAlpha: 0.7
    }
  }),
  fibonacciSpiral: () => ({
    id: "fibonacciSpiral",
    layer: 3,
    description: "Logarithmic spiral grown from phi with quarter-turn markers.",
    geometry: {
      sampleCount: NUM.ONEFORTYFOUR,
      turns: NUM.THREE,
      baseRadiusDivisor: NUM.TWENTYTWO,
      centerXFactor: 0.34,
      centerYFactor: 0.58,
      phi: 1.61803398875,
      markerInterval: NUM.ELEVEN,
      alpha: 0.85
    }
  }),
  helixLattice: () => ({
    id: "helixLattice",
    layer: 4,
    description: "Double helix lattice with thirty-three cross ties and no motion.",
    geometry: {
      sampleCount: NUM.ONEFORTYFOUR,
      cycles: NUM.THREE,
      amplitudeDivisor: NUM.NINE,
      strandSeparationDivisor: NUM.THIRTYTHREE,
      crossTieCount: NUM.THIRTYTHREE,
      strandAlpha: 0.82,
      rungAlpha: 0.6
    }
  })
});

export const registryVersion = "0.1.0";

export function listExecutors() {
  return Object.keys(executors);
}

export function getExecutor(name) {
  return executors[name] || null;
}

export function runExecutor(name, overrides = {}) {
  const base = executors[name];
  if (!base) {
    return { ok: false, reason: "unknown-executor" };
  }
  const payload = base();
  return {
    ok: true,
    payload: {
      ...payload,
      geometry: {
        ...payload.geometry,
        ...overrides
      }
    }
  };
}
