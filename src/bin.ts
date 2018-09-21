#!/usr/local/bin/node
'use strict';
import Core, { ICoreOptions } from './index';

const argv = require('yargs')
    .default(Core.DEFAULT_OPTIONS)
    .describe('disableHttpInterface', 'Disables the HTTP interface')
    .describe('corePort', 'Port that Core runs on')
    .describe('coreOrigin', 'Domain that Core runs on')
    .describe('httpOrigin', 'CORS allowed origin')
    .describe('storageLocation', 'Where your data be stored')
    .describe('nodeBin', 'Node binary to use')
    .argv

const core = new Core(argv);