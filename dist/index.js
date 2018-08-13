'use strict';
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
var constants_1 = require("./constants");
var AORouter_1 = __importDefault(require("./router/AORouter"));
var http_1 = __importDefault(require("./modules/http/http"));
var debug_1 = __importDefault(require("debug"));
var events_1 = require("events");
var path_1 = __importDefault(require("path"));
var debug = debug_1.default('ao:core');
var error = debug_1.default('ao:core:error');
var Core = /** @class */ (function (_super) {
    __extends(Core, _super);
    function Core(args) {
        if (args === void 0) { args = Core.DEFAULT_OPTIONS; }
        var _this = _super.call(this) || this;
        _this.options = Object.assign({}, Core.DEFAULT_OPTIONS, args);
        debug(_this.options);
        _this.coreRouter = new AORouter_1.default(_this.options);
        _this.coreRouter.init();
        // TODO: setup coreRouter event listeners (eg: http shutdown/error)
        _this.coreRouter.router.on('/core/log', _this._handleLog.bind(_this));
        _this.http = new http_1.default(_this.coreRouter.router, _this.options);
        process.stdin.resume(); // Hack to keep the core processes running
        return _this;
    }
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
        this.emit('log', { message: data.message });
    };
    Core.prototype.shutdownWithError = function (err) {
        error('core shutting down with error\n', err);
        this.coreRouter.shutdown();
        process.exit(1);
    };
    Core.DEFAULT_OPTIONS = {
        disableHttpInterface: false,
        corePort: 3003,
        coreOrigin: 'http://localhost',
        httpOrigin: 'http://localhost:3000',
        storageLocation: path_1.default.resolve(__dirname, '..', 'data'),
    };
    return Core;
}(events_1.EventEmitter));
exports.default = Core;
//# sourceMappingURL=index.js.map