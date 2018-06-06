#!/usr/local/bin/node

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _protobufjs = require("protobufjs");

var _peerInfo = require("peer-info");

var _libp2pRpc = require("libp2p-rpc");

var _libp2pRpc2 = _interopRequireDefault(_libp2pRpc);

var _libp2pConnectionManager = require("libp2p-connection-manager");

var _libp2pConnectionManager2 = _interopRequireDefault(_libp2pConnectionManager);

var _ipcClient = require("../interfaces/ipc-client");

var _ipcClient2 = _interopRequireDefault(_ipcClient);

var _constants = require("../constants.js");

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = (0, _debug2.default)('ao:p2p');
var error = (0, _debug2.default)('ao:p2p:error');
var argv = (0, _minimist2.default)(process.argv.slice(2));

var P2P = function (_IpcClient) {
    _inherits(P2P, _IpcClient);

    function P2P(ipcServerId) {
        _classCallCheck(this, P2P);

        var _this = _possibleConstructorReturn(this, (P2P.__proto__ || Object.getPrototypeOf(P2P)).call(this, 'ao_p2p_process', ipcServerId));

        _this.config = {
            name: 'AO', // Protocol name used for handshake
            version: '0.0.1', // Protocol version used for handshake
            service: 'Protocol', // Name of service in .proto file
            bootstrapers: [], // Bootstrapping nodes 
            multicastDNS: {
                // multicastDNS options
                interval: 1000
            }
        };
        _this.connectionManager = null;
        _this.node = null;
        _this.on('ipc:client:connect', function () {
            debug('p2p ipc client connected');
            _this.start();
        });
        return _this;
    }

    _createClass(P2P, [{
        key: "start",
        value: function start() {
            var _this2 = this;

            var peerInfoPromise = this._createNodePeerInfo();
            var loadProtocolInterfacePromise = this._loadProtocolInterface();
            Promise.all([peerInfoPromise, loadProtocolInterfacePromise]).then(function (results) {
                // 1. Create our Node (inherits from libp2p)
                _this2.node = new _libp2pRpc2.default(results[0], results[1], _this2.config);
                _this2.node.start().then(function () {
                    debug('p2p node started');
                    _this2.ipcClient().emit(_constants.EVENT_LOG, 'P2P Client started');
                }).catch(function (error) {
                    debug('p2p node failed to start', error);
                });
                // 2. Create the connection manager
                _this2.connectionManager = new _libp2pConnectionManager2.default(_this2.node, {/* TODO: connection limits */});
                _this2.connectionManager.start();
                _this2.connectionManager.on('connected', function (peerId) {
                    debug('peer connected', peerId);
                    _this2.ipcClient().emit(_constants.DATA, {
                        type: _constants.DATA_TYPES.PEER_CONNECTED,
                        peerId: peerId
                    });
                });
                _this2.connectionManager.on('disconnected', function (peerId) {
                    debug('peer disconnected', peerId);
                    _this2.ipcClient().emit(_constants.DATA, {
                        type: _constants.DATA_TYPES.PEER_DISCONNECTED,
                        peerId: peerId
                    });
                });
                _this2.connectionManager.on('limit:exceeded', function (limitName, measured) {
                    debug('connection manager reported limit exceeded', limitName, measured);
                });
                // TODO: figure out peer communication using either node or manager.
                // We should setup all of our RPC handlers here.
                // node.on('peer:disconnect', (peer) => {
                //     console.log('peer:disconnect')
                // })
                // NOTE: peer:connection is used in place of peer:connect (libp2p-rpc adds this event in order to attach rpc)
                _this2.node.on('peer:connection', function (conn, peer, type) {
                    // Make RPC call to peer
                    peer.rpc.sayHello({ name: 'Foo' }, function (response, peer) {
                        console.log('Response', response);
                    });
                });
                // Define RPC handlers
                _this2.node.handle('sayHello', function (message, peer, respond) {
                    respond({ message: 'heyThere' });
                });
            }).catch(function (errors) {
                // TODO: report unable to start and shutdown (ipc channel should be open)
                error(errors);
            });
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.connectionManager !== undefined) {
                this.connectionManager.stop(function () {});
            }
            if (this.node !== undefined) {
                this.node.stop(function () {});
            }
        }
    }, {
        key: "_createNodePeerInfo",
        value: function _createNodePeerInfo() {
            return new Promise(function (resolve, reject) {
                (0, _peerInfo.create)(function (err, peerInfo) {
                    if (err) return reject(err);
                    resolve(peerInfo);
                });
            });
        }
    }, {
        key: "_loadProtocolInterface",
        value: function _loadProtocolInterface() {
            return new Promise(function (resolve, reject) {
                (0, _protobufjs.load)((0, _path.join)(__dirname, './ao.p2p.proto')).then(function (protocolInterface) {
                    debug('proto3 protocol interface loaded');
                    resolve(protocolInterface);
                }).catch(reject);
            });
        }
    }]);

    return P2P;
}(_ipcClient2.default);

if (require.main === module) {
    var p2p = new P2P(argv.ipcServerId);
}

exports.default = P2P;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wMnAvaW5kZXguanMiXSwibmFtZXMiOlsiZGVidWciLCJlcnJvciIsImFyZ3YiLCJwcm9jZXNzIiwic2xpY2UiLCJQMlAiLCJpcGNTZXJ2ZXJJZCIsImNvbmZpZyIsIm5hbWUiLCJ2ZXJzaW9uIiwic2VydmljZSIsImJvb3RzdHJhcGVycyIsIm11bHRpY2FzdEROUyIsImludGVydmFsIiwiY29ubmVjdGlvbk1hbmFnZXIiLCJub2RlIiwib24iLCJzdGFydCIsInBlZXJJbmZvUHJvbWlzZSIsIl9jcmVhdGVOb2RlUGVlckluZm8iLCJsb2FkUHJvdG9jb2xJbnRlcmZhY2VQcm9taXNlIiwiX2xvYWRQcm90b2NvbEludGVyZmFjZSIsIlByb21pc2UiLCJhbGwiLCJ0aGVuIiwiTm9kZSIsInJlc3VsdHMiLCJpcGNDbGllbnQiLCJlbWl0IiwiRVZFTlRfTE9HIiwiY2F0Y2giLCJDb25uTWFuYWdlciIsInBlZXJJZCIsIkRBVEEiLCJ0eXBlIiwiREFUQV9UWVBFUyIsIlBFRVJfQ09OTkVDVEVEIiwiUEVFUl9ESVNDT05ORUNURUQiLCJsaW1pdE5hbWUiLCJtZWFzdXJlZCIsImNvbm4iLCJwZWVyIiwicnBjIiwic2F5SGVsbG8iLCJyZXNwb25zZSIsImNvbnNvbGUiLCJsb2ciLCJoYW5kbGUiLCJtZXNzYWdlIiwicmVzcG9uZCIsImVycm9ycyIsInVuZGVmaW5lZCIsInN0b3AiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicGVlckluZm8iLCJfX2Rpcm5hbWUiLCJwcm90b2NvbEludGVyZmFjZSIsIklwY0NsaWVudCIsInJlcXVpcmUiLCJtYWluIiwibW9kdWxlIiwicDJwIl0sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFNQSxRQUFRLHFCQUFNLFFBQU4sQ0FBZDtBQUNBLElBQU1DLFFB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Q0FxRCw0QkFBUUssaUJBQVI7QUFDSCxpQkFIRCxFQUdHNUIsS0FISCxDQUdTd0IsTUFIVDtBQUlILGFBTE0sQ0FBUDtBQU1IOzs7O0VBaEdhSyxtQjs7QUFtR2xCLElBQUlDLFFBQVFDLElBQVIsS0FBaUJDLE1BQXJCLEVBQTZCO0FBQ3pCLFFBQU1DLE1BQU0sSUFBSTFELEdBQUosQ0FBUUgsS0FBS0ksV0FBYixDQUFaO0FBQ0g7O2tCQUVjRCxHIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4ndXNlIHN0cmljdCc7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGxvYWQgfSBmcm9tIFwicHJvdG9idWZqc1wiO1xuaW1wb3J0IHsgY3JlYXRlIH0gZnJvbSBcInBlZXItaW5mb1wiO1xuaW1wb3J0IE5vZGUgZnJvbSBcImxpYnAycC1ycGNcIjtcbmltcG9ydCBDb25uTWFuYWdlciBmcm9tIFwibGlicDJwLWNvbm5lY3Rpb24tbWFuYWdlclwiO1xuaW1wb3J0IElwY0NsaWVudCBmcm9tIFwiLi4vaW50ZXJmYWNlcy9pcGMtY2xpZW50XCI7XG5pbXBvcnQgeyBFVkVOVF9MT0csIERBVEEsIERBVEFfVFlQRVMgfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgbWluaW1pc3QgZnJvbSAnbWluaW1pc3QnO1xuaW1wb3J0IERlYnVnIGZyb20gJ2RlYnVnJztcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2FvOnAycCcpO1xuY29uc3QgZXJyb3IgPSBEZWJ1ZygnYW86cDJwOmVycm9yJyk7XG5jb25zdCBhcmd2ID0gbWluaW1pc3QocHJvY2Vzcy5hcmd2LnNsaWNlKDIpKTtcblxuXG5jbGFzcyBQMlAgZXh0ZW5kcyBJcGNDbGllbnQge1xuICAgIGNvbnN0cnVjdG9yKGlwY1NlcnZlcklkKSB7XG4gICAgICAgIHN1cGVyKCdhb19wMnBfcHJvY2VzcycsIGlwY1NlcnZlcklkKVxuICAgICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgICAgIG5hbWU6ICdBTycsICAvLyBQcm90b2NvbCBuYW1lIHVzZWQgZm9yIGhhbmRzaGFrZVxuICAgICAgICAgICAgdmVyc2lvbjogJzAuMC4xJywgICAgICAgICAgICAvLyBQcm90b2NvbCB2ZXJzaW9uIHVzZWQgZm9yIGhhbmRzaGFrZVxuICAgICAgICAgICAgc2VydmljZTogJ1Byb3RvY29sJywgICAgICAgICAvLyBOYW1lIG9mIHNlcnZpY2UgaW4gLnByb3RvIGZpbGVcbiAgICAgICAgICAgIGJvb3RzdHJhcGVyczogW10sICAgICAgICAgICAgLy8gQm9vdHN0cmFwcGluZyBub2RlcyBcbiAgICAgICAgICAgIG11bHRpY2FzdEROUzoge1xuICAgICAgICAgICAgICAgIC8vIG11bHRpY2FzdEROUyBvcHRpb25zXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWw6IDEwMDBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25NYW5hZ2VyID0gbnVsbFxuICAgICAgICB0aGlzLm5vZGUgPSBudWxsXG4gICAgICAgIHRoaXMub24oJ2lwYzpjbGllbnQ6Y29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgICAgIGRlYnVnKCdwMnAgaXBjIGNsaWVudCBjb25uZWN0ZWQnKVxuICAgICAgICAgICAgdGhpcy5zdGFydCgpXG4gICAgICAgIH0pXG4gICAgfVxuICAgIHN0YXJ0KCkge1xuICAgICAgICBjb25zdCBwZWVySW5mb1Byb21pc2UgPSB0aGlzLl9jcmVhdGVOb2RlUGVlckluZm8oKVxuICAgICAgICBjb25zdCBsb2FkUHJvdG9jb2xJbnRlcmZhY2VQcm9taXNlID0gdGhpcy5fbG9hZFByb3RvY29sSW50ZXJmYWNlKClcbiAgICAgICAgUHJvbWlzZS5hbGwoW3BlZXJJbmZvUHJvbWlzZSwgbG9hZFByb3RvY29sSW50ZXJmYWNlUHJvbWlzZV0pLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICAvLyAxLiBDcmVhdGUgb3VyIE5vZGUgKGluaGVyaXRzIGZyb20gbGlicDJwKVxuICAgICAgICAgICAgdGhpcy5ub2RlID0gbmV3IE5vZGUocmVzdWx0c1swXSwgcmVzdWx0c1sxXSwgdGhpcy5jb25maWcpXG4gICAgICAgICAgICB0aGlzLm5vZGUuc3RhcnQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncDJwIG5vZGUgc3RhcnRlZCcpXG4gICAgICAgICAgICAgICAgdGhpcy5pcGNDbGllbnQoKS5lbWl0KEVWRU5UX0xPRywgJ1AyUCBDbGllbnQgc3RhcnRlZCcpXG4gICAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ3AycCBub2RlIGZhaWxlZCB0byBzdGFydCcsIGVycm9yKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIDIuIENyZWF0ZSB0aGUgY29ubmVjdGlvbiBtYW5hZ2VyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25NYW5hZ2VyID0gbmV3IENvbm5NYW5hZ2VyKHRoaXMubm9kZSwgey8qIFRPRE86IGNvbm5lY3Rpb24gbGltaXRzICovfSlcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbk1hbmFnZXIuc3RhcnQoKVxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uTWFuYWdlci5vbignY29ubmVjdGVkJywgcGVlcklkID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncGVlciBjb25uZWN0ZWQnLCBwZWVySWQpXG4gICAgICAgICAgICAgICAgdGhpcy5pcGNDbGllbnQoKS5lbWl0KERBVEEsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogREFUQV9UWVBFUy5QRUVSX0NPTk5FQ1RFRCxcbiAgICAgICAgICAgICAgICAgICAgcGVlcklkOiBwZWVySWRcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbk1hbmFnZXIub24oJ2Rpc2Nvbm5lY3RlZCcsIHBlZXJJZCA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ3BlZXIgZGlzY29ubmVjdGVkJywgcGVlcklkKVxuICAgICAgICAgICAgICAgIHRoaXMuaXBjQ2xpZW50KCkuZW1pdChEQVRBLCB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IERBVEFfVFlQRVMuUEVFUl9ESVNDT05ORUNURUQsXG4gICAgICAgICAgICAgICAgICAgIHBlZXJJZDogcGVlcklkXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25NYW5hZ2VyLm9uKCdsaW1pdDpleGNlZWRlZCcsIChsaW1pdE5hbWUsIG1lYXN1cmVkKSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ2Nvbm5lY3Rpb24gbWFuYWdlciByZXBvcnRlZCBsaW1pdCBleGNlZWRlZCcsIGxpbWl0TmFtZSwgbWVhc3VyZWQpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gVE9ETzogZmlndXJlIG91dCBwZWVyIGNvbW11bmljYXRpb24gdXNpbmcgZWl0aGVyIG5vZGUgb3IgbWFuYWdlci5cbiAgICAgICAgICAgIC8vIFdlIHNob3VsZCBzZXR1cCBhbGwgb2Ygb3VyIFJQQyBoYW5kbGVycyBoZXJlLlxuICAgICAgICAgICAgLy8gbm9kZS5vbigncGVlcjpkaXNjb25uZWN0JywgKHBlZXIpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygncGVlcjpkaXNjb25uZWN0JylcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAvLyBOT1RFOiBwZWVyOmNvbm5lY3Rpb24gaXMgdXNlZCBpbiBwbGFjZSBvZiBwZWVyOmNvbm5lY3QgKGxpYnAycC1ycGMgYWRkcyB0aGlzIGV2ZW50IGluIG9yZGVyIHRvIGF0dGFjaCBycGMpXG4gICAgICAgICAgICB0aGlzLm5vZGUub24oJ3BlZXI6Y29ubmVjdGlvbicsIChjb25uLCBwZWVyLCB0eXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gTWFrZSBSUEMgY2FsbCB0byBwZWVyXG4gICAgICAgICAgICAgICAgcGVlci5ycGMuc2F5SGVsbG8oe25hbWU6ICdGb28nfSwgKHJlc3BvbnNlLCBwZWVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZScsIHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gRGVmaW5lIFJQQyBoYW5kbGVyc1xuICAgICAgICAgICAgdGhpcy5ub2RlLmhhbmRsZSgnc2F5SGVsbG8nLCAobWVzc2FnZSwgcGVlciwgcmVzcG9uZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc3BvbmQoeyBtZXNzYWdlOiAnaGV5VGhlcmUnIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS5jYXRjaChlcnJvcnMgPT4ge1xuICAgICAgICAgICAgLy8gVE9ETzogcmVwb3J0IHVuYWJsZSB0byBzdGFydCBhbmQgc2h1dGRvd24gKGlwYyBjaGFubmVsIHNob3VsZCBiZSBvcGVuKVxuICAgICAgICAgICAgZXJyb3IoZXJyb3JzKVxuICAgICAgICB9KVxuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICBpZiAoIHRoaXMuY29ubmVjdGlvbk1hbmFnZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbk1hbmFnZXIuc3RvcCgoKSA9PiB7fSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHRoaXMubm9kZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnN0b3AoKCkgPT4ge30pXG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NyZWF0ZU5vZGVQZWVySW5mbygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNyZWF0ZSgoZXJyLCBwZWVySW5mbykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggZXJyICkgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwZWVySW5mbylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuICAgIF9sb2FkUHJvdG9jb2xJbnRlcmZhY2UoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsb2FkKGpvaW4oX19kaXJuYW1lLCAnLi9hby5wMnAucHJvdG8nKSkudGhlbigocHJvdG9jb2xJbnRlcmZhY2UpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncHJvdG8zIHByb3RvY29sIGludGVyZmFjZSBsb2FkZWQnKVxuICAgICAgICAgICAgICAgIHJlc29sdmUocHJvdG9jb2xJbnRlcmZhY2UpXG4gICAgICAgICAgICB9KS5jYXRjaChyZWplY3QpXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5pZiAocmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHsgICAgXG4gICAgY29uc3QgcDJwID0gbmV3IFAyUChhcmd2LmlwY1NlcnZlcklkKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUDJQOyJdfQ==