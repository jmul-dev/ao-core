#!/usr/local/bin/node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var protobufjs_1 = require("protobufjs");
var peer_info_1 = require("peer-info");
var libp2p_rpc_1 = __importDefault(require("libp2p-rpc"));
var libp2p_connection_manager_1 = __importDefault(require("libp2p-connection-manager"));
var ipc_client_1 = __importDefault(require("../interfaces/ipc-client"));
var constants_js_1 = require("../constants.js");
var minimist_1 = __importDefault(require("minimist"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('ao:p2p');
var error = debug_1.default('ao:p2p:error');
var argv = minimist_1.default(process.argv.slice(2));
var P2P = /** @class */ (function (_super) {
    __extends(P2P, _super);
    function P2P(ipcServerId) {
        var _this = _super.call(this, 'ao_p2p_process', ipcServerId) || this;
        _this.config = {
            name: 'AO',
            version: '0.0.1',
            service: 'Protocol',
            bootstrapers: [],
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
    P2P.prototype.start = function () {
        var _this = this;
        var peerInfoPromise = this._createNodePeerInfo();
        var loadProtocolInterfacePromise = this._loadProtocolInterface();
        Promise.all([peerInfoPromise, loadProtocolInterfacePromise]).then(function (results) {
            // 1. Create our Node (inherits from libp2p)
            _this.node = new libp2p_rpc_1.default(results[0], results[1], _this.config);
            _this.node.start().then(function () {
                debug('p2p node started');
                _this.ipcClient().emit(constants_js_1.EVENT_LOG, 'P2P Client started');
            }).catch(function (error) {
                debug('p2p node failed to start', error);
            });
            // 2. Create the connection manager
            _this.connectionManager = new libp2p_connection_manager_1.default(_this.node, { /* TODO: connection limits */});
            _this.connectionManager.start();
            _this.connectionManager.on('connected', function (peerId) {
                debug('peer connected', peerId);
                _this.ipcClient().emit(constants_js_1.DATA, {
                    type: constants_js_1.DATA_TYPES.PEER_CONNECTED,
                    peerId: peerId
                });
            });
            _this.connectionManager.on('disconnected', function (peerId) {
                debug('peer disconnected', peerId);
                _this.ipcClient().emit(constants_js_1.DATA, {
                    type: constants_js_1.DATA_TYPES.PEER_DISCONNECTED,
                    peerId: peerId
                });
            });
            _this.connectionManager.on('limit:exceeded', function (limitName, measured) {
                debug('connection manager reported limit exceeded', limitName, measured);
            });
            // TODO: figure out peer communication using either node or manager.
            // We should setup all of our RPC handlers here.
            // node.on('peer:disconnect', (peer) => {
            //     console.log('peer:disconnect')
            // })
            // NOTE: peer:connection is used in place of peer:connect (libp2p-rpc adds this event in order to attach rpc)
            _this.node.on('peer:connection', function (conn, peer, type) {
                // Make RPC call to peer
                peer.rpc.sayHello({ name: 'Foo' }, function (response, peer) {
                    console.log('Response', response);
                });
            });
            // Define RPC handlers
            _this.node.handle('sayHello', function (message, peer, respond) {
                respond({ message: 'heyThere' });
            });
        }).catch(function (errors) {
            // TODO: report unable to start and shutdown (ipc channel should be open)
            error(errors);
        });
    };
    P2P.prototype.stop = function () {
        if (this.connectionManager !== undefined) {
            this.connectionManager.stop(function () { });
        }
        if (this.node !== undefined) {
            this.node.stop(function () { });
        }
    };
    P2P.prototype._createNodePeerInfo = function () {
        return new Promise(function (resolve, reject) {
            peer_info_1.create(function (err, peerInfo) {
                if (err)
                    return reject(err);
                resolve(peerInfo);
            });
        });
    };
    P2P.prototype._loadProtocolInterface = function () {
        return new Promise(function (resolve, reject) {
            protobufjs_1.load(path_1.join(__dirname, '../../src/p2p/ao.p2p.proto')).then(function (protocolInterface) {
                debug('proto3 protocol interface loaded');
                resolve(protocolInterface);
            }).catch(reject);
        });
    };
    return P2P;
}(ipc_client_1.default));
if (require.main === module) {
    var p2p = new P2P(argv.ipcServerId);
}
exports.default = P2P;
//# sourceMappingURL=index.js.map