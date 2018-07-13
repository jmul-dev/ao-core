'use strict'
import Router from "../messaging/router";
import Message  from "../messaging/message";
import md5 from 'md5'
import Debug from 'debug';
import { MessageObject } from "../messaging/message_interfaces";

const debug = Debug('ao:db');
const error = Debug('ao:db:error');

class Database {
    private videos: Object = {};
    private peers: Object = {};
    private logs: Array<{}> = [];
    private router:Router
    module_name:string = 'database'
    instance_id:string = md5( new Date().getTime() + Math.random() )

    constructor(router:Router) {
        this.router = router        
    }
    public async init() {
        this.register()
        .catch(e => error)
    }
    public async register() {
        return new Promise( (resolve,reject) => {
            var register_message = new Message({
                app_id: 'testing',
                type_id: "message",
                event: 'register_process',
                from: this.module_name,
                data: {
                    request: "add_to_registry",
                    name: this.module_name,
                    type: "main",
                    instance_id: this.instance_id,
                    process: this
                },
                encoding: 'json' 
            })
            this.router.invokeSubProcess(register_message.toJSON(), this.module_name )
            .then(() => {
                debug('Registered Database')
                resolve()
            })
            .catch((e) => {
                reject(e)
            })
        })
    }
    public async close() {
        return Promise.resolve();
    }
    public addPeer(peerId: string) {
        this.peers[peerId] = {
            id: peerId,
            dateCreated: Date.now()
        }
    }
    public removePeer(peerId: string) {
        delete this.peers[peerId]
    }
    /**
     * Logs
     */
    public addLog(log) {
        this.logs.push({
            ...log,
            dateCreated: Date.now()
        })
    }
    public getLogs() {
        return this.logs
    }

    public eth_address:string
    public setEthAddress(eth_address:string) {
        this.eth_address = eth_address
    }

    //This is for subprocesses to be able to send stuff to the DB.
    public send( message:MessageObject) {
        debug( message )
        switch(message.event) {
            case 'db_get_eth_address':
                var send_data = {
                    eth_address: this.eth_address
                }
                break;
            default:
                error('No matching event')
                break;
        }
        if(message.data.callback_event) {
            var cb_message = new Message({
                app_id: 'testing',
                type_id: "message",
                event: message.data.callback_event,
                from: this.module_name,
                data: send_data,
                encoding: 'json'
            })
            this.router.invokeSubProcess(cb_message.toJSON(),this.module_name)
        }
    }
}

export default Database;