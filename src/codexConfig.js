// Codex configuration with one-time initialization and lock
let locked = false;
export const cfg = {};

export function initCodex(settings = {}) {
  if (locked) {
    throw new Error("Codex configuration is locked");
  }
  Object.assign(cfg, settings);
  Object.freeze(cfg);
  locked = true;
}

export function isLocked() {
  return locked;
}
