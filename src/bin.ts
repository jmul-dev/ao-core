#!/usr/local/bin/node
"use strict";
import Core, { ICoreOptions } from "./index";
import fsExtra from "fs-extra";
const packageJson = require("../package.json");

const argv = require("yargs")
    .version(packageJson.version)
    .option("ethAddress", {
        description: "Run with a specific ethAddress",
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
        description: "Port that Core runs on",
        type: "number"
    })
    .option("coreOrigin", {
        description: "Domain that Core runs on",
        type: "string"
        //Add coerce to validate as URL.
    })
    .option("httpOrigin", {
        description: "CORS allowed origin",
        type: "string"
    })
    .option("storageLocation", {
        alias: "s",
        description: "Where your data be stored",
        type: "string",
        coerce: arg => {
            //If you use coerce, the default options don't get passed as it goes through this.
            return fsExtra.pathExistsSync(arg)
                ? arg
                : Core.DEFAULT_OPTIONS.storageLocation;
        }
    })
    .option("desktopLocation", {
        description: "Users desktop path (used for exporting)",
        type: "string",
        coerce: arg => {
            //If you use coerce, the default options don't get passed as it goes through this.
            return fsExtra.pathExistsSync(arg)
                ? arg
                : Core.DEFAULT_OPTIONS.desktopLocation;
        }
    })
    .option("nodeBin", {
        description: "Node binary to use",
        type: "string",
        coerce: arg => {
            return fsExtra.pathExistsSync(arg)
                ? arg
                : Core.DEFAULT_OPTIONS.nodeBin;
        }
    })
    .option("exportData", {
        description: "Exports a data to a defined path",
        type: "string",
        coerce: arg => {
            if (fsExtra.pathExistsSync(arg)) {
                return arg;
            } else {
                console.log(
                    "Path does not exist for export. Please specify a path that exists"
                );
                return "";
            }
        }
    })
    .option("importData", {
        description: "Imports a zip file created through the export process",
        type: "string",
        coerce: arg => {
            if (fsExtra.pathExistsSync(arg)) {
                return arg;
            } else {
                console.log(
                    "File does not exist for import. Please specify a File that exists"
                );
                return "";
            }
        }
    })
    .default(Core.DEFAULT_OPTIONS).argv;

const core = new Core(argv);
