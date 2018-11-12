const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PermissionsOutputPlugin = require('webpack-permissions-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

console.log(__dirname + '/nodebin')

const devMode = process.env.NODE_ENV !== 'production'

console.log('Are we in development mode?', devMode ? 'yes':'no')

const productionLoader = {
    loader: 'awesome-node-loader',
    options: {
        rewritePath: path.join('..','..','..','ao-core','dist'),
        useDirname: false // This uses the node binary location 
    }
}

const developmentLoader = {
    loader: 'awesome-node-loader',
    options: {
        rewritePath: path.resolve(__dirname, 'dist')
    }
}

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: process.env.NODE_ENV === 'production' ? undefined : "inline-cheap-source-map",
    entry: {
        main: "./src/index.ts",
        bin: "./src/bin.ts",
        dat: "./src/modules/dat/dat.bin.ts",
        db: "./src/modules/db/db.bin.ts",
        fs: "./src/modules/fs/fs.bin.ts",
        eth: "./src/modules/eth/eth.bin.ts",
        p2p: "./src/modules/p2p/p2p.bin.ts",
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
        extensions: [".ts", ".tsx", ".mjs", ".js", ".graphql", ".json", ".node"]
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
            {
                test: /\.node$/,
                use: [
                    devMode ? developmentLoader : productionLoader
                ],
            },
            //UTP
            {
                test: /index\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules", "utp-native")
                ],
                loader: 'string-replace-loader',
                options: {
                  search: "require('node-gyp-build')(__dirname)",
                  replace: "require('node-gyp-build')(__dirname+'"+path.sep+path.join('utp-prebuilds')+"')"
                }
            },
            //Sodium Native
            {
                test: /index\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules", "sodium-native")
                ],
                loader: 'string-replace-loader',
                options: {
                  search: "require('node-gyp-build')(__dirname)",
                  replace: "require('node-gyp-build')(__dirname+'"+path.sep+path.join('sodium-prebuilds')+"')"
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({banner: '#!/usr/bin/env node', raw: true}),
        new CopyWebpackPlugin([
            { from: 'node_modules/ffprobe-static/bin', to: 'bin' },
            { from: 'node_modules/utp-native/prebuilds', to: 'modules/utp-prebuilds/prebuilds' },
            { from: 'node_modules/sodium-native/prebuilds', to: 'modules/sodium-prebuilds/prebuilds' }
        ]),
        new PermissionsOutputPlugin({
            // buildFolders: [
            //     path.resolve(__dirname, 'dist/bin')
            // ]
            buildFiles: [
                {
                    path: path.resolve(__dirname, 'dist/bin/darwin/x64/ffprobe'),
                    fileMode: '755'
                },
                {
                    path: path.resolve(__dirname, 'dist/bin/win32/x64/ffprobe.exe'),
                    fileMode: '755'
                },
                {
                    path: path.resolve(__dirname, 'dist/bin/linux/x64/ffprobe'),
                    fileMode: '755'
                }
            ]
        }),
        new ReplaceInFileWebpackPlugin([
            {
                dir: 'dist/modules',
                files: [
                    'dat.bin.js'
                ],
                rules: [
                    {
                        search: '__webpack_require__("./node_modules/node-gyp-build sync recursive")',
                        replace: 'require'
                    }
                ]
            }
        ])
    ]
};
