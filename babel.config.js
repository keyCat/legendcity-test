module.exports = {
    plugins: [
        ['babel-plugin-module-resolver', {
            alias: {
                '@api': './src/api',
                '@core': './src/core',
                '@database': './src/database',
                '@decorators': './src/decorators'
            }
        }],
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
        '@babel/plugin-proposal-class-properties',
    ],
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ]
};
