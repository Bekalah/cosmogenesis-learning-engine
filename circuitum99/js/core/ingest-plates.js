// Fetch plate sources and build registry cards
(async function(){
  const grid = document.getElementById('grid');
  let sources = [];
  try{
    sources = await fetch('registry/sources/plates.json').then(r=>r.json());
  }catch(e){
    console.warn('sources fetch failed',e);
    return;
  }
  for(const src of sources){
    const card = document.createElement('div');
    card.className = 'card';
    const img = new Image();
    img.src = src.png;
    card.appendChild(img);
    const p = document.createElement('p');
    try{
      const meta = await fetch(src.meta).then(r=>r.json());
      p.textContent = `Axis ${meta.plate.axis_deg}°, Halos ${meta.plate.halos}, Ladder ${meta.plate.ladder.enabled?'ON':'OFF'}, ${meta.timestamp}`;
    }catch(err){
      p.textContent = 'metadata unavailable';
    }
    card.appendChild(p);
    grid.appendChild(card);
  }
})();
