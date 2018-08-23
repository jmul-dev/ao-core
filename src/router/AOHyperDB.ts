import hyperdb from 'hyperdb'
import discovery from 'discovery-swarm'
import swarmDefaults from 'dat-swarm-defaults'
import Debug from 'debug';
const debug = Debug('ao:hyperdb');

export interface AO_Hyper_Options {
    dbKey:string;
    dbPath:string
}

export default class AOHyperDB {
    private db:hyperdb
    private dbKey:string
    private dbPath:string
    private swarm: discovery

    constructor() {
    }

    //Init is separate from the constructor since we don't know all use cases until other modules are fully loaded (say web3/eth address)
    public init( hyperOptions:AO_Hyper_Options ) {
        return new Promise((resolve,reject) => {
            this.dbKey = hyperOptions.dbKey
            this.dbPath = hyperOptions.dbPath
            
            this.db = hyperdb(this.dbPath, this.dbKey, { valueEncoding: 'utf-8'} )
            this.db.on('ready', () => {
                this.swarm = discovery(
                    swarmDefaults({
                        id: this.dbKey,
                        stream: (peer) => {
                            return this.db.replicate({live:true})
                        }
                    })
                )

                this.swarm.join(this.dbKey)
                this.swarm.on('connection', (peer) => {
                    //TODO: Get rid of this debug when we're all done.
                    debug('swarm peer connected: ' + peer.id.toString('hex'))
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
                        const result = []
                        for (const node of nodes) {
                            const nodeKey = node[0].key.substr(node[0].key.lastIndexOf("/") + 1);//Thanks Johan!
                            result.push({
                                key: nodeKey,
                                value: node[0].value
                            })
                            resolve(result)
                        }
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