import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js lives in its own lazily loaded hero chunk (~130 kB gzip)
  build: { chunkSizeWarningLimit: 600 },
});
