import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000, // Default for local dev
    allowedhosts: [ac535263-027f-42b5-a3da-eddd64671cb6-00-2so8mpo8xss8j.kirk.replit.dev],                            
  },
});
