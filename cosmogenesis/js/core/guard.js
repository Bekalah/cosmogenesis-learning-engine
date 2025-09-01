// Simple guard to prevent multiple boots
if (window.__COSMOGENESIS_GUARD__) {
  throw new Error('Cosmogenesis already initialized');
}
window.__COSMOGENESIS_GUARD__ = true;
