import cleanupDir from 'rollup-plugin-cleanup-dir';
import swcImport from 'rollup-plugin-swc'
import typescript from 'rollup-plugin-typescript2';

import json from '@rollup/plugin-json';
import { exec } from 'child_process';

const swc = swcImport.default;


const tscAlias = () => {
    return {
        name: "tsAlias",
        writeBundle: () => {

            return new Promise((resolve, reject) => {

                exec("tsc-alias -p tsconfig.prod.json --dir dist/esm", function callback(error, stdout, stderr) {
                    if (stderr || error) {
                        reject(stderr || error);
                    } else {
                        resolve(stdout);
                    }
                });
            });
        },
    };
};


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
            json(),
            // Todo: This is being tempermental
            // cleanupDir.default(),
            typescript({
                tsconfig: 'tsconfig.prod.json',
            }),
            swc({
                env: {
                    dynamicImport: true,
                },
            }),
            tscAlias(),
        ]
    }
];

export default defaultEntries;
