import type { Options } from 'tsup';

const env: string = process.env.NODE_ENV || 'development';

export const tsup: Options = {
    sourcemap: env === 'production', // source map is only available in prod
    clean: false, // rimraf dist
    dts: true, // generate dts file for main module
    format: 'esm',
    outDir: 'dist',
    entry: ['src/index.ts'],
    splitting: false,
    minify: false,
    bundle: false,
    target: "esnext"
};