#!/usr/local/bin/node
'use strict';
import Core from './index';
import minimist = require('minimist');
import Debug from 'debug';
const debug = Debug('ao:core');

export interface ICoreOptions {
    disableHttpInterface: boolean;
    httpPort: number;
    httpOrigin: string;
}

var argv = minimist(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        httpPort: 3003,
        httpOrigin: 'http://localhost:3000',
    }
});

const core = new Core(argv);
core.init()