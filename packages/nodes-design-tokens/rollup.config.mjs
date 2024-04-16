import swcImport from 'rollup-plugin-swc'
import typescript from 'rollup-plugin-typescript2';

const swc = swcImport.default;


const defaultEntries = [
    {
        external: [
            /node_modules/
        ],
        input: './src/index.ts',
        output: [
            {
                dir: './dist/cjs',
                exports: 'named',
                sourcemap: true,
                format: 'cjs',
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
                tsconfig: 'tsconfig.prod.json',
            }),

            swc({
                env: {
                    dynamicImport: true,
                },
            })
        ]
    }
];

export default defaultEntries;
