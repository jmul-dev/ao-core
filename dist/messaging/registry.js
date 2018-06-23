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
var jsonschema_1 = require("jsonschema");
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
//Fake data for now.  We'll have to do an FS read, & encryption/decryption for this.
var model_registry = [
    {
        priority: 0,
        name: 'p2pSubProcess',
        type: 'system',
        file: '../dist/p2p/index.js',
    }
];
var Registry = /** @class */ (function () {
    function Registry() {
        this.registry_schema = registry_schema_1.default;
        this.process_schema = process_schema_1.default;
    }
    Registry.prototype.loadRegistry = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //read from FS and decode later using a key? will have to figure this out.
                        _this.model_registry = model_registry;
                        resolve(model_registry);
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
    Registry.prototype.addProcess = function (process_object) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, result, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.model_registry) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.loadRegistry()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        error(err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        result = jsonschema_1.validate(process_object, this.process_schema);
                        if (result.valid) {
                            record = this.findInRegistry(process_object.registry_name);
                            record;
                        }
                        else {
                            error('Process validation failed');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Registry.prototype.findInRegistry = function (name) {
        for (var i = 0; i < this.model_registry.length; i++) {
            var item = this.model_registry[i];
            if (item.name == name) {
                return item;
            }
        }
    };
    Registry.prototype.send = function (message) {
        //verify the message with the registry
    };
    Registry.prototype.verify = function () {
        //verify that we do/don't fail the registry
        if (true) {
            return { test: 'test' };
        }
        else {
            return { error: 'not good' };
        }
    };
    return Registry;
}());
exports.default = Registry;
//# sourceMappingURL=registry.js.map