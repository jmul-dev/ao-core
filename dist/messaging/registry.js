'use strict';
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var validation_schemas_1 = require("./validation_schemas");
var jsonschema_1 = require("jsonschema");
var debug_1 = __importDefault(require("debug"));
var router_1 = __importDefault(require("./router"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var stored_registry = {
    registry: {
        status: false,
        priority: 0,
        type: 'main',
        file: '',
        events: [
            "register_process"
        ]
    },
    p2pSubProcess: {
        status: false,
        priority: 0,
        type: 'subprocess',
        file: '/p2p/index.js',
        events: [
            "p2p_lookup",
            "p2p_peer_count"
        ]
    }
};
var Registry = /** @class */ (function () {
    function Registry() {
        //Internal Data
        this.stored_registry = stored_registry;
        this.events_registry = {}; //Used to tie together events to a registry by name
        this.registry_by_name = {}; //Now you can use a name to just pull the registry item
        //Validation Schema
        this.registry_schema = validation_schemas_1.registry_schema;
        this.message_schema = validation_schemas_1.message_schema;
    }
    //Init the Registry and get yourself a router!
    Registry.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.initRegistry()
                            .then(function () {
                            _this.router = new router_1.default(_this);
                            resolve(_this.router);
                        })
                            .catch(function (e) {
                            error(e);
                            reject(e);
                        });
                    })];
            });
        });
    };
    //Maybe in the future we encrypt/decrypt the registry?  Maybe load a password/key to this loadRegistry?
    Registry.prototype.initRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //read from FS and decode later using a key? will have to figure this out.
                        // The "stored_registry" is a "mock" model registry for now.
                        for (var key in _this.stored_registry) {
                            //The only special case.
                            if (key == 'registry') {
                                _this.stored_registry[key].process = _this;
                                _this.stored_registry[key].status = 1; //make it active 
                            }
                            var registry = stored_registry[key];
                            _this.registry_by_name[key] = registry;
                            for (var e = 0; e < registry.events.length; e++) {
                                var event = registry.events[e];
                                _this.events_registry[event] = key;
                            }
                        }
                        resolve();
                    })];
            });
        });
    };
    Registry.prototype.loopRegistries = function (func) {
        for (var key in this.stored_registry) {
            var registry = this.stored_registry[key];
            func(registry);
        }
    };
    Registry.prototype.verify = function (message) {
        //verify that we do/don't have the registry
        var registry_name = this.events_registry[message.event];
        if (!registry_name) {
            debug('No event with matching registry');
            return false;
        }
        var registry = this.registry_by_name[registry_name];
        //Maybe add app id checking later
        if (registry) {
            return registry;
        }
        else {
            return false;
        }
    };
    //ability to receive messages from other 
    Registry.prototype.send = function (message) {
        //validate
        var result = jsonschema_1.validate(message, this.message_schema);
        if (!result.valid) {
            error(result.errors);
            return false;
        }
        //Verify
        var registry = this.verify(message);
        if (!registry) {
            return false;
        }
        switch (message.data.request) {
            case 'add_to_registry':
                this.addRegistry(message);
                break;
            default:
            case 'delete_from_registry':
                this.removeRegistry(message);
                break;
        }
    };
    Registry.prototype.addRegistry = function (message) {
        if (this.stored_registry[message.data.name].status) {
            error('Request to register a pre-registered process: ' + message.data.name);
            return false;
        }
        this.stored_registry[message.data.name].status = true;
        if (message.data.process) {
            this.stored_registry[message.data.name].process = message.data.process;
        }
    };
    Registry.prototype.removeRegistry = function (message) {
        if (this.stored_registry[message.data.name].status) {
            this.stored_registry[message.data.name].status = false;
        }
        else {
            error('Request to de-register an unassigned process: ' + message.data.name);
            return false;
        }
    };
    //TBD when we figure out if other processes can be added
    Registry.prototype.addNewProcess = function (registry) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var result = jsonschema_1.validate(registry, validation_schemas_1.registry_schema);
                        if (!result.valid) {
                            reject(result.errors);
                        }
                        delete registry.name;
                        registry.status = false;
                        //Add to the stored registry
                        _this.stored_registry[registry.name] = __assign({}, registry);
                        //Maybe a function here to write the new registry into the file??
                        resolve();
                    })];
            });
        });
    };
    return Registry;
}());
exports.default = Registry;
//# sourceMappingURL=registry.js.map