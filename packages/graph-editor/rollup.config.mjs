import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';

const defaultEntries = [
    {
        input: './src/index.tsx',
        output: [
            {
                preserveModules: true,
                dir: './dist',
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
            }),
        ],
        cache: false
    }
];

export default defaultEntries;