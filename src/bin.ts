#!/usr/local/bin/node
'use strict';
import Core from './index';
import minimist = require('minimist');
import Debug from 'debug';
const debug = Debug('ao:core');

var argv = minimist(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        httpPort: 3003
    }
});

const core = new Core(argv);
core.init()