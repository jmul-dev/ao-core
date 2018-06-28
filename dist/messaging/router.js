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
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var validation_schemas_1 = require("./validation_schemas");
var jsonschema_1 = require("jsonschema");
var path_1 = require("path");
var child_process_1 = require("child_process");
var Router = /** @class */ (function () {
    function Router(registry) {
        this.message_schema = validation_schemas_1.message_schema;
        this.registry = registry;
    }
    Router.prototype.loadProcesses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var all_processes = [];
                        _this.registry.loopStoredRegistries(function (registry) {
                            switch (registry.type) {
                                case 'main':
                                    //dont' do stuff for now.
                                    break;
                                default:
                                case 'subprocess':
                                    all_processes.push(new Promise(function (res, rej) {
                                        var current_process = child_process_1.spawn(process.execPath, [path_1.join(__dirname, '../../dist/' + registry.file)], { stdio: ['ipc', 'inherit', 'inherit'] });
                                        current_process.on('error', function (err) {
                                            rej(err);
                                            //this.registry.send() //send message to delete
                                            error(registry.name + ' failed to start: ', err);
                                        });
                                        current_process.on('close', function (code) {
                                            //Do we resolve or reject?
                                            debug(registry.name + ' closed on us with code: ', code);
                                        });
                                        current_process.on('message', _this.send.bind(_this));
                                        res();
                                    }));
                                    break;
                            }
                        });
                        Promise.all(all_processes)
                            .then(function () {
                            resolve();
                        })
                            .catch(function (e) {
                            reject(e);
                            error(e);
                        });
                    })];
            });
        });
    };
    Router.prototype.send = function (message) {
        //data validation
        this.validate(message)
            .then(this.verify.bind(this)) //registration check
            .then(this.callMethod.bind(this))
            .catch(function (err) {
            error(err);
        });
    };
    Router.prototype.validate = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var result = jsonschema_1.validate(message, _this.message_schema);
                        if (result.valid) {
                            resolve(message);
                        }
                        else {
                            reject(result.errors);
                        }
                    })];
            });
        });
    };
    Router.prototype.verify = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.registry_item = _this.registry.verify(message);
                        if (!_this.registry_item) {
                            reject('Registry does not exist or message event did not match.');
                        }
                        resolve(message);
                    })];
            });
        });
    };
    Router.prototype.callMethod = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            switch (_this.registry_item.type) {
                                case 'main':
                                    //note that send is a normal method within the instantiated class
                                    _this.registry_item.process.send(message);
                                    break;
                                default:
                                case 'subprocess':
                                    _this.registry_item.process.send({ message: message });
                                    break;
                            }
                        }
                        catch (error) {
                            reject(error);
                        }
                        resolve(message);
                    })];
            });
        });
    };
    return Router;
}());
exports.default = Router;
//# sourceMappingURL=router.js.map