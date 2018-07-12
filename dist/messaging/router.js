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
                            debug('resolved all in router');
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
        return new Promise(function (resolve, reject) {
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
                console.log('errored', err);
                _this.registry.send(message); //send message to delete
                error(registry.name + ' failed to start: ', err);
                reject(err);
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
                console.log('closed');
                _this.registry.send(message); //send message to delete
                debug(registry.name + ' closed on us with code: ', code);
            });
            //message from child process
            current_process.on('message', function (message) {
                //Process attachment for registry can only happen from here.
                if (message.event == 'register_process' &&
                    message.data.request == 'add_to_registry') {
                    message.data.process = current_process;
                }
                _this.invokeSubProcess(message, registry.name)
                    .then(function () {
                    //detect the fact that it was registered
                    if ('process' in message.data) {
                        debug('Loaded process: ' + registry.name);
                        resolve(); //Main resolve.  This is very important
                    }
                })
                    .catch(function (e) {
                    reject(e);
                });
            });
        });
    };
    Router.prototype.invokeSubProcess = function (message, registry_name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.validate(message, registry_name)
                            .then(_this.verify.bind(_this)) //registration check
                            .then(_this.getInstance.bind(_this))
                            .then(_this.sendProcess.bind(_this))
                            .then(function () {
                            debug('sub process invoked for: ' + message.from);
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
                            resolve({ message: message, registry_name: registry_name });
                        }
                        else {
                            //debug(message)
                            reject(result.errors);
                        }
                    })];
            });
        });
    };
    //Verifies the existence of registry item.
    Router.prototype.verify = function (_a) {
        var message = _a.message, registry_name = _a.registry_name;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //Let's just make sure the originator isn't lying about its existance
                        var from_registry_item = _this.registry.registryByName(registry_name);
                        if (!from_registry_item) {
                            reject('No registry by that name.');
                        }
                        //Get the registry item attached to that message event
                        var registry_item = _this.registry.verifyEvent(message);
                        if (!registry_item) {
                            reject('Message event does not match any registry.');
                        }
                        //debug(from_registry_item.name + ' to ' + registry_item.name)
                        resolve({ message: message, registry_item: registry_item, from_registry_item: from_registry_item });
                    })];
            });
        });
    };
    Router.prototype.getInstance = function (_a) {
        var message = _a.message, registry_item = _a.registry_item, from_registry_item = _a.from_registry_item;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (registry_item.multi_instance == 0) {
                            //Single instance situation
                            var to_instance = registry_item.instances[0];
                            resolve({ message: message, registry_item: registry_item, to_instance: to_instance, from_registry_item: from_registry_item });
                        }
                        else {
                            //Multi-Instance
                            var to_instance = _this.getRegistryInstance(registry_item);
                            //Guess we've gotta invoke a new instance.
                            if (to_instance) {
                                resolve({ message: message, registry_item: registry_item, to_instance: to_instance, from_registry_item: from_registry_item });
                            }
                            else {
                                debug('Staring a new instance of ' + registry_item.name);
                                _this.createNewProcess(registry_item)
                                    .then(function () {
                                    //Gotta re-get the registry item.
                                    var registry_item = _this.registry.verifyEvent(message);
                                    var to_instance = _this.getRegistryInstance(registry_item);
                                    if (to_instance) {
                                        resolve({ message: message, registry_item: registry_item, to_instance: to_instance, from_registry_item: from_registry_item });
                                    }
                                    else {
                                        //unlikely, since it should be caught elsewhere.
                                        reject('Failed to invoke new process');
                                    }
                                })
                                    .catch(function (err) {
                                    debug('new instance didnt start');
                                    reject(err);
                                    return false;
                                });
                            }
                        }
                    })];
            });
        });
    };
    Router.prototype.getRegistryInstance = function (registry_item) {
        for (var i = 0; i < registry_item.instances.length; i++) {
            var instance = registry_item.instances[i];
            if (!instance.in_use) {
                var to_instance = instance; //used later when we send successfully to mark as in use
                return to_instance;
            }
        }
        return false;
    };
    Router.prototype.sendProcess = function (_a) {
        var message = _a.message, registry_item = _a.registry_item, to_instance = _a.to_instance, from_registry_item = _a.from_registry_item;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var to_process = to_instance.process;
                        if (typeof to_process == 'undefined') {
                            reject('No to_process');
                            return false;
                        }
                        switch (message.type_id) {
                            case 'message':
                                try {
                                    to_process.send(message);
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
                                _this.streamHander({ message: message, registry_item: registry_item, to_instance: to_instance, from_registry_item: from_registry_item })
                                    .then(function () {
                                    resolve(message);
                                }).catch(reject);
                                break;
                            default:
                                reject('No compatible registry type id');
                                break;
                        }
                    })];
            });
        });
    };
    Router.prototype.streamHander = function (_a) {
        var message = _a.message, registry_item = _a.registry_item, to_instance = _a.to_instance, from_registry_item = _a.from_registry_item;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //this is once again, very complex...
                        var to_process = to_instance.process;
                        var from_process = _this.registry.getFromProcess(message);
                        var stream_direction = message.data.stream_direction;
                        var transaction_type;
                        if (from_registry_item.type == 'subprocess' && registry_item.type == 'subprocess') {
                            transaction_type = 'sub2sub';
                        }
                        switch (stream_direction) {
                            case 'output':
                                if (from_registry_item.type == 'subprocess' && registry_item.type == 'main') {
                                    transaction_type = 'sub2main';
                                }
                                else if (from_registry_item.type == 'main' && registry_item.type == 'subprocess') {
                                    transaction_type = 'main2sub';
                                }
                                switch (transaction_type) {
                                    case 'sub2sub':
                                        to_process.stdio[4].on('error', function (err) {
                                            debug(err);
                                        });
                                        var from_stream = from_process.stdio[3];
                                        from_stream.pipe(to_process.stdio[4]);
                                        break;
                                    case 'sub2main':
                                        //pipe from_process.stdio[3] to to_process.stream
                                        //This one requires a stream that we can hook into on the class
                                        var from_stream = from_process.stdio[3];
                                        from_stream.pipe(to_process.stream);
                                        break;
                                    case 'main2sub':
                                        //pipe message.data.stream to to_process.stdio[4] (note that its not from_process.stream since from knows about the scenario)
                                        to_process.stdio[4].on('error', function (err) {
                                            debug(err);
                                        });
                                        message.data.stream(to_process.stdio[4]);
                                        break;
                                    default:
                                        reject('no transaction_type for output');
                                        break;
                                }
                                break;
                            case 'input':
                                if (from_registry_item.type == 'subprocess' && registry_item.type == 'main') {
                                    transaction_type = 'main2sub';
                                }
                                else if (from_registry_item.type == 'main' && registry_item.type == 'subprocess') {
                                    transaction_type = 'sub2main';
                                }
                                debug(transaction_type);
                                switch (transaction_type) {
                                    case 'sub2sub':
                                        from_process.stdio[4].on('error', function (err) {
                                            debug('Ignore this one: ' + err);
                                        });
                                        var to_stream = to_process.stdio[3];
                                        to_stream.pipe(from_process.stdio[4]);
                                        break;
                                    case 'sub2main':
                                        //pipe to_process.stdio[3] into message.data.stream  (note that its not from_process.stream since from knows about the scenario)
                                        var to_stream = to_process.stdio[3];
                                        to_stream.pipe(message.data.stream);
                                        break;
                                    case 'main2sub':
                                        //pipe to_process.stream into from_process.stdio[4]
                                        //This one, like the sub2main in output, requires an open stream we can latch onto.
                                        to_process.stream(from_process.stdio[4]);
                                        break;
                                    default:
                                        reject('no transaction_type for input');
                                        break;
                                }
                                break;
                            default:
                                reject('no input or output?');
                                break;
                        }
                        //Finally send off the message once the  pipes are made 
                        //(might need to change who the message is sent to based on which way the data is flowing)
                        try {
                            delete message.data.stream;
                            to_process.send(message);
                            if (registry_item.multi_instance) {
                                _this.registry.markUsed(registry_item.name, to_instance.instance_id);
                            }
                            resolve();
                        }
                        catch (error) {
                            console.log('failed send');
                            reject(error);
                        }
                    })];
            });
        });
    };
    return Router;
}());
exports.default = Router;
//# sourceMappingURL=router.js.map