// Cosmogenesis plate renderer
(async function(){
  const [cfg, palettes, cor] = await Promise.all([
    fetch('../registry/structure.json').then(r=>r.json()),
    fetch('../registry/datasets/palettes.core.json').then(r=>r.json()),
    fetch('../registry/datasets/correspondences.core.json').then(r=>r.json())
  ]);

  const canvas = document.getElementById('plate');
  const ctx = canvas.getContext('2d');
  const hud = document.getElementById('plaque');
  const ladderBtn = document.getElementById('ladder-btn');
  const pngBtn = document.getElementById('png-btn');
  const metaBtn = document.getElementById('meta-btn');

  const palette = palettes.palettes.find(p=>p.id===cfg.palette_id);
  let thetaBase = cfg.plate.spiral.theta_max;
  let start;

  function resize(){
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 1280 * dpr;
    canvas.height = 720 * dpr;
    canvas.style.width = '1280px';
    canvas.style.height = '720px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    render(thetaBase);
  }
  window.addEventListener('resize',resize);
  resize();

  function hexToRgb(hex){
    const bigint = parseInt(hex.slice(1),16);
    return [bigint>>16 & 255, bigint>>8 & 255, bigint & 255];
  }

  function render(thetaMax){
    const w = canvas.width;
    const h = canvas.height;
    const cx = w/2;
    const cy = h/2;
    ctx.clearRect(0,0,w,h);

    // background wash
    const wash = ctx.createLinearGradient(0,0,0,h);
    wash.addColorStop(0,palette.wash_top);
    wash.addColorStop(1,palette.wash_bottom);
    ctx.fillStyle = wash;
    ctx.fillRect(0,0,w,h);

    // center glow
    const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,w*cfg.plate.glow.radius_factor);
    const cg = palette.center_glow;
    glow.addColorStop(0,`rgba(${cg[0]},${cg[1]},${cg[2]},${cfg.plate.glow.alpha})`);
    glow.addColorStop(1,`rgba(${cg[0]},${cg[1]},${cg[2]},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0,0,w,h);

    // axis
    const axisRad = cfg.plate.axis_deg * Math.PI/180;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(axisRad);
    ctx.strokeStyle = palette.axis;
    ctx.lineWidth = w*0.004;
    ctx.beginPath();
    ctx.moveTo(0,-cy);
    ctx.lineTo(0,cy);
    ctx.stroke();

    // Jacob's Ladder
    if(cfg.plate.ladder.enabled){
      const ribs = cfg.plate.ladder.vertebrae;
      const radius = cy*cfg.plate.ladder.radius_factor;
      ctx.lineWidth = cfg.plate.ladder.thickness;
      for(let i=0;i<ribs;i++){
        const y = -radius + (2*radius*i)/(ribs-1);
        ctx.beginPath();
        ctx.moveTo(-radius*0.5,y);
        ctx.lineTo(radius*0.5,y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // spiral nodes
    const {a,b,points} = cfg.plate.spiral;
    const maxR = a*Math.exp(b*thetaMax);
    const scale = Math.min(w,h)*0.5/maxR;
    ctx.fillStyle = `rgba(${palette.node_rgba.join(',')})`;
    for(let i=0;i<points;i++){
      const t = (thetaMax/points)*i;
      const r = a*Math.exp(b*t)*scale;
      const x = cx + r*Math.cos(t);
      const y = cy + r*Math.sin(t);
      ctx.fillRect(x,y,1,1);
    }

    // halos
    const halos = cfg.plate.halos;
    for(let i=0;i<halos;i++){
      const radius = (Math.min(w,h)*0.5/halos)*(i+1);
      ctx.strokeStyle = palette.halo_outline;
      ctx.beginPath();
      ctx.arc(cx,cy,radius,0,Math.PI*2);
      ctx.stroke();
      ctx.fillStyle = palette.halo_fill;
      ctx.beginPath();
      ctx.arc(cx,cy,radius*0.3,0,Math.PI*2);
      ctx.fill();
    }

    hud.textContent = `Axis ${cfg.plate.axis_deg}°, Halos ${cfg.plate.halos}, Ladder ${cfg.plate.ladder.enabled?'ON':'OFF'}`;
  }

  function loop(ts){
    if(start===undefined) start=ts;
    const dt = (ts-start)/1000;
    let theta = thetaBase;
    if(!window.prefers.reducedMotion){
      theta = thetaBase + Math.sin(dt*cfg.motion.hz*2*Math.PI)*cfg.motion.gentle_wobble;
    }
    render(theta);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  ladderBtn.addEventListener('click',()=>{
    cfg.plate.ladder.enabled = !cfg.plate.ladder.enabled;
    render(thetaBase);
  });

  pngBtn.addEventListener('click',()=>{
    canvas.toBlob(b=>{
      const a=document.createElement('a');
      a.href=URL.createObjectURL(b);
      a.download=`Cosmogenesis_Plate_${new Date().toISOString()}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  });

  metaBtn.addEventListener('click',()=>{
    const meta={timestamp:new Date().toISOString(),version:cfg.version,plate:cfg.plate,palette_id:cfg.palette_id};
    const blob=new Blob([JSON.stringify(meta)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=`Cosmogenesis_Plate_${meta.timestamp}.meta.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
})();
