'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeIpc = require("node-ipc");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IpcServer = function (_EventEmitter) {
    _inherits(IpcServer, _EventEmitter);

    function IpcServer(serverId) {
        _classCallCheck(this, IpcServer);

        var _this = _possibleConstructorReturn(this, (IpcServer.__proto__ || Object.getPrototypeOf(IpcServer)).call(this));

        _this.ipc = new _nodeIpc.IPC();
        _this.ipc.config.id = serverId;
        _this.ipc.config.silent = true;
        _this.ipc.serve();
        _this.ipc.server.start();
        _this.ipc.server.on('error', function () {
            _this.emit('ipc:server:error', error);
        });
        _this.ipc.server.on('start', function () {
            _this.emit('ipc:server:start');
        });
        return _this;
    }

    return IpcServer;
}(_events2.default);

exports.default = IpcServer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnRlcmZhY2VzL2lwYy1zZXJ2ZXIuanMiXSwibmFtZXMiOlsiSXBjU2VydmVyIiwic2VydmVySWQiLCJpcGMiLCJJUEMiLCJjb25maWciLCJpZCIsInNpbGVudCIsInNlcnZlIiwic2VydmVyIiwic3RhcnQiLCJvbiIsImVtaXQiLCJlcnJvciIsIkV2ZW50RW1pdHRlciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTUEsUzs7O0FBQ0YsdUJBQVlDLFFBQVosRUFBc0I7QUFBQTs7QUFBQTs7QUFFbEIsY0FBS0MsR0FBTCxHQUFXLElBQUlDLFlBQUosRUFBWDtBQUNBLGNBQUtELEdBQUwsQ0FBU0UsTUFBVCxDQUFnQkMsRUFBaEIsR0FBcUJKLFFBQXJCO0FBQ0EsY0FBS0MsR0FBTCxDQUFTRSxNQUFULENBQWdCRSxNQUFoQixHQUF5QixJQUF6QjtBQUNBLGNBQUtKLEdBQUwsQ0FBU0ssS0FBVDtBQUNBLGNBQUtMLEdBQUwsQ0FBU00sTUFBVCxDQUFnQkMsS0FBaEI7QUFDQSxjQUFLUCxHQUFMLENBQVNNLE1BQVQsQ0FBZ0JFLEVBQWhCLENBQW1CLE9BQW5CLEVBQTRCLFlBQU07QUFDOUIsa0JBQUtDLElBQUwsQ0FBVSxrQkFBVixFQUE4QkMsS0FBOUI7QUFDSCxTQUZEO0FBR0EsY0FBS1YsR0FBTCxDQUFTTSxNQUFULENBQWdCRSxFQUFoQixDQUFtQixPQUFuQixFQUE0QixZQUFNO0FBQzlCLGtCQUFLQyxJQUFMLENBQVUsa0JBQVY7QUFDSCxTQUZEO0FBVmtCO0FBYXJCOzs7RUFkbUJFLGdCOztrQkFnQlRiLFMiLCJmaWxlIjoiaXBjLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbmltcG9ydCB7IElQQyB9IGZyb20gXCJub2RlLWlwY1wiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmNsYXNzIElwY1NlcnZlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3Ioc2VydmVySWQpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICB0aGlzLmlwYyA9IG5ldyBJUEMoKTtcbiAgICAgICAgdGhpcy5pcGMuY29uZmlnLmlkID0gc2VydmVySWQ7XG4gICAgICAgIHRoaXMuaXBjLmNvbmZpZy5zaWxlbnQgPSB0cnVlO1xuICAgICAgICB0aGlzLmlwYy5zZXJ2ZSgpO1xuICAgICAgICB0aGlzLmlwYy5zZXJ2ZXIuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5pcGMuc2VydmVyLm9uKCdlcnJvcicsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnaXBjOnNlcnZlcjplcnJvcicsIGVycm9yKVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5pcGMuc2VydmVyLm9uKCdzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnaXBjOnNlcnZlcjpzdGFydCcpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBkZWZhdWx0IElwY1NlcnZlcjsiXX0=