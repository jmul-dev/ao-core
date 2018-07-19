'use strict'
import toilet from 'toiletdb'
import { join } from "path";
import md5 from 'md5'
import Debug from 'debug';

import Router from "../messaging/router";
import Message  from "../messaging/message";
import { MessageObject } from "../messaging/message_interfaces";
import { resolve } from 'url';

const debug = Debug('ao:db');
const error = Debug('ao:db:error');

class Database {
    private videos: Object = {};
    private peers: Object = {};
    private logs: Array<{}> = [];
    private router:Router
    public module_name:string = 'database'
    public instance_id:string = md5( new Date().getTime() + Math.random() )

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
    //This is for subprocesses to be able to send stuff to the DB.
    public send( message:MessageObject) {
        switch(message.event) {
            case 'db_get_eth_address':
                var send_data = {
                    eth_address: this.eth_address
                }
                break;
            case 'add_dat_key':
                var db_promise = this.addDatKey(message.data)
                break;
            case 'add_dat_hash':
                var db_promise = this.addDatHash(message.data)
                break;
            default:
                error('No matching event')
                break;
        }
        if(db_promise) {
            db_promise.then(() => {
                debug('Promise ran')
            })
            .catch(e => {
                error(e)
            })
        } else if(!db_promise && message.data.callback_event) {
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

    public eth_address:string    
    public async setEthAddress(eth_address:string) {
        return new Promise( (resolve,reject) => {
            this.eth_address = eth_address
            //if the eth_address is set, we need to make sure that database is switched out.
            this.openDatabase()
            .then(() => {
                debug('Ethereum Address set, also setting for dat')
                const dat_eth_set = new Message({
                    app_id: 'testing', //Should be passed to this thing on initial start.
                    type_id: "message",
                    event: "dat_set_eth_address",
                    from: this.module_name,
                    data: {
                        eth_address: this.eth_address
                    },
                    encoding: 'json'
                })
                this.router.invokeSubProcess(dat_eth_set.toJSON(), this.module_name)
                .then(() => {
                    resolve()
                }).catch(e => {
                    reject(e)
                })
            })
            .catch(e => {
                reject(e)
            })
        })
    }

    public getEthAddress() {
        return this.eth_address
    }

    public data_folder:string
    public db_path:string
    public db:toilet
    public DB_OPEN_ERROR:string = 'Database not yet opened. Log saved to local state.'
    public DB_READ_ERROR:string = 'Database not readable.'
    public DB_WRITE_ERROR:string = 'Database not writeable.'
    public async openDatabase() {
        return new Promise((resolve,reject) => {
            this.data_folder = join( 'data', 'files', this.eth_address )
            this.db_path = join(this.data_folder, 'db.json')
            this.db = toilet(this.db_path)
            try {
                this.db.open(() => {
                    resolve()
                })
            } catch(e) {
                reject(e)
            }
            
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
        //just let this hang, no need for the function to be Promised
        if(this.db) {
            this.db.write('logs', this.logs, (err) => {
                if(err) {
                    error(err)
                }
            })
        } else {
            debug(this.DB_OPEN_ERROR)
        }
    }
    public getLogs() {
        return this.logs
    }

    /**
     * Settings
     */
    public readSettings() {
       return new Promise((resolve,reject) => {
            if(this.db) {
                this.db.read('settings', (err, data) => {
                    if(err) {
                        reject(this.DB_READ_ERROR)
                    }
                    resolve(data)
                }) 
            } else {
                reject(this.DB_OPEN_ERROR)
            }
       }) 
    }
    
    public writeSettings(data) {
        return new Promise((resolve,reject) => {
            if(this.db) {
                this.db.write('settings', data, (err) => {
                    if(err) {
                        reject(this.DB_WRITE_ERROR)
                    }
                    resolve()
                }) 
            } else {
                reject(this.DB_OPEN_ERROR)
            }
        })
    }

    /**
     * Content Key and Dat Addresses
     */

    public addDatKey(data) {
        return new Promise((resolve,reject) => {
            if(this.db) {
                this.db.read('keys',(err, keys) => {
                    if(err) {
                        reject(this.DB_WRITE_ERROR)
                    }
                    if(typeof keys == 'undefined') {
                        keys = {}
                    }
                    keys[data.dat_folder] = data.key
                    debug(keys)
                    this.db.write('keys', keys, (err) => {
                        if(err) {
                            reject(this.DB_WRITE_ERROR)
                        }
                        resolve()
                    }) 
                })
                
            } else {
                reject(this.DB_OPEN_ERROR)
            }
        })
    }

    public addDatHash(data) {
        return new Promise((resolve,reject) => {
            if(this.db) {
                this.db.read('hashes',(err, hashes) => {
                    if(err) {
                        reject(this.DB_WRITE_ERROR)
                    }
                    if(typeof hashes == 'undefined') {
                        hashes = {}
                    }
                    hashes[data.dat_folder] = data.hash
                    debug(hashes)
                    this.db.write('hashes', hashes, (err) => {
                        if(err) {
                            reject(this.DB_WRITE_ERROR)
                        }
                        resolve()
                    }) 
                })
                
            } else {
                reject(this.DB_OPEN_ERROR)
            }
        })
    }
    
}

export default Database;