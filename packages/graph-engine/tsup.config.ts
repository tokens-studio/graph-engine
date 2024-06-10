import type { Options } from 'tsup';


const env: string = process.env.NODE_ENV || 'development';

export const tsup: Options = {
    splitting: false,
    sourcemap: env === 'production', // source map is only available in prod
    clean: false, // rimraf disr
    dts: true, // generate dts file for main module
    format: ['cjs', 'esm'] ,
    bundle: true,
    target: 'es2020',
    outDir: 'dist',
    entry: ['src/index.ts']
};