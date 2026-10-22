import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Herramienta de administración LOCAL. No forma parte del build público
 * (el build usa vite.config.ts con /index.html). Se sirve solo en 127.0.0.1.
 */
export default defineConfig({
  root: 'admin',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5174, strictPort: true, fs: { allow: ['..'] } },
});
