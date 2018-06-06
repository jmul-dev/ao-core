#!/usr/local/bin/node

'use strict';

require('source-map-support/register');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

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
        ipcServerId: 'test' // AO_CONSTANTS.IPC_SERVER_ID,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iaW4uanMiXSwibmFtZXMiOlsiZGVidWciLCJhcmd2IiwicHJvY2VzcyIsInNsaWNlIiwiZGVmYXVsdCIsImRpc2FibGVIdHRwSW50ZXJmYWNlIiwiaHR0cFBvcnQiLCJpcGNTZXJ2ZXJJZCIsImNvcmUiLCJDb3JlIiwib24iLCJpcGMiLCJjb25maWciLCJpZCIsImlwY0xvZ0xpc3RlbmVyIiwiZGJTZXR1cCIsInRoZW4iLCJpcGNMaXN0ZW5lcnNUaGF0UHJvcG9nYXRlVG9EYiIsIm9wdGlvbnMiLCJodHRwU2V0dXAiLCJzcGluVXBTdWJQcm9jZXNzZXMiLCJjYXRjaCIsInNodXRkb3duV2l0aEVycm9yIiwiZXJyIl0sIm1hcHBpbmdzIjoiO0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxJQUFNQSxRQUFRLHFCQUFNLFNBQU4sQ0FBZDs7QUFFQSxJQUFJQyxPQUFPLHdCQUFTQyxRQUFRRCxJQUFSLENBQWFFLEtBQWIsQ0FBbUIsQ0FBbkIsQ0FBVCxFQUFnQztBQUN2Q0MsYUFBUztBQUNMQyw4QkFBc0IsS0FEakI7QUFFTEMsa0JBQVUsSUFGTDtBQUdMQyxxQkFBYSxNQUhSLENBR2dCO0FBSGhCO0FBRDhCLENBQWhDLENBQVg7O0FBUUEsSUFBTUMsT0FBTyxJQUFJQyxlQUFKLENBQVNSLElBQVQsQ0FBYjtBQUNBO0FBQ0FPLEtBQUtFLEVBQUwsQ0FBUSxrQkFBUixFQUE0QixZQUFNO0FBQzlCVixVQUFNLHFDQUFxQ1EsS0FBS0csR0FBTCxDQUFTQyxNQUFULENBQWdCQyxFQUEzRDtBQUNBO0FBQ0FMLFNBQUtNLGNBQUw7QUFDQTtBQUNBTixTQUFLTyxPQUFMLEdBQWVDLElBQWYsQ0FBb0IsWUFBTTtBQUN0QlIsYUFBS1MsNkJBQUw7QUFDQTtBQUNBLFlBQUssQ0FBQ1QsS0FBS1UsT0FBTCxDQUFhYixvQkFBbkIsRUFBMEM7QUFDdENHLGlCQUFLVyxTQUFMO0FBQ0g7QUFDRDtBQUNBWCxhQUFLWSxrQkFBTDtBQUNILEtBUkQsRUFRR0MsS0FSSCxDQVFTLGVBQU87QUFDWmIsYUFBS2MsaUJBQUwsQ0FBdUJDLEdBQXZCO0FBQ0gsS0FWRDtBQVdILENBaEJEO0FBaUJBZixLQUFLRSxFQUFMLENBQVEsa0JBQVIsRUFBNEIsVUFBQ2EsR0FBRCxFQUFTO0FBQ2pDZixTQUFLYyxpQkFBTCxDQUF1QkMsR0FBdkI7QUFDSCxDQUZEIiwiZmlsZSI6ImJpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnO1xuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0IENvcmUsIHsgQU9fQ09OU1RBTlRTIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgbWluaW1pc3QgZnJvbSAnbWluaW1pc3QnO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2FvOmNvcmUnKTtcblxudmFyIGFyZ3YgPSBtaW5pbWlzdChwcm9jZXNzLmFyZ3Yuc2xpY2UoMiksIHtcbiAgICBkZWZhdWx0OiB7XG4gICAgICAgIGRpc2FibGVIdHRwSW50ZXJmYWNlOiBmYWxzZSxcbiAgICAgICAgaHR0cFBvcnQ6IDMwMDAsXG4gICAgICAgIGlwY1NlcnZlcklkOiAndGVzdCcsIC8vIEFPX0NPTlNUQU5UUy5JUENfU0VSVkVSX0lELFxuICAgIH1cbn0pO1xuXG5jb25zdCBjb3JlID0gbmV3IENvcmUoYXJndik7XG4vLyAxLiBJUEMgc2VydmVyXG5jb3JlLm9uKCdpcGM6c2VydmVyOnN0YXJ0JywgKCkgPT4ge1xuICAgIGRlYnVnKCdpcGMgc2VydmVyIHN0YXJ0ZWQuIHNlcnZlciBpZCA9ICcgKyBjb3JlLmlwYy5jb25maWcuaWQpXG4gICAgLy8gMi4gSVBDIGxvZyBsaXN0ZW5lclxuICAgIGNvcmUuaXBjTG9nTGlzdGVuZXIoKVxuICAgIC8vIDMuIERCIFNldHVwXG4gICAgY29yZS5kYlNldHVwKCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvcmUuaXBjTGlzdGVuZXJzVGhhdFByb3BvZ2F0ZVRvRGIoKVxuICAgICAgICAvLyA0LiBIVFRQIHNlcnZlclxuICAgICAgICBpZiAoICFjb3JlLm9wdGlvbnMuZGlzYWJsZUh0dHBJbnRlcmZhY2UgKSB7XG4gICAgICAgICAgICBjb3JlLmh0dHBTZXR1cCgpXG4gICAgICAgIH1cbiAgICAgICAgLy8gNS4gU3ViLXByb2Nlc3Nlc1xuICAgICAgICBjb3JlLnNwaW5VcFN1YlByb2Nlc3NlcygpXG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29yZS5zaHV0ZG93bldpdGhFcnJvcihlcnIpXG4gICAgfSlcbn0pXG5jb3JlLm9uKCdpcGM6c2VydmVyOmVycm9yJywgKGVycikgPT4ge1xuICAgIGNvcmUuc2h1dGRvd25XaXRoRXJyb3IoZXJyKVxufSkiXX0=