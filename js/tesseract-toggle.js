/*
  tesseract-toggle.js
  Central toggle state for trauma-informed controls.
  Helix renderer stays disabled to ensure only the octagram tesseract system runs.
*/

export const disable = new Set(["helix_renderer"]);

export const intensitySlider = {
  enabled: true,
  min: 0,
  max: 1,
  step: 0.11,
  default: 0.33
};

export function isDisabled(id) {
  return disable.has(id);
}

export function safeStop(reason = "user requested") {
  return { stopped: true, reason };
}
