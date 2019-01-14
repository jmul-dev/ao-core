#!/usr/local/bin/node
"use strict";

import AOEth from "./eth";
import minimist = require("minimist");
import { AORouterSubprocessArgs } from "../../router/AORouterInterface";

const defaultRPCEndpoints = {
    "1": "wss://mainnet.infura.io/ws",
    "3": "wss://ropsten.infura.io/ws",
    "4": "wss://rinkeby.infura.io/ws"
};

var argv: AORouterSubprocessArgs = minimist<AORouterSubprocessArgs>(
    process.argv.slice(2),
    {
        default: {
            ethNetworkRpc:
                defaultRPCEndpoints[
                    process.env.NODE_ENV === "production" ? "1" : "4"
                ]
        }
    }
);

if (require.main === module) {
    new AOEth(argv);
}
