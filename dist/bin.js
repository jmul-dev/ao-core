#!/usr/local/bin/node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var index_1 = __importDefault(require("./index"));
var minimist = require("minimist");
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var argv = minimist(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        httpPort: 3003,
        ipcServerId: constants_1.IPC_SERVER_ID,
    }
});
var core = new index_1.default(argv);
// 1. IPC server
core.on('ipc:server:start', function () {
    debug('ipc server started. server id = ' + core.ipc.config.id);
    // 2. IPC log listener
    core.ipcLogListener();
    // 3. DB Setup
    core.dbSetup().then(function () {
        core.ipcListenersThatPropogateToDb();
        // 4. HTTP server
        if (!core.options.disableHttpInterface) {
            core.httpSetup();
        }
        // 5. Sub-processes
        core.spinUpSubProcesses();
    }).catch(function (err) {
        core.shutdownWithError(err);
    });
});
core.on('ipc:server:error', function (err) {
    core.shutdownWithError(err);
});
//# sourceMappingURL=bin.js.map