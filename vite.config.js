import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  server: { fs: { strict: false } },
});
