import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Firebase is isolated in a lazy chunk and only loads when cloud sync is used.
    chunkSizeWarningLimit: 600,
    target: 'es2022'
  },
  server: {
    port: 8081,
    strictPort: true
  }
});
