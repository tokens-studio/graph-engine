import cleanupDir from 'rollup-plugin-cleanup-dir';
import typescript from 'rollup-plugin-typescript2';

const defaultEntries = [
    {
        input: './src/index.ts',
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
            cleanupDir.default(),
            typescript({
                tsconfig: 'tsconfig.prod.json'
            })
        ]
    }
];

export default defaultEntries;
