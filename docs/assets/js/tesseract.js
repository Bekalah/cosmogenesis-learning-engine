(async function(){
  const cube = document.getElementById('cube');
  const modeBtns = Array.from(document.querySelectorAll('button[data-mode]'));
  const note = document.getElementById('modeNote');
  const skinSel = document.getElementById('skinSel');
  const caption = document.getElementById('caption');
  const spirit = document.getElementById('spirit');

  // Paths for GitHub Pages (/docs is the web root)
  const manifest = await fetch('/tesseract/data/manifest.json').then(r=>r.json()).catch(()=>null);
  const skinsIds = (manifest?.tarot_skins||[]).map(s=>s.id);
  const skins = {};
  for (const id of skinsIds){
    try { skins[id] = await fetch(`/tesseract/skins/${id}.json`).then(r=>r.json()); } catch(e){}
  }

  // Populate skin select
  (manifest?.tarot_skins||[]).forEach(s=>{
    const o=document.createElement('option'); o.value=s.id; o.textContent=s.label; skinSel.appendChild(o);
  });

  function applySkin(){
    const id = skinSel.value || (manifest?.tarot_skins?.[0]?.id);
    const skin = skins[id]; if(!skin) return;
    document.body.style.setProperty('--bg', skin.palette?.bg||'');
    document.body.style.setProperty('--fg', skin.palette?.fg||'');
    document.body.style.setProperty('--accent', skin.palette?.accent||'');
    // face labels
    const L = skin.labels||{};
    const set = (q, text)=>{ const el=document.querySelector(q+' .label'); if(el) el.textContent=text||el.textContent; };
    set('#f1', L.major||'Major');
    set('#f2', L.wands||'Wands');
    set('#f3', L.cups||'Cups');
    set('#f4', L.swords||'Swords');
    set('#f5', L.pentacles||'Pentacles');
    set('#f6', 'Liber Seal');
    caption.textContent = `Skin: ${skin.label} — study palette only; no animations added.`;
  }

  function setMode(m){
    modeBtns.forEach(b=>{
      const on=b.dataset.mode===m;
      b.classList.toggle('is-on',on);
      b.setAttribute('aria-pressed', on?'true':'false');
    });
    if(m==='still'){ cube.style.transform='rotateX(0deg) rotateY(0deg)'; note.textContent='Still study mode.'; }
    if(m==='net'){ cube.style.transform='rotateX(0deg) rotateY(0deg)'; note.textContent='Unfolded net (visual mapping).'; }
    if(m==='step'){ note.textContent='Use step buttons to rotate by 90°.'; }
  }

  let stepX=0, stepY=0;
  function step(dir){
    if(dir==='left') stepY -= 90;
    if(dir==='right') stepY += 90;
    if(dir==='up') stepX += 90;
    if(dir==='down') stepX -= 90;
    cube.style.transform=`rotateX(${stepX}deg) rotateY(${stepY}deg)`;
  }

  document.getElementById('stLeft')?.addEventListener('click',()=>step('left'));
  document.getElementById('stRight')?.addEventListener('click',()=>step('right'));
  document.getElementById('stUp')?.addEventListener('click',()=>step('up'));
  document.getElementById('stDown')?.addEventListener('click',()=>step('down'));
  modeBtns.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));

  // Spiritual copy
  if (manifest?.spiritual){
    const S = manifest.spiritual;
    const bullets = [
      ...(S.higher_consciousness||[]),
      ...(S.interconnectedness||[]),
      ...(S.time_space||[]),
      ...(S.true_self||[]),
      ...(S.practice||[])
    ].slice(0,8).map(x=>`• ${x}`).join('<br>');
    spirit.innerHTML = bullets;
  }

  // start
  setMode('still');
  // pick first skin
  if (manifest?.tarot_skins?.length){ skinSel.value = manifest.tarot_skins[0].id; }
  applySkin();
  skinSel.addEventListener('change',applySkin);
})();
