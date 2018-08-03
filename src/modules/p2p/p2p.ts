import { join } from "path";
import { load } from "protobufjs";
import { create } from "peer-info";
import Node from "libp2p-rpc";
import ConnManager from "libp2p-connection-manager";

import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Debug from 'debug';
const debug = Debug('ao:p2p');

export interface AOP2P_Args {
    storageLocation: string;
}

export default class AOP2P extends AORouterInterface {
    private storageLocation: string;
    private config: {
                name: string;
                version: string;
                service: string;
                bootstrapers: Array<any>;
                multicastDNS: any;
            }
    private connectionManager: ConnManager;
    private node: Node;

    constructor(args: AOP2P_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/p2p/requestVideo', this._handleRequestVideo.bind(this))
        this.router.on('/p2p/stop', this._handleStop.bind(this))
        
        this.config = {
            name: 'AO',                  // Protocol name used for handshake
            version: '0.0.1',            // Protocol version used for handshake
            service: 'Protocol',         // Name of service in .proto file
            bootstrapers: [],            // Bootstrapping nodes 
            multicastDNS: {
                // multicastDNS options
                interval: 1000
            }
        }
        // Below commented out for the moment.
        // this.init()
        // .then(() => {
        //     debug('started')
        // })
        // .catch(e => {
        //     debug(e)
        // })
    }

    private _handleRequestVideo(request:IAORouterRequest) {
        if( this.connectionManager && this.node ) {

        } else {
            request.reject(new Error('No Connection Manager and/or Node connected'))
        }

    }

    private _handleStop(request:IAORouterRequest) {
        if ( this.connectionManager !== undefined ) {
            this.connectionManager.stop(() => {})
        }
        if ( this.node !== undefined ) {
            this.node.stop(() => {})
        }
        request.respond({})
    }

    /**
     * Below are P2P init processes.
     */
    async init() {
        return new Promise( (resolve,reject) => {
            const peerInfoPromise = this._createNodePeerInfo()
            const loadProtocolInterfacePromise = this._loadProtocolInterface()
            Promise.all([peerInfoPromise, loadProtocolInterfacePromise]).then(results => {
                // 1. Create our Node (inherits from libp2p)
                this.node = new Node(results[0], results[1], this.config)
                this.node.start().then(() => {
                    debug('p2p node started')
                    resolve()
                }).catch(error => {
                    debug('p2p node failed to start', error)
                    reject(error)
                })
                // 2. Create the connection manager
                this.connectionManager = new ConnManager(this.node, {/* TODO: connection limits */})
                this.connectionManager.start()
                this.connectionManager.on('connected', peerId => {
                    debug('peer connected', peerId)
                })
                this.connectionManager.on('disconnected', peerId => {
                    debug('peer disconnected', peerId)
                    
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
                debug(errors)
            })
        })
    }    
    private _createNodePeerInfo() {
        return new Promise((resolve, reject) => {
            create((err, peerInfo) => {
                if ( err ) return reject(err)
                resolve(peerInfo)
            })
        })
    }
    private _loadProtocolInterface() {
        return new Promise((resolve, reject) => {
            load(join(__dirname, '../../../src/modules/p2p/ao.p2p.proto')).then((protocolInterface) => {
                debug('proto3 protocol interface loaded')
                resolve(protocolInterface)
            }).catch(reject)
        })
    }
}