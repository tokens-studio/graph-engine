import { defineConfig } from 'tsup';
import { sassPlugin } from 'esbuild-sass-plugin';

const env: string = process.env.NODE_ENV || 'development';

export default defineConfig({
  entry: ['src/index.tsx'],
  dts: true,
  bundle: false,
  splitting: false,
  sourcemap: env === 'production', // source map is only available in prod
  format: 'esm',
  skipNodeModulesBundle: true,
  clean: false,
  esbuildPlugins: [sassPlugin()],
  minify: false,
  target: "esnext"
});
