import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022'
  },
  server: {
    port: 8081,
    strictPort: true
  }
});
