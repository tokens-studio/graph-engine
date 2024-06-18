import { defineConfig } from 'tsup';

const env: string = process.env.NODE_ENV || 'development';


export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  bundle: true,
  splitting: true,
  sourcemap: true,
  format: ['cjs', 'esm'] ,
  skipNodeModulesBundle: true,
  clean: false,
});
