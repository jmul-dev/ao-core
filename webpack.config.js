var webpack = require('webpack');
var path = require('path');

module.exports = {
    mode: "development",
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: "inline-source-map",
    entry: {
        main: "./dist/index.js",
        bin: "./dist/bin.js",
        dat: "./dist/modules/dat/dat.bin.js",
        db: "./dist/modules/db/db.bin.js",
        fs: "./dist/modules/fs/fs.bin.js",
        p2p: "./dist/modules/p2p/p2p.bin.js",
        eth: "./dist/modules/eth/eth.bin.js",
    },
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: (chunkData) => {
            return chunkData.chunk.name === 'main' || chunkData.chunk.name === 'bin' ? '[name].js': 'modules/[name].bin.js';
        },
        library: "[name]",
        libraryTarget: "commonjs",
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".mjs", ".js", ".graphql", ".json"]
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            // { test: /\.tsx?$/, loader: "ts-loader" },
            // https://github.com/graphql/graphql-js/issues/1272
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto",
            },
            {
                exclude: /node_modules/,
                test: /\.graphql$/,
                use: [{ loader: 'graphql-import-loader' }]
            },
            {
                test: /bin\.js$/,
                use: ['shebang-loader']
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true})
    ]
};