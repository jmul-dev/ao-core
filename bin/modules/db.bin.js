#!/usr/bin/env node
exports["db"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./dist/modules/db/db.bin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./dist/modules/db/db.bin.js":
/*!***********************************!*\
  !*** ./dist/modules/db/db.bin.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = __importDefault(__webpack_require__(/*! ./db */ "./dist/modules/db/db.js"));
var minimist = __webpack_require__(/*! minimist */ "./node_modules/minimist/index.js");
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var argv = minimist(process.argv.slice(2), {
    default: {
        storageLocation: path_1.default.resolve(__dirname, '../..', 'data'),
    }
});
if (__webpack_require__.c[__webpack_require__.s] === module) {
    new db_1.default(argv);
}
//# sourceMappingURL=db.bin.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./dist/modules/db/db.js":
/*!*******************************!*\
  !*** ./dist/modules/db/db.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AORouterInterface_1 = __importDefault(__webpack_require__(/*! ../../router/AORouterInterface */ "./dist/router/AORouterInterface.js"));
var nedb_1 = __importDefault(__webpack_require__(/*! nedb */ "./node_modules/nedb/index.js"));
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var debug_1 = __importDefault(__webpack_require__(/*! debug */ "./node_modules/debug/src/index.js"));
var debug = debug_1.default('ao:db');
var AODB = /** @class */ (function (_super) {
    __extends(AODB, _super);
    function AODB(args) {
        var _this = _super.call(this) || this;
        _this.userDbs = {};
        _this.storageLocation = args.storageLocation;
        _this.router.on('/db/logs/get', _this._logsGet.bind(_this));
        _this.router.on('/db/logs/insert', _this._logsInsert.bind(_this));
        _this.router.on('/db/settings/get', _this._settingsGet.bind(_this));
        _this.router.on('/db/settings/update', _this._settingsUpdate.bind(_this));
        _this.router.on('/db/user/init', _this._setupUserDb.bind(_this));
        _this.router.on('/db/user/get', _this._getUser.bind(_this));
        _this.router.on('/db/user/content/get', _this._userContentGet.bind(_this));
        _this.router.on('/db/user/content/insert', _this._userContentInsert.bind(_this));
        _this.router.on('/db/dats/init', _this._datsInit.bind(_this));
        _this.router.on('/db/dats/get', _this._datsGet.bind(_this));
        _this.router.on('/db/dats/insert', _this._datsInsert.bind(_this));
        _this.router.on('/db/dats/update', _this._datsUpdate.bind(_this));
        _this.router.on('/db/dats/remove', _this._datsRemove.bind(_this));
        _this._setupCoreDbs();
        debug("started");
        _this.router.send('/core/log', { message: "[AO DB] Core database initialized" });
        return _this;
    }
    AODB.prototype._setupCoreDbs = function () {
        var _this = this;
        this.db = {
            logs: new nedb_1.default({
                inMemoryOnly: true,
            }),
            settings: new nedb_1.default({
                filename: path_1.default.resolve(this.storageLocation, 'settings.db.json'),
                autoload: true,
                onload: function (error) {
                    if (error) {
                        _this._handleCoreDbLoadError(error);
                    }
                    else {
                        // Load default settings (insert will not overwrite existing settings)
                        Object.keys(AODB.DEFAULT_SETTINGS).forEach(function (settingName) {
                            var settingValue = AODB.DEFAULT_SETTINGS[settingName];
                            _this.db.settings.insert({ setting: settingName, value: settingValue });
                        });
                    }
                }
            })
        };
        // Logs expire after 48 hrs
        this.db.logs.ensureIndex({
            fieldName: 'createdAt',
            // @ts-ignore Types not quite up to par
            expireAfterSeconds: 3600 * 48,
        });
        // Settings indexed by name (unique)
        this.db.settings.ensureIndex({
            fieldName: 'setting',
            unique: true,
        });
    };
    AODB.prototype._setupUserDb = function (request) {
        var _this = this;
        var requestData = request.data;
        if (!request.ethAddress) {
            request.reject(new Error('user db init requires eth address'));
            return;
        }
        if (this.userDbs[request.ethAddress] instanceof nedb_1.default) {
            request.respond({ loaded: true });
            return;
        }
        this.userDbs[request.ethAddress] = new nedb_1.default({
            filename: path_1.default.resolve(this.storageLocation, 'users', request.ethAddress, 'content.db.json'),
            autoload: false,
        });
        this.userDbs[request.ethAddress].loadDatabase(function (error) {
            _this.router.send('/core/log', { message: "[AO DB] User database initialized for " + request.ethAddress });
            if (error) {
                request.reject(error);
                _this.userDbs[request.ethAddress] = undefined;
            }
            else {
                request.respond({ loaded: true });
            }
        });
    };
    AODB.prototype._getUser = function (request) {
        request.respond({ ethAddress: request.ethAddress });
    };
    AODB.prototype._handleCoreDbLoadError = function (error) {
        if (error) {
            debug('Error loading core db', error);
            // TODO: handle gracefully?
        }
        else {
            // TODO: we might need to drop some data (ex: peers) from previous session
        }
    };
    AODB.prototype._userContentGet = function (request) {
        var requestData = request.data;
        var query = requestData.query || {};
        var userDb = this.userDbs[request.ethAddress];
        if (!userDb) {
            request.reject(new Error("User db not found for " + request.ethAddress));
            return;
        }
        userDb.find(query).exec(function (error, docs) {
            if (error) {
                request.reject(error);
            }
            else {
                request.respond(docs);
            }
        });
    };
    AODB.prototype._userContentInsert = function (request) {
        var requestData = request.data; // TODO: type check/validate content
        var userDb = this.userDbs[request.ethAddress];
        if (!userDb) {
            request.reject(new Error("User db not found for " + request.ethAddress));
            return;
        }
        userDb.insert(requestData, function (error, doc) {
            if (error) {
                request.reject(error);
            }
            else {
                request.respond(doc);
            }
        });
    };
    AODB.prototype._logsGet = function (request) {
        var requestData = request.data;
        var query = requestData.query || {};
        this.db.logs.find(query).sort({ createdAt: 1 }).exec(function (error, results) {
            if (error) {
                request.reject(error);
            }
            else {
                request.respond(results);
            }
        });
    };
    AODB.prototype._logsInsert = function (request) {
        var requestData = request.data;
        var log = requestData;
        if (!log.message) {
            request.reject(new Error('Invalid data format for log insert, "message" field required'));
            return;
        }
        if (!log.createdAt || !(log.createdAt instanceof Date)) {
            log.createdAt = new Date();
        }
        this.db.logs.insert(log, function (error, doc) {
            if (error) {
                request.reject(error);
            }
            else {
                request.respond(doc);
            }
        });
    };
    AODB.prototype._settingsGet = function (request) {
        var requestData = request.data;
        var query = requestData.query || {};
        this.db.settings.find(query).exec(function (error, results) {
            if (error) {
                request.reject(error);
            }
            else {
                var keyValueSettings = results.reduce(function (values, settingEntry) {
                    var _a;
                    return (__assign({}, values, (_a = {}, _a[settingEntry.setting] = settingEntry.value, _a)));
                }, {});
                request.respond(keyValueSettings);
            }
        });
    };
    AODB.prototype._settingsUpdate = function (request) {
        var _this = this;
        var requestData = request.data;
        var settings = requestData;
        var options = {
            upsert: true
        };
        var updatePromises = [];
        Object.keys(settings).forEach(function (settingName) {
            updatePromises.push(new Promise(function (resolve, reject) {
                var query = {
                    setting: settingName,
                };
                var update = {
                    setting: settingName,
                    value: settings[settingName]
                };
                _this.db.settings.update(query, update, options, function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            }));
        });
        Promise.all(updatePromises).then(function () {
            // We return all settings
            _this.db.settings.find({}).exec(function (error, results) {
                if (error) {
                    request.reject(error);
                }
                else {
                    var keyValueSettings = results.reduce(function (values, settingEntry) {
                        var _a;
                        return (__assign({}, values, (_a = {}, _a[settingEntry.setting] = settingEntry.value, _a)));
                    }, {});
                    request.respond(keyValueSettings);
                }
            });
        }).catch(request.reject);
    };
    AODB.prototype._datsInit = function (request) {
        var _this = this;
        //const requestData: AODB_DatsInit_Data = request.data
        this.db.dats = new nedb_1.default({
            filename: path_1.default.resolve(this.storageLocation, 'users', request.ethAddress, 'dats.db.json'),
            autoload: true,
            onload: function (error) {
                if (error) {
                    _this._handleCoreDbLoadError(error);
                    request.reject(new Error('Error loading up Dats DB'));
                }
                else {
                    //let's return everything from init
                    _this.db.dats.find({}).exec(function (err, results) {
                        if (err) {
                            request.reject(err);
                        }
                        else {
                            var returnValue = {};
                            for (var i = 0; i < results.length; i++) {
                                var result = results[i];
                                returnValue[result['key']] = result;
                            }
                            request.respond(returnValue);
                        }
                    });
                }
            }
        });
    };
    AODB.prototype._datsGet = function (request) {
        var requestData = request.data;
        if (!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'));
        }
        else {
            var query = requestData.query || {};
            this.db.dats.find(query).exec(function (err, results) {
                if (err) {
                    request.reject(err);
                }
                else {
                    if (Array.isArray(results)) {
                        var returnValue = {};
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i];
                            returnValue[result['key']] = result;
                        }
                        request.respond(returnValue);
                    }
                    else {
                        request.respond(results);
                    }
                }
            });
        }
    };
    AODB.prototype._datsInsert = function (request) {
        var requestData = request.data;
        if (!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'));
        }
        else {
            if (!requestData.createdAt || !(requestData.createdAt instanceof Date)) {
                requestData.createdAt = new Date();
            }
            if (!requestData.updatedAt || !(requestData.updatedAt instanceof Date)) {
                requestData.updatedAt = requestData.createdAt;
            }
            this.db.dats.insert(requestData, function (err) {
                if (err) {
                    debug('Error inserting new dat');
                    request.reject(err);
                }
                request.respond(requestData);
            });
        }
    };
    AODB.prototype._datsUpdate = function (request) {
        var requestData = request.data;
        if (!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'));
        }
        else {
            var options = {};
            requestData.update.updatedAt = new Date();
            this.db.dats.update(requestData.query, requestData.update, options, function (err, numReplaced) {
                if (err) {
                    request.reject(err);
                }
                debug('Update replaced ' + numReplaced + ' dat record(s)');
                request.respond({});
            });
        }
    };
    AODB.prototype._datsRemove = function (request) {
        var requestData = request.data;
        if (!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'));
        }
        else {
            this.db.dats.remove(requestData.query, {}, function (err, numRemoved) {
                if (err) {
                    request.reject(err);
                }
                debug('Removed ' + numRemoved + ' dat record(s)');
                request.respond({});
            });
        }
    };
    AODB.DEFAULT_SETTINGS = {
        maxDiskSpace: -1,
        maxBandwidthUp: -1,
        maxBandwidthDown: -1,
        maxPeerConnections: -1,
        runInBackground: false,
        runOnStartup: false,
        checkForUpdates: true,
    };
    return AODB;
}(AORouterInterface_1.default));
exports.default = AODB;
//# sourceMappingURL=db.js.map

/***/ }),

/***/ "./dist/router/AORouterCoreProcessPretender.js":
/*!*****************************************************!*\
  !*** ./dist/router/AORouterCoreProcessPretender.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(/*! events */ "events");
/**
 * AORouterCoreProcessPretender
 *
 * In order to keep the AORouter clean, we are making the core router
 * interface appear as a "process", or at least have the same
 * methods that the subprocesses would use to communicate up to
 * the router.
 */
var AORouterCoreProcessPretender = /** @class */ (function (_super) {
    __extends(AORouterCoreProcessPretender, _super);
    function AORouterCoreProcessPretender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AORouterCoreProcessPretender.prototype.send = function (message, callback) {
        this.emit('message', message);
        if (typeof callback === 'function')
            callback();
        return true;
    };
    return AORouterCoreProcessPretender;
}(events_1.EventEmitter));
exports.default = AORouterCoreProcessPretender;
//# sourceMappingURL=AORouterCoreProcessPretender.js.map

/***/ }),

/***/ "./dist/router/AORouterInterface.js":
/*!******************************************!*\
  !*** ./dist/router/AORouterInterface.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var events_1 = __webpack_require__(/*! events */ "events");
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var AORouterCoreProcessPretender_1 = __importDefault(__webpack_require__(/*! ./AORouterCoreProcessPretender */ "./dist/router/AORouterCoreProcessPretender.js"));
/**
 * Any class interfacing with the AORouter should handle these
 */
var AORouterInterface = /** @class */ (function () {
    function AORouterInterface() {
    }
    return AORouterInterface;
}());
/**
 * AOSubprocessRouter provides an abstraction on top of the
 * incoming and outgoing process messages. This simplifies
 * the API for subprocesses to interact with AO via the
 * following two mechanisms:
 *
 * 1. For sending messages/requests
 *      this.router.send('event', data).then().catch()
 *
 * 2. For handling incoming requests
 *      this.router.on('event', (incomingRequest) => {
 *          incomingRequest.respond(data)
 *          incomingRequest.reject(error)
 *      })
 */
var AOSubprocessRouter = /** @class */ (function (_super) {
    __extends(AOSubprocessRouter, _super);
    function AOSubprocessRouter() {
        var _this = _super.call(this) || this;
        _this.requestCount = 0;
        _this.processIdentifier = Math.random().toString(36).substring(5);
        _this.process = process;
        _this.process.on('message', _this._routeMessage.bind(_this));
        return _this;
    }
    /**
     * _routeMessage is used to wrap the incoming request
     * with a set of callbacks to respond directly to that
     * request
     *
     * @param message
     */
    AOSubprocessRouter.prototype._routeMessage = function (message) {
        if (message.responseId) {
            // This is a response to one of our earlier requests, we let 
            // the other event listener handle that
            return;
        }
        if (message.data && message.data.stream) {
            console.log('Subprocess - attempt to create readStream on fd4');
            message.data.stream = fs_1.default.createReadStream(null, { fd: 4 });
        }
        var incomingRequest = {
            id: message.requestId,
            event: message.event,
            data: message.data || {},
            ethAddress: message.ethAddress,
            respond: this._routeMessageResponse.bind(this, message, false),
            reject: this._routeMessageResponse.bind(this, message, true),
        };
        this.emit(message.event, incomingRequest);
    };
    AOSubprocessRouter.prototype._routeMessageResponse = function (originatingMessage, isReject, responseData) {
        var outgoingResponse = {
            routerMessageId: originatingMessage.routerMessageId,
            requestId: originatingMessage.requestId,
            responseId: originatingMessage.requestId,
            event: originatingMessage.event,
            ethAddress: originatingMessage.ethAddress,
            data: !isReject ? responseData : undefined,
            error: isReject ? (responseData instanceof Error ? responseData.message : responseData) : undefined,
        };
        this.process.send(outgoingResponse);
    };
    /**
     * Send-to-Router is wrapped in a promise for process
     * abstraction and better handling of responses.
     *
     * @param event
     * @param data
     * @returns Promise<any>
     */
    AOSubprocessRouter.prototype.send = function (event, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var requestId = _this.processIdentifier + ":" + ++_this.requestCount;
            var request = {
                requestId: requestId,
                event: event,
                data: data,
            };
            if (data && data.stream) {
                /**
                 * Reminder: we are sending the stream up to the parent
                 * process (core)
                 */
                var readableStream = data.stream;
                var outputStream = fs_1.default.createWriteStream(null, { fd: 4 });
                readableStream.pipe(outputStream);
                data.stream = true; // We dont pass the stream object through to the router 
            }
            _this.process.send(request, function (error) {
                if (error) {
                    // TODO data.stream.unpipe(this.process.stdio[3])
                    return reject(error);
                }
                _this.process.on('message', function (message) {
                    if (message.requestId === request.requestId) {
                        if (message.error) {
                            reject(message.error);
                        }
                        else {
                            resolve(message);
                        }
                    }
                });
            });
        });
    };
    return AOSubprocessRouter;
}(events_1.EventEmitter));
exports.AOSubprocessRouter = AOSubprocessRouter;
/**
 * Same as AOSubprocessRouter, but since this is running on the same process
 * as the router/core we need to make some modifications.
 */
var AOCoreProcessRouter = /** @class */ (function (_super) {
    __extends(AOCoreProcessRouter, _super);
    function AOCoreProcessRouter() {
        var _this = _super.call(this) || this;
        _this.requestCount = 0;
        _this.processIdentifier = Math.random().toString(36).substring(5);
        _this.process = new AORouterCoreProcessPretender_1.default();
        _this.process.on('message', _this._routeMessage.bind(_this));
        return _this;
    }
    /**
     * _routeMessage is used to wrap the incoming request
     * with a set of callbacks to respond directly to that
     * request
     *
     * @param message
     */
    AOCoreProcessRouter.prototype._routeMessage = function (message) {
        if (message.responseId) {
            // This is a response to one of our earlier requests, we let 
            // the other event listener handle that
            return;
        }
        var incomingRequest = {
            id: message.requestId,
            event: message.event,
            data: message.data || {},
            ethAddress: message.ethAddress,
            respond: this._routeMessageResponse.bind(this, message, false),
            reject: this._routeMessageResponse.bind(this, message, true),
        };
        this.emit(message.event, incomingRequest);
    };
    AOCoreProcessRouter.prototype._routeMessageResponse = function (originatingMessage, isReject, responseData) {
        var outgoingResponse = {
            routerMessageId: originatingMessage.routerMessageId,
            requestId: originatingMessage.requestId,
            responseId: originatingMessage.requestId,
            event: originatingMessage.event,
            ethAddress: originatingMessage.ethAddress,
            data: !isReject ? responseData : undefined,
            error: isReject ? (responseData instanceof Error ? responseData.message : responseData) : undefined,
        };
        this.process.send(outgoingResponse);
    };
    /**
     * Send-to-Router is wrapped in a promise for process
     * abstraction and better handling of responses.
     *
     * @param event
     * @param data
     * @returns Promise<any>
     */
    AOCoreProcessRouter.prototype.send = function (event, data) {
        var _this = this;
        // TODO: if we are sending a stream, make sure our stdio fd is not in use!
        // If so we need to move this onto a queue
        return new Promise(function (resolve, reject) {
            var requestId = _this.processIdentifier + ":" + ++_this.requestCount;
            var request = {
                requestId: requestId,
                event: event,
                data: data,
            };
            _this.process.send(request, function (error) {
                if (error) {
                    return reject(error);
                }
                _this.process.on('message', function (message) {
                    if (message.requestId === request.requestId) {
                        if (message.error) {
                            reject(message.error);
                        }
                        else {
                            resolve(message);
                        }
                    }
                });
            });
        });
    };
    return AOCoreProcessRouter;
}(events_1.EventEmitter));
exports.AOCoreProcessRouter = AOCoreProcessRouter;
/**
 * AORouterInterface
 *
 * Simple wrapper around the process router for now, but
 * will extend to handle lifecycle events as well.
 */
var AORouterSubprocessInterface = /** @class */ (function () {
    function AORouterSubprocessInterface() {
        this.router = new AOSubprocessRouter();
    }
    return AORouterSubprocessInterface;
}());
exports.default = AORouterSubprocessInterface;
var AORouterCoreProcessInterface = /** @class */ (function () {
    function AORouterCoreProcessInterface() {
        this.router = new AOCoreProcessRouter();
    }
    return AORouterCoreProcessInterface;
}());
exports.AORouterCoreProcessInterface = AORouterCoreProcessInterface;
//# sourceMappingURL=AORouterInterface.js.map

/***/ }),

/***/ "./node_modules/binary-search-tree/index.js":
/*!**************************************************!*\
  !*** ./node_modules/binary-search-tree/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports.BinarySearchTree = __webpack_require__(/*! ./lib/bst */ "./node_modules/binary-search-tree/lib/bst.js");
module.exports.AVLTree = __webpack_require__(/*! ./lib/avltree */ "./node_modules/binary-search-tree/lib/avltree.js");


/***/ }),

/***/ "./node_modules/binary-search-tree/lib/avltree.js":
/*!********************************************************!*\
  !*** ./node_modules/binary-search-tree/lib/avltree.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Self-balancing binary search tree using the AVL implementation
 */
var BinarySearchTree = __webpack_require__(/*! ./bst */ "./node_modules/binary-search-tree/lib/bst.js")
  , customUtils = __webpack_require__(/*! ./customUtils */ "./node_modules/binary-search-tree/lib/customUtils.js")
  , util = __webpack_require__(/*! util */ "util")
  , _ = __webpack_require__(/*! underscore */ "./node_modules/binary-search-tree/node_modules/underscore/underscore.js")
  ;


/**
 * Constructor
 * We can't use a direct pointer to the root node (as in the simple binary search tree)
 * as the root will change during tree rotations
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function AVLTree (options) {
  this.tree = new _AVLTree(options);
}


/**
 * Constructor of the internal AVLTree
 * @param {Object} options Optional
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Key}      options.key Initialize this BST's key with key
 * @param {Value}    options.value Initialize this BST's data with [value]
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function _AVLTree (options) {
  options = options || {};

  this.left = null;
  this.right = null;
  this.parent = options.parent !== undefined ? options.parent : null;
  if (options.hasOwnProperty('key')) { this.key = options.key; }
  this.data = options.hasOwnProperty('value') ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
  this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
}


/**
 * Inherit basic functions from the basic binary search tree
 */
util.inherits(_AVLTree, BinarySearchTree);

/**
 * Keep a pointer to the internal tree constructor for testing purposes
 */
AVLTree._AVLTree = _AVLTree;


/**
 * Check the recorded height is correct for every node
 * Throws if one height doesn't match
 */
_AVLTree.prototype.checkHeightCorrect = function () {
  var leftH, rightH;

  if (!this.hasOwnProperty('key')) { return; }   // Empty tree

  if (this.left && this.left.height === undefined) { throw new Error("Undefined height for node " + this.left.key); }
  if (this.right && this.right.height === undefined) { throw new Error("Undefined height for node " + this.right.key); }
  if (this.height === undefined) { throw new Error("Undefined height for node " + this.key); }

  leftH = this.left ? this.left.height : 0;
  rightH = this.right ? this.right.height : 0;

  if (this.height !== 1 + Math.max(leftH, rightH)) { throw new Error("Height constraint failed for node " + this.key); }
  if (this.left) { this.left.checkHeightCorrect(); }
  if (this.right) { this.right.checkHeightCorrect(); }
};


/**
 * Return the balance factor
 */
_AVLTree.prototype.balanceFactor = function () {
  var leftH = this.left ? this.left.height : 0
    , rightH = this.right ? this.right.height : 0
    ;
  return leftH - rightH;
};


/**
 * Check that the balance factors are all between -1 and 1
 */
_AVLTree.prototype.checkBalanceFactors = function () {
  if (Math.abs(this.balanceFactor()) > 1) { throw new Error('Tree is unbalanced at node ' + this.key); }

  if (this.left) { this.left.checkBalanceFactors(); }
  if (this.right) { this.right.checkBalanceFactors(); }
};


/**
 * When checking if the BST conditions are met, also check that the heights are correct
 * and the tree is balanced
 */
_AVLTree.prototype.checkIsAVLT = function () {
  _AVLTree.super_.prototype.checkIsBST.call(this);
  this.checkHeightCorrect();
  this.checkBalanceFactors();
};
AVLTree.prototype.checkIsAVLT = function () { this.tree.checkIsAVLT(); };


/**
 * Perform a right rotation of the tree if possible
 * and return the root of the resulting tree
 * The resulting tree's nodes' heights are also updated
 */
_AVLTree.prototype.rightRotation = function () {
  var q = this
    , p = this.left
    , b
    , ah, bh, ch;

  if (!p) { return this; }   // No change

  b = p.right;

  // Alter tree structure
  if (q.parent) {
    p.parent = q.parent;
    if (q.parent.left === q) { q.parent.left = p; } else { q.parent.right = p; }
  } else {
    p.parent = null;
  }
  p.right = q;
  q.parent = p;
  q.left = b;
  if (b) { b.parent = q; }

  // Update heights
  ah = p.left ? p.left.height : 0;
  bh = b ? b.height : 0;
  ch = q.right ? q.right.height : 0;
  q.height = Math.max(bh, ch) + 1;
  p.height = Math.max(ah, q.height) + 1;

  return p;
};


/**
 * Perform a left rotation of the tree if possible
 * and return the root of the resulting tree
 * The resulting tree's nodes' heights are also updated
 */
_AVLTree.prototype.leftRotation = function () {
  var p = this
    , q = this.right
    , b
    , ah, bh, ch;

  if (!q) { return this; }   // No change

  b = q.left;

  // Alter tree structure
  if (p.parent) {
    q.parent = p.parent;
    if (p.parent.left === p) { p.parent.left = q; } else { p.parent.right = q; }
  } else {
    q.parent = null;
  }
  q.left = p;
  p.parent = q;
  p.right = b;
  if (b) { b.parent = p; }

  // Update heights
  ah = p.left ? p.left.height : 0;
  bh = b ? b.height : 0;
  ch = q.right ? q.right.height : 0;
  p.height = Math.max(ah, bh) + 1;
  q.height = Math.max(ch, p.height) + 1;

  return q;
};


/**
 * Modify the tree if its right subtree is too small compared to the left
 * Return the new root if any
 */
_AVLTree.prototype.rightTooSmall = function () {
  if (this.balanceFactor() <= 1) { return this; }   // Right is not too small, don't change

  if (this.left.balanceFactor() < 0) {
    this.left.leftRotation();
  }

  return this.rightRotation();
};


/**
 * Modify the tree if its left subtree is too small compared to the right
 * Return the new root if any
 */
_AVLTree.prototype.leftTooSmall = function () {
  if (this.balanceFactor() >= -1) { return this; }   // Left is not too small, don't change

  if (this.right.balanceFactor() > 0) {
    this.right.rightRotation();
  }

  return this.leftRotation();
};


/**
 * Rebalance the tree along the given path. The path is given reversed (as he was calculated
 * in the insert and delete functions).
 * Returns the new root of the tree
 * Of course, the first element of the path must be the root of the tree
 */
_AVLTree.prototype.rebalanceAlongPath = function (path) {
  var newRoot = this
    , rotated
    , i;

  if (!this.hasOwnProperty('key')) { delete this.height; return this; }   // Empty tree

  // Rebalance the tree and update all heights
  for (i = path.length - 1; i >= 0; i -= 1) {
    path[i].height = 1 + Math.max(path[i].left ? path[i].left.height : 0, path[i].right ? path[i].right.height : 0);

    if (path[i].balanceFactor() > 1) {
      rotated = path[i].rightTooSmall();
      if (i === 0) { newRoot = rotated; }
    }

    if (path[i].balanceFactor() < -1) {
      rotated = path[i].leftTooSmall();
      if (i === 0) { newRoot = rotated; }
    }
  }

  return newRoot;
};


/**
 * Insert a key, value pair in the tree while maintaining the AVL tree height constraint
 * Return a pointer to the root node, which may have changed
 */
_AVLTree.prototype.insert = function (key, value) {
  var insertPath = []
    , currentNode = this
    ;

  // Empty tree, insert as root
  if (!this.hasOwnProperty('key')) {
    this.key = key;
    this.data.push(value);
    this.height = 1;
    return this;
  }

  // Insert new leaf at the right place
  while (true) {
    // Same key: no change in the tree structure
    if (currentNode.compareKeys(currentNode.key, key) === 0) {
      if (currentNode.unique) {
        var err = new Error("Can't insert key " + key + ", it violates the unique constraint");
        err.key = key;
        err.errorType = 'uniqueViolated';
        throw err;
      } else {
        currentNode.data.push(value);
      }
      return this;
    }

    insertPath.push(currentNode);

    if (currentNode.compareKeys(key, currentNode.key) < 0) {
      if (!currentNode.left) {
        insertPath.push(currentNode.createLeftChild({ key: key, value: value }));
        break;
      } else {
        currentNode = currentNode.left;
      }
    } else {
      if (!currentNode.right) {
        insertPath.push(currentNode.createRightChild({ key: key, value: value }));
        break;
      } else {
        currentNode = currentNode.right;
      }
    }
  }

  return this.rebalanceAlongPath(insertPath);
};

// Insert in the internal tree, update the pointer to the root if needed
AVLTree.prototype.insert = function (key, value) {
  var newTree = this.tree.insert(key, value);

  // If newTree is undefined, that means its structure was not modified
  if (newTree) { this.tree = newTree; }
};


/**
 * Delete a key or just a value and return the new root of the tree
 * @param {Key} key
 * @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
 */
_AVLTree.prototype.delete = function (key, value) {
  var newData = [], replaceWith
    , self = this
    , currentNode = this
    , deletePath = []
    ;

  if (!this.hasOwnProperty('key')) { return this; }   // Empty tree

  // Either no match is found and the function will return from within the loop
  // Or a match is found and deletePath will contain the path from the root to the node to delete after the loop
  while (true) {
    if (currentNode.compareKeys(key, currentNode.key) === 0) { break; }

    deletePath.push(currentNode);

    if (currentNode.compareKeys(key, currentNode.key) < 0) {
      if (currentNode.left) {
        currentNode = currentNode.left;
      } else {
        return this;   // Key not found, no modification
      }
    } else {
      // currentNode.compareKeys(key, currentNode.key) is > 0
      if (currentNode.right) {
        currentNode = currentNode.right;
      } else {
        return this;   // Key not found, no modification
      }
    }
  }

  // Delete only a value (no tree modification)
  if (currentNode.data.length > 1 && value) {
    currentNode.data.forEach(function (d) {
      if (!currentNode.checkValueEquality(d, value)) { newData.push(d); }
    });
    currentNode.data = newData;
    return this;
  }

  // Delete a whole node

  // Leaf
  if (!currentNode.left && !currentNode.right) {
    if (currentNode === this) {   // This leaf is also the root
      delete currentNode.key;
      currentNode.data = [];
      delete currentNode.height;
      return this;
    } else {
      if (currentNode.parent.left === currentNode) {
        currentNode.parent.left = null;
      } else {
        currentNode.parent.right = null;
      }
      return this.rebalanceAlongPath(deletePath);
    }
  }


  // Node with only one child
  if (!currentNode.left || !currentNode.right) {
    replaceWith = currentNode.left ? currentNode.left : currentNode.right;

    if (currentNode === this) {   // This node is also the root
      replaceWith.parent = null;
      return replaceWith;   // height of replaceWith is necessarily 1 because the tree was balanced before deletion
    } else {
      if (currentNode.parent.left === currentNode) {
        currentNode.parent.left = replaceWith;
        replaceWith.parent = currentNode.parent;
      } else {
        currentNode.parent.right = replaceWith;
        replaceWith.parent = currentNode.parent;
      }

      return this.rebalanceAlongPath(deletePath);
    }
  }


  // Node with two children
  // Use the in-order predecessor (no need to randomize since we actively rebalance)
  deletePath.push(currentNode);
  replaceWith = currentNode.left;

  // Special case: the in-order predecessor is right below the node to delete
  if (!replaceWith.right) {
    currentNode.key = replaceWith.key;
    currentNode.data = replaceWith.data;
    currentNode.left = replaceWith.left;
    if (replaceWith.left) { replaceWith.left.parent = currentNode; }
    return this.rebalanceAlongPath(deletePath);
  }

  // After this loop, replaceWith is the right-most leaf in the left subtree
  // and deletePath the path from the root (inclusive) to replaceWith (exclusive)
  while (true) {
    if (replaceWith.right) {
      deletePath.push(replaceWith);
      replaceWith = replaceWith.right;
    } else {
      break;
    }
  }

  currentNode.key = replaceWith.key;
  currentNode.data = replaceWith.data;

  replaceWith.parent.right = replaceWith.left;
  if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }

  return this.rebalanceAlongPath(deletePath);
};

// Delete a value
AVLTree.prototype.delete = function (key, value) {
  var newTree = this.tree.delete(key, value);

  // If newTree is undefined, that means its structure was not modified
  if (newTree) { this.tree = newTree; }
};


/**
 * Other functions we want to use on an AVLTree as if it were the internal _AVLTree
 */
['getNumberOfKeys', 'search', 'betweenBounds', 'prettyPrint', 'executeOnEveryNode'].forEach(function (fn) {
  AVLTree.prototype[fn] = function () {
    return this.tree[fn].apply(this.tree, arguments);
  };
});


// Interface
module.exports = AVLTree;


/***/ }),

/***/ "./node_modules/binary-search-tree/lib/bst.js":
/*!****************************************************!*\
  !*** ./node_modules/binary-search-tree/lib/bst.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Simple binary search tree
 */
var customUtils = __webpack_require__(/*! ./customUtils */ "./node_modules/binary-search-tree/lib/customUtils.js");


/**
 * Constructor
 * @param {Object} options Optional
 * @param {Boolean}  options.unique Whether to enforce a 'unique' constraint on the key or not
 * @param {Key}      options.key Initialize this BST's key with key
 * @param {Value}    options.value Initialize this BST's data with [value]
 * @param {Function} options.compareKeys Initialize this BST's compareKeys
 */
function BinarySearchTree (options) {
  options = options || {};

  this.left = null;
  this.right = null;
  this.parent = options.parent !== undefined ? options.parent : null;
  if (options.hasOwnProperty('key')) { this.key = options.key; }
  this.data = options.hasOwnProperty('value') ? [options.value] : [];
  this.unique = options.unique || false;

  this.compareKeys = options.compareKeys || customUtils.defaultCompareKeysFunction;
  this.checkValueEquality = options.checkValueEquality || customUtils.defaultCheckValueEquality;
}


// ================================
// Methods used to test the tree
// ================================


/**
 * Get the descendant with max key
 */
BinarySearchTree.prototype.getMaxKeyDescendant = function () {
  if (this.right) {
    return this.right.getMaxKeyDescendant();
  } else {
    return this;
  }
};


/**
 * Get the maximum key
 */
BinarySearchTree.prototype.getMaxKey = function () {
  return this.getMaxKeyDescendant().key;
};


/**
 * Get the descendant with min key
 */
BinarySearchTree.prototype.getMinKeyDescendant = function () {
  if (this.left) {
    return this.left.getMinKeyDescendant()
  } else {
    return this;
  }
};


/**
 * Get the minimum key
 */
BinarySearchTree.prototype.getMinKey = function () {
  return this.getMinKeyDescendant().key;
};


/**
 * Check that all nodes (incl. leaves) fullfil condition given by fn
 * test is a function passed every (key, data) and which throws if the condition is not met
 */
BinarySearchTree.prototype.checkAllNodesFullfillCondition = function (test) {
  if (!this.hasOwnProperty('key')) { return; }

  test(this.key, this.data);
  if (this.left) { this.left.checkAllNodesFullfillCondition(test); }
  if (this.right) { this.right.checkAllNodesFullfillCondition(test); }
};


/**
 * Check that the core BST properties on node ordering are verified
 * Throw if they aren't
 */
BinarySearchTree.prototype.checkNodeOrdering = function () {
  var self = this;

  if (!this.hasOwnProperty('key')) { return; }

  if (this.left) {
    this.left.checkAllNodesFullfillCondition(function (k) {
      if (self.compareKeys(k, self.key) >= 0) {
        throw new Error('Tree with root ' + self.key + ' is not a binary search tree');
      }
    });
    this.left.checkNodeOrdering();
  }

  if (this.right) {
    this.right.checkAllNodesFullfillCondition(function (k) {
      if (self.compareKeys(k, self.key) <= 0) {
        throw new Error('Tree with root ' + self.key + ' is not a binary search tree');
      }
    });
    this.right.checkNodeOrdering();
  }
};


/**
 * Check that all pointers are coherent in this tree
 */
BinarySearchTree.prototype.checkInternalPointers = function () {
  if (this.left) {
    if (this.left.parent !== this) { throw new Error('Parent pointer broken for key ' + this.key); }
    this.left.checkInternalPointers();
  }

  if (this.right) {
    if (this.right.parent !== this) { throw new Error('Parent pointer broken for key ' + this.key); }
    this.right.checkInternalPointers();
  }
};


/**
 * Check that a tree is a BST as defined here (node ordering and pointer references)
 */
BinarySearchTree.prototype.checkIsBST = function () {
  this.checkNodeOrdering();
  this.checkInternalPointers();
  if (this.parent) { throw new Error("The root shouldn't have a parent"); }
};


/**
 * Get number of keys inserted
 */
BinarySearchTree.prototype.getNumberOfKeys = function () {
  var res;

  if (!this.hasOwnProperty('key')) { return 0; }

  res = 1;
  if (this.left) { res += this.left.getNumberOfKeys(); }
  if (this.right) { res += this.right.getNumberOfKeys(); }

  return res;
};



// ============================================
// Methods used to actually work on the tree
// ============================================

/**
 * Create a BST similar (i.e. same options except for key and value) to the current one
 * Use the same constructor (i.e. BinarySearchTree, AVLTree etc)
 * @param {Object} options see constructor
 */
BinarySearchTree.prototype.createSimilar = function (options) {
  options = options || {};
  options.unique = this.unique;
  options.compareKeys = this.compareKeys;
  options.checkValueEquality = this.checkValueEquality;

  return new this.constructor(options);
};


/**
 * Create the left child of this BST and return it
 */
BinarySearchTree.prototype.createLeftChild = function (options) {
  var leftChild = this.createSimilar(options);
  leftChild.parent = this;
  this.left = leftChild;

  return leftChild;
};


/**
 * Create the right child of this BST and return it
 */
BinarySearchTree.prototype.createRightChild = function (options) {
  var rightChild = this.createSimilar(options);
  rightChild.parent = this;
  this.right = rightChild;

  return rightChild;
};


/**
 * Insert a new element
 */
BinarySearchTree.prototype.insert = function (key, value) {
  // Empty tree, insert as root
  if (!this.hasOwnProperty('key')) {
    this.key = key;
    this.data.push(value);
    return;
  }

  // Same key as root
  if (this.compareKeys(this.key, key) === 0) {
    if (this.unique) {
      var err = new Error("Can't insert key " + key + ", it violates the unique constraint");
      err.key = key;
      err.errorType = 'uniqueViolated';
      throw err;
    } else {
      this.data.push(value);
    }
    return;
  }

  if (this.compareKeys(key, this.key) < 0) {
    // Insert in left subtree
    if (this.left) {
      this.left.insert(key, value);
    } else {
      this.createLeftChild({ key: key, value: value });
    }
  } else {
    // Insert in right subtree
    if (this.right) {
      this.right.insert(key, value);
    } else {
      this.createRightChild({ key: key, value: value });
    }
  }
};


/**
 * Search for all data corresponding to a key
 */
BinarySearchTree.prototype.search = function (key) {
  if (!this.hasOwnProperty('key')) { return []; }

  if (this.compareKeys(this.key, key) === 0) { return this.data; }

  if (this.compareKeys(key, this.key) < 0) {
    if (this.left) {
      return this.left.search(key);
    } else {
      return [];
    }
  } else {
    if (this.right) {
      return this.right.search(key);
    } else {
      return [];
    }
  }
};


/**
 * Return a function that tells whether a given key matches a lower bound
 */
BinarySearchTree.prototype.getLowerBoundMatcher = function (query) {
  var self = this;

  // No lower bound
  if (!query.hasOwnProperty('$gt') && !query.hasOwnProperty('$gte')) {
    return function () { return true; };
  }

  if (query.hasOwnProperty('$gt') && query.hasOwnProperty('$gte')) {
    if (self.compareKeys(query.$gte, query.$gt) === 0) {
      return function (key) { return self.compareKeys(key, query.$gt) > 0; };
    }

    if (self.compareKeys(query.$gte, query.$gt) > 0) {
      return function (key) { return self.compareKeys(key, query.$gte) >= 0; };
    } else {
      return function (key) { return self.compareKeys(key, query.$gt) > 0; };
    }
  }

  if (query.hasOwnProperty('$gt')) {
    return function (key) { return self.compareKeys(key, query.$gt) > 0; };
  } else {
    return function (key) { return self.compareKeys(key, query.$gte) >= 0; };
  }
};


/**
 * Return a function that tells whether a given key matches an upper bound
 */
BinarySearchTree.prototype.getUpperBoundMatcher = function (query) {
  var self = this;

  // No lower bound
  if (!query.hasOwnProperty('$lt') && !query.hasOwnProperty('$lte')) {
    return function () { return true; };
  }

  if (query.hasOwnProperty('$lt') && query.hasOwnProperty('$lte')) {
    if (self.compareKeys(query.$lte, query.$lt) === 0) {
      return function (key) { return self.compareKeys(key, query.$lt) < 0; };
    }

    if (self.compareKeys(query.$lte, query.$lt) < 0) {
      return function (key) { return self.compareKeys(key, query.$lte) <= 0; };
    } else {
      return function (key) { return self.compareKeys(key, query.$lt) < 0; };
    }
  }

  if (query.hasOwnProperty('$lt')) {
    return function (key) { return self.compareKeys(key, query.$lt) < 0; };
  } else {
    return function (key) { return self.compareKeys(key, query.$lte) <= 0; };
  }
};


// Append all elements in toAppend to array
function append (array, toAppend) {
  var i;

  for (i = 0; i < toAppend.length; i += 1) {
    array.push(toAppend[i]);
  }
}


/**
 * Get all data for a key between bounds
 * Return it in key order
 * @param {Object} query Mongo-style query where keys are $lt, $lte, $gt or $gte (other keys are not considered)
 * @param {Functions} lbm/ubm matching functions calculated at the first recursive step
 */
BinarySearchTree.prototype.betweenBounds = function (query, lbm, ubm) {
  var res = [];

  if (!this.hasOwnProperty('key')) { return []; }   // Empty tree

  lbm = lbm || this.getLowerBoundMatcher(query);
  ubm = ubm || this.getUpperBoundMatcher(query);

  if (lbm(this.key) && this.left) { append(res, this.left.betweenBounds(query, lbm, ubm)); }
  if (lbm(this.key) && ubm(this.key)) { append(res, this.data); }
  if (ubm(this.key) && this.right) { append(res, this.right.betweenBounds(query, lbm, ubm)); }

  return res;
};


/**
 * Delete the current node if it is a leaf
 * Return true if it was deleted
 */
BinarySearchTree.prototype.deleteIfLeaf = function () {
  if (this.left || this.right) { return false; }

  // The leaf is itself a root
  if (!this.parent) {
    delete this.key;
    this.data = [];
    return true;
  }

  if (this.parent.left === this) {
    this.parent.left = null;
  } else {
    this.parent.right = null;
  }

  return true;
};


/**
 * Delete the current node if it has only one child
 * Return true if it was deleted
 */
BinarySearchTree.prototype.deleteIfOnlyOneChild = function () {
  var child;

  if (this.left && !this.right) { child = this.left; }
  if (!this.left && this.right) { child = this.right; }
  if (!child) { return false; }

  // Root
  if (!this.parent) {
    this.key = child.key;
    this.data = child.data;

    this.left = null;
    if (child.left) {
      this.left = child.left;
      child.left.parent = this;
    }

    this.right = null;
    if (child.right) {
      this.right = child.right;
      child.right.parent = this;
    }

    return true;
  }

  if (this.parent.left === this) {
    this.parent.left = child;
    child.parent = this.parent;
  } else {
    this.parent.right = child;
    child.parent = this.parent;
  }

  return true;
};


/**
 * Delete a key or just a value
 * @param {Key} key
 * @param {Value} value Optional. If not set, the whole key is deleted. If set, only this value is deleted
 */
BinarySearchTree.prototype.delete = function (key, value) {
  var newData = [], replaceWith
    , self = this
    ;

  if (!this.hasOwnProperty('key')) { return; }

  if (this.compareKeys(key, this.key) < 0) {
    if (this.left) { this.left.delete(key, value); }
    return;
  }

  if (this.compareKeys(key, this.key) > 0) {
    if (this.right) { this.right.delete(key, value); }
    return;
  }

  if (!this.compareKeys(key, this.key) === 0) { return; }

  // Delete only a value
  if (this.data.length > 1 && value !== undefined) {
    this.data.forEach(function (d) {
      if (!self.checkValueEquality(d, value)) { newData.push(d); }
    });
    self.data = newData;
    return;
  }

  // Delete the whole node
  if (this.deleteIfLeaf()) {
    return;
  }
  if (this.deleteIfOnlyOneChild()) {
    return;
  }

  // We are in the case where the node to delete has two children
  if (Math.random() >= 0.5) {   // Randomize replacement to avoid unbalancing the tree too much
    // Use the in-order predecessor
    replaceWith = this.left.getMaxKeyDescendant();

    this.key = replaceWith.key;
    this.data = replaceWith.data;

    if (this === replaceWith.parent) {   // Special case
      this.left = replaceWith.left;
      if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }
    } else {
      replaceWith.parent.right = replaceWith.left;
      if (replaceWith.left) { replaceWith.left.parent = replaceWith.parent; }
    }
  } else {
    // Use the in-order successor
    replaceWith = this.right.getMinKeyDescendant();

    this.key = replaceWith.key;
    this.data = replaceWith.data;

    if (this === replaceWith.parent) {   // Special case
      this.right = replaceWith.right;
      if (replaceWith.right) { replaceWith.right.parent = replaceWith.parent; }
    } else {
      replaceWith.parent.left = replaceWith.right;
      if (replaceWith.right) { replaceWith.right.parent = replaceWith.parent; }
    }
  }
};


/**
 * Execute a function on every node of the tree, in key order
 * @param {Function} fn Signature: node. Most useful will probably be node.key and node.data
 */
BinarySearchTree.prototype.executeOnEveryNode = function (fn) {
  if (this.left) { this.left.executeOnEveryNode(fn); }
  fn(this);
  if (this.right) { this.right.executeOnEveryNode(fn); }
};


/**
 * Pretty print a tree
 * @param {Boolean} printData To print the nodes' data along with the key
 */
BinarySearchTree.prototype.prettyPrint = function (printData, spacing) {
  spacing = spacing || "";

  console.log(spacing + "* " + this.key);
  if (printData) { console.log(spacing + "* " + this.data); }

  if (!this.left && !this.right) { return; }

  if (this.left) {
    this.left.prettyPrint(printData, spacing + "  ");
  } else {
    console.log(spacing + "  *");
  }
  if (this.right) {
    this.right.prettyPrint(printData, spacing + "  ");
  } else {
    console.log(spacing + "  *");
  }
};




// Interface
module.exports = BinarySearchTree;


/***/ }),

/***/ "./node_modules/binary-search-tree/lib/customUtils.js":
/*!************************************************************!*\
  !*** ./node_modules/binary-search-tree/lib/customUtils.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Return an array with the numbers from 0 to n-1, in a random order
 */
function getRandomArray (n) {
  var res, next;

  if (n === 0) { return []; }
  if (n === 1) { return [0]; }

  res = getRandomArray(n - 1);
  next = Math.floor(Math.random() * n);
  res.splice(next, 0, n - 1);   // Add n-1 at a random position in the array

  return res;
};
module.exports.getRandomArray = getRandomArray;


/*
 * Default compareKeys function will work for numbers, strings and dates
 */
function defaultCompareKeysFunction (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  if (a === b) { return 0; }

  var err = new Error("Couldn't compare elements");
  err.a = a;
  err.b = b;
  throw err;
}
module.exports.defaultCompareKeysFunction = defaultCompareKeysFunction;


/**
 * Check whether two values are equal (used in non-unique deletion)
 */
function defaultCheckValueEquality (a, b) {
  return a === b;
}
module.exports.defaultCheckValueEquality = defaultCheckValueEquality;


/***/ }),

/***/ "./node_modules/binary-search-tree/node_modules/underscore/underscore.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/binary-search-tree/node_modules/underscore/underscore.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {}

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (true) {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);


/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/debug/src/debug.js");
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/debug.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/debug/src/browser.js");
} else {
  module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/debug/src/node.js");
}


/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(/*! tty */ "tty");
var util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(/*! ./debug */ "./node_modules/debug/src/debug.js");
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),

/***/ "./node_modules/minimist/index.js":
/*!****************************************!*\
  !*** ./node_modules/minimist/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (args, opts) {
    if (!opts) opts = {};
    
    var flags = { bools : {}, strings : {}, unknownFn: null };

    if (typeof opts['unknown'] === 'function') {
        flags.unknownFn = opts['unknown'];
    }

    if (typeof opts['boolean'] === 'boolean' && opts['boolean']) {
      flags.allBools = true;
    } else {
      [].concat(opts['boolean']).filter(Boolean).forEach(function (key) {
          flags.bools[key] = true;
      });
    }
    
    var aliases = {};
    Object.keys(opts.alias || {}).forEach(function (key) {
        aliases[key] = [].concat(opts.alias[key]);
        aliases[key].forEach(function (x) {
            aliases[x] = [key].concat(aliases[key].filter(function (y) {
                return x !== y;
            }));
        });
    });

    [].concat(opts.string).filter(Boolean).forEach(function (key) {
        flags.strings[key] = true;
        if (aliases[key]) {
            flags.strings[aliases[key]] = true;
        }
     });

    var defaults = opts['default'] || {};
    
    var argv = { _ : [] };
    Object.keys(flags.bools).forEach(function (key) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    
    var notFlags = [];

    if (args.indexOf('--') !== -1) {
        notFlags = args.slice(args.indexOf('--')+1);
        args = args.slice(0, args.indexOf('--'));
    }

    function argDefined(key, arg) {
        return (flags.allBools && /^--[^=]+$/.test(arg)) ||
            flags.strings[key] || flags.bools[key] || aliases[key];
    }

    function setArg (key, val, arg) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg) === false) return;
        }

        var value = !flags.strings[key] && isNumber(val)
            ? Number(val) : val
        ;
        setKey(argv, key.split('.'), value);
        
        (aliases[key] || []).forEach(function (x) {
            setKey(argv, x.split('.'), value);
        });
    }

    function setKey (obj, keys, value) {
        var o = obj;
        keys.slice(0,-1).forEach(function (key) {
            if (o[key] === undefined) o[key] = {};
            o = o[key];
        });

        var key = keys[keys.length - 1];
        if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
            o[key] = value;
        }
        else if (Array.isArray(o[key])) {
            o[key].push(value);
        }
        else {
            o[key] = [ o[key], value ];
        }
    }
    
    function aliasIsBoolean(key) {
      return aliases[key].some(function (x) {
          return flags.bools[x];
      });
    }

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        
        if (/^--.+=/.test(arg)) {
            // Using [\s\S] instead of . because js doesn't support the
            // 'dotall' regex modifier. See:
            // http://stackoverflow.com/a/1068308/13216
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            var key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
                value = value !== 'false';
            }
            setArg(key, value, arg);
        }
        else if (/^--no-.+/.test(arg)) {
            var key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false, arg);
        }
        else if (/^--.+/.test(arg)) {
            var key = arg.match(/^--(.+)/)[1];
            var next = args[i + 1];
            if (next !== undefined && !/^-/.test(next)
            && !flags.bools[key]
            && !flags.allBools
            && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            }
            else if (/^(true|false)$/.test(next)) {
                setArg(key, next === 'true', arg);
                i++;
            }
            else {
                setArg(key, flags.strings[key] ? '' : true, arg);
            }
        }
        else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1,-1).split('');
            
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
                var next = arg.slice(j+2);
                
                if (next === '-') {
                    setArg(letters[j], next, arg)
                    continue;
                }
                
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split('=')[1], arg);
                    broken = true;
                    break;
                }
                
                if (/[A-Za-z]/.test(letters[j])
                && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                
                if (letters[j+1] && letters[j+1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j+2), arg);
                    broken = true;
                    break;
                }
                else {
                    setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
                }
            }
            
            var key = arg.slice(-1)[0];
            if (!broken && key !== '-') {
                if (args[i+1] && !/^(-|--)[^-]/.test(args[i+1])
                && !flags.bools[key]
                && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i+1], arg);
                    i++;
                }
                else if (args[i+1] && /true|false/.test(args[i+1])) {
                    setArg(key, args[i+1] === 'true', arg);
                    i++;
                }
                else {
                    setArg(key, flags.strings[key] ? '' : true, arg);
                }
            }
        }
        else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(
                    flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
                );
            }
            if (opts.stopEarly) {
                argv._.push.apply(argv._, args.slice(i + 1));
                break;
            }
        }
    }
    
    Object.keys(defaults).forEach(function (key) {
        if (!hasKey(argv, key.split('.'))) {
            setKey(argv, key.split('.'), defaults[key]);
            
            (aliases[key] || []).forEach(function (x) {
                setKey(argv, x.split('.'), defaults[key]);
            });
        }
    });
    
    if (opts['--']) {
        argv['--'] = new Array();
        notFlags.forEach(function(key) {
            argv['--'].push(key);
        });
    }
    else {
        notFlags.forEach(function(key) {
            argv._.push(key);
        });
    }

    return argv;
};

function hasKey (obj, keys) {
    var o = obj;
    keys.slice(0,-1).forEach(function (key) {
        o = (o[key] || {});
    });

    var key = keys[keys.length - 1];
    return key in o;
}

function isNumber (x) {
    if (typeof x === 'number') return true;
    if (/^0x[0-9a-f]+$/i.test(x)) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}



/***/ }),

/***/ "./node_modules/mkdirp/index.js":
/*!**************************************!*\
  !*** ./node_modules/mkdirp/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(/*! path */ "path");
var fs = __webpack_require__(/*! fs */ "fs");
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ "./node_modules/nedb/index.js":
/*!************************************!*\
  !*** ./node_modules/nedb/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Datastore = __webpack_require__(/*! ./lib/datastore */ "./node_modules/nedb/lib/datastore.js");

module.exports = Datastore;


/***/ }),

/***/ "./node_modules/nedb/lib/cursor.js":
/*!*****************************************!*\
  !*** ./node_modules/nedb/lib/cursor.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Manage access to data, be it to find, update or remove it
 */
var model = __webpack_require__(/*! ./model */ "./node_modules/nedb/lib/model.js")
  , _ = __webpack_require__(/*! underscore */ "./node_modules/nedb/node_modules/underscore/underscore.js")
  ;



/**
 * Create a new cursor for this collection
 * @param {Datastore} db - The datastore this cursor is bound to
 * @param {Query} query - The query this cursor will operate on
 * @param {Function} execFn - Handler to be executed after cursor has found the results and before the callback passed to find/findOne/update/remove
 */
function Cursor (db, query, execFn) {
  this.db = db;
  this.query = query || {};
  if (execFn) { this.execFn = execFn; }
}


/**
 * Set a limit to the number of results
 */
Cursor.prototype.limit = function(limit) {
  this._limit = limit;
  return this;
};


/**
 * Skip a the number of results
 */
Cursor.prototype.skip = function(skip) {
  this._skip = skip;
  return this;
};


/**
 * Sort results of the query
 * @param {SortQuery} sortQuery - SortQuery is { field: order }, field can use the dot-notation, order is 1 for ascending and -1 for descending
 */
Cursor.prototype.sort = function(sortQuery) {
  this._sort = sortQuery;
  return this;
};


/**
 * Add the use of a projection
 * @param {Object} projection - MongoDB-style projection. {} means take all fields. Then it's { key1: 1, key2: 1 } to take only key1 and key2
 *                              { key1: 0, key2: 0 } to omit only key1 and key2. Except _id, you can't mix takes and omits
 */
Cursor.prototype.projection = function(projection) {
  this._projection = projection;
  return this;
};


/**
 * Apply the projection
 */
Cursor.prototype.project = function (candidates) {
  var res = [], self = this
    , keepId, action, keys
    ;

  if (this._projection === undefined || Object.keys(this._projection).length === 0) {
    return candidates;
  }

  keepId = this._projection._id === 0 ? false : true;
  this._projection = _.omit(this._projection, '_id');

  // Check for consistency
  keys = Object.keys(this._projection);
  keys.forEach(function (k) {
    if (action !== undefined && self._projection[k] !== action) { throw new Error("Can't both keep and omit fields except for _id"); }
    action = self._projection[k];
  });

  // Do the actual projection
  candidates.forEach(function (candidate) {
    var toPush;
    if (action === 1) {   // pick-type projection
      toPush = { $set: {} };
      keys.forEach(function (k) {
        toPush.$set[k] = model.getDotValue(candidate, k);
        if (toPush.$set[k] === undefined) { delete toPush.$set[k]; }
      });
      toPush = model.modify({}, toPush);
    } else {   // omit-type projection
      toPush = { $unset: {} };
      keys.forEach(function (k) { toPush.$unset[k] = true });
      toPush = model.modify(candidate, toPush);
    }
    if (keepId) {
      toPush._id = candidate._id;
    } else {
      delete toPush._id;
    }
    res.push(toPush);
  });

  return res;
};


/**
 * Get all matching elements
 * Will return pointers to matched elements (shallow copies), returning full copies is the role of find or findOne
 * This is an internal function, use exec which uses the executor
 *
 * @param {Function} callback - Signature: err, results
 */
Cursor.prototype._exec = function(_callback) {
  var res = [], added = 0, skipped = 0, self = this
    , error = null
    , i, keys, key
    ;

  function callback (error, res) {
    if (self.execFn) {
      return self.execFn(error, res, _callback);
    } else {
      return _callback(error, res);
    }
  }

  this.db.getCandidates(this.query, function (err, candidates) {
    if (err) { return callback(err); }

    try {
      for (i = 0; i < candidates.length; i += 1) {
        if (model.match(candidates[i], self.query)) {
          // If a sort is defined, wait for the results to be sorted before applying limit and skip
          if (!self._sort) {
            if (self._skip && self._skip > skipped) {
              skipped += 1;
            } else {
              res.push(candidates[i]);
              added += 1;
              if (self._limit && self._limit <= added) { break; }
            }
          } else {
            res.push(candidates[i]);
          }
        }
      }
    } catch (err) {
      return callback(err);
    }

    // Apply all sorts
    if (self._sort) {
      keys = Object.keys(self._sort);

      // Sorting
      var criteria = [];
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        criteria.push({ key: key, direction: self._sort[key] });
      }
      res.sort(function(a, b) {
        var criterion, compare, i;
        for (i = 0; i < criteria.length; i++) {
          criterion = criteria[i];
          compare = criterion.direction * model.compareThings(model.getDotValue(a, criterion.key), model.getDotValue(b, criterion.key), self.db.compareStrings);
          if (compare !== 0) {
            return compare;
          }
        }
        return 0;
      });

      // Applying limit and skip
      var limit = self._limit || res.length
        , skip = self._skip || 0;

      res = res.slice(skip, skip + limit);
    }

    // Apply projection
    try {
      res = self.project(res);
    } catch (e) {
      error = e;
      res = undefined;
    }

    return callback(error, res);
  });
};

Cursor.prototype.exec = function () {
  this.db.executor.push({ this: this, fn: this._exec, arguments: arguments });
};



// Interface
module.exports = Cursor;


/***/ }),

/***/ "./node_modules/nedb/lib/customUtils.js":
/*!**********************************************!*\
  !*** ./node_modules/nedb/lib/customUtils.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var crypto = __webpack_require__(/*! crypto */ "crypto")
  ;

/**
 * Return a random alphanumerical string of length len
 * There is a very small probability (less than 1/1,000,000) for the length to be less than len
 * (il the base64 conversion yields too many pluses and slashes) but
 * that's not an issue here
 * The probability of a collision is extremely small (need 3*10^12 documents to have one chance in a million of a collision)
 * See http://en.wikipedia.org/wiki/Birthday_problem
 */
function uid (len) {
  return crypto.randomBytes(Math.ceil(Math.max(8, len * 2)))
    .toString('base64')
    .replace(/[+\/]/g, '')
    .slice(0, len);
}


// Interface
module.exports.uid = uid;



/***/ }),

/***/ "./node_modules/nedb/lib/datastore.js":
/*!********************************************!*\
  !*** ./node_modules/nedb/lib/datastore.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var customUtils = __webpack_require__(/*! ./customUtils */ "./node_modules/nedb/lib/customUtils.js")
  , model = __webpack_require__(/*! ./model */ "./node_modules/nedb/lib/model.js")
  , async = __webpack_require__(/*! async */ "./node_modules/nedb/node_modules/async/lib/async.js")
  , Executor = __webpack_require__(/*! ./executor */ "./node_modules/nedb/lib/executor.js")
  , Index = __webpack_require__(/*! ./indexes */ "./node_modules/nedb/lib/indexes.js")
  , util = __webpack_require__(/*! util */ "util")
  , _ = __webpack_require__(/*! underscore */ "./node_modules/nedb/node_modules/underscore/underscore.js")
  , Persistence = __webpack_require__(/*! ./persistence */ "./node_modules/nedb/lib/persistence.js")
  , Cursor = __webpack_require__(/*! ./cursor */ "./node_modules/nedb/lib/cursor.js")
  ;


/**
 * Create a new collection
 * @param {String} options.filename Optional, datastore will be in-memory only if not provided
 * @param {Boolean} options.timestampData Optional, defaults to false. If set to true, createdAt and updatedAt will be created and populated automatically (if not specified by user)
 * @param {Boolean} options.inMemoryOnly Optional, defaults to false
 * @param {String} options.nodeWebkitAppName Optional, specify the name of your NW app if you want options.filename to be relative to the directory where
 *                                            Node Webkit stores application data such as cookies and local storage (the best place to store data in my opinion)
 * @param {Boolean} options.autoload Optional, defaults to false
 * @param {Function} options.onload Optional, if autoload is used this will be called after the load database with the error object as parameter. If you don't pass it the error will be thrown
 * @param {Function} options.afterSerialization/options.beforeDeserialization Optional, serialization hooks
 * @param {Number} options.corruptAlertThreshold Optional, threshold after which an alert is thrown if too much data is corrupt
 * @param {Function} options.compareStrings Optional, string comparison function that overrides default for sorting
 *
 * Event Emitter - Events
 * * compaction.done - Fired whenever a compaction operation was finished
 */
function Datastore (options) {
  var filename;

  // Retrocompatibility with v0.6 and before
  if (typeof options === 'string') {
    filename = options;
    this.inMemoryOnly = false;   // Default
  } else {
    options = options || {};
    filename = options.filename;
    this.inMemoryOnly = options.inMemoryOnly || false;
    this.autoload = options.autoload || false;
    this.timestampData = options.timestampData || false;
  }

  // Determine whether in memory or persistent
  if (!filename || typeof filename !== 'string' || filename.length === 0) {
    this.filename = null;
    this.inMemoryOnly = true;
  } else {
    this.filename = filename;
  }

  // String comparison function
  this.compareStrings = options.compareStrings;

  // Persistence handling
  this.persistence = new Persistence({ db: this, nodeWebkitAppName: options.nodeWebkitAppName
                                      , afterSerialization: options.afterSerialization
                                      , beforeDeserialization: options.beforeDeserialization
                                      , corruptAlertThreshold: options.corruptAlertThreshold
                                      });

  // This new executor is ready if we don't use persistence
  // If we do, it will only be ready once loadDatabase is called
  this.executor = new Executor();
  if (this.inMemoryOnly) { this.executor.ready = true; }

  // Indexed by field name, dot notation can be used
  // _id is always indexed and since _ids are generated randomly the underlying
  // binary is always well-balanced
  this.indexes = {};
  this.indexes._id = new Index({ fieldName: '_id', unique: true });
  this.ttlIndexes = {};

  // Queue a load of the database right away and call the onload handler
  // By default (no onload handler), if there is an error there, no operation will be possible so warn the user by throwing an exception
  if (this.autoload) { this.loadDatabase(options.onload || function (err) {
    if (err) { throw err; }
  }); }
}

util.inherits(Datastore, __webpack_require__(/*! events */ "events").EventEmitter);


/**
 * Load the database from the datafile, and trigger the execution of buffered commands if any
 */
Datastore.prototype.loadDatabase = function () {
  this.executor.push({ this: this.persistence, fn: this.persistence.loadDatabase, arguments: arguments }, true);
};


/**
 * Get an array of all the data in the database
 */
Datastore.prototype.getAllData = function () {
  return this.indexes._id.getAll();
};


/**
 * Reset all currently defined indexes
 */
Datastore.prototype.resetIndexes = function (newData) {
  var self = this;

  Object.keys(this.indexes).forEach(function (i) {
    self.indexes[i].reset(newData);
  });
};


/**
 * Ensure an index is kept for this field. Same parameters as lib/indexes
 * For now this function is synchronous, we need to test how much time it takes
 * We use an async API for consistency with the rest of the code
 * @param {String} options.fieldName
 * @param {Boolean} options.unique
 * @param {Boolean} options.sparse
 * @param {Number} options.expireAfterSeconds - Optional, if set this index becomes a TTL index (only works on Date fields, not arrays of Date)
 * @param {Function} cb Optional callback, signature: err
 */
Datastore.prototype.ensureIndex = function (options, cb) {
  var err
    , callback = cb || function () {};

  options = options || {};

  if (!options.fieldName) {
    err = new Error("Cannot create an index without a fieldName");
    err.missingFieldName = true;
    return callback(err);
  }
  if (this.indexes[options.fieldName]) { return callback(null); }

  this.indexes[options.fieldName] = new Index(options);
  if (options.expireAfterSeconds !== undefined) { this.ttlIndexes[options.fieldName] = options.expireAfterSeconds; }   // With this implementation index creation is not necessary to ensure TTL but we stick with MongoDB's API here

  try {
    this.indexes[options.fieldName].insert(this.getAllData());
  } catch (e) {
    delete this.indexes[options.fieldName];
    return callback(e);
  }

  // We may want to force all options to be persisted including defaults, not just the ones passed the index creation function
  this.persistence.persistNewState([{ $$indexCreated: options }], function (err) {
    if (err) { return callback(err); }
    return callback(null);
  });
};


/**
 * Remove an index
 * @param {String} fieldName
 * @param {Function} cb Optional callback, signature: err
 */
Datastore.prototype.removeIndex = function (fieldName, cb) {
  var callback = cb || function () {};

  delete this.indexes[fieldName];

  this.persistence.persistNewState([{ $$indexRemoved: fieldName }], function (err) {
    if (err) { return callback(err); }
    return callback(null);
  });
};


/**
 * Add one or several document(s) to all indexes
 */
Datastore.prototype.addToIndexes = function (doc) {
  var i, failingIndex, error
    , keys = Object.keys(this.indexes)
    ;

  for (i = 0; i < keys.length; i += 1) {
    try {
      this.indexes[keys[i]].insert(doc);
    } catch (e) {
      failingIndex = i;
      error = e;
      break;
    }
  }

  // If an error happened, we need to rollback the insert on all other indexes
  if (error) {
    for (i = 0; i < failingIndex; i += 1) {
      this.indexes[keys[i]].remove(doc);
    }

    throw error;
  }
};


/**
 * Remove one or several document(s) from all indexes
 */
Datastore.prototype.removeFromIndexes = function (doc) {
  var self = this;

  Object.keys(this.indexes).forEach(function (i) {
    self.indexes[i].remove(doc);
  });
};


/**
 * Update one or several documents in all indexes
 * To update multiple documents, oldDoc must be an array of { oldDoc, newDoc } pairs
 * If one update violates a constraint, all changes are rolled back
 */
Datastore.prototype.updateIndexes = function (oldDoc, newDoc) {
  var i, failingIndex, error
    , keys = Object.keys(this.indexes)
    ;

  for (i = 0; i < keys.length; i += 1) {
    try {
      this.indexes[keys[i]].update(oldDoc, newDoc);
    } catch (e) {
      failingIndex = i;
      error = e;
      break;
    }
  }

  // If an error happened, we need to rollback the update on all other indexes
  if (error) {
    for (i = 0; i < failingIndex; i += 1) {
      this.indexes[keys[i]].revertUpdate(oldDoc, newDoc);
    }

    throw error;
  }
};


/**
 * Return the list of candidates for a given query
 * Crude implementation for now, we return the candidates given by the first usable index if any
 * We try the following query types, in this order: basic match, $in match, comparison match
 * One way to make it better would be to enable the use of multiple indexes if the first usable index
 * returns too much data. I may do it in the future.
 *
 * Returned candidates will be scanned to find and remove all expired documents
 *
 * @param {Query} query
 * @param {Boolean} dontExpireStaleDocs Optional, defaults to false, if true don't remove stale docs. Useful for the remove function which shouldn't be impacted by expirations
 * @param {Function} callback Signature err, docs
 */
Datastore.prototype.getCandidates = function (query, dontExpireStaleDocs, callback) {
  var indexNames = Object.keys(this.indexes)
    , self = this
    , usableQueryKeys;

  if (typeof dontExpireStaleDocs === 'function') {
    callback = dontExpireStaleDocs;
    dontExpireStaleDocs = false;
  }

  async.waterfall([
  // STEP 1: get candidates list by checking indexes from most to least frequent usecase
  function (cb) {
    // For a basic match
    usableQueryKeys = [];
    Object.keys(query).forEach(function (k) {
      if (typeof query[k] === 'string' || typeof query[k] === 'number' || typeof query[k] === 'boolean' || util.isDate(query[k]) || query[k] === null) {
        usableQueryKeys.push(k);
      }
    });
    usableQueryKeys = _.intersection(usableQueryKeys, indexNames);
    if (usableQueryKeys.length > 0) {
      return cb(null, self.indexes[usableQueryKeys[0]].getMatching(query[usableQueryKeys[0]]));
    }

    // For a $in match
    usableQueryKeys = [];
    Object.keys(query).forEach(function (k) {
      if (query[k] && query[k].hasOwnProperty('$in')) {
        usableQueryKeys.push(k);
      }
    });
    usableQueryKeys = _.intersection(usableQueryKeys, indexNames);
    if (usableQueryKeys.length > 0) {
      return cb(null, self.indexes[usableQueryKeys[0]].getMatching(query[usableQueryKeys[0]].$in));
    }

    // For a comparison match
    usableQueryKeys = [];
    Object.keys(query).forEach(function (k) {
      if (query[k] && (query[k].hasOwnProperty('$lt') || query[k].hasOwnProperty('$lte') || query[k].hasOwnProperty('$gt') || query[k].hasOwnProperty('$gte'))) {
        usableQueryKeys.push(k);
      }
    });
    usableQueryKeys = _.intersection(usableQueryKeys, indexNames);
    if (usableQueryKeys.length > 0) {
      return cb(null, self.indexes[usableQueryKeys[0]].getBetweenBounds(query[usableQueryKeys[0]]));
    }

    // By default, return all the DB data
    return cb(null, self.getAllData());
  }
  // STEP 2: remove all expired documents
  , function (docs) {
    if (dontExpireStaleDocs) { return callback(null, docs); }

    var expiredDocsIds = [], validDocs = [], ttlIndexesFieldNames = Object.keys(self.ttlIndexes);

    docs.forEach(function (doc) {
      var valid = true;
      ttlIndexesFieldNames.forEach(function (i) {
        if (doc[i] !== undefined && util.isDate(doc[i]) && Date.now() > doc[i].getTime() + self.ttlIndexes[i] * 1000) {
          valid = false;
        }
      });
      if (valid) { validDocs.push(doc); } else { expiredDocsIds.push(doc._id); }
    });

    async.eachSeries(expiredDocsIds, function (_id, cb) {
      self._remove({ _id: _id }, {}, function (err) {
        if (err) { return callback(err); }
        return cb();
      });
    }, function (err) {
      return callback(null, validDocs);
    });
  }]);
};


/**
 * Insert a new document
 * @param {Function} cb Optional callback, signature: err, insertedDoc
 *
 * @api private Use Datastore.insert which has the same signature
 */
Datastore.prototype._insert = function (newDoc, cb) {
  var callback = cb || function () {}
    , preparedDoc
    ;

  try {
    preparedDoc = this.prepareDocumentForInsertion(newDoc)
    this._insertInCache(preparedDoc);
  } catch (e) {
    return callback(e);
  }

  this.persistence.persistNewState(util.isArray(preparedDoc) ? preparedDoc : [preparedDoc], function (err) {
    if (err) { return callback(err); }
    return callback(null, model.deepCopy(preparedDoc));
  });
};

/**
 * Create a new _id that's not already in use
 */
Datastore.prototype.createNewId = function () {
  var tentativeId = customUtils.uid(16);
  // Try as many times as needed to get an unused _id. As explained in customUtils, the probability of this ever happening is extremely small, so this is O(1)
  if (this.indexes._id.getMatching(tentativeId).length > 0) {
    tentativeId = this.createNewId();
  }
  return tentativeId;
};

/**
 * Prepare a document (or array of documents) to be inserted in a database
 * Meaning adds _id and timestamps if necessary on a copy of newDoc to avoid any side effect on user input
 * @api private
 */
Datastore.prototype.prepareDocumentForInsertion = function (newDoc) {
  var preparedDoc, self = this;

  if (util.isArray(newDoc)) {
    preparedDoc = [];
    newDoc.forEach(function (doc) { preparedDoc.push(self.prepareDocumentForInsertion(doc)); });
  } else {
    preparedDoc = model.deepCopy(newDoc);
    if (preparedDoc._id === undefined) { preparedDoc._id = this.createNewId(); }
    var now = new Date();
    if (this.timestampData && preparedDoc.createdAt === undefined) { preparedDoc.createdAt = now; }
    if (this.timestampData && preparedDoc.updatedAt === undefined) { preparedDoc.updatedAt = now; }
    model.checkObject(preparedDoc);
  }

  return preparedDoc;
};

/**
 * If newDoc is an array of documents, this will insert all documents in the cache
 * @api private
 */
Datastore.prototype._insertInCache = function (preparedDoc) {
  if (util.isArray(preparedDoc)) {
    this._insertMultipleDocsInCache(preparedDoc);
  } else {
    this.addToIndexes(preparedDoc);
  }
};

/**
 * If one insertion fails (e.g. because of a unique constraint), roll back all previous
 * inserts and throws the error
 * @api private
 */
Datastore.prototype._insertMultipleDocsInCache = function (preparedDocs) {
  var i, failingI, error;

  for (i = 0; i < preparedDocs.length; i += 1) {
    try {
      this.addToIndexes(preparedDocs[i]);
    } catch (e) {
      error = e;
      failingI = i;
      break;
    }
  }

  if (error) {
    for (i = 0; i < failingI; i += 1) {
      this.removeFromIndexes(preparedDocs[i]);
    }

    throw error;
  }
};

Datastore.prototype.insert = function () {
  this.executor.push({ this: this, fn: this._insert, arguments: arguments });
};


/**
 * Count all documents matching the query
 * @param {Object} query MongoDB-style query
 */
Datastore.prototype.count = function(query, callback) {
  var cursor = new Cursor(this, query, function(err, docs, callback) {
    if (err) { return callback(err); }
    return callback(null, docs.length);
  });

  if (typeof callback === 'function') {
    cursor.exec(callback);
  } else {
    return cursor;
  }
};


/**
 * Find all documents matching the query
 * If no callback is passed, we return the cursor so that user can limit, skip and finally exec
 * @param {Object} query MongoDB-style query
 * @param {Object} projection MongoDB-style projection
 */
Datastore.prototype.find = function (query, projection, callback) {
  switch (arguments.length) {
    case 1:
      projection = {};
      // callback is undefined, will return a cursor
      break;
    case 2:
      if (typeof projection === 'function') {
        callback = projection;
        projection = {};
      }   // If not assume projection is an object and callback undefined
      break;
  }

  var cursor = new Cursor(this, query, function(err, docs, callback) {
    var res = [], i;

    if (err) { return callback(err); }

    for (i = 0; i < docs.length; i += 1) {
      res.push(model.deepCopy(docs[i]));
    }
    return callback(null, res);
  });

  cursor.projection(projection);
  if (typeof callback === 'function') {
    cursor.exec(callback);
  } else {
    return cursor;
  }
};


/**
 * Find one document matching the query
 * @param {Object} query MongoDB-style query
 * @param {Object} projection MongoDB-style projection
 */
Datastore.prototype.findOne = function (query, projection, callback) {
  switch (arguments.length) {
    case 1:
      projection = {};
      // callback is undefined, will return a cursor
      break;
    case 2:
      if (typeof projection === 'function') {
        callback = projection;
        projection = {};
      }   // If not assume projection is an object and callback undefined
      break;
  }

  var cursor = new Cursor(this, query, function(err, docs, callback) {
    if (err) { return callback(err); }
    if (docs.length === 1) {
      return callback(null, model.deepCopy(docs[0]));
    } else {
      return callback(null, null);
    }
  });

  cursor.projection(projection).limit(1);
  if (typeof callback === 'function') {
    cursor.exec(callback);
  } else {
    return cursor;
  }
};


/**
 * Update all docs matching query
 * @param {Object} query
 * @param {Object} updateQuery
 * @param {Object} options Optional options
 *                 options.multi If true, can update multiple documents (defaults to false)
 *                 options.upsert If true, document is inserted if the query doesn't match anything
 *                 options.returnUpdatedDocs Defaults to false, if true return as third argument the array of updated matched documents (even if no change actually took place)
 * @param {Function} cb Optional callback, signature: (err, numAffected, affectedDocuments, upsert)
 *                      If update was an upsert, upsert flag is set to true
 *                      affectedDocuments can be one of the following:
 *                        * For an upsert, the upserted document
 *                        * For an update with returnUpdatedDocs option false, null
 *                        * For an update with returnUpdatedDocs true and multi false, the updated document
 *                        * For an update with returnUpdatedDocs true and multi true, the array of updated documents
 *
 * WARNING: The API was changed between v1.7.4 and v1.8, for consistency and readability reasons. Prior and including to v1.7.4,
 *          the callback signature was (err, numAffected, updated) where updated was the updated document in case of an upsert
 *          or the array of updated documents for an update if the returnUpdatedDocs option was true. That meant that the type of
 *          affectedDocuments in a non multi update depended on whether there was an upsert or not, leaving only two ways for the
 *          user to check whether an upsert had occured: checking the type of affectedDocuments or running another find query on
 *          the whole dataset to check its size. Both options being ugly, the breaking change was necessary.
 *
 * @api private Use Datastore.update which has the same signature
 */
Datastore.prototype._update = function (query, updateQuery, options, cb) {
  var callback
    , self = this
    , numReplaced = 0
    , multi, upsert
    , i
    ;

  if (typeof options === 'function') { cb = options; options = {}; }
  callback = cb || function () {};
  multi = options.multi !== undefined ? options.multi : false;
  upsert = options.upsert !== undefined ? options.upsert : false;

  async.waterfall([
  function (cb) {   // If upsert option is set, check whether we need to insert the doc
    if (!upsert) { return cb(); }

    // Need to use an internal function not tied to the executor to avoid deadlock
    var cursor = new Cursor(self, query);
    cursor.limit(1)._exec(function (err, docs) {
      if (err) { return callback(err); }
      if (docs.length === 1) {
        return cb();
      } else {
        var toBeInserted;

        try {
          model.checkObject(updateQuery);
          // updateQuery is a simple object with no modifier, use it as the document to insert
          toBeInserted = updateQuery;
        } catch (e) {
          // updateQuery contains modifiers, use the find query as the base,
          // strip it from all operators and update it according to updateQuery
          try {
            toBeInserted = model.modify(model.deepCopy(query, true), updateQuery);
          } catch (err) {
            return callback(err);
          }
        }

        return self._insert(toBeInserted, function (err, newDoc) {
          if (err) { return callback(err); }
          return callback(null, 1, newDoc, true);
        });
      }
    });
  }
  , function () {   // Perform the update
    var modifiedDoc , modifications = [], createdAt;

    self.getCandidates(query, function (err, candidates) {
      if (err) { return callback(err); }

      // Preparing update (if an error is thrown here neither the datafile nor
      // the in-memory indexes are affected)
      try {
        for (i = 0; i < candidates.length; i += 1) {
          if (model.match(candidates[i], query) && (multi || numReplaced === 0)) {
            numReplaced += 1;
            if (self.timestampData) { createdAt = candidates[i].createdAt; }
            modifiedDoc = model.modify(candidates[i], updateQuery);
            if (self.timestampData) {
              modifiedDoc.createdAt = createdAt;
              modifiedDoc.updatedAt = new Date();
            }
            modifications.push({ oldDoc: candidates[i], newDoc: modifiedDoc });
          }
        }
      } catch (err) {
        return callback(err);
      }

      // Change the docs in memory
      try {
        self.updateIndexes(modifications);
      } catch (err) {
        return callback(err);
      }

      // Update the datafile
      var updatedDocs = _.pluck(modifications, 'newDoc');
      self.persistence.persistNewState(updatedDocs, function (err) {
        if (err) { return callback(err); }
        if (!options.returnUpdatedDocs) {
          return callback(null, numReplaced);
        } else {
          var updatedDocsDC = [];
          updatedDocs.forEach(function (doc) { updatedDocsDC.push(model.deepCopy(doc)); });
          if (! multi) { updatedDocsDC = updatedDocsDC[0]; }
          return callback(null, numReplaced, updatedDocsDC);
        }
      });
    });
  }]);
};

Datastore.prototype.update = function () {
  this.executor.push({ this: this, fn: this._update, arguments: arguments });
};


/**
 * Remove all docs matching the query
 * For now very naive implementation (similar to update)
 * @param {Object} query
 * @param {Object} options Optional options
 *                 options.multi If true, can update multiple documents (defaults to false)
 * @param {Function} cb Optional callback, signature: err, numRemoved
 *
 * @api private Use Datastore.remove which has the same signature
 */
Datastore.prototype._remove = function (query, options, cb) {
  var callback
    , self = this, numRemoved = 0, removedDocs = [], multi
    ;

  if (typeof options === 'function') { cb = options; options = {}; }
  callback = cb || function () {};
  multi = options.multi !== undefined ? options.multi : false;

  this.getCandidates(query, true, function (err, candidates) {
    if (err) { return callback(err); }

    try {
      candidates.forEach(function (d) {
        if (model.match(d, query) && (multi || numRemoved === 0)) {
          numRemoved += 1;
          removedDocs.push({ $$deleted: true, _id: d._id });
          self.removeFromIndexes(d);
        }
      });
    } catch (err) { return callback(err); }

    self.persistence.persistNewState(removedDocs, function (err) {
      if (err) { return callback(err); }
      return callback(null, numRemoved);
    });
  });
};

Datastore.prototype.remove = function () {
  this.executor.push({ this: this, fn: this._remove, arguments: arguments });
};



module.exports = Datastore;


/***/ }),

/***/ "./node_modules/nedb/lib/executor.js":
/*!*******************************************!*\
  !*** ./node_modules/nedb/lib/executor.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Responsible for sequentially executing actions on the database
 */

var async = __webpack_require__(/*! async */ "./node_modules/nedb/node_modules/async/lib/async.js")
  ;

function Executor () {
  this.buffer = [];
  this.ready = false;

  // This queue will execute all commands, one-by-one in order
  this.queue = async.queue(function (task, cb) {
    var newArguments = [];

    // task.arguments is an array-like object on which adding a new field doesn't work, so we transform it into a real array
    for (var i = 0; i < task.arguments.length; i += 1) { newArguments.push(task.arguments[i]); }
    var lastArg = task.arguments[task.arguments.length - 1];

    // Always tell the queue task is complete. Execute callback if any was given.
    if (typeof lastArg === 'function') {
      // Callback was supplied
      newArguments[newArguments.length - 1] = function () {
        if (typeof setImmediate === 'function') {
           setImmediate(cb);
        } else {
          process.nextTick(cb);
        }
        lastArg.apply(null, arguments);
      };
    } else if (!lastArg && task.arguments.length !== 0) {
      // false/undefined/null supplied as callbback
      newArguments[newArguments.length - 1] = function () { cb(); };
    } else {
      // Nothing supplied as callback
      newArguments.push(function () { cb(); });
    }


    task.fn.apply(task.this, newArguments);
  }, 1);
}


/**
 * If executor is ready, queue task (and process it immediately if executor was idle)
 * If not, buffer task for later processing
 * @param {Object} task
 *                 task.this - Object to use as this
 *                 task.fn - Function to execute
 *                 task.arguments - Array of arguments, IMPORTANT: only the last argument may be a function (the callback)
 *                                                                 and the last argument cannot be false/undefined/null
 * @param {Boolean} forceQueuing Optional (defaults to false) force executor to queue task even if it is not ready
 */
Executor.prototype.push = function (task, forceQueuing) {
  if (this.ready || forceQueuing) {
    this.queue.push(task);
  } else {
    this.buffer.push(task);
  }
};


/**
 * Queue all tasks in buffer (in the same order they came in)
 * Automatically sets executor as ready
 */
Executor.prototype.processBuffer = function () {
  var i;
  this.ready = true;
  for (i = 0; i < this.buffer.length; i += 1) { this.queue.push(this.buffer[i]); }
  this.buffer = [];
};



// Interface
module.exports = Executor;


/***/ }),

/***/ "./node_modules/nedb/lib/indexes.js":
/*!******************************************!*\
  !*** ./node_modules/nedb/lib/indexes.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var BinarySearchTree = __webpack_require__(/*! binary-search-tree */ "./node_modules/binary-search-tree/index.js").AVLTree
  , model = __webpack_require__(/*! ./model */ "./node_modules/nedb/lib/model.js")
  , _ = __webpack_require__(/*! underscore */ "./node_modules/nedb/node_modules/underscore/underscore.js")
  , util = __webpack_require__(/*! util */ "util")
  ;

/**
 * Two indexed pointers are equal iif they point to the same place
 */
function checkValueEquality (a, b) {
  return a === b;
}

/**
 * Type-aware projection
 */
function projectForUnique (elt) {
  if (elt === null) { return '$null'; }
  if (typeof elt === 'string') { return '$string' + elt; }
  if (typeof elt === 'boolean') { return '$boolean' + elt; }
  if (typeof elt === 'number') { return '$number' + elt; }
  if (util.isArray(elt)) { return '$date' + elt.getTime(); }

  return elt;   // Arrays and objects, will check for pointer equality
}


/**
 * Create a new index
 * All methods on an index guarantee that either the whole operation was successful and the index changed
 * or the operation was unsuccessful and an error is thrown while the index is unchanged
 * @param {String} options.fieldName On which field should the index apply (can use dot notation to index on sub fields)
 * @param {Boolean} options.unique Optional, enforce a unique constraint (default: false)
 * @param {Boolean} options.sparse Optional, allow a sparse index (we can have documents for which fieldName is undefined) (default: false)
 */
function Index (options) {
  this.fieldName = options.fieldName;
  this.unique = options.unique || false;
  this.sparse = options.sparse || false;

  this.treeOptions = { unique: this.unique, compareKeys: model.compareThings, checkValueEquality: checkValueEquality };

  this.reset();   // No data in the beginning
}


/**
 * Reset an index
 * @param {Document or Array of documents} newData Optional, data to initialize the index with
 *                                                 If an error is thrown during insertion, the index is not modified
 */
Index.prototype.reset = function (newData) {
  this.tree = new BinarySearchTree(this.treeOptions);

  if (newData) { this.insert(newData); }
};


/**
 * Insert a new document in the index
 * If an array is passed, we insert all its elements (if one insertion fails the index is not modified)
 * O(log(n))
 */
Index.prototype.insert = function (doc) {
  var key, self = this
    , keys, i, failingI, error
    ;

  if (util.isArray(doc)) { this.insertMultipleDocs(doc); return; }

  key = model.getDotValue(doc, this.fieldName);

  // We don't index documents that don't contain the field if the index is sparse
  if (key === undefined && this.sparse) { return; }

  if (!util.isArray(key)) {
    this.tree.insert(key, doc);
  } else {
    // If an insert fails due to a unique constraint, roll back all inserts before it
    keys = _.uniq(key, projectForUnique);

    for (i = 0; i < keys.length; i += 1) {
      try {
        this.tree.insert(keys[i], doc);
      } catch (e) {
        error = e;
        failingI = i;
        break;
      }
    }

    if (error) {
      for (i = 0; i < failingI; i += 1) {
        this.tree.delete(keys[i], doc);
      }

      throw error;
    }
  }
};


/**
 * Insert an array of documents in the index
 * If a constraint is violated, the changes should be rolled back and an error thrown
 *
 * @API private
 */
Index.prototype.insertMultipleDocs = function (docs) {
  var i, error, failingI;

  for (i = 0; i < docs.length; i += 1) {
    try {
      this.insert(docs[i]);
    } catch (e) {
      error = e;
      failingI = i;
      break;
    }
  }

  if (error) {
    for (i = 0; i < failingI; i += 1) {
      this.remove(docs[i]);
    }

    throw error;
  }
};


/**
 * Remove a document from the index
 * If an array is passed, we remove all its elements
 * The remove operation is safe with regards to the 'unique' constraint
 * O(log(n))
 */
Index.prototype.remove = function (doc) {
  var key, self = this;

  if (util.isArray(doc)) { doc.forEach(function (d) { self.remove(d); }); return; }

  key = model.getDotValue(doc, this.fieldName);

  if (key === undefined && this.sparse) { return; }

  if (!util.isArray(key)) {
    this.tree.delete(key, doc);
  } else {
    _.uniq(key, projectForUnique).forEach(function (_key) {
      self.tree.delete(_key, doc);
    });
  }
};


/**
 * Update a document in the index
 * If a constraint is violated, changes are rolled back and an error thrown
 * Naive implementation, still in O(log(n))
 */
Index.prototype.update = function (oldDoc, newDoc) {
  if (util.isArray(oldDoc)) { this.updateMultipleDocs(oldDoc); return; }

  this.remove(oldDoc);

  try {
    this.insert(newDoc);
  } catch (e) {
    this.insert(oldDoc);
    throw e;
  }
};


/**
 * Update multiple documents in the index
 * If a constraint is violated, the changes need to be rolled back
 * and an error thrown
 * @param {Array of oldDoc, newDoc pairs} pairs
 *
 * @API private
 */
Index.prototype.updateMultipleDocs = function (pairs) {
  var i, failingI, error;

  for (i = 0; i < pairs.length; i += 1) {
    this.remove(pairs[i].oldDoc);
  }

  for (i = 0; i < pairs.length; i += 1) {
    try {
      this.insert(pairs[i].newDoc);
    } catch (e) {
      error = e;
      failingI = i;
      break;
    }
  }

  // If an error was raised, roll back changes in the inverse order
  if (error) {
    for (i = 0; i < failingI; i += 1) {
      this.remove(pairs[i].newDoc);
    }

    for (i = 0; i < pairs.length; i += 1) {
      this.insert(pairs[i].oldDoc);
    }

    throw error;
  }
};


/**
 * Revert an update
 */
Index.prototype.revertUpdate = function (oldDoc, newDoc) {
  var revert = [];

  if (!util.isArray(oldDoc)) {
    this.update(newDoc, oldDoc);
  } else {
    oldDoc.forEach(function (pair) {
      revert.push({ oldDoc: pair.newDoc, newDoc: pair.oldDoc });
    });
    this.update(revert);
  }
};


/**
 * Get all documents in index whose key match value (if it is a Thing) or one of the elements of value (if it is an array of Things)
 * @param {Thing} value Value to match the key against
 * @return {Array of documents}
 */
Index.prototype.getMatching = function (value) {
  var self = this;

  if (!util.isArray(value)) {
    return self.tree.search(value);
  } else {
    var _res = {}, res = [];

    value.forEach(function (v) {
      self.getMatching(v).forEach(function (doc) {
        _res[doc._id] = doc;
      });
    });

    Object.keys(_res).forEach(function (_id) {
      res.push(_res[_id]);
    });

    return res;
  }
};


/**
 * Get all documents in index whose key is between bounds are they are defined by query
 * Documents are sorted by key
 * @param {Query} query
 * @return {Array of documents}
 */
Index.prototype.getBetweenBounds = function (query) {
  return this.tree.betweenBounds(query);
};


/**
 * Get all elements in the index
 * @return {Array of documents}
 */
Index.prototype.getAll = function () {
  var res = [];

  this.tree.executeOnEveryNode(function (node) {
    var i;

    for (i = 0; i < node.data.length; i += 1) {
      res.push(node.data[i]);
    }
  });

  return res;
};




// Interface
module.exports = Index;


/***/ }),

/***/ "./node_modules/nedb/lib/model.js":
/*!****************************************!*\
  !*** ./node_modules/nedb/lib/model.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Handle models (i.e. docs)
 * Serialization/deserialization
 * Copying
 * Querying, update
 */

var util = __webpack_require__(/*! util */ "util")
  , _ = __webpack_require__(/*! underscore */ "./node_modules/nedb/node_modules/underscore/underscore.js")
  , modifierFunctions = {}
  , lastStepModifierFunctions = {}
  , comparisonFunctions = {}
  , logicalOperators = {}
  , arrayComparisonFunctions = {}
  ;


/**
 * Check a key, throw an error if the key is non valid
 * @param {String} k key
 * @param {Model} v value, needed to treat the Date edge case
 * Non-treatable edge cases here: if part of the object if of the form { $$date: number } or { $$deleted: true }
 * Its serialized-then-deserialized version it will transformed into a Date object
 * But you really need to want it to trigger such behaviour, even when warned not to use '$' at the beginning of the field names...
 */
function checkKey (k, v) {
  if (typeof k === 'number') {
    k = k.toString();
  }

  if (k[0] === '$' && !(k === '$$date' && typeof v === 'number') && !(k === '$$deleted' && v === true) && !(k === '$$indexCreated') && !(k === '$$indexRemoved')) {
    throw new Error('Field names cannot begin with the $ character');
  }

  if (k.indexOf('.') !== -1) {
    throw new Error('Field names cannot contain a .');
  }
}


/**
 * Check a DB object and throw an error if it's not valid
 * Works by applying the above checkKey function to all fields recursively
 */
function checkObject (obj) {
  if (util.isArray(obj)) {
    obj.forEach(function (o) {
      checkObject(o);
    });
  }

  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach(function (k) {
      checkKey(k, obj[k]);
      checkObject(obj[k]);
    });
  }
}


/**
 * Serialize an object to be persisted to a one-line string
 * For serialization/deserialization, we use the native JSON parser and not eval or Function
 * That gives us less freedom but data entered in the database may come from users
 * so eval and the like are not safe
 * Accepted primitive types: Number, String, Boolean, Date, null
 * Accepted secondary types: Objects, Arrays
 */
function serialize (obj) {
  var res;

  res = JSON.stringify(obj, function (k, v) {
    checkKey(k, v);

    if (v === undefined) { return undefined; }
    if (v === null) { return null; }

    // Hackish way of checking if object is Date (this way it works between execution contexts in node-webkit).
    // We can't use value directly because for dates it is already string in this function (date.toJSON was already called), so we use this
    if (typeof this[k].getTime === 'function') { return { $$date: this[k].getTime() }; }

    return v;
  });

  return res;
}


/**
 * From a one-line representation of an object generate by the serialize function
 * Return the object itself
 */
function deserialize (rawData) {
  return JSON.parse(rawData, function (k, v) {
    if (k === '$$date') { return new Date(v); }
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) { return v; }
    if (v && v.$$date) { return v.$$date; }

    return v;
  });
}


/**
 * Deep copy a DB object
 * The optional strictKeys flag (defaulting to false) indicates whether to copy everything or only fields
 * where the keys are valid, i.e. don't begin with $ and don't contain a .
 */
function deepCopy (obj, strictKeys) {
  var res;

  if ( typeof obj === 'boolean' ||
       typeof obj === 'number' ||
       typeof obj === 'string' ||
       obj === null ||
       (util.isDate(obj)) ) {
    return obj;
  }

  if (util.isArray(obj)) {
    res = [];
    obj.forEach(function (o) { res.push(deepCopy(o, strictKeys)); });
    return res;
  }

  if (typeof obj === 'object') {
    res = {};
    Object.keys(obj).forEach(function (k) {
      if (!strictKeys || (k[0] !== '$' && k.indexOf('.') === -1)) {
        res[k] = deepCopy(obj[k], strictKeys);
      }
    });
    return res;
  }

  return undefined;   // For now everything else is undefined. We should probably throw an error instead
}


/**
 * Tells if an object is a primitive type or a "real" object
 * Arrays are considered primitive
 */
function isPrimitiveType (obj) {
  return ( typeof obj === 'boolean' ||
       typeof obj === 'number' ||
       typeof obj === 'string' ||
       obj === null ||
       util.isDate(obj) ||
       util.isArray(obj));
}


/**
 * Utility functions for comparing things
 * Assumes type checking was already done (a and b already have the same type)
 * compareNSB works for numbers, strings and booleans
 */
function compareNSB (a, b) {
  if (a < b) { return -1; }
  if (a > b) { return 1; }
  return 0;
}

function compareArrays (a, b) {
  var i, comp;

  for (i = 0; i < Math.min(a.length, b.length); i += 1) {
    comp = compareThings(a[i], b[i]);

    if (comp !== 0) { return comp; }
  }

  // Common section was identical, longest one wins
  return compareNSB(a.length, b.length);
}


/**
 * Compare { things U undefined }
 * Things are defined as any native types (string, number, boolean, null, date) and objects
 * We need to compare with undefined as it will be used in indexes
 * In the case of objects and arrays, we deep-compare
 * If two objects dont have the same type, the (arbitrary) type hierarchy is: undefined, null, number, strings, boolean, dates, arrays, objects
 * Return -1 if a < b, 1 if a > b and 0 if a = b (note that equality here is NOT the same as defined in areThingsEqual!)
 *
 * @param {Function} _compareStrings String comparing function, returning -1, 0 or 1, overriding default string comparison (useful for languages with accented letters)
 */
function compareThings (a, b, _compareStrings) {
  var aKeys, bKeys, comp, i
    , compareStrings = _compareStrings || compareNSB;

  // undefined
  if (a === undefined) { return b === undefined ? 0 : -1; }
  if (b === undefined) { return a === undefined ? 0 : 1; }

  // null
  if (a === null) { return b === null ? 0 : -1; }
  if (b === null) { return a === null ? 0 : 1; }

  // Numbers
  if (typeof a === 'number') { return typeof b === 'number' ? compareNSB(a, b) : -1; }
  if (typeof b === 'number') { return typeof a === 'number' ? compareNSB(a, b) : 1; }

  // Strings
  if (typeof a === 'string') { return typeof b === 'string' ? compareStrings(a, b) : -1; }
  if (typeof b === 'string') { return typeof a === 'string' ? compareStrings(a, b) : 1; }

  // Booleans
  if (typeof a === 'boolean') { return typeof b === 'boolean' ? compareNSB(a, b) : -1; }
  if (typeof b === 'boolean') { return typeof a === 'boolean' ? compareNSB(a, b) : 1; }

  // Dates
  if (util.isDate(a)) { return util.isDate(b) ? compareNSB(a.getTime(), b.getTime()) : -1; }
  if (util.isDate(b)) { return util.isDate(a) ? compareNSB(a.getTime(), b.getTime()) : 1; }

  // Arrays (first element is most significant and so on)
  if (util.isArray(a)) { return util.isArray(b) ? compareArrays(a, b) : -1; }
  if (util.isArray(b)) { return util.isArray(a) ? compareArrays(a, b) : 1; }

  // Objects
  aKeys = Object.keys(a).sort();
  bKeys = Object.keys(b).sort();

  for (i = 0; i < Math.min(aKeys.length, bKeys.length); i += 1) {
    comp = compareThings(a[aKeys[i]], b[bKeys[i]]);

    if (comp !== 0) { return comp; }
  }

  return compareNSB(aKeys.length, bKeys.length);
}



// ==============================================================
// Updating documents
// ==============================================================

/**
 * The signature of modifier functions is as follows
 * Their structure is always the same: recursively follow the dot notation while creating
 * the nested documents if needed, then apply the "last step modifier"
 * @param {Object} obj The model to modify
 * @param {String} field Can contain dots, in that case that means we will set a subfield recursively
 * @param {Model} value
 */

/**
 * Set a field to a new value
 */
lastStepModifierFunctions.$set = function (obj, field, value) {
  obj[field] = value;
};


/**
 * Unset a field
 */
lastStepModifierFunctions.$unset = function (obj, field, value) {
  delete obj[field];
};


/**
 * Push an element to the end of an array field
 * Optional modifier $each instead of value to push several values
 * Optional modifier $slice to slice the resulting array, see https://docs.mongodb.org/manual/reference/operator/update/slice/
 * Différeence with MongoDB: if $slice is specified and not $each, we act as if value is an empty array
 */
lastStepModifierFunctions.$push = function (obj, field, value) {
  // Create the array if it doesn't exist
  if (!obj.hasOwnProperty(field)) { obj[field] = []; }

  if (!util.isArray(obj[field])) { throw new Error("Can't $push an element on non-array values"); }

  if (value !== null && typeof value === 'object' && value.$slice && value.$each === undefined) {
    value.$each = [];
  }

  if (value !== null && typeof value === 'object' && value.$each) {
    if (Object.keys(value).length >= 3 || (Object.keys(value).length === 2 && value.$slice === undefined)) { throw new Error("Can only use $slice in cunjunction with $each when $push to array"); }
    if (!util.isArray(value.$each)) { throw new Error("$each requires an array value"); }

    value.$each.forEach(function (v) {
      obj[field].push(v);
    });

    if (value.$slice === undefined || typeof value.$slice !== 'number') { return; }

    if (value.$slice === 0) {
      obj[field] = [];
    } else {
      var start, end, n = obj[field].length;
      if (value.$slice < 0) {
        start = Math.max(0, n + value.$slice);
        end = n;
      } else if (value.$slice > 0) {
        start = 0;
        end = Math.min(n, value.$slice);
      }
      obj[field] = obj[field].slice(start, end);
    }
  } else {
    obj[field].push(value);
  }
};


/**
 * Add an element to an array field only if it is not already in it
 * No modification if the element is already in the array
 * Note that it doesn't check whether the original array contains duplicates
 */
lastStepModifierFunctions.$addToSet = function (obj, field, value) {
  var addToSet = true;

  // Create the array if it doesn't exist
  if (!obj.hasOwnProperty(field)) { obj[field] = []; }

  if (!util.isArray(obj[field])) { throw new Error("Can't $addToSet an element on non-array values"); }

  if (value !== null && typeof value === 'object' && value.$each) {
    if (Object.keys(value).length > 1) { throw new Error("Can't use another field in conjunction with $each"); }
    if (!util.isArray(value.$each)) { throw new Error("$each requires an array value"); }

    value.$each.forEach(function (v) {
      lastStepModifierFunctions.$addToSet(obj, field, v);
    });
  } else {
    obj[field].forEach(function (v) {
      if (compareThings(v, value) === 0) { addToSet = false; }
    });
    if (addToSet) { obj[field].push(value); }
  }
};


/**
 * Remove the first or last element of an array
 */
lastStepModifierFunctions.$pop = function (obj, field, value) {
  if (!util.isArray(obj[field])) { throw new Error("Can't $pop an element from non-array values"); }
  if (typeof value !== 'number') { throw new Error(value + " isn't an integer, can't use it with $pop"); }
  if (value === 0) { return; }

  if (value > 0) {
    obj[field] = obj[field].slice(0, obj[field].length - 1);
  } else {
    obj[field] = obj[field].slice(1);
  }
};


/**
 * Removes all instances of a value from an existing array
 */
lastStepModifierFunctions.$pull = function (obj, field, value) {
  var arr, i;

  if (!util.isArray(obj[field])) { throw new Error("Can't $pull an element from non-array values"); }

  arr = obj[field];
  for (i = arr.length - 1; i >= 0; i -= 1) {
    if (match(arr[i], value)) {
      arr.splice(i, 1);
    }
  }
};


/**
 * Increment a numeric field's value
 */
lastStepModifierFunctions.$inc = function (obj, field, value) {
  if (typeof value !== 'number') { throw new Error(value + " must be a number"); }

  if (typeof obj[field] !== 'number') {
    if (!_.has(obj, field)) {
      obj[field] = value;
    } else {
      throw new Error("Don't use the $inc modifier on non-number fields");
    }
  } else {
    obj[field] += value;
  }
};

/**
 * Updates the value of the field, only if specified field is greater than the current value of the field
 */
lastStepModifierFunctions.$max = function (obj, field, value) {
  if (typeof obj[field] === 'undefined') {
    obj[field] = value;
  } else if (value > obj[field]) {
    obj[field] = value;
  }
};

/**
 * Updates the value of the field, only if specified field is smaller than the current value of the field
 */
lastStepModifierFunctions.$min = function (obj, field, value) {
  if (typeof obj[field] === 'undefined') { 
    obj[field] = value;
  } else if (value < obj[field]) {
    obj[field] = value;
  }
};

// Given its name, create the complete modifier function
function createModifierFunction (modifier) {
  return function (obj, field, value) {
    var fieldParts = typeof field === 'string' ? field.split('.') : field;

    if (fieldParts.length === 1) {
      lastStepModifierFunctions[modifier](obj, field, value);
    } else {
      if (obj[fieldParts[0]] === undefined) {
        if (modifier === '$unset') { return; }   // Bad looking specific fix, needs to be generalized modifiers that behave like $unset are implemented
        obj[fieldParts[0]] = {};
      }
      modifierFunctions[modifier](obj[fieldParts[0]], fieldParts.slice(1), value);
    }
  };
}

// Actually create all modifier functions
Object.keys(lastStepModifierFunctions).forEach(function (modifier) {
  modifierFunctions[modifier] = createModifierFunction(modifier);
});


/**
 * Modify a DB object according to an update query
 */
function modify (obj, updateQuery) {
  var keys = Object.keys(updateQuery)
    , firstChars = _.map(keys, function (item) { return item[0]; })
    , dollarFirstChars = _.filter(firstChars, function (c) { return c === '$'; })
    , newDoc, modifiers
    ;

  if (keys.indexOf('_id') !== -1 && updateQuery._id !== obj._id) { throw new Error("You cannot change a document's _id"); }

  if (dollarFirstChars.length !== 0 && dollarFirstChars.length !== firstChars.length) {
    throw new Error("You cannot mix modifiers and normal fields");
  }

  if (dollarFirstChars.length === 0) {
    // Simply replace the object with the update query contents
    newDoc = deepCopy(updateQuery);
    newDoc._id = obj._id;
  } else {
    // Apply modifiers
    modifiers = _.uniq(keys);
    newDoc = deepCopy(obj);
    modifiers.forEach(function (m) {
      var keys;

      if (!modifierFunctions[m]) { throw new Error("Unknown modifier " + m); }

      // Can't rely on Object.keys throwing on non objects since ES6
      // Not 100% satisfying as non objects can be interpreted as objects but no false negatives so we can live with it
      if (typeof updateQuery[m] !== 'object') {
        throw new Error("Modifier " + m + "'s argument must be an object");
      }

      keys = Object.keys(updateQuery[m]);
      keys.forEach(function (k) {
        modifierFunctions[m](newDoc, k, updateQuery[m][k]);
      });
    });
  }

  // Check result is valid and return it
  checkObject(newDoc);

  if (obj._id !== newDoc._id) { throw new Error("You can't change a document's _id"); }
  return newDoc;
};


// ==============================================================
// Finding documents
// ==============================================================

/**
 * Get a value from object with dot notation
 * @param {Object} obj
 * @param {String} field
 */
function getDotValue (obj, field) {
  var fieldParts = typeof field === 'string' ? field.split('.') : field
    , i, objs;

  if (!obj) { return undefined; }   // field cannot be empty so that means we should return undefined so that nothing can match

  if (fieldParts.length === 0) { return obj; }

  if (fieldParts.length === 1) { return obj[fieldParts[0]]; }

  if (util.isArray(obj[fieldParts[0]])) {
    // If the next field is an integer, return only this item of the array
    i = parseInt(fieldParts[1], 10);
    if (typeof i === 'number' && !isNaN(i)) {
      return getDotValue(obj[fieldParts[0]][i], fieldParts.slice(2))
    }

    // Return the array of values
    objs = new Array();
    for (i = 0; i < obj[fieldParts[0]].length; i += 1) {
       objs.push(getDotValue(obj[fieldParts[0]][i], fieldParts.slice(1)));
    }
    return objs;
  } else {
    return getDotValue(obj[fieldParts[0]], fieldParts.slice(1));
  }
}


/**
 * Check whether 'things' are equal
 * Things are defined as any native types (string, number, boolean, null, date) and objects
 * In the case of object, we check deep equality
 * Returns true if they are, false otherwise
 */
function areThingsEqual (a, b) {
  var aKeys , bKeys , i;

  // Strings, booleans, numbers, null
  if (a === null || typeof a === 'string' || typeof a === 'boolean' || typeof a === 'number' ||
      b === null || typeof b === 'string' || typeof b === 'boolean' || typeof b === 'number') { return a === b; }

  // Dates
  if (util.isDate(a) || util.isDate(b)) { return util.isDate(a) && util.isDate(b) && a.getTime() === b.getTime(); }

  // Arrays (no match since arrays are used as a $in)
  // undefined (no match since they mean field doesn't exist and can't be serialized)
  if ((!(util.isArray(a) && util.isArray(b)) && (util.isArray(a) || util.isArray(b))) || a === undefined || b === undefined) { return false; }

  // General objects (check for deep equality)
  // a and b should be objects at this point
  try {
    aKeys = Object.keys(a);
    bKeys = Object.keys(b);
  } catch (e) {
    return false;
  }

  if (aKeys.length !== bKeys.length) { return false; }
  for (i = 0; i < aKeys.length; i += 1) {
    if (bKeys.indexOf(aKeys[i]) === -1) { return false; }
    if (!areThingsEqual(a[aKeys[i]], b[aKeys[i]])) { return false; }
  }
  return true;
}


/**
 * Check that two values are comparable
 */
function areComparable (a, b) {
  if (typeof a !== 'string' && typeof a !== 'number' && !util.isDate(a) &&
      typeof b !== 'string' && typeof b !== 'number' && !util.isDate(b)) {
    return false;
  }

  if (typeof a !== typeof b) { return false; }

  return true;
}


/**
 * Arithmetic and comparison operators
 * @param {Native value} a Value in the object
 * @param {Native value} b Value in the query
 */
comparisonFunctions.$lt = function (a, b) {
  return areComparable(a, b) && a < b;
};

comparisonFunctions.$lte = function (a, b) {
  return areComparable(a, b) && a <= b;
};

comparisonFunctions.$gt = function (a, b) {
  return areComparable(a, b) && a > b;
};

comparisonFunctions.$gte = function (a, b) {
  return areComparable(a, b) && a >= b;
};

comparisonFunctions.$ne = function (a, b) {
  if (a === undefined) { return true; }
  return !areThingsEqual(a, b);
};

comparisonFunctions.$in = function (a, b) {
  var i;

  if (!util.isArray(b)) { throw new Error("$in operator called with a non-array"); }

  for (i = 0; i < b.length; i += 1) {
    if (areThingsEqual(a, b[i])) { return true; }
  }

  return false;
};

comparisonFunctions.$nin = function (a, b) {
  if (!util.isArray(b)) { throw new Error("$nin operator called with a non-array"); }

  return !comparisonFunctions.$in(a, b);
};

comparisonFunctions.$regex = function (a, b) {
  if (!util.isRegExp(b)) { throw new Error("$regex operator called with non regular expression"); }

  if (typeof a !== 'string') {
    return false
  } else {
    return b.test(a);
  }
};

comparisonFunctions.$exists = function (value, exists) {
  if (exists || exists === '') {   // This will be true for all values of exists except false, null, undefined and 0
    exists = true;                 // That's strange behaviour (we should only use true/false) but that's the way Mongo does it...
  } else {
    exists = false;
  }

  if (value === undefined) {
    return !exists
  } else {
    return exists;
  }
};

// Specific to arrays
comparisonFunctions.$size = function (obj, value) {
    if (!util.isArray(obj)) { return false; }
    if (value % 1 !== 0) { throw new Error("$size operator called without an integer"); }

    return (obj.length == value);
};
comparisonFunctions.$elemMatch = function (obj, value) {
  if (!util.isArray(obj)) { return false; }
  var i = obj.length;
  var result = false;   // Initialize result
  while (i--) {
    if (match(obj[i], value)) {   // If match for array element, return true
      result = true;
      break;
    }
  }
  return result;
};
arrayComparisonFunctions.$size = true;
arrayComparisonFunctions.$elemMatch = true;


/**
 * Match any of the subqueries
 * @param {Model} obj
 * @param {Array of Queries} query
 */
logicalOperators.$or = function (obj, query) {
  var i;

  if (!util.isArray(query)) { throw new Error("$or operator used without an array"); }

  for (i = 0; i < query.length; i += 1) {
    if (match(obj, query[i])) { return true; }
  }

  return false;
};


/**
 * Match all of the subqueries
 * @param {Model} obj
 * @param {Array of Queries} query
 */
logicalOperators.$and = function (obj, query) {
  var i;

  if (!util.isArray(query)) { throw new Error("$and operator used without an array"); }

  for (i = 0; i < query.length; i += 1) {
    if (!match(obj, query[i])) { return false; }
  }

  return true;
};


/**
 * Inverted match of the query
 * @param {Model} obj
 * @param {Query} query
 */
logicalOperators.$not = function (obj, query) {
  return !match(obj, query);
};


/**
 * Use a function to match
 * @param {Model} obj
 * @param {Query} query
 */
logicalOperators.$where = function (obj, fn) {
  var result;

  if (!_.isFunction(fn)) { throw new Error("$where operator used without a function"); }

  result = fn.call(obj);
  if (!_.isBoolean(result)) { throw new Error("$where function must return boolean"); }

  return result;
};


/**
 * Tell if a given document matches a query
 * @param {Object} obj Document to check
 * @param {Object} query
 */
function match (obj, query) {
  var queryKeys, queryKey, queryValue, i;

  // Primitive query against a primitive type
  // This is a bit of a hack since we construct an object with an arbitrary key only to dereference it later
  // But I don't have time for a cleaner implementation now
  if (isPrimitiveType(obj) || isPrimitiveType(query)) {
    return matchQueryPart({ needAKey: obj }, 'needAKey', query);
  }

  // Normal query
  queryKeys = Object.keys(query);
  for (i = 0; i < queryKeys.length; i += 1) {
    queryKey = queryKeys[i];
    queryValue = query[queryKey];

    if (queryKey[0] === '$') {
      if (!logicalOperators[queryKey]) { throw new Error("Unknown logical operator " + queryKey); }
      if (!logicalOperators[queryKey](obj, queryValue)) { return false; }
    } else {
      if (!matchQueryPart(obj, queryKey, queryValue)) { return false; }
    }
  }

  return true;
};


/**
 * Match an object against a specific { key: value } part of a query
 * if the treatObjAsValue flag is set, don't try to match every part separately, but the array as a whole
 */
function matchQueryPart (obj, queryKey, queryValue, treatObjAsValue) {
  var objValue = getDotValue(obj, queryKey)
    , i, keys, firstChars, dollarFirstChars;

  // Check if the value is an array if we don't force a treatment as value
  if (util.isArray(objValue) && !treatObjAsValue) {
    // If the queryValue is an array, try to perform an exact match
    if (util.isArray(queryValue)) {
      return matchQueryPart(obj, queryKey, queryValue, true);
    }

    // Check if we are using an array-specific comparison function
    if (queryValue !== null && typeof queryValue === 'object' && !util.isRegExp(queryValue)) {
      keys = Object.keys(queryValue);
      for (i = 0; i < keys.length; i += 1) {
        if (arrayComparisonFunctions[keys[i]]) { return matchQueryPart(obj, queryKey, queryValue, true); }
      }
    }

    // If not, treat it as an array of { obj, query } where there needs to be at least one match
    for (i = 0; i < objValue.length; i += 1) {
      if (matchQueryPart({ k: objValue[i] }, 'k', queryValue)) { return true; }   // k here could be any string
    }
    return false;
  }

  // queryValue is an actual object. Determine whether it contains comparison operators
  // or only normal fields. Mixed objects are not allowed
  if (queryValue !== null && typeof queryValue === 'object' && !util.isRegExp(queryValue) && !util.isArray(queryValue)) {
    keys = Object.keys(queryValue);
    firstChars = _.map(keys, function (item) { return item[0]; });
    dollarFirstChars = _.filter(firstChars, function (c) { return c === '$'; });

    if (dollarFirstChars.length !== 0 && dollarFirstChars.length !== firstChars.length) {
      throw new Error("You cannot mix operators and normal fields");
    }

    // queryValue is an object of this form: { $comparisonOperator1: value1, ... }
    if (dollarFirstChars.length > 0) {
      for (i = 0; i < keys.length; i += 1) {
        if (!comparisonFunctions[keys[i]]) { throw new Error("Unknown comparison function " + keys[i]); }

        if (!comparisonFunctions[keys[i]](objValue, queryValue[keys[i]])) { return false; }
      }
      return true;
    }
  }

  // Using regular expressions with basic querying
  if (util.isRegExp(queryValue)) { return comparisonFunctions.$regex(objValue, queryValue); }

  // queryValue is either a native value or a normal object
  // Basic matching is possible
  if (!areThingsEqual(objValue, queryValue)) { return false; }

  return true;
}


// Interface
module.exports.serialize = serialize;
module.exports.deserialize = deserialize;
module.exports.deepCopy = deepCopy;
module.exports.checkObject = checkObject;
module.exports.isPrimitiveType = isPrimitiveType;
module.exports.modify = modify;
module.exports.getDotValue = getDotValue;
module.exports.match = match;
module.exports.areThingsEqual = areThingsEqual;
module.exports.compareThings = compareThings;


/***/ }),

/***/ "./node_modules/nedb/lib/persistence.js":
/*!**********************************************!*\
  !*** ./node_modules/nedb/lib/persistence.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Handle every persistence-related task
 * The interface Datastore expects to be implemented is
 * * Persistence.loadDatabase(callback) and callback has signature err
 * * Persistence.persistNewState(newDocs, callback) where newDocs is an array of documents and callback has signature err
 */

var storage = __webpack_require__(/*! ./storage */ "./node_modules/nedb/lib/storage.js")
  , path = __webpack_require__(/*! path */ "path")
  , model = __webpack_require__(/*! ./model */ "./node_modules/nedb/lib/model.js")
  , async = __webpack_require__(/*! async */ "./node_modules/nedb/node_modules/async/lib/async.js")
  , customUtils = __webpack_require__(/*! ./customUtils */ "./node_modules/nedb/lib/customUtils.js")
  , Index = __webpack_require__(/*! ./indexes */ "./node_modules/nedb/lib/indexes.js")
  ;


/**
 * Create a new Persistence object for database options.db
 * @param {Datastore} options.db
 * @param {Boolean} options.nodeWebkitAppName Optional, specify the name of your NW app if you want options.filename to be relative to the directory where
 *                                            Node Webkit stores application data such as cookies and local storage (the best place to store data in my opinion)
 */
function Persistence (options) {
  var i, j, randomString;

  this.db = options.db;
  this.inMemoryOnly = this.db.inMemoryOnly;
  this.filename = this.db.filename;
  this.corruptAlertThreshold = options.corruptAlertThreshold !== undefined ? options.corruptAlertThreshold : 0.1;

  if (!this.inMemoryOnly && this.filename && this.filename.charAt(this.filename.length - 1) === '~') {
    throw new Error("The datafile name can't end with a ~, which is reserved for crash safe backup files");
  }

  // After serialization and before deserialization hooks with some basic sanity checks
  if (options.afterSerialization && !options.beforeDeserialization) {
    throw new Error("Serialization hook defined but deserialization hook undefined, cautiously refusing to start NeDB to prevent dataloss");
  }
  if (!options.afterSerialization && options.beforeDeserialization) {
    throw new Error("Serialization hook undefined but deserialization hook defined, cautiously refusing to start NeDB to prevent dataloss");
  }
  this.afterSerialization = options.afterSerialization || function (s) { return s; };
  this.beforeDeserialization = options.beforeDeserialization || function (s) { return s; };
  for (i = 1; i < 30; i += 1) {
    for (j = 0; j < 10; j += 1) {
      randomString = customUtils.uid(i);
      if (this.beforeDeserialization(this.afterSerialization(randomString)) !== randomString) {
        throw new Error("beforeDeserialization is not the reverse of afterSerialization, cautiously refusing to start NeDB to prevent dataloss");
      }
    }
  }

  // For NW apps, store data in the same directory where NW stores application data
  if (this.filename && options.nodeWebkitAppName) {
    console.log("==================================================================");
    console.log("WARNING: The nodeWebkitAppName option is deprecated");
    console.log("To get the path to the directory where Node Webkit stores the data");
    console.log("for your app, use the internal nw.gui module like this");
    console.log("require('nw.gui').App.dataPath");
    console.log("See https://github.com/rogerwang/node-webkit/issues/500");
    console.log("==================================================================");
    this.filename = Persistence.getNWAppFilename(options.nodeWebkitAppName, this.filename);
  }
};


/**
 * Check if a directory exists and create it on the fly if it is not the case
 * cb is optional, signature: err
 */
Persistence.ensureDirectoryExists = function (dir, cb) {
  var callback = cb || function () {}
    ;

  storage.mkdirp(dir, function (err) { return callback(err); });
};




/**
 * Return the path the datafile if the given filename is relative to the directory where Node Webkit stores
 * data for this application. Probably the best place to store data
 */
Persistence.getNWAppFilename = function (appName, relativeFilename) {
  var home;

  switch (process.platform) {
    case 'win32':
    case 'win64':
      home = process.env.LOCALAPPDATA || process.env.APPDATA;
      if (!home) { throw new Error("Couldn't find the base application data folder"); }
      home = path.join(home, appName);
      break;
    case 'darwin':
      home = process.env.HOME;
      if (!home) { throw new Error("Couldn't find the base application data directory"); }
      home = path.join(home, 'Library', 'Application Support', appName);
      break;
    case 'linux':
      home = process.env.HOME;
      if (!home) { throw new Error("Couldn't find the base application data directory"); }
      home = path.join(home, '.config', appName);
      break;
    default:
      throw new Error("Can't use the Node Webkit relative path for platform " + process.platform);
      break;
  }

  return path.join(home, 'nedb-data', relativeFilename);
}


/**
 * Persist cached database
 * This serves as a compaction function since the cache always contains only the number of documents in the collection
 * while the data file is append-only so it may grow larger
 * @param {Function} cb Optional callback, signature: err
 */
Persistence.prototype.persistCachedDatabase = function (cb) {
  var callback = cb || function () {}
    , toPersist = ''
    , self = this
    ;

  if (this.inMemoryOnly) { return callback(null); }

  this.db.getAllData().forEach(function (doc) {
    toPersist += self.afterSerialization(model.serialize(doc)) + '\n';
  });
  Object.keys(this.db.indexes).forEach(function (fieldName) {
    if (fieldName != "_id") {   // The special _id index is managed by datastore.js, the others need to be persisted
      toPersist += self.afterSerialization(model.serialize({ $$indexCreated: { fieldName: fieldName, unique: self.db.indexes[fieldName].unique, sparse: self.db.indexes[fieldName].sparse }})) + '\n';
    }
  });

  storage.crashSafeWriteFile(this.filename, toPersist, function (err) {
    if (err) { return callback(err); }
    self.db.emit('compaction.done');
    return callback(null);
  });
};


/**
 * Queue a rewrite of the datafile
 */
Persistence.prototype.compactDatafile = function () {
  this.db.executor.push({ this: this, fn: this.persistCachedDatabase, arguments: [] });
};


/**
 * Set automatic compaction every interval ms
 * @param {Number} interval in milliseconds, with an enforced minimum of 5 seconds
 */
Persistence.prototype.setAutocompactionInterval = function (interval) {
  var self = this
    , minInterval = 5000
    , realInterval = Math.max(interval || 0, minInterval)
    ;

  this.stopAutocompaction();

  this.autocompactionIntervalId = setInterval(function () {
    self.compactDatafile();
  }, realInterval);
};


/**
 * Stop autocompaction (do nothing if autocompaction was not running)
 */
Persistence.prototype.stopAutocompaction = function () {
  if (this.autocompactionIntervalId) { clearInterval(this.autocompactionIntervalId); }
};


/**
 * Persist new state for the given newDocs (can be insertion, update or removal)
 * Use an append-only format
 * @param {Array} newDocs Can be empty if no doc was updated/removed
 * @param {Function} cb Optional, signature: err
 */
Persistence.prototype.persistNewState = function (newDocs, cb) {
  var self = this
    , toPersist = ''
    , callback = cb || function () {}
    ;

  // In-memory only datastore
  if (self.inMemoryOnly) { return callback(null); }

  newDocs.forEach(function (doc) {
    toPersist += self.afterSerialization(model.serialize(doc)) + '\n';
  });

  if (toPersist.length === 0) { return callback(null); }

  storage.appendFile(self.filename, toPersist, 'utf8', function (err) {
    return callback(err);
  });
};


/**
 * From a database's raw data, return the corresponding
 * machine understandable collection
 */
Persistence.prototype.treatRawData = function (rawData) {
  var data = rawData.split('\n')
    , dataById = {}
    , tdata = []
    , i
    , indexes = {}
    , corruptItems = -1   // Last line of every data file is usually blank so not really corrupt
    ;

  for (i = 0; i < data.length; i += 1) {
    var doc;

    try {
      doc = model.deserialize(this.beforeDeserialization(data[i]));
      if (doc._id) {
        if (doc.$$deleted === true) {
          delete dataById[doc._id];
        } else {
          dataById[doc._id] = doc;
        }
      } else if (doc.$$indexCreated && doc.$$indexCreated.fieldName != undefined) {
        indexes[doc.$$indexCreated.fieldName] = doc.$$indexCreated;
      } else if (typeof doc.$$indexRemoved === "string") {
        delete indexes[doc.$$indexRemoved];
      }
    } catch (e) {
      corruptItems += 1;
    }
  }

  // A bit lenient on corruption
  if (data.length > 0 && corruptItems / data.length > this.corruptAlertThreshold) {
    throw new Error("More than " + Math.floor(100 * this.corruptAlertThreshold) + "% of the data file is corrupt, the wrong beforeDeserialization hook may be used. Cautiously refusing to start NeDB to prevent dataloss");
  }

  Object.keys(dataById).forEach(function (k) {
    tdata.push(dataById[k]);
  });

  return { data: tdata, indexes: indexes };
};


/**
 * Load the database
 * 1) Create all indexes
 * 2) Insert all data
 * 3) Compact the database
 * This means pulling data out of the data file or creating it if it doesn't exist
 * Also, all data is persisted right away, which has the effect of compacting the database file
 * This operation is very quick at startup for a big collection (60ms for ~10k docs)
 * @param {Function} cb Optional callback, signature: err
 */
Persistence.prototype.loadDatabase = function (cb) {
  var callback = cb || function () {}
    , self = this
    ;

  self.db.resetIndexes();

  // In-memory only datastore
  if (self.inMemoryOnly) { return callback(null); }

  async.waterfall([
    function (cb) {
      Persistence.ensureDirectoryExists(path.dirname(self.filename), function (err) {
        storage.ensureDatafileIntegrity(self.filename, function (err) {
          storage.readFile(self.filename, 'utf8', function (err, rawData) {
            if (err) { return cb(err); }

            try {
              var treatedData = self.treatRawData(rawData);
            } catch (e) {
              return cb(e);
            }

            // Recreate all indexes in the datafile
            Object.keys(treatedData.indexes).forEach(function (key) {
              self.db.indexes[key] = new Index(treatedData.indexes[key]);
            });

            // Fill cached database (i.e. all indexes) with data
            try {
              self.db.resetIndexes(treatedData.data);
            } catch (e) {
              self.db.resetIndexes();   // Rollback any index which didn't fail
              return cb(e);
            }

            self.db.persistence.persistCachedDatabase(cb);
          });
        });
      });
    }
  ], function (err) {
       if (err) { return callback(err); }

       self.db.executor.processBuffer();
       return callback(null);
     });
};


// Interface
module.exports = Persistence;


/***/ }),

/***/ "./node_modules/nedb/lib/storage.js":
/*!******************************************!*\
  !*** ./node_modules/nedb/lib/storage.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Way data is stored for this database
 * For a Node.js/Node Webkit database it's the file system
 * For a browser-side database it's localforage which chooses the best option depending on user browser (IndexedDB then WebSQL then localStorage)
 *
 * This version is the Node.js/Node Webkit version
 * It's essentially fs, mkdirp and crash safe write and read functions
 */

var fs = __webpack_require__(/*! fs */ "fs")
  , mkdirp = __webpack_require__(/*! mkdirp */ "./node_modules/mkdirp/index.js")
  , async = __webpack_require__(/*! async */ "./node_modules/nedb/node_modules/async/lib/async.js")
  , path = __webpack_require__(/*! path */ "path")
  , storage = {}
  ;

storage.exists = fs.exists;
storage.rename = fs.rename;
storage.writeFile = fs.writeFile;
storage.unlink = fs.unlink;
storage.appendFile = fs.appendFile;
storage.readFile = fs.readFile;
storage.mkdirp = mkdirp;


/**
 * Explicit name ...
 */
storage.ensureFileDoesntExist = function (file, callback) {
  storage.exists(file, function (exists) {
    if (!exists) { return callback(null); }

    storage.unlink(file, function (err) { return callback(err); });
  });
};


/**
 * Flush data in OS buffer to storage if corresponding option is set
 * @param {String} options.filename
 * @param {Boolean} options.isDir Optional, defaults to false
 * If options is a string, it is assumed that the flush of the file (not dir) called options was requested
 */
storage.flushToStorage = function (options, callback) {
  var filename, flags;
  if (typeof options === 'string') {
    filename = options;
    flags = 'r+';
  } else {
    filename = options.filename;
    flags = options.isDir ? 'r' : 'r+';
  }

  // Windows can't fsync (FlushFileBuffers) directories. We can live with this as it cannot cause 100% dataloss
  // except in the very rare event of the first time database is loaded and a crash happens
  if (flags === 'r' && (process.platform === 'win32' || process.platform === 'win64')) { return callback(null); }

  fs.open(filename, flags, function (err, fd) {
    if (err) { return callback(err); }
    fs.fsync(fd, function (errFS) {
      fs.close(fd, function (errC) {
        if (errFS || errC) {
          var e = new Error('Failed to flush to storage');
          e.errorOnFsync = errFS;
          e.errorOnClose = errC;
          return callback(e);
        } else {
          return callback(null);
        }
      });
    });
  });
};


/**
 * Fully write or rewrite the datafile, immune to crashes during the write operation (data will not be lost)
 * @param {String} filename
 * @param {String} data
 * @param {Function} cb Optional callback, signature: err
 */
storage.crashSafeWriteFile = function (filename, data, cb) {
  var callback = cb || function () {}
    , tempFilename = filename + '~';

  async.waterfall([
    async.apply(storage.flushToStorage, { filename: path.dirname(filename), isDir: true })
  , function (cb) {
      storage.exists(filename, function (exists) {
        if (exists) {
          storage.flushToStorage(filename, function (err) { return cb(err); });
        } else {
          return cb();
        }
      });
    }
  , function (cb) {
      storage.writeFile(tempFilename, data, function (err) { return cb(err); });
    }
  , async.apply(storage.flushToStorage, tempFilename)
  , function (cb) {
      storage.rename(tempFilename, filename, function (err) { return cb(err); });
    }
  , async.apply(storage.flushToStorage, { filename: path.dirname(filename), isDir: true })
  ], function (err) { return callback(err); })
};


/**
 * Ensure the datafile contains all the data, even if there was a crash during a full file write
 * @param {String} filename
 * @param {Function} callback signature: err
 */
storage.ensureDatafileIntegrity = function (filename, callback) {
  var tempFilename = filename + '~';

  storage.exists(filename, function (filenameExists) {
    // Write was successful
    if (filenameExists) { return callback(null); }

    storage.exists(tempFilename, function (oldFilenameExists) {
      // New database
      if (!oldFilenameExists) {
        return storage.writeFile(filename, '', 'utf8', function (err) { callback(err); });
      }

      // Write failed, use old version
      storage.rename(tempFilename, filename, function (err) { return callback(err); });
    });
  });
};



// Interface
module.exports = storage;


/***/ }),

/***/ "./node_modules/nedb/node_modules/async/lib/async.js":
/*!***********************************************************!*\
  !*** ./node_modules/nedb/node_modules/async/lib/async.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return async;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    // Node.js
    else {}

}());


/***/ }),

/***/ "./node_modules/nedb/node_modules/underscore/underscore.js":
/*!*****************************************************************!*\
  !*** ./node_modules/nedb/node_modules/underscore/underscore.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {}

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (true) {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);


/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vZGlzdC9tb2R1bGVzL2RiL2RiLmJpbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9kaXN0L21vZHVsZXMvZGIvZGIuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vZGlzdC9yb3V0ZXIvQU9Sb3V0ZXJDb3JlUHJvY2Vzc1ByZXRlbmRlci5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9kaXN0L3JvdXRlci9BT1JvdXRlckludGVyZmFjZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvYmluYXJ5LXNlYXJjaC10cmVlL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9iaW5hcnktc2VhcmNoLXRyZWUvbGliL2F2bHRyZWUuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL2JpbmFyeS1zZWFyY2gtdHJlZS9saWIvYnN0LmpzIiwid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9iaW5hcnktc2VhcmNoLXRyZWUvbGliL2N1c3RvbVV0aWxzLmpzIiwid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9iaW5hcnktc2VhcmNoLXRyZWUvbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvZGVidWcvc3JjL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvbWluaW1pc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL21rZGlycC9pbmRleC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL25lZGIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL25lZGIvbGliL2N1cnNvci5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvbmVkYi9saWIvY3VzdG9tVXRpbHMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL25lZGIvbGliL2RhdGFzdG9yZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvbmVkYi9saWIvZXhlY3V0b3IuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL25lZGIvbGliL2luZGV4ZXMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL25lZGIvbGliL21vZGVsLmpzIiwid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9uZWRiL2xpYi9wZXJzaXN0ZW5jZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvbmVkYi9saWIvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9ub2RlX21vZHVsZXMvbmVkYi9ub2RlX21vZHVsZXMvYXN5bmMvbGliL2FzeW5jLmpzIiwid2VicGFjazovL1tuYW1lXS8uL25vZGVfbW9kdWxlcy9uZWRiL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4vbm9kZV9tb2R1bGVzL3N1cHBvcnRzLWNvbG9yL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8od2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vW25hbWVdL2V4dGVybmFsIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vW25hbWVdL2V4dGVybmFsIFwiZXZlbnRzXCIiLCJ3ZWJwYWNrOi8vW25hbWVdL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly9bbmFtZV0vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vW25hbWVdL2V4dGVybmFsIFwidHR5XCIiLCJ3ZWJwYWNrOi8vW25hbWVdL2V4dGVybmFsIFwidXRpbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs4Q0NsRkE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBLDhDQUE4QyxjQUFjO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLGtDOzs7Ozs7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsZ0JBQWdCLHNDQUFzQyxpQkFBaUIsRUFBRTtBQUNuRix5QkFBeUIsdURBQXVEO0FBQ2hGO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUVBQXVFLFFBQVE7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxRQUFRO0FBQ2pGO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0MsbUJBQW1CLEVBQUU7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EsZ0RBQWdELG1DQUFtQztBQUNuRixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLCtDQUErQyxtQ0FBbUM7QUFDbEYsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RCxtQkFBbUI7QUFDMUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGlDQUFpQyxFQUFFO0FBQzlFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsT0FBTztBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLDhCQUE4QixFQUFFO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLCtCQUErQixFQUFFO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEIsa0JBQWtCO0FBQ2xCLGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyw4QkFBOEIsRUFBRTs7QUFFM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGlCQUFpQjs7QUFFakI7QUFDQSxrREFBa0QsRUFBRSxpQkFBaUI7O0FBRXJFO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RCwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFLGlCQUFpQjs7QUFFdkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHOztBQUVILENBQUM7Ozs7Ozs7Ozs7OztBQ3pzQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBLG1CQUFtQixpQkFBaUI7QUFDcEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCLG9CQUFvQjtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7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RUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1Qzs7QUFFdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsT0FBTztBQUN4RDtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsV0FBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQUE7QUFDVDtBQUNBO0FBQ0EsV0FNQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7Ozs7QUM3N0JEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLFFBRUg7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHFDQUFxQyxPQUFPO0FBQzVDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0MsbUJBQW1CLEVBQUU7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EsZ0RBQWdELG1DQUFtQztBQUNuRixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLCtDQUErQyxtQ0FBbUM7QUFDbEYsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RCxtQkFBbUI7QUFDMUU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLGlDQUFpQyxFQUFFO0FBQzlFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxPQUFPO0FBQzNDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsT0FBTztBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLDhCQUE4QixFQUFFO0FBQzdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLCtCQUErQixFQUFFO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RTtBQUM3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEIsa0JBQWtCO0FBQ2xCLGtCQUFrQjtBQUNsQixrQkFBa0I7QUFDbEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyw4QkFBOEIsRUFBRTs7QUFFM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLGlCQUFpQjs7QUFFakI7QUFDQSxrREFBa0QsRUFBRSxpQkFBaUI7O0FBRXJFO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RCwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0VBQXNFLGlCQUFpQjs7QUFFdkY7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHOztBQUVILENBQUM7Ozs7Ozs7Ozs7Ozs7QUN6c0NEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7QUNqREQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNyQkEsbUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUMiLCJmaWxlIjoibW9kdWxlcy9kYi5iaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Rpc3QvbW9kdWxlcy9kYi9kYi5iaW4uanNcIik7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZGJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9kYlwiKSk7XG52YXIgbWluaW1pc3QgPSByZXF1aXJlKFwibWluaW1pc3RcIik7XG52YXIgcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJwYXRoXCIpKTtcbnZhciBhcmd2ID0gbWluaW1pc3QocHJvY2Vzcy5hcmd2LnNsaWNlKDIpLCB7XG4gICAgZGVmYXVsdDoge1xuICAgICAgICBzdG9yYWdlTG9jYXRpb246IHBhdGhfMS5kZWZhdWx0LnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4nLCAnZGF0YScpLFxuICAgIH1cbn0pO1xuaWYgKHJlcXVpcmUubWFpbiA9PT0gbW9kdWxlKSB7XG4gICAgbmV3IGRiXzEuZGVmYXVsdChhcmd2KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRiLmJpbi5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQU9Sb3V0ZXJJbnRlcmZhY2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vcm91dGVyL0FPUm91dGVySW50ZXJmYWNlXCIpKTtcbnZhciBuZWRiXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIm5lZGJcIikpO1xudmFyIHBhdGhfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicGF0aFwiKSk7XG52YXIgZGVidWdfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZGVidWdcIikpO1xudmFyIGRlYnVnID0gZGVidWdfMS5kZWZhdWx0KCdhbzpkYicpO1xudmFyIEFPREIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFPREIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQU9EQihhcmdzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnVzZXJEYnMgPSB7fTtcbiAgICAgICAgX3RoaXMuc3RvcmFnZUxvY2F0aW9uID0gYXJncy5zdG9yYWdlTG9jYXRpb247XG4gICAgICAgIF90aGlzLnJvdXRlci5vbignL2RiL2xvZ3MvZ2V0JywgX3RoaXMuX2xvZ3NHZXQuYmluZChfdGhpcykpO1xuICAgICAgICBfdGhpcy5yb3V0ZXIub24oJy9kYi9sb2dzL2luc2VydCcsIF90aGlzLl9sb2dzSW5zZXJ0LmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvc2V0dGluZ3MvZ2V0JywgX3RoaXMuX3NldHRpbmdzR2V0LmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvc2V0dGluZ3MvdXBkYXRlJywgX3RoaXMuX3NldHRpbmdzVXBkYXRlLmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvdXNlci9pbml0JywgX3RoaXMuX3NldHVwVXNlckRiLmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvdXNlci9nZXQnLCBfdGhpcy5fZ2V0VXNlci5iaW5kKF90aGlzKSk7XG4gICAgICAgIF90aGlzLnJvdXRlci5vbignL2RiL3VzZXIvY29udGVudC9nZXQnLCBfdGhpcy5fdXNlckNvbnRlbnRHZXQuYmluZChfdGhpcykpO1xuICAgICAgICBfdGhpcy5yb3V0ZXIub24oJy9kYi91c2VyL2NvbnRlbnQvaW5zZXJ0JywgX3RoaXMuX3VzZXJDb250ZW50SW5zZXJ0LmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvZGF0cy9pbml0JywgX3RoaXMuX2RhdHNJbml0LmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvZGF0cy9nZXQnLCBfdGhpcy5fZGF0c0dldC5iaW5kKF90aGlzKSk7XG4gICAgICAgIF90aGlzLnJvdXRlci5vbignL2RiL2RhdHMvaW5zZXJ0JywgX3RoaXMuX2RhdHNJbnNlcnQuYmluZChfdGhpcykpO1xuICAgICAgICBfdGhpcy5yb3V0ZXIub24oJy9kYi9kYXRzL3VwZGF0ZScsIF90aGlzLl9kYXRzVXBkYXRlLmJpbmQoX3RoaXMpKTtcbiAgICAgICAgX3RoaXMucm91dGVyLm9uKCcvZGIvZGF0cy9yZW1vdmUnLCBfdGhpcy5fZGF0c1JlbW92ZS5iaW5kKF90aGlzKSk7XG4gICAgICAgIF90aGlzLl9zZXR1cENvcmVEYnMoKTtcbiAgICAgICAgZGVidWcoXCJzdGFydGVkXCIpO1xuICAgICAgICBfdGhpcy5yb3V0ZXIuc2VuZCgnL2NvcmUvbG9nJywgeyBtZXNzYWdlOiBcIltBTyBEQl0gQ29yZSBkYXRhYmFzZSBpbml0aWFsaXplZFwiIH0pO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFPREIucHJvdG90eXBlLl9zZXR1cENvcmVEYnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZGIgPSB7XG4gICAgICAgICAgICBsb2dzOiBuZXcgbmVkYl8xLmRlZmF1bHQoe1xuICAgICAgICAgICAgICAgIGluTWVtb3J5T25seTogdHJ1ZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc2V0dGluZ3M6IG5ldyBuZWRiXzEuZGVmYXVsdCh7XG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6IHBhdGhfMS5kZWZhdWx0LnJlc29sdmUodGhpcy5zdG9yYWdlTG9jYXRpb24sICdzZXR0aW5ncy5kYi5qc29uJyksXG4gICAgICAgICAgICAgICAgYXV0b2xvYWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgb25sb2FkOiBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5faGFuZGxlQ29yZURiTG9hZEVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExvYWQgZGVmYXVsdCBzZXR0aW5ncyAoaW5zZXJ0IHdpbGwgbm90IG92ZXJ3cml0ZSBleGlzdGluZyBzZXR0aW5ncylcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKEFPREIuREVGQVVMVF9TRVRUSU5HUykuZm9yRWFjaChmdW5jdGlvbiAoc2V0dGluZ05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ1ZhbHVlID0gQU9EQi5ERUZBVUxUX1NFVFRJTkdTW3NldHRpbmdOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kYi5zZXR0aW5ncy5pbnNlcnQoeyBzZXR0aW5nOiBzZXR0aW5nTmFtZSwgdmFsdWU6IHNldHRpbmdWYWx1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICAgICAgLy8gTG9ncyBleHBpcmUgYWZ0ZXIgNDggaHJzXG4gICAgICAgIHRoaXMuZGIubG9ncy5lbnN1cmVJbmRleCh7XG4gICAgICAgICAgICBmaWVsZE5hbWU6ICdjcmVhdGVkQXQnLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBUeXBlcyBub3QgcXVpdGUgdXAgdG8gcGFyXG4gICAgICAgICAgICBleHBpcmVBZnRlclNlY29uZHM6IDM2MDAgKiA0OCxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFNldHRpbmdzIGluZGV4ZWQgYnkgbmFtZSAodW5pcXVlKVxuICAgICAgICB0aGlzLmRiLnNldHRpbmdzLmVuc3VyZUluZGV4KHtcbiAgICAgICAgICAgIGZpZWxkTmFtZTogJ3NldHRpbmcnLFxuICAgICAgICAgICAgdW5pcXVlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFPREIucHJvdG90eXBlLl9zZXR1cFVzZXJEYiA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXF1ZXN0RGF0YSA9IHJlcXVlc3QuZGF0YTtcbiAgICAgICAgaWYgKCFyZXF1ZXN0LmV0aEFkZHJlc3MpIHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KG5ldyBFcnJvcigndXNlciBkYiBpbml0IHJlcXVpcmVzIGV0aCBhZGRyZXNzJykpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnVzZXJEYnNbcmVxdWVzdC5ldGhBZGRyZXNzXSBpbnN0YW5jZW9mIG5lZGJfMS5kZWZhdWx0KSB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlc3BvbmQoeyBsb2FkZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2VyRGJzW3JlcXVlc3QuZXRoQWRkcmVzc10gPSBuZXcgbmVkYl8xLmRlZmF1bHQoe1xuICAgICAgICAgICAgZmlsZW5hbWU6IHBhdGhfMS5kZWZhdWx0LnJlc29sdmUodGhpcy5zdG9yYWdlTG9jYXRpb24sICd1c2VycycsIHJlcXVlc3QuZXRoQWRkcmVzcywgJ2NvbnRlbnQuZGIuanNvbicpLFxuICAgICAgICAgICAgYXV0b2xvYWQ6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51c2VyRGJzW3JlcXVlc3QuZXRoQWRkcmVzc10ubG9hZERhdGFiYXNlKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgX3RoaXMucm91dGVyLnNlbmQoJy9jb3JlL2xvZycsIHsgbWVzc2FnZTogXCJbQU8gREJdIFVzZXIgZGF0YWJhc2UgaW5pdGlhbGl6ZWQgZm9yIFwiICsgcmVxdWVzdC5ldGhBZGRyZXNzIH0pO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIF90aGlzLnVzZXJEYnNbcmVxdWVzdC5ldGhBZGRyZXNzXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZCh7IGxvYWRlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBBT0RCLnByb3RvdHlwZS5fZ2V0VXNlciA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHJlcXVlc3QucmVzcG9uZCh7IGV0aEFkZHJlc3M6IHJlcXVlc3QuZXRoQWRkcmVzcyB9KTtcbiAgICB9O1xuICAgIEFPREIucHJvdG90eXBlLl9oYW5kbGVDb3JlRGJMb2FkRXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBkZWJ1ZygnRXJyb3IgbG9hZGluZyBjb3JlIGRiJywgZXJyb3IpO1xuICAgICAgICAgICAgLy8gVE9ETzogaGFuZGxlIGdyYWNlZnVsbHk/XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBUT0RPOiB3ZSBtaWdodCBuZWVkIHRvIGRyb3Agc29tZSBkYXRhIChleDogcGVlcnMpIGZyb20gcHJldmlvdXMgc2Vzc2lvblxuICAgICAgICB9XG4gICAgfTtcbiAgICBBT0RCLnByb3RvdHlwZS5fdXNlckNvbnRlbnRHZXQgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdERhdGEgPSByZXF1ZXN0LmRhdGE7XG4gICAgICAgIHZhciBxdWVyeSA9IHJlcXVlc3REYXRhLnF1ZXJ5IHx8IHt9O1xuICAgICAgICB2YXIgdXNlckRiID0gdGhpcy51c2VyRGJzW3JlcXVlc3QuZXRoQWRkcmVzc107XG4gICAgICAgIGlmICghdXNlckRiKSB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlamVjdChuZXcgRXJyb3IoXCJVc2VyIGRiIG5vdCBmb3VuZCBmb3IgXCIgKyByZXF1ZXN0LmV0aEFkZHJlc3MpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRGIuZmluZChxdWVyeSkuZXhlYyhmdW5jdGlvbiAoZXJyb3IsIGRvY3MpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZChkb2NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBBT0RCLnByb3RvdHlwZS5fdXNlckNvbnRlbnRJbnNlcnQgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdERhdGEgPSByZXF1ZXN0LmRhdGE7IC8vIFRPRE86IHR5cGUgY2hlY2svdmFsaWRhdGUgY29udGVudFxuICAgICAgICB2YXIgdXNlckRiID0gdGhpcy51c2VyRGJzW3JlcXVlc3QuZXRoQWRkcmVzc107XG4gICAgICAgIGlmICghdXNlckRiKSB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlamVjdChuZXcgRXJyb3IoXCJVc2VyIGRiIG5vdCBmb3VuZCBmb3IgXCIgKyByZXF1ZXN0LmV0aEFkZHJlc3MpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRGIuaW5zZXJ0KHJlcXVlc3REYXRhLCBmdW5jdGlvbiAoZXJyb3IsIGRvYykge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25kKGRvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQU9EQi5wcm90b3R5cGUuX2xvZ3NHZXQgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdERhdGEgPSByZXF1ZXN0LmRhdGE7XG4gICAgICAgIHZhciBxdWVyeSA9IHJlcXVlc3REYXRhLnF1ZXJ5IHx8IHt9O1xuICAgICAgICB0aGlzLmRiLmxvZ3MuZmluZChxdWVyeSkuc29ydCh7IGNyZWF0ZWRBdDogMSB9KS5leGVjKGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25kKHJlc3VsdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFPREIucHJvdG90eXBlLl9sb2dzSW5zZXJ0ID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3REYXRhID0gcmVxdWVzdC5kYXRhO1xuICAgICAgICB2YXIgbG9nID0gcmVxdWVzdERhdGE7XG4gICAgICAgIGlmICghbG9nLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KG5ldyBFcnJvcignSW52YWxpZCBkYXRhIGZvcm1hdCBmb3IgbG9nIGluc2VydCwgXCJtZXNzYWdlXCIgZmllbGQgcmVxdWlyZWQnKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsb2cuY3JlYXRlZEF0IHx8ICEobG9nLmNyZWF0ZWRBdCBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICBsb2cuY3JlYXRlZEF0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRiLmxvZ3MuaW5zZXJ0KGxvZywgZnVuY3Rpb24gKGVycm9yLCBkb2MpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZChkb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFPREIucHJvdG90eXBlLl9zZXR0aW5nc0dldCA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0RGF0YSA9IHJlcXVlc3QuZGF0YTtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gcmVxdWVzdERhdGEucXVlcnkgfHwge307XG4gICAgICAgIHRoaXMuZGIuc2V0dGluZ3MuZmluZChxdWVyeSkuZXhlYyhmdW5jdGlvbiAoZXJyb3IsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBrZXlWYWx1ZVNldHRpbmdzID0gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24gKHZhbHVlcywgc2V0dGluZ0VudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChfX2Fzc2lnbih7fSwgdmFsdWVzLCAoX2EgPSB7fSwgX2Fbc2V0dGluZ0VudHJ5LnNldHRpbmddID0gc2V0dGluZ0VudHJ5LnZhbHVlLCBfYSkpKTtcbiAgICAgICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5yZXNwb25kKGtleVZhbHVlU2V0dGluZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEFPREIucHJvdG90eXBlLl9zZXR0aW5nc1VwZGF0ZSA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXF1ZXN0RGF0YSA9IHJlcXVlc3QuZGF0YTtcbiAgICAgICAgdmFyIHNldHRpbmdzID0gcmVxdWVzdERhdGE7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgdXBzZXJ0OiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHZhciB1cGRhdGVQcm9taXNlcyA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykuZm9yRWFjaChmdW5jdGlvbiAoc2V0dGluZ05hbWUpIHtcbiAgICAgICAgICAgIHVwZGF0ZVByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZzogc2V0dGluZ05hbWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nOiBzZXR0aW5nTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNldHRpbmdzW3NldHRpbmdOYW1lXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX3RoaXMuZGIuc2V0dGluZ3MudXBkYXRlKHF1ZXJ5LCB1cGRhdGUsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFByb21pc2UuYWxsKHVwZGF0ZVByb21pc2VzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFdlIHJldHVybiBhbGwgc2V0dGluZ3NcbiAgICAgICAgICAgIF90aGlzLmRiLnNldHRpbmdzLmZpbmQoe30pLmV4ZWMoZnVuY3Rpb24gKGVycm9yLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlWYWx1ZVNldHRpbmdzID0gcmVzdWx0cy5yZWR1Y2UoZnVuY3Rpb24gKHZhbHVlcywgc2V0dGluZ0VudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKF9fYXNzaWduKHt9LCB2YWx1ZXMsIChfYSA9IHt9LCBfYVtzZXR0aW5nRW50cnkuc2V0dGluZ10gPSBzZXR0aW5nRW50cnkudmFsdWUsIF9hKSkpO1xuICAgICAgICAgICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZChrZXlWYWx1ZVNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2gocmVxdWVzdC5yZWplY3QpO1xuICAgIH07XG4gICAgQU9EQi5wcm90b3R5cGUuX2RhdHNJbml0ID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgLy9jb25zdCByZXF1ZXN0RGF0YTogQU9EQl9EYXRzSW5pdF9EYXRhID0gcmVxdWVzdC5kYXRhXG4gICAgICAgIHRoaXMuZGIuZGF0cyA9IG5ldyBuZWRiXzEuZGVmYXVsdCh7XG4gICAgICAgICAgICBmaWxlbmFtZTogcGF0aF8xLmRlZmF1bHQucmVzb2x2ZSh0aGlzLnN0b3JhZ2VMb2NhdGlvbiwgJ3VzZXJzJywgcmVxdWVzdC5ldGhBZGRyZXNzLCAnZGF0cy5kYi5qc29uJyksXG4gICAgICAgICAgICBhdXRvbG9hZDogdHJ1ZSxcbiAgICAgICAgICAgIG9ubG9hZDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9oYW5kbGVDb3JlRGJMb2FkRXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlamVjdChuZXcgRXJyb3IoJ0Vycm9yIGxvYWRpbmcgdXAgRGF0cyBEQicpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vbGV0J3MgcmV0dXJuIGV2ZXJ5dGhpbmcgZnJvbSBpbml0XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRiLmRhdHMuZmluZCh7fSkuZXhlYyhmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWVbcmVzdWx0WydrZXknXV0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZChyZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBBT0RCLnByb3RvdHlwZS5fZGF0c0dldCA9IGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0RGF0YSA9IHJlcXVlc3QuZGF0YTtcbiAgICAgICAgaWYgKCF0aGlzLmRiLmRhdHMpIHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KG5ldyBFcnJvcignRGF0cyBEQiBub3QgaW5pdGlhbGl6ZWQnKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcXVlcnkgPSByZXF1ZXN0RGF0YS5xdWVyeSB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMuZGIuZGF0cy5maW5kKHF1ZXJ5KS5leGVjKGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHRzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJldHVyblZhbHVlID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZVtyZXN1bHRbJ2tleSddXSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZChyZXR1cm5WYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbmQocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQU9EQi5wcm90b3R5cGUuX2RhdHNJbnNlcnQgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdERhdGEgPSByZXF1ZXN0LmRhdGE7XG4gICAgICAgIGlmICghdGhpcy5kYi5kYXRzKSB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlamVjdChuZXcgRXJyb3IoJ0RhdHMgREIgbm90IGluaXRpYWxpemVkJykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFyZXF1ZXN0RGF0YS5jcmVhdGVkQXQgfHwgIShyZXF1ZXN0RGF0YS5jcmVhdGVkQXQgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3REYXRhLmNyZWF0ZWRBdCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJlcXVlc3REYXRhLnVwZGF0ZWRBdCB8fCAhKHJlcXVlc3REYXRhLnVwZGF0ZWRBdCBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdERhdGEudXBkYXRlZEF0ID0gcmVxdWVzdERhdGEuY3JlYXRlZEF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYi5kYXRzLmluc2VydChyZXF1ZXN0RGF0YSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ0Vycm9yIGluc2VydGluZyBuZXcgZGF0Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZChyZXF1ZXN0RGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQU9EQi5wcm90b3R5cGUuX2RhdHNVcGRhdGUgPSBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICB2YXIgcmVxdWVzdERhdGEgPSByZXF1ZXN0LmRhdGE7XG4gICAgICAgIGlmICghdGhpcy5kYi5kYXRzKSB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlamVjdChuZXcgRXJyb3IoJ0RhdHMgREIgbm90IGluaXRpYWxpemVkJykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIHJlcXVlc3REYXRhLnVwZGF0ZS51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5kYi5kYXRzLnVwZGF0ZShyZXF1ZXN0RGF0YS5xdWVyeSwgcmVxdWVzdERhdGEudXBkYXRlLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCBudW1SZXBsYWNlZCkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVidWcoJ1VwZGF0ZSByZXBsYWNlZCAnICsgbnVtUmVwbGFjZWQgKyAnIGRhdCByZWNvcmQocyknKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3BvbmQoe30pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFPREIucHJvdG90eXBlLl9kYXRzUmVtb3ZlID0gZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgICAgdmFyIHJlcXVlc3REYXRhID0gcmVxdWVzdC5kYXRhO1xuICAgICAgICBpZiAoIXRoaXMuZGIuZGF0cykge1xuICAgICAgICAgICAgcmVxdWVzdC5yZWplY3QobmV3IEVycm9yKCdEYXRzIERCIG5vdCBpbml0aWFsaXplZCcpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGIuZGF0cy5yZW1vdmUocmVxdWVzdERhdGEucXVlcnksIHt9LCBmdW5jdGlvbiAoZXJyLCBudW1SZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWJ1ZygnUmVtb3ZlZCAnICsgbnVtUmVtb3ZlZCArICcgZGF0IHJlY29yZChzKScpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzcG9uZCh7fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQU9EQi5ERUZBVUxUX1NFVFRJTkdTID0ge1xuICAgICAgICBtYXhEaXNrU3BhY2U6IC0xLFxuICAgICAgICBtYXhCYW5kd2lkdGhVcDogLTEsXG4gICAgICAgIG1heEJhbmR3aWR0aERvd246IC0xLFxuICAgICAgICBtYXhQZWVyQ29ubmVjdGlvbnM6IC0xLFxuICAgICAgICBydW5JbkJhY2tncm91bmQ6IGZhbHNlLFxuICAgICAgICBydW5PblN0YXJ0dXA6IGZhbHNlLFxuICAgICAgICBjaGVja0ZvclVwZGF0ZXM6IHRydWUsXG4gICAgfTtcbiAgICByZXR1cm4gQU9EQjtcbn0oQU9Sb3V0ZXJJbnRlcmZhY2VfMS5kZWZhdWx0KSk7XG5leHBvcnRzLmRlZmF1bHQgPSBBT0RCO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XG4vKipcbiAqIEFPUm91dGVyQ29yZVByb2Nlc3NQcmV0ZW5kZXJcbiAqXG4gKiBJbiBvcmRlciB0byBrZWVwIHRoZSBBT1JvdXRlciBjbGVhbiwgd2UgYXJlIG1ha2luZyB0aGUgY29yZSByb3V0ZXJcbiAqIGludGVyZmFjZSBhcHBlYXIgYXMgYSBcInByb2Nlc3NcIiwgb3IgYXQgbGVhc3QgaGF2ZSB0aGUgc2FtZVxuICogbWV0aG9kcyB0aGF0IHRoZSBzdWJwcm9jZXNzZXMgd291bGQgdXNlIHRvIGNvbW11bmljYXRlIHVwIHRvXG4gKiB0aGUgcm91dGVyLlxuICovXG52YXIgQU9Sb3V0ZXJDb3JlUHJvY2Vzc1ByZXRlbmRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQU9Sb3V0ZXJDb3JlUHJvY2Vzc1ByZXRlbmRlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBT1JvdXRlckNvcmVQcm9jZXNzUHJldGVuZGVyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEFPUm91dGVyQ29yZVByb2Nlc3NQcmV0ZW5kZXIucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAobWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5lbWl0KCdtZXNzYWdlJywgbWVzc2FnZSk7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIHJldHVybiBBT1JvdXRlckNvcmVQcm9jZXNzUHJldGVuZGVyO1xufShldmVudHNfMS5FdmVudEVtaXR0ZXIpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFPUm91dGVyQ29yZVByb2Nlc3NQcmV0ZW5kZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BT1JvdXRlckNvcmVQcm9jZXNzUHJldGVuZGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xudmFyIGZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcbnZhciBBT1JvdXRlckNvcmVQcm9jZXNzUHJldGVuZGVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vQU9Sb3V0ZXJDb3JlUHJvY2Vzc1ByZXRlbmRlclwiKSk7XG4vKipcbiAqIEFueSBjbGFzcyBpbnRlcmZhY2luZyB3aXRoIHRoZSBBT1JvdXRlciBzaG91bGQgaGFuZGxlIHRoZXNlXG4gKi9cbnZhciBBT1JvdXRlckludGVyZmFjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBT1JvdXRlckludGVyZmFjZSgpIHtcbiAgICB9XG4gICAgcmV0dXJuIEFPUm91dGVySW50ZXJmYWNlO1xufSgpKTtcbi8qKlxuICogQU9TdWJwcm9jZXNzUm91dGVyIHByb3ZpZGVzIGFuIGFic3RyYWN0aW9uIG9uIHRvcCBvZiB0aGVcbiAqIGluY29taW5nIGFuZCBvdXRnb2luZyBwcm9jZXNzIG1lc3NhZ2VzLiBUaGlzIHNpbXBsaWZpZXNcbiAqIHRoZSBBUEkgZm9yIHN1YnByb2Nlc3NlcyB0byBpbnRlcmFjdCB3aXRoIEFPIHZpYSB0aGVcbiAqIGZvbGxvd2luZyB0d28gbWVjaGFuaXNtczpcbiAqXG4gKiAxLiBGb3Igc2VuZGluZyBtZXNzYWdlcy9yZXF1ZXN0c1xuICogICAgICB0aGlzLnJvdXRlci5zZW5kKCdldmVudCcsIGRhdGEpLnRoZW4oKS5jYXRjaCgpXG4gKlxuICogMi4gRm9yIGhhbmRsaW5nIGluY29taW5nIHJlcXVlc3RzXG4gKiAgICAgIHRoaXMucm91dGVyLm9uKCdldmVudCcsIChpbmNvbWluZ1JlcXVlc3QpID0+IHtcbiAqICAgICAgICAgIGluY29taW5nUmVxdWVzdC5yZXNwb25kKGRhdGEpXG4gKiAgICAgICAgICBpbmNvbWluZ1JlcXVlc3QucmVqZWN0KGVycm9yKVxuICogICAgICB9KVxuICovXG52YXIgQU9TdWJwcm9jZXNzUm91dGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBT1N1YnByb2Nlc3NSb3V0ZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQU9TdWJwcm9jZXNzUm91dGVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5yZXF1ZXN0Q291bnQgPSAwO1xuICAgICAgICBfdGhpcy5wcm9jZXNzSWRlbnRpZmllciA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg1KTtcbiAgICAgICAgX3RoaXMucHJvY2VzcyA9IHByb2Nlc3M7XG4gICAgICAgIF90aGlzLnByb2Nlc3Mub24oJ21lc3NhZ2UnLCBfdGhpcy5fcm91dGVNZXNzYWdlLmJpbmQoX3RoaXMpKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBfcm91dGVNZXNzYWdlIGlzIHVzZWQgdG8gd3JhcCB0aGUgaW5jb21pbmcgcmVxdWVzdFxuICAgICAqIHdpdGggYSBzZXQgb2YgY2FsbGJhY2tzIHRvIHJlc3BvbmQgZGlyZWN0bHkgdG8gdGhhdFxuICAgICAqIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXNzYWdlXG4gICAgICovXG4gICAgQU9TdWJwcm9jZXNzUm91dGVyLnByb3RvdHlwZS5fcm91dGVNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UucmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHJlc3BvbnNlIHRvIG9uZSBvZiBvdXIgZWFybGllciByZXF1ZXN0cywgd2UgbGV0IFxuICAgICAgICAgICAgLy8gdGhlIG90aGVyIGV2ZW50IGxpc3RlbmVyIGhhbmRsZSB0aGF0XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UuZGF0YSAmJiBtZXNzYWdlLmRhdGEuc3RyZWFtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU3VicHJvY2VzcyAtIGF0dGVtcHQgdG8gY3JlYXRlIHJlYWRTdHJlYW0gb24gZmQ0Jyk7XG4gICAgICAgICAgICBtZXNzYWdlLmRhdGEuc3RyZWFtID0gZnNfMS5kZWZhdWx0LmNyZWF0ZVJlYWRTdHJlYW0obnVsbCwgeyBmZDogNCB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5jb21pbmdSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgaWQ6IG1lc3NhZ2UucmVxdWVzdElkLFxuICAgICAgICAgICAgZXZlbnQ6IG1lc3NhZ2UuZXZlbnQsXG4gICAgICAgICAgICBkYXRhOiBtZXNzYWdlLmRhdGEgfHwge30sXG4gICAgICAgICAgICBldGhBZGRyZXNzOiBtZXNzYWdlLmV0aEFkZHJlc3MsXG4gICAgICAgICAgICByZXNwb25kOiB0aGlzLl9yb3V0ZU1lc3NhZ2VSZXNwb25zZS5iaW5kKHRoaXMsIG1lc3NhZ2UsIGZhbHNlKSxcbiAgICAgICAgICAgIHJlamVjdDogdGhpcy5fcm91dGVNZXNzYWdlUmVzcG9uc2UuYmluZCh0aGlzLCBtZXNzYWdlLCB0cnVlKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuZXZlbnQsIGluY29taW5nUmVxdWVzdCk7XG4gICAgfTtcbiAgICBBT1N1YnByb2Nlc3NSb3V0ZXIucHJvdG90eXBlLl9yb3V0ZU1lc3NhZ2VSZXNwb25zZSA9IGZ1bmN0aW9uIChvcmlnaW5hdGluZ01lc3NhZ2UsIGlzUmVqZWN0LCByZXNwb25zZURhdGEpIHtcbiAgICAgICAgdmFyIG91dGdvaW5nUmVzcG9uc2UgPSB7XG4gICAgICAgICAgICByb3V0ZXJNZXNzYWdlSWQ6IG9yaWdpbmF0aW5nTWVzc2FnZS5yb3V0ZXJNZXNzYWdlSWQsXG4gICAgICAgICAgICByZXF1ZXN0SWQ6IG9yaWdpbmF0aW5nTWVzc2FnZS5yZXF1ZXN0SWQsXG4gICAgICAgICAgICByZXNwb25zZUlkOiBvcmlnaW5hdGluZ01lc3NhZ2UucmVxdWVzdElkLFxuICAgICAgICAgICAgZXZlbnQ6IG9yaWdpbmF0aW5nTWVzc2FnZS5ldmVudCxcbiAgICAgICAgICAgIGV0aEFkZHJlc3M6IG9yaWdpbmF0aW5nTWVzc2FnZS5ldGhBZGRyZXNzLFxuICAgICAgICAgICAgZGF0YTogIWlzUmVqZWN0ID8gcmVzcG9uc2VEYXRhIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZXJyb3I6IGlzUmVqZWN0ID8gKHJlc3BvbnNlRGF0YSBpbnN0YW5jZW9mIEVycm9yID8gcmVzcG9uc2VEYXRhLm1lc3NhZ2UgOiByZXNwb25zZURhdGEpIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnByb2Nlc3Muc2VuZChvdXRnb2luZ1Jlc3BvbnNlKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFNlbmQtdG8tUm91dGVyIGlzIHdyYXBwZWQgaW4gYSBwcm9taXNlIGZvciBwcm9jZXNzXG4gICAgICogYWJzdHJhY3Rpb24gYW5kIGJldHRlciBoYW5kbGluZyBvZiByZXNwb25zZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEByZXR1cm5zIFByb21pc2U8YW55PlxuICAgICAqL1xuICAgIEFPU3VicHJvY2Vzc1JvdXRlci5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3RJZCA9IF90aGlzLnByb2Nlc3NJZGVudGlmaWVyICsgXCI6XCIgKyArK190aGlzLnJlcXVlc3RDb3VudDtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RJZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEuc3RyZWFtKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmVtaW5kZXI6IHdlIGFyZSBzZW5kaW5nIHRoZSBzdHJlYW0gdXAgdG8gdGhlIHBhcmVudFxuICAgICAgICAgICAgICAgICAqIHByb2Nlc3MgKGNvcmUpXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFyIHJlYWRhYmxlU3RyZWFtID0gZGF0YS5zdHJlYW07XG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dFN0cmVhbSA9IGZzXzEuZGVmYXVsdC5jcmVhdGVXcml0ZVN0cmVhbShudWxsLCB7IGZkOiA0IH0pO1xuICAgICAgICAgICAgICAgIHJlYWRhYmxlU3RyZWFtLnBpcGUob3V0cHV0U3RyZWFtKTtcbiAgICAgICAgICAgICAgICBkYXRhLnN0cmVhbSA9IHRydWU7IC8vIFdlIGRvbnQgcGFzcyB0aGUgc3RyZWFtIG9iamVjdCB0aHJvdWdoIHRvIHRoZSByb3V0ZXIgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5wcm9jZXNzLnNlbmQocmVxdWVzdCwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gZGF0YS5zdHJlYW0udW5waXBlKHRoaXMucHJvY2Vzcy5zdGRpb1szXSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLnByb2Nlc3Mub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS5yZXF1ZXN0SWQgPT09IHJlcXVlc3QucmVxdWVzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChtZXNzYWdlLmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBBT1N1YnByb2Nlc3NSb3V0ZXI7XG59KGV2ZW50c18xLkV2ZW50RW1pdHRlcikpO1xuZXhwb3J0cy5BT1N1YnByb2Nlc3NSb3V0ZXIgPSBBT1N1YnByb2Nlc3NSb3V0ZXI7XG4vKipcbiAqIFNhbWUgYXMgQU9TdWJwcm9jZXNzUm91dGVyLCBidXQgc2luY2UgdGhpcyBpcyBydW5uaW5nIG9uIHRoZSBzYW1lIHByb2Nlc3NcbiAqIGFzIHRoZSByb3V0ZXIvY29yZSB3ZSBuZWVkIHRvIG1ha2Ugc29tZSBtb2RpZmljYXRpb25zLlxuICovXG52YXIgQU9Db3JlUHJvY2Vzc1JvdXRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQU9Db3JlUHJvY2Vzc1JvdXRlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBT0NvcmVQcm9jZXNzUm91dGVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5yZXF1ZXN0Q291bnQgPSAwO1xuICAgICAgICBfdGhpcy5wcm9jZXNzSWRlbnRpZmllciA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg1KTtcbiAgICAgICAgX3RoaXMucHJvY2VzcyA9IG5ldyBBT1JvdXRlckNvcmVQcm9jZXNzUHJldGVuZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICBfdGhpcy5wcm9jZXNzLm9uKCdtZXNzYWdlJywgX3RoaXMuX3JvdXRlTWVzc2FnZS5iaW5kKF90aGlzKSk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogX3JvdXRlTWVzc2FnZSBpcyB1c2VkIHRvIHdyYXAgdGhlIGluY29taW5nIHJlcXVlc3RcbiAgICAgKiB3aXRoIGEgc2V0IG9mIGNhbGxiYWNrcyB0byByZXNwb25kIGRpcmVjdGx5IHRvIHRoYXRcbiAgICAgKiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxuICAgICAqL1xuICAgIEFPQ29yZVByb2Nlc3NSb3V0ZXIucHJvdG90eXBlLl9yb3V0ZU1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICBpZiAobWVzc2FnZS5yZXNwb25zZUlkKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgcmVzcG9uc2UgdG8gb25lIG9mIG91ciBlYXJsaWVyIHJlcXVlc3RzLCB3ZSBsZXQgXG4gICAgICAgICAgICAvLyB0aGUgb3RoZXIgZXZlbnQgbGlzdGVuZXIgaGFuZGxlIHRoYXRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaW5jb21pbmdSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgaWQ6IG1lc3NhZ2UucmVxdWVzdElkLFxuICAgICAgICAgICAgZXZlbnQ6IG1lc3NhZ2UuZXZlbnQsXG4gICAgICAgICAgICBkYXRhOiBtZXNzYWdlLmRhdGEgfHwge30sXG4gICAgICAgICAgICBldGhBZGRyZXNzOiBtZXNzYWdlLmV0aEFkZHJlc3MsXG4gICAgICAgICAgICByZXNwb25kOiB0aGlzLl9yb3V0ZU1lc3NhZ2VSZXNwb25zZS5iaW5kKHRoaXMsIG1lc3NhZ2UsIGZhbHNlKSxcbiAgICAgICAgICAgIHJlamVjdDogdGhpcy5fcm91dGVNZXNzYWdlUmVzcG9uc2UuYmluZCh0aGlzLCBtZXNzYWdlLCB0cnVlKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbWl0KG1lc3NhZ2UuZXZlbnQsIGluY29taW5nUmVxdWVzdCk7XG4gICAgfTtcbiAgICBBT0NvcmVQcm9jZXNzUm91dGVyLnByb3RvdHlwZS5fcm91dGVNZXNzYWdlUmVzcG9uc2UgPSBmdW5jdGlvbiAob3JpZ2luYXRpbmdNZXNzYWdlLCBpc1JlamVjdCwgcmVzcG9uc2VEYXRhKSB7XG4gICAgICAgIHZhciBvdXRnb2luZ1Jlc3BvbnNlID0ge1xuICAgICAgICAgICAgcm91dGVyTWVzc2FnZUlkOiBvcmlnaW5hdGluZ01lc3NhZ2Uucm91dGVyTWVzc2FnZUlkLFxuICAgICAgICAgICAgcmVxdWVzdElkOiBvcmlnaW5hdGluZ01lc3NhZ2UucmVxdWVzdElkLFxuICAgICAgICAgICAgcmVzcG9uc2VJZDogb3JpZ2luYXRpbmdNZXNzYWdlLnJlcXVlc3RJZCxcbiAgICAgICAgICAgIGV2ZW50OiBvcmlnaW5hdGluZ01lc3NhZ2UuZXZlbnQsXG4gICAgICAgICAgICBldGhBZGRyZXNzOiBvcmlnaW5hdGluZ01lc3NhZ2UuZXRoQWRkcmVzcyxcbiAgICAgICAgICAgIGRhdGE6ICFpc1JlamVjdCA/IHJlc3BvbnNlRGF0YSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGVycm9yOiBpc1JlamVjdCA/IChyZXNwb25zZURhdGEgaW5zdGFuY2VvZiBFcnJvciA/IHJlc3BvbnNlRGF0YS5tZXNzYWdlIDogcmVzcG9uc2VEYXRhKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wcm9jZXNzLnNlbmQob3V0Z29pbmdSZXNwb25zZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZW5kLXRvLVJvdXRlciBpcyB3cmFwcGVkIGluIGEgcHJvbWlzZSBmb3IgcHJvY2Vzc1xuICAgICAqIGFic3RyYWN0aW9uIGFuZCBiZXR0ZXIgaGFuZGxpbmcgb2YgcmVzcG9uc2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlPGFueT5cbiAgICAgKi9cbiAgICBBT0NvcmVQcm9jZXNzUm91dGVyLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vIFRPRE86IGlmIHdlIGFyZSBzZW5kaW5nIGEgc3RyZWFtLCBtYWtlIHN1cmUgb3VyIHN0ZGlvIGZkIGlzIG5vdCBpbiB1c2UhXG4gICAgICAgIC8vIElmIHNvIHdlIG5lZWQgdG8gbW92ZSB0aGlzIG9udG8gYSBxdWV1ZVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3RJZCA9IF90aGlzLnByb2Nlc3NJZGVudGlmaWVyICsgXCI6XCIgKyArK190aGlzLnJlcXVlc3RDb3VudDtcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RJZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF90aGlzLnByb2Nlc3Muc2VuZChyZXF1ZXN0LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF90aGlzLnByb2Nlc3Mub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS5yZXF1ZXN0SWQgPT09IHJlcXVlc3QucmVxdWVzdElkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChtZXNzYWdlLmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBBT0NvcmVQcm9jZXNzUm91dGVyO1xufShldmVudHNfMS5FdmVudEVtaXR0ZXIpKTtcbmV4cG9ydHMuQU9Db3JlUHJvY2Vzc1JvdXRlciA9IEFPQ29yZVByb2Nlc3NSb3V0ZXI7XG4vKipcbiAqIEFPUm91dGVySW50ZXJmYWNlXG4gKlxuICogU2ltcGxlIHdyYXBwZXIgYXJvdW5kIHRoZSBwcm9jZXNzIHJvdXRlciBmb3Igbm93LCBidXRcbiAqIHdpbGwgZXh0ZW5kIHRvIGhhbmRsZSBsaWZlY3ljbGUgZXZlbnRzIGFzIHdlbGwuXG4gKi9cbnZhciBBT1JvdXRlclN1YnByb2Nlc3NJbnRlcmZhY2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQU9Sb3V0ZXJTdWJwcm9jZXNzSW50ZXJmYWNlKCkge1xuICAgICAgICB0aGlzLnJvdXRlciA9IG5ldyBBT1N1YnByb2Nlc3NSb3V0ZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIEFPUm91dGVyU3VicHJvY2Vzc0ludGVyZmFjZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBBT1JvdXRlclN1YnByb2Nlc3NJbnRlcmZhY2U7XG52YXIgQU9Sb3V0ZXJDb3JlUHJvY2Vzc0ludGVyZmFjZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBT1JvdXRlckNvcmVQcm9jZXNzSW50ZXJmYWNlKCkge1xuICAgICAgICB0aGlzLnJvdXRlciA9IG5ldyBBT0NvcmVQcm9jZXNzUm91dGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBBT1JvdXRlckNvcmVQcm9jZXNzSW50ZXJmYWNlO1xufSgpKTtcbmV4cG9ydHMuQU9Sb3V0ZXJDb3JlUHJvY2Vzc0ludGVyZmFjZSA9IEFPUm91dGVyQ29yZVByb2Nlc3NJbnRlcmZhY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BT1JvdXRlckludGVyZmFjZS5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cy5CaW5hcnlTZWFyY2hUcmVlID0gcmVxdWlyZSgnLi9saWIvYnN0Jyk7XG5tb2R1bGUuZXhwb3J0cy5BVkxUcmVlID0gcmVxdWlyZSgnLi9saWIvYXZsdHJlZScpO1xuIiwiLyoqXG4gKiBTZWxmLWJhbGFuY2luZyBiaW5hcnkgc2VhcmNoIHRyZWUgdXNpbmcgdGhlIEFWTCBpbXBsZW1lbnRhdGlvblxuICovXG52YXIgQmluYXJ5U2VhcmNoVHJlZSA9IHJlcXVpcmUoJy4vYnN0JylcbiAgLCBjdXN0b21VdGlscyA9IHJlcXVpcmUoJy4vY3VzdG9tVXRpbHMnKVxuICAsIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbiAgLCBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpXG4gIDtcblxuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBXZSBjYW4ndCB1c2UgYSBkaXJlY3QgcG9pbnRlciB0byB0aGUgcm9vdCBub2RlIChhcyBpbiB0aGUgc2ltcGxlIGJpbmFyeSBzZWFyY2ggdHJlZSlcbiAqIGFzIHRoZSByb290IHdpbGwgY2hhbmdlIGR1cmluZyB0cmVlIHJvdGF0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSAgb3B0aW9ucy51bmlxdWUgV2hldGhlciB0byBlbmZvcmNlIGEgJ3VuaXF1ZScgY29uc3RyYWludCBvbiB0aGUga2V5IG9yIG5vdFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5jb21wYXJlS2V5cyBJbml0aWFsaXplIHRoaXMgQlNUJ3MgY29tcGFyZUtleXNcbiAqL1xuZnVuY3Rpb24gQVZMVHJlZSAob3B0aW9ucykge1xuICB0aGlzLnRyZWUgPSBuZXcgX0FWTFRyZWUob3B0aW9ucyk7XG59XG5cblxuLyoqXG4gKiBDb25zdHJ1Y3RvciBvZiB0aGUgaW50ZXJuYWwgQVZMVHJlZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9uYWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gIG9wdGlvbnMudW5pcXVlIFdoZXRoZXIgdG8gZW5mb3JjZSBhICd1bmlxdWUnIGNvbnN0cmFpbnQgb24gdGhlIGtleSBvciBub3RcbiAqIEBwYXJhbSB7S2V5fSAgICAgIG9wdGlvbnMua2V5IEluaXRpYWxpemUgdGhpcyBCU1QncyBrZXkgd2l0aCBrZXlcbiAqIEBwYXJhbSB7VmFsdWV9ICAgIG9wdGlvbnMudmFsdWUgSW5pdGlhbGl6ZSB0aGlzIEJTVCdzIGRhdGEgd2l0aCBbdmFsdWVdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLmNvbXBhcmVLZXlzIEluaXRpYWxpemUgdGhpcyBCU1QncyBjb21wYXJlS2V5c1xuICovXG5mdW5jdGlvbiBfQVZMVHJlZSAob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLmxlZnQgPSBudWxsO1xuICB0aGlzLnJpZ2h0ID0gbnVsbDtcbiAgdGhpcy5wYXJlbnQgPSBvcHRpb25zLnBhcmVudCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wYXJlbnQgOiBudWxsO1xuICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgna2V5JykpIHsgdGhpcy5rZXkgPSBvcHRpb25zLmtleTsgfVxuICB0aGlzLmRhdGEgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCd2YWx1ZScpID8gW29wdGlvbnMudmFsdWVdIDogW107XG4gIHRoaXMudW5pcXVlID0gb3B0aW9ucy51bmlxdWUgfHwgZmFsc2U7XG5cbiAgdGhpcy5jb21wYXJlS2V5cyA9IG9wdGlvbnMuY29tcGFyZUtleXMgfHwgY3VzdG9tVXRpbHMuZGVmYXVsdENvbXBhcmVLZXlzRnVuY3Rpb247XG4gIHRoaXMuY2hlY2tWYWx1ZUVxdWFsaXR5ID0gb3B0aW9ucy5jaGVja1ZhbHVlRXF1YWxpdHkgfHwgY3VzdG9tVXRpbHMuZGVmYXVsdENoZWNrVmFsdWVFcXVhbGl0eTtcbn1cblxuXG4vKipcbiAqIEluaGVyaXQgYmFzaWMgZnVuY3Rpb25zIGZyb20gdGhlIGJhc2ljIGJpbmFyeSBzZWFyY2ggdHJlZVxuICovXG51dGlsLmluaGVyaXRzKF9BVkxUcmVlLCBCaW5hcnlTZWFyY2hUcmVlKTtcblxuLyoqXG4gKiBLZWVwIGEgcG9pbnRlciB0byB0aGUgaW50ZXJuYWwgdHJlZSBjb25zdHJ1Y3RvciBmb3IgdGVzdGluZyBwdXJwb3Nlc1xuICovXG5BVkxUcmVlLl9BVkxUcmVlID0gX0FWTFRyZWU7XG5cblxuLyoqXG4gKiBDaGVjayB0aGUgcmVjb3JkZWQgaGVpZ2h0IGlzIGNvcnJlY3QgZm9yIGV2ZXJ5IG5vZGVcbiAqIFRocm93cyBpZiBvbmUgaGVpZ2h0IGRvZXNuJ3QgbWF0Y2hcbiAqL1xuX0FWTFRyZWUucHJvdG90eXBlLmNoZWNrSGVpZ2h0Q29ycmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxlZnRILCByaWdodEg7XG5cbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkgeyByZXR1cm47IH0gICAvLyBFbXB0eSB0cmVlXG5cbiAgaWYgKHRoaXMubGVmdCAmJiB0aGlzLmxlZnQuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHsgdGhyb3cgbmV3IEVycm9yKFwiVW5kZWZpbmVkIGhlaWdodCBmb3Igbm9kZSBcIiArIHRoaXMubGVmdC5rZXkpOyB9XG4gIGlmICh0aGlzLnJpZ2h0ICYmIHRoaXMucmlnaHQuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHsgdGhyb3cgbmV3IEVycm9yKFwiVW5kZWZpbmVkIGhlaWdodCBmb3Igbm9kZSBcIiArIHRoaXMucmlnaHQua2V5KTsgfVxuICBpZiAodGhpcy5oZWlnaHQgPT09IHVuZGVmaW5lZCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJVbmRlZmluZWQgaGVpZ2h0IGZvciBub2RlIFwiICsgdGhpcy5rZXkpOyB9XG5cbiAgbGVmdEggPSB0aGlzLmxlZnQgPyB0aGlzLmxlZnQuaGVpZ2h0IDogMDtcbiAgcmlnaHRIID0gdGhpcy5yaWdodCA/IHRoaXMucmlnaHQuaGVpZ2h0IDogMDtcblxuICBpZiAodGhpcy5oZWlnaHQgIT09IDEgKyBNYXRoLm1heChsZWZ0SCwgcmlnaHRIKSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJIZWlnaHQgY29uc3RyYWludCBmYWlsZWQgZm9yIG5vZGUgXCIgKyB0aGlzLmtleSk7IH1cbiAgaWYgKHRoaXMubGVmdCkgeyB0aGlzLmxlZnQuY2hlY2tIZWlnaHRDb3JyZWN0KCk7IH1cbiAgaWYgKHRoaXMucmlnaHQpIHsgdGhpcy5yaWdodC5jaGVja0hlaWdodENvcnJlY3QoKTsgfVxufTtcblxuXG4vKipcbiAqIFJldHVybiB0aGUgYmFsYW5jZSBmYWN0b3JcbiAqL1xuX0FWTFRyZWUucHJvdG90eXBlLmJhbGFuY2VGYWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsZWZ0SCA9IHRoaXMubGVmdCA/IHRoaXMubGVmdC5oZWlnaHQgOiAwXG4gICAgLCByaWdodEggPSB0aGlzLnJpZ2h0ID8gdGhpcy5yaWdodC5oZWlnaHQgOiAwXG4gICAgO1xuICByZXR1cm4gbGVmdEggLSByaWdodEg7XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCB0aGUgYmFsYW5jZSBmYWN0b3JzIGFyZSBhbGwgYmV0d2VlbiAtMSBhbmQgMVxuICovXG5fQVZMVHJlZS5wcm90b3R5cGUuY2hlY2tCYWxhbmNlRmFjdG9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKE1hdGguYWJzKHRoaXMuYmFsYW5jZUZhY3RvcigpKSA+IDEpIHsgdGhyb3cgbmV3IEVycm9yKCdUcmVlIGlzIHVuYmFsYW5jZWQgYXQgbm9kZSAnICsgdGhpcy5rZXkpOyB9XG5cbiAgaWYgKHRoaXMubGVmdCkgeyB0aGlzLmxlZnQuY2hlY2tCYWxhbmNlRmFjdG9ycygpOyB9XG4gIGlmICh0aGlzLnJpZ2h0KSB7IHRoaXMucmlnaHQuY2hlY2tCYWxhbmNlRmFjdG9ycygpOyB9XG59O1xuXG5cbi8qKlxuICogV2hlbiBjaGVja2luZyBpZiB0aGUgQlNUIGNvbmRpdGlvbnMgYXJlIG1ldCwgYWxzbyBjaGVjayB0aGF0IHRoZSBoZWlnaHRzIGFyZSBjb3JyZWN0XG4gKiBhbmQgdGhlIHRyZWUgaXMgYmFsYW5jZWRcbiAqL1xuX0FWTFRyZWUucHJvdG90eXBlLmNoZWNrSXNBVkxUID0gZnVuY3Rpb24gKCkge1xuICBfQVZMVHJlZS5zdXBlcl8ucHJvdG90eXBlLmNoZWNrSXNCU1QuY2FsbCh0aGlzKTtcbiAgdGhpcy5jaGVja0hlaWdodENvcnJlY3QoKTtcbiAgdGhpcy5jaGVja0JhbGFuY2VGYWN0b3JzKCk7XG59O1xuQVZMVHJlZS5wcm90b3R5cGUuY2hlY2tJc0FWTFQgPSBmdW5jdGlvbiAoKSB7IHRoaXMudHJlZS5jaGVja0lzQVZMVCgpOyB9O1xuXG5cbi8qKlxuICogUGVyZm9ybSBhIHJpZ2h0IHJvdGF0aW9uIG9mIHRoZSB0cmVlIGlmIHBvc3NpYmxlXG4gKiBhbmQgcmV0dXJuIHRoZSByb290IG9mIHRoZSByZXN1bHRpbmcgdHJlZVxuICogVGhlIHJlc3VsdGluZyB0cmVlJ3Mgbm9kZXMnIGhlaWdodHMgYXJlIGFsc28gdXBkYXRlZFxuICovXG5fQVZMVHJlZS5wcm90b3R5cGUucmlnaHRSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHEgPSB0aGlzXG4gICAgLCBwID0gdGhpcy5sZWZ0XG4gICAgLCBiXG4gICAgLCBhaCwgYmgsIGNoO1xuXG4gIGlmICghcCkgeyByZXR1cm4gdGhpczsgfSAgIC8vIE5vIGNoYW5nZVxuXG4gIGIgPSBwLnJpZ2h0O1xuXG4gIC8vIEFsdGVyIHRyZWUgc3RydWN0dXJlXG4gIGlmIChxLnBhcmVudCkge1xuICAgIHAucGFyZW50ID0gcS5wYXJlbnQ7XG4gICAgaWYgKHEucGFyZW50LmxlZnQgPT09IHEpIHsgcS5wYXJlbnQubGVmdCA9IHA7IH0gZWxzZSB7IHEucGFyZW50LnJpZ2h0ID0gcDsgfVxuICB9IGVsc2Uge1xuICAgIHAucGFyZW50ID0gbnVsbDtcbiAgfVxuICBwLnJpZ2h0ID0gcTtcbiAgcS5wYXJlbnQgPSBwO1xuICBxLmxlZnQgPSBiO1xuICBpZiAoYikgeyBiLnBhcmVudCA9IHE7IH1cblxuICAvLyBVcGRhdGUgaGVpZ2h0c1xuICBhaCA9IHAubGVmdCA/IHAubGVmdC5oZWlnaHQgOiAwO1xuICBiaCA9IGIgPyBiLmhlaWdodCA6IDA7XG4gIGNoID0gcS5yaWdodCA/IHEucmlnaHQuaGVpZ2h0IDogMDtcbiAgcS5oZWlnaHQgPSBNYXRoLm1heChiaCwgY2gpICsgMTtcbiAgcC5oZWlnaHQgPSBNYXRoLm1heChhaCwgcS5oZWlnaHQpICsgMTtcblxuICByZXR1cm4gcDtcbn07XG5cblxuLyoqXG4gKiBQZXJmb3JtIGEgbGVmdCByb3RhdGlvbiBvZiB0aGUgdHJlZSBpZiBwb3NzaWJsZVxuICogYW5kIHJldHVybiB0aGUgcm9vdCBvZiB0aGUgcmVzdWx0aW5nIHRyZWVcbiAqIFRoZSByZXN1bHRpbmcgdHJlZSdzIG5vZGVzJyBoZWlnaHRzIGFyZSBhbHNvIHVwZGF0ZWRcbiAqL1xuX0FWTFRyZWUucHJvdG90eXBlLmxlZnRSb3RhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHAgPSB0aGlzXG4gICAgLCBxID0gdGhpcy5yaWdodFxuICAgICwgYlxuICAgICwgYWgsIGJoLCBjaDtcblxuICBpZiAoIXEpIHsgcmV0dXJuIHRoaXM7IH0gICAvLyBObyBjaGFuZ2VcblxuICBiID0gcS5sZWZ0O1xuXG4gIC8vIEFsdGVyIHRyZWUgc3RydWN0dXJlXG4gIGlmIChwLnBhcmVudCkge1xuICAgIHEucGFyZW50ID0gcC5wYXJlbnQ7XG4gICAgaWYgKHAucGFyZW50LmxlZnQgPT09IHApIHsgcC5wYXJlbnQubGVmdCA9IHE7IH0gZWxzZSB7IHAucGFyZW50LnJpZ2h0ID0gcTsgfVxuICB9IGVsc2Uge1xuICAgIHEucGFyZW50ID0gbnVsbDtcbiAgfVxuICBxLmxlZnQgPSBwO1xuICBwLnBhcmVudCA9IHE7XG4gIHAucmlnaHQgPSBiO1xuICBpZiAoYikgeyBiLnBhcmVudCA9IHA7IH1cblxuICAvLyBVcGRhdGUgaGVpZ2h0c1xuICBhaCA9IHAubGVmdCA/IHAubGVmdC5oZWlnaHQgOiAwO1xuICBiaCA9IGIgPyBiLmhlaWdodCA6IDA7XG4gIGNoID0gcS5yaWdodCA/IHEucmlnaHQuaGVpZ2h0IDogMDtcbiAgcC5oZWlnaHQgPSBNYXRoLm1heChhaCwgYmgpICsgMTtcbiAgcS5oZWlnaHQgPSBNYXRoLm1heChjaCwgcC5oZWlnaHQpICsgMTtcblxuICByZXR1cm4gcTtcbn07XG5cblxuLyoqXG4gKiBNb2RpZnkgdGhlIHRyZWUgaWYgaXRzIHJpZ2h0IHN1YnRyZWUgaXMgdG9vIHNtYWxsIGNvbXBhcmVkIHRvIHRoZSBsZWZ0XG4gKiBSZXR1cm4gdGhlIG5ldyByb290IGlmIGFueVxuICovXG5fQVZMVHJlZS5wcm90b3R5cGUucmlnaHRUb29TbWFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYmFsYW5jZUZhY3RvcigpIDw9IDEpIHsgcmV0dXJuIHRoaXM7IH0gICAvLyBSaWdodCBpcyBub3QgdG9vIHNtYWxsLCBkb24ndCBjaGFuZ2VcblxuICBpZiAodGhpcy5sZWZ0LmJhbGFuY2VGYWN0b3IoKSA8IDApIHtcbiAgICB0aGlzLmxlZnQubGVmdFJvdGF0aW9uKCk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5yaWdodFJvdGF0aW9uKCk7XG59O1xuXG5cbi8qKlxuICogTW9kaWZ5IHRoZSB0cmVlIGlmIGl0cyBsZWZ0IHN1YnRyZWUgaXMgdG9vIHNtYWxsIGNvbXBhcmVkIHRvIHRoZSByaWdodFxuICogUmV0dXJuIHRoZSBuZXcgcm9vdCBpZiBhbnlcbiAqL1xuX0FWTFRyZWUucHJvdG90eXBlLmxlZnRUb29TbWFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYmFsYW5jZUZhY3RvcigpID49IC0xKSB7IHJldHVybiB0aGlzOyB9ICAgLy8gTGVmdCBpcyBub3QgdG9vIHNtYWxsLCBkb24ndCBjaGFuZ2VcblxuICBpZiAodGhpcy5yaWdodC5iYWxhbmNlRmFjdG9yKCkgPiAwKSB7XG4gICAgdGhpcy5yaWdodC5yaWdodFJvdGF0aW9uKCk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5sZWZ0Um90YXRpb24oKTtcbn07XG5cblxuLyoqXG4gKiBSZWJhbGFuY2UgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGguIFRoZSBwYXRoIGlzIGdpdmVuIHJldmVyc2VkIChhcyBoZSB3YXMgY2FsY3VsYXRlZFxuICogaW4gdGhlIGluc2VydCBhbmQgZGVsZXRlIGZ1bmN0aW9ucykuXG4gKiBSZXR1cm5zIHRoZSBuZXcgcm9vdCBvZiB0aGUgdHJlZVxuICogT2YgY291cnNlLCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgcGF0aCBtdXN0IGJlIHRoZSByb290IG9mIHRoZSB0cmVlXG4gKi9cbl9BVkxUcmVlLnByb3RvdHlwZS5yZWJhbGFuY2VBbG9uZ1BhdGggPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgbmV3Um9vdCA9IHRoaXNcbiAgICAsIHJvdGF0ZWRcbiAgICAsIGk7XG5cbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkgeyBkZWxldGUgdGhpcy5oZWlnaHQ7IHJldHVybiB0aGlzOyB9ICAgLy8gRW1wdHkgdHJlZVxuXG4gIC8vIFJlYmFsYW5jZSB0aGUgdHJlZSBhbmQgdXBkYXRlIGFsbCBoZWlnaHRzXG4gIGZvciAoaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICBwYXRoW2ldLmhlaWdodCA9IDEgKyBNYXRoLm1heChwYXRoW2ldLmxlZnQgPyBwYXRoW2ldLmxlZnQuaGVpZ2h0IDogMCwgcGF0aFtpXS5yaWdodCA/IHBhdGhbaV0ucmlnaHQuaGVpZ2h0IDogMCk7XG5cbiAgICBpZiAocGF0aFtpXS5iYWxhbmNlRmFjdG9yKCkgPiAxKSB7XG4gICAgICByb3RhdGVkID0gcGF0aFtpXS5yaWdodFRvb1NtYWxsKCk7XG4gICAgICBpZiAoaSA9PT0gMCkgeyBuZXdSb290ID0gcm90YXRlZDsgfVxuICAgIH1cblxuICAgIGlmIChwYXRoW2ldLmJhbGFuY2VGYWN0b3IoKSA8IC0xKSB7XG4gICAgICByb3RhdGVkID0gcGF0aFtpXS5sZWZ0VG9vU21hbGwoKTtcbiAgICAgIGlmIChpID09PSAwKSB7IG5ld1Jvb3QgPSByb3RhdGVkOyB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld1Jvb3Q7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEga2V5LCB2YWx1ZSBwYWlyIGluIHRoZSB0cmVlIHdoaWxlIG1haW50YWluaW5nIHRoZSBBVkwgdHJlZSBoZWlnaHQgY29uc3RyYWludFxuICogUmV0dXJuIGEgcG9pbnRlciB0byB0aGUgcm9vdCBub2RlLCB3aGljaCBtYXkgaGF2ZSBjaGFuZ2VkXG4gKi9cbl9BVkxUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgaW5zZXJ0UGF0aCA9IFtdXG4gICAgLCBjdXJyZW50Tm9kZSA9IHRoaXNcbiAgICA7XG5cbiAgLy8gRW1wdHkgdHJlZSwgaW5zZXJ0IGFzIHJvb3RcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkge1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICB0aGlzLmhlaWdodCA9IDE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBJbnNlcnQgbmV3IGxlYWYgYXQgdGhlIHJpZ2h0IHBsYWNlXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgLy8gU2FtZSBrZXk6IG5vIGNoYW5nZSBpbiB0aGUgdHJlZSBzdHJ1Y3R1cmVcbiAgICBpZiAoY3VycmVudE5vZGUuY29tcGFyZUtleXMoY3VycmVudE5vZGUua2V5LCBrZXkpID09PSAwKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUudW5pcXVlKSB7XG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoXCJDYW4ndCBpbnNlcnQga2V5IFwiICsga2V5ICsgXCIsIGl0IHZpb2xhdGVzIHRoZSB1bmlxdWUgY29uc3RyYWludFwiKTtcbiAgICAgICAgZXJyLmtleSA9IGtleTtcbiAgICAgICAgZXJyLmVycm9yVHlwZSA9ICd1bmlxdWVWaW9sYXRlZCc7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnROb2RlLmRhdGEucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpbnNlcnRQYXRoLnB1c2goY3VycmVudE5vZGUpO1xuXG4gICAgaWYgKGN1cnJlbnROb2RlLmNvbXBhcmVLZXlzKGtleSwgY3VycmVudE5vZGUua2V5KSA8IDApIHtcbiAgICAgIGlmICghY3VycmVudE5vZGUubGVmdCkge1xuICAgICAgICBpbnNlcnRQYXRoLnB1c2goY3VycmVudE5vZGUuY3JlYXRlTGVmdENoaWxkKHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5sZWZ0O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWN1cnJlbnROb2RlLnJpZ2h0KSB7XG4gICAgICAgIGluc2VydFBhdGgucHVzaChjdXJyZW50Tm9kZS5jcmVhdGVSaWdodENoaWxkKHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5yaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5yZWJhbGFuY2VBbG9uZ1BhdGgoaW5zZXJ0UGF0aCk7XG59O1xuXG4vLyBJbnNlcnQgaW4gdGhlIGludGVybmFsIHRyZWUsIHVwZGF0ZSB0aGUgcG9pbnRlciB0byB0aGUgcm9vdCBpZiBuZWVkZWRcbkFWTFRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBuZXdUcmVlID0gdGhpcy50cmVlLmluc2VydChrZXksIHZhbHVlKTtcblxuICAvLyBJZiBuZXdUcmVlIGlzIHVuZGVmaW5lZCwgdGhhdCBtZWFucyBpdHMgc3RydWN0dXJlIHdhcyBub3QgbW9kaWZpZWRcbiAgaWYgKG5ld1RyZWUpIHsgdGhpcy50cmVlID0gbmV3VHJlZTsgfVxufTtcblxuXG4vKipcbiAqIERlbGV0ZSBhIGtleSBvciBqdXN0IGEgdmFsdWUgYW5kIHJldHVybiB0aGUgbmV3IHJvb3Qgb2YgdGhlIHRyZWVcbiAqIEBwYXJhbSB7S2V5fSBrZXlcbiAqIEBwYXJhbSB7VmFsdWV9IHZhbHVlIE9wdGlvbmFsLiBJZiBub3Qgc2V0LCB0aGUgd2hvbGUga2V5IGlzIGRlbGV0ZWQuIElmIHNldCwgb25seSB0aGlzIHZhbHVlIGlzIGRlbGV0ZWRcbiAqL1xuX0FWTFRyZWUucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBuZXdEYXRhID0gW10sIHJlcGxhY2VXaXRoXG4gICAgLCBzZWxmID0gdGhpc1xuICAgICwgY3VycmVudE5vZGUgPSB0aGlzXG4gICAgLCBkZWxldGVQYXRoID0gW11cbiAgICA7XG5cbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkgeyByZXR1cm4gdGhpczsgfSAgIC8vIEVtcHR5IHRyZWVcblxuICAvLyBFaXRoZXIgbm8gbWF0Y2ggaXMgZm91bmQgYW5kIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiBmcm9tIHdpdGhpbiB0aGUgbG9vcFxuICAvLyBPciBhIG1hdGNoIGlzIGZvdW5kIGFuZCBkZWxldGVQYXRoIHdpbGwgY29udGFpbiB0aGUgcGF0aCBmcm9tIHRoZSByb290IHRvIHRoZSBub2RlIHRvIGRlbGV0ZSBhZnRlciB0aGUgbG9vcFxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChjdXJyZW50Tm9kZS5jb21wYXJlS2V5cyhrZXksIGN1cnJlbnROb2RlLmtleSkgPT09IDApIHsgYnJlYWs7IH1cblxuICAgIGRlbGV0ZVBhdGgucHVzaChjdXJyZW50Tm9kZSk7XG5cbiAgICBpZiAoY3VycmVudE5vZGUuY29tcGFyZUtleXMoa2V5LCBjdXJyZW50Tm9kZS5rZXkpIDwgMCkge1xuICAgICAgaWYgKGN1cnJlbnROb2RlLmxlZnQpIHtcbiAgICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5sZWZ0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7ICAgLy8gS2V5IG5vdCBmb3VuZCwgbm8gbW9kaWZpY2F0aW9uXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGN1cnJlbnROb2RlLmNvbXBhcmVLZXlzKGtleSwgY3VycmVudE5vZGUua2V5KSBpcyA+IDBcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5yaWdodCkge1xuICAgICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnJpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7ICAgLy8gS2V5IG5vdCBmb3VuZCwgbm8gbW9kaWZpY2F0aW9uXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRGVsZXRlIG9ubHkgYSB2YWx1ZSAobm8gdHJlZSBtb2RpZmljYXRpb24pXG4gIGlmIChjdXJyZW50Tm9kZS5kYXRhLmxlbmd0aCA+IDEgJiYgdmFsdWUpIHtcbiAgICBjdXJyZW50Tm9kZS5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGQpIHtcbiAgICAgIGlmICghY3VycmVudE5vZGUuY2hlY2tWYWx1ZUVxdWFsaXR5KGQsIHZhbHVlKSkgeyBuZXdEYXRhLnB1c2goZCk7IH1cbiAgICB9KTtcbiAgICBjdXJyZW50Tm9kZS5kYXRhID0gbmV3RGF0YTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIERlbGV0ZSBhIHdob2xlIG5vZGVcblxuICAvLyBMZWFmXG4gIGlmICghY3VycmVudE5vZGUubGVmdCAmJiAhY3VycmVudE5vZGUucmlnaHQpIHtcbiAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMpIHsgICAvLyBUaGlzIGxlYWYgaXMgYWxzbyB0aGUgcm9vdFxuICAgICAgZGVsZXRlIGN1cnJlbnROb2RlLmtleTtcbiAgICAgIGN1cnJlbnROb2RlLmRhdGEgPSBbXTtcbiAgICAgIGRlbGV0ZSBjdXJyZW50Tm9kZS5oZWlnaHQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudC5sZWZ0ID09PSBjdXJyZW50Tm9kZSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQubGVmdCA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQucmlnaHQgPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmViYWxhbmNlQWxvbmdQYXRoKGRlbGV0ZVBhdGgpO1xuICAgIH1cbiAgfVxuXG5cbiAgLy8gTm9kZSB3aXRoIG9ubHkgb25lIGNoaWxkXG4gIGlmICghY3VycmVudE5vZGUubGVmdCB8fCAhY3VycmVudE5vZGUucmlnaHQpIHtcbiAgICByZXBsYWNlV2l0aCA9IGN1cnJlbnROb2RlLmxlZnQgPyBjdXJyZW50Tm9kZS5sZWZ0IDogY3VycmVudE5vZGUucmlnaHQ7XG5cbiAgICBpZiAoY3VycmVudE5vZGUgPT09IHRoaXMpIHsgICAvLyBUaGlzIG5vZGUgaXMgYWxzbyB0aGUgcm9vdFxuICAgICAgcmVwbGFjZVdpdGgucGFyZW50ID0gbnVsbDtcbiAgICAgIHJldHVybiByZXBsYWNlV2l0aDsgICAvLyBoZWlnaHQgb2YgcmVwbGFjZVdpdGggaXMgbmVjZXNzYXJpbHkgMSBiZWNhdXNlIHRoZSB0cmVlIHdhcyBiYWxhbmNlZCBiZWZvcmUgZGVsZXRpb25cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudC5sZWZ0ID09PSBjdXJyZW50Tm9kZSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQubGVmdCA9IHJlcGxhY2VXaXRoO1xuICAgICAgICByZXBsYWNlV2l0aC5wYXJlbnQgPSBjdXJyZW50Tm9kZS5wYXJlbnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQucmlnaHQgPSByZXBsYWNlV2l0aDtcbiAgICAgICAgcmVwbGFjZVdpdGgucGFyZW50ID0gY3VycmVudE5vZGUucGFyZW50O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5yZWJhbGFuY2VBbG9uZ1BhdGgoZGVsZXRlUGF0aCk7XG4gICAgfVxuICB9XG5cblxuICAvLyBOb2RlIHdpdGggdHdvIGNoaWxkcmVuXG4gIC8vIFVzZSB0aGUgaW4tb3JkZXIgcHJlZGVjZXNzb3IgKG5vIG5lZWQgdG8gcmFuZG9taXplIHNpbmNlIHdlIGFjdGl2ZWx5IHJlYmFsYW5jZSlcbiAgZGVsZXRlUGF0aC5wdXNoKGN1cnJlbnROb2RlKTtcbiAgcmVwbGFjZVdpdGggPSBjdXJyZW50Tm9kZS5sZWZ0O1xuXG4gIC8vIFNwZWNpYWwgY2FzZTogdGhlIGluLW9yZGVyIHByZWRlY2Vzc29yIGlzIHJpZ2h0IGJlbG93IHRoZSBub2RlIHRvIGRlbGV0ZVxuICBpZiAoIXJlcGxhY2VXaXRoLnJpZ2h0KSB7XG4gICAgY3VycmVudE5vZGUua2V5ID0gcmVwbGFjZVdpdGgua2V5O1xuICAgIGN1cnJlbnROb2RlLmRhdGEgPSByZXBsYWNlV2l0aC5kYXRhO1xuICAgIGN1cnJlbnROb2RlLmxlZnQgPSByZXBsYWNlV2l0aC5sZWZ0O1xuICAgIGlmIChyZXBsYWNlV2l0aC5sZWZ0KSB7IHJlcGxhY2VXaXRoLmxlZnQucGFyZW50ID0gY3VycmVudE5vZGU7IH1cbiAgICByZXR1cm4gdGhpcy5yZWJhbGFuY2VBbG9uZ1BhdGgoZGVsZXRlUGF0aCk7XG4gIH1cblxuICAvLyBBZnRlciB0aGlzIGxvb3AsIHJlcGxhY2VXaXRoIGlzIHRoZSByaWdodC1tb3N0IGxlYWYgaW4gdGhlIGxlZnQgc3VidHJlZVxuICAvLyBhbmQgZGVsZXRlUGF0aCB0aGUgcGF0aCBmcm9tIHRoZSByb290IChpbmNsdXNpdmUpIHRvIHJlcGxhY2VXaXRoIChleGNsdXNpdmUpXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKHJlcGxhY2VXaXRoLnJpZ2h0KSB7XG4gICAgICBkZWxldGVQYXRoLnB1c2gocmVwbGFjZVdpdGgpO1xuICAgICAgcmVwbGFjZVdpdGggPSByZXBsYWNlV2l0aC5yaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgY3VycmVudE5vZGUua2V5ID0gcmVwbGFjZVdpdGgua2V5O1xuICBjdXJyZW50Tm9kZS5kYXRhID0gcmVwbGFjZVdpdGguZGF0YTtcblxuICByZXBsYWNlV2l0aC5wYXJlbnQucmlnaHQgPSByZXBsYWNlV2l0aC5sZWZ0O1xuICBpZiAocmVwbGFjZVdpdGgubGVmdCkgeyByZXBsYWNlV2l0aC5sZWZ0LnBhcmVudCA9IHJlcGxhY2VXaXRoLnBhcmVudDsgfVxuXG4gIHJldHVybiB0aGlzLnJlYmFsYW5jZUFsb25nUGF0aChkZWxldGVQYXRoKTtcbn07XG5cbi8vIERlbGV0ZSBhIHZhbHVlXG5BVkxUcmVlLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgbmV3VHJlZSA9IHRoaXMudHJlZS5kZWxldGUoa2V5LCB2YWx1ZSk7XG5cbiAgLy8gSWYgbmV3VHJlZSBpcyB1bmRlZmluZWQsIHRoYXQgbWVhbnMgaXRzIHN0cnVjdHVyZSB3YXMgbm90IG1vZGlmaWVkXG4gIGlmIChuZXdUcmVlKSB7IHRoaXMudHJlZSA9IG5ld1RyZWU7IH1cbn07XG5cblxuLyoqXG4gKiBPdGhlciBmdW5jdGlvbnMgd2Ugd2FudCB0byB1c2Ugb24gYW4gQVZMVHJlZSBhcyBpZiBpdCB3ZXJlIHRoZSBpbnRlcm5hbCBfQVZMVHJlZVxuICovXG5bJ2dldE51bWJlck9mS2V5cycsICdzZWFyY2gnLCAnYmV0d2VlbkJvdW5kcycsICdwcmV0dHlQcmludCcsICdleGVjdXRlT25FdmVyeU5vZGUnXS5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICBBVkxUcmVlLnByb3RvdHlwZVtmbl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJlZVtmbl0uYXBwbHkodGhpcy50cmVlLCBhcmd1bWVudHMpO1xuICB9O1xufSk7XG5cblxuLy8gSW50ZXJmYWNlXG5tb2R1bGUuZXhwb3J0cyA9IEFWTFRyZWU7XG4iLCIvKipcbiAqIFNpbXBsZSBiaW5hcnkgc2VhcmNoIHRyZWVcbiAqL1xudmFyIGN1c3RvbVV0aWxzID0gcmVxdWlyZSgnLi9jdXN0b21VdGlscycpO1xuXG5cbi8qKlxuICogQ29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59ICBvcHRpb25zLnVuaXF1ZSBXaGV0aGVyIHRvIGVuZm9yY2UgYSAndW5pcXVlJyBjb25zdHJhaW50IG9uIHRoZSBrZXkgb3Igbm90XG4gKiBAcGFyYW0ge0tleX0gICAgICBvcHRpb25zLmtleSBJbml0aWFsaXplIHRoaXMgQlNUJ3Mga2V5IHdpdGgga2V5XG4gKiBAcGFyYW0ge1ZhbHVlfSAgICBvcHRpb25zLnZhbHVlIEluaXRpYWxpemUgdGhpcyBCU1QncyBkYXRhIHdpdGggW3ZhbHVlXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5jb21wYXJlS2V5cyBJbml0aWFsaXplIHRoaXMgQlNUJ3MgY29tcGFyZUtleXNcbiAqL1xuZnVuY3Rpb24gQmluYXJ5U2VhcmNoVHJlZSAob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB0aGlzLmxlZnQgPSBudWxsO1xuICB0aGlzLnJpZ2h0ID0gbnVsbDtcbiAgdGhpcy5wYXJlbnQgPSBvcHRpb25zLnBhcmVudCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5wYXJlbnQgOiBudWxsO1xuICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgna2V5JykpIHsgdGhpcy5rZXkgPSBvcHRpb25zLmtleTsgfVxuICB0aGlzLmRhdGEgPSBvcHRpb25zLmhhc093blByb3BlcnR5KCd2YWx1ZScpID8gW29wdGlvbnMudmFsdWVdIDogW107XG4gIHRoaXMudW5pcXVlID0gb3B0aW9ucy51bmlxdWUgfHwgZmFsc2U7XG5cbiAgdGhpcy5jb21wYXJlS2V5cyA9IG9wdGlvbnMuY29tcGFyZUtleXMgfHwgY3VzdG9tVXRpbHMuZGVmYXVsdENvbXBhcmVLZXlzRnVuY3Rpb247XG4gIHRoaXMuY2hlY2tWYWx1ZUVxdWFsaXR5ID0gb3B0aW9ucy5jaGVja1ZhbHVlRXF1YWxpdHkgfHwgY3VzdG9tVXRpbHMuZGVmYXVsdENoZWNrVmFsdWVFcXVhbGl0eTtcbn1cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWV0aG9kcyB1c2VkIHRvIHRlc3QgdGhlIHRyZWVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuLyoqXG4gKiBHZXQgdGhlIGRlc2NlbmRhbnQgd2l0aCBtYXgga2V5XG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmdldE1heEtleURlc2NlbmRhbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnJpZ2h0KSB7XG4gICAgcmV0dXJuIHRoaXMucmlnaHQuZ2V0TWF4S2V5RGVzY2VuZGFudCgpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5cbi8qKlxuICogR2V0IHRoZSBtYXhpbXVtIGtleVxuICovXG5CaW5hcnlTZWFyY2hUcmVlLnByb3RvdHlwZS5nZXRNYXhLZXkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmdldE1heEtleURlc2NlbmRhbnQoKS5rZXk7XG59O1xuXG5cbi8qKlxuICogR2V0IHRoZSBkZXNjZW5kYW50IHdpdGggbWluIGtleVxuICovXG5CaW5hcnlTZWFyY2hUcmVlLnByb3RvdHlwZS5nZXRNaW5LZXlEZXNjZW5kYW50ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5sZWZ0KSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdC5nZXRNaW5LZXlEZXNjZW5kYW50KClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxuXG4vKipcbiAqIEdldCB0aGUgbWluaW11bSBrZXlcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUuZ2V0TWluS2V5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5nZXRNaW5LZXlEZXNjZW5kYW50KCkua2V5O1xufTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYWxsIG5vZGVzIChpbmNsLiBsZWF2ZXMpIGZ1bGxmaWwgY29uZGl0aW9uIGdpdmVuIGJ5IGZuXG4gKiB0ZXN0IGlzIGEgZnVuY3Rpb24gcGFzc2VkIGV2ZXJ5IChrZXksIGRhdGEpIGFuZCB3aGljaCB0aHJvd3MgaWYgdGhlIGNvbmRpdGlvbiBpcyBub3QgbWV0XG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmNoZWNrQWxsTm9kZXNGdWxsZmlsbENvbmRpdGlvbiA9IGZ1bmN0aW9uICh0ZXN0KSB7XG4gIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eSgna2V5JykpIHsgcmV0dXJuOyB9XG5cbiAgdGVzdCh0aGlzLmtleSwgdGhpcy5kYXRhKTtcbiAgaWYgKHRoaXMubGVmdCkgeyB0aGlzLmxlZnQuY2hlY2tBbGxOb2Rlc0Z1bGxmaWxsQ29uZGl0aW9uKHRlc3QpOyB9XG4gIGlmICh0aGlzLnJpZ2h0KSB7IHRoaXMucmlnaHQuY2hlY2tBbGxOb2Rlc0Z1bGxmaWxsQ29uZGl0aW9uKHRlc3QpOyB9XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCB0aGUgY29yZSBCU1QgcHJvcGVydGllcyBvbiBub2RlIG9yZGVyaW5nIGFyZSB2ZXJpZmllZFxuICogVGhyb3cgaWYgdGhleSBhcmVuJ3RcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUuY2hlY2tOb2RlT3JkZXJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoJ2tleScpKSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLmxlZnQpIHtcbiAgICB0aGlzLmxlZnQuY2hlY2tBbGxOb2Rlc0Z1bGxmaWxsQ29uZGl0aW9uKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAoc2VsZi5jb21wYXJlS2V5cyhrLCBzZWxmLmtleSkgPj0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyZWUgd2l0aCByb290ICcgKyBzZWxmLmtleSArICcgaXMgbm90IGEgYmluYXJ5IHNlYXJjaCB0cmVlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5sZWZ0LmNoZWNrTm9kZU9yZGVyaW5nKCk7XG4gIH1cblxuICBpZiAodGhpcy5yaWdodCkge1xuICAgIHRoaXMucmlnaHQuY2hlY2tBbGxOb2Rlc0Z1bGxmaWxsQ29uZGl0aW9uKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAoc2VsZi5jb21wYXJlS2V5cyhrLCBzZWxmLmtleSkgPD0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyZWUgd2l0aCByb290ICcgKyBzZWxmLmtleSArICcgaXMgbm90IGEgYmluYXJ5IHNlYXJjaCB0cmVlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5yaWdodC5jaGVja05vZGVPcmRlcmluZygpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhbGwgcG9pbnRlcnMgYXJlIGNvaGVyZW50IGluIHRoaXMgdHJlZVxuICovXG5CaW5hcnlTZWFyY2hUcmVlLnByb3RvdHlwZS5jaGVja0ludGVybmFsUG9pbnRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmxlZnQpIHtcbiAgICBpZiAodGhpcy5sZWZ0LnBhcmVudCAhPT0gdGhpcykgeyB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBwb2ludGVyIGJyb2tlbiBmb3Iga2V5ICcgKyB0aGlzLmtleSk7IH1cbiAgICB0aGlzLmxlZnQuY2hlY2tJbnRlcm5hbFBvaW50ZXJzKCk7XG4gIH1cblxuICBpZiAodGhpcy5yaWdodCkge1xuICAgIGlmICh0aGlzLnJpZ2h0LnBhcmVudCAhPT0gdGhpcykgeyB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBwb2ludGVyIGJyb2tlbiBmb3Iga2V5ICcgKyB0aGlzLmtleSk7IH1cbiAgICB0aGlzLnJpZ2h0LmNoZWNrSW50ZXJuYWxQb2ludGVycygpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHRyZWUgaXMgYSBCU1QgYXMgZGVmaW5lZCBoZXJlIChub2RlIG9yZGVyaW5nIGFuZCBwb2ludGVyIHJlZmVyZW5jZXMpXG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmNoZWNrSXNCU1QgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY2hlY2tOb2RlT3JkZXJpbmcoKTtcbiAgdGhpcy5jaGVja0ludGVybmFsUG9pbnRlcnMoKTtcbiAgaWYgKHRoaXMucGFyZW50KSB7IHRocm93IG5ldyBFcnJvcihcIlRoZSByb290IHNob3VsZG4ndCBoYXZlIGEgcGFyZW50XCIpOyB9XG59O1xuXG5cbi8qKlxuICogR2V0IG51bWJlciBvZiBrZXlzIGluc2VydGVkXG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmdldE51bWJlck9mS2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlcztcblxuICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoJ2tleScpKSB7IHJldHVybiAwOyB9XG5cbiAgcmVzID0gMTtcbiAgaWYgKHRoaXMubGVmdCkgeyByZXMgKz0gdGhpcy5sZWZ0LmdldE51bWJlck9mS2V5cygpOyB9XG4gIGlmICh0aGlzLnJpZ2h0KSB7IHJlcyArPSB0aGlzLnJpZ2h0LmdldE51bWJlck9mS2V5cygpOyB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTWV0aG9kcyB1c2VkIHRvIGFjdHVhbGx5IHdvcmsgb24gdGhlIHRyZWVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQ3JlYXRlIGEgQlNUIHNpbWlsYXIgKGkuZS4gc2FtZSBvcHRpb25zIGV4Y2VwdCBmb3Iga2V5IGFuZCB2YWx1ZSkgdG8gdGhlIGN1cnJlbnQgb25lXG4gKiBVc2UgdGhlIHNhbWUgY29uc3RydWN0b3IgKGkuZS4gQmluYXJ5U2VhcmNoVHJlZSwgQVZMVHJlZSBldGMpXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBzZWUgY29uc3RydWN0b3JcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUuY3JlYXRlU2ltaWxhciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnVuaXF1ZSA9IHRoaXMudW5pcXVlO1xuICBvcHRpb25zLmNvbXBhcmVLZXlzID0gdGhpcy5jb21wYXJlS2V5cztcbiAgb3B0aW9ucy5jaGVja1ZhbHVlRXF1YWxpdHkgPSB0aGlzLmNoZWNrVmFsdWVFcXVhbGl0eTtcblxuICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3Iob3B0aW9ucyk7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsZWZ0IGNoaWxkIG9mIHRoaXMgQlNUIGFuZCByZXR1cm4gaXRcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUuY3JlYXRlTGVmdENoaWxkID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIGxlZnRDaGlsZCA9IHRoaXMuY3JlYXRlU2ltaWxhcihvcHRpb25zKTtcbiAgbGVmdENoaWxkLnBhcmVudCA9IHRoaXM7XG4gIHRoaXMubGVmdCA9IGxlZnRDaGlsZDtcblxuICByZXR1cm4gbGVmdENoaWxkO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZSB0aGUgcmlnaHQgY2hpbGQgb2YgdGhpcyBCU1QgYW5kIHJldHVybiBpdFxuICovXG5CaW5hcnlTZWFyY2hUcmVlLnByb3RvdHlwZS5jcmVhdGVSaWdodENoaWxkID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgdmFyIHJpZ2h0Q2hpbGQgPSB0aGlzLmNyZWF0ZVNpbWlsYXIob3B0aW9ucyk7XG4gIHJpZ2h0Q2hpbGQucGFyZW50ID0gdGhpcztcbiAgdGhpcy5yaWdodCA9IHJpZ2h0Q2hpbGQ7XG5cbiAgcmV0dXJuIHJpZ2h0Q2hpbGQ7XG59O1xuXG5cbi8qKlxuICogSW5zZXJ0IGEgbmV3IGVsZW1lbnRcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgLy8gRW1wdHkgdHJlZSwgaW5zZXJ0IGFzIHJvb3RcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkge1xuICAgIHRoaXMua2V5ID0ga2V5O1xuICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBTYW1lIGtleSBhcyByb290XG4gIGlmICh0aGlzLmNvbXBhcmVLZXlzKHRoaXMua2V5LCBrZXkpID09PSAwKSB7XG4gICAgaWYgKHRoaXMudW5pcXVlKSB7XG4gICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwiQ2FuJ3QgaW5zZXJ0IGtleSBcIiArIGtleSArIFwiLCBpdCB2aW9sYXRlcyB0aGUgdW5pcXVlIGNvbnN0cmFpbnRcIik7XG4gICAgICBlcnIua2V5ID0ga2V5O1xuICAgICAgZXJyLmVycm9yVHlwZSA9ICd1bmlxdWVWaW9sYXRlZCc7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHRoaXMuY29tcGFyZUtleXMoa2V5LCB0aGlzLmtleSkgPCAwKSB7XG4gICAgLy8gSW5zZXJ0IGluIGxlZnQgc3VidHJlZVxuICAgIGlmICh0aGlzLmxlZnQpIHtcbiAgICAgIHRoaXMubGVmdC5pbnNlcnQoa2V5LCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3JlYXRlTGVmdENoaWxkKHsga2V5OiBrZXksIHZhbHVlOiB2YWx1ZSB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSW5zZXJ0IGluIHJpZ2h0IHN1YnRyZWVcbiAgICBpZiAodGhpcy5yaWdodCkge1xuICAgICAgdGhpcy5yaWdodC5pbnNlcnQoa2V5LCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3JlYXRlUmlnaHRDaGlsZCh7IGtleToga2V5LCB2YWx1ZTogdmFsdWUgfSk7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogU2VhcmNoIGZvciBhbGwgZGF0YSBjb3JyZXNwb25kaW5nIHRvIGEga2V5XG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkgeyByZXR1cm4gW107IH1cblxuICBpZiAodGhpcy5jb21wYXJlS2V5cyh0aGlzLmtleSwga2V5KSA9PT0gMCkgeyByZXR1cm4gdGhpcy5kYXRhOyB9XG5cbiAgaWYgKHRoaXMuY29tcGFyZUtleXMoa2V5LCB0aGlzLmtleSkgPCAwKSB7XG4gICAgaWYgKHRoaXMubGVmdCkge1xuICAgICAgcmV0dXJuIHRoaXMubGVmdC5zZWFyY2goa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy5yaWdodCkge1xuICAgICAgcmV0dXJuIHRoaXMucmlnaHQuc2VhcmNoKGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHRlbGxzIHdoZXRoZXIgYSBnaXZlbiBrZXkgbWF0Y2hlcyBhIGxvd2VyIGJvdW5kXG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmdldExvd2VyQm91bmRNYXRjaGVyID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBObyBsb3dlciBib3VuZFxuICBpZiAoIXF1ZXJ5Lmhhc093blByb3BlcnR5KCckZ3QnKSAmJiAhcXVlcnkuaGFzT3duUHJvcGVydHkoJyRndGUnKSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9O1xuICB9XG5cbiAgaWYgKHF1ZXJ5Lmhhc093blByb3BlcnR5KCckZ3QnKSAmJiBxdWVyeS5oYXNPd25Qcm9wZXJ0eSgnJGd0ZScpKSB7XG4gICAgaWYgKHNlbGYuY29tcGFyZUtleXMocXVlcnkuJGd0ZSwgcXVlcnkuJGd0KSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHNlbGYuY29tcGFyZUtleXMoa2V5LCBxdWVyeS4kZ3QpID4gMDsgfTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5jb21wYXJlS2V5cyhxdWVyeS4kZ3RlLCBxdWVyeS4kZ3QpID4gMCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHNlbGYuY29tcGFyZUtleXMoa2V5LCBxdWVyeS4kZ3RlKSA+PSAwOyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gc2VsZi5jb21wYXJlS2V5cyhrZXksIHF1ZXJ5LiRndCkgPiAwOyB9O1xuICAgIH1cbiAgfVxuXG4gIGlmIChxdWVyeS5oYXNPd25Qcm9wZXJ0eSgnJGd0JykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gc2VsZi5jb21wYXJlS2V5cyhrZXksIHF1ZXJ5LiRndCkgPiAwOyB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBzZWxmLmNvbXBhcmVLZXlzKGtleSwgcXVlcnkuJGd0ZSkgPj0gMDsgfTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgdGVsbHMgd2hldGhlciBhIGdpdmVuIGtleSBtYXRjaGVzIGFuIHVwcGVyIGJvdW5kXG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmdldFVwcGVyQm91bmRNYXRjaGVyID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBObyBsb3dlciBib3VuZFxuICBpZiAoIXF1ZXJ5Lmhhc093blByb3BlcnR5KCckbHQnKSAmJiAhcXVlcnkuaGFzT3duUHJvcGVydHkoJyRsdGUnKSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9O1xuICB9XG5cbiAgaWYgKHF1ZXJ5Lmhhc093blByb3BlcnR5KCckbHQnKSAmJiBxdWVyeS5oYXNPd25Qcm9wZXJ0eSgnJGx0ZScpKSB7XG4gICAgaWYgKHNlbGYuY29tcGFyZUtleXMocXVlcnkuJGx0ZSwgcXVlcnkuJGx0KSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHNlbGYuY29tcGFyZUtleXMoa2V5LCBxdWVyeS4kbHQpIDwgMDsgfTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5jb21wYXJlS2V5cyhxdWVyeS4kbHRlLCBxdWVyeS4kbHQpIDwgMCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIHNlbGYuY29tcGFyZUtleXMoa2V5LCBxdWVyeS4kbHRlKSA8PSAwOyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gc2VsZi5jb21wYXJlS2V5cyhrZXksIHF1ZXJ5LiRsdCkgPCAwOyB9O1xuICAgIH1cbiAgfVxuXG4gIGlmIChxdWVyeS5oYXNPd25Qcm9wZXJ0eSgnJGx0JykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gc2VsZi5jb21wYXJlS2V5cyhrZXksIHF1ZXJ5LiRsdCkgPCAwOyB9O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBzZWxmLmNvbXBhcmVLZXlzKGtleSwgcXVlcnkuJGx0ZSkgPD0gMDsgfTtcbiAgfVxufTtcblxuXG4vLyBBcHBlbmQgYWxsIGVsZW1lbnRzIGluIHRvQXBwZW5kIHRvIGFycmF5XG5mdW5jdGlvbiBhcHBlbmQgKGFycmF5LCB0b0FwcGVuZCkge1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgdG9BcHBlbmQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBhcnJheS5wdXNoKHRvQXBwZW5kW2ldKTtcbiAgfVxufVxuXG5cbi8qKlxuICogR2V0IGFsbCBkYXRhIGZvciBhIGtleSBiZXR3ZWVuIGJvdW5kc1xuICogUmV0dXJuIGl0IGluIGtleSBvcmRlclxuICogQHBhcmFtIHtPYmplY3R9IHF1ZXJ5IE1vbmdvLXN0eWxlIHF1ZXJ5IHdoZXJlIGtleXMgYXJlICRsdCwgJGx0ZSwgJGd0IG9yICRndGUgKG90aGVyIGtleXMgYXJlIG5vdCBjb25zaWRlcmVkKVxuICogQHBhcmFtIHtGdW5jdGlvbnN9IGxibS91Ym0gbWF0Y2hpbmcgZnVuY3Rpb25zIGNhbGN1bGF0ZWQgYXQgdGhlIGZpcnN0IHJlY3Vyc2l2ZSBzdGVwXG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmJldHdlZW5Cb3VuZHMgPSBmdW5jdGlvbiAocXVlcnksIGxibSwgdWJtKSB7XG4gIHZhciByZXMgPSBbXTtcblxuICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoJ2tleScpKSB7IHJldHVybiBbXTsgfSAgIC8vIEVtcHR5IHRyZWVcblxuICBsYm0gPSBsYm0gfHwgdGhpcy5nZXRMb3dlckJvdW5kTWF0Y2hlcihxdWVyeSk7XG4gIHVibSA9IHVibSB8fCB0aGlzLmdldFVwcGVyQm91bmRNYXRjaGVyKHF1ZXJ5KTtcblxuICBpZiAobGJtKHRoaXMua2V5KSAmJiB0aGlzLmxlZnQpIHsgYXBwZW5kKHJlcywgdGhpcy5sZWZ0LmJldHdlZW5Cb3VuZHMocXVlcnksIGxibSwgdWJtKSk7IH1cbiAgaWYgKGxibSh0aGlzLmtleSkgJiYgdWJtKHRoaXMua2V5KSkgeyBhcHBlbmQocmVzLCB0aGlzLmRhdGEpOyB9XG4gIGlmICh1Ym0odGhpcy5rZXkpICYmIHRoaXMucmlnaHQpIHsgYXBwZW5kKHJlcywgdGhpcy5yaWdodC5iZXR3ZWVuQm91bmRzKHF1ZXJ5LCBsYm0sIHVibSkpOyB9XG5cbiAgcmV0dXJuIHJlcztcbn07XG5cblxuLyoqXG4gKiBEZWxldGUgdGhlIGN1cnJlbnQgbm9kZSBpZiBpdCBpcyBhIGxlYWZcbiAqIFJldHVybiB0cnVlIGlmIGl0IHdhcyBkZWxldGVkXG4gKi9cbkJpbmFyeVNlYXJjaFRyZWUucHJvdG90eXBlLmRlbGV0ZUlmTGVhZiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMubGVmdCB8fCB0aGlzLnJpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8vIFRoZSBsZWFmIGlzIGl0c2VsZiBhIHJvb3RcbiAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgIGRlbGV0ZSB0aGlzLmtleTtcbiAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0aGlzLnBhcmVudC5sZWZ0ID09PSB0aGlzKSB7XG4gICAgdGhpcy5wYXJlbnQubGVmdCA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wYXJlbnQucmlnaHQgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5cbi8qKlxuICogRGVsZXRlIHRoZSBjdXJyZW50IG5vZGUgaWYgaXQgaGFzIG9ubHkgb25lIGNoaWxkXG4gKiBSZXR1cm4gdHJ1ZSBpZiBpdCB3YXMgZGVsZXRlZFxuICovXG5CaW5hcnlTZWFyY2hUcmVlLnByb3RvdHlwZS5kZWxldGVJZk9ubHlPbmVDaGlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNoaWxkO1xuXG4gIGlmICh0aGlzLmxlZnQgJiYgIXRoaXMucmlnaHQpIHsgY2hpbGQgPSB0aGlzLmxlZnQ7IH1cbiAgaWYgKCF0aGlzLmxlZnQgJiYgdGhpcy5yaWdodCkgeyBjaGlsZCA9IHRoaXMucmlnaHQ7IH1cbiAgaWYgKCFjaGlsZCkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAvLyBSb290XG4gIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICB0aGlzLmtleSA9IGNoaWxkLmtleTtcbiAgICB0aGlzLmRhdGEgPSBjaGlsZC5kYXRhO1xuXG4gICAgdGhpcy5sZWZ0ID0gbnVsbDtcbiAgICBpZiAoY2hpbGQubGVmdCkge1xuICAgICAgdGhpcy5sZWZ0ID0gY2hpbGQubGVmdDtcbiAgICAgIGNoaWxkLmxlZnQucGFyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLnJpZ2h0ID0gbnVsbDtcbiAgICBpZiAoY2hpbGQucmlnaHQpIHtcbiAgICAgIHRoaXMucmlnaHQgPSBjaGlsZC5yaWdodDtcbiAgICAgIGNoaWxkLnJpZ2h0LnBhcmVudCA9IHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodGhpcy5wYXJlbnQubGVmdCA9PT0gdGhpcykge1xuICAgIHRoaXMucGFyZW50LmxlZnQgPSBjaGlsZDtcbiAgICBjaGlsZC5wYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBhcmVudC5yaWdodCA9IGNoaWxkO1xuICAgIGNoaWxkLnBhcmVudCA9IHRoaXMucGFyZW50O1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5cbi8qKlxuICogRGVsZXRlIGEga2V5IG9yIGp1c3QgYSB2YWx1ZVxuICogQHBhcmFtIHtLZXl9IGtleVxuICogQHBhcmFtIHtWYWx1ZX0gdmFsdWUgT3B0aW9uYWwuIElmIG5vdCBzZXQsIHRoZSB3aG9sZSBrZXkgaXMgZGVsZXRlZC4gSWYgc2V0LCBvbmx5IHRoaXMgdmFsdWUgaXMgZGVsZXRlZFxuICovXG5CaW5hcnlTZWFyY2hUcmVlLnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgbmV3RGF0YSA9IFtdLCByZXBsYWNlV2l0aFxuICAgICwgc2VsZiA9IHRoaXNcbiAgICA7XG5cbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdrZXknKSkgeyByZXR1cm47IH1cblxuICBpZiAodGhpcy5jb21wYXJlS2V5cyhrZXksIHRoaXMua2V5KSA8IDApIHtcbiAgICBpZiAodGhpcy5sZWZ0KSB7IHRoaXMubGVmdC5kZWxldGUoa2V5LCB2YWx1ZSk7IH1cbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodGhpcy5jb21wYXJlS2V5cyhrZXksIHRoaXMua2V5KSA+IDApIHtcbiAgICBpZiAodGhpcy5yaWdodCkgeyB0aGlzLnJpZ2h0LmRlbGV0ZShrZXksIHZhbHVlKTsgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghdGhpcy5jb21wYXJlS2V5cyhrZXksIHRoaXMua2V5KSA9PT0gMCkgeyByZXR1cm47IH1cblxuICAvLyBEZWxldGUgb25seSBhIHZhbHVlXG4gIGlmICh0aGlzLmRhdGEubGVuZ3RoID4gMSAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5kYXRhLmZvckVhY2goZnVuY3Rpb24gKGQpIHtcbiAgICAgIGlmICghc2VsZi5jaGVja1ZhbHVlRXF1YWxpdHkoZCwgdmFsdWUpKSB7IG5ld0RhdGEucHVzaChkKTsgfVxuICAgIH0pO1xuICAgIHNlbGYuZGF0YSA9IG5ld0RhdGE7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVsZXRlIHRoZSB3aG9sZSBub2RlXG4gIGlmICh0aGlzLmRlbGV0ZUlmTGVhZigpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICh0aGlzLmRlbGV0ZUlmT25seU9uZUNoaWxkKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBXZSBhcmUgaW4gdGhlIGNhc2Ugd2hlcmUgdGhlIG5vZGUgdG8gZGVsZXRlIGhhcyB0d28gY2hpbGRyZW5cbiAgaWYgKE1hdGgucmFuZG9tKCkgPj0gMC41KSB7ICAgLy8gUmFuZG9taXplIHJlcGxhY2VtZW50IHRvIGF2b2lkIHVuYmFsYW5jaW5nIHRoZSB0cmVlIHRvbyBtdWNoXG4gICAgLy8gVXNlIHRoZSBpbi1vcmRlciBwcmVkZWNlc3NvclxuICAgIHJlcGxhY2VXaXRoID0gdGhpcy5sZWZ0LmdldE1heEtleURlc2NlbmRhbnQoKTtcblxuICAgIHRoaXMua2V5ID0gcmVwbGFjZVdpdGgua2V5O1xuICAgIHRoaXMuZGF0YSA9IHJlcGxhY2VXaXRoLmRhdGE7XG5cbiAgICBpZiAodGhpcyA9PT0gcmVwbGFjZVdpdGgucGFyZW50KSB7ICAgLy8gU3BlY2lhbCBjYXNlXG4gICAgICB0aGlzLmxlZnQgPSByZXBsYWNlV2l0aC5sZWZ0O1xuICAgICAgaWYgKHJlcGxhY2VXaXRoLmxlZnQpIHsgcmVwbGFjZVdpdGgubGVmdC5wYXJlbnQgPSByZXBsYWNlV2l0aC5wYXJlbnQ7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbGFjZVdpdGgucGFyZW50LnJpZ2h0ID0gcmVwbGFjZVdpdGgubGVmdDtcbiAgICAgIGlmIChyZXBsYWNlV2l0aC5sZWZ0KSB7IHJlcGxhY2VXaXRoLmxlZnQucGFyZW50ID0gcmVwbGFjZVdpdGgucGFyZW50OyB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFVzZSB0aGUgaW4tb3JkZXIgc3VjY2Vzc29yXG4gICAgcmVwbGFjZVdpdGggPSB0aGlzLnJpZ2h0LmdldE1pbktleURlc2NlbmRhbnQoKTtcblxuICAgIHRoaXMua2V5ID0gcmVwbGFjZVdpdGgua2V5O1xuICAgIHRoaXMuZGF0YSA9IHJlcGxhY2VXaXRoLmRhdGE7XG5cbiAgICBpZiAodGhpcyA9PT0gcmVwbGFjZVdpdGgucGFyZW50KSB7ICAgLy8gU3BlY2lhbCBjYXNlXG4gICAgICB0aGlzLnJpZ2h0ID0gcmVwbGFjZVdpdGgucmlnaHQ7XG4gICAgICBpZiAocmVwbGFjZVdpdGgucmlnaHQpIHsgcmVwbGFjZVdpdGgucmlnaHQucGFyZW50ID0gcmVwbGFjZVdpdGgucGFyZW50OyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGxhY2VXaXRoLnBhcmVudC5sZWZ0ID0gcmVwbGFjZVdpdGgucmlnaHQ7XG4gICAgICBpZiAocmVwbGFjZVdpdGgucmlnaHQpIHsgcmVwbGFjZVdpdGgucmlnaHQucGFyZW50ID0gcmVwbGFjZVdpdGgucGFyZW50OyB9XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogRXhlY3V0ZSBhIGZ1bmN0aW9uIG9uIGV2ZXJ5IG5vZGUgb2YgdGhlIHRyZWUsIGluIGtleSBvcmRlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gU2lnbmF0dXJlOiBub2RlLiBNb3N0IHVzZWZ1bCB3aWxsIHByb2JhYmx5IGJlIG5vZGUua2V5IGFuZCBub2RlLmRhdGFcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUuZXhlY3V0ZU9uRXZlcnlOb2RlID0gZnVuY3Rpb24gKGZuKSB7XG4gIGlmICh0aGlzLmxlZnQpIHsgdGhpcy5sZWZ0LmV4ZWN1dGVPbkV2ZXJ5Tm9kZShmbik7IH1cbiAgZm4odGhpcyk7XG4gIGlmICh0aGlzLnJpZ2h0KSB7IHRoaXMucmlnaHQuZXhlY3V0ZU9uRXZlcnlOb2RlKGZuKTsgfVxufTtcblxuXG4vKipcbiAqIFByZXR0eSBwcmludCBhIHRyZWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcHJpbnREYXRhIFRvIHByaW50IHRoZSBub2RlcycgZGF0YSBhbG9uZyB3aXRoIHRoZSBrZXlcbiAqL1xuQmluYXJ5U2VhcmNoVHJlZS5wcm90b3R5cGUucHJldHR5UHJpbnQgPSBmdW5jdGlvbiAocHJpbnREYXRhLCBzcGFjaW5nKSB7XG4gIHNwYWNpbmcgPSBzcGFjaW5nIHx8IFwiXCI7XG5cbiAgY29uc29sZS5sb2coc3BhY2luZyArIFwiKiBcIiArIHRoaXMua2V5KTtcbiAgaWYgKHByaW50RGF0YSkgeyBjb25zb2xlLmxvZyhzcGFjaW5nICsgXCIqIFwiICsgdGhpcy5kYXRhKTsgfVxuXG4gIGlmICghdGhpcy5sZWZ0ICYmICF0aGlzLnJpZ2h0KSB7IHJldHVybjsgfVxuXG4gIGlmICh0aGlzLmxlZnQpIHtcbiAgICB0aGlzLmxlZnQucHJldHR5UHJpbnQocHJpbnREYXRhLCBzcGFjaW5nICsgXCIgIFwiKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhzcGFjaW5nICsgXCIgICpcIik7XG4gIH1cbiAgaWYgKHRoaXMucmlnaHQpIHtcbiAgICB0aGlzLnJpZ2h0LnByZXR0eVByaW50KHByaW50RGF0YSwgc3BhY2luZyArIFwiICBcIik7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coc3BhY2luZyArIFwiICAqXCIpO1xuICB9XG59O1xuXG5cblxuXG4vLyBJbnRlcmZhY2Vcbm1vZHVsZS5leHBvcnRzID0gQmluYXJ5U2VhcmNoVHJlZTtcbiIsIi8qKlxuICogUmV0dXJuIGFuIGFycmF5IHdpdGggdGhlIG51bWJlcnMgZnJvbSAwIHRvIG4tMSwgaW4gYSByYW5kb20gb3JkZXJcbiAqL1xuZnVuY3Rpb24gZ2V0UmFuZG9tQXJyYXkgKG4pIHtcbiAgdmFyIHJlcywgbmV4dDtcblxuICBpZiAobiA9PT0gMCkgeyByZXR1cm4gW107IH1cbiAgaWYgKG4gPT09IDEpIHsgcmV0dXJuIFswXTsgfVxuXG4gIHJlcyA9IGdldFJhbmRvbUFycmF5KG4gLSAxKTtcbiAgbmV4dCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG4pO1xuICByZXMuc3BsaWNlKG5leHQsIDAsIG4gLSAxKTsgICAvLyBBZGQgbi0xIGF0IGEgcmFuZG9tIHBvc2l0aW9uIGluIHRoZSBhcnJheVxuXG4gIHJldHVybiByZXM7XG59O1xubW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tQXJyYXkgPSBnZXRSYW5kb21BcnJheTtcblxuXG4vKlxuICogRGVmYXVsdCBjb21wYXJlS2V5cyBmdW5jdGlvbiB3aWxsIHdvcmsgZm9yIG51bWJlcnMsIHN0cmluZ3MgYW5kIGRhdGVzXG4gKi9cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlS2V5c0Z1bmN0aW9uIChhLCBiKSB7XG4gIGlmIChhIDwgYikgeyByZXR1cm4gLTE7IH1cbiAgaWYgKGEgPiBiKSB7IHJldHVybiAxOyB9XG4gIGlmIChhID09PSBiKSB7IHJldHVybiAwOyB9XG5cbiAgdmFyIGVyciA9IG5ldyBFcnJvcihcIkNvdWxkbid0IGNvbXBhcmUgZWxlbWVudHNcIik7XG4gIGVyci5hID0gYTtcbiAgZXJyLmIgPSBiO1xuICB0aHJvdyBlcnI7XG59XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0Q29tcGFyZUtleXNGdW5jdGlvbiA9IGRlZmF1bHRDb21wYXJlS2V5c0Z1bmN0aW9uO1xuXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0d28gdmFsdWVzIGFyZSBlcXVhbCAodXNlZCBpbiBub24tdW5pcXVlIGRlbGV0aW9uKVxuICovXG5mdW5jdGlvbiBkZWZhdWx0Q2hlY2tWYWx1ZUVxdWFsaXR5IChhLCBiKSB7XG4gIHJldHVybiBhID09PSBiO1xufVxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdENoZWNrVmFsdWVFcXVhbGl0eSA9IGRlZmF1bHRDaGVja1ZhbHVlRXF1YWxpdHk7XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjQuNFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjQuNCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfLmhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gbnVsbCA6IFtdO1xuICAgIHJldHVybiBfW2ZpcnN0ID8gJ2ZpbmQnIDogJ2ZpbHRlciddKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gdmFsdWVba2V5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy53aGVyZShvYmosIGF0dHJzLCB0cnVlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCBvciAoZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIC8vIENhbid0IG9wdGltaXplIGFycmF5cyBvZiBpbnRlZ2VycyBsb25nZXIgdGhhbiA2NSw1MzUgZWxlbWVudHMuXG4gIC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTgwNzk3XG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID49IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIEluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiBJbmZpbml0eSwgdmFsdWU6IEluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPCByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGFuIGFycmF5LlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbG9va3VwIGl0ZXJhdG9ycy5cbiAgdmFyIGxvb2t1cEl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlIDogZnVuY3Rpb24ob2JqKXsgcmV0dXJuIG9ialt2YWx1ZV07IH07XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdG9yLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlIDogdmFsdWUsXG4gICAgICAgIGluZGV4IDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhIDogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggPCByaWdodC5pbmRleCA/IC0xIDogMTtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0LCBiZWhhdmlvcikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSB8fCBfLmlkZW50aXR5KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICAgIChfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSA6IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSA9IDA7XG4gICAgICByZXN1bHRba2V5XSsrO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yID09IG51bGwgPyBfLmlkZW50aXR5IDogbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjb252ZXJ0IGFueXRoaW5nIGl0ZXJhYmxlIGludG8gYSByZWFsLCBsaXZlIGFycmF5LlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiAhPSBudWxsKSAmJiAhZ3VhcmQgPyBzbGljZS5jYWxsKGFycmF5LCAwLCBuKSA6IGFycmF5WzBdO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuICE9IG51bGwpICYmICFndWFyZCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb21wbGV0ZWx5IGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIGFuIGFycmF5LlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmdzLCAnbGVuZ3RoJykpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJncywgXCJcIiArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbikge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQgJiYgbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIGZ1bmNzID0gXy5mdW5jdGlvbnMob2JqKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHRpbWVvdXQsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHJlc3VsdDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZnVuY107XG4gICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICBpZiAodGltZXMgPD0gMCkgcmV0dXJuIGZ1bmMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzW2tleXMubGVuZ3RoXSA9IGtleTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHZhbHVlcy5wdXNoKG9ialtrZXldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcGFpcnMucHVzaChba2V5LCBvYmpba2V5XV0pO1xuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJlc3VsdFtvYmpba2V5XV0gPSBrZXk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBudWxsKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIEhhcm1vbnkgYGVnYWxgIHByb3Bvc2FsOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KG4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAnLyc6ICcmI3gyRjsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIHByb3BlcnR5IGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQ7XG4gIC8vIG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIvKipcbiAqIFRoaXMgaXMgdGhlIHdlYiBicm93c2VyIGltcGxlbWVudGF0aW9uIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcbmV4cG9ydHMuc3RvcmFnZSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWVcbiAgICAgICAgICAgICAgICYmICd1bmRlZmluZWQnICE9IHR5cGVvZiBjaHJvbWUuc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgPyBjaHJvbWUuc3RvcmFnZS5sb2NhbFxuICAgICAgICAgICAgICAgICAgOiBsb2NhbHN0b3JhZ2UoKTtcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbXG4gICcjMDAwMENDJywgJyMwMDAwRkYnLCAnIzAwMzNDQycsICcjMDAzM0ZGJywgJyMwMDY2Q0MnLCAnIzAwNjZGRicsICcjMDA5OUNDJyxcbiAgJyMwMDk5RkYnLCAnIzAwQ0MwMCcsICcjMDBDQzMzJywgJyMwMENDNjYnLCAnIzAwQ0M5OScsICcjMDBDQ0NDJywgJyMwMENDRkYnLFxuICAnIzMzMDBDQycsICcjMzMwMEZGJywgJyMzMzMzQ0MnLCAnIzMzMzNGRicsICcjMzM2NkNDJywgJyMzMzY2RkYnLCAnIzMzOTlDQycsXG4gICcjMzM5OUZGJywgJyMzM0NDMDAnLCAnIzMzQ0MzMycsICcjMzNDQzY2JywgJyMzM0NDOTknLCAnIzMzQ0NDQycsICcjMzNDQ0ZGJyxcbiAgJyM2NjAwQ0MnLCAnIzY2MDBGRicsICcjNjYzM0NDJywgJyM2NjMzRkYnLCAnIzY2Q0MwMCcsICcjNjZDQzMzJywgJyM5OTAwQ0MnLFxuICAnIzk5MDBGRicsICcjOTkzM0NDJywgJyM5OTMzRkYnLCAnIzk5Q0MwMCcsICcjOTlDQzMzJywgJyNDQzAwMDAnLCAnI0NDMDAzMycsXG4gICcjQ0MwMDY2JywgJyNDQzAwOTknLCAnI0NDMDBDQycsICcjQ0MwMEZGJywgJyNDQzMzMDAnLCAnI0NDMzMzMycsICcjQ0MzMzY2JyxcbiAgJyNDQzMzOTknLCAnI0NDMzNDQycsICcjQ0MzM0ZGJywgJyNDQzY2MDAnLCAnI0NDNjYzMycsICcjQ0M5OTAwJywgJyNDQzk5MzMnLFxuICAnI0NDQ0MwMCcsICcjQ0NDQzMzJywgJyNGRjAwMDAnLCAnI0ZGMDAzMycsICcjRkYwMDY2JywgJyNGRjAwOTknLCAnI0ZGMDBDQycsXG4gICcjRkYwMEZGJywgJyNGRjMzMDAnLCAnI0ZGMzMzMycsICcjRkYzMzY2JywgJyNGRjMzOTknLCAnI0ZGMzNDQycsICcjRkYzM0ZGJyxcbiAgJyNGRjY2MDAnLCAnI0ZGNjYzMycsICcjRkY5OTAwJywgJyNGRjk5MzMnLCAnI0ZGQ0MwMCcsICcjRkZDQzMzJ1xuXTtcblxuLyoqXG4gKiBDdXJyZW50bHkgb25seSBXZWJLaXQtYmFzZWQgV2ViIEluc3BlY3RvcnMsIEZpcmVmb3ggPj0gdjMxLFxuICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gKiB0byBzdXBwb3J0IFwiJWNcIiBDU1MgY3VzdG9taXphdGlvbnMuXG4gKlxuICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAqL1xuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG4gIC8vIE5COiBJbiBhbiBFbGVjdHJvbiBwcmVsb2FkIHNjcmlwdCwgZG9jdW1lbnQgd2lsbCBiZSBkZWZpbmVkIGJ1dCBub3QgZnVsbHlcbiAgLy8gaW5pdGlhbGl6ZWQuIFNpbmNlIHdlIGtub3cgd2UncmUgaW4gQ2hyb21lLCB3ZSdsbCBqdXN0IGRldGVjdCB0aGlzIGNhc2VcbiAgLy8gZXhwbGljaXRseVxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnByb2Nlc3MgJiYgd2luZG93LnByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSW50ZXJuZXQgRXhwbG9yZXIgYW5kIEVkZ2UgZG8gbm90IHN1cHBvcnQgY29sb3JzLlxuICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goLyhlZGdlfHRyaWRlbnQpXFwvKFxcZCspLykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcbiAgICAvLyBkb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG4gICAgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyLm1lc3NhZ2U7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0JylcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB2YXIgcjtcbiAgdHJ5IHtcbiAgICByID0gZXhwb3J0cy5zdG9yYWdlLmRlYnVnO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgLy8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuICBpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcbiAgICByID0gcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuIiwiXG4vKipcbiAqIFRoaXMgaXMgdGhlIGNvbW1vbiBsb2dpYyBmb3IgYm90aCB0aGUgTm9kZS5qcyBhbmQgd2ViIGJyb3dzZXJcbiAqIGltcGxlbWVudGF0aW9ucyBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZURlYnVnLmRlYnVnID0gY3JlYXRlRGVidWdbJ2RlZmF1bHQnXSA9IGNyZWF0ZURlYnVnO1xuZXhwb3J0cy5jb2VyY2UgPSBjb2VyY2U7XG5leHBvcnRzLmRpc2FibGUgPSBkaXNhYmxlO1xuZXhwb3J0cy5lbmFibGUgPSBlbmFibGU7XG5leHBvcnRzLmVuYWJsZWQgPSBlbmFibGVkO1xuZXhwb3J0cy5odW1hbml6ZSA9IHJlcXVpcmUoJ21zJyk7XG5cbi8qKlxuICogQWN0aXZlIGBkZWJ1Z2AgaW5zdGFuY2VzLlxuICovXG5leHBvcnRzLmluc3RhbmNlcyA9IFtdO1xuXG4vKipcbiAqIFRoZSBjdXJyZW50bHkgYWN0aXZlIGRlYnVnIG1vZGUgbmFtZXMsIGFuZCBuYW1lcyB0byBza2lwLlxuICovXG5cbmV4cG9ydHMubmFtZXMgPSBbXTtcbmV4cG9ydHMuc2tpcHMgPSBbXTtcblxuLyoqXG4gKiBNYXAgb2Ygc3BlY2lhbCBcIiVuXCIgaGFuZGxpbmcgZnVuY3Rpb25zLCBmb3IgdGhlIGRlYnVnIFwiZm9ybWF0XCIgYXJndW1lbnQuXG4gKlxuICogVmFsaWQga2V5IG5hbWVzIGFyZSBhIHNpbmdsZSwgbG93ZXIgb3IgdXBwZXItY2FzZSBsZXR0ZXIsIGkuZS4gXCJuXCIgYW5kIFwiTlwiLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycyA9IHt9O1xuXG4vKipcbiAqIFNlbGVjdCBhIGNvbG9yLlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VsZWN0Q29sb3IobmFtZXNwYWNlKSB7XG4gIHZhciBoYXNoID0gMCwgaTtcblxuICBmb3IgKGkgaW4gbmFtZXNwYWNlKSB7XG4gICAgaGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIG5hbWVzcGFjZS5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gIH1cblxuICByZXR1cm4gZXhwb3J0cy5jb2xvcnNbTWF0aC5hYnMoaGFzaCkgJSBleHBvcnRzLmNvbG9ycy5sZW5ndGhdO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIGRlYnVnZ2VyIHdpdGggdGhlIGdpdmVuIGBuYW1lc3BhY2VgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVEZWJ1ZyhuYW1lc3BhY2UpIHtcblxuICB2YXIgcHJldlRpbWU7XG5cbiAgZnVuY3Rpb24gZGVidWcoKSB7XG4gICAgLy8gZGlzYWJsZWQ/XG4gICAgaWYgKCFkZWJ1Zy5lbmFibGVkKSByZXR1cm47XG5cbiAgICB2YXIgc2VsZiA9IGRlYnVnO1xuXG4gICAgLy8gc2V0IGBkaWZmYCB0aW1lc3RhbXBcbiAgICB2YXIgY3VyciA9ICtuZXcgRGF0ZSgpO1xuICAgIHZhciBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG4gICAgc2VsZi5kaWZmID0gbXM7XG4gICAgc2VsZi5wcmV2ID0gcHJldlRpbWU7XG4gICAgc2VsZi5jdXJyID0gY3VycjtcbiAgICBwcmV2VGltZSA9IGN1cnI7XG5cbiAgICAvLyB0dXJuIHRoZSBgYXJndW1lbnRzYCBpbnRvIGEgcHJvcGVyIEFycmF5XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGFyZ3NbMF0gPSBleHBvcnRzLmNvZXJjZShhcmdzWzBdKTtcblxuICAgIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgIC8vIGFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVPXG4gICAgICBhcmdzLnVuc2hpZnQoJyVPJyk7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EtekEtWiVdKS9nLCBmdW5jdGlvbihtYXRjaCwgZm9ybWF0KSB7XG4gICAgICAvLyBpZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG4gICAgICBpZiAobWF0Y2ggPT09ICclJScpIHJldHVybiBtYXRjaDtcbiAgICAgIGluZGV4Kys7XG4gICAgICB2YXIgZm9ybWF0dGVyID0gZXhwb3J0cy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdHRlcikge1xuICAgICAgICB2YXIgdmFsID0gYXJnc1tpbmRleF07XG4gICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuICAgICAgICAvLyBub3cgd2UgbmVlZCB0byByZW1vdmUgYGFyZ3NbaW5kZXhdYCBzaW5jZSBpdCdzIGlubGluZWQgaW4gdGhlIGBmb3JtYXRgXG4gICAgICAgIGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaW5kZXgtLTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIC8vIGFwcGx5IGVudi1zcGVjaWZpYyBmb3JtYXR0aW5nIChjb2xvcnMsIGV0Yy4pXG4gICAgZXhwb3J0cy5mb3JtYXRBcmdzLmNhbGwoc2VsZiwgYXJncyk7XG5cbiAgICB2YXIgbG9nRm4gPSBkZWJ1Zy5sb2cgfHwgZXhwb3J0cy5sb2cgfHwgY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbiAgICBsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgfVxuXG4gIGRlYnVnLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgZGVidWcuZW5hYmxlZCA9IGV4cG9ydHMuZW5hYmxlZChuYW1lc3BhY2UpO1xuICBkZWJ1Zy51c2VDb2xvcnMgPSBleHBvcnRzLnVzZUNvbG9ycygpO1xuICBkZWJ1Zy5jb2xvciA9IHNlbGVjdENvbG9yKG5hbWVzcGFjZSk7XG4gIGRlYnVnLmRlc3Ryb3kgPSBkZXN0cm95O1xuXG4gIC8vIGVudi1zcGVjaWZpYyBpbml0aWFsaXphdGlvbiBsb2dpYyBmb3IgZGVidWcgaW5zdGFuY2VzXG4gIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZXhwb3J0cy5pbml0KSB7XG4gICAgZXhwb3J0cy5pbml0KGRlYnVnKTtcbiAgfVxuXG4gIGV4cG9ydHMuaW5zdGFuY2VzLnB1c2goZGVidWcpO1xuXG4gIHJldHVybiBkZWJ1Zztcbn1cblxuZnVuY3Rpb24gZGVzdHJveSAoKSB7XG4gIHZhciBpbmRleCA9IGV4cG9ydHMuaW5zdGFuY2VzLmluZGV4T2YodGhpcyk7XG4gIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICBleHBvcnRzLmluc3RhbmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG4vKipcbiAqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcbiAqIHNlcGFyYXRlZCBieSBhIGNvbG9uIGFuZCB3aWxkY2FyZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcbiAgZXhwb3J0cy5zYXZlKG5hbWVzcGFjZXMpO1xuXG4gIGV4cG9ydHMubmFtZXMgPSBbXTtcbiAgZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4gIHZhciBpO1xuICB2YXIgc3BsaXQgPSAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnID8gbmFtZXNwYWNlcyA6ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICghc3BsaXRbaV0pIGNvbnRpbnVlOyAvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuICAgIG5hbWVzcGFjZXMgPSBzcGxpdFtpXS5yZXBsYWNlKC9cXCovZywgJy4qPycpO1xuICAgIGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcbiAgICAgIGV4cG9ydHMuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc3Vic3RyKDEpICsgJyQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cG9ydHMubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMgKyAnJCcpKTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgZXhwb3J0cy5pbnN0YW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBleHBvcnRzLmluc3RhbmNlc1tpXTtcbiAgICBpbnN0YW5jZS5lbmFibGVkID0gZXhwb3J0cy5lbmFibGVkKGluc3RhbmNlLm5hbWVzcGFjZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gIGV4cG9ydHMuZW5hYmxlKCcnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuICBpZiAobmFtZVtuYW1lLmxlbmd0aCAtIDFdID09PSAnKicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB2YXIgaSwgbGVuO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMubmFtZXNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb2VyY2UgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuICByZXR1cm4gdmFsO1xufVxuIiwiLyoqXG4gKiBEZXRlY3QgRWxlY3Ryb24gcmVuZGVyZXIgcHJvY2Vzcywgd2hpY2ggaXMgbm9kZSwgYnV0IHdlIHNob3VsZFxuICogdHJlYXQgYXMgYSBicm93c2VyLlxuICovXG5cbmlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9icm93c2VyLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbm9kZS5qcycpO1xufVxuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciB0dHkgPSByZXF1aXJlKCd0dHknKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmluaXQgPSBpbml0O1xuZXhwb3J0cy5sb2cgPSBsb2c7XG5leHBvcnRzLmZvcm1hdEFyZ3MgPSBmb3JtYXRBcmdzO1xuZXhwb3J0cy5zYXZlID0gc2F2ZTtcbmV4cG9ydHMubG9hZCA9IGxvYWQ7XG5leHBvcnRzLnVzZUNvbG9ycyA9IHVzZUNvbG9ycztcblxuLyoqXG4gKiBDb2xvcnMuXG4gKi9cblxuZXhwb3J0cy5jb2xvcnMgPSBbIDYsIDIsIDMsIDQsIDUsIDEgXTtcblxudHJ5IHtcbiAgdmFyIHN1cHBvcnRzQ29sb3IgPSByZXF1aXJlKCdzdXBwb3J0cy1jb2xvcicpO1xuICBpZiAoc3VwcG9ydHNDb2xvciAmJiBzdXBwb3J0c0NvbG9yLmxldmVsID49IDIpIHtcbiAgICBleHBvcnRzLmNvbG9ycyA9IFtcbiAgICAgIDIwLCAyMSwgMjYsIDI3LCAzMiwgMzMsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNTYsIDU3LCA2MiwgNjMsIDY4LFxuICAgICAgNjksIDc0LCA3NSwgNzYsIDc3LCA3OCwgNzksIDgwLCA4MSwgOTIsIDkzLCA5OCwgOTksIDExMiwgMTEzLCAxMjgsIDEyOSwgMTM0LFxuICAgICAgMTM1LCAxNDgsIDE0OSwgMTYwLCAxNjEsIDE2MiwgMTYzLCAxNjQsIDE2NSwgMTY2LCAxNjcsIDE2OCwgMTY5LCAxNzAsIDE3MSxcbiAgICAgIDE3MiwgMTczLCAxNzgsIDE3OSwgMTg0LCAxODUsIDE5NiwgMTk3LCAxOTgsIDE5OSwgMjAwLCAyMDEsIDIwMiwgMjAzLCAyMDQsXG4gICAgICAyMDUsIDIwNiwgMjA3LCAyMDgsIDIwOSwgMjE0LCAyMTUsIDIyMCwgMjIxXG4gICAgXTtcbiAgfVxufSBjYXRjaCAoZXJyKSB7XG4gIC8vIHN3YWxsb3cgLSB3ZSBvbmx5IGNhcmUgaWYgYHN1cHBvcnRzLWNvbG9yYCBpcyBhdmFpbGFibGU7IGl0IGRvZXNuJ3QgaGF2ZSB0byBiZS5cbn1cblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgZGVmYXVsdCBgaW5zcGVjdE9wdHNgIG9iamVjdCBmcm9tIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gKlxuICogICAkIERFQlVHX0NPTE9SUz1ubyBERUJVR19ERVBUSD0xMCBERUJVR19TSE9XX0hJRERFTj1lbmFibGVkIG5vZGUgc2NyaXB0LmpzXG4gKi9cblxuZXhwb3J0cy5pbnNwZWN0T3B0cyA9IE9iamVjdC5rZXlzKHByb2Nlc3MuZW52KS5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gL15kZWJ1Z18vaS50ZXN0KGtleSk7XG59KS5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gIC8vIGNhbWVsLWNhc2VcbiAgdmFyIHByb3AgPSBrZXlcbiAgICAuc3Vic3RyaW5nKDYpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAucmVwbGFjZSgvXyhbYS16XSkvZywgZnVuY3Rpb24gKF8sIGspIHsgcmV0dXJuIGsudG9VcHBlckNhc2UoKSB9KTtcblxuICAvLyBjb2VyY2Ugc3RyaW5nIHZhbHVlIGludG8gSlMgdmFsdWVcbiAgdmFyIHZhbCA9IHByb2Nlc3MuZW52W2tleV07XG4gIGlmICgvXih5ZXN8b258dHJ1ZXxlbmFibGVkKSQvaS50ZXN0KHZhbCkpIHZhbCA9IHRydWU7XG4gIGVsc2UgaWYgKC9eKG5vfG9mZnxmYWxzZXxkaXNhYmxlZCkkL2kudGVzdCh2YWwpKSB2YWwgPSBmYWxzZTtcbiAgZWxzZSBpZiAodmFsID09PSAnbnVsbCcpIHZhbCA9IG51bGw7XG4gIGVsc2UgdmFsID0gTnVtYmVyKHZhbCk7XG5cbiAgb2JqW3Byb3BdID0gdmFsO1xuICByZXR1cm4gb2JqO1xufSwge30pO1xuXG4vKipcbiAqIElzIHN0ZG91dCBhIFRUWT8gQ29sb3JlZCBvdXRwdXQgaXMgZW5hYmxlZCB3aGVuIGB0cnVlYC5cbiAqL1xuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG4gIHJldHVybiAnY29sb3JzJyBpbiBleHBvcnRzLmluc3BlY3RPcHRzXG4gICAgPyBCb29sZWFuKGV4cG9ydHMuaW5zcGVjdE9wdHMuY29sb3JzKVxuICAgIDogdHR5LmlzYXR0eShwcm9jZXNzLnN0ZGVyci5mZCk7XG59XG5cbi8qKlxuICogTWFwICVvIHRvIGB1dGlsLmluc3BlY3QoKWAsIGFsbCBvbiBhIHNpbmdsZSBsaW5lLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycy5vID0gZnVuY3Rpb24odikge1xuICB0aGlzLmluc3BlY3RPcHRzLmNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuICByZXR1cm4gdXRpbC5pbnNwZWN0KHYsIHRoaXMuaW5zcGVjdE9wdHMpXG4gICAgLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gc3RyLnRyaW0oKVxuICAgIH0pLmpvaW4oJyAnKTtcbn07XG5cbi8qKlxuICogTWFwICVvIHRvIGB1dGlsLmluc3BlY3QoKWAsIGFsbG93aW5nIG11bHRpcGxlIGxpbmVzIGlmIG5lZWRlZC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuTyA9IGZ1bmN0aW9uKHYpIHtcbiAgdGhpcy5pbnNwZWN0T3B0cy5jb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcbiAgcmV0dXJuIHV0aWwuaW5zcGVjdCh2LCB0aGlzLmluc3BlY3RPcHRzKTtcbn07XG5cbi8qKlxuICogQWRkcyBBTlNJIGNvbG9yIGVzY2FwZSBjb2RlcyBpZiBlbmFibGVkLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QXJncyhhcmdzKSB7XG4gIHZhciBuYW1lID0gdGhpcy5uYW1lc3BhY2U7XG4gIHZhciB1c2VDb2xvcnMgPSB0aGlzLnVzZUNvbG9ycztcblxuICBpZiAodXNlQ29sb3JzKSB7XG4gICAgdmFyIGMgPSB0aGlzLmNvbG9yO1xuICAgIHZhciBjb2xvckNvZGUgPSAnXFx1MDAxYlszJyArIChjIDwgOCA/IGMgOiAnODs1OycgKyBjKTtcbiAgICB2YXIgcHJlZml4ID0gJyAgJyArIGNvbG9yQ29kZSArICc7MW0nICsgbmFtZSArICcgJyArICdcXHUwMDFiWzBtJztcblxuICAgIGFyZ3NbMF0gPSBwcmVmaXggKyBhcmdzWzBdLnNwbGl0KCdcXG4nKS5qb2luKCdcXG4nICsgcHJlZml4KTtcbiAgICBhcmdzLnB1c2goY29sb3JDb2RlICsgJ20rJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKSArICdcXHUwMDFiWzBtJyk7XG4gIH0gZWxzZSB7XG4gICAgYXJnc1swXSA9IGdldERhdGUoKSArIG5hbWUgKyAnICcgKyBhcmdzWzBdO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERhdGUoKSB7XG4gIGlmIChleHBvcnRzLmluc3BlY3RPcHRzLmhpZGVEYXRlKSB7XG4gICAgcmV0dXJuICcnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKyAnICc7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnZva2VzIGB1dGlsLmZvcm1hdCgpYCB3aXRoIHRoZSBzcGVjaWZpZWQgYXJndW1lbnRzIGFuZCB3cml0ZXMgdG8gc3RkZXJyLlxuICovXG5cbmZ1bmN0aW9uIGxvZygpIHtcbiAgcmV0dXJuIHByb2Nlc3Muc3RkZXJyLndyaXRlKHV0aWwuZm9ybWF0LmFwcGx5KHV0aWwsIGFyZ3VtZW50cykgKyAnXFxuJyk7XG59XG5cbi8qKlxuICogU2F2ZSBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNhdmUobmFtZXNwYWNlcykge1xuICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgLy8gSWYgeW91IHNldCBhIHByb2Nlc3MuZW52IGZpZWxkIHRvIG51bGwgb3IgdW5kZWZpbmVkLCBpdCBnZXRzIGNhc3QgdG8gdGhlXG4gICAgLy8gc3RyaW5nICdudWxsJyBvciAndW5kZWZpbmVkJy4gSnVzdCBkZWxldGUgaW5zdGVhZC5cbiAgICBkZWxldGUgcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH0gZWxzZSB7XG4gICAgcHJvY2Vzcy5lbnYuREVCVUcgPSBuYW1lc3BhY2VzO1xuICB9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgcmV0dXJuIHByb2Nlc3MuZW52LkRFQlVHO1xufVxuXG4vKipcbiAqIEluaXQgbG9naWMgZm9yIGBkZWJ1Z2AgaW5zdGFuY2VzLlxuICpcbiAqIENyZWF0ZSBhIG5ldyBgaW5zcGVjdE9wdHNgIG9iamVjdCBpbiBjYXNlIGB1c2VDb2xvcnNgIGlzIHNldFxuICogZGlmZmVyZW50bHkgZm9yIGEgcGFydGljdWxhciBgZGVidWdgIGluc3RhbmNlLlxuICovXG5cbmZ1bmN0aW9uIGluaXQgKGRlYnVnKSB7XG4gIGRlYnVnLmluc3BlY3RPcHRzID0ge307XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhleHBvcnRzLmluc3BlY3RPcHRzKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgZGVidWcuaW5zcGVjdE9wdHNba2V5c1tpXV0gPSBleHBvcnRzLmluc3BlY3RPcHRzW2tleXNbaV1dO1xuICB9XG59XG5cbi8qKlxuICogRW5hYmxlIG5hbWVzcGFjZXMgbGlzdGVkIGluIGBwcm9jZXNzLmVudi5ERUJVR2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmdzLCBvcHRzKSB7XG4gICAgaWYgKCFvcHRzKSBvcHRzID0ge307XG4gICAgXG4gICAgdmFyIGZsYWdzID0geyBib29scyA6IHt9LCBzdHJpbmdzIDoge30sIHVua25vd25GbjogbnVsbCB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRzWyd1bmtub3duJ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZmxhZ3MudW5rbm93bkZuID0gb3B0c1sndW5rbm93biddO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0c1snYm9vbGVhbiddID09PSAnYm9vbGVhbicgJiYgb3B0c1snYm9vbGVhbiddKSB7XG4gICAgICBmbGFncy5hbGxCb29scyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIFtdLmNvbmNhdChvcHRzWydib29sZWFuJ10pLmZpbHRlcihCb29sZWFuKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICBmbGFncy5ib29sc1trZXldID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB2YXIgYWxpYXNlcyA9IHt9O1xuICAgIE9iamVjdC5rZXlzKG9wdHMuYWxpYXMgfHwge30pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBhbGlhc2VzW2tleV0gPSBbXS5jb25jYXQob3B0cy5hbGlhc1trZXldKTtcbiAgICAgICAgYWxpYXNlc1trZXldLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIGFsaWFzZXNbeF0gPSBba2V5XS5jb25jYXQoYWxpYXNlc1trZXldLmZpbHRlcihmdW5jdGlvbiAoeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4ICE9PSB5O1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIFtdLmNvbmNhdChvcHRzLnN0cmluZykuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBmbGFncy5zdHJpbmdzW2tleV0gPSB0cnVlO1xuICAgICAgICBpZiAoYWxpYXNlc1trZXldKSB7XG4gICAgICAgICAgICBmbGFncy5zdHJpbmdzW2FsaWFzZXNba2V5XV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgIH0pO1xuXG4gICAgdmFyIGRlZmF1bHRzID0gb3B0c1snZGVmYXVsdCddIHx8IHt9O1xuICAgIFxuICAgIHZhciBhcmd2ID0geyBfIDogW10gfTtcbiAgICBPYmplY3Qua2V5cyhmbGFncy5ib29scykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHNldEFyZyhrZXksIGRlZmF1bHRzW2tleV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogZGVmYXVsdHNba2V5XSk7XG4gICAgfSk7XG4gICAgXG4gICAgdmFyIG5vdEZsYWdzID0gW107XG5cbiAgICBpZiAoYXJncy5pbmRleE9mKCctLScpICE9PSAtMSkge1xuICAgICAgICBub3RGbGFncyA9IGFyZ3Muc2xpY2UoYXJncy5pbmRleE9mKCctLScpKzEpO1xuICAgICAgICBhcmdzID0gYXJncy5zbGljZSgwLCBhcmdzLmluZGV4T2YoJy0tJykpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFyZ0RlZmluZWQoa2V5LCBhcmcpIHtcbiAgICAgICAgcmV0dXJuIChmbGFncy5hbGxCb29scyAmJiAvXi0tW149XSskLy50ZXN0KGFyZykpIHx8XG4gICAgICAgICAgICBmbGFncy5zdHJpbmdzW2tleV0gfHwgZmxhZ3MuYm9vbHNba2V5XSB8fCBhbGlhc2VzW2tleV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0QXJnIChrZXksIHZhbCwgYXJnKSB7XG4gICAgICAgIGlmIChhcmcgJiYgZmxhZ3MudW5rbm93bkZuICYmICFhcmdEZWZpbmVkKGtleSwgYXJnKSkge1xuICAgICAgICAgICAgaWYgKGZsYWdzLnVua25vd25GbihhcmcpID09PSBmYWxzZSkgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlID0gIWZsYWdzLnN0cmluZ3Nba2V5XSAmJiBpc051bWJlcih2YWwpXG4gICAgICAgICAgICA/IE51bWJlcih2YWwpIDogdmFsXG4gICAgICAgIDtcbiAgICAgICAgc2V0S2V5KGFyZ3YsIGtleS5zcGxpdCgnLicpLCB2YWx1ZSk7XG4gICAgICAgIFxuICAgICAgICAoYWxpYXNlc1trZXldIHx8IFtdKS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICBzZXRLZXkoYXJndiwgeC5zcGxpdCgnLicpLCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldEtleSAob2JqLCBrZXlzLCB2YWx1ZSkge1xuICAgICAgICB2YXIgbyA9IG9iajtcbiAgICAgICAga2V5cy5zbGljZSgwLC0xKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChvW2tleV0gPT09IHVuZGVmaW5lZCkgb1trZXldID0ge307XG4gICAgICAgICAgICBvID0gb1trZXldO1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIga2V5ID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAob1trZXldID09PSB1bmRlZmluZWQgfHwgZmxhZ3MuYm9vbHNba2V5XSB8fCB0eXBlb2Ygb1trZXldID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIG9ba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob1trZXldKSkge1xuICAgICAgICAgICAgb1trZXldLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb1trZXldID0gWyBvW2tleV0sIHZhbHVlIF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gYWxpYXNJc0Jvb2xlYW4oa2V5KSB7XG4gICAgICByZXR1cm4gYWxpYXNlc1trZXldLnNvbWUoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICByZXR1cm4gZmxhZ3MuYm9vbHNbeF07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFyZyA9IGFyZ3NbaV07XG4gICAgICAgIFxuICAgICAgICBpZiAoL14tLS4rPS8udGVzdChhcmcpKSB7XG4gICAgICAgICAgICAvLyBVc2luZyBbXFxzXFxTXSBpbnN0ZWFkIG9mIC4gYmVjYXVzZSBqcyBkb2Vzbid0IHN1cHBvcnQgdGhlXG4gICAgICAgICAgICAvLyAnZG90YWxsJyByZWdleCBtb2RpZmllci4gU2VlOlxuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA2ODMwOC8xMzIxNlxuICAgICAgICAgICAgdmFyIG0gPSBhcmcubWF0Y2goL14tLShbXj1dKyk9KFtcXHNcXFNdKikkLyk7XG4gICAgICAgICAgICB2YXIga2V5ID0gbVsxXTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG1bMl07XG4gICAgICAgICAgICBpZiAoZmxhZ3MuYm9vbHNba2V5XSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgIT09ICdmYWxzZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRBcmcoa2V5LCB2YWx1ZSwgYXJnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvXi0tbm8tLisvLnRlc3QoYXJnKSkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGFyZy5tYXRjaCgvXi0tbm8tKC4rKS8pWzFdO1xuICAgICAgICAgICAgc2V0QXJnKGtleSwgZmFsc2UsIGFyZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL14tLS4rLy50ZXN0KGFyZykpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBhcmcubWF0Y2goL14tLSguKykvKVsxXTtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gYXJnc1tpICsgMV07XG4gICAgICAgICAgICBpZiAobmV4dCAhPT0gdW5kZWZpbmVkICYmICEvXi0vLnRlc3QobmV4dClcbiAgICAgICAgICAgICYmICFmbGFncy5ib29sc1trZXldXG4gICAgICAgICAgICAmJiAhZmxhZ3MuYWxsQm9vbHNcbiAgICAgICAgICAgICYmIChhbGlhc2VzW2tleV0gPyAhYWxpYXNJc0Jvb2xlYW4oa2V5KSA6IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgc2V0QXJnKGtleSwgbmV4dCwgYXJnKTtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgvXih0cnVlfGZhbHNlKSQvLnRlc3QobmV4dCkpIHtcbiAgICAgICAgICAgICAgICBzZXRBcmcoa2V5LCBuZXh0ID09PSAndHJ1ZScsIGFyZyk7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0QXJnKGtleSwgZmxhZ3Muc3RyaW5nc1trZXldID8gJycgOiB0cnVlLCBhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKC9eLVteLV0rLy50ZXN0KGFyZykpIHtcbiAgICAgICAgICAgIHZhciBsZXR0ZXJzID0gYXJnLnNsaWNlKDEsLTEpLnNwbGl0KCcnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGJyb2tlbiA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsZXR0ZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSBhcmcuc2xpY2UoaisyKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEFyZyhsZXR0ZXJzW2pdLCBuZXh0LCBhcmcpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoL1tBLVphLXpdLy50ZXN0KGxldHRlcnNbal0pICYmIC89Ly50ZXN0KG5leHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEFyZyhsZXR0ZXJzW2pdLCBuZXh0LnNwbGl0KCc9JylbMV0sIGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIGJyb2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoL1tBLVphLXpdLy50ZXN0KGxldHRlcnNbal0pXG4gICAgICAgICAgICAgICAgJiYgLy0/XFxkKyhcXC5cXGQqKT8oZS0/XFxkKyk/JC8udGVzdChuZXh0KSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRBcmcobGV0dGVyc1tqXSwgbmV4dCwgYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJva2VuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChsZXR0ZXJzW2orMV0gJiYgbGV0dGVyc1tqKzFdLm1hdGNoKC9cXFcvKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRBcmcobGV0dGVyc1tqXSwgYXJnLnNsaWNlKGorMiksIGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIGJyb2tlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QXJnKGxldHRlcnNbal0sIGZsYWdzLnN0cmluZ3NbbGV0dGVyc1tqXV0gPyAnJyA6IHRydWUsIGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIga2V5ID0gYXJnLnNsaWNlKC0xKVswXTtcbiAgICAgICAgICAgIGlmICghYnJva2VuICYmIGtleSAhPT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3NbaSsxXSAmJiAhL14oLXwtLSlbXi1dLy50ZXN0KGFyZ3NbaSsxXSlcbiAgICAgICAgICAgICAgICAmJiAhZmxhZ3MuYm9vbHNba2V5XVxuICAgICAgICAgICAgICAgICYmIChhbGlhc2VzW2tleV0gPyAhYWxpYXNJc0Jvb2xlYW4oa2V5KSA6IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldEFyZyhrZXksIGFyZ3NbaSsxXSwgYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChhcmdzW2krMV0gJiYgL3RydWV8ZmFsc2UvLnRlc3QoYXJnc1tpKzFdKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRBcmcoa2V5LCBhcmdzW2krMV0gPT09ICd0cnVlJywgYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QXJnKGtleSwgZmxhZ3Muc3RyaW5nc1trZXldID8gJycgOiB0cnVlLCBhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghZmxhZ3MudW5rbm93bkZuIHx8IGZsYWdzLnVua25vd25GbihhcmcpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGFyZ3YuXy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBmbGFncy5zdHJpbmdzWydfJ10gfHwgIWlzTnVtYmVyKGFyZykgPyBhcmcgOiBOdW1iZXIoYXJnKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5zdG9wRWFybHkpIHtcbiAgICAgICAgICAgICAgICBhcmd2Ll8ucHVzaC5hcHBseShhcmd2Ll8sIGFyZ3Muc2xpY2UoaSArIDEpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBPYmplY3Qua2V5cyhkZWZhdWx0cykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICghaGFzS2V5KGFyZ3YsIGtleS5zcGxpdCgnLicpKSkge1xuICAgICAgICAgICAgc2V0S2V5KGFyZ3YsIGtleS5zcGxpdCgnLicpLCBkZWZhdWx0c1trZXldKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgKGFsaWFzZXNba2V5XSB8fCBbXSkuZm9yRWFjaChmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgIHNldEtleShhcmd2LCB4LnNwbGl0KCcuJyksIGRlZmF1bHRzW2tleV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICBpZiAob3B0c1snLS0nXSkge1xuICAgICAgICBhcmd2WyctLSddID0gbmV3IEFycmF5KCk7XG4gICAgICAgIG5vdEZsYWdzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBhcmd2WyctLSddLnB1c2goa2V5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3RGbGFncy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgYXJndi5fLnB1c2goa2V5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3Y7XG59O1xuXG5mdW5jdGlvbiBoYXNLZXkgKG9iaiwga2V5cykge1xuICAgIHZhciBvID0gb2JqO1xuICAgIGtleXMuc2xpY2UoMCwtMSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIG8gPSAob1trZXldIHx8IHt9KTtcbiAgICB9KTtcblxuICAgIHZhciBrZXkgPSBrZXlzW2tleXMubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIGtleSBpbiBvO1xufVxuXG5mdW5jdGlvbiBpc051bWJlciAoeCkge1xuICAgIGlmICh0eXBlb2YgeCA9PT0gJ251bWJlcicpIHJldHVybiB0cnVlO1xuICAgIGlmICgvXjB4WzAtOWEtZl0rJC9pLnRlc3QoeCkpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiAvXlstK10/KD86XFxkKyg/OlxcLlxcZCopP3xcXC5cXGQrKShlWy0rXT9cXGQrKT8kLy50ZXN0KHgpO1xufVxuXG4iLCJ2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgXzA3NzcgPSBwYXJzZUludCgnMDc3NycsIDgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1rZGlyUC5ta2RpcnAgPSBta2RpclAubWtkaXJQID0gbWtkaXJQO1xuXG5mdW5jdGlvbiBta2RpclAgKHAsIG9wdHMsIGYsIG1hZGUpIHtcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZiA9IG9wdHM7XG4gICAgICAgIG9wdHMgPSB7fTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIW9wdHMgfHwgdHlwZW9mIG9wdHMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIG9wdHMgPSB7IG1vZGU6IG9wdHMgfTtcbiAgICB9XG4gICAgXG4gICAgdmFyIG1vZGUgPSBvcHRzLm1vZGU7XG4gICAgdmFyIHhmcyA9IG9wdHMuZnMgfHwgZnM7XG4gICAgXG4gICAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtb2RlID0gXzA3NzcgJiAofnByb2Nlc3MudW1hc2soKSk7XG4gICAgfVxuICAgIGlmICghbWFkZSkgbWFkZSA9IG51bGw7XG4gICAgXG4gICAgdmFyIGNiID0gZiB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xuICAgIFxuICAgIHhmcy5ta2RpcihwLCBtb2RlLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgICAgaWYgKCFlcikge1xuICAgICAgICAgICAgbWFkZSA9IG1hZGUgfHwgcDtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBtYWRlKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGVyLmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0VOT0VOVCc6XG4gICAgICAgICAgICAgICAgbWtkaXJQKHBhdGguZGlybmFtZShwKSwgb3B0cywgZnVuY3Rpb24gKGVyLCBtYWRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcikgY2IoZXIsIG1hZGUpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIG1rZGlyUChwLCBvcHRzLCBjYiwgbWFkZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIGFueSBvdGhlciBlcnJvciwganVzdCBzZWUgaWYgdGhlcmUncyBhIGRpclxuICAgICAgICAgICAgLy8gdGhlcmUgYWxyZWFkeS4gIElmIHNvLCB0aGVuIGhvb3JheSEgIElmIG5vdCwgdGhlbiBzb21ldGhpbmdcbiAgICAgICAgICAgIC8vIGlzIGJvcmtlZC5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgeGZzLnN0YXQocCwgZnVuY3Rpb24gKGVyMiwgc3RhdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgc3RhdCBmYWlscywgdGhlbiB0aGF0J3Mgc3VwZXIgd2VpcmQuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCB0aGUgb3JpZ2luYWwgZXJyb3IgYmUgdGhlIGZhaWx1cmUgcmVhc29uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZXIyIHx8ICFzdGF0LmlzRGlyZWN0b3J5KCkpIGNiKGVyLCBtYWRlKVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGNiKG51bGwsIG1hZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1rZGlyUC5zeW5jID0gZnVuY3Rpb24gc3luYyAocCwgb3B0cywgbWFkZSkge1xuICAgIGlmICghb3B0cyB8fCB0eXBlb2Ygb3B0cyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgb3B0cyA9IHsgbW9kZTogb3B0cyB9O1xuICAgIH1cbiAgICBcbiAgICB2YXIgbW9kZSA9IG9wdHMubW9kZTtcbiAgICB2YXIgeGZzID0gb3B0cy5mcyB8fCBmcztcbiAgICBcbiAgICBpZiAobW9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZGUgPSBfMDc3NyAmICh+cHJvY2Vzcy51bWFzaygpKTtcbiAgICB9XG4gICAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbDtcblxuICAgIHAgPSBwYXRoLnJlc29sdmUocCk7XG5cbiAgICB0cnkge1xuICAgICAgICB4ZnMubWtkaXJTeW5jKHAsIG1vZGUpO1xuICAgICAgICBtYWRlID0gbWFkZSB8fCBwO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyMCkge1xuICAgICAgICBzd2l0Y2ggKGVycjAuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnRU5PRU5UJyA6XG4gICAgICAgICAgICAgICAgbWFkZSA9IHN5bmMocGF0aC5kaXJuYW1lKHApLCBvcHRzLCBtYWRlKTtcbiAgICAgICAgICAgICAgICBzeW5jKHAsIG9wdHMsIG1hZGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcbiAgICAgICAgICAgIC8vIHRoZXJlIGFscmVhZHkuICBJZiBzbywgdGhlbiBob29yYXkhICBJZiBub3QsIHRoZW4gc29tZXRoaW5nXG4gICAgICAgICAgICAvLyBpcyBib3JrZWQuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHZhciBzdGF0O1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXQgPSB4ZnMuc3RhdFN5bmMocCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc3RhdC5pc0RpcmVjdG9yeSgpKSB0aHJvdyBlcnIwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hZGU7XG59O1xuIiwiLyoqXG4gKiBIZWxwZXJzLlxuICovXG5cbnZhciBzID0gMTAwMDtcbnZhciBtID0gcyAqIDYwO1xudmFyIGggPSBtICogNjA7XG52YXIgZCA9IGggKiAyNDtcbnZhciB5ID0gZCAqIDM2NS4yNTtcblxuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEB0aHJvd3Mge0Vycm9yfSB0aHJvdyBhbiBlcnJvciBpZiB2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbDtcbiAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHBhcnNlKHZhbCk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNOYU4odmFsKSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5sb25nID8gZm10TG9uZyh2YWwpIDogZm10U2hvcnQodmFsKTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgJ3ZhbCBpcyBub3QgYSBub24tZW1wdHkgc3RyaW5nIG9yIGEgdmFsaWQgbnVtYmVyLiB2YWw9JyArXG4gICAgICBKU09OLnN0cmluZ2lmeSh2YWwpXG4gICk7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgc3RyID0gU3RyaW5nKHN0cik7XG4gIGlmIChzdHIubGVuZ3RoID4gMTAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBtYXRjaCA9IC9eKCg/OlxcZCspP1xcLj9cXGQrKSAqKG1pbGxpc2Vjb25kcz98bXNlY3M/fG1zfHNlY29uZHM/fHNlY3M/fHN8bWludXRlcz98bWlucz98bXxob3Vycz98aHJzP3xofGRheXM/fGR8eWVhcnM/fHlycz98eSk/JC9pLmV4ZWMoXG4gICAgc3RyXG4gICk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG4gPSBwYXJzZUZsb2F0KG1hdGNoWzFdKTtcbiAgdmFyIHR5cGUgPSAobWF0Y2hbMl0gfHwgJ21zJykudG9Mb3dlckNhc2UoKTtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgIGNhc2UgJ3llYXInOlxuICAgIGNhc2UgJ3lycyc6XG4gICAgY2FzZSAneXInOlxuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIG4gKiB5O1xuICAgIGNhc2UgJ2RheXMnOlxuICAgIGNhc2UgJ2RheSc6XG4gICAgY2FzZSAnZCc6XG4gICAgICByZXR1cm4gbiAqIGQ7XG4gICAgY2FzZSAnaG91cnMnOlxuICAgIGNhc2UgJ2hvdXInOlxuICAgIGNhc2UgJ2hycyc6XG4gICAgY2FzZSAnaHInOlxuICAgIGNhc2UgJ2gnOlxuICAgICAgcmV0dXJuIG4gKiBoO1xuICAgIGNhc2UgJ21pbnV0ZXMnOlxuICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgY2FzZSAnbWlucyc6XG4gICAgY2FzZSAnbWluJzpcbiAgICBjYXNlICdtJzpcbiAgICAgIHJldHVybiBuICogbTtcbiAgICBjYXNlICdzZWNvbmRzJzpcbiAgICBjYXNlICdzZWNvbmQnOlxuICAgIGNhc2UgJ3NlY3MnOlxuICAgIGNhc2UgJ3NlYyc6XG4gICAgY2FzZSAncyc6XG4gICAgICByZXR1cm4gbiAqIHM7XG4gICAgY2FzZSAnbWlsbGlzZWNvbmRzJzpcbiAgICBjYXNlICdtaWxsaXNlY29uZCc6XG4gICAgY2FzZSAnbXNlY3MnOlxuICAgIGNhc2UgJ21zZWMnOlxuICAgIGNhc2UgJ21zJzpcbiAgICAgIHJldHVybiBuO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogU2hvcnQgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10U2hvcnQobXMpIHtcbiAgaWYgKG1zID49IGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICB9XG4gIGlmIChtcyA+PSBoKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgfVxuICBpZiAobXMgPj0gbSkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIH1cbiAgaWYgKG1zID49IHMpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICB9XG4gIHJldHVybiBtcyArICdtcyc7XG59XG5cbi8qKlxuICogTG9uZyBmb3JtYXQgZm9yIGBtc2AuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBmbXRMb25nKG1zKSB7XG4gIHJldHVybiBwbHVyYWwobXMsIGQsICdkYXknKSB8fFxuICAgIHBsdXJhbChtcywgaCwgJ2hvdXInKSB8fFxuICAgIHBsdXJhbChtcywgbSwgJ21pbnV0ZScpIHx8XG4gICAgcGx1cmFsKG1zLCBzLCAnc2Vjb25kJykgfHxcbiAgICBtcyArICcgbXMnO1xufVxuXG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovXG5cbmZ1bmN0aW9uIHBsdXJhbChtcywgbiwgbmFtZSkge1xuICBpZiAobXMgPCBuKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChtcyA8IG4gKiAxLjUpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihtcyAvIG4pICsgJyAnICsgbmFtZTtcbiAgfVxuICByZXR1cm4gTWF0aC5jZWlsKG1zIC8gbikgKyAnICcgKyBuYW1lICsgJ3MnO1xufVxuIiwidmFyIERhdGFzdG9yZSA9IHJlcXVpcmUoJy4vbGliL2RhdGFzdG9yZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFzdG9yZTtcbiIsIi8qKlxuICogTWFuYWdlIGFjY2VzcyB0byBkYXRhLCBiZSBpdCB0byBmaW5kLCB1cGRhdGUgb3IgcmVtb3ZlIGl0XG4gKi9cbnZhciBtb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKVxuICAsIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJylcbiAgO1xuXG5cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgY3Vyc29yIGZvciB0aGlzIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7RGF0YXN0b3JlfSBkYiAtIFRoZSBkYXRhc3RvcmUgdGhpcyBjdXJzb3IgaXMgYm91bmQgdG9cbiAqIEBwYXJhbSB7UXVlcnl9IHF1ZXJ5IC0gVGhlIHF1ZXJ5IHRoaXMgY3Vyc29yIHdpbGwgb3BlcmF0ZSBvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXhlY0ZuIC0gSGFuZGxlciB0byBiZSBleGVjdXRlZCBhZnRlciBjdXJzb3IgaGFzIGZvdW5kIHRoZSByZXN1bHRzIGFuZCBiZWZvcmUgdGhlIGNhbGxiYWNrIHBhc3NlZCB0byBmaW5kL2ZpbmRPbmUvdXBkYXRlL3JlbW92ZVxuICovXG5mdW5jdGlvbiBDdXJzb3IgKGRiLCBxdWVyeSwgZXhlY0ZuKSB7XG4gIHRoaXMuZGIgPSBkYjtcbiAgdGhpcy5xdWVyeSA9IHF1ZXJ5IHx8IHt9O1xuICBpZiAoZXhlY0ZuKSB7IHRoaXMuZXhlY0ZuID0gZXhlY0ZuOyB9XG59XG5cblxuLyoqXG4gKiBTZXQgYSBsaW1pdCB0byB0aGUgbnVtYmVyIG9mIHJlc3VsdHNcbiAqL1xuQ3Vyc29yLnByb3RvdHlwZS5saW1pdCA9IGZ1bmN0aW9uKGxpbWl0KSB7XG4gIHRoaXMuX2xpbWl0ID0gbGltaXQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFNraXAgYSB0aGUgbnVtYmVyIG9mIHJlc3VsdHNcbiAqL1xuQ3Vyc29yLnByb3RvdHlwZS5za2lwID0gZnVuY3Rpb24oc2tpcCkge1xuICB0aGlzLl9za2lwID0gc2tpcDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogU29ydCByZXN1bHRzIG9mIHRoZSBxdWVyeVxuICogQHBhcmFtIHtTb3J0UXVlcnl9IHNvcnRRdWVyeSAtIFNvcnRRdWVyeSBpcyB7IGZpZWxkOiBvcmRlciB9LCBmaWVsZCBjYW4gdXNlIHRoZSBkb3Qtbm90YXRpb24sIG9yZGVyIGlzIDEgZm9yIGFzY2VuZGluZyBhbmQgLTEgZm9yIGRlc2NlbmRpbmdcbiAqL1xuQ3Vyc29yLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oc29ydFF1ZXJ5KSB7XG4gIHRoaXMuX3NvcnQgPSBzb3J0UXVlcnk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEFkZCB0aGUgdXNlIG9mIGEgcHJvamVjdGlvblxuICogQHBhcmFtIHtPYmplY3R9IHByb2plY3Rpb24gLSBNb25nb0RCLXN0eWxlIHByb2plY3Rpb24uIHt9IG1lYW5zIHRha2UgYWxsIGZpZWxkcy4gVGhlbiBpdCdzIHsga2V5MTogMSwga2V5MjogMSB9IHRvIHRha2Ugb25seSBrZXkxIGFuZCBrZXkyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsga2V5MTogMCwga2V5MjogMCB9IHRvIG9taXQgb25seSBrZXkxIGFuZCBrZXkyLiBFeGNlcHQgX2lkLCB5b3UgY2FuJ3QgbWl4IHRha2VzIGFuZCBvbWl0c1xuICovXG5DdXJzb3IucHJvdG90eXBlLnByb2plY3Rpb24gPSBmdW5jdGlvbihwcm9qZWN0aW9uKSB7XG4gIHRoaXMuX3Byb2plY3Rpb24gPSBwcm9qZWN0aW9uO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBBcHBseSB0aGUgcHJvamVjdGlvblxuICovXG5DdXJzb3IucHJvdG90eXBlLnByb2plY3QgPSBmdW5jdGlvbiAoY2FuZGlkYXRlcykge1xuICB2YXIgcmVzID0gW10sIHNlbGYgPSB0aGlzXG4gICAgLCBrZWVwSWQsIGFjdGlvbiwga2V5c1xuICAgIDtcblxuICBpZiAodGhpcy5fcHJvamVjdGlvbiA9PT0gdW5kZWZpbmVkIHx8IE9iamVjdC5rZXlzKHRoaXMuX3Byb2plY3Rpb24pLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBjYW5kaWRhdGVzO1xuICB9XG5cbiAga2VlcElkID0gdGhpcy5fcHJvamVjdGlvbi5faWQgPT09IDAgPyBmYWxzZSA6IHRydWU7XG4gIHRoaXMuX3Byb2plY3Rpb24gPSBfLm9taXQodGhpcy5fcHJvamVjdGlvbiwgJ19pZCcpO1xuXG4gIC8vIENoZWNrIGZvciBjb25zaXN0ZW5jeVxuICBrZXlzID0gT2JqZWN0LmtleXModGhpcy5fcHJvamVjdGlvbik7XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIGlmIChhY3Rpb24gIT09IHVuZGVmaW5lZCAmJiBzZWxmLl9wcm9qZWN0aW9uW2tdICE9PSBhY3Rpb24pIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgYm90aCBrZWVwIGFuZCBvbWl0IGZpZWxkcyBleGNlcHQgZm9yIF9pZFwiKTsgfVxuICAgIGFjdGlvbiA9IHNlbGYuX3Byb2plY3Rpb25ba107XG4gIH0pO1xuXG4gIC8vIERvIHRoZSBhY3R1YWwgcHJvamVjdGlvblxuICBjYW5kaWRhdGVzLmZvckVhY2goZnVuY3Rpb24gKGNhbmRpZGF0ZSkge1xuICAgIHZhciB0b1B1c2g7XG4gICAgaWYgKGFjdGlvbiA9PT0gMSkgeyAgIC8vIHBpY2stdHlwZSBwcm9qZWN0aW9uXG4gICAgICB0b1B1c2ggPSB7ICRzZXQ6IHt9IH07XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdG9QdXNoLiRzZXRba10gPSBtb2RlbC5nZXREb3RWYWx1ZShjYW5kaWRhdGUsIGspO1xuICAgICAgICBpZiAodG9QdXNoLiRzZXRba10gPT09IHVuZGVmaW5lZCkgeyBkZWxldGUgdG9QdXNoLiRzZXRba107IH1cbiAgICAgIH0pO1xuICAgICAgdG9QdXNoID0gbW9kZWwubW9kaWZ5KHt9LCB0b1B1c2gpO1xuICAgIH0gZWxzZSB7ICAgLy8gb21pdC10eXBlIHByb2plY3Rpb25cbiAgICAgIHRvUHVzaCA9IHsgJHVuc2V0OiB7fSB9O1xuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IHRvUHVzaC4kdW5zZXRba10gPSB0cnVlIH0pO1xuICAgICAgdG9QdXNoID0gbW9kZWwubW9kaWZ5KGNhbmRpZGF0ZSwgdG9QdXNoKTtcbiAgICB9XG4gICAgaWYgKGtlZXBJZCkge1xuICAgICAgdG9QdXNoLl9pZCA9IGNhbmRpZGF0ZS5faWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB0b1B1c2guX2lkO1xuICAgIH1cbiAgICByZXMucHVzaCh0b1B1c2gpO1xuICB9KTtcblxuICByZXR1cm4gcmVzO1xufTtcblxuXG4vKipcbiAqIEdldCBhbGwgbWF0Y2hpbmcgZWxlbWVudHNcbiAqIFdpbGwgcmV0dXJuIHBvaW50ZXJzIHRvIG1hdGNoZWQgZWxlbWVudHMgKHNoYWxsb3cgY29waWVzKSwgcmV0dXJuaW5nIGZ1bGwgY29waWVzIGlzIHRoZSByb2xlIG9mIGZpbmQgb3IgZmluZE9uZVxuICogVGhpcyBpcyBhbiBpbnRlcm5hbCBmdW5jdGlvbiwgdXNlIGV4ZWMgd2hpY2ggdXNlcyB0aGUgZXhlY3V0b3JcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFNpZ25hdHVyZTogZXJyLCByZXN1bHRzXG4gKi9cbkN1cnNvci5wcm90b3R5cGUuX2V4ZWMgPSBmdW5jdGlvbihfY2FsbGJhY2spIHtcbiAgdmFyIHJlcyA9IFtdLCBhZGRlZCA9IDAsIHNraXBwZWQgPSAwLCBzZWxmID0gdGhpc1xuICAgICwgZXJyb3IgPSBudWxsXG4gICAgLCBpLCBrZXlzLCBrZXlcbiAgICA7XG5cbiAgZnVuY3Rpb24gY2FsbGJhY2sgKGVycm9yLCByZXMpIHtcbiAgICBpZiAoc2VsZi5leGVjRm4pIHtcbiAgICAgIHJldHVybiBzZWxmLmV4ZWNGbihlcnJvciwgcmVzLCBfY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX2NhbGxiYWNrKGVycm9yLCByZXMpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuZGIuZ2V0Q2FuZGlkYXRlcyh0aGlzLnF1ZXJ5LCBmdW5jdGlvbiAoZXJyLCBjYW5kaWRhdGVzKSB7XG4gICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjYW5kaWRhdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChtb2RlbC5tYXRjaChjYW5kaWRhdGVzW2ldLCBzZWxmLnF1ZXJ5KSkge1xuICAgICAgICAgIC8vIElmIGEgc29ydCBpcyBkZWZpbmVkLCB3YWl0IGZvciB0aGUgcmVzdWx0cyB0byBiZSBzb3J0ZWQgYmVmb3JlIGFwcGx5aW5nIGxpbWl0IGFuZCBza2lwXG4gICAgICAgICAgaWYgKCFzZWxmLl9zb3J0KSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5fc2tpcCAmJiBzZWxmLl9za2lwID4gc2tpcHBlZCkge1xuICAgICAgICAgICAgICBza2lwcGVkICs9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXMucHVzaChjYW5kaWRhdGVzW2ldKTtcbiAgICAgICAgICAgICAgYWRkZWQgKz0gMTtcbiAgICAgICAgICAgICAgaWYgKHNlbGYuX2xpbWl0ICYmIHNlbGYuX2xpbWl0IDw9IGFkZGVkKSB7IGJyZWFrOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGNhbmRpZGF0ZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgYWxsIHNvcnRzXG4gICAgaWYgKHNlbGYuX3NvcnQpIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhzZWxmLl9zb3J0KTtcblxuICAgICAgLy8gU29ydGluZ1xuICAgICAgdmFyIGNyaXRlcmlhID0gW107XG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBjcml0ZXJpYS5wdXNoKHsga2V5OiBrZXksIGRpcmVjdGlvbjogc2VsZi5fc29ydFtrZXldIH0pO1xuICAgICAgfVxuICAgICAgcmVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICB2YXIgY3JpdGVyaW9uLCBjb21wYXJlLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY3JpdGVyaWEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjcml0ZXJpb24gPSBjcml0ZXJpYVtpXTtcbiAgICAgICAgICBjb21wYXJlID0gY3JpdGVyaW9uLmRpcmVjdGlvbiAqIG1vZGVsLmNvbXBhcmVUaGluZ3MobW9kZWwuZ2V0RG90VmFsdWUoYSwgY3JpdGVyaW9uLmtleSksIG1vZGVsLmdldERvdFZhbHVlKGIsIGNyaXRlcmlvbi5rZXkpLCBzZWxmLmRiLmNvbXBhcmVTdHJpbmdzKTtcbiAgICAgICAgICBpZiAoY29tcGFyZSAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXBhcmU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEFwcGx5aW5nIGxpbWl0IGFuZCBza2lwXG4gICAgICB2YXIgbGltaXQgPSBzZWxmLl9saW1pdCB8fCByZXMubGVuZ3RoXG4gICAgICAgICwgc2tpcCA9IHNlbGYuX3NraXAgfHwgMDtcblxuICAgICAgcmVzID0gcmVzLnNsaWNlKHNraXAsIHNraXAgKyBsaW1pdCk7XG4gICAgfVxuXG4gICAgLy8gQXBwbHkgcHJvamVjdGlvblxuICAgIHRyeSB7XG4gICAgICByZXMgPSBzZWxmLnByb2plY3QocmVzKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvciA9IGU7XG4gICAgICByZXMgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yLCByZXMpO1xuICB9KTtcbn07XG5cbkN1cnNvci5wcm90b3R5cGUuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5kYi5leGVjdXRvci5wdXNoKHsgdGhpczogdGhpcywgZm46IHRoaXMuX2V4ZWMsIGFyZ3VtZW50czogYXJndW1lbnRzIH0pO1xufTtcblxuXG5cbi8vIEludGVyZmFjZVxubW9kdWxlLmV4cG9ydHMgPSBDdXJzb3I7XG4iLCJ2YXIgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbiAgO1xuXG4vKipcbiAqIFJldHVybiBhIHJhbmRvbSBhbHBoYW51bWVyaWNhbCBzdHJpbmcgb2YgbGVuZ3RoIGxlblxuICogVGhlcmUgaXMgYSB2ZXJ5IHNtYWxsIHByb2JhYmlsaXR5IChsZXNzIHRoYW4gMS8xLDAwMCwwMDApIGZvciB0aGUgbGVuZ3RoIHRvIGJlIGxlc3MgdGhhbiBsZW5cbiAqIChpbCB0aGUgYmFzZTY0IGNvbnZlcnNpb24geWllbGRzIHRvbyBtYW55IHBsdXNlcyBhbmQgc2xhc2hlcykgYnV0XG4gKiB0aGF0J3Mgbm90IGFuIGlzc3VlIGhlcmVcbiAqIFRoZSBwcm9iYWJpbGl0eSBvZiBhIGNvbGxpc2lvbiBpcyBleHRyZW1lbHkgc21hbGwgKG5lZWQgMyoxMF4xMiBkb2N1bWVudHMgdG8gaGF2ZSBvbmUgY2hhbmNlIGluIGEgbWlsbGlvbiBvZiBhIGNvbGxpc2lvbilcbiAqIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0JpcnRoZGF5X3Byb2JsZW1cbiAqL1xuZnVuY3Rpb24gdWlkIChsZW4pIHtcbiAgcmV0dXJuIGNyeXB0by5yYW5kb21CeXRlcyhNYXRoLmNlaWwoTWF0aC5tYXgoOCwgbGVuICogMikpKVxuICAgIC50b1N0cmluZygnYmFzZTY0JylcbiAgICAucmVwbGFjZSgvWytcXC9dL2csICcnKVxuICAgIC5zbGljZSgwLCBsZW4pO1xufVxuXG5cbi8vIEludGVyZmFjZVxubW9kdWxlLmV4cG9ydHMudWlkID0gdWlkO1xuXG4iLCJ2YXIgY3VzdG9tVXRpbHMgPSByZXF1aXJlKCcuL2N1c3RvbVV0aWxzJylcbiAgLCBtb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKVxuICAsIGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKVxuICAsIEV4ZWN1dG9yID0gcmVxdWlyZSgnLi9leGVjdXRvcicpXG4gICwgSW5kZXggPSByZXF1aXJlKCcuL2luZGV4ZXMnKVxuICAsIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbiAgLCBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpXG4gICwgUGVyc2lzdGVuY2UgPSByZXF1aXJlKCcuL3BlcnNpc3RlbmNlJylcbiAgLCBDdXJzb3IgPSByZXF1aXJlKCcuL2N1cnNvcicpXG4gIDtcblxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5maWxlbmFtZSBPcHRpb25hbCwgZGF0YXN0b3JlIHdpbGwgYmUgaW4tbWVtb3J5IG9ubHkgaWYgbm90IHByb3ZpZGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMudGltZXN0YW1wRGF0YSBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2UuIElmIHNldCB0byB0cnVlLCBjcmVhdGVkQXQgYW5kIHVwZGF0ZWRBdCB3aWxsIGJlIGNyZWF0ZWQgYW5kIHBvcHVsYXRlZCBhdXRvbWF0aWNhbGx5IChpZiBub3Qgc3BlY2lmaWVkIGJ5IHVzZXIpXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuaW5NZW1vcnlPbmx5IE9wdGlvbmFsLCBkZWZhdWx0cyB0byBmYWxzZVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubm9kZVdlYmtpdEFwcE5hbWUgT3B0aW9uYWwsIHNwZWNpZnkgdGhlIG5hbWUgb2YgeW91ciBOVyBhcHAgaWYgeW91IHdhbnQgb3B0aW9ucy5maWxlbmFtZSB0byBiZSByZWxhdGl2ZSB0byB0aGUgZGlyZWN0b3J5IHdoZXJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm9kZSBXZWJraXQgc3RvcmVzIGFwcGxpY2F0aW9uIGRhdGEgc3VjaCBhcyBjb29raWVzIGFuZCBsb2NhbCBzdG9yYWdlICh0aGUgYmVzdCBwbGFjZSB0byBzdG9yZSBkYXRhIGluIG15IG9waW5pb24pXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMuYXV0b2xvYWQgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHRpb25zLm9ubG9hZCBPcHRpb25hbCwgaWYgYXV0b2xvYWQgaXMgdXNlZCB0aGlzIHdpbGwgYmUgY2FsbGVkIGFmdGVyIHRoZSBsb2FkIGRhdGFiYXNlIHdpdGggdGhlIGVycm9yIG9iamVjdCBhcyBwYXJhbWV0ZXIuIElmIHlvdSBkb24ndCBwYXNzIGl0IHRoZSBlcnJvciB3aWxsIGJlIHRocm93blxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0aW9ucy5hZnRlclNlcmlhbGl6YXRpb24vb3B0aW9ucy5iZWZvcmVEZXNlcmlhbGl6YXRpb24gT3B0aW9uYWwsIHNlcmlhbGl6YXRpb24gaG9va3NcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLmNvcnJ1cHRBbGVydFRocmVzaG9sZCBPcHRpb25hbCwgdGhyZXNob2xkIGFmdGVyIHdoaWNoIGFuIGFsZXJ0IGlzIHRocm93biBpZiB0b28gbXVjaCBkYXRhIGlzIGNvcnJ1cHRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdGlvbnMuY29tcGFyZVN0cmluZ3MgT3B0aW9uYWwsIHN0cmluZyBjb21wYXJpc29uIGZ1bmN0aW9uIHRoYXQgb3ZlcnJpZGVzIGRlZmF1bHQgZm9yIHNvcnRpbmdcbiAqXG4gKiBFdmVudCBFbWl0dGVyIC0gRXZlbnRzXG4gKiAqIGNvbXBhY3Rpb24uZG9uZSAtIEZpcmVkIHdoZW5ldmVyIGEgY29tcGFjdGlvbiBvcGVyYXRpb24gd2FzIGZpbmlzaGVkXG4gKi9cbmZ1bmN0aW9uIERhdGFzdG9yZSAob3B0aW9ucykge1xuICB2YXIgZmlsZW5hbWU7XG5cbiAgLy8gUmV0cm9jb21wYXRpYmlsaXR5IHdpdGggdjAuNiBhbmQgYmVmb3JlXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBmaWxlbmFtZSA9IG9wdGlvbnM7XG4gICAgdGhpcy5pbk1lbW9yeU9ubHkgPSBmYWxzZTsgICAvLyBEZWZhdWx0XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgZmlsZW5hbWUgPSBvcHRpb25zLmZpbGVuYW1lO1xuICAgIHRoaXMuaW5NZW1vcnlPbmx5ID0gb3B0aW9ucy5pbk1lbW9yeU9ubHkgfHwgZmFsc2U7XG4gICAgdGhpcy5hdXRvbG9hZCA9IG9wdGlvbnMuYXV0b2xvYWQgfHwgZmFsc2U7XG4gICAgdGhpcy50aW1lc3RhbXBEYXRhID0gb3B0aW9ucy50aW1lc3RhbXBEYXRhIHx8IGZhbHNlO1xuICB9XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgaW4gbWVtb3J5IG9yIHBlcnNpc3RlbnRcbiAgaWYgKCFmaWxlbmFtZSB8fCB0eXBlb2YgZmlsZW5hbWUgIT09ICdzdHJpbmcnIHx8IGZpbGVuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuZmlsZW5hbWUgPSBudWxsO1xuICAgIHRoaXMuaW5NZW1vcnlPbmx5ID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmZpbGVuYW1lID0gZmlsZW5hbWU7XG4gIH1cblxuICAvLyBTdHJpbmcgY29tcGFyaXNvbiBmdW5jdGlvblxuICB0aGlzLmNvbXBhcmVTdHJpbmdzID0gb3B0aW9ucy5jb21wYXJlU3RyaW5ncztcblxuICAvLyBQZXJzaXN0ZW5jZSBoYW5kbGluZ1xuICB0aGlzLnBlcnNpc3RlbmNlID0gbmV3IFBlcnNpc3RlbmNlKHsgZGI6IHRoaXMsIG5vZGVXZWJraXRBcHBOYW1lOiBvcHRpb25zLm5vZGVXZWJraXRBcHBOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICwgYWZ0ZXJTZXJpYWxpemF0aW9uOiBvcHRpb25zLmFmdGVyU2VyaWFsaXphdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsIGJlZm9yZURlc2VyaWFsaXphdGlvbjogb3B0aW9ucy5iZWZvcmVEZXNlcmlhbGl6YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLCBjb3JydXB0QWxlcnRUaHJlc2hvbGQ6IG9wdGlvbnMuY29ycnVwdEFsZXJ0VGhyZXNob2xkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gIC8vIFRoaXMgbmV3IGV4ZWN1dG9yIGlzIHJlYWR5IGlmIHdlIGRvbid0IHVzZSBwZXJzaXN0ZW5jZVxuICAvLyBJZiB3ZSBkbywgaXQgd2lsbCBvbmx5IGJlIHJlYWR5IG9uY2UgbG9hZERhdGFiYXNlIGlzIGNhbGxlZFxuICB0aGlzLmV4ZWN1dG9yID0gbmV3IEV4ZWN1dG9yKCk7XG4gIGlmICh0aGlzLmluTWVtb3J5T25seSkgeyB0aGlzLmV4ZWN1dG9yLnJlYWR5ID0gdHJ1ZTsgfVxuXG4gIC8vIEluZGV4ZWQgYnkgZmllbGQgbmFtZSwgZG90IG5vdGF0aW9uIGNhbiBiZSB1c2VkXG4gIC8vIF9pZCBpcyBhbHdheXMgaW5kZXhlZCBhbmQgc2luY2UgX2lkcyBhcmUgZ2VuZXJhdGVkIHJhbmRvbWx5IHRoZSB1bmRlcmx5aW5nXG4gIC8vIGJpbmFyeSBpcyBhbHdheXMgd2VsbC1iYWxhbmNlZFxuICB0aGlzLmluZGV4ZXMgPSB7fTtcbiAgdGhpcy5pbmRleGVzLl9pZCA9IG5ldyBJbmRleCh7IGZpZWxkTmFtZTogJ19pZCcsIHVuaXF1ZTogdHJ1ZSB9KTtcbiAgdGhpcy50dGxJbmRleGVzID0ge307XG5cbiAgLy8gUXVldWUgYSBsb2FkIG9mIHRoZSBkYXRhYmFzZSByaWdodCBhd2F5IGFuZCBjYWxsIHRoZSBvbmxvYWQgaGFuZGxlclxuICAvLyBCeSBkZWZhdWx0IChubyBvbmxvYWQgaGFuZGxlciksIGlmIHRoZXJlIGlzIGFuIGVycm9yIHRoZXJlLCBubyBvcGVyYXRpb24gd2lsbCBiZSBwb3NzaWJsZSBzbyB3YXJuIHRoZSB1c2VyIGJ5IHRocm93aW5nIGFuIGV4Y2VwdGlvblxuICBpZiAodGhpcy5hdXRvbG9hZCkgeyB0aGlzLmxvYWREYXRhYmFzZShvcHRpb25zLm9ubG9hZCB8fCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVycikgeyB0aHJvdyBlcnI7IH1cbiAgfSk7IH1cbn1cblxudXRpbC5pbmhlcml0cyhEYXRhc3RvcmUsIHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcik7XG5cblxuLyoqXG4gKiBMb2FkIHRoZSBkYXRhYmFzZSBmcm9tIHRoZSBkYXRhZmlsZSwgYW5kIHRyaWdnZXIgdGhlIGV4ZWN1dGlvbiBvZiBidWZmZXJlZCBjb21tYW5kcyBpZiBhbnlcbiAqL1xuRGF0YXN0b3JlLnByb3RvdHlwZS5sb2FkRGF0YWJhc2UgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXhlY3V0b3IucHVzaCh7IHRoaXM6IHRoaXMucGVyc2lzdGVuY2UsIGZuOiB0aGlzLnBlcnNpc3RlbmNlLmxvYWREYXRhYmFzZSwgYXJndW1lbnRzOiBhcmd1bWVudHMgfSwgdHJ1ZSk7XG59O1xuXG5cbi8qKlxuICogR2V0IGFuIGFycmF5IG9mIGFsbCB0aGUgZGF0YSBpbiB0aGUgZGF0YWJhc2VcbiAqL1xuRGF0YXN0b3JlLnByb3RvdHlwZS5nZXRBbGxEYXRhID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5pbmRleGVzLl9pZC5nZXRBbGwoKTtcbn07XG5cblxuLyoqXG4gKiBSZXNldCBhbGwgY3VycmVudGx5IGRlZmluZWQgaW5kZXhlc1xuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLnJlc2V0SW5kZXhlcyA9IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBPYmplY3Qua2V5cyh0aGlzLmluZGV4ZXMpLmZvckVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICBzZWxmLmluZGV4ZXNbaV0ucmVzZXQobmV3RGF0YSk7XG4gIH0pO1xufTtcblxuXG4vKipcbiAqIEVuc3VyZSBhbiBpbmRleCBpcyBrZXB0IGZvciB0aGlzIGZpZWxkLiBTYW1lIHBhcmFtZXRlcnMgYXMgbGliL2luZGV4ZXNcbiAqIEZvciBub3cgdGhpcyBmdW5jdGlvbiBpcyBzeW5jaHJvbm91cywgd2UgbmVlZCB0byB0ZXN0IGhvdyBtdWNoIHRpbWUgaXQgdGFrZXNcbiAqIFdlIHVzZSBhbiBhc3luYyBBUEkgZm9yIGNvbnNpc3RlbmN5IHdpdGggdGhlIHJlc3Qgb2YgdGhlIGNvZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmZpZWxkTmFtZVxuICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnVuaXF1ZVxuICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnNwYXJzZVxuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMuZXhwaXJlQWZ0ZXJTZWNvbmRzIC0gT3B0aW9uYWwsIGlmIHNldCB0aGlzIGluZGV4IGJlY29tZXMgYSBUVEwgaW5kZXggKG9ubHkgd29ya3Mgb24gRGF0ZSBmaWVsZHMsIG5vdCBhcnJheXMgb2YgRGF0ZSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IGVyclxuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLmVuc3VyZUluZGV4ID0gZnVuY3Rpb24gKG9wdGlvbnMsIGNiKSB7XG4gIHZhciBlcnJcbiAgICAsIGNhbGxiYWNrID0gY2IgfHwgZnVuY3Rpb24gKCkge307XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKCFvcHRpb25zLmZpZWxkTmFtZSkge1xuICAgIGVyciA9IG5ldyBFcnJvcihcIkNhbm5vdCBjcmVhdGUgYW4gaW5kZXggd2l0aG91dCBhIGZpZWxkTmFtZVwiKTtcbiAgICBlcnIubWlzc2luZ0ZpZWxkTmFtZSA9IHRydWU7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gIH1cbiAgaWYgKHRoaXMuaW5kZXhlc1tvcHRpb25zLmZpZWxkTmFtZV0pIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwpOyB9XG5cbiAgdGhpcy5pbmRleGVzW29wdGlvbnMuZmllbGROYW1lXSA9IG5ldyBJbmRleChvcHRpb25zKTtcbiAgaWYgKG9wdGlvbnMuZXhwaXJlQWZ0ZXJTZWNvbmRzICE9PSB1bmRlZmluZWQpIHsgdGhpcy50dGxJbmRleGVzW29wdGlvbnMuZmllbGROYW1lXSA9IG9wdGlvbnMuZXhwaXJlQWZ0ZXJTZWNvbmRzOyB9ICAgLy8gV2l0aCB0aGlzIGltcGxlbWVudGF0aW9uIGluZGV4IGNyZWF0aW9uIGlzIG5vdCBuZWNlc3NhcnkgdG8gZW5zdXJlIFRUTCBidXQgd2Ugc3RpY2sgd2l0aCBNb25nb0RCJ3MgQVBJIGhlcmVcblxuICB0cnkge1xuICAgIHRoaXMuaW5kZXhlc1tvcHRpb25zLmZpZWxkTmFtZV0uaW5zZXJ0KHRoaXMuZ2V0QWxsRGF0YSgpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGRlbGV0ZSB0aGlzLmluZGV4ZXNbb3B0aW9ucy5maWVsZE5hbWVdO1xuICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgfVxuXG4gIC8vIFdlIG1heSB3YW50IHRvIGZvcmNlIGFsbCBvcHRpb25zIHRvIGJlIHBlcnNpc3RlZCBpbmNsdWRpbmcgZGVmYXVsdHMsIG5vdCBqdXN0IHRoZSBvbmVzIHBhc3NlZCB0aGUgaW5kZXggY3JlYXRpb24gZnVuY3Rpb25cbiAgdGhpcy5wZXJzaXN0ZW5jZS5wZXJzaXN0TmV3U3RhdGUoW3sgJCRpbmRleENyZWF0ZWQ6IG9wdGlvbnMgfV0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7IHJldHVybiBjYWxsYmFjayhlcnIpOyB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYW4gaW5kZXhcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZE5hbWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IGVyclxuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLnJlbW92ZUluZGV4ID0gZnVuY3Rpb24gKGZpZWxkTmFtZSwgY2IpIHtcbiAgdmFyIGNhbGxiYWNrID0gY2IgfHwgZnVuY3Rpb24gKCkge307XG5cbiAgZGVsZXRlIHRoaXMuaW5kZXhlc1tmaWVsZE5hbWVdO1xuXG4gIHRoaXMucGVyc2lzdGVuY2UucGVyc2lzdE5ld1N0YXRlKFt7ICQkaW5kZXhSZW1vdmVkOiBmaWVsZE5hbWUgfV0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7IHJldHVybiBjYWxsYmFjayhlcnIpOyB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBBZGQgb25lIG9yIHNldmVyYWwgZG9jdW1lbnQocykgdG8gYWxsIGluZGV4ZXNcbiAqL1xuRGF0YXN0b3JlLnByb3RvdHlwZS5hZGRUb0luZGV4ZXMgPSBmdW5jdGlvbiAoZG9jKSB7XG4gIHZhciBpLCBmYWlsaW5nSW5kZXgsIGVycm9yXG4gICAgLCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5pbmRleGVzKVxuICAgIDtcblxuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmluZGV4ZXNba2V5c1tpXV0uaW5zZXJ0KGRvYyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZmFpbGluZ0luZGV4ID0gaTtcbiAgICAgIGVycm9yID0gZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIGFuIGVycm9yIGhhcHBlbmVkLCB3ZSBuZWVkIHRvIHJvbGxiYWNrIHRoZSBpbnNlcnQgb24gYWxsIG90aGVyIGluZGV4ZXNcbiAgaWYgKGVycm9yKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGZhaWxpbmdJbmRleDsgaSArPSAxKSB7XG4gICAgICB0aGlzLmluZGV4ZXNba2V5c1tpXV0ucmVtb3ZlKGRvYyk7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgb25lIG9yIHNldmVyYWwgZG9jdW1lbnQocykgZnJvbSBhbGwgaW5kZXhlc1xuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLnJlbW92ZUZyb21JbmRleGVzID0gZnVuY3Rpb24gKGRvYykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgT2JqZWN0LmtleXModGhpcy5pbmRleGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgc2VsZi5pbmRleGVzW2ldLnJlbW92ZShkb2MpO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBVcGRhdGUgb25lIG9yIHNldmVyYWwgZG9jdW1lbnRzIGluIGFsbCBpbmRleGVzXG4gKiBUbyB1cGRhdGUgbXVsdGlwbGUgZG9jdW1lbnRzLCBvbGREb2MgbXVzdCBiZSBhbiBhcnJheSBvZiB7IG9sZERvYywgbmV3RG9jIH0gcGFpcnNcbiAqIElmIG9uZSB1cGRhdGUgdmlvbGF0ZXMgYSBjb25zdHJhaW50LCBhbGwgY2hhbmdlcyBhcmUgcm9sbGVkIGJhY2tcbiAqL1xuRGF0YXN0b3JlLnByb3RvdHlwZS51cGRhdGVJbmRleGVzID0gZnVuY3Rpb24gKG9sZERvYywgbmV3RG9jKSB7XG4gIHZhciBpLCBmYWlsaW5nSW5kZXgsIGVycm9yXG4gICAgLCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5pbmRleGVzKVxuICAgIDtcblxuICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmluZGV4ZXNba2V5c1tpXV0udXBkYXRlKG9sZERvYywgbmV3RG9jKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBmYWlsaW5nSW5kZXggPSBpO1xuICAgICAgZXJyb3IgPSBlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgYW4gZXJyb3IgaGFwcGVuZWQsIHdlIG5lZWQgdG8gcm9sbGJhY2sgdGhlIHVwZGF0ZSBvbiBhbGwgb3RoZXIgaW5kZXhlc1xuICBpZiAoZXJyb3IpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmFpbGluZ0luZGV4OyBpICs9IDEpIHtcbiAgICAgIHRoaXMuaW5kZXhlc1trZXlzW2ldXS5yZXZlcnRVcGRhdGUob2xkRG9jLCBuZXdEb2MpO1xuICAgIH1cblxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5cbi8qKlxuICogUmV0dXJuIHRoZSBsaXN0IG9mIGNhbmRpZGF0ZXMgZm9yIGEgZ2l2ZW4gcXVlcnlcbiAqIENydWRlIGltcGxlbWVudGF0aW9uIGZvciBub3csIHdlIHJldHVybiB0aGUgY2FuZGlkYXRlcyBnaXZlbiBieSB0aGUgZmlyc3QgdXNhYmxlIGluZGV4IGlmIGFueVxuICogV2UgdHJ5IHRoZSBmb2xsb3dpbmcgcXVlcnkgdHlwZXMsIGluIHRoaXMgb3JkZXI6IGJhc2ljIG1hdGNoLCAkaW4gbWF0Y2gsIGNvbXBhcmlzb24gbWF0Y2hcbiAqIE9uZSB3YXkgdG8gbWFrZSBpdCBiZXR0ZXIgd291bGQgYmUgdG8gZW5hYmxlIHRoZSB1c2Ugb2YgbXVsdGlwbGUgaW5kZXhlcyBpZiB0aGUgZmlyc3QgdXNhYmxlIGluZGV4XG4gKiByZXR1cm5zIHRvbyBtdWNoIGRhdGEuIEkgbWF5IGRvIGl0IGluIHRoZSBmdXR1cmUuXG4gKlxuICogUmV0dXJuZWQgY2FuZGlkYXRlcyB3aWxsIGJlIHNjYW5uZWQgdG8gZmluZCBhbmQgcmVtb3ZlIGFsbCBleHBpcmVkIGRvY3VtZW50c1xuICpcbiAqIEBwYXJhbSB7UXVlcnl9IHF1ZXJ5XG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRvbnRFeHBpcmVTdGFsZURvY3MgT3B0aW9uYWwsIGRlZmF1bHRzIHRvIGZhbHNlLCBpZiB0cnVlIGRvbid0IHJlbW92ZSBzdGFsZSBkb2NzLiBVc2VmdWwgZm9yIHRoZSByZW1vdmUgZnVuY3Rpb24gd2hpY2ggc2hvdWxkbid0IGJlIGltcGFjdGVkIGJ5IGV4cGlyYXRpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBTaWduYXR1cmUgZXJyLCBkb2NzXG4gKi9cbkRhdGFzdG9yZS5wcm90b3R5cGUuZ2V0Q2FuZGlkYXRlcyA9IGZ1bmN0aW9uIChxdWVyeSwgZG9udEV4cGlyZVN0YWxlRG9jcywgY2FsbGJhY2spIHtcbiAgdmFyIGluZGV4TmFtZXMgPSBPYmplY3Qua2V5cyh0aGlzLmluZGV4ZXMpXG4gICAgLCBzZWxmID0gdGhpc1xuICAgICwgdXNhYmxlUXVlcnlLZXlzO1xuXG4gIGlmICh0eXBlb2YgZG9udEV4cGlyZVN0YWxlRG9jcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrID0gZG9udEV4cGlyZVN0YWxlRG9jcztcbiAgICBkb250RXhwaXJlU3RhbGVEb2NzID0gZmFsc2U7XG4gIH1cblxuICBhc3luYy53YXRlcmZhbGwoW1xuICAvLyBTVEVQIDE6IGdldCBjYW5kaWRhdGVzIGxpc3QgYnkgY2hlY2tpbmcgaW5kZXhlcyBmcm9tIG1vc3QgdG8gbGVhc3QgZnJlcXVlbnQgdXNlY2FzZVxuICBmdW5jdGlvbiAoY2IpIHtcbiAgICAvLyBGb3IgYSBiYXNpYyBtYXRjaFxuICAgIHVzYWJsZVF1ZXJ5S2V5cyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKHF1ZXJ5KS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAodHlwZW9mIHF1ZXJ5W2tdID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgcXVlcnlba10gPT09ICdudW1iZXInIHx8IHR5cGVvZiBxdWVyeVtrXSA9PT0gJ2Jvb2xlYW4nIHx8IHV0aWwuaXNEYXRlKHF1ZXJ5W2tdKSB8fCBxdWVyeVtrXSA9PT0gbnVsbCkge1xuICAgICAgICB1c2FibGVRdWVyeUtleXMucHVzaChrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1c2FibGVRdWVyeUtleXMgPSBfLmludGVyc2VjdGlvbih1c2FibGVRdWVyeUtleXMsIGluZGV4TmFtZXMpO1xuICAgIGlmICh1c2FibGVRdWVyeUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGNiKG51bGwsIHNlbGYuaW5kZXhlc1t1c2FibGVRdWVyeUtleXNbMF1dLmdldE1hdGNoaW5nKHF1ZXJ5W3VzYWJsZVF1ZXJ5S2V5c1swXV0pKTtcbiAgICB9XG5cbiAgICAvLyBGb3IgYSAkaW4gbWF0Y2hcbiAgICB1c2FibGVRdWVyeUtleXMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhxdWVyeSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgaWYgKHF1ZXJ5W2tdICYmIHF1ZXJ5W2tdLmhhc093blByb3BlcnR5KCckaW4nKSkge1xuICAgICAgICB1c2FibGVRdWVyeUtleXMucHVzaChrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1c2FibGVRdWVyeUtleXMgPSBfLmludGVyc2VjdGlvbih1c2FibGVRdWVyeUtleXMsIGluZGV4TmFtZXMpO1xuICAgIGlmICh1c2FibGVRdWVyeUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGNiKG51bGwsIHNlbGYuaW5kZXhlc1t1c2FibGVRdWVyeUtleXNbMF1dLmdldE1hdGNoaW5nKHF1ZXJ5W3VzYWJsZVF1ZXJ5S2V5c1swXV0uJGluKSk7XG4gICAgfVxuXG4gICAgLy8gRm9yIGEgY29tcGFyaXNvbiBtYXRjaFxuICAgIHVzYWJsZVF1ZXJ5S2V5cyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKHF1ZXJ5KS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAocXVlcnlba10gJiYgKHF1ZXJ5W2tdLmhhc093blByb3BlcnR5KCckbHQnKSB8fCBxdWVyeVtrXS5oYXNPd25Qcm9wZXJ0eSgnJGx0ZScpIHx8IHF1ZXJ5W2tdLmhhc093blByb3BlcnR5KCckZ3QnKSB8fCBxdWVyeVtrXS5oYXNPd25Qcm9wZXJ0eSgnJGd0ZScpKSkge1xuICAgICAgICB1c2FibGVRdWVyeUtleXMucHVzaChrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1c2FibGVRdWVyeUtleXMgPSBfLmludGVyc2VjdGlvbih1c2FibGVRdWVyeUtleXMsIGluZGV4TmFtZXMpO1xuICAgIGlmICh1c2FibGVRdWVyeUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGNiKG51bGwsIHNlbGYuaW5kZXhlc1t1c2FibGVRdWVyeUtleXNbMF1dLmdldEJldHdlZW5Cb3VuZHMocXVlcnlbdXNhYmxlUXVlcnlLZXlzWzBdXSkpO1xuICAgIH1cblxuICAgIC8vIEJ5IGRlZmF1bHQsIHJldHVybiBhbGwgdGhlIERCIGRhdGFcbiAgICByZXR1cm4gY2IobnVsbCwgc2VsZi5nZXRBbGxEYXRhKCkpO1xuICB9XG4gIC8vIFNURVAgMjogcmVtb3ZlIGFsbCBleHBpcmVkIGRvY3VtZW50c1xuICAsIGZ1bmN0aW9uIChkb2NzKSB7XG4gICAgaWYgKGRvbnRFeHBpcmVTdGFsZURvY3MpIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGRvY3MpOyB9XG5cbiAgICB2YXIgZXhwaXJlZERvY3NJZHMgPSBbXSwgdmFsaWREb2NzID0gW10sIHR0bEluZGV4ZXNGaWVsZE5hbWVzID0gT2JqZWN0LmtleXMoc2VsZi50dGxJbmRleGVzKTtcblxuICAgIGRvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7XG4gICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuICAgICAgdHRsSW5kZXhlc0ZpZWxkTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBpZiAoZG9jW2ldICE9PSB1bmRlZmluZWQgJiYgdXRpbC5pc0RhdGUoZG9jW2ldKSAmJiBEYXRlLm5vdygpID4gZG9jW2ldLmdldFRpbWUoKSArIHNlbGYudHRsSW5kZXhlc1tpXSAqIDEwMDApwqB7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAodmFsaWQpIHsgdmFsaWREb2NzLnB1c2goZG9jKTsgfSBlbHNlIHsgZXhwaXJlZERvY3NJZHMucHVzaChkb2MuX2lkKTsgfVxuICAgIH0pO1xuXG4gICAgYXN5bmMuZWFjaFNlcmllcyhleHBpcmVkRG9jc0lkcywgZnVuY3Rpb24gKF9pZCwgY2IpIHtcbiAgICAgIHNlbGYuX3JlbW92ZSh7IF9pZDogX2lkIH0sIHt9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH1cbiAgICAgICAgcmV0dXJuIGNiKCk7XG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgdmFsaWREb2NzKTtcbiAgICB9KTtcbiAgfV0pO1xufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5ldyBkb2N1bWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgT3B0aW9uYWwgY2FsbGJhY2ssIHNpZ25hdHVyZTogZXJyLCBpbnNlcnRlZERvY1xuICpcbiAqIEBhcGkgcHJpdmF0ZSBVc2UgRGF0YXN0b3JlLmluc2VydCB3aGljaCBoYXMgdGhlIHNhbWUgc2lnbmF0dXJlXG4gKi9cbkRhdGFzdG9yZS5wcm90b3R5cGUuX2luc2VydCA9IGZ1bmN0aW9uIChuZXdEb2MsIGNiKSB7XG4gIHZhciBjYWxsYmFjayA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgLCBwcmVwYXJlZERvY1xuICAgIDtcblxuICB0cnkge1xuICAgIHByZXBhcmVkRG9jID0gdGhpcy5wcmVwYXJlRG9jdW1lbnRGb3JJbnNlcnRpb24obmV3RG9jKVxuICAgIHRoaXMuX2luc2VydEluQ2FjaGUocHJlcGFyZWREb2MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICB9XG5cbiAgdGhpcy5wZXJzaXN0ZW5jZS5wZXJzaXN0TmV3U3RhdGUodXRpbC5pc0FycmF5KHByZXBhcmVkRG9jKSA/IHByZXBhcmVkRG9jIDogW3ByZXBhcmVkRG9jXSwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH1cbiAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbW9kZWwuZGVlcENvcHkocHJlcGFyZWREb2MpKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBfaWQgdGhhdCdzIG5vdCBhbHJlYWR5IGluIHVzZVxuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLmNyZWF0ZU5ld0lkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGVudGF0aXZlSWQgPSBjdXN0b21VdGlscy51aWQoMTYpO1xuICAvLyBUcnkgYXMgbWFueSB0aW1lcyBhcyBuZWVkZWQgdG8gZ2V0IGFuIHVudXNlZCBfaWQuIEFzIGV4cGxhaW5lZCBpbiBjdXN0b21VdGlscywgdGhlIHByb2JhYmlsaXR5IG9mIHRoaXMgZXZlciBoYXBwZW5pbmcgaXMgZXh0cmVtZWx5IHNtYWxsLCBzbyB0aGlzIGlzIE8oMSlcbiAgaWYgKHRoaXMuaW5kZXhlcy5faWQuZ2V0TWF0Y2hpbmcodGVudGF0aXZlSWQpLmxlbmd0aCA+IDApIHtcbiAgICB0ZW50YXRpdmVJZCA9IHRoaXMuY3JlYXRlTmV3SWQoKTtcbiAgfVxuICByZXR1cm4gdGVudGF0aXZlSWQ7XG59O1xuXG4vKipcbiAqIFByZXBhcmUgYSBkb2N1bWVudCAob3IgYXJyYXkgb2YgZG9jdW1lbnRzKSB0byBiZSBpbnNlcnRlZCBpbiBhIGRhdGFiYXNlXG4gKiBNZWFuaW5nIGFkZHMgX2lkIGFuZCB0aW1lc3RhbXBzIGlmIG5lY2Vzc2FyeSBvbiBhIGNvcHkgb2YgbmV3RG9jIHRvIGF2b2lkIGFueSBzaWRlIGVmZmVjdCBvbiB1c2VyIGlucHV0XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuRGF0YXN0b3JlLnByb3RvdHlwZS5wcmVwYXJlRG9jdW1lbnRGb3JJbnNlcnRpb24gPSBmdW5jdGlvbiAobmV3RG9jKSB7XG4gIHZhciBwcmVwYXJlZERvYywgc2VsZiA9IHRoaXM7XG5cbiAgaWYgKHV0aWwuaXNBcnJheShuZXdEb2MpKSB7XG4gICAgcHJlcGFyZWREb2MgPSBbXTtcbiAgICBuZXdEb2MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7IHByZXBhcmVkRG9jLnB1c2goc2VsZi5wcmVwYXJlRG9jdW1lbnRGb3JJbnNlcnRpb24oZG9jKSk7IH0pO1xuICB9IGVsc2Uge1xuICAgIHByZXBhcmVkRG9jID0gbW9kZWwuZGVlcENvcHkobmV3RG9jKTtcbiAgICBpZiAocHJlcGFyZWREb2MuX2lkID09PSB1bmRlZmluZWQpIHsgcHJlcGFyZWREb2MuX2lkID0gdGhpcy5jcmVhdGVOZXdJZCgpOyB9XG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKHRoaXMudGltZXN0YW1wRGF0YSAmJiBwcmVwYXJlZERvYy5jcmVhdGVkQXQgPT09IHVuZGVmaW5lZCkgeyBwcmVwYXJlZERvYy5jcmVhdGVkQXQgPSBub3c7IH1cbiAgICBpZiAodGhpcy50aW1lc3RhbXBEYXRhICYmIHByZXBhcmVkRG9jLnVwZGF0ZWRBdCA9PT0gdW5kZWZpbmVkKSB7IHByZXBhcmVkRG9jLnVwZGF0ZWRBdCA9IG5vdzsgfVxuICAgIG1vZGVsLmNoZWNrT2JqZWN0KHByZXBhcmVkRG9jKTtcbiAgfVxuXG4gIHJldHVybiBwcmVwYXJlZERvYztcbn07XG5cbi8qKlxuICogSWYgbmV3RG9jIGlzIGFuIGFycmF5IG9mIGRvY3VtZW50cywgdGhpcyB3aWxsIGluc2VydCBhbGwgZG9jdW1lbnRzIGluIHRoZSBjYWNoZVxuICogQGFwaSBwcml2YXRlXG4gKi9cbkRhdGFzdG9yZS5wcm90b3R5cGUuX2luc2VydEluQ2FjaGUgPSBmdW5jdGlvbiAocHJlcGFyZWREb2MpIHtcbiAgaWYgKHV0aWwuaXNBcnJheShwcmVwYXJlZERvYykpIHtcbiAgICB0aGlzLl9pbnNlcnRNdWx0aXBsZURvY3NJbkNhY2hlKHByZXBhcmVkRG9jKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFkZFRvSW5kZXhlcyhwcmVwYXJlZERvYyk7XG4gIH1cbn07XG5cbi8qKlxuICogSWYgb25lIGluc2VydGlvbiBmYWlscyAoZS5nLiBiZWNhdXNlIG9mIGEgdW5pcXVlIGNvbnN0cmFpbnQpLCByb2xsIGJhY2sgYWxsIHByZXZpb3VzXG4gKiBpbnNlcnRzIGFuZCB0aHJvd3MgdGhlIGVycm9yXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuRGF0YXN0b3JlLnByb3RvdHlwZS5faW5zZXJ0TXVsdGlwbGVEb2NzSW5DYWNoZSA9IGZ1bmN0aW9uIChwcmVwYXJlZERvY3MpIHtcbiAgdmFyIGksIGZhaWxpbmdJLCBlcnJvcjtcblxuICBmb3IgKGkgPSAwOyBpIDwgcHJlcGFyZWREb2NzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYWRkVG9JbmRleGVzKHByZXBhcmVkRG9jc1tpXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3IgPSBlO1xuICAgICAgZmFpbGluZ0kgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGZhaWxpbmdJOyBpICs9IDEpIHtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbUluZGV4ZXMocHJlcGFyZWREb2NzW2ldKTtcbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuRGF0YXN0b3JlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXhlY3V0b3IucHVzaCh7IHRoaXM6IHRoaXMsIGZuOiB0aGlzLl9pbnNlcnQsIGFyZ3VtZW50czogYXJndW1lbnRzIH0pO1xufTtcblxuXG4vKipcbiAqIENvdW50IGFsbCBkb2N1bWVudHMgbWF0Y2hpbmcgdGhlIHF1ZXJ5XG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgTW9uZ29EQi1zdHlsZSBxdWVyeVxuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24ocXVlcnksIGNhbGxiYWNrKSB7XG4gIHZhciBjdXJzb3IgPSBuZXcgQ3Vyc29yKHRoaXMsIHF1ZXJ5LCBmdW5jdGlvbihlcnIsIGRvY3MsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBkb2NzLmxlbmd0aCk7XG4gIH0pO1xuXG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjdXJzb3IuZXhlYyhjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxufTtcblxuXG4vKipcbiAqIEZpbmQgYWxsIGRvY3VtZW50cyBtYXRjaGluZyB0aGUgcXVlcnlcbiAqIElmIG5vIGNhbGxiYWNrIGlzIHBhc3NlZCwgd2UgcmV0dXJuIHRoZSBjdXJzb3Igc28gdGhhdCB1c2VyIGNhbiBsaW1pdCwgc2tpcCBhbmQgZmluYWxseSBleGVjXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgTW9uZ29EQi1zdHlsZSBxdWVyeVxuICogQHBhcmFtIHtPYmplY3R9IHByb2plY3Rpb24gTW9uZ29EQi1zdHlsZSBwcm9qZWN0aW9uXG4gKi9cbkRhdGFzdG9yZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChxdWVyeSwgcHJvamVjdGlvbiwgY2FsbGJhY2spIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcHJvamVjdGlvbiA9IHt9O1xuICAgICAgLy8gY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB3aWxsIHJldHVybiBhIGN1cnNvclxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgaWYgKHR5cGVvZiBwcm9qZWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvamVjdGlvbjtcbiAgICAgICAgcHJvamVjdGlvbiA9IHt9O1xuICAgICAgfSAgIC8vIElmIG5vdCBhc3N1bWUgcHJvamVjdGlvbiBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIHVuZGVmaW5lZFxuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY3Vyc29yID0gbmV3IEN1cnNvcih0aGlzLCBxdWVyeSwgZnVuY3Rpb24oZXJyLCBkb2NzLCBjYWxsYmFjaykge1xuICAgIHZhciByZXMgPSBbXSwgaTtcblxuICAgIGlmIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBkb2NzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICByZXMucHVzaChtb2RlbC5kZWVwQ29weShkb2NzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXMpO1xuICB9KTtcblxuICBjdXJzb3IucHJvamVjdGlvbihwcm9qZWN0aW9uKTtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGN1cnNvci5leGVjKGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY3Vyc29yO1xuICB9XG59O1xuXG5cbi8qKlxuICogRmluZCBvbmUgZG9jdW1lbnQgbWF0Y2hpbmcgdGhlIHF1ZXJ5XG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnkgTW9uZ29EQi1zdHlsZSBxdWVyeVxuICogQHBhcmFtIHtPYmplY3R9IHByb2plY3Rpb24gTW9uZ29EQi1zdHlsZSBwcm9qZWN0aW9uXG4gKi9cbkRhdGFzdG9yZS5wcm90b3R5cGUuZmluZE9uZSA9IGZ1bmN0aW9uIChxdWVyeSwgcHJvamVjdGlvbiwgY2FsbGJhY2spIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcHJvamVjdGlvbiA9IHt9O1xuICAgICAgLy8gY2FsbGJhY2sgaXMgdW5kZWZpbmVkLCB3aWxsIHJldHVybiBhIGN1cnNvclxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgaWYgKHR5cGVvZiBwcm9qZWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrID0gcHJvamVjdGlvbjtcbiAgICAgICAgcHJvamVjdGlvbiA9IHt9O1xuICAgICAgfSAgIC8vIElmIG5vdCBhc3N1bWUgcHJvamVjdGlvbiBpcyBhbiBvYmplY3QgYW5kIGNhbGxiYWNrIHVuZGVmaW5lZFxuICAgICAgYnJlYWs7XG4gIH1cblxuICB2YXIgY3Vyc29yID0gbmV3IEN1cnNvcih0aGlzLCBxdWVyeSwgZnVuY3Rpb24oZXJyLCBkb2NzLCBjYWxsYmFjaykge1xuICAgIGlmIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH1cbiAgICBpZiAoZG9jcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBtb2RlbC5kZWVwQ29weShkb2NzWzBdKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBudWxsKTtcbiAgICB9XG4gIH0pO1xuXG4gIGN1cnNvci5wcm9qZWN0aW9uKHByb2plY3Rpb24pLmxpbWl0KDEpO1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY3Vyc29yLmV4ZWMoY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjdXJzb3I7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBVcGRhdGUgYWxsIGRvY3MgbWF0Y2hpbmcgcXVlcnlcbiAqIEBwYXJhbSB7T2JqZWN0fSBxdWVyeVxuICogQHBhcmFtIHtPYmplY3R9IHVwZGF0ZVF1ZXJ5XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25hbCBvcHRpb25zXG4gKiAgICAgICAgICAgICAgICAgb3B0aW9ucy5tdWx0aSBJZiB0cnVlLCBjYW4gdXBkYXRlIG11bHRpcGxlIGRvY3VtZW50cyAoZGVmYXVsdHMgdG8gZmFsc2UpXG4gKiAgICAgICAgICAgICAgICAgb3B0aW9ucy51cHNlcnQgSWYgdHJ1ZSwgZG9jdW1lbnQgaXMgaW5zZXJ0ZWQgaWYgdGhlIHF1ZXJ5IGRvZXNuJ3QgbWF0Y2ggYW55dGhpbmdcbiAqICAgICAgICAgICAgICAgICBvcHRpb25zLnJldHVyblVwZGF0ZWREb2NzIERlZmF1bHRzIHRvIGZhbHNlLCBpZiB0cnVlIHJldHVybiBhcyB0aGlyZCBhcmd1bWVudCB0aGUgYXJyYXkgb2YgdXBkYXRlZCBtYXRjaGVkIGRvY3VtZW50cyAoZXZlbiBpZiBubyBjaGFuZ2UgYWN0dWFsbHkgdG9vayBwbGFjZSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IChlcnIsIG51bUFmZmVjdGVkLCBhZmZlY3RlZERvY3VtZW50cywgdXBzZXJ0KVxuICogICAgICAgICAgICAgICAgICAgICAgSWYgdXBkYXRlIHdhcyBhbiB1cHNlcnQsIHVwc2VydCBmbGFnIGlzIHNldCB0byB0cnVlXG4gKiAgICAgICAgICAgICAgICAgICAgICBhZmZlY3RlZERvY3VtZW50cyBjYW4gYmUgb25lIG9mIHRoZSBmb2xsb3dpbmc6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICogRm9yIGFuIHVwc2VydCwgdGhlIHVwc2VydGVkIGRvY3VtZW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICogRm9yIGFuIHVwZGF0ZSB3aXRoIHJldHVyblVwZGF0ZWREb2NzIG9wdGlvbiBmYWxzZSwgbnVsbFxuICogICAgICAgICAgICAgICAgICAgICAgICAqIEZvciBhbiB1cGRhdGUgd2l0aCByZXR1cm5VcGRhdGVkRG9jcyB0cnVlIGFuZCBtdWx0aSBmYWxzZSwgdGhlIHVwZGF0ZWQgZG9jdW1lbnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgKiBGb3IgYW4gdXBkYXRlIHdpdGggcmV0dXJuVXBkYXRlZERvY3MgdHJ1ZSBhbmQgbXVsdGkgdHJ1ZSwgdGhlIGFycmF5IG9mIHVwZGF0ZWQgZG9jdW1lbnRzXG4gKlxuICogV0FSTklORzogVGhlIEFQSSB3YXMgY2hhbmdlZCBiZXR3ZWVuIHYxLjcuNCBhbmQgdjEuOCwgZm9yIGNvbnNpc3RlbmN5IGFuZCByZWFkYWJpbGl0eSByZWFzb25zLiBQcmlvciBhbmQgaW5jbHVkaW5nIHRvIHYxLjcuNCxcbiAqICAgICAgICAgIHRoZSBjYWxsYmFjayBzaWduYXR1cmUgd2FzIChlcnIsIG51bUFmZmVjdGVkLCB1cGRhdGVkKSB3aGVyZSB1cGRhdGVkIHdhcyB0aGUgdXBkYXRlZCBkb2N1bWVudCBpbiBjYXNlIG9mIGFuIHVwc2VydFxuICogICAgICAgICAgb3IgdGhlIGFycmF5IG9mIHVwZGF0ZWQgZG9jdW1lbnRzIGZvciBhbiB1cGRhdGUgaWYgdGhlIHJldHVyblVwZGF0ZWREb2NzIG9wdGlvbiB3YXMgdHJ1ZS4gVGhhdCBtZWFudCB0aGF0IHRoZSB0eXBlIG9mXG4gKiAgICAgICAgICBhZmZlY3RlZERvY3VtZW50cyBpbiBhIG5vbiBtdWx0aSB1cGRhdGUgZGVwZW5kZWQgb24gd2hldGhlciB0aGVyZSB3YXMgYW4gdXBzZXJ0IG9yIG5vdCwgbGVhdmluZyBvbmx5IHR3byB3YXlzIGZvciB0aGVcbiAqICAgICAgICAgIHVzZXIgdG8gY2hlY2sgd2hldGhlciBhbiB1cHNlcnQgaGFkIG9jY3VyZWQ6IGNoZWNraW5nIHRoZSB0eXBlIG9mIGFmZmVjdGVkRG9jdW1lbnRzIG9yIHJ1bm5pbmcgYW5vdGhlciBmaW5kIHF1ZXJ5IG9uXG4gKiAgICAgICAgICB0aGUgd2hvbGUgZGF0YXNldCB0byBjaGVjayBpdHMgc2l6ZS4gQm90aCBvcHRpb25zIGJlaW5nIHVnbHksIHRoZSBicmVha2luZyBjaGFuZ2Ugd2FzIG5lY2Vzc2FyeS5cbiAqXG4gKiBAYXBpIHByaXZhdGUgVXNlIERhdGFzdG9yZS51cGRhdGUgd2hpY2ggaGFzIHRoZSBzYW1lIHNpZ25hdHVyZVxuICovXG5EYXRhc3RvcmUucHJvdG90eXBlLl91cGRhdGUgPSBmdW5jdGlvbiAocXVlcnksIHVwZGF0ZVF1ZXJ5LCBvcHRpb25zLCBjYikge1xuICB2YXIgY2FsbGJhY2tcbiAgICAsIHNlbGYgPSB0aGlzXG4gICAgLCBudW1SZXBsYWNlZCA9IDBcbiAgICAsIG11bHRpLCB1cHNlcnRcbiAgICAsIGlcbiAgICA7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7IGNiID0gb3B0aW9uczsgb3B0aW9ucyA9IHt9OyB9XG4gIGNhbGxiYWNrID0gY2IgfHwgZnVuY3Rpb24gKCkge307XG4gIG11bHRpID0gb3B0aW9ucy5tdWx0aSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tdWx0aSA6IGZhbHNlO1xuICB1cHNlcnQgPSBvcHRpb25zLnVwc2VydCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy51cHNlcnQgOiBmYWxzZTtcblxuICBhc3luYy53YXRlcmZhbGwoW1xuICBmdW5jdGlvbiAoY2IpIHsgICAvLyBJZiB1cHNlcnQgb3B0aW9uIGlzIHNldCwgY2hlY2sgd2hldGhlciB3ZSBuZWVkIHRvIGluc2VydCB0aGUgZG9jXG4gICAgaWYgKCF1cHNlcnQpIHsgcmV0dXJuIGNiKCk7IH1cblxuICAgIC8vIE5lZWQgdG8gdXNlIGFuIGludGVybmFsIGZ1bmN0aW9uIG5vdCB0aWVkIHRvIHRoZSBleGVjdXRvciB0byBhdm9pZCBkZWFkbG9ja1xuICAgIHZhciBjdXJzb3IgPSBuZXcgQ3Vyc29yKHNlbGYsIHF1ZXJ5KTtcbiAgICBjdXJzb3IubGltaXQoMSkuX2V4ZWMoZnVuY3Rpb24gKGVyciwgZG9jcykge1xuICAgICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuICAgICAgaWYgKGRvY3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBjYigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHRvQmVJbnNlcnRlZDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIG1vZGVsLmNoZWNrT2JqZWN0KHVwZGF0ZVF1ZXJ5KTtcbiAgICAgICAgICAvLyB1cGRhdGVRdWVyeSBpcyBhIHNpbXBsZSBvYmplY3Qgd2l0aCBubyBtb2RpZmllciwgdXNlIGl0IGFzIHRoZSBkb2N1bWVudCB0byBpbnNlcnRcbiAgICAgICAgICB0b0JlSW5zZXJ0ZWQgPSB1cGRhdGVRdWVyeTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIHVwZGF0ZVF1ZXJ5IGNvbnRhaW5zIG1vZGlmaWVycywgdXNlIHRoZSBmaW5kIHF1ZXJ5IGFzIHRoZSBiYXNlLFxuICAgICAgICAgIC8vIHN0cmlwIGl0IGZyb20gYWxsIG9wZXJhdG9ycyBhbmQgdXBkYXRlIGl0IGFjY29yZGluZyB0byB1cGRhdGVRdWVyeVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0b0JlSW5zZXJ0ZWQgPSBtb2RlbC5tb2RpZnkobW9kZWwuZGVlcENvcHkocXVlcnksIHRydWUpLCB1cGRhdGVRdWVyeSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZi5faW5zZXJ0KHRvQmVJbnNlcnRlZCwgZnVuY3Rpb24gKGVyciwgbmV3RG9jKSB7XG4gICAgICAgICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCAxLCBuZXdEb2MsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAsIGZ1bmN0aW9uICgpIHsgICAvLyBQZXJmb3JtIHRoZSB1cGRhdGVcbiAgICB2YXIgbW9kaWZpZWREb2MgLCBtb2RpZmljYXRpb25zID0gW10sIGNyZWF0ZWRBdDtcblxuICAgIHNlbGYuZ2V0Q2FuZGlkYXRlcyhxdWVyeSwgZnVuY3Rpb24gKGVyciwgY2FuZGlkYXRlcykge1xuICAgICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuXG4gICAgICAvLyBQcmVwYXJpbmcgdXBkYXRlIChpZiBhbiBlcnJvciBpcyB0aHJvd24gaGVyZSBuZWl0aGVyIHRoZSBkYXRhZmlsZSBub3JcbiAgICAgIC8vIHRoZSBpbi1tZW1vcnkgaW5kZXhlcyBhcmUgYWZmZWN0ZWQpXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FuZGlkYXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGlmIChtb2RlbC5tYXRjaChjYW5kaWRhdGVzW2ldLCBxdWVyeSkgJiYgKG11bHRpIHx8IG51bVJlcGxhY2VkID09PSAwKSkge1xuICAgICAgICAgICAgbnVtUmVwbGFjZWQgKz0gMTtcbiAgICAgICAgICAgIGlmIChzZWxmLnRpbWVzdGFtcERhdGEpIHsgY3JlYXRlZEF0ID0gY2FuZGlkYXRlc1tpXS5jcmVhdGVkQXQ7IH1cbiAgICAgICAgICAgIG1vZGlmaWVkRG9jID0gbW9kZWwubW9kaWZ5KGNhbmRpZGF0ZXNbaV0sIHVwZGF0ZVF1ZXJ5KTtcbiAgICAgICAgICAgIGlmIChzZWxmLnRpbWVzdGFtcERhdGEpIHtcbiAgICAgICAgICAgICAgbW9kaWZpZWREb2MuY3JlYXRlZEF0ID0gY3JlYXRlZEF0O1xuICAgICAgICAgICAgICBtb2RpZmllZERvYy51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW9kaWZpY2F0aW9ucy5wdXNoKHsgb2xkRG9jOiBjYW5kaWRhdGVzW2ldLCBuZXdEb2M6IG1vZGlmaWVkRG9jIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGFuZ2UgdGhlIGRvY3MgaW4gbWVtb3J5XG4gICAgICB0cnkge1xuICAgICAgICBzZWxmLnVwZGF0ZUluZGV4ZXMobW9kaWZpY2F0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgZGF0YWZpbGVcbiAgICAgIHZhciB1cGRhdGVkRG9jcyA9IF8ucGx1Y2sobW9kaWZpY2F0aW9ucywgJ25ld0RvYycpO1xuICAgICAgc2VsZi5wZXJzaXN0ZW5jZS5wZXJzaXN0TmV3U3RhdGUodXBkYXRlZERvY3MsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuICAgICAgICBpZiAoIW9wdGlvbnMucmV0dXJuVXBkYXRlZERvY3MpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbnVtUmVwbGFjZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB1cGRhdGVkRG9jc0RDID0gW107XG4gICAgICAgICAgdXBkYXRlZERvY3MuZm9yRWFjaChmdW5jdGlvbiAoZG9jKSB7IHVwZGF0ZWREb2NzREMucHVzaChtb2RlbC5kZWVwQ29weShkb2MpKTsgfSk7XG4gICAgICAgICAgaWYgKCEgbXVsdGkpIHsgdXBkYXRlZERvY3NEQyA9IHVwZGF0ZWREb2NzRENbMF07IH1cbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbnVtUmVwbGFjZWQsIHVwZGF0ZWREb2NzREMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfV0pO1xufTtcblxuRGF0YXN0b3JlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXhlY3V0b3IucHVzaCh7IHRoaXM6IHRoaXMsIGZuOiB0aGlzLl91cGRhdGUsIGFyZ3VtZW50czogYXJndW1lbnRzIH0pO1xufTtcblxuXG4vKipcbiAqIFJlbW92ZSBhbGwgZG9jcyBtYXRjaGluZyB0aGUgcXVlcnlcbiAqIEZvciBub3cgdmVyeSBuYWl2ZSBpbXBsZW1lbnRhdGlvbiAoc2ltaWxhciB0byB1cGRhdGUpXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbmFsIG9wdGlvbnNcbiAqICAgICAgICAgICAgICAgICBvcHRpb25zLm11bHRpIElmIHRydWUsIGNhbiB1cGRhdGUgbXVsdGlwbGUgZG9jdW1lbnRzIChkZWZhdWx0cyB0byBmYWxzZSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IGVyciwgbnVtUmVtb3ZlZFxuICpcbiAqIEBhcGkgcHJpdmF0ZSBVc2UgRGF0YXN0b3JlLnJlbW92ZSB3aGljaCBoYXMgdGhlIHNhbWUgc2lnbmF0dXJlXG4gKi9cbkRhdGFzdG9yZS5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uIChxdWVyeSwgb3B0aW9ucywgY2IpIHtcbiAgdmFyIGNhbGxiYWNrXG4gICAgLCBzZWxmID0gdGhpcywgbnVtUmVtb3ZlZCA9IDAsIHJlbW92ZWREb2NzID0gW10sIG11bHRpXG4gICAgO1xuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykgeyBjYiA9IG9wdGlvbnM7IG9wdGlvbnMgPSB7fTsgfVxuICBjYWxsYmFjayA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9O1xuICBtdWx0aSA9IG9wdGlvbnMubXVsdGkgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubXVsdGkgOiBmYWxzZTtcblxuICB0aGlzLmdldENhbmRpZGF0ZXMocXVlcnksIHRydWUsIGZ1bmN0aW9uIChlcnIsIGNhbmRpZGF0ZXMpIHtcbiAgICBpZiAoZXJyKSB7IHJldHVybiBjYWxsYmFjayhlcnIpOyB9XG5cbiAgICB0cnkge1xuICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIGlmIChtb2RlbC5tYXRjaChkLCBxdWVyeSkgJiYgKG11bHRpIHx8IG51bVJlbW92ZWQgPT09IDApKSB7XG4gICAgICAgICAgbnVtUmVtb3ZlZCArPSAxO1xuICAgICAgICAgIHJlbW92ZWREb2NzLnB1c2goeyAkJGRlbGV0ZWQ6IHRydWUsIF9pZDogZC5faWQgfSk7XG4gICAgICAgICAgc2VsZi5yZW1vdmVGcm9tSW5kZXhlcyhkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7IHJldHVybiBjYWxsYmFjayhlcnIpOyB9XG5cbiAgICBzZWxmLnBlcnNpc3RlbmNlLnBlcnNpc3ROZXdTdGF0ZShyZW1vdmVkRG9jcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIG51bVJlbW92ZWQpO1xuICAgIH0pO1xuICB9KTtcbn07XG5cbkRhdGFzdG9yZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmV4ZWN1dG9yLnB1c2goeyB0aGlzOiB0aGlzLCBmbjogdGhpcy5fcmVtb3ZlLCBhcmd1bWVudHM6IGFyZ3VtZW50cyB9KTtcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFzdG9yZTtcbiIsIi8qKlxuICogUmVzcG9uc2libGUgZm9yIHNlcXVlbnRpYWxseSBleGVjdXRpbmcgYWN0aW9ucyBvbiB0aGUgZGF0YWJhc2VcbiAqL1xuXG52YXIgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpXG4gIDtcblxuZnVuY3Rpb24gRXhlY3V0b3IgKCkge1xuICB0aGlzLmJ1ZmZlciA9IFtdO1xuICB0aGlzLnJlYWR5ID0gZmFsc2U7XG5cbiAgLy8gVGhpcyBxdWV1ZSB3aWxsIGV4ZWN1dGUgYWxsIGNvbW1hbmRzLCBvbmUtYnktb25lIGluIG9yZGVyXG4gIHRoaXMucXVldWUgPSBhc3luYy5xdWV1ZShmdW5jdGlvbiAodGFzaywgY2IpIHtcbiAgICB2YXIgbmV3QXJndW1lbnRzID0gW107XG5cbiAgICAvLyB0YXNrLmFyZ3VtZW50cyBpcyBhbiBhcnJheS1saWtlIG9iamVjdCBvbiB3aGljaCBhZGRpbmcgYSBuZXcgZmllbGQgZG9lc24ndCB3b3JrLCBzbyB3ZSB0cmFuc2Zvcm0gaXQgaW50byBhIHJlYWwgYXJyYXlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2suYXJndW1lbnRzLmxlbmd0aDsgaSArPSAxKSB7IG5ld0FyZ3VtZW50cy5wdXNoKHRhc2suYXJndW1lbnRzW2ldKTsgfVxuICAgIHZhciBsYXN0QXJnID0gdGFzay5hcmd1bWVudHNbdGFzay5hcmd1bWVudHMubGVuZ3RoIC0gMV07XG5cbiAgICAvLyBBbHdheXMgdGVsbCB0aGUgcXVldWUgdGFzayBpcyBjb21wbGV0ZS4gRXhlY3V0ZSBjYWxsYmFjayBpZiBhbnkgd2FzIGdpdmVuLlxuICAgIGlmICh0eXBlb2YgbGFzdEFyZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQ2FsbGJhY2sgd2FzIHN1cHBsaWVkXG4gICAgICBuZXdBcmd1bWVudHNbbmV3QXJndW1lbnRzLmxlbmd0aCAtIDFdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICBzZXRJbW1lZGlhdGUoY2IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soY2IpO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RBcmcuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICghbGFzdEFyZyAmJiB0YXNrLmFyZ3VtZW50cy5sZW5ndGggIT09IDApIHtcbiAgICAgIC8vIGZhbHNlL3VuZGVmaW5lZC9udWxsIHN1cHBsaWVkIGFzIGNhbGxiYmFja1xuICAgICAgbmV3QXJndW1lbnRzW25ld0FyZ3VtZW50cy5sZW5ndGggLSAxXSA9IGZ1bmN0aW9uICgpIHsgY2IoKTsgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTm90aGluZyBzdXBwbGllZCBhcyBjYWxsYmFja1xuICAgICAgbmV3QXJndW1lbnRzLnB1c2goZnVuY3Rpb24gKCkgeyBjYigpOyB9KTtcbiAgICB9XG5cblxuICAgIHRhc2suZm4uYXBwbHkodGFzay50aGlzLCBuZXdBcmd1bWVudHMpO1xuICB9LCAxKTtcbn1cblxuXG4vKipcbiAqIElmIGV4ZWN1dG9yIGlzIHJlYWR5LCBxdWV1ZSB0YXNrIChhbmQgcHJvY2VzcyBpdCBpbW1lZGlhdGVseSBpZiBleGVjdXRvciB3YXMgaWRsZSlcbiAqIElmIG5vdCwgYnVmZmVyIHRhc2sgZm9yIGxhdGVyIHByb2Nlc3NpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXNrXG4gKiAgICAgICAgICAgICAgICAgdGFzay50aGlzIC0gT2JqZWN0IHRvIHVzZSBhcyB0aGlzXG4gKiAgICAgICAgICAgICAgICAgdGFzay5mbiAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAqICAgICAgICAgICAgICAgICB0YXNrLmFyZ3VtZW50cyAtIEFycmF5IG9mIGFyZ3VtZW50cywgSU1QT1JUQU5UOiBvbmx5IHRoZSBsYXN0IGFyZ3VtZW50IG1heSBiZSBhIGZ1bmN0aW9uICh0aGUgY2FsbGJhY2spXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZSBsYXN0IGFyZ3VtZW50IGNhbm5vdCBiZSBmYWxzZS91bmRlZmluZWQvbnVsbFxuICogQHBhcmFtIHtCb29sZWFufSBmb3JjZVF1ZXVpbmcgT3B0aW9uYWwgKGRlZmF1bHRzIHRvIGZhbHNlKSBmb3JjZSBleGVjdXRvciB0byBxdWV1ZSB0YXNrIGV2ZW4gaWYgaXQgaXMgbm90IHJlYWR5XG4gKi9cbkV4ZWN1dG9yLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHRhc2ssIGZvcmNlUXVldWluZykge1xuICBpZiAodGhpcy5yZWFkeSB8fCBmb3JjZVF1ZXVpbmcpIHtcbiAgICB0aGlzLnF1ZXVlLnB1c2godGFzayk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5idWZmZXIucHVzaCh0YXNrKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFF1ZXVlIGFsbCB0YXNrcyBpbiBidWZmZXIgKGluIHRoZSBzYW1lIG9yZGVyIHRoZXkgY2FtZSBpbilcbiAqIEF1dG9tYXRpY2FsbHkgc2V0cyBleGVjdXRvciBhcyByZWFkeVxuICovXG5FeGVjdXRvci5wcm90b3R5cGUucHJvY2Vzc0J1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGk7XG4gIHRoaXMucmVhZHkgPSB0cnVlO1xuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5idWZmZXIubGVuZ3RoOyBpICs9IDEpIHsgdGhpcy5xdWV1ZS5wdXNoKHRoaXMuYnVmZmVyW2ldKTsgfVxuICB0aGlzLmJ1ZmZlciA9IFtdO1xufTtcblxuXG5cbi8vIEludGVyZmFjZVxubW9kdWxlLmV4cG9ydHMgPSBFeGVjdXRvcjtcbiIsInZhciBCaW5hcnlTZWFyY2hUcmVlID0gcmVxdWlyZSgnYmluYXJ5LXNlYXJjaC10cmVlJykuQVZMVHJlZVxuICAsIG1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpXG4gICwgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxuICAsIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcbiAgO1xuXG4vKipcbiAqIFR3byBpbmRleGVkIHBvaW50ZXJzIGFyZSBlcXVhbCBpaWYgdGhleSBwb2ludCB0byB0aGUgc2FtZSBwbGFjZVxuICovXG5mdW5jdGlvbiBjaGVja1ZhbHVlRXF1YWxpdHkgKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT09IGI7XG59XG5cbi8qKlxuICogVHlwZS1hd2FyZSBwcm9qZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIHByb2plY3RGb3JVbmlxdWUgKGVsdCkge1xuICBpZiAoZWx0ID09PSBudWxsKSB7IHJldHVybiAnJG51bGwnOyB9XG4gIGlmICh0eXBlb2YgZWx0ID09PSAnc3RyaW5nJykgeyByZXR1cm4gJyRzdHJpbmcnICsgZWx0OyB9XG4gIGlmICh0eXBlb2YgZWx0ID09PSAnYm9vbGVhbicpIHsgcmV0dXJuICckYm9vbGVhbicgKyBlbHQ7IH1cbiAgaWYgKHR5cGVvZiBlbHQgPT09ICdudW1iZXInKSB7IHJldHVybiAnJG51bWJlcicgKyBlbHQ7IH1cbiAgaWYgKHV0aWwuaXNBcnJheShlbHQpKSB7IHJldHVybiAnJGRhdGUnICsgZWx0LmdldFRpbWUoKTsgfVxuXG4gIHJldHVybiBlbHQ7ICAgLy8gQXJyYXlzIGFuZCBvYmplY3RzLCB3aWxsIGNoZWNrIGZvciBwb2ludGVyIGVxdWFsaXR5XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgaW5kZXhcbiAqIEFsbCBtZXRob2RzIG9uIGFuIGluZGV4IGd1YXJhbnRlZSB0aGF0IGVpdGhlciB0aGUgd2hvbGUgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsIGFuZCB0aGUgaW5kZXggY2hhbmdlZFxuICogb3IgdGhlIG9wZXJhdGlvbiB3YXMgdW5zdWNjZXNzZnVsIGFuZCBhbiBlcnJvciBpcyB0aHJvd24gd2hpbGUgdGhlIGluZGV4IGlzIHVuY2hhbmdlZFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuZmllbGROYW1lIE9uIHdoaWNoIGZpZWxkIHNob3VsZCB0aGUgaW5kZXggYXBwbHkgKGNhbiB1c2UgZG90IG5vdGF0aW9uIHRvIGluZGV4IG9uIHN1YiBmaWVsZHMpXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMudW5pcXVlIE9wdGlvbmFsLCBlbmZvcmNlIGEgdW5pcXVlIGNvbnN0cmFpbnQgKGRlZmF1bHQ6IGZhbHNlKVxuICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLnNwYXJzZSBPcHRpb25hbCwgYWxsb3cgYSBzcGFyc2UgaW5kZXggKHdlIGNhbiBoYXZlIGRvY3VtZW50cyBmb3Igd2hpY2ggZmllbGROYW1lIGlzIHVuZGVmaW5lZCkgKGRlZmF1bHQ6IGZhbHNlKVxuICovXG5mdW5jdGlvbiBJbmRleCAob3B0aW9ucykge1xuICB0aGlzLmZpZWxkTmFtZSA9IG9wdGlvbnMuZmllbGROYW1lO1xuICB0aGlzLnVuaXF1ZSA9IG9wdGlvbnMudW5pcXVlIHx8IGZhbHNlO1xuICB0aGlzLnNwYXJzZSA9IG9wdGlvbnMuc3BhcnNlIHx8IGZhbHNlO1xuXG4gIHRoaXMudHJlZU9wdGlvbnMgPSB7IHVuaXF1ZTogdGhpcy51bmlxdWUsIGNvbXBhcmVLZXlzOiBtb2RlbC5jb21wYXJlVGhpbmdzLCBjaGVja1ZhbHVlRXF1YWxpdHk6IGNoZWNrVmFsdWVFcXVhbGl0eSB9O1xuXG4gIHRoaXMucmVzZXQoKTsgICAvLyBObyBkYXRhIGluIHRoZSBiZWdpbm5pbmdcbn1cblxuXG4vKipcbiAqIFJlc2V0IGFuIGluZGV4XG4gKiBAcGFyYW0ge0RvY3VtZW50IG9yIEFycmF5IG9mIGRvY3VtZW50c30gbmV3RGF0YSBPcHRpb25hbCwgZGF0YSB0byBpbml0aWFsaXplIHRoZSBpbmRleCB3aXRoXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJZiBhbiBlcnJvciBpcyB0aHJvd24gZHVyaW5nIGluc2VydGlvbiwgdGhlIGluZGV4IGlzIG5vdCBtb2RpZmllZFxuICovXG5JbmRleC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xuICB0aGlzLnRyZWUgPSBuZXcgQmluYXJ5U2VhcmNoVHJlZSh0aGlzLnRyZWVPcHRpb25zKTtcblxuICBpZiAobmV3RGF0YSkgeyB0aGlzLmluc2VydChuZXdEYXRhKTsgfVxufTtcblxuXG4vKipcbiAqIEluc2VydCBhIG5ldyBkb2N1bWVudCBpbiB0aGUgaW5kZXhcbiAqIElmIGFuIGFycmF5IGlzIHBhc3NlZCwgd2UgaW5zZXJ0IGFsbCBpdHMgZWxlbWVudHMgKGlmIG9uZSBpbnNlcnRpb24gZmFpbHMgdGhlIGluZGV4IGlzIG5vdCBtb2RpZmllZClcbiAqIE8obG9nKG4pKVxuICovXG5JbmRleC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGRvYykge1xuICB2YXIga2V5LCBzZWxmID0gdGhpc1xuICAgICwga2V5cywgaSwgZmFpbGluZ0ksIGVycm9yXG4gICAgO1xuXG4gIGlmICh1dGlsLmlzQXJyYXkoZG9jKSkgeyB0aGlzLmluc2VydE11bHRpcGxlRG9jcyhkb2MpOyByZXR1cm47IH1cblxuICBrZXkgPSBtb2RlbC5nZXREb3RWYWx1ZShkb2MsIHRoaXMuZmllbGROYW1lKTtcblxuICAvLyBXZSBkb24ndCBpbmRleCBkb2N1bWVudHMgdGhhdCBkb24ndCBjb250YWluIHRoZSBmaWVsZCBpZiB0aGUgaW5kZXggaXMgc3BhcnNlXG4gIGlmIChrZXkgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnNwYXJzZSkgeyByZXR1cm47IH1cblxuICBpZiAoIXV0aWwuaXNBcnJheShrZXkpKSB7XG4gICAgdGhpcy50cmVlLmluc2VydChrZXksIGRvYyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgYW4gaW5zZXJ0IGZhaWxzIGR1ZSB0byBhIHVuaXF1ZSBjb25zdHJhaW50LCByb2xsIGJhY2sgYWxsIGluc2VydHMgYmVmb3JlIGl0XG4gICAga2V5cyA9IF8udW5pcShrZXksIHByb2plY3RGb3JVbmlxdWUpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMudHJlZS5pbnNlcnQoa2V5c1tpXSwgZG9jKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyb3IgPSBlO1xuICAgICAgICBmYWlsaW5nSSA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGZhaWxpbmdJOyBpICs9IDEpIHtcbiAgICAgICAgdGhpcy50cmVlLmRlbGV0ZShrZXlzW2ldLCBkb2MpO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn07XG5cblxuLyoqXG4gKiBJbnNlcnQgYW4gYXJyYXkgb2YgZG9jdW1lbnRzIGluIHRoZSBpbmRleFxuICogSWYgYSBjb25zdHJhaW50IGlzIHZpb2xhdGVkLCB0aGUgY2hhbmdlcyBzaG91bGQgYmUgcm9sbGVkIGJhY2sgYW5kIGFuIGVycm9yIHRocm93blxuICpcbiAqIEBBUEkgcHJpdmF0ZVxuICovXG5JbmRleC5wcm90b3R5cGUuaW5zZXJ0TXVsdGlwbGVEb2NzID0gZnVuY3Rpb24gKGRvY3MpIHtcbiAgdmFyIGksIGVycm9yLCBmYWlsaW5nSTtcblxuICBmb3IgKGkgPSAwOyBpIDwgZG9jcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmluc2VydChkb2NzW2ldKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvciA9IGU7XG4gICAgICBmYWlsaW5nSSA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoZXJyb3IpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmFpbGluZ0k7IGkgKz0gMSkge1xuICAgICAgdGhpcy5yZW1vdmUoZG9jc1tpXSk7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYSBkb2N1bWVudCBmcm9tIHRoZSBpbmRleFxuICogSWYgYW4gYXJyYXkgaXMgcGFzc2VkLCB3ZSByZW1vdmUgYWxsIGl0cyBlbGVtZW50c1xuICogVGhlIHJlbW92ZSBvcGVyYXRpb24gaXMgc2FmZSB3aXRoIHJlZ2FyZHMgdG8gdGhlICd1bmlxdWUnIGNvbnN0cmFpbnRcbiAqIE8obG9nKG4pKVxuICovXG5JbmRleC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGRvYykge1xuICB2YXIga2V5LCBzZWxmID0gdGhpcztcblxuICBpZiAodXRpbC5pc0FycmF5KGRvYykpIHsgZG9jLmZvckVhY2goZnVuY3Rpb24gKGQpIHsgc2VsZi5yZW1vdmUoZCk7IH0pOyByZXR1cm47IH1cblxuICBrZXkgPSBtb2RlbC5nZXREb3RWYWx1ZShkb2MsIHRoaXMuZmllbGROYW1lKTtcblxuICBpZiAoa2V5ID09PSB1bmRlZmluZWQgJiYgdGhpcy5zcGFyc2UpIHsgcmV0dXJuOyB9XG5cbiAgaWYgKCF1dGlsLmlzQXJyYXkoa2V5KSkge1xuICAgIHRoaXMudHJlZS5kZWxldGUoa2V5LCBkb2MpO1xuICB9IGVsc2Uge1xuICAgIF8udW5pcShrZXksIHByb2plY3RGb3JVbmlxdWUpLmZvckVhY2goZnVuY3Rpb24gKF9rZXkpIHtcbiAgICAgIHNlbGYudHJlZS5kZWxldGUoX2tleSwgZG9jKTtcbiAgICB9KTtcbiAgfVxufTtcblxuXG4vKipcbiAqIFVwZGF0ZSBhIGRvY3VtZW50IGluIHRoZSBpbmRleFxuICogSWYgYSBjb25zdHJhaW50IGlzIHZpb2xhdGVkLCBjaGFuZ2VzIGFyZSByb2xsZWQgYmFjayBhbmQgYW4gZXJyb3IgdGhyb3duXG4gKiBOYWl2ZSBpbXBsZW1lbnRhdGlvbiwgc3RpbGwgaW4gTyhsb2cobikpXG4gKi9cbkluZGV4LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAob2xkRG9jLCBuZXdEb2MpIHtcbiAgaWYgKHV0aWwuaXNBcnJheShvbGREb2MpKSB7IHRoaXMudXBkYXRlTXVsdGlwbGVEb2NzKG9sZERvYyk7IHJldHVybjsgfVxuXG4gIHRoaXMucmVtb3ZlKG9sZERvYyk7XG5cbiAgdHJ5IHtcbiAgICB0aGlzLmluc2VydChuZXdEb2MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhpcy5pbnNlcnQob2xkRG9jKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuXG5cbi8qKlxuICogVXBkYXRlIG11bHRpcGxlIGRvY3VtZW50cyBpbiB0aGUgaW5kZXhcbiAqIElmIGEgY29uc3RyYWludCBpcyB2aW9sYXRlZCwgdGhlIGNoYW5nZXMgbmVlZCB0byBiZSByb2xsZWQgYmFja1xuICogYW5kIGFuIGVycm9yIHRocm93blxuICogQHBhcmFtIHtBcnJheSBvZiBvbGREb2MsIG5ld0RvYyBwYWlyc30gcGFpcnNcbiAqXG4gKiBAQVBJIHByaXZhdGVcbiAqL1xuSW5kZXgucHJvdG90eXBlLnVwZGF0ZU11bHRpcGxlRG9jcyA9IGZ1bmN0aW9uIChwYWlycykge1xuICB2YXIgaSwgZmFpbGluZ0ksIGVycm9yO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoaXMucmVtb3ZlKHBhaXJzW2ldLm9sZERvYyk7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5pbnNlcnQocGFpcnNbaV0ubmV3RG9jKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJvciA9IGU7XG4gICAgICBmYWlsaW5nSSA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvLyBJZiBhbiBlcnJvciB3YXMgcmFpc2VkLCByb2xsIGJhY2sgY2hhbmdlcyBpbiB0aGUgaW52ZXJzZSBvcmRlclxuICBpZiAoZXJyb3IpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmFpbGluZ0k7IGkgKz0gMSkge1xuICAgICAgdGhpcy5yZW1vdmUocGFpcnNbaV0ubmV3RG9jKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHRoaXMuaW5zZXJ0KHBhaXJzW2ldLm9sZERvYyk7XG4gICAgfVxuXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZXZlcnQgYW4gdXBkYXRlXG4gKi9cbkluZGV4LnByb3RvdHlwZS5yZXZlcnRVcGRhdGUgPSBmdW5jdGlvbiAob2xkRG9jLCBuZXdEb2MpIHtcbiAgdmFyIHJldmVydCA9IFtdO1xuXG4gIGlmICghdXRpbC5pc0FycmF5KG9sZERvYykpIHtcbiAgICB0aGlzLnVwZGF0ZShuZXdEb2MsIG9sZERvYyk7XG4gIH0gZWxzZSB7XG4gICAgb2xkRG9jLmZvckVhY2goZnVuY3Rpb24gKHBhaXIpIHtcbiAgICAgIHJldmVydC5wdXNoKHsgb2xkRG9jOiBwYWlyLm5ld0RvYywgbmV3RG9jOiBwYWlyLm9sZERvYyB9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZShyZXZlcnQpO1xuICB9XG59O1xuXG5cbi8qKlxuICogR2V0IGFsbCBkb2N1bWVudHMgaW4gaW5kZXggd2hvc2Uga2V5IG1hdGNoIHZhbHVlIChpZiBpdCBpcyBhIFRoaW5nKSBvciBvbmUgb2YgdGhlIGVsZW1lbnRzIG9mIHZhbHVlIChpZiBpdCBpcyBhbiBhcnJheSBvZiBUaGluZ3MpXG4gKiBAcGFyYW0ge1RoaW5nfSB2YWx1ZSBWYWx1ZSB0byBtYXRjaCB0aGUga2V5IGFnYWluc3RcbiAqIEByZXR1cm4ge0FycmF5IG9mIGRvY3VtZW50c31cbiAqL1xuSW5kZXgucHJvdG90eXBlLmdldE1hdGNoaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc2VsZi50cmVlLnNlYXJjaCh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIF9yZXMgPSB7fSwgcmVzID0gW107XG5cbiAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICBzZWxmLmdldE1hdGNoaW5nKHYpLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgICAgICBfcmVzW2RvYy5faWRdID0gZG9jO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyhfcmVzKS5mb3JFYWNoKGZ1bmN0aW9uIChfaWQpIHtcbiAgICAgIHJlcy5wdXNoKF9yZXNbX2lkXSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzO1xuICB9XG59O1xuXG5cbi8qKlxuICogR2V0IGFsbCBkb2N1bWVudHMgaW4gaW5kZXggd2hvc2Uga2V5IGlzIGJldHdlZW4gYm91bmRzIGFyZSB0aGV5IGFyZSBkZWZpbmVkIGJ5IHF1ZXJ5XG4gKiBEb2N1bWVudHMgYXJlIHNvcnRlZCBieSBrZXlcbiAqIEBwYXJhbSB7UXVlcnl9IHF1ZXJ5XG4gKiBAcmV0dXJuIHtBcnJheSBvZiBkb2N1bWVudHN9XG4gKi9cbkluZGV4LnByb3RvdHlwZS5nZXRCZXR3ZWVuQm91bmRzID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gIHJldHVybiB0aGlzLnRyZWUuYmV0d2VlbkJvdW5kcyhxdWVyeSk7XG59O1xuXG5cbi8qKlxuICogR2V0IGFsbCBlbGVtZW50cyBpbiB0aGUgaW5kZXhcbiAqIEByZXR1cm4ge0FycmF5IG9mIGRvY3VtZW50c31cbiAqL1xuSW5kZXgucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlcyA9IFtdO1xuXG4gIHRoaXMudHJlZS5leGVjdXRlT25FdmVyeU5vZGUoZnVuY3Rpb24gKG5vZGUpIHtcbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBub2RlLmRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIHJlcy5wdXNoKG5vZGUuZGF0YVtpXSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcmVzO1xufTtcblxuXG5cblxuLy8gSW50ZXJmYWNlXG5tb2R1bGUuZXhwb3J0cyA9IEluZGV4O1xuIiwiLyoqXG4gKiBIYW5kbGUgbW9kZWxzIChpLmUuIGRvY3MpXG4gKiBTZXJpYWxpemF0aW9uL2Rlc2VyaWFsaXphdGlvblxuICogQ29weWluZ1xuICogUXVlcnlpbmcsIHVwZGF0ZVxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpXG4gICwgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKVxuICAsIG1vZGlmaWVyRnVuY3Rpb25zID0ge31cbiAgLCBsYXN0U3RlcE1vZGlmaWVyRnVuY3Rpb25zID0ge31cbiAgLCBjb21wYXJpc29uRnVuY3Rpb25zID0ge31cbiAgLCBsb2dpY2FsT3BlcmF0b3JzID0ge31cbiAgLCBhcnJheUNvbXBhcmlzb25GdW5jdGlvbnMgPSB7fVxuICA7XG5cblxuLyoqXG4gKiBDaGVjayBhIGtleSwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIGtleSBpcyBub24gdmFsaWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBrIGtleVxuICogQHBhcmFtIHtNb2RlbH0gdiB2YWx1ZSwgbmVlZGVkIHRvIHRyZWF0IHRoZSBEYXRlIGVkZ2UgY2FzZVxuICogTm9uLXRyZWF0YWJsZSBlZGdlIGNhc2VzIGhlcmU6IGlmIHBhcnQgb2YgdGhlIG9iamVjdCBpZiBvZiB0aGUgZm9ybSB7ICQkZGF0ZTogbnVtYmVyIH0gb3IgeyAkJGRlbGV0ZWQ6IHRydWUgfVxuICogSXRzIHNlcmlhbGl6ZWQtdGhlbi1kZXNlcmlhbGl6ZWQgdmVyc2lvbiBpdCB3aWxsIHRyYW5zZm9ybWVkIGludG8gYSBEYXRlIG9iamVjdFxuICogQnV0IHlvdSByZWFsbHkgbmVlZCB0byB3YW50IGl0IHRvIHRyaWdnZXIgc3VjaCBiZWhhdmlvdXIsIGV2ZW4gd2hlbiB3YXJuZWQgbm90IHRvIHVzZSAnJCcgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgZmllbGQgbmFtZXMuLi5cbiAqL1xuZnVuY3Rpb24gY2hlY2tLZXkgKGssIHYpIHtcbiAgaWYgKHR5cGVvZiBrID09PSAnbnVtYmVyJykge1xuICAgIGsgPSBrLnRvU3RyaW5nKCk7XG4gIH1cblxuICBpZiAoa1swXSA9PT0gJyQnICYmICEoayA9PT0gJyQkZGF0ZScgJiYgdHlwZW9mIHYgPT09ICdudW1iZXInKSAmJiAhKGsgPT09ICckJGRlbGV0ZWQnICYmIHYgPT09IHRydWUpICYmICEoayA9PT0gJyQkaW5kZXhDcmVhdGVkJykgJiYgIShrID09PSAnJCRpbmRleFJlbW92ZWQnKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRmllbGQgbmFtZXMgY2Fubm90IGJlZ2luIHdpdGggdGhlICQgY2hhcmFjdGVyJyk7XG4gIH1cblxuICBpZiAoay5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaWVsZCBuYW1lcyBjYW5ub3QgY29udGFpbiBhIC4nKTtcbiAgfVxufVxuXG5cbi8qKlxuICogQ2hlY2sgYSBEQiBvYmplY3QgYW5kIHRocm93IGFuIGVycm9yIGlmIGl0J3Mgbm90IHZhbGlkXG4gKiBXb3JrcyBieSBhcHBseWluZyB0aGUgYWJvdmUgY2hlY2tLZXkgZnVuY3Rpb24gdG8gYWxsIGZpZWxkcyByZWN1cnNpdmVseVxuICovXG5mdW5jdGlvbiBjaGVja09iamVjdCAob2JqKSB7XG4gIGlmICh1dGlsLmlzQXJyYXkob2JqKSkge1xuICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uIChvKSB7XG4gICAgICBjaGVja09iamVjdChvKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgIGNoZWNrS2V5KGssIG9ialtrXSk7XG4gICAgICBjaGVja09iamVjdChvYmpba10pO1xuICAgIH0pO1xuICB9XG59XG5cblxuLyoqXG4gKiBTZXJpYWxpemUgYW4gb2JqZWN0IHRvIGJlIHBlcnNpc3RlZCB0byBhIG9uZS1saW5lIHN0cmluZ1xuICogRm9yIHNlcmlhbGl6YXRpb24vZGVzZXJpYWxpemF0aW9uLCB3ZSB1c2UgdGhlIG5hdGl2ZSBKU09OIHBhcnNlciBhbmQgbm90IGV2YWwgb3IgRnVuY3Rpb25cbiAqIFRoYXQgZ2l2ZXMgdXMgbGVzcyBmcmVlZG9tIGJ1dCBkYXRhIGVudGVyZWQgaW4gdGhlIGRhdGFiYXNlIG1heSBjb21lIGZyb20gdXNlcnNcbiAqIHNvIGV2YWwgYW5kIHRoZSBsaWtlIGFyZSBub3Qgc2FmZVxuICogQWNjZXB0ZWQgcHJpbWl0aXZlIHR5cGVzOiBOdW1iZXIsIFN0cmluZywgQm9vbGVhbiwgRGF0ZSwgbnVsbFxuICogQWNjZXB0ZWQgc2Vjb25kYXJ5IHR5cGVzOiBPYmplY3RzLCBBcnJheXNcbiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplIChvYmopIHtcbiAgdmFyIHJlcztcblxuICByZXMgPSBKU09OLnN0cmluZ2lmeShvYmosIGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgY2hlY2tLZXkoaywgdik7XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgLy8gSGFja2lzaCB3YXkgb2YgY2hlY2tpbmcgaWYgb2JqZWN0IGlzIERhdGUgKHRoaXMgd2F5IGl0IHdvcmtzIGJldHdlZW4gZXhlY3V0aW9uIGNvbnRleHRzIGluIG5vZGUtd2Via2l0KS5cbiAgICAvLyBXZSBjYW4ndCB1c2UgdmFsdWUgZGlyZWN0bHkgYmVjYXVzZSBmb3IgZGF0ZXMgaXQgaXMgYWxyZWFkeSBzdHJpbmcgaW4gdGhpcyBmdW5jdGlvbiAoZGF0ZS50b0pTT04gd2FzIGFscmVhZHkgY2FsbGVkKSwgc28gd2UgdXNlIHRoaXNcbiAgICBpZiAodHlwZW9mIHRoaXNba10uZ2V0VGltZSA9PT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4geyAkJGRhdGU6IHRoaXNba10uZ2V0VGltZSgpIH07IH1cblxuICAgIHJldHVybiB2O1xuICB9KTtcblxuICByZXR1cm4gcmVzO1xufVxuXG5cbi8qKlxuICogRnJvbSBhIG9uZS1saW5lIHJlcHJlc2VudGF0aW9uIG9mIGFuIG9iamVjdCBnZW5lcmF0ZSBieSB0aGUgc2VyaWFsaXplIGZ1bmN0aW9uXG4gKiBSZXR1cm4gdGhlIG9iamVjdCBpdHNlbGZcbiAqL1xuZnVuY3Rpb24gZGVzZXJpYWxpemUgKHJhd0RhdGEpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmF3RGF0YSwgZnVuY3Rpb24gKGssIHYpIHtcbiAgICBpZiAoayA9PT0gJyQkZGF0ZScpIHsgcmV0dXJuIG5ldyBEYXRlKHYpOyB9XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdiA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHYgPT09ICdib29sZWFuJyB8fCB2ID09PSBudWxsKSB7IHJldHVybiB2OyB9XG4gICAgaWYgKHYgJiYgdi4kJGRhdGUpIHsgcmV0dXJuIHYuJCRkYXRlOyB9XG5cbiAgICByZXR1cm4gdjtcbiAgfSk7XG59XG5cblxuLyoqXG4gKiBEZWVwIGNvcHkgYSBEQiBvYmplY3RcbiAqIFRoZSBvcHRpb25hbCBzdHJpY3RLZXlzIGZsYWcgKGRlZmF1bHRpbmcgdG8gZmFsc2UpIGluZGljYXRlcyB3aGV0aGVyIHRvIGNvcHkgZXZlcnl0aGluZyBvciBvbmx5IGZpZWxkc1xuICogd2hlcmUgdGhlIGtleXMgYXJlIHZhbGlkLCBpLmUuIGRvbid0IGJlZ2luIHdpdGggJCBhbmQgZG9uJ3QgY29udGFpbiBhIC5cbiAqL1xuZnVuY3Rpb24gZGVlcENvcHkgKG9iaiwgc3RyaWN0S2V5cykge1xuICB2YXIgcmVzO1xuXG4gIGlmICggdHlwZW9mIG9iaiA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgdHlwZW9mIG9iaiA9PT0gJ251bWJlcicgfHxcbiAgICAgICB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fFxuICAgICAgIG9iaiA9PT0gbnVsbCB8fFxuICAgICAgICh1dGlsLmlzRGF0ZShvYmopKSApIHtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgaWYgKHV0aWwuaXNBcnJheShvYmopKSB7XG4gICAgcmVzID0gW107XG4gICAgb2JqLmZvckVhY2goZnVuY3Rpb24gKG8pIHsgcmVzLnB1c2goZGVlcENvcHkobywgc3RyaWN0S2V5cykpOyB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgcmVzID0ge307XG4gICAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAoIXN0cmljdEtleXMgfHwgKGtbMF0gIT09ICckJyAmJiBrLmluZGV4T2YoJy4nKSA9PT0gLTEpKSB7XG4gICAgICAgIHJlc1trXSA9IGRlZXBDb3B5KG9ialtrXSwgc3RyaWN0S2V5cyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7ICAgLy8gRm9yIG5vdyBldmVyeXRoaW5nIGVsc2UgaXMgdW5kZWZpbmVkLiBXZSBzaG91bGQgcHJvYmFibHkgdGhyb3cgYW4gZXJyb3IgaW5zdGVhZFxufVxuXG5cbi8qKlxuICogVGVsbHMgaWYgYW4gb2JqZWN0IGlzIGEgcHJpbWl0aXZlIHR5cGUgb3IgYSBcInJlYWxcIiBvYmplY3RcbiAqIEFycmF5cyBhcmUgY29uc2lkZXJlZCBwcmltaXRpdmVcbiAqL1xuZnVuY3Rpb24gaXNQcmltaXRpdmVUeXBlIChvYmopIHtcbiAgcmV0dXJuICggdHlwZW9mIG9iaiA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgdHlwZW9mIG9iaiA9PT0gJ251bWJlcicgfHxcbiAgICAgICB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fFxuICAgICAgIG9iaiA9PT0gbnVsbCB8fFxuICAgICAgIHV0aWwuaXNEYXRlKG9iaikgfHxcbiAgICAgICB1dGlsLmlzQXJyYXkob2JqKSk7XG59XG5cblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9ucyBmb3IgY29tcGFyaW5nIHRoaW5nc1xuICogQXNzdW1lcyB0eXBlIGNoZWNraW5nIHdhcyBhbHJlYWR5IGRvbmUgKGEgYW5kIGIgYWxyZWFkeSBoYXZlIHRoZSBzYW1lIHR5cGUpXG4gKiBjb21wYXJlTlNCIHdvcmtzIGZvciBudW1iZXJzLCBzdHJpbmdzIGFuZCBib29sZWFuc1xuICovXG5mdW5jdGlvbiBjb21wYXJlTlNCIChhLCBiKSB7XG4gIGlmIChhIDwgYikgeyByZXR1cm4gLTE7IH1cbiAgaWYgKGEgPiBiKSB7IHJldHVybiAxOyB9XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBjb21wYXJlQXJyYXlzIChhLCBiKSB7XG4gIHZhciBpLCBjb21wO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBNYXRoLm1pbihhLmxlbmd0aCwgYi5sZW5ndGgpOyBpICs9IDEpIHtcbiAgICBjb21wID0gY29tcGFyZVRoaW5ncyhhW2ldLCBiW2ldKTtcblxuICAgIGlmIChjb21wICE9PSAwKSB7IHJldHVybiBjb21wOyB9XG4gIH1cblxuICAvLyBDb21tb24gc2VjdGlvbiB3YXMgaWRlbnRpY2FsLCBsb25nZXN0IG9uZSB3aW5zXG4gIHJldHVybiBjb21wYXJlTlNCKGEubGVuZ3RoLCBiLmxlbmd0aCk7XG59XG5cblxuLyoqXG4gKiBDb21wYXJlIHsgdGhpbmdzIFUgdW5kZWZpbmVkIH1cbiAqIFRoaW5ncyBhcmUgZGVmaW5lZCBhcyBhbnkgbmF0aXZlIHR5cGVzIChzdHJpbmcsIG51bWJlciwgYm9vbGVhbiwgbnVsbCwgZGF0ZSkgYW5kIG9iamVjdHNcbiAqIFdlIG5lZWQgdG8gY29tcGFyZSB3aXRoIHVuZGVmaW5lZCBhcyBpdCB3aWxsIGJlIHVzZWQgaW4gaW5kZXhlc1xuICogSW4gdGhlIGNhc2Ugb2Ygb2JqZWN0cyBhbmQgYXJyYXlzLCB3ZSBkZWVwLWNvbXBhcmVcbiAqIElmIHR3byBvYmplY3RzIGRvbnQgaGF2ZSB0aGUgc2FtZSB0eXBlLCB0aGUgKGFyYml0cmFyeSkgdHlwZSBoaWVyYXJjaHkgaXM6IHVuZGVmaW5lZCwgbnVsbCwgbnVtYmVyLCBzdHJpbmdzLCBib29sZWFuLCBkYXRlcywgYXJyYXlzLCBvYmplY3RzXG4gKiBSZXR1cm4gLTEgaWYgYSA8IGIsIDEgaWYgYSA+IGIgYW5kIDAgaWYgYSA9IGIgKG5vdGUgdGhhdCBlcXVhbGl0eSBoZXJlIGlzIE5PVCB0aGUgc2FtZSBhcyBkZWZpbmVkIGluIGFyZVRoaW5nc0VxdWFsISlcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBfY29tcGFyZVN0cmluZ3MgU3RyaW5nIGNvbXBhcmluZyBmdW5jdGlvbiwgcmV0dXJuaW5nIC0xLCAwIG9yIDEsIG92ZXJyaWRpbmcgZGVmYXVsdCBzdHJpbmcgY29tcGFyaXNvbiAodXNlZnVsIGZvciBsYW5ndWFnZXMgd2l0aCBhY2NlbnRlZCBsZXR0ZXJzKVxuICovXG5mdW5jdGlvbiBjb21wYXJlVGhpbmdzIChhLCBiLCBfY29tcGFyZVN0cmluZ3MpIHtcbiAgdmFyIGFLZXlzLCBiS2V5cywgY29tcCwgaVxuICAgICwgY29tcGFyZVN0cmluZ3MgPSBfY29tcGFyZVN0cmluZ3MgfHwgY29tcGFyZU5TQjtcblxuICAvLyB1bmRlZmluZWRcbiAgaWYgKGEgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gYiA9PT0gdW5kZWZpbmVkID8gMCA6IC0xOyB9XG4gIGlmIChiID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGEgPT09IHVuZGVmaW5lZCA/IDAgOiAxOyB9XG5cbiAgLy8gbnVsbFxuICBpZiAoYSA9PT0gbnVsbCkgeyByZXR1cm4gYiA9PT0gbnVsbCA/IDAgOiAtMTsgfVxuICBpZiAoYiA9PT0gbnVsbCkgeyByZXR1cm4gYSA9PT0gbnVsbCA/IDAgOiAxOyB9XG5cbiAgLy8gTnVtYmVyc1xuICBpZiAodHlwZW9mIGEgPT09ICdudW1iZXInKSB7IHJldHVybiB0eXBlb2YgYiA9PT0gJ251bWJlcicgPyBjb21wYXJlTlNCKGEsIGIpIDogLTE7IH1cbiAgaWYgKHR5cGVvZiBiID09PSAnbnVtYmVyJykgeyByZXR1cm4gdHlwZW9mIGEgPT09ICdudW1iZXInID8gY29tcGFyZU5TQihhLCBiKSA6IDE7IH1cblxuICAvLyBTdHJpbmdzXG4gIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIHR5cGVvZiBiID09PSAnc3RyaW5nJyA/IGNvbXBhcmVTdHJpbmdzKGEsIGIpIDogLTE7IH1cbiAgaWYgKHR5cGVvZiBiID09PSAnc3RyaW5nJykgeyByZXR1cm4gdHlwZW9mIGEgPT09ICdzdHJpbmcnID8gY29tcGFyZVN0cmluZ3MoYSwgYikgOiAxOyB9XG5cbiAgLy8gQm9vbGVhbnNcbiAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHsgcmV0dXJuIHR5cGVvZiBiID09PSAnYm9vbGVhbicgPyBjb21wYXJlTlNCKGEsIGIpIDogLTE7IH1cbiAgaWYgKHR5cGVvZiBiID09PSAnYm9vbGVhbicpIHsgcmV0dXJuIHR5cGVvZiBhID09PSAnYm9vbGVhbicgPyBjb21wYXJlTlNCKGEsIGIpIDogMTsgfVxuXG4gIC8vIERhdGVzXG4gIGlmICh1dGlsLmlzRGF0ZShhKSkgeyByZXR1cm4gdXRpbC5pc0RhdGUoYikgPyBjb21wYXJlTlNCKGEuZ2V0VGltZSgpLCBiLmdldFRpbWUoKSkgOiAtMTsgfVxuICBpZiAodXRpbC5pc0RhdGUoYikpIHsgcmV0dXJuIHV0aWwuaXNEYXRlKGEpID8gY29tcGFyZU5TQihhLmdldFRpbWUoKSwgYi5nZXRUaW1lKCkpIDogMTsgfVxuXG4gIC8vIEFycmF5cyAoZmlyc3QgZWxlbWVudCBpcyBtb3N0IHNpZ25pZmljYW50IGFuZCBzbyBvbilcbiAgaWYgKHV0aWwuaXNBcnJheShhKSkgeyByZXR1cm4gdXRpbC5pc0FycmF5KGIpID8gY29tcGFyZUFycmF5cyhhLCBiKSA6IC0xOyB9XG4gIGlmICh1dGlsLmlzQXJyYXkoYikpIHsgcmV0dXJuIHV0aWwuaXNBcnJheShhKSA/IGNvbXBhcmVBcnJheXMoYSwgYikgOiAxOyB9XG5cbiAgLy8gT2JqZWN0c1xuICBhS2V5cyA9IE9iamVjdC5rZXlzKGEpLnNvcnQoKTtcbiAgYktleXMgPSBPYmplY3Qua2V5cyhiKS5zb3J0KCk7XG5cbiAgZm9yIChpID0gMDsgaSA8IE1hdGgubWluKGFLZXlzLmxlbmd0aCwgYktleXMubGVuZ3RoKTsgaSArPSAxKSB7XG4gICAgY29tcCA9IGNvbXBhcmVUaGluZ3MoYVthS2V5c1tpXV0sIGJbYktleXNbaV1dKTtcblxuICAgIGlmIChjb21wICE9PSAwKSB7IHJldHVybiBjb21wOyB9XG4gIH1cblxuICByZXR1cm4gY29tcGFyZU5TQihhS2V5cy5sZW5ndGgsIGJLZXlzLmxlbmd0aCk7XG59XG5cblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVXBkYXRpbmcgZG9jdW1lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIFRoZSBzaWduYXR1cmUgb2YgbW9kaWZpZXIgZnVuY3Rpb25zIGlzIGFzIGZvbGxvd3NcbiAqIFRoZWlyIHN0cnVjdHVyZSBpcyBhbHdheXMgdGhlIHNhbWU6IHJlY3Vyc2l2ZWx5IGZvbGxvdyB0aGUgZG90IG5vdGF0aW9uIHdoaWxlIGNyZWF0aW5nXG4gKiB0aGUgbmVzdGVkIGRvY3VtZW50cyBpZiBuZWVkZWQsIHRoZW4gYXBwbHkgdGhlIFwibGFzdCBzdGVwIG1vZGlmaWVyXCJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG1vZGVsIHRvIG1vZGlmeVxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkIENhbiBjb250YWluIGRvdHMsIGluIHRoYXQgY2FzZSB0aGF0IG1lYW5zIHdlIHdpbGwgc2V0IGEgc3ViZmllbGQgcmVjdXJzaXZlbHlcbiAqIEBwYXJhbSB7TW9kZWx9IHZhbHVlXG4gKi9cblxuLyoqXG4gKiBTZXQgYSBmaWVsZCB0byBhIG5ldyB2YWx1ZVxuICovXG5sYXN0U3RlcE1vZGlmaWVyRnVuY3Rpb25zLiRzZXQgPSBmdW5jdGlvbiAob2JqLCBmaWVsZCwgdmFsdWUpIHtcbiAgb2JqW2ZpZWxkXSA9IHZhbHVlO1xufTtcblxuXG4vKipcbiAqIFVuc2V0IGEgZmllbGRcbiAqL1xubGFzdFN0ZXBNb2RpZmllckZ1bmN0aW9ucy4kdW5zZXQgPSBmdW5jdGlvbiAob2JqLCBmaWVsZCwgdmFsdWUpIHtcbiAgZGVsZXRlIG9ialtmaWVsZF07XG59O1xuXG5cbi8qKlxuICogUHVzaCBhbiBlbGVtZW50IHRvIHRoZSBlbmQgb2YgYW4gYXJyYXkgZmllbGRcbiAqIE9wdGlvbmFsIG1vZGlmaWVyICRlYWNoIGluc3RlYWQgb2YgdmFsdWUgdG8gcHVzaCBzZXZlcmFsIHZhbHVlc1xuICogT3B0aW9uYWwgbW9kaWZpZXIgJHNsaWNlIHRvIHNsaWNlIHRoZSByZXN1bHRpbmcgYXJyYXksIHNlZSBodHRwczovL2RvY3MubW9uZ29kYi5vcmcvbWFudWFsL3JlZmVyZW5jZS9vcGVyYXRvci91cGRhdGUvc2xpY2UvXG4gKiBEaWZmw6lyZWVuY2Ugd2l0aCBNb25nb0RCOiBpZiAkc2xpY2UgaXMgc3BlY2lmaWVkIGFuZCBub3QgJGVhY2gsIHdlIGFjdCBhcyBpZiB2YWx1ZSBpcyBhbiBlbXB0eSBhcnJheVxuICovXG5sYXN0U3RlcE1vZGlmaWVyRnVuY3Rpb25zLiRwdXNoID0gZnVuY3Rpb24gKG9iaiwgZmllbGQsIHZhbHVlKSB7XG4gIC8vIENyZWF0ZSB0aGUgYXJyYXkgaWYgaXQgZG9lc24ndCBleGlzdFxuICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHsgb2JqW2ZpZWxkXSA9IFtdOyB9XG5cbiAgaWYgKCF1dGlsLmlzQXJyYXkob2JqW2ZpZWxkXSkpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgJHB1c2ggYW4gZWxlbWVudCBvbiBub24tYXJyYXkgdmFsdWVzXCIpOyB9XG5cbiAgaWYgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuJHNsaWNlICYmIHZhbHVlLiRlYWNoID09PSB1bmRlZmluZWQpIHtcbiAgICB2YWx1ZS4kZWFjaCA9IFtdO1xuICB9XG5cbiAgaWYgKHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuJGVhY2gpIHtcbiAgICBpZiAoT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA+PSAzIHx8IChPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoID09PSAyICYmIHZhbHVlLiRzbGljZSA9PT0gdW5kZWZpbmVkKSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSB1c2UgJHNsaWNlIGluIGN1bmp1bmN0aW9uIHdpdGggJGVhY2ggd2hlbiAkcHVzaCB0byBhcnJheVwiKTsgfVxuICAgIGlmICghdXRpbC5pc0FycmF5KHZhbHVlLiRlYWNoKSkgeyB0aHJvdyBuZXcgRXJyb3IoXCIkZWFjaCByZXF1aXJlcyBhbiBhcnJheSB2YWx1ZVwiKTsgfVxuXG4gICAgdmFsdWUuJGVhY2guZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgb2JqW2ZpZWxkXS5wdXNoKHYpO1xuICAgIH0pO1xuXG4gICAgaWYgKHZhbHVlLiRzbGljZSA9PT0gdW5kZWZpbmVkIHx8IHR5cGVvZiB2YWx1ZS4kc2xpY2UgIT09ICdudW1iZXInKSB7IHJldHVybjsgfVxuXG4gICAgaWYgKHZhbHVlLiRzbGljZSA9PT0gMCkge1xuICAgICAgb2JqW2ZpZWxkXSA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhcnQsIGVuZCwgbiA9IG9ialtmaWVsZF0ubGVuZ3RoO1xuICAgICAgaWYgKHZhbHVlLiRzbGljZSA8IDApIHtcbiAgICAgICAgc3RhcnQgPSBNYXRoLm1heCgwLCBuICsgdmFsdWUuJHNsaWNlKTtcbiAgICAgICAgZW5kID0gbjtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUuJHNsaWNlID4gMCkge1xuICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgIGVuZCA9IE1hdGgubWluKG4sIHZhbHVlLiRzbGljZSk7XG4gICAgICB9XG4gICAgICBvYmpbZmllbGRdID0gb2JqW2ZpZWxkXS5zbGljZShzdGFydCwgZW5kKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb2JqW2ZpZWxkXS5wdXNoKHZhbHVlKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIEFkZCBhbiBlbGVtZW50IHRvIGFuIGFycmF5IGZpZWxkIG9ubHkgaWYgaXQgaXMgbm90IGFscmVhZHkgaW4gaXRcbiAqIE5vIG1vZGlmaWNhdGlvbiBpZiB0aGUgZWxlbWVudCBpcyBhbHJlYWR5IGluIHRoZSBhcnJheVxuICogTm90ZSB0aGF0IGl0IGRvZXNuJ3QgY2hlY2sgd2hldGhlciB0aGUgb3JpZ2luYWwgYXJyYXkgY29udGFpbnMgZHVwbGljYXRlc1xuICovXG5sYXN0U3RlcE1vZGlmaWVyRnVuY3Rpb25zLiRhZGRUb1NldCA9IGZ1bmN0aW9uIChvYmosIGZpZWxkLCB2YWx1ZSkge1xuICB2YXIgYWRkVG9TZXQgPSB0cnVlO1xuXG4gIC8vIENyZWF0ZSB0aGUgYXJyYXkgaWYgaXQgZG9lc24ndCBleGlzdFxuICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpIHsgb2JqW2ZpZWxkXSA9IFtdOyB9XG5cbiAgaWYgKCF1dGlsLmlzQXJyYXkob2JqW2ZpZWxkXSkpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgJGFkZFRvU2V0IGFuIGVsZW1lbnQgb24gbm9uLWFycmF5IHZhbHVlc1wiKTsgfVxuXG4gIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLiRlYWNoKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPiAxKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbid0IHVzZSBhbm90aGVyIGZpZWxkIGluIGNvbmp1bmN0aW9uIHdpdGggJGVhY2hcIik7IH1cbiAgICBpZiAoIXV0aWwuaXNBcnJheSh2YWx1ZS4kZWFjaCkpIHsgdGhyb3cgbmV3IEVycm9yKFwiJGVhY2ggcmVxdWlyZXMgYW4gYXJyYXkgdmFsdWVcIik7IH1cblxuICAgIHZhbHVlLiRlYWNoLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgIGxhc3RTdGVwTW9kaWZpZXJGdW5jdGlvbnMuJGFkZFRvU2V0KG9iaiwgZmllbGQsIHYpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtmaWVsZF0uZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgaWYgKGNvbXBhcmVUaGluZ3ModiwgdmFsdWUpID09PSAwKSB7IGFkZFRvU2V0ID0gZmFsc2U7IH1cbiAgICB9KTtcbiAgICBpZiAoYWRkVG9TZXQpIHsgb2JqW2ZpZWxkXS5wdXNoKHZhbHVlKTsgfVxuICB9XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBmaXJzdCBvciBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXlcbiAqL1xubGFzdFN0ZXBNb2RpZmllckZ1bmN0aW9ucy4kcG9wID0gZnVuY3Rpb24gKG9iaiwgZmllbGQsIHZhbHVlKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KG9ialtmaWVsZF0pKSB7IHRocm93IG5ldyBFcnJvcihcIkNhbid0ICRwb3AgYW4gZWxlbWVudCBmcm9tIG5vbi1hcnJheSB2YWx1ZXNcIik7IH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHsgdGhyb3cgbmV3IEVycm9yKHZhbHVlICsgXCIgaXNuJ3QgYW4gaW50ZWdlciwgY2FuJ3QgdXNlIGl0IHdpdGggJHBvcFwiKTsgfVxuICBpZiAodmFsdWUgPT09IDApIHsgcmV0dXJuOyB9XG5cbiAgaWYgKHZhbHVlID4gMCkge1xuICAgIG9ialtmaWVsZF0gPSBvYmpbZmllbGRdLnNsaWNlKDAsIG9ialtmaWVsZF0ubGVuZ3RoIC0gMSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2ZpZWxkXSA9IG9ialtmaWVsZF0uc2xpY2UoMSk7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpbnN0YW5jZXMgb2YgYSB2YWx1ZSBmcm9tIGFuIGV4aXN0aW5nIGFycmF5XG4gKi9cbmxhc3RTdGVwTW9kaWZpZXJGdW5jdGlvbnMuJHB1bGwgPSBmdW5jdGlvbiAob2JqLCBmaWVsZCwgdmFsdWUpIHtcbiAgdmFyIGFyciwgaTtcblxuICBpZiAoIXV0aWwuaXNBcnJheShvYmpbZmllbGRdKSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCAkcHVsbCBhbiBlbGVtZW50IGZyb20gbm9uLWFycmF5IHZhbHVlc1wiKTsgfVxuXG4gIGFyciA9IG9ialtmaWVsZF07XG4gIGZvciAoaSA9IGFyci5sZW5ndGggLSAxOyBpID49IDA7IGkgLT0gMSkge1xuICAgIGlmIChtYXRjaChhcnJbaV0sIHZhbHVlKSkge1xuICAgICAgYXJyLnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH1cbn07XG5cblxuLyoqXG4gKiBJbmNyZW1lbnQgYSBudW1lcmljIGZpZWxkJ3MgdmFsdWVcbiAqL1xubGFzdFN0ZXBNb2RpZmllckZ1bmN0aW9ucy4kaW5jID0gZnVuY3Rpb24gKG9iaiwgZmllbGQsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7IHRocm93IG5ldyBFcnJvcih2YWx1ZSArIFwiIG11c3QgYmUgYSBudW1iZXJcIik7IH1cblxuICBpZiAodHlwZW9mIG9ialtmaWVsZF0gIT09ICdudW1iZXInKSB7XG4gICAgaWYgKCFfLmhhcyhvYmosIGZpZWxkKSkge1xuICAgICAgb2JqW2ZpZWxkXSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEb24ndCB1c2UgdGhlICRpbmMgbW9kaWZpZXIgb24gbm9uLW51bWJlciBmaWVsZHNcIik7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG9ialtmaWVsZF0gKz0gdmFsdWU7XG4gIH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgdmFsdWUgb2YgdGhlIGZpZWxkLCBvbmx5IGlmIHNwZWNpZmllZCBmaWVsZCBpcyBncmVhdGVyIHRoYW4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGZpZWxkXG4gKi9cbmxhc3RTdGVwTW9kaWZpZXJGdW5jdGlvbnMuJG1heCA9IGZ1bmN0aW9uIChvYmosIGZpZWxkLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIG9ialtmaWVsZF0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgb2JqW2ZpZWxkXSA9IHZhbHVlO1xuICB9IGVsc2UgaWYgKHZhbHVlID4gb2JqW2ZpZWxkXSkge1xuICAgIG9ialtmaWVsZF0gPSB2YWx1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB2YWx1ZSBvZiB0aGUgZmllbGQsIG9ubHkgaWYgc3BlY2lmaWVkIGZpZWxkIGlzIHNtYWxsZXIgdGhhbiB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgZmllbGRcbiAqL1xubGFzdFN0ZXBNb2RpZmllckZ1bmN0aW9ucy4kbWluID0gZnVuY3Rpb24gKG9iaiwgZmllbGQsIHZhbHVlKSB7XG4gIGlmICh0eXBlb2Ygb2JqW2ZpZWxkXSA9PT0gJ3VuZGVmaW5lZCcpIHvCoFxuICAgIG9ialtmaWVsZF0gPSB2YWx1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA8IG9ialtmaWVsZF0pIHtcbiAgICBvYmpbZmllbGRdID0gdmFsdWU7XG4gIH1cbn07XG5cbi8vIEdpdmVuIGl0cyBuYW1lLCBjcmVhdGUgdGhlIGNvbXBsZXRlIG1vZGlmaWVyIGZ1bmN0aW9uXG5mdW5jdGlvbiBjcmVhdGVNb2RpZmllckZ1bmN0aW9uIChtb2RpZmllcikge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iaiwgZmllbGQsIHZhbHVlKSB7XG4gICAgdmFyIGZpZWxkUGFydHMgPSB0eXBlb2YgZmllbGQgPT09ICdzdHJpbmcnID8gZmllbGQuc3BsaXQoJy4nKSA6IGZpZWxkO1xuXG4gICAgaWYgKGZpZWxkUGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBsYXN0U3RlcE1vZGlmaWVyRnVuY3Rpb25zW21vZGlmaWVyXShvYmosIGZpZWxkLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvYmpbZmllbGRQYXJ0c1swXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobW9kaWZpZXIgPT09ICckdW5zZXQnKSB7IHJldHVybjsgfSAgIC8vIEJhZCBsb29raW5nIHNwZWNpZmljIGZpeCwgbmVlZHMgdG8gYmUgZ2VuZXJhbGl6ZWQgbW9kaWZpZXJzIHRoYXQgYmVoYXZlIGxpa2UgJHVuc2V0IGFyZSBpbXBsZW1lbnRlZFxuICAgICAgICBvYmpbZmllbGRQYXJ0c1swXV0gPSB7fTtcbiAgICAgIH1cbiAgICAgIG1vZGlmaWVyRnVuY3Rpb25zW21vZGlmaWVyXShvYmpbZmllbGRQYXJ0c1swXV0sIGZpZWxkUGFydHMuc2xpY2UoMSksIHZhbHVlKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIEFjdHVhbGx5IGNyZWF0ZSBhbGwgbW9kaWZpZXIgZnVuY3Rpb25zXG5PYmplY3Qua2V5cyhsYXN0U3RlcE1vZGlmaWVyRnVuY3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChtb2RpZmllcikge1xuICBtb2RpZmllckZ1bmN0aW9uc1ttb2RpZmllcl0gPSBjcmVhdGVNb2RpZmllckZ1bmN0aW9uKG1vZGlmaWVyKTtcbn0pO1xuXG5cbi8qKlxuICogTW9kaWZ5IGEgREIgb2JqZWN0IGFjY29yZGluZyB0byBhbiB1cGRhdGUgcXVlcnlcbiAqL1xuZnVuY3Rpb24gbW9kaWZ5IChvYmosIHVwZGF0ZVF1ZXJ5KSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModXBkYXRlUXVlcnkpXG4gICAgLCBmaXJzdENoYXJzID0gXy5tYXAoa2V5cywgZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW1bMF07IH0pXG4gICAgLCBkb2xsYXJGaXJzdENoYXJzID0gXy5maWx0ZXIoZmlyc3RDaGFycywgZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMgPT09ICckJzsgfSlcbiAgICAsIG5ld0RvYywgbW9kaWZpZXJzXG4gICAgO1xuXG4gIGlmIChrZXlzLmluZGV4T2YoJ19pZCcpICE9PSAtMSAmJiB1cGRhdGVRdWVyeS5faWQgIT09IG9iai5faWQpIHsgdGhyb3cgbmV3IEVycm9yKFwiWW91IGNhbm5vdCBjaGFuZ2UgYSBkb2N1bWVudCdzIF9pZFwiKTsgfVxuXG4gIGlmIChkb2xsYXJGaXJzdENoYXJzLmxlbmd0aCAhPT0gMCAmJiBkb2xsYXJGaXJzdENoYXJzLmxlbmd0aCAhPT0gZmlyc3RDaGFycy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2Fubm90IG1peCBtb2RpZmllcnMgYW5kIG5vcm1hbCBmaWVsZHNcIik7XG4gIH1cblxuICBpZiAoZG9sbGFyRmlyc3RDaGFycy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBTaW1wbHkgcmVwbGFjZSB0aGUgb2JqZWN0IHdpdGggdGhlIHVwZGF0ZSBxdWVyeSBjb250ZW50c1xuICAgIG5ld0RvYyA9IGRlZXBDb3B5KHVwZGF0ZVF1ZXJ5KTtcbiAgICBuZXdEb2MuX2lkID0gb2JqLl9pZDtcbiAgfSBlbHNlIHtcbiAgICAvLyBBcHBseSBtb2RpZmllcnNcbiAgICBtb2RpZmllcnMgPSBfLnVuaXEoa2V5cyk7XG4gICAgbmV3RG9jID0gZGVlcENvcHkob2JqKTtcbiAgICBtb2RpZmllcnMuZm9yRWFjaChmdW5jdGlvbiAobSkge1xuICAgICAgdmFyIGtleXM7XG5cbiAgICAgIGlmICghbW9kaWZpZXJGdW5jdGlvbnNbbV0pIHsgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBtb2RpZmllciBcIiArIG0pOyB9XG5cbiAgICAgIC8vIENhbid0IHJlbHkgb24gT2JqZWN0LmtleXMgdGhyb3dpbmcgb24gbm9uIG9iamVjdHMgc2luY2UgRVM2XG4gICAgICAvLyBOb3QgMTAwJSBzYXRpc2Z5aW5nIGFzIG5vbiBvYmplY3RzIGNhbiBiZSBpbnRlcnByZXRlZCBhcyBvYmplY3RzIGJ1dCBubyBmYWxzZSBuZWdhdGl2ZXMgc28gd2UgY2FuIGxpdmUgd2l0aCBpdFxuICAgICAgaWYgKHR5cGVvZiB1cGRhdGVRdWVyeVttXSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTW9kaWZpZXIgXCIgKyBtICsgXCIncyBhcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgICAgIH1cblxuICAgICAga2V5cyA9IE9iamVjdC5rZXlzKHVwZGF0ZVF1ZXJ5W21dKTtcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBtb2RpZmllckZ1bmN0aW9uc1ttXShuZXdEb2MsIGssIHVwZGF0ZVF1ZXJ5W21dW2tdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gQ2hlY2sgcmVzdWx0IGlzIHZhbGlkIGFuZCByZXR1cm4gaXRcbiAgY2hlY2tPYmplY3QobmV3RG9jKTtcblxuICBpZiAob2JqLl9pZCAhPT0gbmV3RG9jLl9pZCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2FuJ3QgY2hhbmdlIGEgZG9jdW1lbnQncyBfaWRcIik7IH1cbiAgcmV0dXJuIG5ld0RvYztcbn07XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZpbmRpbmcgZG9jdW1lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIEdldCBhIHZhbHVlIGZyb20gb2JqZWN0IHdpdGggZG90IG5vdGF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqL1xuZnVuY3Rpb24gZ2V0RG90VmFsdWUgKG9iaiwgZmllbGQpIHtcbiAgdmFyIGZpZWxkUGFydHMgPSB0eXBlb2YgZmllbGQgPT09ICdzdHJpbmcnID8gZmllbGQuc3BsaXQoJy4nKSA6IGZpZWxkXG4gICAgLCBpLCBvYmpzO1xuXG4gIGlmICghb2JqKSB7IHJldHVybiB1bmRlZmluZWQ7IH0gICAvLyBmaWVsZCBjYW5ub3QgYmUgZW1wdHkgc28gdGhhdCBtZWFucyB3ZSBzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBzbyB0aGF0IG5vdGhpbmcgY2FuIG1hdGNoXG5cbiAgaWYgKGZpZWxkUGFydHMubGVuZ3RoID09PSAwKSB7IHJldHVybiBvYmo7IH1cblxuICBpZiAoZmllbGRQYXJ0cy5sZW5ndGggPT09IDEpIHsgcmV0dXJuIG9ialtmaWVsZFBhcnRzWzBdXTsgfVxuXG4gIGlmICh1dGlsLmlzQXJyYXkob2JqW2ZpZWxkUGFydHNbMF1dKSkge1xuICAgIC8vIElmIHRoZSBuZXh0IGZpZWxkIGlzIGFuIGludGVnZXIsIHJldHVybiBvbmx5IHRoaXMgaXRlbSBvZiB0aGUgYXJyYXlcbiAgICBpID0gcGFyc2VJbnQoZmllbGRQYXJ0c1sxXSwgMTApO1xuICAgIGlmICh0eXBlb2YgaSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKGkpKSB7XG4gICAgICByZXR1cm4gZ2V0RG90VmFsdWUob2JqW2ZpZWxkUGFydHNbMF1dW2ldLCBmaWVsZFBhcnRzLnNsaWNlKDIpKVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgYXJyYXkgb2YgdmFsdWVzXG4gICAgb2JqcyA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBvYmpbZmllbGRQYXJ0c1swXV0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICBvYmpzLnB1c2goZ2V0RG90VmFsdWUob2JqW2ZpZWxkUGFydHNbMF1dW2ldLCBmaWVsZFBhcnRzLnNsaWNlKDEpKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmpzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZXREb3RWYWx1ZShvYmpbZmllbGRQYXJ0c1swXV0sIGZpZWxkUGFydHMuc2xpY2UoMSkpO1xuICB9XG59XG5cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyICd0aGluZ3MnIGFyZSBlcXVhbFxuICogVGhpbmdzIGFyZSBkZWZpbmVkIGFzIGFueSBuYXRpdmUgdHlwZXMgKHN0cmluZywgbnVtYmVyLCBib29sZWFuLCBudWxsLCBkYXRlKSBhbmQgb2JqZWN0c1xuICogSW4gdGhlIGNhc2Ugb2Ygb2JqZWN0LCB3ZSBjaGVjayBkZWVwIGVxdWFsaXR5XG4gKiBSZXR1cm5zIHRydWUgaWYgdGhleSBhcmUsIGZhbHNlIG90aGVyd2lzZVxuICovXG5mdW5jdGlvbiBhcmVUaGluZ3NFcXVhbCAoYSwgYikge1xuICB2YXIgYUtleXMgLCBiS2V5cyAsIGk7XG5cbiAgLy8gU3RyaW5ncywgYm9vbGVhbnMsIG51bWJlcnMsIG51bGxcbiAgaWYgKGEgPT09IG51bGwgfHwgdHlwZW9mIGEgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBhID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIGEgPT09ICdudW1iZXInIHx8XG4gICAgICBiID09PSBudWxsIHx8IHR5cGVvZiBiID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgYiA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBiID09PSAnbnVtYmVyJykgeyByZXR1cm4gYSA9PT0gYjsgfVxuXG4gIC8vIERhdGVzXG4gIGlmICh1dGlsLmlzRGF0ZShhKSB8fCB1dGlsLmlzRGF0ZShiKSkgeyByZXR1cm4gdXRpbC5pc0RhdGUoYSkgJiYgdXRpbC5pc0RhdGUoYikgJiYgYS5nZXRUaW1lKCkgPT09IGIuZ2V0VGltZSgpOyB9XG5cbiAgLy8gQXJyYXlzIChubyBtYXRjaCBzaW5jZSBhcnJheXMgYXJlIHVzZWQgYXMgYSAkaW4pXG4gIC8vIHVuZGVmaW5lZCAobm8gbWF0Y2ggc2luY2UgdGhleSBtZWFuIGZpZWxkIGRvZXNuJ3QgZXhpc3QgYW5kIGNhbid0IGJlIHNlcmlhbGl6ZWQpXG4gIGlmICgoISh1dGlsLmlzQXJyYXkoYSkgJiYgdXRpbC5pc0FycmF5KGIpKSAmJiAodXRpbC5pc0FycmF5KGEpIHx8IHV0aWwuaXNBcnJheShiKSkpIHx8IGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLy8gR2VuZXJhbCBvYmplY3RzIChjaGVjayBmb3IgZGVlcCBlcXVhbGl0eSlcbiAgLy8gYSBhbmQgYiBzaG91bGQgYmUgb2JqZWN0cyBhdCB0aGlzIHBvaW50XG4gIHRyeSB7XG4gICAgYUtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGFLZXlzLmxlbmd0aCAhPT0gYktleXMubGVuZ3RoKSB7IHJldHVybiBmYWxzZTsgfVxuICBmb3IgKGkgPSAwOyBpIDwgYUtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoYktleXMuaW5kZXhPZihhS2V5c1tpXSkgPT09IC0xKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIGlmICghYXJlVGhpbmdzRXF1YWwoYVthS2V5c1tpXV0sIGJbYUtleXNbaV1dKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuXG4vKipcbiAqIENoZWNrIHRoYXQgdHdvIHZhbHVlcyBhcmUgY29tcGFyYWJsZVxuICovXG5mdW5jdGlvbiBhcmVDb21wYXJhYmxlIChhLCBiKSB7XG4gIGlmICh0eXBlb2YgYSAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIGEgIT09ICdudW1iZXInICYmICF1dGlsLmlzRGF0ZShhKSAmJlxuICAgICAgdHlwZW9mIGIgIT09ICdzdHJpbmcnICYmIHR5cGVvZiBiICE9PSAnbnVtYmVyJyAmJiAhdXRpbC5pc0RhdGUoYikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodHlwZW9mIGEgIT09IHR5cGVvZiBiKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5cbi8qKlxuICogQXJpdGhtZXRpYyBhbmQgY29tcGFyaXNvbiBvcGVyYXRvcnNcbiAqIEBwYXJhbSB7TmF0aXZlIHZhbHVlfSBhIFZhbHVlIGluIHRoZSBvYmplY3RcbiAqIEBwYXJhbSB7TmF0aXZlIHZhbHVlfSBiIFZhbHVlIGluIHRoZSBxdWVyeVxuICovXG5jb21wYXJpc29uRnVuY3Rpb25zLiRsdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBhcmVDb21wYXJhYmxlKGEsIGIpICYmIGEgPCBiO1xufTtcblxuY29tcGFyaXNvbkZ1bmN0aW9ucy4kbHRlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIGFyZUNvbXBhcmFibGUoYSwgYikgJiYgYSA8PSBiO1xufTtcblxuY29tcGFyaXNvbkZ1bmN0aW9ucy4kZ3QgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gYXJlQ29tcGFyYWJsZShhLCBiKSAmJiBhID4gYjtcbn07XG5cbmNvbXBhcmlzb25GdW5jdGlvbnMuJGd0ZSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiBhcmVDb21wYXJhYmxlKGEsIGIpICYmIGEgPj0gYjtcbn07XG5cbmNvbXBhcmlzb25GdW5jdGlvbnMuJG5lID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgaWYgKGEgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdHJ1ZTsgfVxuICByZXR1cm4gIWFyZVRoaW5nc0VxdWFsKGEsIGIpO1xufTtcblxuY29tcGFyaXNvbkZ1bmN0aW9ucy4kaW4gPSBmdW5jdGlvbiAoYSwgYikge1xuICB2YXIgaTtcblxuICBpZiAoIXV0aWwuaXNBcnJheShiKSkgeyB0aHJvdyBuZXcgRXJyb3IoXCIkaW4gb3BlcmF0b3IgY2FsbGVkIHdpdGggYSBub24tYXJyYXlcIik7IH1cblxuICBmb3IgKGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChhcmVUaGluZ3NFcXVhbChhLCBiW2ldKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29tcGFyaXNvbkZ1bmN0aW9ucy4kbmluID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgaWYgKCF1dGlsLmlzQXJyYXkoYikpIHsgdGhyb3cgbmV3IEVycm9yKFwiJG5pbiBvcGVyYXRvciBjYWxsZWQgd2l0aCBhIG5vbi1hcnJheVwiKTsgfVxuXG4gIHJldHVybiAhY29tcGFyaXNvbkZ1bmN0aW9ucy4kaW4oYSwgYik7XG59O1xuXG5jb21wYXJpc29uRnVuY3Rpb25zLiRyZWdleCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIGlmICghdXRpbC5pc1JlZ0V4cChiKSkgeyB0aHJvdyBuZXcgRXJyb3IoXCIkcmVnZXggb3BlcmF0b3IgY2FsbGVkIHdpdGggbm9uIHJlZ3VsYXIgZXhwcmVzc2lvblwiKTsgfVxuXG4gIGlmICh0eXBlb2YgYSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYi50ZXN0KGEpO1xuICB9XG59O1xuXG5jb21wYXJpc29uRnVuY3Rpb25zLiRleGlzdHMgPSBmdW5jdGlvbiAodmFsdWUsIGV4aXN0cykge1xuICBpZiAoZXhpc3RzIHx8IGV4aXN0cyA9PT0gJycpIHsgICAvLyBUaGlzIHdpbGwgYmUgdHJ1ZSBmb3IgYWxsIHZhbHVlcyBvZiBleGlzdHMgZXhjZXB0IGZhbHNlLCBudWxsLCB1bmRlZmluZWQgYW5kIDBcbiAgICBleGlzdHMgPSB0cnVlOyAgICAgICAgICAgICAgICAgLy8gVGhhdCdzIHN0cmFuZ2UgYmVoYXZpb3VyICh3ZSBzaG91bGQgb25seSB1c2UgdHJ1ZS9mYWxzZSkgYnV0IHRoYXQncyB0aGUgd2F5IE1vbmdvIGRvZXMgaXQuLi5cbiAgfSBlbHNlIHtcbiAgICBleGlzdHMgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICFleGlzdHNcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXhpc3RzO1xuICB9XG59O1xuXG4vLyBTcGVjaWZpYyB0byBhcnJheXNcbmNvbXBhcmlzb25GdW5jdGlvbnMuJHNpemUgPSBmdW5jdGlvbiAob2JqLCB2YWx1ZSkge1xuICAgIGlmICghdXRpbC5pc0FycmF5KG9iaikpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHZhbHVlICUgMSAhPT0gMCkgeyB0aHJvdyBuZXcgRXJyb3IoXCIkc2l6ZSBvcGVyYXRvciBjYWxsZWQgd2l0aG91dCBhbiBpbnRlZ2VyXCIpOyB9XG5cbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT0gdmFsdWUpO1xufTtcbmNvbXBhcmlzb25GdW5jdGlvbnMuJGVsZW1NYXRjaCA9IGZ1bmN0aW9uIChvYmosIHZhbHVlKSB7XG4gIGlmICghdXRpbC5pc0FycmF5KG9iaikpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIHZhciBpID0gb2JqLmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IGZhbHNlOyAgIC8vIEluaXRpYWxpemUgcmVzdWx0XG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAobWF0Y2gob2JqW2ldLCB2YWx1ZSkpIHsgICAvLyBJZiBtYXRjaCBmb3IgYXJyYXkgZWxlbWVudCwgcmV0dXJuIHRydWVcbiAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5hcnJheUNvbXBhcmlzb25GdW5jdGlvbnMuJHNpemUgPSB0cnVlO1xuYXJyYXlDb21wYXJpc29uRnVuY3Rpb25zLiRlbGVtTWF0Y2ggPSB0cnVlO1xuXG5cbi8qKlxuICogTWF0Y2ggYW55IG9mIHRoZSBzdWJxdWVyaWVzXG4gKiBAcGFyYW0ge01vZGVsfSBvYmpcbiAqIEBwYXJhbSB7QXJyYXkgb2YgUXVlcmllc30gcXVlcnlcbiAqL1xubG9naWNhbE9wZXJhdG9ycy4kb3IgPSBmdW5jdGlvbiAob2JqLCBxdWVyeSkge1xuICB2YXIgaTtcblxuICBpZiAoIXV0aWwuaXNBcnJheShxdWVyeSkpIHsgdGhyb3cgbmV3IEVycm9yKFwiJG9yIG9wZXJhdG9yIHVzZWQgd2l0aG91dCBhbiBhcnJheVwiKTsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBxdWVyeS5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChtYXRjaChvYmosIHF1ZXJ5W2ldKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIE1hdGNoIGFsbCBvZiB0aGUgc3VicXVlcmllc1xuICogQHBhcmFtIHtNb2RlbH0gb2JqXG4gKiBAcGFyYW0ge0FycmF5IG9mIFF1ZXJpZXN9IHF1ZXJ5XG4gKi9cbmxvZ2ljYWxPcGVyYXRvcnMuJGFuZCA9IGZ1bmN0aW9uIChvYmosIHF1ZXJ5KSB7XG4gIHZhciBpO1xuXG4gIGlmICghdXRpbC5pc0FycmF5KHF1ZXJ5KSkgeyB0aHJvdyBuZXcgRXJyb3IoXCIkYW5kIG9wZXJhdG9yIHVzZWQgd2l0aG91dCBhbiBhcnJheVwiKTsgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBxdWVyeS5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmICghbWF0Y2gob2JqLCBxdWVyeVtpXSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBJbnZlcnRlZCBtYXRjaCBvZiB0aGUgcXVlcnlcbiAqIEBwYXJhbSB7TW9kZWx9IG9ialxuICogQHBhcmFtIHtRdWVyeX0gcXVlcnlcbiAqL1xubG9naWNhbE9wZXJhdG9ycy4kbm90ID0gZnVuY3Rpb24gKG9iaiwgcXVlcnkpIHtcbiAgcmV0dXJuICFtYXRjaChvYmosIHF1ZXJ5KTtcbn07XG5cblxuLyoqXG4gKiBVc2UgYSBmdW5jdGlvbiB0byBtYXRjaFxuICogQHBhcmFtIHtNb2RlbH0gb2JqXG4gKiBAcGFyYW0ge1F1ZXJ5fSBxdWVyeVxuICovXG5sb2dpY2FsT3BlcmF0b3JzLiR3aGVyZSA9IGZ1bmN0aW9uIChvYmosIGZuKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKCFfLmlzRnVuY3Rpb24oZm4pKSB7IHRocm93IG5ldyBFcnJvcihcIiR3aGVyZSBvcGVyYXRvciB1c2VkIHdpdGhvdXQgYSBmdW5jdGlvblwiKTsgfVxuXG4gIHJlc3VsdCA9IGZuLmNhbGwob2JqKTtcbiAgaWYgKCFfLmlzQm9vbGVhbihyZXN1bHQpKSB7IHRocm93IG5ldyBFcnJvcihcIiR3aGVyZSBmdW5jdGlvbiBtdXN0IHJldHVybiBib29sZWFuXCIpOyB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuLyoqXG4gKiBUZWxsIGlmIGEgZ2l2ZW4gZG9jdW1lbnQgbWF0Y2hlcyBhIHF1ZXJ5XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIERvY3VtZW50IHRvIGNoZWNrXG4gKiBAcGFyYW0ge09iamVjdH0gcXVlcnlcbiAqL1xuZnVuY3Rpb24gbWF0Y2ggKG9iaiwgcXVlcnkpIHtcbiAgdmFyIHF1ZXJ5S2V5cywgcXVlcnlLZXksIHF1ZXJ5VmFsdWUsIGk7XG5cbiAgLy8gUHJpbWl0aXZlIHF1ZXJ5IGFnYWluc3QgYSBwcmltaXRpdmUgdHlwZVxuICAvLyBUaGlzIGlzIGEgYml0IG9mIGEgaGFjayBzaW5jZSB3ZSBjb25zdHJ1Y3QgYW4gb2JqZWN0IHdpdGggYW4gYXJiaXRyYXJ5IGtleSBvbmx5IHRvIGRlcmVmZXJlbmNlIGl0IGxhdGVyXG4gIC8vIEJ1dCBJIGRvbid0IGhhdmUgdGltZSBmb3IgYSBjbGVhbmVyIGltcGxlbWVudGF0aW9uIG5vd1xuICBpZiAoaXNQcmltaXRpdmVUeXBlKG9iaikgfHwgaXNQcmltaXRpdmVUeXBlKHF1ZXJ5KSkge1xuICAgIHJldHVybiBtYXRjaFF1ZXJ5UGFydCh7IG5lZWRBS2V5OiBvYmogfSwgJ25lZWRBS2V5JywgcXVlcnkpO1xuICB9XG5cbiAgLy8gTm9ybWFsIHF1ZXJ5XG4gIHF1ZXJ5S2V5cyA9IE9iamVjdC5rZXlzKHF1ZXJ5KTtcbiAgZm9yIChpID0gMDsgaSA8IHF1ZXJ5S2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIHF1ZXJ5S2V5ID0gcXVlcnlLZXlzW2ldO1xuICAgIHF1ZXJ5VmFsdWUgPSBxdWVyeVtxdWVyeUtleV07XG5cbiAgICBpZiAocXVlcnlLZXlbMF0gPT09ICckJykge1xuICAgICAgaWYgKCFsb2dpY2FsT3BlcmF0b3JzW3F1ZXJ5S2V5XSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGxvZ2ljYWwgb3BlcmF0b3IgXCIgKyBxdWVyeUtleSk7IH1cbiAgICAgIGlmICghbG9naWNhbE9wZXJhdG9yc1txdWVyeUtleV0ob2JqLCBxdWVyeVZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXRjaFF1ZXJ5UGFydChvYmosIHF1ZXJ5S2V5LCBxdWVyeVZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBNYXRjaCBhbiBvYmplY3QgYWdhaW5zdCBhIHNwZWNpZmljIHsga2V5OiB2YWx1ZSB9IHBhcnQgb2YgYSBxdWVyeVxuICogaWYgdGhlIHRyZWF0T2JqQXNWYWx1ZSBmbGFnIGlzIHNldCwgZG9uJ3QgdHJ5IHRvIG1hdGNoIGV2ZXJ5IHBhcnQgc2VwYXJhdGVseSwgYnV0IHRoZSBhcnJheSBhcyBhIHdob2xlXG4gKi9cbmZ1bmN0aW9uIG1hdGNoUXVlcnlQYXJ0IChvYmosIHF1ZXJ5S2V5LCBxdWVyeVZhbHVlLCB0cmVhdE9iakFzVmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gZ2V0RG90VmFsdWUob2JqLCBxdWVyeUtleSlcbiAgICAsIGksIGtleXMsIGZpcnN0Q2hhcnMsIGRvbGxhckZpcnN0Q2hhcnM7XG5cbiAgLy8gQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIGFuIGFycmF5IGlmIHdlIGRvbid0IGZvcmNlIGEgdHJlYXRtZW50IGFzIHZhbHVlXG4gIGlmICh1dGlsLmlzQXJyYXkob2JqVmFsdWUpICYmICF0cmVhdE9iakFzVmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgcXVlcnlWYWx1ZSBpcyBhbiBhcnJheSwgdHJ5IHRvIHBlcmZvcm0gYW4gZXhhY3QgbWF0Y2hcbiAgICBpZiAodXRpbC5pc0FycmF5KHF1ZXJ5VmFsdWUpKSB7XG4gICAgICByZXR1cm4gbWF0Y2hRdWVyeVBhcnQob2JqLCBxdWVyeUtleSwgcXVlcnlWYWx1ZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgd2UgYXJlIHVzaW5nIGFuIGFycmF5LXNwZWNpZmljIGNvbXBhcmlzb24gZnVuY3Rpb25cbiAgICBpZiAocXVlcnlWYWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgcXVlcnlWYWx1ZSA9PT0gJ29iamVjdCcgJiYgIXV0aWwuaXNSZWdFeHAocXVlcnlWYWx1ZSkpIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhxdWVyeVZhbHVlKTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChhcnJheUNvbXBhcmlzb25GdW5jdGlvbnNba2V5c1tpXV0pIHsgcmV0dXJuIG1hdGNoUXVlcnlQYXJ0KG9iaiwgcXVlcnlLZXksIHF1ZXJ5VmFsdWUsIHRydWUpOyB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbm90LCB0cmVhdCBpdCBhcyBhbiBhcnJheSBvZiB7IG9iaiwgcXVlcnkgfSB3aGVyZSB0aGVyZSBuZWVkcyB0byBiZSBhdCBsZWFzdCBvbmUgbWF0Y2hcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqVmFsdWUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChtYXRjaFF1ZXJ5UGFydCh7IGs6IG9ialZhbHVlW2ldIH0sICdrJywgcXVlcnlWYWx1ZSkpIHsgcmV0dXJuIHRydWU7IH0gICAvLyBrIGhlcmUgY291bGQgYmUgYW55IHN0cmluZ1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBxdWVyeVZhbHVlIGlzIGFuIGFjdHVhbCBvYmplY3QuIERldGVybWluZSB3aGV0aGVyIGl0IGNvbnRhaW5zIGNvbXBhcmlzb24gb3BlcmF0b3JzXG4gIC8vIG9yIG9ubHkgbm9ybWFsIGZpZWxkcy4gTWl4ZWQgb2JqZWN0cyBhcmUgbm90IGFsbG93ZWRcbiAgaWYgKHF1ZXJ5VmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHF1ZXJ5VmFsdWUgPT09ICdvYmplY3QnICYmICF1dGlsLmlzUmVnRXhwKHF1ZXJ5VmFsdWUpICYmICF1dGlsLmlzQXJyYXkocXVlcnlWYWx1ZSkpIHtcbiAgICBrZXlzID0gT2JqZWN0LmtleXMocXVlcnlWYWx1ZSk7XG4gICAgZmlyc3RDaGFycyA9IF8ubWFwKGtleXMsIGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtWzBdOyB9KTtcbiAgICBkb2xsYXJGaXJzdENoYXJzID0gXy5maWx0ZXIoZmlyc3RDaGFycywgZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMgPT09ICckJzsgfSk7XG5cbiAgICBpZiAoZG9sbGFyRmlyc3RDaGFycy5sZW5ndGggIT09IDAgJiYgZG9sbGFyRmlyc3RDaGFycy5sZW5ndGggIT09IGZpcnN0Q2hhcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgY2Fubm90IG1peCBvcGVyYXRvcnMgYW5kIG5vcm1hbCBmaWVsZHNcIik7XG4gICAgfVxuXG4gICAgLy8gcXVlcnlWYWx1ZSBpcyBhbiBvYmplY3Qgb2YgdGhpcyBmb3JtOiB7ICRjb21wYXJpc29uT3BlcmF0b3IxOiB2YWx1ZTEsIC4uLiB9XG4gICAgaWYgKGRvbGxhckZpcnN0Q2hhcnMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKCFjb21wYXJpc29uRnVuY3Rpb25zW2tleXNbaV1dKSB7IHRocm93IG5ldyBFcnJvcihcIlVua25vd24gY29tcGFyaXNvbiBmdW5jdGlvbiBcIiArIGtleXNbaV0pOyB9XG5cbiAgICAgICAgaWYgKCFjb21wYXJpc29uRnVuY3Rpb25zW2tleXNbaV1dKG9ialZhbHVlLCBxdWVyeVZhbHVlW2tleXNbaV1dKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFVzaW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMgd2l0aCBiYXNpYyBxdWVyeWluZ1xuICBpZiAodXRpbC5pc1JlZ0V4cChxdWVyeVZhbHVlKSkgeyByZXR1cm4gY29tcGFyaXNvbkZ1bmN0aW9ucy4kcmVnZXgob2JqVmFsdWUsIHF1ZXJ5VmFsdWUpOyB9XG5cbiAgLy8gcXVlcnlWYWx1ZSBpcyBlaXRoZXIgYSBuYXRpdmUgdmFsdWUgb3IgYSBub3JtYWwgb2JqZWN0XG4gIC8vIEJhc2ljIG1hdGNoaW5nIGlzIHBvc3NpYmxlXG4gIGlmICghYXJlVGhpbmdzRXF1YWwob2JqVmFsdWUsIHF1ZXJ5VmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5cbi8vIEludGVyZmFjZVxubW9kdWxlLmV4cG9ydHMuc2VyaWFsaXplID0gc2VyaWFsaXplO1xubW9kdWxlLmV4cG9ydHMuZGVzZXJpYWxpemUgPSBkZXNlcmlhbGl6ZTtcbm1vZHVsZS5leHBvcnRzLmRlZXBDb3B5ID0gZGVlcENvcHk7XG5tb2R1bGUuZXhwb3J0cy5jaGVja09iamVjdCA9IGNoZWNrT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMuaXNQcmltaXRpdmVUeXBlID0gaXNQcmltaXRpdmVUeXBlO1xubW9kdWxlLmV4cG9ydHMubW9kaWZ5ID0gbW9kaWZ5O1xubW9kdWxlLmV4cG9ydHMuZ2V0RG90VmFsdWUgPSBnZXREb3RWYWx1ZTtcbm1vZHVsZS5leHBvcnRzLm1hdGNoID0gbWF0Y2g7XG5tb2R1bGUuZXhwb3J0cy5hcmVUaGluZ3NFcXVhbCA9IGFyZVRoaW5nc0VxdWFsO1xubW9kdWxlLmV4cG9ydHMuY29tcGFyZVRoaW5ncyA9IGNvbXBhcmVUaGluZ3M7XG4iLCIvKipcbiAqIEhhbmRsZSBldmVyeSBwZXJzaXN0ZW5jZS1yZWxhdGVkIHRhc2tcbiAqIFRoZSBpbnRlcmZhY2UgRGF0YXN0b3JlIGV4cGVjdHMgdG8gYmUgaW1wbGVtZW50ZWQgaXNcbiAqICogUGVyc2lzdGVuY2UubG9hZERhdGFiYXNlKGNhbGxiYWNrKSBhbmQgY2FsbGJhY2sgaGFzIHNpZ25hdHVyZSBlcnJcbiAqICogUGVyc2lzdGVuY2UucGVyc2lzdE5ld1N0YXRlKG5ld0RvY3MsIGNhbGxiYWNrKSB3aGVyZSBuZXdEb2NzIGlzIGFuIGFycmF5IG9mIGRvY3VtZW50cyBhbmQgY2FsbGJhY2sgaGFzIHNpZ25hdHVyZSBlcnJcbiAqL1xuXG52YXIgc3RvcmFnZSA9IHJlcXVpcmUoJy4vc3RvcmFnZScpXG4gICwgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAsIG1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpXG4gICwgYXN5bmMgPSByZXF1aXJlKCdhc3luYycpXG4gICwgY3VzdG9tVXRpbHMgPSByZXF1aXJlKCcuL2N1c3RvbVV0aWxzJylcbiAgLCBJbmRleCA9IHJlcXVpcmUoJy4vaW5kZXhlcycpXG4gIDtcblxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBQZXJzaXN0ZW5jZSBvYmplY3QgZm9yIGRhdGFiYXNlIG9wdGlvbnMuZGJcbiAqIEBwYXJhbSB7RGF0YXN0b3JlfSBvcHRpb25zLmRiXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMubm9kZVdlYmtpdEFwcE5hbWUgT3B0aW9uYWwsIHNwZWNpZnkgdGhlIG5hbWUgb2YgeW91ciBOVyBhcHAgaWYgeW91IHdhbnQgb3B0aW9ucy5maWxlbmFtZSB0byBiZSByZWxhdGl2ZSB0byB0aGUgZGlyZWN0b3J5IHdoZXJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm9kZSBXZWJraXQgc3RvcmVzIGFwcGxpY2F0aW9uIGRhdGEgc3VjaCBhcyBjb29raWVzIGFuZCBsb2NhbCBzdG9yYWdlICh0aGUgYmVzdCBwbGFjZSB0byBzdG9yZSBkYXRhIGluIG15IG9waW5pb24pXG4gKi9cbmZ1bmN0aW9uIFBlcnNpc3RlbmNlIChvcHRpb25zKSB7XG4gIHZhciBpLCBqLCByYW5kb21TdHJpbmc7XG5cbiAgdGhpcy5kYiA9IG9wdGlvbnMuZGI7XG4gIHRoaXMuaW5NZW1vcnlPbmx5ID0gdGhpcy5kYi5pbk1lbW9yeU9ubHk7XG4gIHRoaXMuZmlsZW5hbWUgPSB0aGlzLmRiLmZpbGVuYW1lO1xuICB0aGlzLmNvcnJ1cHRBbGVydFRocmVzaG9sZCA9IG9wdGlvbnMuY29ycnVwdEFsZXJ0VGhyZXNob2xkICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmNvcnJ1cHRBbGVydFRocmVzaG9sZCA6IDAuMTtcblxuICBpZiAoIXRoaXMuaW5NZW1vcnlPbmx5ICYmIHRoaXMuZmlsZW5hbWUgJiYgdGhpcy5maWxlbmFtZS5jaGFyQXQodGhpcy5maWxlbmFtZS5sZW5ndGggLSAxKSA9PT0gJ34nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGRhdGFmaWxlIG5hbWUgY2FuJ3QgZW5kIHdpdGggYSB+LCB3aGljaCBpcyByZXNlcnZlZCBmb3IgY3Jhc2ggc2FmZSBiYWNrdXAgZmlsZXNcIik7XG4gIH1cblxuICAvLyBBZnRlciBzZXJpYWxpemF0aW9uIGFuZCBiZWZvcmUgZGVzZXJpYWxpemF0aW9uIGhvb2tzIHdpdGggc29tZSBiYXNpYyBzYW5pdHkgY2hlY2tzXG4gIGlmIChvcHRpb25zLmFmdGVyU2VyaWFsaXphdGlvbiAmJiAhb3B0aW9ucy5iZWZvcmVEZXNlcmlhbGl6YXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXJpYWxpemF0aW9uIGhvb2sgZGVmaW5lZCBidXQgZGVzZXJpYWxpemF0aW9uIGhvb2sgdW5kZWZpbmVkLCBjYXV0aW91c2x5IHJlZnVzaW5nIHRvIHN0YXJ0IE5lREIgdG8gcHJldmVudCBkYXRhbG9zc1wiKTtcbiAgfVxuICBpZiAoIW9wdGlvbnMuYWZ0ZXJTZXJpYWxpemF0aW9uICYmIG9wdGlvbnMuYmVmb3JlRGVzZXJpYWxpemF0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiU2VyaWFsaXphdGlvbiBob29rIHVuZGVmaW5lZCBidXQgZGVzZXJpYWxpemF0aW9uIGhvb2sgZGVmaW5lZCwgY2F1dGlvdXNseSByZWZ1c2luZyB0byBzdGFydCBOZURCIHRvIHByZXZlbnQgZGF0YWxvc3NcIik7XG4gIH1cbiAgdGhpcy5hZnRlclNlcmlhbGl6YXRpb24gPSBvcHRpb25zLmFmdGVyU2VyaWFsaXphdGlvbiB8fCBmdW5jdGlvbiAocykgeyByZXR1cm4gczsgfTtcbiAgdGhpcy5iZWZvcmVEZXNlcmlhbGl6YXRpb24gPSBvcHRpb25zLmJlZm9yZURlc2VyaWFsaXphdGlvbiB8fCBmdW5jdGlvbiAocykgeyByZXR1cm4gczsgfTtcbiAgZm9yIChpID0gMTsgaSA8IDMwOyBpICs9IDEpIHtcbiAgICBmb3IgKGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgcmFuZG9tU3RyaW5nID0gY3VzdG9tVXRpbHMudWlkKGkpO1xuICAgICAgaWYgKHRoaXMuYmVmb3JlRGVzZXJpYWxpemF0aW9uKHRoaXMuYWZ0ZXJTZXJpYWxpemF0aW9uKHJhbmRvbVN0cmluZykpICE9PSByYW5kb21TdHJpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYmVmb3JlRGVzZXJpYWxpemF0aW9uIGlzIG5vdCB0aGUgcmV2ZXJzZSBvZiBhZnRlclNlcmlhbGl6YXRpb24sIGNhdXRpb3VzbHkgcmVmdXNpbmcgdG8gc3RhcnQgTmVEQiB0byBwcmV2ZW50IGRhdGFsb3NzXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEZvciBOVyBhcHBzLCBzdG9yZSBkYXRhIGluIHRoZSBzYW1lIGRpcmVjdG9yeSB3aGVyZSBOVyBzdG9yZXMgYXBwbGljYXRpb24gZGF0YVxuICBpZiAodGhpcy5maWxlbmFtZSAmJiBvcHRpb25zLm5vZGVXZWJraXRBcHBOYW1lKSB7XG4gICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cIik7XG4gICAgY29uc29sZS5sb2coXCJXQVJOSU5HOiBUaGUgbm9kZVdlYmtpdEFwcE5hbWUgb3B0aW9uIGlzIGRlcHJlY2F0ZWRcIik7XG4gICAgY29uc29sZS5sb2coXCJUbyBnZXQgdGhlIHBhdGggdG8gdGhlIGRpcmVjdG9yeSB3aGVyZSBOb2RlIFdlYmtpdCBzdG9yZXMgdGhlIGRhdGFcIik7XG4gICAgY29uc29sZS5sb2coXCJmb3IgeW91ciBhcHAsIHVzZSB0aGUgaW50ZXJuYWwgbncuZ3VpIG1vZHVsZSBsaWtlIHRoaXNcIik7XG4gICAgY29uc29sZS5sb2coXCJyZXF1aXJlKCdudy5ndWknKS5BcHAuZGF0YVBhdGhcIik7XG4gICAgY29uc29sZS5sb2coXCJTZWUgaHR0cHM6Ly9naXRodWIuY29tL3JvZ2Vyd2FuZy9ub2RlLXdlYmtpdC9pc3N1ZXMvNTAwXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XCIpO1xuICAgIHRoaXMuZmlsZW5hbWUgPSBQZXJzaXN0ZW5jZS5nZXROV0FwcEZpbGVuYW1lKG9wdGlvbnMubm9kZVdlYmtpdEFwcE5hbWUsIHRoaXMuZmlsZW5hbWUpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYSBkaXJlY3RvcnkgZXhpc3RzIGFuZCBjcmVhdGUgaXQgb24gdGhlIGZseSBpZiBpdCBpcyBub3QgdGhlIGNhc2VcbiAqIGNiIGlzIG9wdGlvbmFsLCBzaWduYXR1cmU6IGVyclxuICovXG5QZXJzaXN0ZW5jZS5lbnN1cmVEaXJlY3RvcnlFeGlzdHMgPSBmdW5jdGlvbiAoZGlyLCBjYikge1xuICB2YXIgY2FsbGJhY2sgPSBjYiB8fCBmdW5jdGlvbiAoKSB7fVxuICAgIDtcblxuICBzdG9yYWdlLm1rZGlycChkaXIsIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH0pO1xufTtcblxuXG5cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHBhdGggdGhlIGRhdGFmaWxlIGlmIHRoZSBnaXZlbiBmaWxlbmFtZSBpcyByZWxhdGl2ZSB0byB0aGUgZGlyZWN0b3J5IHdoZXJlIE5vZGUgV2Via2l0IHN0b3Jlc1xuICogZGF0YSBmb3IgdGhpcyBhcHBsaWNhdGlvbi4gUHJvYmFibHkgdGhlIGJlc3QgcGxhY2UgdG8gc3RvcmUgZGF0YVxuICovXG5QZXJzaXN0ZW5jZS5nZXROV0FwcEZpbGVuYW1lID0gZnVuY3Rpb24gKGFwcE5hbWUsIHJlbGF0aXZlRmlsZW5hbWUpIHtcbiAgdmFyIGhvbWU7XG5cbiAgc3dpdGNoIChwcm9jZXNzLnBsYXRmb3JtKSB7XG4gICAgY2FzZSAnd2luMzInOlxuICAgIGNhc2UgJ3dpbjY0JzpcbiAgICAgIGhvbWUgPSBwcm9jZXNzLmVudi5MT0NBTEFQUERBVEEgfHwgcHJvY2Vzcy5lbnYuQVBQREFUQTtcbiAgICAgIGlmICghaG9tZSkgeyB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIHRoZSBiYXNlIGFwcGxpY2F0aW9uIGRhdGEgZm9sZGVyXCIpOyB9XG4gICAgICBob21lID0gcGF0aC5qb2luKGhvbWUsIGFwcE5hbWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZGFyd2luJzpcbiAgICAgIGhvbWUgPSBwcm9jZXNzLmVudi5IT01FO1xuICAgICAgaWYgKCFob21lKSB7IHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgdGhlIGJhc2UgYXBwbGljYXRpb24gZGF0YSBkaXJlY3RvcnlcIik7IH1cbiAgICAgIGhvbWUgPSBwYXRoLmpvaW4oaG9tZSwgJ0xpYnJhcnknLCAnQXBwbGljYXRpb24gU3VwcG9ydCcsIGFwcE5hbWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbGludXgnOlxuICAgICAgaG9tZSA9IHByb2Nlc3MuZW52LkhPTUU7XG4gICAgICBpZiAoIWhvbWUpIHsgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCB0aGUgYmFzZSBhcHBsaWNhdGlvbiBkYXRhIGRpcmVjdG9yeVwiKTsgfVxuICAgICAgaG9tZSA9IHBhdGguam9pbihob21lLCAnLmNvbmZpZycsIGFwcE5hbWUpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHVzZSB0aGUgTm9kZSBXZWJraXQgcmVsYXRpdmUgcGF0aCBmb3IgcGxhdGZvcm0gXCIgKyBwcm9jZXNzLnBsYXRmb3JtKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbihob21lLCAnbmVkYi1kYXRhJywgcmVsYXRpdmVGaWxlbmFtZSk7XG59XG5cblxuLyoqXG4gKiBQZXJzaXN0IGNhY2hlZCBkYXRhYmFzZVxuICogVGhpcyBzZXJ2ZXMgYXMgYSBjb21wYWN0aW9uIGZ1bmN0aW9uIHNpbmNlIHRoZSBjYWNoZSBhbHdheXMgY29udGFpbnMgb25seSB0aGUgbnVtYmVyIG9mIGRvY3VtZW50cyBpbiB0aGUgY29sbGVjdGlvblxuICogd2hpbGUgdGhlIGRhdGEgZmlsZSBpcyBhcHBlbmQtb25seSBzbyBpdCBtYXkgZ3JvdyBsYXJnZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IGVyclxuICovXG5QZXJzaXN0ZW5jZS5wcm90b3R5cGUucGVyc2lzdENhY2hlZERhdGFiYXNlID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBjYWxsYmFjayA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgLCB0b1BlcnNpc3QgPSAnJ1xuICAgICwgc2VsZiA9IHRoaXNcbiAgICA7XG5cbiAgaWYgKHRoaXMuaW5NZW1vcnlPbmx5KSB7IHJldHVybiBjYWxsYmFjayhudWxsKTsgfVxuXG4gIHRoaXMuZGIuZ2V0QWxsRGF0YSgpLmZvckVhY2goZnVuY3Rpb24gKGRvYykge1xuICAgIHRvUGVyc2lzdCArPSBzZWxmLmFmdGVyU2VyaWFsaXphdGlvbihtb2RlbC5zZXJpYWxpemUoZG9jKSkgKyAnXFxuJztcbiAgfSk7XG4gIE9iamVjdC5rZXlzKHRoaXMuZGIuaW5kZXhlcykuZm9yRWFjaChmdW5jdGlvbiAoZmllbGROYW1lKSB7XG4gICAgaWYgKGZpZWxkTmFtZSAhPSBcIl9pZFwiKSB7ICAgLy8gVGhlIHNwZWNpYWwgX2lkIGluZGV4IGlzIG1hbmFnZWQgYnkgZGF0YXN0b3JlLmpzLCB0aGUgb3RoZXJzIG5lZWQgdG8gYmUgcGVyc2lzdGVkXG4gICAgICB0b1BlcnNpc3QgKz0gc2VsZi5hZnRlclNlcmlhbGl6YXRpb24obW9kZWwuc2VyaWFsaXplKHsgJCRpbmRleENyZWF0ZWQ6IHsgZmllbGROYW1lOiBmaWVsZE5hbWUsIHVuaXF1ZTogc2VsZi5kYi5pbmRleGVzW2ZpZWxkTmFtZV0udW5pcXVlLCBzcGFyc2U6IHNlbGYuZGIuaW5kZXhlc1tmaWVsZE5hbWVdLnNwYXJzZSB9fSkpICsgJ1xcbic7XG4gICAgfVxuICB9KTtcblxuICBzdG9yYWdlLmNyYXNoU2FmZVdyaXRlRmlsZSh0aGlzLmZpbGVuYW1lLCB0b1BlcnNpc3QsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoZXJyKSB7IHJldHVybiBjYWxsYmFjayhlcnIpOyB9XG4gICAgc2VsZi5kYi5lbWl0KCdjb21wYWN0aW9uLmRvbmUnKTtcbiAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gIH0pO1xufTtcblxuXG4vKipcbiAqIFF1ZXVlIGEgcmV3cml0ZSBvZiB0aGUgZGF0YWZpbGVcbiAqL1xuUGVyc2lzdGVuY2UucHJvdG90eXBlLmNvbXBhY3REYXRhZmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5kYi5leGVjdXRvci5wdXNoKHsgdGhpczogdGhpcywgZm46IHRoaXMucGVyc2lzdENhY2hlZERhdGFiYXNlLCBhcmd1bWVudHM6IFtdIH0pO1xufTtcblxuXG4vKipcbiAqIFNldCBhdXRvbWF0aWMgY29tcGFjdGlvbiBldmVyeSBpbnRlcnZhbCBtc1xuICogQHBhcmFtIHtOdW1iZXJ9IGludGVydmFsIGluIG1pbGxpc2Vjb25kcywgd2l0aCBhbiBlbmZvcmNlZCBtaW5pbXVtIG9mIDUgc2Vjb25kc1xuICovXG5QZXJzaXN0ZW5jZS5wcm90b3R5cGUuc2V0QXV0b2NvbXBhY3Rpb25JbnRlcnZhbCA9IGZ1bmN0aW9uIChpbnRlcnZhbCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIG1pbkludGVydmFsID0gNTAwMFxuICAgICwgcmVhbEludGVydmFsID0gTWF0aC5tYXgoaW50ZXJ2YWwgfHwgMCwgbWluSW50ZXJ2YWwpXG4gICAgO1xuXG4gIHRoaXMuc3RvcEF1dG9jb21wYWN0aW9uKCk7XG5cbiAgdGhpcy5hdXRvY29tcGFjdGlvbkludGVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5jb21wYWN0RGF0YWZpbGUoKTtcbiAgfSwgcmVhbEludGVydmFsKTtcbn07XG5cblxuLyoqXG4gKiBTdG9wIGF1dG9jb21wYWN0aW9uIChkbyBub3RoaW5nIGlmIGF1dG9jb21wYWN0aW9uIHdhcyBub3QgcnVubmluZylcbiAqL1xuUGVyc2lzdGVuY2UucHJvdG90eXBlLnN0b3BBdXRvY29tcGFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYXV0b2NvbXBhY3Rpb25JbnRlcnZhbElkKSB7IGNsZWFySW50ZXJ2YWwodGhpcy5hdXRvY29tcGFjdGlvbkludGVydmFsSWQpOyB9XG59O1xuXG5cbi8qKlxuICogUGVyc2lzdCBuZXcgc3RhdGUgZm9yIHRoZSBnaXZlbiBuZXdEb2NzIChjYW4gYmUgaW5zZXJ0aW9uLCB1cGRhdGUgb3IgcmVtb3ZhbClcbiAqIFVzZSBhbiBhcHBlbmQtb25seSBmb3JtYXRcbiAqIEBwYXJhbSB7QXJyYXl9IG5ld0RvY3MgQ2FuIGJlIGVtcHR5IGlmIG5vIGRvYyB3YXMgdXBkYXRlZC9yZW1vdmVkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiBPcHRpb25hbCwgc2lnbmF0dXJlOiBlcnJcbiAqL1xuUGVyc2lzdGVuY2UucHJvdG90eXBlLnBlcnNpc3ROZXdTdGF0ZSA9IGZ1bmN0aW9uIChuZXdEb2NzLCBjYikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIHRvUGVyc2lzdCA9ICcnXG4gICAgLCBjYWxsYmFjayA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgO1xuXG4gIC8vIEluLW1lbW9yeSBvbmx5IGRhdGFzdG9yZVxuICBpZiAoc2VsZi5pbk1lbW9yeU9ubHkpIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwpOyB9XG5cbiAgbmV3RG9jcy5mb3JFYWNoKGZ1bmN0aW9uIChkb2MpIHtcbiAgICB0b1BlcnNpc3QgKz0gc2VsZi5hZnRlclNlcmlhbGl6YXRpb24obW9kZWwuc2VyaWFsaXplKGRvYykpICsgJ1xcbic7XG4gIH0pO1xuXG4gIGlmICh0b1BlcnNpc3QubGVuZ3RoID09PSAwKSB7IHJldHVybiBjYWxsYmFjayhudWxsKTsgfVxuXG4gIHN0b3JhZ2UuYXBwZW5kRmlsZShzZWxmLmZpbGVuYW1lLCB0b1BlcnNpc3QsICd1dGY4JywgZnVuY3Rpb24gKGVycikge1xuICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBGcm9tIGEgZGF0YWJhc2UncyByYXcgZGF0YSwgcmV0dXJuIHRoZSBjb3JyZXNwb25kaW5nXG4gKiBtYWNoaW5lIHVuZGVyc3RhbmRhYmxlIGNvbGxlY3Rpb25cbiAqL1xuUGVyc2lzdGVuY2UucHJvdG90eXBlLnRyZWF0UmF3RGF0YSA9IGZ1bmN0aW9uIChyYXdEYXRhKSB7XG4gIHZhciBkYXRhID0gcmF3RGF0YS5zcGxpdCgnXFxuJylcbiAgICAsIGRhdGFCeUlkID0ge31cbiAgICAsIHRkYXRhID0gW11cbiAgICAsIGlcbiAgICAsIGluZGV4ZXMgPSB7fVxuICAgICwgY29ycnVwdEl0ZW1zID0gLTEgICAvLyBMYXN0IGxpbmUgb2YgZXZlcnkgZGF0YSBmaWxlIGlzIHVzdWFsbHkgYmxhbmsgc28gbm90IHJlYWxseSBjb3JydXB0XG4gICAgO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgdmFyIGRvYztcblxuICAgIHRyeSB7XG4gICAgICBkb2MgPSBtb2RlbC5kZXNlcmlhbGl6ZSh0aGlzLmJlZm9yZURlc2VyaWFsaXphdGlvbihkYXRhW2ldKSk7XG4gICAgICBpZiAoZG9jLl9pZCkge1xuICAgICAgICBpZiAoZG9jLiQkZGVsZXRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGRlbGV0ZSBkYXRhQnlJZFtkb2MuX2lkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhQnlJZFtkb2MuX2lkXSA9IGRvYztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkb2MuJCRpbmRleENyZWF0ZWQgJiYgZG9jLiQkaW5kZXhDcmVhdGVkLmZpZWxkTmFtZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaW5kZXhlc1tkb2MuJCRpbmRleENyZWF0ZWQuZmllbGROYW1lXSA9IGRvYy4kJGluZGV4Q3JlYXRlZDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvYy4kJGluZGV4UmVtb3ZlZCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBkZWxldGUgaW5kZXhlc1tkb2MuJCRpbmRleFJlbW92ZWRdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvcnJ1cHRJdGVtcyArPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8vIEEgYml0IGxlbmllbnQgb24gY29ycnVwdGlvblxuICBpZiAoZGF0YS5sZW5ndGggPiAwICYmIGNvcnJ1cHRJdGVtcyAvIGRhdGEubGVuZ3RoID4gdGhpcy5jb3JydXB0QWxlcnRUaHJlc2hvbGQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNb3JlIHRoYW4gXCIgKyBNYXRoLmZsb29yKDEwMCAqIHRoaXMuY29ycnVwdEFsZXJ0VGhyZXNob2xkKSArIFwiJSBvZiB0aGUgZGF0YSBmaWxlIGlzIGNvcnJ1cHQsIHRoZSB3cm9uZyBiZWZvcmVEZXNlcmlhbGl6YXRpb24gaG9vayBtYXkgYmUgdXNlZC4gQ2F1dGlvdXNseSByZWZ1c2luZyB0byBzdGFydCBOZURCIHRvIHByZXZlbnQgZGF0YWxvc3NcIik7XG4gIH1cblxuICBPYmplY3Qua2V5cyhkYXRhQnlJZCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgIHRkYXRhLnB1c2goZGF0YUJ5SWRba10pO1xuICB9KTtcblxuICByZXR1cm4geyBkYXRhOiB0ZGF0YSwgaW5kZXhlczogaW5kZXhlcyB9O1xufTtcblxuXG4vKipcbiAqIExvYWQgdGhlIGRhdGFiYXNlXG4gKiAxKSBDcmVhdGUgYWxsIGluZGV4ZXNcbiAqIDIpIEluc2VydCBhbGwgZGF0YVxuICogMykgQ29tcGFjdCB0aGUgZGF0YWJhc2VcbiAqIFRoaXMgbWVhbnMgcHVsbGluZyBkYXRhIG91dCBvZiB0aGUgZGF0YSBmaWxlIG9yIGNyZWF0aW5nIGl0IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAqIEFsc28sIGFsbCBkYXRhIGlzIHBlcnNpc3RlZCByaWdodCBhd2F5LCB3aGljaCBoYXMgdGhlIGVmZmVjdCBvZiBjb21wYWN0aW5nIHRoZSBkYXRhYmFzZSBmaWxlXG4gKiBUaGlzIG9wZXJhdGlvbiBpcyB2ZXJ5IHF1aWNrIGF0IHN0YXJ0dXAgZm9yIGEgYmlnIGNvbGxlY3Rpb24gKDYwbXMgZm9yIH4xMGsgZG9jcylcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IGVyclxuICovXG5QZXJzaXN0ZW5jZS5wcm90b3R5cGUubG9hZERhdGFiYXNlID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBjYWxsYmFjayA9IGNiIHx8IGZ1bmN0aW9uICgpIHt9XG4gICAgLCBzZWxmID0gdGhpc1xuICAgIDtcblxuICBzZWxmLmRiLnJlc2V0SW5kZXhlcygpO1xuXG4gIC8vIEluLW1lbW9yeSBvbmx5IGRhdGFzdG9yZVxuICBpZiAoc2VsZi5pbk1lbW9yeU9ubHkpIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwpOyB9XG5cbiAgYXN5bmMud2F0ZXJmYWxsKFtcbiAgICBmdW5jdGlvbiAoY2IpIHtcbiAgICAgIFBlcnNpc3RlbmNlLmVuc3VyZURpcmVjdG9yeUV4aXN0cyhwYXRoLmRpcm5hbWUoc2VsZi5maWxlbmFtZSksIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgc3RvcmFnZS5lbnN1cmVEYXRhZmlsZUludGVncml0eShzZWxmLmZpbGVuYW1lLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgc3RvcmFnZS5yZWFkRmlsZShzZWxmLmZpbGVuYW1lLCAndXRmOCcsIGZ1bmN0aW9uIChlcnIsIHJhd0RhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIGNiKGVycik7IH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdmFyIHRyZWF0ZWREYXRhID0gc2VsZi50cmVhdFJhd0RhdGEocmF3RGF0YSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYihlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVjcmVhdGUgYWxsIGluZGV4ZXMgaW4gdGhlIGRhdGFmaWxlXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0cmVhdGVkRGF0YS5pbmRleGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgc2VsZi5kYi5pbmRleGVzW2tleV0gPSBuZXcgSW5kZXgodHJlYXRlZERhdGEuaW5kZXhlc1trZXldKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBGaWxsIGNhY2hlZCBkYXRhYmFzZSAoaS5lLiBhbGwgaW5kZXhlcykgd2l0aCBkYXRhXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzZWxmLmRiLnJlc2V0SW5kZXhlcyh0cmVhdGVkRGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgc2VsZi5kYi5yZXNldEluZGV4ZXMoKTsgICAvLyBSb2xsYmFjayBhbnkgaW5kZXggd2hpY2ggZGlkbid0IGZhaWxcbiAgICAgICAgICAgICAgcmV0dXJuIGNiKGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmRiLnBlcnNpc3RlbmNlLnBlcnNpc3RDYWNoZWREYXRhYmFzZShjYik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICBdLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuXG4gICAgICAgc2VsZi5kYi5leGVjdXRvci5wcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgICB9KTtcbn07XG5cblxuLy8gSW50ZXJmYWNlXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNpc3RlbmNlO1xuIiwiLyoqXG4gKiBXYXkgZGF0YSBpcyBzdG9yZWQgZm9yIHRoaXMgZGF0YWJhc2VcbiAqIEZvciBhIE5vZGUuanMvTm9kZSBXZWJraXQgZGF0YWJhc2UgaXQncyB0aGUgZmlsZSBzeXN0ZW1cbiAqIEZvciBhIGJyb3dzZXItc2lkZSBkYXRhYmFzZSBpdCdzIGxvY2FsZm9yYWdlIHdoaWNoIGNob29zZXMgdGhlIGJlc3Qgb3B0aW9uIGRlcGVuZGluZyBvbiB1c2VyIGJyb3dzZXIgKEluZGV4ZWREQiB0aGVuIFdlYlNRTCB0aGVuIGxvY2FsU3RvcmFnZSlcbiAqXG4gKiBUaGlzIHZlcnNpb24gaXMgdGhlIE5vZGUuanMvTm9kZSBXZWJraXQgdmVyc2lvblxuICogSXQncyBlc3NlbnRpYWxseSBmcywgbWtkaXJwIGFuZCBjcmFzaCBzYWZlIHdyaXRlIGFuZCByZWFkIGZ1bmN0aW9uc1xuICovXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbiAgLCBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAsIGFzeW5jID0gcmVxdWlyZSgnYXN5bmMnKVxuICAsIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgLCBzdG9yYWdlID0ge31cbiAgO1xuXG5zdG9yYWdlLmV4aXN0cyA9IGZzLmV4aXN0cztcbnN0b3JhZ2UucmVuYW1lID0gZnMucmVuYW1lO1xuc3RvcmFnZS53cml0ZUZpbGUgPSBmcy53cml0ZUZpbGU7XG5zdG9yYWdlLnVubGluayA9IGZzLnVubGluaztcbnN0b3JhZ2UuYXBwZW5kRmlsZSA9IGZzLmFwcGVuZEZpbGU7XG5zdG9yYWdlLnJlYWRGaWxlID0gZnMucmVhZEZpbGU7XG5zdG9yYWdlLm1rZGlycCA9IG1rZGlycDtcblxuXG4vKipcbiAqIEV4cGxpY2l0IG5hbWUgLi4uXG4gKi9cbnN0b3JhZ2UuZW5zdXJlRmlsZURvZXNudEV4aXN0ID0gZnVuY3Rpb24gKGZpbGUsIGNhbGxiYWNrKSB7XG4gIHN0b3JhZ2UuZXhpc3RzKGZpbGUsIGZ1bmN0aW9uIChleGlzdHMpIHtcbiAgICBpZiAoIWV4aXN0cykgeyByZXR1cm4gY2FsbGJhY2sobnVsbCk7IH1cblxuICAgIHN0b3JhZ2UudW5saW5rKGZpbGUsIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH0pO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBGbHVzaCBkYXRhIGluIE9TIGJ1ZmZlciB0byBzdG9yYWdlIGlmIGNvcnJlc3BvbmRpbmcgb3B0aW9uIGlzIHNldFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuZmlsZW5hbWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5pc0RpciBPcHRpb25hbCwgZGVmYXVsdHMgdG8gZmFsc2VcbiAqIElmIG9wdGlvbnMgaXMgYSBzdHJpbmcsIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgZmx1c2ggb2YgdGhlIGZpbGUgKG5vdCBkaXIpIGNhbGxlZCBvcHRpb25zIHdhcyByZXF1ZXN0ZWRcbiAqL1xuc3RvcmFnZS5mbHVzaFRvU3RvcmFnZSA9IGZ1bmN0aW9uIChvcHRpb25zLCBjYWxsYmFjaykge1xuICB2YXIgZmlsZW5hbWUsIGZsYWdzO1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgZmlsZW5hbWUgPSBvcHRpb25zO1xuICAgIGZsYWdzID0gJ3IrJztcbiAgfSBlbHNlIHtcbiAgICBmaWxlbmFtZSA9IG9wdGlvbnMuZmlsZW5hbWU7XG4gICAgZmxhZ3MgPSBvcHRpb25zLmlzRGlyID8gJ3InIDogJ3IrJztcbiAgfVxuXG4gIC8vIFdpbmRvd3MgY2FuJ3QgZnN5bmMgKEZsdXNoRmlsZUJ1ZmZlcnMpIGRpcmVjdG9yaWVzLiBXZSBjYW4gbGl2ZSB3aXRoIHRoaXMgYXMgaXQgY2Fubm90IGNhdXNlIDEwMCUgZGF0YWxvc3NcbiAgLy8gZXhjZXB0IGluIHRoZSB2ZXJ5IHJhcmUgZXZlbnQgb2YgdGhlIGZpcnN0IHRpbWUgZGF0YWJhc2UgaXMgbG9hZGVkIGFuZCBhIGNyYXNoIGhhcHBlbnNcbiAgaWYgKGZsYWdzID09PSAncicgJiYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgfHwgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjY0JykpIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwpOyB9XG5cbiAgZnMub3BlbihmaWxlbmFtZSwgZmxhZ3MsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgaWYgKGVycikgeyByZXR1cm4gY2FsbGJhY2soZXJyKTsgfVxuICAgIGZzLmZzeW5jKGZkLCBmdW5jdGlvbiAoZXJyRlMpIHtcbiAgICAgIGZzLmNsb3NlKGZkLCBmdW5jdGlvbiAoZXJyQykge1xuICAgICAgICBpZiAoZXJyRlMgfHwgZXJyQykge1xuICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKCdGYWlsZWQgdG8gZmx1c2ggdG8gc3RvcmFnZScpO1xuICAgICAgICAgIGUuZXJyb3JPbkZzeW5jID0gZXJyRlM7XG4gICAgICAgICAgZS5lcnJvck9uQ2xvc2UgPSBlcnJDO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cblxuLyoqXG4gKiBGdWxseSB3cml0ZSBvciByZXdyaXRlIHRoZSBkYXRhZmlsZSwgaW1tdW5lIHRvIGNyYXNoZXMgZHVyaW5nIHRoZSB3cml0ZSBvcGVyYXRpb24gKGRhdGEgd2lsbCBub3QgYmUgbG9zdClcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIE9wdGlvbmFsIGNhbGxiYWNrLCBzaWduYXR1cmU6IGVyclxuICovXG5zdG9yYWdlLmNyYXNoU2FmZVdyaXRlRmlsZSA9IGZ1bmN0aW9uIChmaWxlbmFtZSwgZGF0YSwgY2IpIHtcbiAgdmFyIGNhbGxiYWNrID0gY2IgfHwgZnVuY3Rpb24gKCkge31cbiAgICAsIHRlbXBGaWxlbmFtZSA9IGZpbGVuYW1lICsgJ34nO1xuXG4gIGFzeW5jLndhdGVyZmFsbChbXG4gICAgYXN5bmMuYXBwbHkoc3RvcmFnZS5mbHVzaFRvU3RvcmFnZSwgeyBmaWxlbmFtZTogcGF0aC5kaXJuYW1lKGZpbGVuYW1lKSwgaXNEaXI6IHRydWUgfSlcbiAgLCBmdW5jdGlvbiAoY2IpIHtcbiAgICAgIHN0b3JhZ2UuZXhpc3RzKGZpbGVuYW1lLCBmdW5jdGlvbiAoZXhpc3RzKSB7XG4gICAgICAgIGlmIChleGlzdHMpIHtcbiAgICAgICAgICBzdG9yYWdlLmZsdXNoVG9TdG9yYWdlKGZpbGVuYW1lLCBmdW5jdGlvbiAoZXJyKSB7IHJldHVybiBjYihlcnIpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY2IoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAsIGZ1bmN0aW9uIChjYikge1xuICAgICAgc3RvcmFnZS53cml0ZUZpbGUodGVtcEZpbGVuYW1lLCBkYXRhLCBmdW5jdGlvbiAoZXJyKSB7IHJldHVybiBjYihlcnIpOyB9KTtcbiAgICB9XG4gICwgYXN5bmMuYXBwbHkoc3RvcmFnZS5mbHVzaFRvU3RvcmFnZSwgdGVtcEZpbGVuYW1lKVxuICAsIGZ1bmN0aW9uIChjYikge1xuICAgICAgc3RvcmFnZS5yZW5hbWUodGVtcEZpbGVuYW1lLCBmaWxlbmFtZSwgZnVuY3Rpb24gKGVycikgeyByZXR1cm4gY2IoZXJyKTsgfSk7XG4gICAgfVxuICAsIGFzeW5jLmFwcGx5KHN0b3JhZ2UuZmx1c2hUb1N0b3JhZ2UsIHsgZmlsZW5hbWU6IHBhdGguZGlybmFtZShmaWxlbmFtZSksIGlzRGlyOiB0cnVlIH0pXG4gIF0sIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH0pXG59O1xuXG5cbi8qKlxuICogRW5zdXJlIHRoZSBkYXRhZmlsZSBjb250YWlucyBhbGwgdGhlIGRhdGEsIGV2ZW4gaWYgdGhlcmUgd2FzIGEgY3Jhc2ggZHVyaW5nIGEgZnVsbCBmaWxlIHdyaXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZW5hbWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIHNpZ25hdHVyZTogZXJyXG4gKi9cbnN0b3JhZ2UuZW5zdXJlRGF0YWZpbGVJbnRlZ3JpdHkgPSBmdW5jdGlvbiAoZmlsZW5hbWUsIGNhbGxiYWNrKSB7XG4gIHZhciB0ZW1wRmlsZW5hbWUgPSBmaWxlbmFtZSArICd+JztcblxuICBzdG9yYWdlLmV4aXN0cyhmaWxlbmFtZSwgZnVuY3Rpb24gKGZpbGVuYW1lRXhpc3RzKSB7XG4gICAgLy8gV3JpdGUgd2FzIHN1Y2Nlc3NmdWxcbiAgICBpZiAoZmlsZW5hbWVFeGlzdHMpIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwpOyB9XG5cbiAgICBzdG9yYWdlLmV4aXN0cyh0ZW1wRmlsZW5hbWUsIGZ1bmN0aW9uIChvbGRGaWxlbmFtZUV4aXN0cykge1xuICAgICAgLy8gTmV3IGRhdGFiYXNlXG4gICAgICBpZiAoIW9sZEZpbGVuYW1lRXhpc3RzKSB7XG4gICAgICAgIHJldHVybiBzdG9yYWdlLndyaXRlRmlsZShmaWxlbmFtZSwgJycsICd1dGY4JywgZnVuY3Rpb24gKGVycikgeyBjYWxsYmFjayhlcnIpOyB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gV3JpdGUgZmFpbGVkLCB1c2Ugb2xkIHZlcnNpb25cbiAgICAgIHN0b3JhZ2UucmVuYW1lKHRlbXBGaWxlbmFtZSwgZmlsZW5hbWUsIGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIGNhbGxiYWNrKGVycik7IH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cblxuXG4vLyBJbnRlcmZhY2Vcbm1vZHVsZS5leHBvcnRzID0gc3RvcmFnZTtcbiIsIi8qZ2xvYmFsIHNldEltbWVkaWF0ZTogZmFsc2UsIHNldFRpbWVvdXQ6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSAqL1xuKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBhc3luYyA9IHt9O1xuXG4gICAgLy8gZ2xvYmFsIG9uIHRoZSBzZXJ2ZXIsIHdpbmRvdyBpbiB0aGUgYnJvd3NlclxuICAgIHZhciByb290LCBwcmV2aW91c19hc3luYztcblxuICAgIHJvb3QgPSB0aGlzO1xuICAgIGlmIChyb290ICE9IG51bGwpIHtcbiAgICAgIHByZXZpb3VzX2FzeW5jID0gcm9vdC5hc3luYztcbiAgICB9XG5cbiAgICBhc3luYy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByb290LmFzeW5jID0gcHJldmlvdXNfYXN5bmM7XG4gICAgICAgIHJldHVybiBhc3luYztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb25seV9vbmNlKGZuKSB7XG4gICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxlZCkgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgd2FzIGFscmVhZHkgY2FsbGVkLlwiKTtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICBmbi5hcHBseShyb290LCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vLyBjcm9zcy1icm93c2VyIGNvbXBhdGlibGl0eSBmdW5jdGlvbnMgLy8vL1xuXG4gICAgdmFyIF9lYWNoID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKGFyci5mb3JFYWNoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZvckVhY2goaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihhcnJbaV0sIGksIGFycik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF9tYXAgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvcikge1xuICAgICAgICBpZiAoYXJyLm1hcCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5tYXAoaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIF9lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvcih4LCBpLCBhKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgdmFyIF9yZWR1Y2UgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgbWVtbykge1xuICAgICAgICBpZiAoYXJyLnJlZHVjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pO1xuICAgICAgICB9XG4gICAgICAgIF9lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIG1lbW8gPSBpdGVyYXRvcihtZW1vLCB4LCBpLCBhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG5cbiAgICB2YXIgX2tleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuICAgIC8vLy8gZXhwb3J0ZWQgYXN5bmMgbW9kdWxlIGZ1bmN0aW9ucyAvLy8vXG5cbiAgICAvLy8vIG5leHRUaWNrIGltcGxlbWVudGF0aW9uIHdpdGggYnJvd3Nlci1jb21wYXRpYmxlIGZhbGxiYWNrIC8vLy9cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8ICEocHJvY2Vzcy5uZXh0VGljaykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgLy8gbm90IGEgZGlyZWN0IGFsaWFzIGZvciBJRTEwIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IGFzeW5jLm5leHRUaWNrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUgPSBhc3luYy5uZXh0VGljaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICAgICAgICBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAvLyBub3QgYSBkaXJlY3QgYWxpYXMgZm9yIElFMTAgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZSA9IGFzeW5jLm5leHRUaWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICBfZWFjaChhcnIsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBvbmx5X29uY2UoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2ggPSBhc3luYy5lYWNoO1xuXG4gICAgYXN5bmMuZWFjaFNlcmllcyA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICB2YXIgaXRlcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKGFycltjb21wbGV0ZWRdLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaXRlcmF0ZSgpO1xuICAgIH07XG4gICAgYXN5bmMuZm9yRWFjaFNlcmllcyA9IGFzeW5jLmVhY2hTZXJpZXM7XG5cbiAgICBhc3luYy5lYWNoTGltaXQgPSBmdW5jdGlvbiAoYXJyLCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmbiA9IF9lYWNoTGltaXQobGltaXQpO1xuICAgICAgICBmbi5hcHBseShudWxsLCBbYXJyLCBpdGVyYXRvciwgY2FsbGJhY2tdKTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2hMaW1pdCA9IGFzeW5jLmVhY2hMaW1pdDtcblxuICAgIHZhciBfZWFjaExpbWl0ID0gZnVuY3Rpb24gKGxpbWl0KSB7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgIGlmICghYXJyLmxlbmd0aCB8fCBsaW1pdCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcbiAgICAgICAgICAgIHZhciBzdGFydGVkID0gMDtcbiAgICAgICAgICAgIHZhciBydW5uaW5nID0gMDtcblxuICAgICAgICAgICAgKGZ1bmN0aW9uIHJlcGxlbmlzaCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdoaWxlIChydW5uaW5nIDwgbGltaXQgJiYgc3RhcnRlZCA8IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGl0ZXJhdG9yKGFycltzdGFydGVkIC0gMV0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBsZW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKCk7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgdmFyIGRvUGFyYWxsZWwgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbYXN5bmMuZWFjaF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHZhciBkb1BhcmFsbGVsTGltaXQgPSBmdW5jdGlvbihsaW1pdCwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbX2VhY2hMaW1pdChsaW1pdCldLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICB2YXIgZG9TZXJpZXMgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbYXN5bmMuZWFjaFNlcmllc10uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICB2YXIgX2FzeW5jTWFwID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgYXJyID0gX21hcChhcnIsIGZ1bmN0aW9uICh4LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4ge2luZGV4OiBpLCB2YWx1ZTogeH07XG4gICAgICAgIH0pO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgudmFsdWUsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzW3guaW5kZXhdID0gdjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMubWFwID0gZG9QYXJhbGxlbChfYXN5bmNNYXApO1xuICAgIGFzeW5jLm1hcFNlcmllcyA9IGRvU2VyaWVzKF9hc3luY01hcCk7XG4gICAgYXN5bmMubWFwTGltaXQgPSBmdW5jdGlvbiAoYXJyLCBsaW1pdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfbWFwTGltaXQobGltaXQpKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgdmFyIF9tYXBMaW1pdCA9IGZ1bmN0aW9uKGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBkb1BhcmFsbGVsTGltaXQobGltaXQsIF9hc3luY01hcCk7XG4gICAgfTtcblxuICAgIC8vIHJlZHVjZSBvbmx5IGhhcyBhIHNlcmllcyB2ZXJzaW9uLCBhcyBkb2luZyByZWR1Y2UgaW4gcGFyYWxsZWwgd29uJ3RcbiAgICAvLyB3b3JrIGluIG1hbnkgc2l0dWF0aW9ucy5cbiAgICBhc3luYy5yZWR1Y2UgPSBmdW5jdGlvbiAoYXJyLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaFNlcmllcyhhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IobWVtbywgeCwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgICAgIG1lbW8gPSB2O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBtZW1vKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBpbmplY3QgYWxpYXNcbiAgICBhc3luYy5pbmplY3QgPSBhc3luYy5yZWR1Y2U7XG4gICAgLy8gZm9sZGwgYWxpYXNcbiAgICBhc3luYy5mb2xkbCA9IGFzeW5jLnJlZHVjZTtcblxuICAgIGFzeW5jLnJlZHVjZVJpZ2h0ID0gZnVuY3Rpb24gKGFyciwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXZlcnNlZCA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH0pLnJldmVyc2UoKTtcbiAgICAgICAgYXN5bmMucmVkdWNlKHJldmVyc2VkLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG4gICAgLy8gZm9sZHIgYWxpYXNcbiAgICBhc3luYy5mb2xkciA9IGFzeW5jLnJlZHVjZVJpZ2h0O1xuXG4gICAgdmFyIF9maWx0ZXIgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBhcnIgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7aW5kZXg6IGksIHZhbHVlOiB4fTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeC52YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soX21hcChyZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgICAgICAgICB9KSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5maWx0ZXIgPSBkb1BhcmFsbGVsKF9maWx0ZXIpO1xuICAgIGFzeW5jLmZpbHRlclNlcmllcyA9IGRvU2VyaWVzKF9maWx0ZXIpO1xuICAgIC8vIHNlbGVjdCBhbGlhc1xuICAgIGFzeW5jLnNlbGVjdCA9IGFzeW5jLmZpbHRlcjtcbiAgICBhc3luYy5zZWxlY3RTZXJpZXMgPSBhc3luYy5maWx0ZXJTZXJpZXM7XG5cbiAgICB2YXIgX3JlamVjdCA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGFyciA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtpbmRleDogaSwgdmFsdWU6IHh9O1xuICAgICAgICB9KTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LnZhbHVlLCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goeCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soX21hcChyZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5pbmRleCAtIGIuaW5kZXg7XG4gICAgICAgICAgICB9KSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5yZWplY3QgPSBkb1BhcmFsbGVsKF9yZWplY3QpO1xuICAgIGFzeW5jLnJlamVjdFNlcmllcyA9IGRvU2VyaWVzKF9yZWplY3QpO1xuXG4gICAgdmFyIF9kZXRlY3QgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBtYWluX2NhbGxiYWNrKSB7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayh4KTtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgbWFpbl9jYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmRldGVjdCA9IGRvUGFyYWxsZWwoX2RldGVjdCk7XG4gICAgYXN5bmMuZGV0ZWN0U2VyaWVzID0gZG9TZXJpZXMoX2RldGVjdCk7XG5cbiAgICBhc3luYy5zb21lID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIG1haW5fY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgbWFpbl9jYWxsYmFjayhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gYW55IGFsaWFzXG4gICAgYXN5bmMuYW55ID0gYXN5bmMuc29tZTtcblxuICAgIGFzeW5jLmV2ZXJ5ID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIG1haW5fY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMuZWFjaChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBtYWluX2NhbGxiYWNrKHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIGFsbCBhbGlhc1xuICAgIGFzeW5jLmFsbCA9IGFzeW5jLmV2ZXJ5O1xuXG4gICAgYXN5bmMuc29ydEJ5ID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLm1hcChhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgZnVuY3Rpb24gKGVyciwgY3JpdGVyaWEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7dmFsdWU6IHgsIGNyaXRlcmlhOiBjcml0ZXJpYX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhLCBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIF9tYXAocmVzdWx0cy5zb3J0KGZuKSwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMuYXV0byA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgdmFyIGtleXMgPSBfa2V5cyh0YXNrcyk7XG4gICAgICAgIGlmICgha2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHRzID0ge307XG5cbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy51bnNoaWZ0KGZuKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciB0YXNrQ29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfZWFjaChsaXN0ZW5lcnMuc2xpY2UoMCksIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBhZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoX2tleXMocmVzdWx0cykubGVuZ3RoID09PSBrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF9lYWNoKGtleXMsIGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9ICh0YXNrc1trXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSA/IFt0YXNrc1trXV06IHRhc2tzW2tdO1xuICAgICAgICAgICAgdmFyIHRhc2tDYWxsYmFjayA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNhZmVSZXN1bHRzID0ge307XG4gICAgICAgICAgICAgICAgICAgIF9lYWNoKF9rZXlzKHJlc3VsdHMpLCBmdW5jdGlvbihya2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYWZlUmVzdWx0c1tya2V5XSA9IHJlc3VsdHNbcmtleV07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzYWZlUmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgc2FmZVJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICAvLyBzdG9wIHN1YnNlcXVlbnQgZXJyb3JzIGhpdHRpbmcgY2FsbGJhY2sgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUodGFza0NvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHJlcXVpcmVzID0gdGFzay5zbGljZSgwLCBNYXRoLmFicyh0YXNrLmxlbmd0aCAtIDEpKSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlZHVjZShyZXF1aXJlcywgZnVuY3Rpb24gKGEsIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhICYmIHJlc3VsdHMuaGFzT3duUHJvcGVydHkoeCkpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpICYmICFyZXN1bHRzLmhhc093blByb3BlcnR5KGspO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgdGFza1t0YXNrLmxlbmd0aCAtIDFdKHRhc2tDYWxsYmFjaywgcmVzdWx0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrW3Rhc2subGVuZ3RoIC0gMV0odGFza0NhbGxiYWNrLCByZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMud2F0ZXJmYWxsID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAodGFza3MuY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gd2F0ZXJmYWxsIG11c3QgYmUgYW4gYXJyYXkgb2YgZnVuY3Rpb25zJyk7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3cmFwSXRlcmF0b3IgPSBmdW5jdGlvbiAoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh3cmFwSXRlcmF0b3IobmV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhc3luYy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0b3IuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHdyYXBJdGVyYXRvcihhc3luYy5pdGVyYXRvcih0YXNrcykpKCk7XG4gICAgfTtcblxuICAgIHZhciBfcGFyYWxsZWwgPSBmdW5jdGlvbihlYWNoZm4sIHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAodGFza3MuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICBlYWNoZm4ubWFwKHRhc2tzLCBmdW5jdGlvbiAoZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGVyciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0ge307XG4gICAgICAgICAgICBlYWNoZm4uZWFjaChfa2V5cyh0YXNrcyksIGZ1bmN0aW9uIChrLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRhc2tzW2tdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFzeW5jLnBhcmFsbGVsID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBfcGFyYWxsZWwoeyBtYXA6IGFzeW5jLm1hcCwgZWFjaDogYXN5bmMuZWFjaCB9LCB0YXNrcywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5wYXJhbGxlbExpbWl0ID0gZnVuY3Rpb24odGFza3MsIGxpbWl0LCBjYWxsYmFjaykge1xuICAgICAgICBfcGFyYWxsZWwoeyBtYXA6IF9tYXBMaW1pdChsaW1pdCksIGVhY2g6IF9lYWNoTGltaXQobGltaXQpIH0sIHRhc2tzLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnNlcmllcyA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKHRhc2tzLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgYXN5bmMubWFwU2VyaWVzKHRhc2tzLCBmdW5jdGlvbiAoZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGZuKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKG51bGwsIGVyciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzID0ge307XG4gICAgICAgICAgICBhc3luYy5lYWNoU2VyaWVzKF9rZXlzKHRhc2tzKSwgZnVuY3Rpb24gKGssIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGFza3Nba10oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuaXRlcmF0b3IgPSBmdW5jdGlvbiAodGFza3MpIHtcbiAgICAgICAgdmFyIG1ha2VDYWxsYmFjayA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza3NbaW5kZXhdLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmbi5uZXh0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm4ubmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGluZGV4IDwgdGFza3MubGVuZ3RoIC0gMSkgPyBtYWtlQ2FsbGJhY2soaW5kZXggKyAxKTogbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZm47XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBtYWtlQ2FsbGJhY2soMCk7XG4gICAgfTtcblxuICAgIGFzeW5jLmFwcGx5ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShcbiAgICAgICAgICAgICAgICBudWxsLCBhcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIF9jb25jYXQgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGZuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgciA9IFtdO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2IpIHtcbiAgICAgICAgICAgIGZuKHgsIGZ1bmN0aW9uIChlcnIsIHkpIHtcbiAgICAgICAgICAgICAgICByID0gci5jb25jYXQoeSB8fCBbXSk7XG4gICAgICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHIpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmNvbmNhdCA9IGRvUGFyYWxsZWwoX2NvbmNhdCk7XG4gICAgYXN5bmMuY29uY2F0U2VyaWVzID0gZG9TZXJpZXMoX2NvbmNhdCk7XG5cbiAgICBhc3luYy53aGlsc3QgPSBmdW5jdGlvbiAodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0ZXN0KCkpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhc3luYy53aGlsc3QodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1doaWxzdCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgaXRlcmF0b3IoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRlc3QoKSkge1xuICAgICAgICAgICAgICAgIGFzeW5jLmRvV2hpbHN0KGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMudW50aWwgPSBmdW5jdGlvbiAodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGVzdCgpKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXN5bmMudW50aWwodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1VudGlsID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjaykge1xuICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRlc3QoKSkge1xuICAgICAgICAgICAgICAgIGFzeW5jLmRvVW50aWwoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhc3luYy5xdWV1ZSA9IGZ1bmN0aW9uICh3b3JrZXIsIGNvbmN1cnJlbmN5KSB7XG4gICAgICAgIGlmIChjb25jdXJyZW5jeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25jdXJyZW5jeSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX2luc2VydChxLCBkYXRhLCBwb3MsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgaWYoZGF0YS5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX2VhY2goZGF0YSwgZnVuY3Rpb24odGFzaykge1xuICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHRhc2ssXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gY2FsbGJhY2sgOiBudWxsXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKHBvcykge1xuICAgICAgICAgICAgICAgIHEudGFza3MudW5zaGlmdChpdGVtKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxLnRhc2tzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAocS5zYXR1cmF0ZWQgJiYgcS50YXNrcy5sZW5ndGggPT09IGNvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICAgICAgICBxLnNhdHVyYXRlZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShxLnByb2Nlc3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdvcmtlcnMgPSAwO1xuICAgICAgICB2YXIgcSA9IHtcbiAgICAgICAgICAgIHRhc2tzOiBbXSxcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5OiBjb25jdXJyZW5jeSxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbnVsbCxcbiAgICAgICAgICAgIGVtcHR5OiBudWxsLFxuICAgICAgICAgICAgZHJhaW46IG51bGwsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgX2luc2VydChxLCBkYXRhLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuc2hpZnQ6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIHRydWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdvcmtlcnMgPCBxLmNvbmN1cnJlbmN5ICYmIHEudGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXNrID0gcS50YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocS5lbXB0eSAmJiBxLnRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcnMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrZXJzIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFzay5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhc2suY2FsbGJhY2suYXBwbHkodGFzaywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxLmRyYWluICYmIHEudGFza3MubGVuZ3RoICsgd29ya2VycyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHEuZHJhaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHEucHJvY2VzcygpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2IgPSBvbmx5X29uY2UobmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcih0YXNrLmRhdGEsIGNiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVuZ3RoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHEudGFza3MubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJ1bm5pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfTtcblxuICAgIGFzeW5jLmNhcmdvID0gZnVuY3Rpb24gKHdvcmtlciwgcGF5bG9hZCkge1xuICAgICAgICB2YXIgd29ya2luZyAgICAgPSBmYWxzZSxcbiAgICAgICAgICAgIHRhc2tzICAgICAgID0gW107XG5cbiAgICAgICAgdmFyIGNhcmdvID0ge1xuICAgICAgICAgICAgdGFza3M6IHRhc2tzLFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbnVsbCxcbiAgICAgICAgICAgIGVtcHR5OiBudWxsLFxuICAgICAgICAgICAgZHJhaW46IG51bGwsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gW2RhdGFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZWFjaChkYXRhLCBmdW5jdGlvbih0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFzayxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBjYWxsYmFjayA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJnby5zYXR1cmF0ZWQgJiYgdGFza3MubGVuZ3RoID09PSBwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJnby5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFzeW5jLnNldEltbWVkaWF0ZShjYXJnby5wcm9jZXNzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiBwcm9jZXNzKCkge1xuICAgICAgICAgICAgICAgIGlmICh3b3JraW5nKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZihjYXJnby5kcmFpbikgY2FyZ28uZHJhaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB0cyA9IHR5cGVvZiBwYXlsb2FkID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGFza3Muc3BsaWNlKDAsIHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0YXNrcy5zcGxpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHMgPSBfbWFwKHRzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFzay5kYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYoY2FyZ28uZW1wdHkpIGNhcmdvLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgd29ya2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd29ya2VyKGRzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgICAgX2VhY2godHMsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2FsbGJhY2suYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFza3MubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJ1bm5pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2luZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGNhcmdvO1xuICAgIH07XG5cbiAgICB2YXIgX2NvbnNvbGVfZm4gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzLmNvbmNhdChbZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNvbnNvbGVbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9lYWNoKGFyZ3MsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZVtuYW1lXSh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV0pKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIGFzeW5jLmxvZyA9IF9jb25zb2xlX2ZuKCdsb2cnKTtcbiAgICBhc3luYy5kaXIgPSBfY29uc29sZV9mbignZGlyJyk7XG4gICAgLyphc3luYy5pbmZvID0gX2NvbnNvbGVfZm4oJ2luZm8nKTtcbiAgICBhc3luYy53YXJuID0gX2NvbnNvbGVfZm4oJ3dhcm4nKTtcbiAgICBhc3luYy5lcnJvciA9IF9jb25zb2xlX2ZuKCdlcnJvcicpOyovXG5cbiAgICBhc3luYy5tZW1vaXplID0gZnVuY3Rpb24gKGZuLCBoYXNoZXIpIHtcbiAgICAgICAgdmFyIG1lbW8gPSB7fTtcbiAgICAgICAgdmFyIHF1ZXVlcyA9IHt9O1xuICAgICAgICBoYXNoZXIgPSBoYXNoZXIgfHwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9O1xuICAgICAgICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbWVtbykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIG1lbW9ba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChrZXkgaW4gcXVldWVzKSB7XG4gICAgICAgICAgICAgICAgcXVldWVzW2tleV0ucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBxdWV1ZXNba2V5XSA9IFtjYWxsYmFja107XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncy5jb25jYXQoW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb1trZXldID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcSA9IHF1ZXVlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcXVldWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBxW2ldLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBtZW1vaXplZC5tZW1vID0gbWVtbztcbiAgICAgICAgbWVtb2l6ZWQudW5tZW1vaXplZCA9IGZuO1xuICAgICAgICByZXR1cm4gbWVtb2l6ZWQ7XG4gICAgfTtcblxuICAgIGFzeW5jLnVubWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChmbi51bm1lbW9pemVkIHx8IGZuKS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9O1xuXG4gICAgYXN5bmMudGltZXMgPSBmdW5jdGlvbiAoY291bnQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgY291bnRlciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGNvdW50ZXIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXN5bmMubWFwKGNvdW50ZXIsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnRpbWVzU2VyaWVzID0gZnVuY3Rpb24gKGNvdW50LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudGVyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzeW5jLm1hcFNlcmllcyhjb3VudGVyLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5jb21wb3NlID0gZnVuY3Rpb24gKC8qIGZ1bmN0aW9ucy4uLiAqLykge1xuICAgICAgICB2YXIgZm5zID0gQXJyYXkucHJvdG90eXBlLnJldmVyc2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIGFzeW5jLnJlZHVjZShmbnMsIGFyZ3MsIGZ1bmN0aW9uIChuZXdhcmdzLCBmbiwgY2IpIHtcbiAgICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBuZXdhcmdzLmNvbmNhdChbZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICBjYihlcnIsIG5leHRhcmdzKTtcbiAgICAgICAgICAgICAgICB9XSkpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoYXQsIFtlcnJdLmNvbmNhdChyZXN1bHRzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIF9hcHBseUVhY2ggPSBmdW5jdGlvbiAoZWFjaGZuLCBmbnMgLyphcmdzLi4uKi8pIHtcbiAgICAgICAgdmFyIGdvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHJldHVybiBlYWNoZm4oZm5zLCBmdW5jdGlvbiAoZm4sIGNiKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncy5jb25jYXQoW2NiXSkpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhbGxiYWNrKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICAgICAgICByZXR1cm4gZ28uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZ287XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGFzeW5jLmFwcGx5RWFjaCA9IGRvUGFyYWxsZWwoX2FwcGx5RWFjaCk7XG4gICAgYXN5bmMuYXBwbHlFYWNoU2VyaWVzID0gZG9TZXJpZXMoX2FwcGx5RWFjaCk7XG5cbiAgICBhc3luYy5mb3JldmVyID0gZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICBmdW5jdGlvbiBuZXh0KGVycikge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm4obmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCgpO1xuICAgIH07XG5cbiAgICAvLyBBTUQgLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3luYztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIE5vZGUuanNcbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGFzeW5jO1xuICAgIH1cbiAgICAvLyBpbmNsdWRlZCBkaXJlY3RseSB2aWEgPHNjcmlwdD4gdGFnXG4gICAgZWxzZSB7XG4gICAgICAgIHJvb3QuYXN5bmMgPSBhc3luYztcbiAgICB9XG5cbn0oKSk7XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjQuNFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjQuNCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfLmhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gbnVsbCA6IFtdO1xuICAgIHJldHVybiBfW2ZpcnN0ID8gJ2ZpbmQnIDogJ2ZpbHRlciddKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gdmFsdWVba2V5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy53aGVyZShvYmosIGF0dHJzLCB0cnVlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCBvciAoZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIC8vIENhbid0IG9wdGltaXplIGFycmF5cyBvZiBpbnRlZ2VycyBsb25nZXIgdGhhbiA2NSw1MzUgZWxlbWVudHMuXG4gIC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTgwNzk3XG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID49IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIEluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiBJbmZpbml0eSwgdmFsdWU6IEluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPCByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGFuIGFycmF5LlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbG9va3VwIGl0ZXJhdG9ycy5cbiAgdmFyIGxvb2t1cEl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlIDogZnVuY3Rpb24ob2JqKXsgcmV0dXJuIG9ialt2YWx1ZV07IH07XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdG9yLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlIDogdmFsdWUsXG4gICAgICAgIGluZGV4IDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhIDogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggPCByaWdodC5pbmRleCA/IC0xIDogMTtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0LCBiZWhhdmlvcikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSB8fCBfLmlkZW50aXR5KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICAgIChfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSA6IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSA9IDA7XG4gICAgICByZXN1bHRba2V5XSsrO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yID09IG51bGwgPyBfLmlkZW50aXR5IDogbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjb252ZXJ0IGFueXRoaW5nIGl0ZXJhYmxlIGludG8gYSByZWFsLCBsaXZlIGFycmF5LlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiAhPSBudWxsKSAmJiAhZ3VhcmQgPyBzbGljZS5jYWxsKGFycmF5LCAwLCBuKSA6IGFycmF5WzBdO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuICE9IG51bGwpICYmICFndWFyZCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb21wbGV0ZWx5IGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIGFuIGFycmF5LlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmdzLCAnbGVuZ3RoJykpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJncywgXCJcIiArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbikge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQgJiYgbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIGZ1bmNzID0gXy5mdW5jdGlvbnMob2JqKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHRpbWVvdXQsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHJlc3VsdDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZnVuY107XG4gICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICBpZiAodGltZXMgPD0gMCkgcmV0dXJuIGZ1bmMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzW2tleXMubGVuZ3RoXSA9IGtleTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHZhbHVlcy5wdXNoKG9ialtrZXldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcGFpcnMucHVzaChba2V5LCBvYmpba2V5XV0pO1xuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJlc3VsdFtvYmpba2V5XV0gPSBrZXk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBudWxsKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIEhhcm1vbnkgYGVnYWxgIHByb3Bvc2FsOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KG4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAnLyc6ICcmI3gyRjsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIHByb3BlcnR5IGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQ7XG4gIC8vIG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbn0pLmNhbGwodGhpcyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXJndiA9IHByb2Nlc3MuYXJndjtcblxudmFyIHRlcm1pbmF0b3IgPSBhcmd2LmluZGV4T2YoJy0tJyk7XG52YXIgaGFzRmxhZyA9IGZ1bmN0aW9uIChmbGFnKSB7XG5cdGZsYWcgPSAnLS0nICsgZmxhZztcblx0dmFyIHBvcyA9IGFyZ3YuaW5kZXhPZihmbGFnKTtcblx0cmV0dXJuIHBvcyAhPT0gLTEgJiYgKHRlcm1pbmF0b3IgIT09IC0xID8gcG9zIDwgdGVybWluYXRvciA6IHRydWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXHRpZiAoJ0ZPUkNFX0NPTE9SJyBpbiBwcm9jZXNzLmVudikge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ25vLWNvbG9yJykgfHxcblx0XHRoYXNGbGFnKCduby1jb2xvcnMnKSB8fFxuXHRcdGhhc0ZsYWcoJ2NvbG9yPWZhbHNlJykpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAoaGFzRmxhZygnY29sb3InKSB8fFxuXHRcdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9YWx3YXlzJykpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmIChwcm9jZXNzLnN0ZG91dCAmJiAhcHJvY2Vzcy5zdGRvdXQuaXNUVFkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0aWYgKCdDT0xPUlRFUk0nIGluIHByb2Nlc3MuZW52KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5lbnYuVEVSTSA9PT0gJ2R1bWInKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKC9ec2NyZWVufF54dGVybXxednQxMDB8Y29sb3J8YW5zaXxjeWd3aW58bGludXgvaS50ZXN0KHByb2Nlc3MuZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0aWYgKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XG5cdFx0bW9kdWxlLnBhdGhzID0gW107XG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XG5cdFx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xuXHR9XG5cdHJldHVybiBtb2R1bGU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR0eVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dGlsXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=