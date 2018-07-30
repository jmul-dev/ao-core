#!/usr/local/bin/node
'use strict';

import AODB, { AODB_Args } from './db'
import minimist = require('minimist')
import path from 'path'

var argv: AODB_Args = minimist<AODB_Args>(process.argv.slice(2), {
    default: {
        storageLocation: path.resolve(__dirname, '../..', 'data'),
    }
});

if (require.main === module) {
    new AODB(argv)
}