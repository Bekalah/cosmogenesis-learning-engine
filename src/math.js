// Simple pure utilities used for demonstration tests. If your project already
// has equivalents, feel free to replace this with imports of your actual modules.
export function sum(a, b) {
  const na = Number(a);
  const nb = Number(b);
  if (Number.isNaN(na) || Number.isNaN(nb)) throw new TypeError('sum expects numeric inputs');
  return na + nb;
}

export function clamp(value, min, max) {
  if (min > max) [min, max] = [max, min];
  if (value < min) return min;
  if (value > max) return max;
  return value;
}