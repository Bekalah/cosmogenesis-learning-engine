export function renderPlate(config) {
  // Generate Archimedean spiral points (logic mirror of browser engine)
  const pts = [];
  const s = config.plate.spiral || { a:1, b:0.18, theta_max: 12, points: 600 };
  const k = 10; // arbitrary scale for test context
  for (let i=0;i<=s.points;i++){
    const t = (i/s.points) * s.theta_max;
    const r = s.a + s.b*t;
    pts.push([ (r*Math.cos(t))*k, (r*Math.sin(t))*k ]);
  if (
    !config ||
    typeof config.layout !== "string" ||
    typeof config.mode !== "number" ||
    !Array.isArray(config.labels)
  ) {
    throw new Error("Invalid plate configuration");
  }
  if (config.labels.length !== config.mode) {
    throw new Error("Label count must match mode");
  }

  const layouts = {
    spiral: spiralPositions,
    "twin-cone": twinConePositions,
    wheel: wheelPositions,
    grid: gridPositions,
  };

  const create = layouts[config.layout];
  if (!create) {
    throw new Error(`Unsupported layout: ${config.layout}`);
  }

  const positions = create(config.mode);
  const items = config.labels.map((text, i) => ({ text, ...positions[i] }));

  function exportAsJSON() {
    return JSON.stringify(config, null, 2);
  }

  function exportAsSVG() {
    const size = 500;
    const center = size / 2;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`;
    items.forEach(({ text, x, y }) => {
      svg += `<text x="${center + x}" y="${center + y}" text-anchor="middle" dominant-baseline="central">${text}</text>`;
    });
    svg += "</svg>";
    return svg;
  }

  function exportAsPNG() {
    return Buffer.from(exportAsSVG());
  }
  return { points: pts };
}
