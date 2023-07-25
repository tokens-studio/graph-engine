import postcss from 'rollup-plugin-postcss';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import tsPlugin from '@rollup/plugin-typescript';

const defaultEntries = [
	{
		input: './src/index.tsx',
		output: [
			{
				preserveModules: true,
				dir: './dist/cjs',
				exports: 'named',
				sourcemap: true,
				format: 'cjs'
			},
			{
				preserveModules: true,
				dir: './dist/esm',
				exports: 'named',
				sourcemap: true,
				format: 'es'
			}
		],
		plugins: [			
			tsPlugin({
				tsconfig: 'tsconfig.json'
			}),
			postcss({
				extract: true
			}),
			// nodeResolve({
			// 	alias: {
			// 	  '#': __dirname + '/src',
			// 	},
			//   }),
		],
		cache: false
	}
];

export default defaultEntries;
