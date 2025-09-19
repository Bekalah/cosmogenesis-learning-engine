(async()=>{
(async()=>{
  const themeURL = new URL('../assets/theme.json', import.meta.url);
  const mapURL = new URL('./data.map.json', import.meta.url);
  async function loadJSON(url){
    try{
      if (location.protocol === 'file:') {
        try { const m = await import(url, { assert:{ type:'json' } }); return m.default; } catch {}
      }
      const r = await fetch(url, { cache:'no-store' }); if(!r.ok) throw new Error(r.status);
      return await r.json();
    } catch { return null; }
  }
  const theme = await loadJSON(themeURL.href);
  if(theme?.mural){ document.body.style.setProperty('--mural', `url(${theme.mural})`); document.body.classList.add('has-mural'); }
  const map = await loadJSON(mapURL.href) || { paths:{} };
})();
  async function firstOk(list){ for(const p of list||[]){ try{const h=await fetch(p,{method:'HEAD'}); if(h.ok) return p;}catch{} } return (list||[]).at(-1); }
  const key = (theme?.chapels?.[0]) || 'kabbalah';
  const url = await firstOk(map.paths[key]); const data = url? await fetch(url).then(r=>r.json()).catch(()=>[]) : [];
  const ring = document.getElementById('chapel-ring'); const N = Math.max(6,data.length), R = Math.min(ring.clientWidth, ring.clientHeight)*0.36;
  data.forEach((d,i)=>{ const a=(i/N)*Math.PI*2,x=Math.cos(a)*R,y=Math.sin(a)*R;
    const el=document.createElement('button'); el.style.cssText='position:absolute;left:50%;top:50%;transform-origin:-200px 0;width:110px;aspect-ratio:1;border-radius:50%;border:1px solid #ffffff2e;background:radial-gradient(circle at 50% 30%,#fff2,transparent 60%),conic-gradient(from 0deg,#fff1,transparent 12.5%);color:#8FA1FF';
    el.style.transform=`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    const tint=d.color||'#8FA1FF'; el.style.boxShadow=`0 0 0 1px #ffffff14 inset,0 10px 34px #00000059, 0 0 34px ${tint}55`;
    el.innerHTML=`<div style="position:absolute;bottom:8px;width:100%;text-align:center;font-size:.8rem;opacity:.9">${d.name||d.alias||d.hz||d.ratio||d.id}</div>`;
    ring.appendChild(el);
  });
})();
