export function renderPlate(config) {
  // Generate Archimedean spiral points (logic mirror of browser engine)
  const pts = [];
  const s = config.plate.spiral || { a:1, b:0.18, theta_max: 12, points: 600 };
  const k = 10; // arbitrary scale for test context
  for (let i=0;i<=s.points;i++){
    const t = (i/s.points) * s.theta_max;
    const r = s.a + s.b*t;
    pts.push([ (r*Math.cos(t))*k, (r*Math.sin(t))*k ]);
  }
  return { points: pts };
}
