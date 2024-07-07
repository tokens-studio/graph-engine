import type { Options } from 'tsup';

const env: string = process.env.NODE_ENV || 'development';

export const tsup: Options = {
	sourcemap: env === 'production', // source map is only available in prod
	clean: false,
	dts: true, // generate dts file for main module
	format: 'esm',
	minify: false,
	target: 'esnext',
	outDir: 'dist',
	entry: ['src/**/*.ts', 'src/**/*.tsx']
};
