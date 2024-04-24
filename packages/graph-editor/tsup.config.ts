import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';


export default defineConfig({
  entry: ['src/index.tsx'],
  dts: true,
  bundle: true,
  splitting: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  skipNodeModulesBundle: true,
  clean: true,
  esbuildPlugins: [sassPlugin()]
});
