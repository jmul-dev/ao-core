#!/usr/local/bin/node
'use strict';
import Core, { ICoreOptions } from './index';
import minimist = require('minimist');


var argv = minimist<ICoreOptions>(process.argv.slice(2), {
    default: Core.DEFAULT_OPTIONS
});

const core = new Core(argv);