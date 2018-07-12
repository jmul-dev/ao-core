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
var database_1 = __importDefault(require("./storage/database"));
var debug_1 = __importDefault(require("debug"));
var registry_1 = __importDefault(require("./messaging/registry"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
//Main classes
var http_1 = __importDefault(require("./main/http"));
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
                    _this.http = new http_1.default(_this.db, _this.router, _this.options, _this.sendEventLog, _this.shutdownWithError);
                    _this.http.init()
                        .then(function (server) {
                        //this.server = server
                    })
                        .catch(function (e) { return error; });
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
                            _this.router.loadProcesses()
                                .then(function () {
                                resolve();
                            })
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