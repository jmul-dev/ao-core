'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AO_CONSTANTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

var CONSTANTS = _interopRequireWildcard(_constants);

var _child_process = require('child_process');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _apolloServerExpress = require('apollo-server-express');

var _graphql = require('graphql');

var _graphql2 = _interopRequireDefault(_graphql);

var _schema = require('./graphql/schema');

var _schema2 = _interopRequireDefault(_schema);

var _database = require('./storage/database');

var _database2 = _interopRequireDefault(_database);

var _assert = require('assert');

var _path = require('path');

var _ipcServer = require('./interfaces/ipc-server');

var _ipcServer2 = _interopRequireDefault(_ipcServer);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('ao:core');
var error = (0, _debug2.default)('ao:core:error');

var AO_CONSTANTS = exports.AO_CONSTANTS = CONSTANTS;

var Core = function (_IpcServer) {
    _inherits(Core, _IpcServer);

    function Core(args) {
        _classCallCheck(this, Core);

        debug(args);

        var _this = _possibleConstructorReturn(this, (Core.__proto__ || Object.getPrototypeOf(Core)).call(this, args.ipcServerId));

        _this.options = args;
        _this.db = null;
        _this.server = null;
        _this.subProcesses = [];
        return _this;
    }

    _createClass(Core, [{
        key: 'sendEventLog',
        value: function sendEventLog(message) {
            if (process.send) {
                // If there is a parent process (running within app) we relay
                // all of the logs up.
                process.send({ event: AO_CONSTANTS.EVENT_LOG, message: message });
            } else {
                // TODO: append to a temp log somewhere (make this configurable via command line)
            }
            this.db.Log.create({ message: message });
        }
    }, {
        key: 'ipcLogListener',
        value: function ipcLogListener() {
            this.ipc.server.on(AO_CONSTANTS.EVENT_LOG, this.sendEventLog.bind(this));
        }
    }, {
        key: 'ipcListenersThatPropogateToDb',
        value: function ipcListenersThatPropogateToDb() {
            var _this2 = this;

            (0, _assert.notEqual)(this.db, null, 'ipcListenersThatPropogateToDb called without db instantiated');
            this.ipc.server.on(AO_CONSTANTS.DATA, function (data) {
                switch (data.type) {
                    case AO_CONSTANTS.DATA_TYPES.PEER_CONNECTED:
                        return _this2.db.Peer.findOrCreate({ where: { id: data.peerId } });
                    case AO_CONSTANTS.DATA_TYPES.PEER_DISCONNECTED:
                        return _this2.db.Peer.destroy({ where: { id: data.peerId } });
                    default:
                        return null;
                }
            });
        }
    }, {
        key: 'dbSetup',
        value: function dbSetup() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _this3.db = new _database2.default();
                _this3.db.init().then(function () {
                    debug('database instance created');
                    _this3.sendEventLog('Core database connected');
                    resolve();
                }).catch(function (err) {
                    error('error creating database instance', err);
                    reject(err);
                });
            });
        }
        /**
         * Note that the http server depends on both the ipc server AND the database
         */

    }, {
        key: 'httpSetup',
        value: function httpSetup() {
            var _this4 = this;

            (0, _assert.notEqual)(this.ipc, null, 'http server requires instance of ipc server');
            (0, _assert.notEqual)(this.db, null, 'http server requires instance of db');
            var expressServer = (0, _express2.default)();
            var graphqlSchema = (0, _schema2.default)(this.db);
            expressServer.use('/graphql', (0, _bodyParser.json)(), (0, _apolloServerExpress.graphqlExpress)({ schema: graphqlSchema }));
            expressServer.get('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({ endpointURL: '/graphql' })); // TODO: enable based on process.env.NODE_ENV
            this.server = expressServer.listen(this.options.httpPort, function () {
                debug('Express server running on port: ' + _this4.server.address().port);
                _this4.sendEventLog('Core http server started');
            });
            this.server.on('error', this.shutdownWithError.bind(this));
        }
    }, {
        key: 'shutdownWithError',
        value: function shutdownWithError(err) {
            var _this5 = this;

            error('core shutting down with error\n', err);
            if (this.ipc && this.ipc.server) this.ipc.server.stop();
            if (this.server !== null && this.server.close) this.server.close();
            var dbConnecitonPromise = this.db === null ? Promise.resolve() : this.db.close();
            dbConnecitonPromise.then(function () {
                for (var i = 0; i < _this5.subProcesses.length; i++) {
                    var subprocess = _this5.subProcesses[i];
                    subprocess.kill();
                }
                process.exit(1);
            });
        }
    }, {
        key: 'spinUpSubProcesses',
        value: function spinUpSubProcesses() {
            debug('attempting to spawn sub processes');
            var p2pSubProcess = (0, _child_process.spawn)('node', [(0, _path.join)(__dirname, '../dist/p2p/index.js'), '--ipcServerId', this.options.ipcServerId], { stdio: ['inherit', 'inherit', 'inherit'] });
            p2pSubProcess.on('error', function (err) {
                error('p2pSubProcess failed to start: ', err);
            });
            p2pSubProcess.on('close', function (code) {
                debug('p2pSubProcess closed on us with code: ', code);
            });
            this.subProcesses.push(p2pSubProcess);
        }
    }]);

    return Core;
}(_ipcServer2.default);

exports.default = Core;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJDT05TVEFOVFMiLCJkZWJ1ZyIsImVycm9yIiwiQU9fQ09OU1RBTlRTIiwiQ29yZSIsImFyZ3MiLCJpcGNTZXJ2ZXJJZCIsIm9wdGlvbnMiLCJkYiIsInNlcnZlciIsInN1YlByb2Nlc3NlcyIsIm1lc3NhZ2UiLCJwcm9jZXNzIiwic2VuZCIsImV2ZW50IiwiRVZFTlRfTE9HIiwiTG9nIiwiY3JlYXRlIiwiaXBjIiwib24iLCJzZW5kRXZlbnRMb2ciLCJiaW5kIiwiREFUQSIsImRhdGEiLCJ0eXBlIiwiREFUQV9UWVBFUyIsIlBFRVJfQ09OTkVDVEVEIiwiUGVlciIsImZpbmRPckNyZWF0ZSIsIndoZXJlIiwiaWQiLCJwZWVySWQiLCJQRUVSX0RJU0NPTk5FQ1RFRCIsImRlc3Ryb3kiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkRhdGFiYXNlIiwiaW5pdCIsInRoZW4iLCJjYXRjaCIsImVyciIsImV4cHJlc3NTZXJ2ZXIiLCJncmFwaHFsU2NoZW1hIiwidXNlIiwic2NoZW1hIiwiZ2V0IiwiZW5kcG9pbnRVUkwiLCJsaXN0ZW4iLCJodHRwUG9ydCIsImFkZHJlc3MiLCJwb3J0Iiwic2h1dGRvd25XaXRoRXJyb3IiLCJzdG9wIiwiY2xvc2UiLCJkYkNvbm5lY2l0b25Qcm9taXNlIiwiaSIsImxlbmd0aCIsInN1YnByb2Nlc3MiLCJraWxsIiwiZXhpdCIsInAycFN1YlByb2Nlc3MiLCJfX2Rpcm5hbWUiLCJzdGRpbyIsImNvZGUiLCJwdXNoIiwiSXBjU2VydmVyIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FBR0E7O0lBQVlBLFM7O0FBQ1o7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUNBLElBQU1DLFFBQVEscUJBQU0sU0FBTixDQUFkO0FBQ0EsSUFBTUMsUUFBUSxxQkFBTSxlQUFO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TCxFQUFnQixzQkFBaEIsQ0FBRCxFQUEwQyxlQUExQyxFQUEyRCxLQUFLdkQsT0FBTCxDQUFhRCxXQUF4RSxDQUFkLEVBQW9HLEVBQUN5RCxPQUFPLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsU0FBdkIsQ0FBUixFQUFwRyxDQUF0QjtBQUNBRiwwQkFBYzFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsVUFBQ3NCLEdBQUQsRUFBUztBQUMvQnZDLHNCQUFNLGlDQUFOLEVBQXlDdUMsR0FBekM7QUFDSCxhQUZEO0FBR0FvQiwwQkFBYzFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsVUFBQzZDLElBQUQsRUFBVTtBQUNoQy9ELHNCQUFNLHdDQUFOLEVBQWdEK0QsSUFBaEQ7QUFDSCxhQUZEO0FBR0EsaUJBQUt0RCxZQUFMLENBQWtCdUQsSUFBbEIsQ0FBdUJKLGFBQXZCO0FBQ0g7Ozs7RUExRjZCSyxtQjs7a0JBQWI5RCxJIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5cbmltcG9ydCAqIGFzIENPTlNUQU5UUyBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsganNvbiB9IGZyb20gXCJib2R5LXBhcnNlclwiO1xuaW1wb3J0IHsgZ3JhcGhxbEV4cHJlc3MsIGdyYXBoaXFsRXhwcmVzcyB9IGZyb20gXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIjtcbmltcG9ydCBncmFwaHFsIGZyb20gXCJncmFwaHFsXCI7XG5pbXBvcnQgc2NoZW1hIGZyb20gXCIuL2dyYXBocWwvc2NoZW1hXCI7XG5pbXBvcnQgRGF0YWJhc2UgZnJvbSBcIi4vc3RvcmFnZS9kYXRhYmFzZVwiO1xuaW1wb3J0IHsgbm90RXF1YWwgfSBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBJcGNTZXJ2ZXIgZnJvbSBcIi4vaW50ZXJmYWNlcy9pcGMtc2VydmVyXCI7XG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuY29uc3QgZGVidWcgPSBEZWJ1ZygnYW86Y29yZScpXG5jb25zdCBlcnJvciA9IERlYnVnKCdhbzpjb3JlOmVycm9yJylcblxuXG5leHBvcnQgY29uc3QgQU9fQ09OU1RBTlRTID0gQ09OU1RBTlRTO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3JlIGV4dGVuZHMgSXBjU2VydmVyIHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgICAgIGRlYnVnKGFyZ3MpXG4gICAgICAgIHN1cGVyKGFyZ3MuaXBjU2VydmVySWQpXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGFyZ3NcbiAgICAgICAgdGhpcy5kYiA9IG51bGxcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBudWxsXG4gICAgICAgIHRoaXMuc3ViUHJvY2Vzc2VzID0gW11cbiAgICB9XG4gICAgc2VuZEV2ZW50TG9nKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKCBwcm9jZXNzLnNlbmQgKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHBhcmVudCBwcm9jZXNzIChydW5uaW5nIHdpdGhpbiBhcHApIHdlIHJlbGF5XG4gICAgICAgICAgICAvLyBhbGwgb2YgdGhlIGxvZ3MgdXAuXG4gICAgICAgICAgICBwcm9jZXNzLnNlbmQoe2V2ZW50OiBBT19DT05TVEFOVFMuRVZFTlRfTE9HLCBtZXNzYWdlOiBtZXNzYWdlfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBhcHBlbmQgdG8gYSB0ZW1wIGxvZyBzb21ld2hlcmUgKG1ha2UgdGhpcyBjb25maWd1cmFibGUgdmlhIGNvbW1hbmQgbGluZSlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRiLkxvZy5jcmVhdGUoe21lc3NhZ2U6IG1lc3NhZ2V9KTtcbiAgICB9XG4gICAgaXBjTG9nTGlzdGVuZXIoKSB7XG4gICAgICAgIHRoaXMuaXBjLnNlcnZlci5vbihBT19DT05TVEFOVFMuRVZFTlRfTE9HLCB0aGlzLnNlbmRFdmVudExvZy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaXBjTGlzdGVuZXJzVGhhdFByb3BvZ2F0ZVRvRGIoKSB7XG4gICAgICAgIG5vdEVxdWFsKHRoaXMuZGIsIG51bGwsICdpcGNMaXN0ZW5lcnNUaGF0UHJvcG9nYXRlVG9EYiBjYWxsZWQgd2l0aG91dCBkYiBpbnN0YW50aWF0ZWQnKVxuICAgICAgICB0aGlzLmlwYy5zZXJ2ZXIub24oQU9fQ09OU1RBTlRTLkRBVEEsIChkYXRhKSA9PiB7ICAgICAgICAgICBcbiAgICAgICAgICAgIHN3aXRjaChkYXRhLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEFPX0NPTlNUQU5UUy5EQVRBX1RZUEVTLlBFRVJfQ09OTkVDVEVEOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYi5QZWVyLmZpbmRPckNyZWF0ZSh7d2hlcmU6IHtpZDogZGF0YS5wZWVySWR9fSlcbiAgICAgICAgICAgICAgICBjYXNlIEFPX0NPTlNUQU5UUy5EQVRBX1RZUEVTLlBFRVJfRElTQ09OTkVDVEVEOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYi5QZWVyLmRlc3Ryb3koe3doZXJlOiB7IGlkOiBkYXRhLnBlZXJJZCB9fSlcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGJTZXR1cCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIgPSBuZXcgRGF0YWJhc2UoKVxuICAgICAgICAgICAgdGhpcy5kYi5pbml0KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ2RhdGFiYXNlIGluc3RhbmNlIGNyZWF0ZWQnKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZEV2ZW50TG9nKCdDb3JlIGRhdGFiYXNlIGNvbm5lY3RlZCcpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICBlcnJvcignZXJyb3IgY3JlYXRpbmcgZGF0YWJhc2UgaW5zdGFuY2UnLCBlcnIpXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIFxuICAgIH1cbiAgICAvKipcbiAgICAgKiBOb3RlIHRoYXQgdGhlIGh0dHAgc2VydmVyIGRlcGVuZHMgb24gYm90aCB0aGUgaXBjIHNlcnZlciBBTkQgdGhlIGRhdGFiYXNlXG4gICAgICovXG4gICAgaHR0cFNldHVwKCkge1xuICAgICAgICBub3RFcXVhbCh0aGlzLmlwYywgbnVsbCwgJ2h0dHAgc2VydmVyIHJlcXVpcmVzIGluc3RhbmNlIG9mIGlwYyBzZXJ2ZXInKTtcbiAgICAgICAgbm90RXF1YWwodGhpcy5kYiwgbnVsbCwgJ2h0dHAgc2VydmVyIHJlcXVpcmVzIGluc3RhbmNlIG9mIGRiJyk7XG4gICAgICAgIGNvbnN0IGV4cHJlc3NTZXJ2ZXIgPSBleHByZXNzKCk7XG4gICAgICAgIGNvbnN0IGdyYXBocWxTY2hlbWEgPSBzY2hlbWEodGhpcy5kYik7XG4gICAgICAgIGV4cHJlc3NTZXJ2ZXIudXNlKCcvZ3JhcGhxbCcsIGpzb24oKSwgZ3JhcGhxbEV4cHJlc3MoeyBzY2hlbWE6IGdyYXBocWxTY2hlbWEgfSkpO1xuICAgICAgICBleHByZXNzU2VydmVyLmdldCgnL2dyYXBoaXFsJywgZ3JhcGhpcWxFeHByZXNzKHsgZW5kcG9pbnRVUkw6ICcvZ3JhcGhxbCcgfSkpOyAvLyBUT0RPOiBlbmFibGUgYmFzZWQgb24gcHJvY2Vzcy5lbnYuTk9ERV9FTlZcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBleHByZXNzU2VydmVyLmxpc3Rlbih0aGlzLm9wdGlvbnMuaHR0cFBvcnQsICgpID0+IHtcbiAgICAgICAgICAgIGRlYnVnKCdFeHByZXNzIHNlcnZlciBydW5uaW5nIG9uIHBvcnQ6ICcgKyB0aGlzLnNlcnZlci5hZGRyZXNzKCkucG9ydCk7XG4gICAgICAgICAgICB0aGlzLnNlbmRFdmVudExvZygnQ29yZSBodHRwIHNlcnZlciBzdGFydGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnNlcnZlci5vbignZXJyb3InLCB0aGlzLnNodXRkb3duV2l0aEVycm9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBzaHV0ZG93bldpdGhFcnJvcihlcnIpIHtcbiAgICAgICAgZXJyb3IoJ2NvcmUgc2h1dHRpbmcgZG93biB3aXRoIGVycm9yXFxuJywgZXJyKTtcbiAgICAgICAgaWYgKCB0aGlzLmlwYyAmJiB0aGlzLmlwYy5zZXJ2ZXIgKVxuICAgICAgICAgICAgdGhpcy5pcGMuc2VydmVyLnN0b3AoKTtcbiAgICAgICAgaWYgKCB0aGlzLnNlcnZlciAhPT0gbnVsbCAmJiB0aGlzLnNlcnZlci5jbG9zZSApXG4gICAgICAgICAgICB0aGlzLnNlcnZlci5jbG9zZSgpO1xuICAgICAgICBjb25zdCBkYkNvbm5lY2l0b25Qcm9taXNlID0gdGhpcy5kYiA9PT0gbnVsbCA/IFByb21pc2UucmVzb2x2ZSgpIDogdGhpcy5kYi5jbG9zZSgpXG4gICAgICAgIGRiQ29ubmVjaXRvblByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3ViUHJvY2Vzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicHJvY2VzcyA9IHRoaXMuc3ViUHJvY2Vzc2VzW2ldO1xuICAgICAgICAgICAgICAgIHN1YnByb2Nlc3Mua2lsbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xuICAgICAgICB9KVxuICAgIH1cbiAgICBzcGluVXBTdWJQcm9jZXNzZXMoKSB7XG4gICAgICAgIGRlYnVnKCdhdHRlbXB0aW5nIHRvIHNwYXduIHN1YiBwcm9jZXNzZXMnKVxuICAgICAgICBjb25zdCBwMnBTdWJQcm9jZXNzID0gc3Bhd24oJ25vZGUnLCBbam9pbihfX2Rpcm5hbWUsICcuLi9kaXN0L3AycC9pbmRleC5qcycpLCAnLS1pcGNTZXJ2ZXJJZCcsIHRoaXMub3B0aW9ucy5pcGNTZXJ2ZXJJZF0sIHtzdGRpbzogWydpbmhlcml0JywgJ2luaGVyaXQnLCAnaW5oZXJpdCddfSlcbiAgICAgICAgcDJwU3ViUHJvY2Vzcy5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBlcnJvcigncDJwU3ViUHJvY2VzcyBmYWlsZWQgdG8gc3RhcnQ6ICcsIGVycilcbiAgICAgICAgfSlcbiAgICAgICAgcDJwU3ViUHJvY2Vzcy5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuICAgICAgICAgICAgZGVidWcoJ3AycFN1YlByb2Nlc3MgY2xvc2VkIG9uIHVzIHdpdGggY29kZTogJywgY29kZSlcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5zdWJQcm9jZXNzZXMucHVzaChwMnBTdWJQcm9jZXNzKVxuICAgIH1cbn0iXX0=