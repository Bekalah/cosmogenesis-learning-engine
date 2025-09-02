// Load latest plate and show plaque
(async function(){
  const res = await fetch('../../registry/plates/index.json');
  const data = await res.json();
  const items = data.items || [];
  let latest = items[0];
  if(items.length>1){
    latest = items.reduce((a,b)=> new Date(b.meta.timestamp) > new Date(a.meta.timestamp) ? b : a);
  }
  if(!latest) return;
  const img = document.getElementById('plate');
  img.src = latest.png_path;
  if(latest.dim){
    img.width = latest.dim.w;
    img.height = latest.dim.h;
  }
  const p = document.getElementById('plaque');
  const meta = latest.meta;
  p.textContent = `Axis ${meta.plate.axis_deg}°, Halos ${meta.plate.halos}, Ladder ${meta.plate.ladder.enabled?'ON':'OFF'}, ${meta.timestamp}`;
})();
