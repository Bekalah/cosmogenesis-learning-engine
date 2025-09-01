// Expose prefers-reduced-motion state
window.prefers = {
  get reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};
