import { defineConfig } from 'tsup';

const env: string = process.env.NODE_ENV || 'development';


export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  format: 'esm',
  skipNodeModulesBundle: true,
  clean: false,
  minify: false,
  target: "esnext"
});
