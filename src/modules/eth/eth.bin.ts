#!/usr/local/bin/node
'use strict';

import AOEth, { AOEth_Args } from './eth'
import minimist = require('minimist')

var argv: AOEth_Args = minimist<AOEth_Args>(process.argv.slice(2), {
    default: {
        rpcMainnet: 'https://mainnet.infura.io/',
        rpcRinkeby: 'https://rinkeby.infura.io/',
    }
});

if (require.main === module) {
    new AOEth(argv)
}