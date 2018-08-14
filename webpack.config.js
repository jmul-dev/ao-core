var webpack = require('webpack');
var path = require('path');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: process.env.NODE_ENV === 'production' ? undefined : "inline-source-map",
    entry: {
        main: "./src/index.ts",
        bin: "./src/bin.ts",
        dat: "./src/modules/dat/dat.bin.ts",
        db: "./src/modules/db/db.bin.ts",
        fs: "./src/modules/fs/fs.bin.ts",
        p2p: "./src/modules/p2p/p2p.bin.ts",
        eth: "./src/modules/eth/eth.bin.ts",
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (chunkData) => {
            return chunkData.chunk.name === 'main' || chunkData.chunk.name === 'bin' ? '[name].js': 'modules/[name].bin.js';
        },
        library: "[name]",
        libraryTarget: "commonjs",
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".mjs", ".js", ".graphql", ".json"]
    },
    module: {
        rules: [
            {
                test: /bin\.(js|ts)$/,
                use: ['shebang-loader']
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
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
        ]
    },
    plugins: [
        new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true})
    ]
};