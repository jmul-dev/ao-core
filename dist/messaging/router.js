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
var message_1 = __importDefault(require("./message"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var validation_schemas_1 = require("./validation_schemas");
var jsonschema_1 = require("jsonschema");
//import { RegistryObject } from './message_interfaces'
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
                        _this.registry.loopRegistries(function (registry) {
                            switch (registry.type) {
                                case 'main':
                                    //dont' do stuff for now.
                                    break;
                                default:
                                case 'subprocess':
                                    all_processes.push(_this.createNewProcess(registry));
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
    Router.prototype.createNewProcess = function (registry) {
        var _this = this;
        return new Promise(function (res, rej) {
            var current_process = child_process_1.spawn(process.execPath, [path_1.join(__dirname, '../../dist/' + registry.file)], {
                stdio: ['ipc', 'inherit', 'inherit', 'pipe', 'pipe'] // Note, first pipe is read from child, second is for write.  Original was:['ipc', 'inherit', 'inherit'] 
            });
            current_process.on('error', function (err) {
                var message = new message_1.default({
                    app_id: 'testing',
                    type_id: "message",
                    event: "register_process",
                    from: registry.name,
                    data: {
                        request: "delete_from_registry",
                        name: registry.name
                    },
                    encoding: "json"
                });
                _this.registry.send(message); //send message to delete
                error(registry.name + ' failed to start: ', err);
                rej(err);
            });
            current_process.on('close', function (code) {
                //Do we resolve or reject?
                var message = new message_1.default({
                    app_id: 'testing',
                    type_id: "message",
                    event: "register_process",
                    from: registry.name,
                    data: {
                        request: "delete_from_registry",
                        name: registry.name
                    },
                    encoding: "json"
                });
                _this.registry.send(message); //send message to delete
                debug(registry.name + ' closed on us with code: ', code);
            });
            //message from child process
            current_process.on('message', function (data) {
                var message = data.message;
                //data validation
                _this.invokeSubProcess(message, registry.name)
                    .catch(function (e) {
                    rej(e);
                });
            });
            res();
        });
    };
    Router.prototype.invokeSubProcess = function (message, registry_name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.validate(message, registry_name)
                            .then(_this.verify.bind(_this)) //registration check
                            .then(_this.callMethod.bind(_this))
                            .then(function () {
                            resolve();
                        })
                            .catch(function (err) {
                            error(err);
                            reject(err);
                        });
                    })];
            });
        });
    };
    //Validates the Message structure
    Router.prototype.validate = function (message, registry_name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (message.from != registry_name) {
                            //Fishy stuff by child process trying to act like they someone else.
                            reject('Looks like ' + registry_name + ' is being fishy. Its trying to act like its ' + message.from);
                        }
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
    //Verifies the existence of registry item.
    Router.prototype.verify = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var registry_item = _this.registry.verify(message);
                        if (!registry_item) {
                            reject('Registry does not exist or message event did not match.');
                        }
                        resolve({ registry_item: registry_item, message: message });
                    })];
            });
        });
    };
    // TODO: Refactor this thing
    Router.prototype.callMethod = function (_a) {
        var registry_item = _a.registry_item, message = _a.message;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (!registry_item.multi_instance) {
                            var to_process = registry_item.instances[0].process;
                        }
                        else {
                            //If its a multi-instance version, we need to ensure that the process is not in use
                            for (var i = 0; i < registry_item.instances.length; i++) {
                                var instance = registry_item.instances[i];
                                if (!instance.in_use) {
                                    var to_process = instance.process;
                                    var to_instance = instance; //used later when we send successfully to mark as in use
                                    break;
                                }
                            }
                            //Guess we've gotta invoke a new instance.
                            if (typeof to_process == 'undefined') {
                                console.log('Staring a new instance of ' + registry_item.name);
                                _this.createNewProcess(registry_item)
                                    .then(function () {
                                    //start over.
                                    _this.invokeSubProcess(message, registry_item.name)
                                        .then(function () {
                                        resolve();
                                    })
                                        .catch(function (err) {
                                        console.log('new instance didnt work out');
                                        reject(err);
                                    });
                                })
                                    .catch(function (err) {
                                    console.log('new instance didnt start');
                                    reject(err);
                                });
                            }
                        }
                        switch (message.type_id) {
                            case 'message':
                                try {
                                    to_process.send({ message: message });
                                    //Gotta mark this process as in_use
                                    if (registry_item.multi_instance) {
                                        _this.registry.markUsed(registry_item.name, to_instance.instance_id);
                                    }
                                }
                                catch (error) {
                                    reject(error);
                                }
                                resolve(message);
                                break;
                            case 'stream':
                                var from_process = _this.registry.getFromProcess(message);
                                break;
                            default:
                                reject('No compatible registry type id');
                                break;
                        }
                        //Let's handle the stream situation
                        if (message.data.stream_direction == 'output') {
                            var from_stream = from_process.stdio[3];
                            to_process.stdio[4].on('error', function (err) {
                                debug('Ignore this one: ' + err);
                            });
                            from_stream.pipe(to_process.stdio[4]);
                            to_process.send({ message: message });
                        }
                        else if (message.data.stream_direction == 'input') {
                            var to_stream = to_process.stdio[3];
                            from_process.stdio[4].on('error', function (err) {
                                debug('Ignore this one: ' + err);
                            });
                            to_stream.pipe(from_process.stdio[4]);
                            to_process.send({ message: message });
                        }
                    })];
            });
        });
    };
    return Router;
}());
exports.default = Router;
//# sourceMappingURL=router.js.map