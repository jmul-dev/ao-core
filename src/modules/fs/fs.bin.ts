#!/usr/local/bin/node
'use strict';

import AOFS, { AOFS_Args } from './fs'
import minimist = require('minimist')
import path from 'path'
import ffprobeStatic from 'ffprobe-static'

var argv: AOFS_Args = minimist<AOFS_Args>(process.argv.slice(2), {
    default: {
        storageLocation: path.resolve(__dirname, '../..', 'data'),
        ffprobeBin: ffprobeStatic.path,
    }
});

if (require.main === module) {
    new AOFS(argv)
}