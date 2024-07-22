import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

const env: string = process.env.NODE_ENV || 'development';

export default defineConfig({
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: env === 'production', // source map is only available in prod
  format: 'esm',
  //Uncomment this line to generate metafile to check bundle size.
  //metafile:true,
  skipNodeModulesBundle: true,
  clean: false,
  /** @ts-ignore multiple different installations of esbuild so plugins types are not compatible */
  esbuildPlugins: [sassPlugin()],
  target: 'esnext',
});
