#!/usr/local/bin/node
'use strict';

import AODat, { AODat_Args } from './dat'
import minimist = require('minimist')
import path from 'path'

var argv: AODat_Args = minimist<AODat_Args>(process.argv.slice(2), {
    default: {
        storageLocation: path.resolve(__dirname, '../..', 'data'),
    }
});

if (require.main === module) {
    new AODat(argv)
}