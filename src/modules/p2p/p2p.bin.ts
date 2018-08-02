#!/usr/local/bin/node
'use strict';

import AOP2P, { AOP2P_Args } from './p2p'
import minimist = require('minimist')


var argv: AOP2P_Args = minimist<AOP2P_Args>(process.argv.slice(2), {
    default: {
        httpOrigin: 'http://localhost:3000'
    }
});

if (require.main === module) {
    new AOP2P(argv)
}