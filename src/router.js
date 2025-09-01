export default class Router {
  constructor(callback) {
    this.cb = callback;
    window.addEventListener('hashchange', () => this.handle());
    this.handle();
  }
  handle() {
    const hash = location.hash.slice(1);
    const parts = hash.split('/').filter(Boolean);
    let chapelId, nodeId;
    if (parts[0] === 'chapel') {
      chapelId = parts[1];
      if (parts[2] === 'node') nodeId = parts[3];
    }
    this.cb({ chapelId, nodeId });
  }
  static push({ chapelId, nodeId }) {
    const h = chapelId
      ? `#/chapel/${chapelId}${nodeId ? `/node/${nodeId}` : ''}`
      : '#';
    location.hash = h;
  }
}
