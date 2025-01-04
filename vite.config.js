import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Ensure Vite uses the project root
  base: './', // Use relative paths for imports
  resolve: {
    alias: {
      '@': '/src', // Create alias for imports
    },
  },
  build: {
    outDir: 'dist',
  },
});
