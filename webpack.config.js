const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const PermissionsOutputPlugin = require("webpack-permissions-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");

console.log(__dirname + "/nodebin");

const devMode = process.env.NODE_ENV !== "production";

fs.mkdirSync(path.resolve(__dirname, "dist"));

const productionLoader = {
    loader: "awesome-node-loader",
    options: {
        rewritePath: path.join("..", "..", "..", "ao-core", "dist"),
        useDirname: false // This uses the node binary location
    }
};

const developmentLoader = {
    loader: "awesome-node-loader",
    options: {
        rewritePath: path.resolve(__dirname, "dist")
    }
};

var config = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    devtool: devMode ? "source-map" : undefined,
    entry: {
        main: "./src/index.ts",
        bin: "./src/bin.ts",
        dat: "./src/modules/dat/dat.bin.ts",
        db: "./src/modules/db/db.bin.ts",
        fs: "./src/modules/fs/fs.bin.ts",
        eth: "./src/modules/eth/eth.bin.ts",
        p2p: "./src/modules/p2p/p2p.bin.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: chunkData => {``
            return chunkData.chunk.name === "main" ||
                chunkData.chunk.name === "bin"
                ? "[name].js"
                : "modules/[name].bin.js";
        },
        library: "[name]",
        libraryTarget: "commonjs"
    },
    // optimization: {
    //     minimize: process.env.NODE_ENV === "production" ? true : false, // <---- disables uglify.
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             exclude: /modules/, // Need to exclude for string replacement to happen post compile.
    //             parallel: true,
                
    //         })
    //     ], //if you want to customize it.
    //     namedModules: true //enabled for string replacement
    // },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".mjs", ".js", ".graphql", ".json", ".node"]
    },
    module: {
        rules: [            
            {
                test: /bin\.(js|ts)$/,
                use: ["shebang-loader"]
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            // https://github.com/graphql/graphql-js/issues/1272
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto"
            },
            {
                exclude: /node_modules/,
                test: /\.graphql$/,
                use: [{ loader: "graphql-import-loader" }]
            },
            {
                test: /\.node$/,
                use: [devMode ? developmentLoader : productionLoader]
            },
            // eccrypto return hack
            {
                test: /index\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules/aodb/node_modules/eccrypto")
                ],
                loader: "string-replace-loader",
                options: {
                    search: 'return (module.exports = require("./browser"));',
                    replace: 'console.error("ignoring browser return");'
                }
            },
            //UTP
            {
                test: /index\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules", "utp-native")
                ],
                loader: "string-replace-loader",
                options: {
                    search: "require('node-gyp-build')(__dirname)",
                    replace:
                        "require('node-gyp-build')(__dirname+'" +
                        path.sep +
                        path.join("utp-prebuilds") +
                        "')"
                }
            },
            //Sodium Native
            {
                test: /index\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules", "sodium-native")
                ],
                loader: "string-replace-loader",
                options: {
                    search: "require('node-gyp-build')(__dirname)",
                    replace:
                        "require('node-gyp-build')(__dirname+'" +
                        path.sep +
                        path.join("sodium-prebuilds") +
                        "')"
                }
            },            
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/vertx/),  // sry
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
        new CopyWebpackPlugin([
            { from: "node_modules/ffprobe-static/bin", to: "bin" },
            {
                from: "node_modules/utp-native/prebuilds",
                to: "modules/utp-prebuilds/prebuilds"
            },
            {
                from: "node_modules/sodium-native/prebuilds",
                to: "modules/sodium-prebuilds/prebuilds"
            }
        ]),
        new ReplaceInFileWebpackPlugin([
            {
                dir: "dist/modules",
                test: /\.js$/,
                rules: [
                    {
                        search:
                            '__webpack_require__("./node_modules/node-gyp-build sync recursive")',
                        replace: "require"
                    }
                ]
            }
        ])
    ]
};

// For some reason ffprobe static binary coppies with non-executable permissions :/
var ffprobeBinaryLocation = path.resolve(
    __dirname,
    "dist/bin/darwin/x64/ffprobe"
);
if (process.platform === "win32") {
    ffprobeBinaryLocation = path.resolve(
        __dirname,
        "dist/bin/win32/x64/ffprobe.exe"
    );
} else if (process.platform === "linux") {
    ffprobeBinaryLocation = path.resolve(
        __dirname,
        "dist/bin/linux/x64/ffprobe"
    );
}
if (process.platform !== "win32") {
    config.plugins.push(
        new PermissionsOutputPlugin({
            buildFiles: [
                {
                    path: ffprobeBinaryLocation,
                    fileMode: "755"
                }
            ]
        })
    );
}

module.exports = config;
