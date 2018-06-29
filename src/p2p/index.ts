#!/usr/local/bin/node
'use strict';
import { join } from "path";
import { load } from "protobufjs";
import { create } from "peer-info";
import Node from "libp2p-rpc";
import ConnManager from "libp2p-connection-manager";
import minimist from 'minimist';
import Debug from 'debug';
const debug = Debug('ao:p2p');
const error = Debug('ao:p2p:error');
const argv = minimist(process.argv.slice(2));


class P2P {
    config: {
        name: string;
        version: string;
        service: string;
        bootstrapers: Array<any>;
        multicastDNS: any;
    }
    connectionManager: ConnManager;
    node: Node;
    constructor() {
        this.config = {
            name: 'AO',  // Protocol name used for handshake
            version: '0.0.1',            // Protocol version used for handshake
            service: 'Protocol',         // Name of service in .proto file
            bootstrapers: [],            // Bootstrapping nodes 
            multicastDNS: {
                // multicastDNS options
                interval: 1000
            }
        }
        this.connectionManager = null
        this.node = null
        
        if( process.send ) {
            debug('has parent.  registering the thang')
            process.send({
                app_id: 'testing', //Should be passed to this thing on initial start.
                event: "register_process",
                type_id: "bogus",
                data: { 
                    request: "add_to_registry",
                    name: "p2pSubProcess",
                    type: "subprocess"
                },
                encoding: "json"
            })
        }

        this.start()
    }
    start() {
        const peerInfoPromise = this._createNodePeerInfo()
        const loadProtocolInterfacePromise = this._loadProtocolInterface()
        Promise.all([peerInfoPromise, loadProtocolInterfacePromise]).then(results => {
            // 1. Create our Node (inherits from libp2p)
            this.node = new Node(results[0], results[1], this.config)
            this.node.start().then(() => {
                debug('p2p node started')
                //this.ipcClient().emit(EVENT_LOG, 'P2P Client started')
            }).catch(error => {
                debug('p2p node failed to start', error)
            })
            // 2. Create the connection manager
            this.connectionManager = new ConnManager(this.node, {/* TODO: connection limits */})
            this.connectionManager.start()
            this.connectionManager.on('connected', peerId => {
                debug('peer connected', peerId)
                // this.ipcClient().emit(DATA, {
                //     type: DATA_TYPES.PEER_CONNECTED,
                //     peerId: peerId
                // })
            })
            this.connectionManager.on('disconnected', peerId => {
                debug('peer disconnected', peerId)
                // this.ipcClient().emit(DATA, {
                //     type: DATA_TYPES.PEER_DISCONNECTED,
                //     peerId: peerId
                // })
            })
            this.connectionManager.on('limit:exceeded', (limitName, measured) => {
                debug('connection manager reported limit exceeded', limitName, measured)
            })
            // TODO: figure out peer communication using either node or manager.
            // We should setup all of our RPC handlers here.
            // node.on('peer:disconnect', (peer) => {
            //     console.log('peer:disconnect')
            // })
            // NOTE: peer:connection is used in place of peer:connect (libp2p-rpc adds this event in order to attach rpc)
            this.node.on('peer:connection', (conn, peer, type) => {
                // Make RPC call to peer
                peer.rpc.sayHello({name: 'Foo'}, (response, peer) => {
                    console.log('Response', response)
                })
            })
            // Define RPC handlers
            this.node.handle('sayHello', (message, peer, respond) => {
                respond({ message: 'heyThere' })
            })
        }).catch(errors => {
            // TODO: report unable to start and shutdown (ipc channel should be open)
            error(errors)
        })
    }
    stop() {
        if ( this.connectionManager !== undefined ) {
            this.connectionManager.stop(() => {})
        }
        if ( this.node !== undefined ) {
            this.node.stop(() => {})
        }
    }
    _createNodePeerInfo() {
        return new Promise((resolve, reject) => {
            create((err, peerInfo) => {
                if ( err ) return reject(err)
                resolve(peerInfo)
            })
        })
    }
    _loadProtocolInterface() {
        return new Promise((resolve, reject) => {
            load(join(__dirname, '../../src/p2p/ao.p2p.proto')).then((protocolInterface) => {
                debug('proto3 protocol interface loaded')
                resolve(protocolInterface)
            }).catch(reject)
        })
    }
}

if (require.main === module) {    
    const p2p = new P2P();
}

export default P2P;