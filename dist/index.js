'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('./constants');

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('ao:core');
var error = (0, _debug2.default)('ao:core:error');

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
                process.send({ event: _constants.EVENT_LOG, message: message });
            } else {
                // TODO: append to a temp log somewhere (make this configurable via command line)
            }
            this.db.Log.create({ message: message });
        }
    }, {
        key: 'ipcLogListener',
        value: function ipcLogListener() {
            this.ipc.server.on(_constants.EVENT_LOG, this.sendEventLog.bind(this));
        }
    }, {
        key: 'ipcListenersThatPropogateToDb',
        value: function ipcListenersThatPropogateToDb() {
            var _this2 = this;

            (0, _assert.notEqual)(this.db, null, 'ipcListenersThatPropogateToDb called without db instantiated');
            this.ipc.server.on(_constants.DATA, function (data) {
                switch (data.type) {
                    case _constants.DATA_TYPES.PEER_CONNECTED:
                        return _this2.db.Peer.findOrCreate({ where: { id: data.peerId } });
                    case _constants.DATA_TYPES.PEER_DISCONNECTED:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsImVycm9yIiwiQ29yZSIsImFyZ3MiLCJpcGNTZXJ2ZXJJZCIsIm9wdGlvbnMiLCJkYiIsInNlcnZlciIsInN1YlByb2Nlc3NlcyIsIm1lc3NhZ2UiLCJwcm9jZXNzIiwic2VuZCIsImV2ZW50IiwiRVZFTlRfTE9HIiwiTG9nIiwiY3JlYXRlIiwiaXBjIiwib24iLCJzZW5kRXZlbnRMb2ciLCJiaW5kIiwiREFUQSIsImRhdGEiLCJ0eXBlIiwiREFUQV9UWVBFUyIsIlBFRVJfQ09OTkVDVEVEIiwiUGVlciIsImZpbmRPckNyZWF0ZSIsIndoZXJlIiwiaWQiLCJwZWVySWQiLCJQRUVSX0RJU0NPTk5FQ1RFRCIsImRlc3Ryb3kiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkRhdGFiYXNlIiwiaW5pdCIsInRoZW4iLCJjYXRjaCIsImVyciIsImV4cHJlc3NTZXJ2ZXIiLCJncmFwaHFsU2NoZW1hIiwidXNlIiwic2NoZW1hIiwiZ2V0IiwiZW5kcG9pbnRVUkwiLCJsaXN0ZW4iLCJodHRwUG9ydCIsImFkZHJlc3MiLCJwb3J0Iiwic2h1dGRvd25XaXRoRXJyb3IiLCJzdG9wIiwiY2xvc2UiLCJkYkNvbm5lY2l0b25Qcm9taXNlIiwiaSIsImxlbmd0aCIsInN1YnByb2Nlc3MiLCJraWxsIiwiZXhpdCIsInAycFN1YlByb2Nlc3MiLCJfX2Rpcm5hbWUiLCJzdGRpbyIsImNvZGUiLCJwdXNoIiwiSXBjU2VydmVyIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUNBLElBQU1BLFFBQVEscUJBQU0sU0FBTixDQUFkO0FBQ0EsSUFBTUMsUUFBUSxxQkFBTSxlQUFOLENBQWQ7O0lBR3FCQyxJOzs7QUFDakIsa0JBQVlDLElBQVosRUFB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QixTQUF2QixDQUFSLEVBQXBHLENBQXRCO0FBQ0FGLDBCQUFjMUMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixVQUFDc0IsR0FBRCxFQUFTO0FBQy9CdEMsc0JBQU0saUNBQU4sRUFBeUNzQyxHQUF6QztBQUNILGFBRkQ7QUFHQW9CLDBCQUFjMUMsRUFBZCxDQUFpQixPQUFqQixFQUEwQixVQUFDNkMsSUFBRCxFQUFVO0FBQ2hDOUQsc0JBQU0sd0NBQU4sRUFBZ0Q4RCxJQUFoRDtBQUNILGFBRkQ7QUFHQSxpQkFBS3RELFlBQUwsQ0FBa0J1RCxJQUFsQixDQUF1QkosYUFBdkI7QUFDSDs7OztFQTFGNkJLLG1COztrQkFBYjlELEkiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5pbXBvcnQgeyBFVkVOVF9MT0csIERBVEEsIERBVEFfVFlQRVMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5pbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsganNvbiB9IGZyb20gXCJib2R5LXBhcnNlclwiO1xuaW1wb3J0IHsgZ3JhcGhxbEV4cHJlc3MsIGdyYXBoaXFsRXhwcmVzcyB9IGZyb20gXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIjtcbmltcG9ydCBncmFwaHFsIGZyb20gXCJncmFwaHFsXCI7XG5pbXBvcnQgc2NoZW1hIGZyb20gXCIuL2dyYXBocWwvc2NoZW1hXCI7XG5pbXBvcnQgRGF0YWJhc2UgZnJvbSBcIi4vc3RvcmFnZS9kYXRhYmFzZVwiO1xuaW1wb3J0IHsgbm90RXF1YWwgfSBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCBJcGNTZXJ2ZXIgZnJvbSBcIi4vaW50ZXJmYWNlcy9pcGMtc2VydmVyXCI7XG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuY29uc3QgZGVidWcgPSBEZWJ1ZygnYW86Y29yZScpXG5jb25zdCBlcnJvciA9IERlYnVnKCdhbzpjb3JlOmVycm9yJylcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3JlIGV4dGVuZHMgSXBjU2VydmVyIHtcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XG4gICAgICAgIGRlYnVnKGFyZ3MpXG4gICAgICAgIHN1cGVyKGFyZ3MuaXBjU2VydmVySWQpXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGFyZ3NcbiAgICAgICAgdGhpcy5kYiA9IG51bGxcbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSBudWxsXG4gICAgICAgIHRoaXMuc3ViUHJvY2Vzc2VzID0gW11cbiAgICB9XG4gICAgc2VuZEV2ZW50TG9nKG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKCBwcm9jZXNzLnNlbmQgKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHBhcmVudCBwcm9jZXNzIChydW5uaW5nIHdpdGhpbiBhcHApIHdlIHJlbGF5XG4gICAgICAgICAgICAvLyBhbGwgb2YgdGhlIGxvZ3MgdXAuXG4gICAgICAgICAgICBwcm9jZXNzLnNlbmQoe2V2ZW50OiBFVkVOVF9MT0csIG1lc3NhZ2U6IG1lc3NhZ2V9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGFwcGVuZCB0byBhIHRlbXAgbG9nIHNvbWV3aGVyZSAobWFrZSB0aGlzIGNvbmZpZ3VyYWJsZSB2aWEgY29tbWFuZCBsaW5lKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGIuTG9nLmNyZWF0ZSh7bWVzc2FnZTogbWVzc2FnZX0pO1xuICAgIH1cbiAgICBpcGNMb2dMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5pcGMuc2VydmVyLm9uKEVWRU5UX0xPRywgdGhpcy5zZW5kRXZlbnRMb2cuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlwY0xpc3RlbmVyc1RoYXRQcm9wb2dhdGVUb0RiKCkge1xuICAgICAgICBub3RFcXVhbCh0aGlzLmRiLCBudWxsLCAnaXBjTGlzdGVuZXJzVGhhdFByb3BvZ2F0ZVRvRGIgY2FsbGVkIHdpdGhvdXQgZGIgaW5zdGFudGlhdGVkJylcbiAgICAgICAgdGhpcy5pcGMuc2VydmVyLm9uKERBVEEsIChkYXRhKSA9PiB7ICAgICAgICAgICBcbiAgICAgICAgICAgIHN3aXRjaChkYXRhLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIERBVEFfVFlQRVMuUEVFUl9DT05ORUNURUQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRiLlBlZXIuZmluZE9yQ3JlYXRlKHt3aGVyZToge2lkOiBkYXRhLnBlZXJJZH19KVxuICAgICAgICAgICAgICAgIGNhc2UgREFUQV9UWVBFUy5QRUVSX0RJU0NPTk5FQ1RFRDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGIuUGVlci5kZXN0cm95KHt3aGVyZTogeyBpZDogZGF0YS5wZWVySWQgfX0pXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRiU2V0dXAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRiID0gbmV3IERhdGFiYXNlKClcbiAgICAgICAgICAgIHRoaXMuZGIuaW5pdCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdkYXRhYmFzZSBpbnN0YW5jZSBjcmVhdGVkJylcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRFdmVudExvZygnQ29yZSBkYXRhYmFzZSBjb25uZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgZXJyb3IoJ2Vycm9yIGNyZWF0aW5nIGRhdGFiYXNlIGluc3RhbmNlJywgZXJyKVxuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBcbiAgICB9XG4gICAgLyoqXG4gICAgICogTm90ZSB0aGF0IHRoZSBodHRwIHNlcnZlciBkZXBlbmRzIG9uIGJvdGggdGhlIGlwYyBzZXJ2ZXIgQU5EIHRoZSBkYXRhYmFzZVxuICAgICAqL1xuICAgIGh0dHBTZXR1cCgpIHtcbiAgICAgICAgbm90RXF1YWwodGhpcy5pcGMsIG51bGwsICdodHRwIHNlcnZlciByZXF1aXJlcyBpbnN0YW5jZSBvZiBpcGMgc2VydmVyJyk7XG4gICAgICAgIG5vdEVxdWFsKHRoaXMuZGIsIG51bGwsICdodHRwIHNlcnZlciByZXF1aXJlcyBpbnN0YW5jZSBvZiBkYicpO1xuICAgICAgICBjb25zdCBleHByZXNzU2VydmVyID0gZXhwcmVzcygpO1xuICAgICAgICBjb25zdCBncmFwaHFsU2NoZW1hID0gc2NoZW1hKHRoaXMuZGIpO1xuICAgICAgICBleHByZXNzU2VydmVyLnVzZSgnL2dyYXBocWwnLCBqc29uKCksIGdyYXBocWxFeHByZXNzKHsgc2NoZW1hOiBncmFwaHFsU2NoZW1hIH0pKTtcbiAgICAgICAgZXhwcmVzc1NlcnZlci5nZXQoJy9ncmFwaGlxbCcsIGdyYXBoaXFsRXhwcmVzcyh7IGVuZHBvaW50VVJMOiAnL2dyYXBocWwnIH0pKTsgLy8gVE9ETzogZW5hYmxlIGJhc2VkIG9uIHByb2Nlc3MuZW52Lk5PREVfRU5WXG4gICAgICAgIHRoaXMuc2VydmVyID0gZXhwcmVzc1NlcnZlci5saXN0ZW4odGhpcy5vcHRpb25zLmh0dHBQb3J0LCAoKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZygnRXhwcmVzcyBzZXJ2ZXIgcnVubmluZyBvbiBwb3J0OiAnICsgdGhpcy5zZXJ2ZXIuYWRkcmVzcygpLnBvcnQpO1xuICAgICAgICAgICAgdGhpcy5zZW5kRXZlbnRMb2coJ0NvcmUgaHR0cCBzZXJ2ZXIgc3RhcnRlZCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXJ2ZXIub24oJ2Vycm9yJywgdGhpcy5zaHV0ZG93bldpdGhFcnJvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgc2h1dGRvd25XaXRoRXJyb3IoZXJyKSB7XG4gICAgICAgIGVycm9yKCdjb3JlIHNodXR0aW5nIGRvd24gd2l0aCBlcnJvclxcbicsIGVycik7XG4gICAgICAgIGlmICggdGhpcy5pcGMgJiYgdGhpcy5pcGMuc2VydmVyIClcbiAgICAgICAgICAgIHRoaXMuaXBjLnNlcnZlci5zdG9wKCk7XG4gICAgICAgIGlmICggdGhpcy5zZXJ2ZXIgIT09IG51bGwgJiYgdGhpcy5zZXJ2ZXIuY2xvc2UgKVxuICAgICAgICAgICAgdGhpcy5zZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgY29uc3QgZGJDb25uZWNpdG9uUHJvbWlzZSA9IHRoaXMuZGIgPT09IG51bGwgPyBQcm9taXNlLnJlc29sdmUoKSA6IHRoaXMuZGIuY2xvc2UoKVxuICAgICAgICBkYkNvbm5lY2l0b25Qcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN1YlByb2Nlc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnByb2Nlc3MgPSB0aGlzLnN1YlByb2Nlc3Nlc1tpXTtcbiAgICAgICAgICAgICAgICBzdWJwcm9jZXNzLmtpbGwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfSlcbiAgICB9XG4gICAgc3BpblVwU3ViUHJvY2Vzc2VzKCkge1xuICAgICAgICBkZWJ1ZygnYXR0ZW1wdGluZyB0byBzcGF3biBzdWIgcHJvY2Vzc2VzJylcbiAgICAgICAgY29uc3QgcDJwU3ViUHJvY2VzcyA9IHNwYXduKCdub2RlJywgW2pvaW4oX19kaXJuYW1lLCAnLi4vZGlzdC9wMnAvaW5kZXguanMnKSwgJy0taXBjU2VydmVySWQnLCB0aGlzLm9wdGlvbnMuaXBjU2VydmVySWRdLCB7c3RkaW86IFsnaW5oZXJpdCcsICdpbmhlcml0JywgJ2luaGVyaXQnXX0pXG4gICAgICAgIHAycFN1YlByb2Nlc3Mub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgZXJyb3IoJ3AycFN1YlByb2Nlc3MgZmFpbGVkIHRvIHN0YXJ0OiAnLCBlcnIpXG4gICAgICAgIH0pXG4gICAgICAgIHAycFN1YlByb2Nlc3Mub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcbiAgICAgICAgICAgIGRlYnVnKCdwMnBTdWJQcm9jZXNzIGNsb3NlZCBvbiB1cyB3aXRoIGNvZGU6ICcsIGNvZGUpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuc3ViUHJvY2Vzc2VzLnB1c2gocDJwU3ViUHJvY2VzcylcbiAgICB9XG59Il19