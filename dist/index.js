'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var child_process_1 = require("child_process");
var express = require("express");
var body_parser_1 = require("body-parser");
var apollo_server_express_1 = require("apollo-server-express");
var schema_1 = __importDefault(require("./graphql/schema"));
var database_1 = __importDefault(require("./storage/database"));
var assert_1 = require("assert");
var path_1 = require("path");
var ipc_server_1 = __importDefault(require("./interfaces/ipc-server"));
var debug_1 = __importDefault(require("debug"));
var cors_1 = __importDefault(require("cors"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var Core = /** @class */ (function (_super) {
    __extends(Core, _super);
    function Core(args) {
        var _this = this;
        debug(args);
        _this = _super.call(this, args.ipcServerId) || this;
        _this.options = args;
        _this.db = null;
        _this.server = null;
        _this.subProcesses = [];
        return _this;
    }
    Core.prototype.sendEventLog = function (message) {
        if (process.send) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({ event: constants_1.EVENT_LOG, message: message });
        }
        else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        this.db.addLog({ message: message });
    };
    Core.prototype.ipcLogListener = function () {
        this.ipc.server.on(constants_1.EVENT_LOG, this.sendEventLog.bind(this));
    };
    Core.prototype.ipcListenersThatPropogateToDb = function () {
        var _this = this;
        assert_1.notEqual(this.db, null, 'ipcListenersThatPropogateToDb called without db instantiated');
        this.ipc.server.on(constants_1.DATA, function (data) {
            switch (data.type) {
                case constants_1.DATA_TYPES.PEER_CONNECTED:
                    return _this.db.addPeer(data.peerId);
                case constants_1.DATA_TYPES.PEER_DISCONNECTED:
                    return _this.db.removePeer(data.peerId);
                default:
                    return null;
            }
        });
    };
    Core.prototype.dbSetup = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db = new database_1.default();
            _this.db.init().then(function () {
                debug('database instance created');
                _this.sendEventLog('Core database connected');
                resolve();
            }).catch(function (err) {
                error('error creating database instance', err);
                reject(err);
            });
        });
    };
    /**
     * Note that the http server depends on both the ipc server AND the database
     */
    Core.prototype.httpSetup = function () {
        var _this = this;
        assert_1.notEqual(this.ipc, null, 'http server requires instance of ipc server');
        assert_1.notEqual(this.db, null, 'http server requires instance of db');
        var expressServer = express();
        var graphqlSchema = schema_1.default(this.db);
        expressServer.use('/graphql', cors_1.default({ origin: 'http://localhost:3000' }), body_parser_1.json(), apollo_server_express_1.graphqlExpress({ schema: graphqlSchema }));
        expressServer.get('/graphiql', apollo_server_express_1.graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        this.server = expressServer.listen(this.options.httpPort, function () {
            var address = _this.server.address();
            debug('Express server running on port: ' + address.port);
            _this.sendEventLog('Core http server started');
        });
        this.server.on('error', this.shutdownWithError.bind(this));
    };
    Core.prototype.shutdownWithError = function (err) {
        var _this = this;
        error('core shutting down with error\n', err);
        if (this.ipc && this.ipc.server)
            this.ipc.server.stop();
        if (this.server !== null && this.server.close)
            this.server.close();
        var dbConnecitonPromise = this.db === null ? Promise.resolve() : this.db.close();
        dbConnecitonPromise.then(function () {
            for (var i = 0; i < _this.subProcesses.length; i++) {
                var subprocess = _this.subProcesses[i];
                subprocess.kill();
            }
            process.exit(1);
        });
    };
    Core.prototype.spinUpSubProcesses = function () {
        debug('attempting to spawn sub processes');
        var p2pSubProcess = child_process_1.spawn('node', [path_1.join(__dirname, '../dist/p2p/index.js'), '--ipcServerId', this.options.ipcServerId], { stdio: ['inherit', 'inherit', 'inherit'] });
        p2pSubProcess.on('error', function (err) {
            error('p2pSubProcess failed to start: ', err);
        });
        p2pSubProcess.on('close', function (code) {
            debug('p2pSubProcess closed on us with code: ', code);
        });
        this.subProcesses.push(p2pSubProcess);
    };
    return Core;
}(ipc_server_1.default));
exports.default = Core;
//# sourceMappingURL=index.js.map