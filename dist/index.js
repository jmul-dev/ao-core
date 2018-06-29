'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var express = require("express");
var body_parser_1 = require("body-parser");
var apollo_server_express_1 = require("apollo-server-express");
var schema_1 = __importDefault(require("./graphql/schema"));
var database_1 = __importDefault(require("./storage/database"));
var assert_1 = require("assert");
var debug_1 = __importDefault(require("debug"));
var cors_1 = __importDefault(require("cors"));
var registry_1 = __importDefault(require("./messaging/registry"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var Core = /** @class */ (function () {
    function Core(args) {
        debug(args);
        this.options = args;
        this.db = null;
        this.server = null;
        this.subProcesses = [];
    }
    Core.prototype.init = function () {
        var _this = this;
        this.dbSetup()
            .then(function () {
            if (!_this.options.disableHttpInterface) {
                _this.httpSetup();
            }
            _this.spinUpSubProcesses();
        })
            .catch(function (e) {
            _this.shutdownWithError(e);
        });
    };
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
        var _this = this;
        debug('attempting to spawn sub processes');
        //Maybe pass the registry json itself over at the time of Registry contruction?
        this.registry = new registry_1.default();
        this.registry.initialize()
            .then(function (router) {
            _this.router = router;
            _this.router.loadProcesses() // IPC server stuff will taken out
                .catch(function (e) {
                error(e);
            });
        })
            .catch(function (e) {
            error(e);
        });
    };
    return Core;
}());
exports.default = Core;
//# sourceMappingURL=index.js.map