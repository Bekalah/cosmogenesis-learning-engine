export default {
  id: 'wikiSummary',
  async activate(engine) {
    const topic = prompt('Enter a Wikipedia topic');
    if (!topic) return;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Topic not found');
      const data = await res.json();
      const labels = data.extract.split(/\.\s+/).filter(Boolean);
      const cfg = Object.assign({}, engine.getConfig ? engine.getConfig() : {}, { labels });
      engine.setConfig(cfg).render();
    } catch (err) {
      alert(err.message);
    }
  },
  deactivate() {}
};
