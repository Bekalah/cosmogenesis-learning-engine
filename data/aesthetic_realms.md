 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a//dev/null b/docs/aesthetic_realms.md
index 0000000000000000000000000000000000000000..2c781ee98e040f960eb099254b948e9a32827952 100644
--- a//dev/null
+++ b/docs/aesthetic_realms.md
@@ -0,0 +1,15 @@
+# Aesthetic Realms
+
+The Cosmogenesis Learning Engine can adopt one of three aesthetic realms. Each realm guides the mood of plates, egregores, and future interface skins.
+
+## Realm I – Exact Magus / Angel Science (Ancient Cathedral)
+- Gothic cathedrals, stained glass geometry, teal sigils over white stone.
+- Evokes monastic laboratories and scholastic precision.
+
+## Realm II – Visionary Luminous Feminine (Elegant Gentle Artistic)
+- Soft golds and blues, haloed figures, and flowing calligraphy.
+- Emphasizes receptivity, care, and pastel illumination.
+
+## Realm III – Vampire Elite Business (Constantine / Blade Runner / Witcher Mods)
+- Midnight palettes, neon glyphs, trenchcoat glamour, and occult technology.
+- Merges noir corporate mystique with sorcerous cyberpunk.
 
EOF
)
