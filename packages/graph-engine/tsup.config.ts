import type { Options } from 'tsup';

const env: string = process.env.NODE_ENV || 'development';

export const tsup: Options = {
	sourcemap: env === 'production', // source map is only available in prod
	clean: true, // rimraf dist
	dts: true, // generate dts file for main module
	format: 'esm',
	outDir: 'dist',
	//Uncomment this line to generate metafile to check bundle size.
	//metafile:true,
	entry: ['src/index.ts'],
	target: 'esnext'
};
