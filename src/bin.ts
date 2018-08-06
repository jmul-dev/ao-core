#!/usr/local/bin/node
'use strict';
import Core from './index';
import minimist = require('minimist');
import Debug from 'debug';
import path from 'path';
const debug = Debug('ao:core');

export interface ICoreOptions {
    disableHttpInterface: boolean;
    corePort: number;
    coreOrigin: string;
    httpOrigin: string;
    storageLocation: string;
}

var argv = minimist(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        corePort: 3003,
        coreOrigin: 'http://localhost',
        httpOrigin: 'http://localhost:3000',
        storageLocation: path.resolve(__dirname, '..', 'data'),
    }
});

const core = new Core(argv);