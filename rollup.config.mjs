import cleanupDir from 'rollup-plugin-cleanup-dir';
import typescript from 'rollup-plugin-typescript2';
import swcImport from 'rollup-plugin-swc'


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
