#!/usr/local/bin/node
'use strict';
import 'source-map-support/register';
import Core, { AO_CONSTANTS } from './index';
import minimist from 'minimist';
import Debug from 'debug';
const debug = Debug('ao:core');

var argv = minimist(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        httpPort: 3000,
        ipcServerId: 'test', // AO_CONSTANTS.IPC_SERVER_ID,
    }
});

const core = new Core(argv);
// 1. IPC server
core.on('ipc:server:start', () => {
    debug('ipc server started. server id = ' + core.ipc.config.id)
    // 2. IPC log listener
    core.ipcLogListener()
    // 3. DB Setup
    core.dbSetup().then(() => {
        core.ipcListenersThatPropogateToDb()
        // 4. HTTP server
        if ( !core.options.disableHttpInterface ) {
            core.httpSetup()
        }
        // 5. Sub-processes
        core.spinUpSubProcesses()
    }).catch(err => {
        core.shutdownWithError(err)
    })
})
core.on('ipc:server:error', (err) => {
    core.shutdownWithError(err)
})