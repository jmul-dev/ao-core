#!/usr/local/bin/node
"use strict";

import AOEth, { AOEthProcessArgs } from "./eth";
import minimist = require("minimist");

const defaultRPCEndpoints = {
    "1": "wss://mainnet.infura.io/ws",
    "3": "wss://ropsten.infura.io/ws",
    "4": "wss://rinkeby.infura.io/ws"
};

var argv: AOEthProcessArgs = minimist<AOEthProcessArgs>(process.argv.slice(2), {
    default: {
        ethNetworkId: "4"
    }
});

if (!argv.rpcEndpoint) {
    argv.rpcEndpoint = defaultRPCEndpoints[argv.ethNetworkId];
}

if (require.main === module) {
    new AOEth(argv);
}
