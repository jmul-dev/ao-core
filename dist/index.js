'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var AORouter_1 = __importDefault(require("./router/AORouter"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var Core = /** @class */ (function () {
    function Core(args) {
        debug(args);
        this.options = args;
        this.coreRouter = new AORouter_1.default(args);
        this.coreRouter.init();
        // TODO: setup coreRouter event listeners (eg: http shutdown/error)
        this.coreRouter.router.on('/core/log', this._handleLog.bind(this));
        process.stdin.resume(); // Hack to keep the core processes running
    }
    // NOTE: this is useful for sending event logs up to the 
    // electron wrapper (if exists) without going through the http
    // interface. 
    Core.prototype._handleLog = function (request) {
        var data = request.data;
        if (process.send) {
            // If there is a parent process (running within app) we relay
            // all of the logs up.
            process.send({ event: constants_1.EVENT_LOG, message: data.message });
        }
        else {
            // TODO: append to a temp log somewhere (make this configurable via command line)
        }
        this.coreRouter.router.send('/db/logs/insert', {
            message: data.message,
            createdAt: Date.now()
        }).then(request.respond).catch(request.reject);
    };
    Core.prototype.shutdownWithError = function (err) {
        error('core shutting down with error\n', err);
        this.coreRouter.shutdown();
        process.exit(1);
    };
    return Core;
}());
exports.default = Core;
//# sourceMappingURL=index.js.map