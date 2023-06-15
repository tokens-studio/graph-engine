import cleanupDir from 'rollup-plugin-cleanup-dir';
import swcImport from 'rollup-plugin-swc'
import typescript from 'rollup-plugin-typescript2';


const swc = swcImport.default;

const defaultEntries = [
    {
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
            cleanupDir.default(),
            typescript({
                tsconfig: 'tsconfig.prod.json'
            }),
            swc({
                env: {
                    dynamicImport: true,
                },
                jsc: {
                    parser: {
                        syntax: 'typescript',
                    },
                    target: 'es5',
                },
            }),
        ]
    }
];

export default defaultEntries;
