import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2';

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
			typescript({
				tsconfig: 'tsconfig.json'
			}),
			postcss({
				extract: true
			})
		]
	}
];

export default defaultEntries;
