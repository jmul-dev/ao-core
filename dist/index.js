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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJDT05TVEFOVFMiLCJkZWJ1ZyIsImVycm9yIiwiQU9fQ09OU1RBTlRTIiwiQ29yZSIsImFyZ3MiLCJpcGNTZXJ2ZXJJZCIsIm9wdGlvbnMiLCJkYiIsInNlcnZlciIsInN1YlByb2Nlc3NlcyIsIm1lc3NhZ2UiLCJwcm9jZXNzIiwic2VuZCIsImV2ZW50IiwiRVZFTlRfTE9HIiwiTG9nIiwiY3JlYXRlIiwiaXBjIiwib24iLCJzZW5kRXZlbnRMb2ciLCJiaW5kIiwiREFUQSIsImRhdGEiLCJ0eXBlIiwiREFUQV9UWVBFUyIsIlBFRVJfQ09OTkVDVEVEIiwiUGVlciIsImZpbmRPckNyZWF0ZSIsIndoZXJlIiwiaWQiLCJwZWVySWQiLCJQRUVSX0RJU0NPTk5FQ1RFRCIsImRlc3Ryb3kiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkRhdGFiYXNlIiwiaW5pdCIsInRoZW4iLCJjYXRjaCIsImVyciIsImV4cHJlc3NTZXJ2ZXIiLCJncmFwaHFsU2NoZW1hIiwidXNlIiwic2NoZW1hIiwiZ2V0IiwiZW5kcG9pbnRVUkwiLCJsaXN0ZW4iLCJodHRwUG9ydCIsImFkZHJlc3MiLCJwb3J0Iiwic2h1dGRvd25XaXRoRXJyb3IiLCJzdG9wIiwiY2xvc2UiLCJkYkNvbm5lY2l0b25Qcm9taXNlIiwiaSIsImxlbmd0aCIsInN1YnByb2Nlc3MiLCJraWxsIiwiZXhpdCIsInAycFN1YlByb2Nlc3MiLCJfX2Rpcm5hbWUiLCJzdGRpbyIsImNvZGUiLCJwdXNoIiwiSXBjU2VydmVyIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FBQ0E7O0lBQVlBLFM7O0FBQ1o7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUNBLElBQU1DLFFBQVEscUJBQU0sU0FBTixDQUFkO0FBQ0EsSUFBTUMsUUFBUSxxQkFBTSxlQUFO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TCxFQUFnQixzQkFBaEIsQ0FBRCxFQUEwQyxlQUExQyxFQUEyRCxLQUFLdkQsT0FBTCxDQUFhRCxXQUF4RSxDQUFkLEVBQW9HLEVBQUN5RCxPQUFPLENBQUMsU0FBRCxFQUFZLFNBQVosRUFBdUIsU0FBdkIsQ0FBUixFQUFwRyxDQUF0QjtBQUNBRiwwQkFBYzFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsVUFBQ3NCLEdBQUQsRUFBUztBQUMvQnZDLHNCQUFNLGlDQUFOLEVBQXlDdUMsR0FBekM7QUFDSCxhQUZEO0FBR0FvQiwwQkFBYzFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsVUFBQzZDLElBQUQsRUFBVTtBQUNoQy9ELHNCQUFNLHdDQUFOLEVBQWdEK0QsSUFBaEQ7QUFDSCxhQUZEO0FBR0EsaUJBQUt0RCxZQUFMLENBQWtCdUQsSUFBbEIsQ0FBdUJKLGFBQXZCO0FBQ0g7Ozs7RUExRjZCSyxtQjs7a0JBQWI5RCxJIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0ICogYXMgQ09OU1RBTlRTIGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBqc29uIH0gZnJvbSBcImJvZHktcGFyc2VyXCI7XG5pbXBvcnQgeyBncmFwaHFsRXhwcmVzcywgZ3JhcGhpcWxFeHByZXNzIH0gZnJvbSBcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiO1xuaW1wb3J0IGdyYXBocWwgZnJvbSBcImdyYXBocWxcIjtcbmltcG9ydCBzY2hlbWEgZnJvbSBcIi4vZ3JhcGhxbC9zY2hlbWFcIjtcbmltcG9ydCBEYXRhYmFzZSBmcm9tIFwiLi9zdG9yYWdlL2RhdGFiYXNlXCI7XG5pbXBvcnQgeyBub3RFcXVhbCB9IGZyb20gXCJhc3NlcnRcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IElwY1NlcnZlciBmcm9tIFwiLi9pbnRlcmZhY2VzL2lwYy1zZXJ2ZXJcIjtcbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdhbzpjb3JlJylcbmNvbnN0IGVycm9yID0gRGVidWcoJ2FvOmNvcmU6ZXJyb3InKVxuXG5cbmV4cG9ydCBjb25zdCBBT19DT05TVEFOVFMgPSBDT05TVEFOVFM7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcmUgZXh0ZW5kcyBJcGNTZXJ2ZXIge1xuICAgIGNvbnN0cnVjdG9yKGFyZ3MpIHtcbiAgICAgICAgZGVidWcoYXJncylcbiAgICAgICAgc3VwZXIoYXJncy5pcGNTZXJ2ZXJJZClcbiAgICAgICAgdGhpcy5vcHRpb25zID0gYXJnc1xuICAgICAgICB0aGlzLmRiID0gbnVsbFxuICAgICAgICB0aGlzLnNlcnZlciA9IG51bGxcbiAgICAgICAgdGhpcy5zdWJQcm9jZXNzZXMgPSBbXVxuICAgIH1cbiAgICBzZW5kRXZlbnRMb2cobWVzc2FnZSkge1xuICAgICAgICBpZiAoIHByb2Nlc3Muc2VuZCApIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcGFyZW50IHByb2Nlc3MgKHJ1bm5pbmcgd2l0aGluIGFwcCkgd2UgcmVsYXlcbiAgICAgICAgICAgIC8vIGFsbCBvZiB0aGUgbG9ncyB1cC5cbiAgICAgICAgICAgIHByb2Nlc3Muc2VuZCh7ZXZlbnQ6IEFPX0NPTlNUQU5UUy5FVkVOVF9MT0csIG1lc3NhZ2U6IG1lc3NhZ2V9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGFwcGVuZCB0byBhIHRlbXAgbG9nIHNvbWV3aGVyZSAobWFrZSB0aGlzIGNvbmZpZ3VyYWJsZSB2aWEgY29tbWFuZCBsaW5lKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGIuTG9nLmNyZWF0ZSh7bWVzc2FnZTogbWVzc2FnZX0pO1xuICAgIH1cbiAgICBpcGNMb2dMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5pcGMuc2VydmVyLm9uKEFPX0NPTlNUQU5UUy5FVkVOVF9MT0csIHRoaXMuc2VuZEV2ZW50TG9nLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpcGNMaXN0ZW5lcnNUaGF0UHJvcG9nYXRlVG9EYigpIHtcbiAgICAgICAgbm90RXF1YWwodGhpcy5kYiwgbnVsbCwgJ2lwY0xpc3RlbmVyc1RoYXRQcm9wb2dhdGVUb0RiIGNhbGxlZCB3aXRob3V0IGRiIGluc3RhbnRpYXRlZCcpXG4gICAgICAgIHRoaXMuaXBjLnNlcnZlci5vbihBT19DT05TVEFOVFMuREFUQSwgKGRhdGEpID0+IHsgICAgICAgICAgIFxuICAgICAgICAgICAgc3dpdGNoKGRhdGEudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQU9fQ09OU1RBTlRTLkRBVEFfVFlQRVMuUEVFUl9DT05ORUNURUQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRiLlBlZXIuZmluZE9yQ3JlYXRlKHt3aGVyZToge2lkOiBkYXRhLnBlZXJJZH19KVxuICAgICAgICAgICAgICAgIGNhc2UgQU9fQ09OU1RBTlRTLkRBVEFfVFlQRVMuUEVFUl9ESVNDT05ORUNURUQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRiLlBlZXIuZGVzdHJveSh7d2hlcmU6IHsgaWQ6IGRhdGEucGVlcklkIH19KVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkYlNldHVwKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kYiA9IG5ldyBEYXRhYmFzZSgpXG4gICAgICAgICAgICB0aGlzLmRiLmluaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnZGF0YWJhc2UgaW5zdGFuY2UgY3JlYXRlZCcpXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kRXZlbnRMb2coJ0NvcmUgZGF0YWJhc2UgY29ubmVjdGVkJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGVycm9yKCdlcnJvciBjcmVhdGluZyBkYXRhYmFzZSBpbnN0YW5jZScsIGVycilcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgXG4gICAgfVxuICAgIC8qKlxuICAgICAqIE5vdGUgdGhhdCB0aGUgaHR0cCBzZXJ2ZXIgZGVwZW5kcyBvbiBib3RoIHRoZSBpcGMgc2VydmVyIEFORCB0aGUgZGF0YWJhc2VcbiAgICAgKi9cbiAgICBodHRwU2V0dXAoKSB7XG4gICAgICAgIG5vdEVxdWFsKHRoaXMuaXBjLCBudWxsLCAnaHR0cCBzZXJ2ZXIgcmVxdWlyZXMgaW5zdGFuY2Ugb2YgaXBjIHNlcnZlcicpO1xuICAgICAgICBub3RFcXVhbCh0aGlzLmRiLCBudWxsLCAnaHR0cCBzZXJ2ZXIgcmVxdWlyZXMgaW5zdGFuY2Ugb2YgZGInKTtcbiAgICAgICAgY29uc3QgZXhwcmVzc1NlcnZlciA9IGV4cHJlc3MoKTtcbiAgICAgICAgY29uc3QgZ3JhcGhxbFNjaGVtYSA9IHNjaGVtYSh0aGlzLmRiKTtcbiAgICAgICAgZXhwcmVzc1NlcnZlci51c2UoJy9ncmFwaHFsJywganNvbigpLCBncmFwaHFsRXhwcmVzcyh7IHNjaGVtYTogZ3JhcGhxbFNjaGVtYSB9KSk7XG4gICAgICAgIGV4cHJlc3NTZXJ2ZXIuZ2V0KCcvZ3JhcGhpcWwnLCBncmFwaGlxbEV4cHJlc3MoeyBlbmRwb2ludFVSTDogJy9ncmFwaHFsJyB9KSk7IC8vIFRPRE86IGVuYWJsZSBiYXNlZCBvbiBwcm9jZXNzLmVudi5OT0RFX0VOVlxuICAgICAgICB0aGlzLnNlcnZlciA9IGV4cHJlc3NTZXJ2ZXIubGlzdGVuKHRoaXMub3B0aW9ucy5odHRwUG9ydCwgKCkgPT4ge1xuICAgICAgICAgICAgZGVidWcoJ0V4cHJlc3Mgc2VydmVyIHJ1bm5pbmcgb24gcG9ydDogJyArIHRoaXMuc2VydmVyLmFkZHJlc3MoKS5wb3J0KTtcbiAgICAgICAgICAgIHRoaXMuc2VuZEV2ZW50TG9nKCdDb3JlIGh0dHAgc2VydmVyIHN0YXJ0ZWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2VydmVyLm9uKCdlcnJvcicsIHRoaXMuc2h1dGRvd25XaXRoRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHNodXRkb3duV2l0aEVycm9yKGVycikge1xuICAgICAgICBlcnJvcignY29yZSBzaHV0dGluZyBkb3duIHdpdGggZXJyb3JcXG4nLCBlcnIpO1xuICAgICAgICBpZiAoIHRoaXMuaXBjICYmIHRoaXMuaXBjLnNlcnZlciApXG4gICAgICAgICAgICB0aGlzLmlwYy5zZXJ2ZXIuc3RvcCgpO1xuICAgICAgICBpZiAoIHRoaXMuc2VydmVyICE9PSBudWxsICYmIHRoaXMuc2VydmVyLmNsb3NlIClcbiAgICAgICAgICAgIHRoaXMuc2VydmVyLmNsb3NlKCk7XG4gICAgICAgIGNvbnN0IGRiQ29ubmVjaXRvblByb21pc2UgPSB0aGlzLmRiID09PSBudWxsID8gUHJvbWlzZS5yZXNvbHZlKCkgOiB0aGlzLmRiLmNsb3NlKClcbiAgICAgICAgZGJDb25uZWNpdG9uUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJQcm9jZXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJwcm9jZXNzID0gdGhpcy5zdWJQcm9jZXNzZXNbaV07XG4gICAgICAgICAgICAgICAgc3VicHJvY2Vzcy5raWxsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHNwaW5VcFN1YlByb2Nlc3NlcygpIHtcbiAgICAgICAgZGVidWcoJ2F0dGVtcHRpbmcgdG8gc3Bhd24gc3ViIHByb2Nlc3NlcycpXG4gICAgICAgIGNvbnN0IHAycFN1YlByb2Nlc3MgPSBzcGF3bignbm9kZScsIFtqb2luKF9fZGlybmFtZSwgJy4uL2Rpc3QvcDJwL2luZGV4LmpzJyksICctLWlwY1NlcnZlcklkJywgdGhpcy5vcHRpb25zLmlwY1NlcnZlcklkXSwge3N0ZGlvOiBbJ2luaGVyaXQnLCAnaW5oZXJpdCcsICdpbmhlcml0J119KVxuICAgICAgICBwMnBTdWJQcm9jZXNzLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGVycm9yKCdwMnBTdWJQcm9jZXNzIGZhaWxlZCB0byBzdGFydDogJywgZXJyKVxuICAgICAgICB9KVxuICAgICAgICBwMnBTdWJQcm9jZXNzLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICAgICAgICBkZWJ1ZygncDJwU3ViUHJvY2VzcyBjbG9zZWQgb24gdXMgd2l0aCBjb2RlOiAnLCBjb2RlKVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnN1YlByb2Nlc3Nlcy5wdXNoKHAycFN1YlByb2Nlc3MpXG4gICAgfVxufSJdfQ==