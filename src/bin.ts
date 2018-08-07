#!/usr/local/bin/node
'use strict';
import Core from './index';
import minimist = require('minimist');
import path from 'path';


export interface ICoreOptions {
    disableHttpInterface: boolean;
    corePort: number;
    coreOrigin: string;
    httpOrigin: string;
    storageLocation: string;
}

var argv = minimist<ICoreOptions>(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        corePort: 3003,
        coreOrigin: 'http://localhost',
        httpOrigin: 'http://localhost:3000',
        storageLocation: path.resolve(__dirname, '..', 'data'),
    }
});

const core = new Core(argv);