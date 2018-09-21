#!/usr/local/bin/node
'use strict';
import Core, { ICoreOptions } from './index';
import fsExtra from 'fs-extra'

const argv = require('yargs')
    .option('disableHttpInterface', {
        alias: 'd',
        description: 'Disables the HTTP interface',
        type: 'boolean'
    })
    .option('corePort', {
        alias: 'port',
        description: 'Port that Core runs on',
        type: 'number'
    })
    .option('coreOrigin', {
        description: 'Domain that Core runs on',
        type: 'string',
        //Add coerce to validate as URL.
    })
    .option('httpOrigin', {
        description:'CORS allowed origin',
        type: 'string'
    })
    .option('storageLocation', {
        alias: 's',
        description: 'Where your data be stored',
        type: 'string',
        coerce: (arg) => {
            //If you use coerce, the default options don't get passed as it goes through this.
            return fsExtra.pathExistsSync(arg) ? arg : Core.DEFAULT_OPTIONS.storageLocation
        }
    })
    .option('nodeBin', {
        description: 'Node binary to use',
        type: 'string',
        coerce: (arg) => {
            return fsExtra.pathExistsSync(arg) ? arg : Core.DEFAULT_OPTIONS.nodeBin
        }
    })
    .default(Core.DEFAULT_OPTIONS)
    .argv


const core = new Core(argv);