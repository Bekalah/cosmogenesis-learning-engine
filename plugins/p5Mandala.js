+import p5 from '../vendor/p5.min.js'; // bundled for offline use
+
+export default function p5Mandala(container) {
+  return new p5(p => {
+    p.setup = function () {
+      p.createCanvas(400, 400).parent(container);
+      p.angleMode(p.DEGREES);
+      p.noLoop();
+    };
+
+    p.draw = function () {
+      p.background(255);
+      p.translate(p.width / 2, p.height / 2);
+      const petals = 12;
+      for (let i = 0; i < petals; i++) {
+        p.rotate(360 / petals);
+        p.ellipse(100, 0, 40, 40);
+      }
+    };
+  });
+}
