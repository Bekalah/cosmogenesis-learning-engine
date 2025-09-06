export function renderPlate(config) {
  if (!config || typeof config.layout !== 'string') {
    throw new Error('Invalid plate configuration');
  }
  const items = (config.labels || []).map((text, i) => ({ text, x: i, y: i }));
  const points = items.map(({ x, y }) => [x, y]);
  return { layout: config.layout, labels: config.labels, items, points };
}
