#!/usr/local/bin/node
"use strict";
import fsExtra from "fs-extra";
import path from "path";
const packageJson = require("../package.json");

export const DEFAULT_OPTIONS = {
    ethAddress: "",
    disableHttpInterface: false,
    corePort: 3003,
    coreOrigin: "http://localhost",
    httpOrigin: "http://localhost:3000",
    storageLocation: path.resolve(__dirname, "..", "data"),
    desktopLocation: undefined,
	nodeBin: process.execPath,
	datContentDiscovery: true
};

// TODO: see commandDir for modularizing the commands (args and commands can live in same file)

require("yargs")
    .version(packageJson.version)
    .command({
        command: "start",
        aliases: ["run"],
        desc: "Start ao-core",
        builder: yargs => {
            return yargs
                .option("ethAddress", {
                    description:
                        "Ethereum account you would like to run ao-core under",
                    type: "string"
                })
                .option("ethNetworkRpc", {
                    description:
                        "Override the default ethereum network rpc endpoint. At this time, the rpc endpoint must support the ws interface.",
                    type: "string",
                    default:
                        process.env.NODE_ENV === "production"
                            ? "wss://mainnet.infura.io/ws"
                            : "wss://rinkeby.infura.io/ws"
                })
                .required("ethNetworkRpc")
                .option("disableHttpInterface", {
                    description: "Disables the HTTP interface",
                    type: "boolean"
                })
                .option("corePort", {
                    alias: "port",
                    description: "Port that ao-core will run on",
                    type: "number"
                })
                .option("coreOrigin", {
                    description: "Domain that ao-core will run on",
                    type: "string"
                    //Add coerce to validate as URL.
                })
                .option("httpOrigin", {
                    description:
                        "Origin that will be accessing ao-core's http interface from (CORS)",
                    type: "string"
                })
                .option("storageLocation", {
                    alias: "s",
                    description: "Directory that ao-core will use for storage",
                    type: "string",
                    coerce: arg => {
                        //If you use coerce, the default options don't get passed as it goes through this.
                        return fsExtra.pathExistsSync(arg)
                            ? arg
                            : DEFAULT_OPTIONS.storageLocation;
                    }
                })
                .option("desktopLocation", {
                    description: "Users desktop path (used for exporting)",
                    type: "string",
                    coerce: arg => {
                        //If you use coerce, the default options don't get passed as it goes through this.
                        return fsExtra.pathExistsSync(arg)
                            ? arg
                            : DEFAULT_OPTIONS.desktopLocation;
                    }
                })
                .option("nodeBin", {
                    description: "Node binary to use",
                    type: "string",
                    coerce: arg => {
                        return fsExtra.pathExistsSync(arg)
                            ? arg
                            : DEFAULT_OPTIONS.nodeBin;
                    }
                })
                .default(DEFAULT_OPTIONS);
        },
        handler: argv => {
            const Core = require("./index").default;
            const core = new Core(argv);
        }
    })
    .command({
        command: "import <path>",
        desc: "Imports an existing data folder to seed this node",
        builder: yargs => {
            return yargs
                .option("$0", {
                    aliases: ["path", "p"],
                    description:
                        "The location of the zipped export that will be used to import",
                    type: "string",
                    coerce: arg => {
                        if (fsExtra.pathExistsSync(arg)) {
                            return path.resolve(arg);
                        } else {
                            return null;
                        }
                    }
                })
                .demandOption("path")
                .option("storageLocation", {
                    alias: "s",
                    description: "Directory that ao-core uses for storage",
                    type: "string",
                    default: () => DEFAULT_OPTIONS.storageLocation
                });
        },
        handler: async argv => {
            const importer = require("./commands/importer.js").default;
            await importer(argv, argv.path);
        }
    })
    .command({
        command: "export <path>",
        desc:
            "Exports ao-cores entire data folder as a zip file to the desired path",
        builder: yargs => {
            return yargs
                .option("$0", {
                    aliases: ["path", "p"],
                    description:
                        "The location that the zipped export will be saved",
                    type: "string"
                })
                .demandOption("path")
                .option("storageLocation", {
                    alias: "s",
                    description: "Directory that ao-core uses for storage",
                    type: "string",
                    default: () => DEFAULT_OPTIONS.storageLocation
                });
        },
        handler: async argv => {
            const exporter = require("./commands/exporter.js").default;
            await exporter(argv, argv.path);
        }
    })
    .command({
        command: "no-discovery",
		desc: "Start ao-core without Dat/Content discovery",
        builder: yargs => {
            return yargs
                .option("ethAddress", {
                    description:
                        "Ethereum account you would like to run ao-core under",
                    type: "string"
                })
                .option("ethNetworkRpc", {
                    description:
                        "Override the default ethereum network rpc endpoint. At this time, the rpc endpoint must support the ws interface.",
                    type: "string",
                    default:
                        process.env.NODE_ENV === "production"
                            ? "wss://mainnet.infura.io/ws"
                            : "wss://rinkeby.infura.io/ws"
                })
                .required("ethNetworkRpc")
                .option("disableHttpInterface", {
                    description: "Disables the HTTP interface",
                    type: "boolean"
                })
                .option("corePort", {
                    alias: "port",
                    description: "Port that ao-core will run on",
                    type: "number"
                })
                .option("coreOrigin", {
                    description: "Domain that ao-core will run on",
                    type: "string"
                    //Add coerce to validate as URL.
                })
                .option("httpOrigin", {
                    description:
                        "Origin that will be accessing ao-core's http interface from (CORS)",
                    type: "string"
                })
                .option("storageLocation", {
                    alias: "s",
                    description: "Directory that ao-core will use for storage",
                    type: "string",
                    coerce: arg => {
                        //If you use coerce, the default options don't get passed as it goes through this.
                        return fsExtra.pathExistsSync(arg)
                            ? arg
                            : DEFAULT_OPTIONS.storageLocation;
                    }
                })
                .option("desktopLocation", {
                    description: "Users desktop path (used for exporting)",
                    type: "string",
                    coerce: arg => {
                        //If you use coerce, the default options don't get passed as it goes through this.
                        return fsExtra.pathExistsSync(arg)
                            ? arg
                            : DEFAULT_OPTIONS.desktopLocation;
                    }
                })
                .option("nodeBin", {
                    description: "Node binary to use",
                    type: "string",
                    coerce: arg => {
                        return fsExtra.pathExistsSync(arg)
                            ? arg
                            : DEFAULT_OPTIONS.nodeBin;
                    }
                })
				.default({...DEFAULT_OPTIONS, datContentDiscovery: false});
        },
        handler: argv => {
            const Core = require("./index").default;
            const core = new Core(argv);
        }
    })
    .demandCommand()
    .help().argv;
