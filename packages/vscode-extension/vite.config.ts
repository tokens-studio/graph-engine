import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    target: 'es2015',
    manifest: true,
    outDir: '../../build',
    emptyOutDir: true, // also necessary
  },
  mode: 'development',
  root: 'app/src',
  plugins: [react({ tsDecorators: true }), tsconfigPaths()],
});
