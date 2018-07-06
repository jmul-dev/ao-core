'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var path_1 = __importDefault(require("path"));
var express = require("express");
var body_parser_1 = require("body-parser");
var apollo_server_express_1 = require("apollo-server-express");
var apollo_upload_server_1 = require("apollo-upload-server");
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
            _this.spinUpSubProcesses()
                .then(function () {
                //we've made above promise based since we need the router to be present for this shiz
                if (!_this.options.disableHttpInterface) {
                    _this.httpSetup();
                }
            })
                .catch(function (e) {
                error(e);
            });
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
        var graphqlSchema = schema_1.default(this.db, this.router);
        expressServer.use('/graphql', cors_1.default({ origin: 'http://localhost:3000' }), body_parser_1.json(), apollo_upload_server_1.apolloUploadExpress({ maxFieldSize: "1gb" }), apollo_server_express_1.graphqlExpress({ schema: graphqlSchema }));
        expressServer.get('/graphiql', apollo_server_express_1.graphiqlExpress({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
        expressServer.use('/assets', express.static(path_1.default.join(__dirname, '../assets')));
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
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        debug('attempting to spawn sub processes');
                        //Maybe pass the registry json itself over at the time of Registry contruction?
                        _this.registry = new registry_1.default();
                        _this.registry.initialize()
                            .then(function (router) {
                            _this.router = router;
                            _this.router.loadProcesses() // IPC server stuff will be taken out
                                .catch(function (e) {
                                reject(e);
                                error(e);
                            });
                        })
                            .catch(function (e) {
                            reject(e);
                            error(e);
                        });
                    })];
            });
        });
    };
    return Core;
}());
exports.default = Core;
//# sourceMappingURL=index.js.map