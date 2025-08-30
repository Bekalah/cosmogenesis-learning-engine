+export default function(engine){
+  const ctx = new (window.AudioContext || window.webkitAudioContext)();
+  if(!window.COSMO_SETTINGS?.muteAudio){
+    const osc = ctx.createOscillator();
+    const gain = ctx.createGain();
+    osc.type = 'square';
+    osc.frequency.value = 660;
+    gain.gain.value = 0.05;
+    osc.connect(gain).connect(ctx.destination);
+    osc.start();
+    osc.stop(ctx.currentTime + 0.25);
+  }
+  engine.setConfig({labels:['Voltage','Current','Frequency','Resistance','Capacitance','Inductance','Resonance']}).render();
+  window.toast?.('Tesla sparks a coil of insight.');
+}
