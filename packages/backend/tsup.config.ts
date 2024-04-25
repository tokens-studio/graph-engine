import { defineConfig } from 'tsup';


export default defineConfig({
  external:['@prisma/client'],
  noExternal:['**'],
  entry: ['src/index.ts'],
  dts: true,
  bundle: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  skipNodeModulesBundle: true,
  clean: true
});
