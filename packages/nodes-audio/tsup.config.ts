import type { Options } from 'tsup';


const env: string = process.env.NODE_ENV || 'development';

export const tsup: Options = {
    splitting: true,
    sourcemap: env === 'production', // source map is only available in prod
    clean: false,
    dts: true, // generate dts file for main module
    format: ['cjs', 'esm'] ,
    bundle: false,
    skipNodeModulesBundle: true,
    entryPoints: ['src/index.ts'],
    target: 'es2020',
    outDir: 'dist',
    entry: ['src/**/*.ts', 'src/**/*.tsx'],
    esbuildPlugins: []
};