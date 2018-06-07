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
Object.defineProperty(exports, "__esModule", { value: true });
var node_ipc_1 = require("node-ipc");
var events_1 = require("events");
var IpcServer = /** @class */ (function (_super) {
    __extends(IpcServer, _super);
    function IpcServer(serverId) {
        var _this = _super.call(this) || this;
        _this.ipc = new node_ipc_1.IPC();
        _this.ipc.config.id = serverId;
        _this.ipc.config.silent = true;
        _this.ipc.serve();
        _this.ipc.server.start();
        _this.ipc.server.on('error', function (error) {
            _this.emit('ipc:server:error', error);
        });
        _this.ipc.server.on('start', function () {
            _this.emit('ipc:server:start');
        });
        return _this;
    }
    return IpcServer;
}(events_1.EventEmitter));
exports.default = IpcServer;
//# sourceMappingURL=ipc-server.js.map