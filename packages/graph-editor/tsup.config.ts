import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

const env: string = process.env.NODE_ENV || 'development';

export default defineConfig({
  entry: ['src/index.tsx'],
  dts: true,
  sourcemap: env === 'production', // source map is only available in prod
  format: 'esm',
  skipNodeModulesBundle: true,
  clean: false,
  /** @ts-expect-error multiple different installations of esbuild so plugins types are not compatible */
  esbuildPlugins: [sassPlugin()],
  minify: false,
  target: 'esnext',
});
