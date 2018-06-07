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
var IpcClient = /** @class */ (function (_super) {
    __extends(IpcClient, _super);
    function IpcClient(clientId, serverId) {
        var _this = _super.call(this) || this;
        _this.ipcServerId = serverId;
        _this.ipc = new node_ipc_1.IPC();
        _this.ipc.config.id = clientId;
        _this.ipc.config.silent = true;
        _this.ipc.retry = 1500;
        _this.ipc.connectTo(_this.ipcServerId, function () {
            _this.ipc.of[_this.ipcServerId].on('connect', function () {
                _this.emit('ipc:client:connect');
            });
        });
        return _this;
    }
    IpcClient.prototype.ipcClient = function () {
        return this.ipc.of[this.ipcServerId];
    };
    return IpcClient;
}(events_1.EventEmitter));
exports.default = IpcClient;
//# sourceMappingURL=ipc-client.js.map