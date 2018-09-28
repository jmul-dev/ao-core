#!/usr/local/bin/node
'use strict';

import AOEth, { AOEth_Args } from './eth'
import minimist = require('minimist')

var argv: AOEth_Args = minimist<AOEth_Args>(process.argv.slice(2), {
    default: {
        network: '4',
        rpcMainnet: 'wss://mainnet.infura.io/ws', // 'https://mainnet.infura.io/',
        rpcRopsten: 'wss://ropsten.infura.io/ws', // 'https://rinkeby.infura.io/',
        rpcRinkeby: 'wss://rinkeby.infura.io/ws', // 'https://rinkeby.infura.io/',
    }
});

if (require.main === module) {
    new AOEth(argv)
}