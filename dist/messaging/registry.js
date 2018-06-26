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
//Should the registry be a database/persisted storage thing?  If so, how far should we go with encryption?
var registry_schema_1 = __importDefault(require("./registry_schema"));
var process_schema_1 = __importDefault(require("./process_schema"));
var path_1 = require("path");
var child_process_1 = require("child_process");
var debug_1 = __importDefault(require("debug"));
var router_1 = __importDefault(require("./router"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var model_registry = [
    {
        priority: 0,
        name: 'p2pSubProcess',
        type: 'system',
        file: '/p2p/index.js',
        events: [
            "p2p_lookup",
            "p2p_peer_count"
        ]
    }
];
var Registry = /** @class */ (function () {
    function Registry() {
        this.events_registry = {}; //Used to tie together events to a registry by name
        this.registry_by_name = {}; //Now you can use a name to just pull the registry item
        //Validation Schema
        this.registry_schema = registry_schema_1.default;
        this.process_schema = process_schema_1.default;
    }
    //Init the Registry and get yourself a router!
    Registry.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.loadRegistry()
                            .then(_this.loadProcesses.bind(_this))
                            .then(function () {
                            return new router_1.default(_this);
                        })
                            .catch(function (e) {
                            error(e);
                        });
                    })];
            });
        });
    };
    Registry.prototype.loadRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //read from FS and decode later using a key? will have to figure this out.
                        _this.model_registry = model_registry;
                        //repacking information for easy use            
                        for (var i = 0; i < model_registry.length; i++) {
                            var registry = model_registry[i];
                            _this.registry_by_name[registry.name] = registry;
                            for (var e = 0; e < registry.events.length; e++) {
                                var event = registry.events[e];
                                _this.events_registry[event] = registry.name;
                            }
                        }
                        resolve();
                    })];
            });
        });
    };
    Registry.prototype.addRegistry = function (new_registry) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //add to the model
                        //save the model
                        return;
                    })];
            });
        });
    };
    Registry.prototype.loadProcesses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var all_processes = [];
                        var _loop_1 = function (i) {
                            var registry = _this.model_registry[i];
                            all_processes.push(new Promise(function (res, rej) {
                                var current_process = child_process_1.spawn('node', [path_1.join(__dirname, '../../dist/' + registry.file)], { stdio: ['inherit', 'inherit', 'inherit'] });
                                current_process.on('error', function (err) {
                                    error(registry.name + ' failed to start: ', err);
                                });
                                current_process.on('close', function (code) {
                                    debug(registry.name + ' closed on us with code: ', code);
                                });
                                _this.model_registry[i].process = current_process;
                                res();
                            }));
                        };
                        for (var i = 0; i < _this.model_registry.length; i++) {
                            _loop_1(i);
                        }
                        Promise.all(all_processes)
                            .then(function () {
                            resolve();
                        })
                            .catch(function (e) {
                            error(e);
                        });
                    })];
            });
        });
    };
    Registry.prototype.verify = function (message) {
        //verify that we do/don't have the registry
        var registry_name = this.events_registry[message.event];
        if (!registry_name) {
            return false;
        }
        var registry = this.registry_by_name[registry_name];
        if (registry) {
            return registry;
        }
        else {
            return false;
        }
    };
    return Registry;
}());
exports.default = Registry;
//# sourceMappingURL=registry.js.map