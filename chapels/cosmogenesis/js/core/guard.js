const bootFlags = new Set();
export function guardBoot(name) {
  if (bootFlags.has(name)) throw new Error(`Guard: ${name} already booted`);
  bootFlags.add(name);
}
