import { defineConfig } from 'vite';

export default defineConfig({
  // Electron loads the production renderer with file://, so assets need relative URLs.
  base: './',
});
