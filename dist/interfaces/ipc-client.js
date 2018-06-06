'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeIpc = require("node-ipc");

var _constants = require("../constants.js");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IpcClient = function (_EventEmitter) {
    _inherits(IpcClient, _EventEmitter);

    function IpcClient(clientId, serverId) {
        _classCallCheck(this, IpcClient);

        var _this = _possibleConstructorReturn(this, (IpcClient.__proto__ || Object.getPrototypeOf(IpcClient)).call(this));

        _this.ipcServerId = serverId;
        _this.ipc = new _nodeIpc.IPC();
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

    _createClass(IpcClient, [{
        key: "ipcClient",
        value: function ipcClient() {
            return this.ipc.of[this.ipcServerId];
        }
    }]);

    return IpcClient;
}(_events2.default);

exports.default = IpcClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbnRlcmZhY2VzL2lwYy1jbGllbnQuanMiXSwibmFtZXMiOlsiSXBjQ2xpZW50IiwiY2xpZW50SWQiLCJzZXJ2ZXJJZCIsImlwY1NlcnZlcklkIiwiaXBjIiwiSVBDIiwiY29uZmlnIiwiaWQiLCJzaWxlbnQiLCJyZXRyeSIsImNvbm5lY3RUbyIsIm9mIiwib24iLCJlbWl0IiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU1BLFM7OztBQUNGLHVCQUFZQyxRQUFaLEVBQXNCQyxRQUF0QixFQUFnQztBQUFBOztBQUFBOztBQUU1QixjQUFLQyxXQUFMLEdBQW1CRCxRQUFuQjtBQUNBLGNBQUtFLEdBQUwsR0FBVyxJQUFJQyxZQUFKLEVBQVg7QUFDQSxjQUFLRCxHQUFMLENBQVNFLE1BQVQsQ0FBZ0JDLEVBQWhCLEdBQXFCTixRQUFyQjtBQUNBLGNBQUtHLEdBQUwsQ0FBU0UsTUFBVCxDQUFnQkUsTUFBaEIsR0FBeUIsSUFBekI7QUFDQSxjQUFLSixHQUFMLENBQVNLLEtBQVQsR0FBaUIsSUFBakI7QUFDQSxjQUFLTCxHQUFMLENBQVNNLFNBQVQsQ0FBbUIsTUFBS1AsV0FBeEIsRUFBcUMsWUFBTTtBQUN2QyxrQkFBS0MsR0FBTCxDQUFTTyxFQUFULENBQVksTUFBS1IsV0FBakIsRUFBOEJTLEVBQTlCLENBQWlDLFNBQWpDLEVBQTRDLFlBQU07QUFDOUMsc0JBQUtDLElBQUwsQ0FBVSxvQkFBVjtBQUNILGFBRkQ7QUFHSCxTQUpEO0FBUDRCO0FBWS9COzs7O29DQUNXO0FBQ1IsbUJBQU8sS0FBS1QsR0FBTCxDQUFTTyxFQUFULENBQVksS0FBS1IsV0FBakIsQ0FBUDtBQUNIOzs7O0VBaEJtQlcsZ0I7O2tCQWtCVGQsUyIsImZpbGUiOiJpcGMtY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHsgSVBDIH0gZnJvbSBcIm5vZGUtaXBjXCI7XG5pbXBvcnQgeyBJUENfU0VSVkVSX0lEIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmNsYXNzIElwY0NsaWVudCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgY29uc3RydWN0b3IoY2xpZW50SWQsIHNlcnZlcklkKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5pcGNTZXJ2ZXJJZCA9IHNlcnZlcklkXG4gICAgICAgIHRoaXMuaXBjID0gbmV3IElQQygpO1xuICAgICAgICB0aGlzLmlwYy5jb25maWcuaWQgPSBjbGllbnRJZDtcbiAgICAgICAgdGhpcy5pcGMuY29uZmlnLnNpbGVudCA9IHRydWU7XG4gICAgICAgIHRoaXMuaXBjLnJldHJ5ID0gMTUwMDtcbiAgICAgICAgdGhpcy5pcGMuY29ubmVjdFRvKHRoaXMuaXBjU2VydmVySWQsICgpID0+IHsgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaXBjLm9mW3RoaXMuaXBjU2VydmVySWRdLm9uKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnaXBjOmNsaWVudDpjb25uZWN0JylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pICAgICAgICBcbiAgICB9XG4gICAgaXBjQ2xpZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pcGMub2ZbdGhpcy5pcGNTZXJ2ZXJJZF1cbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBJcGNDbGllbnQ7Il19