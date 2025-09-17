const cacheMode = { cache: 'no-store' };
const loadPartial = async (path) => {
  try { const res = await fetch(path, cacheMode); if (!res.ok) throw new Error(res.statusText); return await res.text(); }
  catch (err) { console.warn('Cathedral inject failed for', path, err); return null; }
};
const appendHTML = (target, html) => { if (!html) return false; const tpl = document.createElement('template'); tpl.innerHTML = html.trim(); target.appendChild(tpl.content); return true; };
(async () => {
  const headOK = await loadPartial('/codex/inject.cathedral.html').then((html) => appendHTML(document.head, html));
  const slot = document.querySelector('#demo-list');
  const medOK = slot ? await loadPartial('/codex/inject.medallions.html').then((html) => appendHTML(slot, html)) : false;
  document.dispatchEvent(new CustomEvent('cathedral:ready', { detail: { headOK, medOK } }));
})();
