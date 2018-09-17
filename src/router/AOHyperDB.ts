import hyperdb from 'hyperdb'
import discovery from 'discovery-swarm'
import swarmDefaults from 'dat-swarm-defaults'
import Debug from 'debug';
const debug = Debug('ao:hyperdb');

export interface AO_Hyper_Options {
    dbKey: string;
    dbPath: string;
    autoAuth: boolean;
}

export interface HDB_ListValueRow {
    key: string, 
    splitKey: Array<string>, 
    value: any
}

export default class AOHyperDB {
    private db:hyperdb
    private dbKey:string
    private dbPath:string
    private autoAuth: boolean
    private swarm: discovery

    constructor() {
    }

    //Init is separate from the constructor since we don't know all use cases until other modules are fully loaded (say web3/eth address)
    public init( hyperOptions:AO_Hyper_Options ) {
        return new Promise((resolve,reject) => {
            this.dbKey = hyperOptions.dbKey
            this.dbPath = hyperOptions.dbPath
            this.autoAuth = hyperOptions.autoAuth
            
            this.db = hyperdb(this.dbPath, this.dbKey, { valueEncoding: 'utf-8'} )
            this.db.on('ready', () => {
                this.swarm = discovery(
                    swarmDefaults({
                        id: this.dbKey,
                        stream: (peer) => {
                            return this.db.replicate({
                                live:true,
                                userData: this.db.local.key
                            })
                        }
                    })
                )

                this.swarm.join(this.dbKey)
                this.swarm.on('connection', (peer) => {
                    //TODO: Get rid of this debug when we're all done.
                    debug('swarm peer connected: ' + peer.id.toString('hex'))
                    if (!this.autoAuth) {
                        return
                    }

                    if (!peer.remoteUserData) {
                        debug("peer missing user data")
                        return
                    }

                    let remotePeerKey
                    try { 
                        remotePeerKey = Buffer.from(peer.remoteUserData) 
                    } catch (err) { 
                        console.error(err); 
                        return 
                    }
            
                    this.db.authorized(remotePeerKey, (err, auth) => {
                        debug(remotePeerKey.toString("hex"), "authorized? " + auth)
                        if (err) {
                            return debug(err)
                        }
                        if (!auth) {
                            this.db.authorize(remotePeerKey, (err) => {
                                if (err) {
                                    return debug(err)
                                }
                                debug(remotePeerKey.toString("hex"), "was just authorized!")
                            })
                        }
                    })
                })
                resolve()
            })
        })
    }
    
    public insert(key, value) {
        return new Promise( (resolve, reject) => {
            let insertValue = value
            if(typeof value == "object") {
                insertValue = JSON.stringify(value)
            }
            this.db.put(key, insertValue, (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    public query(key) {
        return new Promise( (resolve,reject) => {
            this.db.get(key, (err, nodes) => {
                if(err) {
                    reject(err)
                } else {
                    if(nodes.length) {
                        resolve(nodes[0].value)
                    } else {
                        debug('No such record')
                        reject(null)
                    }
                }
            })
        })
    }

    public exists(key) {
        return new Promise( (resolve,reject) => {
            this.db.get(key, (err, nodes) => {
                if(err) {
                    debug(err)
                    resolve(false)
                } else {
                    if(nodes.length) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            })
        })
    }

    public list(key) {
        return new Promise((resolve,reject) => {
            this.db.list(key, (err, nodes) => {
                if(err) {
                    reject(err)
                } else {
                    if(nodes.length) {
                        //Result is the key paths in an array format split by / for easy perusing
                        let result = []
                        for (let i = 0; i < nodes.length; i++) {
                            const node = nodes[i];
                            let node_split = node[0].key.split("/")
                            result.push(node_split)
                        }
                        resolve(result)
                    } else {
                        debug('Nothing found')
                        resolve([])
                    }
                }
            })
        })
    }

    public listValue(key) {
        return new Promise((resolve,reject) => {
            this.db.list(key, (err, nodes) => {
                if(err) {
                    reject(err)
                } else {
                    if(nodes.length) {
                        //Result is the key paths in an array format split by / for easy perusing
                        let result:Array<HDB_ListValueRow> = []
                        for (let i = 0; i < nodes.length; i++) {
                            const node = nodes[i];
                            const split_key = node[0].key.split("/")
                            const node_repack = {
                                key: split_key[0],
                                splitKey: split_key,
                                value: node[0].value
                            }
                            result.push(node_repack)
                        }
                        resolve(result)
                    } else {
                        reject()
                    }
                }
            })
        })
    }

    public watch(key) {
        return new Promise((resolve,reject) => {
            this.db.watch(key, () => {
                //change occured.
                resolve()
            })
        })
    }

    public delete(key) {
        return new Promise((resolve,reject) => {
            this.db.del(key, (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

}