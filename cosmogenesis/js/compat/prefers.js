function mq(q) {
  try { return window.matchMedia ? window.matchMedia(q).matches : false; }
  catch { return false; }
}
export const prefers = {
  reducedMotion: mq('(prefers-reduced-motion: reduce)'),
  dark: mq('(prefers-color-scheme: dark)'),
};
