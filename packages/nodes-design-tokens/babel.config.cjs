//Yes this needs to be commonjs to force it to result in async code generation in babel through jest
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: 'commonjs',
                targets: {
                    node: 'current',
                },
            },
        ],
    ]
}