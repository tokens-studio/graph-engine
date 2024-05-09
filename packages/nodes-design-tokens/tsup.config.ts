import type { Options } from 'tsup';


const env: string = process.env.NODE_ENV || 'development';

export const tsup: Options = {
    splitting: true,
    sourcemap: env === 'production', // source map is only available in prod
    clean: true, // rimraf disr
    dts: true, // generate dts file for main module
    format: env === 'production' ? ['cjs', 'esm'] : ['esm'],
    minify: env === 'production',
    bundle: false,
    skipNodeModulesBundle: true,
    entryPoints: ['src/index.ts'],
    target: 'es2020',
    outDir: 'dist',
    entry: ['src/**/*.ts'],
    esbuildPlugins: []
};