#!/usr/local/bin/node

'use strict';

require('source-map-support/register');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _constants = require('./constants');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('ao:core');

var argv = (0, _minimist2.default)(process.argv.slice(2), {
    default: {
        disableHttpInterface: false,
        httpPort: 3000,
        ipcServerId: _constants.IPC_SERVER_ID
    }
});

var core = new _index2.default(argv);
// 1. IPC server
core.on('ipc:server:start', function () {
    debug('ipc server started. server id = ' + core.ipc.config.id);
    // 2. IPC log listener
    core.ipcLogListener();
    // 3. DB Setup
    core.dbSetup().then(function () {
        core.ipcListenersThatPropogateToDb();
        // 4. HTTP server
        if (!core.options.disableHttpInterface) {
            core.httpSetup();
        }
        // 5. Sub-processes
        core.spinUpSubProcesses();
    }).catch(function (err) {
        core.shutdownWithError(err);
    });
});
core.on('ipc:server:error', function (err) {
    core.shutdownWithError(err);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iaW4uanMiXSwibmFtZXMiOlsiZGVidWciLCJhcmd2IiwicHJvY2VzcyIsInNsaWNlIiwiZGVmYXVsdCIsImRpc2FibGVIdHRwSW50ZXJmYWNlIiwiaHR0cFBvcnQiLCJpcGNTZXJ2ZXJJZCIsIklQQ19TRVJWRVJfSUQiLCJjb3JlIiwiQ29yZSIsIm9uIiwiaXBjIiwiY29uZmlnIiwiaWQiLCJpcGNMb2dMaXN0ZW5lciIsImRiU2V0dXAiLCJ0aGVuIiwiaXBjTGlzdGVuZXJzVGhhdFByb3BvZ2F0ZVRvRGIiLCJvcHRpb25zIiwiaHR0cFNldHVwIiwic3BpblVwU3ViUHJvY2Vzc2VzIiwiY2F0Y2giLCJzaHV0ZG93bldpdGhFcnJvciIsImVyciJdLCJtYXBwaW5ncyI6IjtBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBQ0EsSUFBTUEsUUFBUSxxQkFBTSxTQUFOLENBQWQ7O0FBRUEsSUFBSUMsT0FBTyx3QkFBU0MsUUFBUUQsSUFBUixDQUFhRSxLQUFiLENBQW1CLENBQW5CLENBQVQsRUFBZ0M7QUFDdkNDLGFBQVM7QUFDTEMsOEJBQXNCLEtBRGpCO0FBRUxDLGtCQUFVLElBRkw7QUFHTEMscUJBQWFDO0FBSFI7QUFEOEIsQ0FBaEMsQ0FBWDs7QUFRQSxJQUFNQyxPQUFPLElBQUlDLGVBQUosQ0FBU1QsSUFBVCxDQUFiO0FBQ0E7QUFDQVEsS0FBS0UsRUFBTCxDQUFRLGtCQUFSLEVBQTRCLFlBQU07QUFDOUJYLFVBQU0scUNBQXFDUyxLQUFLRyxHQUFMLENBQVNDLE1BQVQsQ0FBZ0JDLEVBQTNEO0FBQ0E7QUFDQUwsU0FBS00sY0FBTDtBQUNBO0FBQ0FOLFNBQUtPLE9BQUwsR0FBZUMsSUFBZixDQUFvQixZQUFNO0FBQ3RCUixhQUFLUyw2QkFBTDtBQUNBO0FBQ0EsWUFBSyxDQUFDVCxLQUFLVSxPQUFMLENBQWFkLG9CQUFuQixFQUEwQztBQUN0Q0ksaUJBQUtXLFNBQUw7QUFDSDtBQUNEO0FBQ0FYLGFBQUtZLGtCQUFMO0FBQ0gsS0FSRCxFQVFHQyxLQVJILENBUVMsZUFBTztBQUNaYixhQUFLYyxpQkFBTCxDQUF1QkMsR0FBdkI7QUFDSCxLQVZEO0FBV0gsQ0FoQkQ7QUFpQkFmLEtBQUtFLEVBQUwsQ0FBUSxrQkFBUixFQUE0QixVQUFDYSxHQUFELEVBQVM7QUFDakNmLFNBQUtjLGlCQUFMLENBQXVCQyxHQUF2QjtBQUNILENBRkQiLCJmaWxlIjoiYmluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgQ29yZSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IElQQ19TRVJWRVJfSUQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgbWluaW1pc3QgZnJvbSAnbWluaW1pc3QnO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2FvOmNvcmUnKTtcblxudmFyIGFyZ3YgPSBtaW5pbWlzdChwcm9jZXNzLmFyZ3Yuc2xpY2UoMiksIHtcbiAgICBkZWZhdWx0OiB7XG4gICAgICAgIGRpc2FibGVIdHRwSW50ZXJmYWNlOiBmYWxzZSxcbiAgICAgICAgaHR0cFBvcnQ6IDMwMDAsXG4gICAgICAgIGlwY1NlcnZlcklkOiBJUENfU0VSVkVSX0lELFxuICAgIH1cbn0pO1xuXG5jb25zdCBjb3JlID0gbmV3IENvcmUoYXJndik7XG4vLyAxLiBJUEMgc2VydmVyXG5jb3JlLm9uKCdpcGM6c2VydmVyOnN0YXJ0JywgKCkgPT4ge1xuICAgIGRlYnVnKCdpcGMgc2VydmVyIHN0YXJ0ZWQuIHNlcnZlciBpZCA9ICcgKyBjb3JlLmlwYy5jb25maWcuaWQpXG4gICAgLy8gMi4gSVBDIGxvZyBsaXN0ZW5lclxuICAgIGNvcmUuaXBjTG9nTGlzdGVuZXIoKVxuICAgIC8vIDMuIERCIFNldHVwXG4gICAgY29yZS5kYlNldHVwKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvcmUuaXBjTGlzdGVuZXJzVGhhdFByb3BvZ2F0ZVRvRGIoKVxuICAgICAgICAvLyA0LiBIVFRQIHNlcnZlclxuICAgICAgICBpZiAoICFjb3JlLm9wdGlvbnMuZGlzYWJsZUh0dHBJbnRlcmZhY2UgKSB7XG4gICAgICAgICAgICBjb3JlLmh0dHBTZXR1cCgpXG4gICAgICAgIH1cbiAgICAgICAgLy8gNS4gU3ViLXByb2Nlc3Nlc1xuICAgICAgICBjb3JlLnNwaW5VcFN1YlByb2Nlc3NlcygpXG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29yZS5zaHV0ZG93bldpdGhFcnJvcihlcnIpXG4gICAgfSlcbn0pXG5jb3JlLm9uKCdpcGM6c2VydmVyOmVycm9yJywgKGVycikgPT4ge1xuICAgIGNvcmUuc2h1dGRvd25XaXRoRXJyb3IoZXJyKVxufSkiXX0=