import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Dat from 'dat-node'
import path, { basename, dirname } from "path";
import { AODB_DatsInit_Data, AODB_DatsGet_Data, AODB_DatsInsert_Data, AODB_DatsUpdate_Data, AODB_DatsRemove_Data } from '../db/db'

import Debug from 'debug';
const debug = Debug('ao:dat');

export interface AODat_Args {
    storageLocation: string;
}


export interface AODat_ResumeAll_Data {
}

export interface AODat_StopAll_Data {
}

export interface AODat_Create_Data {
    newDatDir: string;
}
export interface AODat_JoinNetwork_Data {
    key: string;
}

export interface AODat_Download_Data {
    key: string;
    newDatDir: string;
}

export interface AODat_Remove_Data {
    key: string;
}

export interface AODat_List_Data {
}

export interface Dat_In_Array {
    key?: string;
    createdAt?: Date;
    updatedAt?: Date;
    instance?: Dat;
}


export default class AODat extends AORouterInterface {
    private storageLocation: string
    private datDir: string
    private dats: Array<Dat_In_Array>
    
    constructor(args: AODat_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/dat/resumeAll', this._handleDatResumeAll.bind(this))
        this.router.on('/dat/stopAll', this._handleDatStopAll.bind(this))
        this.router.on('/dat/create', this._handleDatCreate.bind(this))
        this.router.on('/dat/joinNetwork', this._handlejoinNetwork.bind(this)) //this is separate from above since we want to include some information in the json files
        this.router.on('/dat/remove', this._handleDatRemove.bind(this))
        this.router.on('/dat/list', this._handleDatList.bind(this))
        debug(`started`)
    }

    //Should be the first method called by the core processes.
    private _handleDatResumeAll(request: IAORouterRequest) {
        this.datDir = path.resolve(this.storageLocation, 'content')
        const datInitData: AODB_DatsInit_Data = {
        }
        this.router.send('/db/dats/init', datInitData).then((dats) => {
            this.dats = dats.data
            let initPromises = []
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    initPromises.push(new Promise((resolve,reject) => {
                        const datInfo = this.dats[key];
                        const datDir = path.join(this.datDir, datInfo.key)
                        debug(datDir)
                        Dat(datDir, (err,dat) => {
                            if(err) {
                                debug('error starting dat ' + key )
                                reject()
                            }
                            dat.importFiles()
                            dat.joinNetwork()
                            const dat_link = 'dat://' + dat.key.toString('hex')
                            debug('Joined network for: '+ dat_link)
                            this.dats[key]['instance'] = dat
                            resolve()
                        })
                    }))
                }
            }
            Promise.all(initPromises).then(() => {
                debug(`Dat process initialized for user ${request.ethAddress}`)
                this.router.send('/core/log', {message: `[AO Dat] Dat process initialized for user ${request.ethAddress}`})
                request.respond({dat:'All Dats have Resumed'})
            }).catch(request.reject)

        }).catch(request.reject)
    }

    private _handleDatStopAll(request: IAORouterRequest) {
        for (const key in this.dats) {
            if (this.dats.hasOwnProperty(key)) {
                const dat = this.dats[key]
                if(dat.instance) {
                    dat.instance.close()
                }
            }
        }
        request.respond({})
    }

    private _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data
        const fullPath = path.join(this.datDir, requestData.newDatDir)
        if(!this.dats) {
            request.reject(new Error('Multidat is not ready? is EthAddress set?'))
        } else {
            Dat( fullPath, (err, dat) => {
                if(err) {
                    debug('failed to create new dat')
                    request.reject(err)
                }
                dat.importFiles()
                const datKey =  dat.key.toString('hex')
                debug('New link: dat://' + datKey)

                const dbInsertData:AODB_DatsInsert_Data = {
                    key: datKey
                }
                this.router.send('/db/dats/insert',dbInsertData)
                .then(()=> {
                    this.dats[datKey] = {
                        key: datKey
                    }
                    request.respond({                    
                        key: datKey,
                        dir: requestData.newDatDir //Note that this is used to mark the dir that this was created against.  Important for uploads as its diffrent from the final dir name
                    })    
                }).catch(e => {
                    debug('trouble with insert in dat create')
                    debug(e)
                    request.reject(e)
                })
            })
        }
    }
    private _handlejoinNetwork(request: IAORouterRequest) {
        const requestData: AODat_JoinNetwork_Data = request.data
        debug('requested join key'+requestData.key)
        if(this.dats) {
            let found = false
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    const dat = this.dats[key];
                    const instance = dat.instance
                    if(
                        instance &&
                        instance.key.toString('hex') == requestData.key
                    ) {
                        debug('Joining network for '+requestData.key)
                        instance.joinNetwork()

                        //importer options https://github.com/datproject/dat-node#var-importer--datimportfilessrc-opts-cb
                        let importer = instance.importFiles({watch: true}, () => {
                            request.respond({})
                        })
                        found = true
                        break
                        //importer.on()
                    }
                }
            }
            if(!found) {
                debug('Provided key is new, adding '+requestData.key.substr(0,8)+'... to dats')
                const fullPath = path.join(this.datDir, requestData.key)
                const options = {
                    key: requestData.key
                }
                Dat(fullPath, options, (err, instance) => {
                    const now = new Date()
                    let dat: Dat_In_Array = {
                        key: requestData.key,
                        instance: instance,
                        createdAt: now,
                        updatedAt: now
                    }
                    this.dats[requestData.key] = dat
                    const insertNewDatData: AODB_DatsInsert_Data = {
                        key: requestData.key
                    }
                    instance.joinNetwork()

                    this.router.send('/db/dats/insert',insertNewDatData).then(() => {
                        let importer = instance.importFiles({watch:true}, () => {
                            request.respond({})
                        })
                    }).catch(request.reject)
                })
            }

        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatRemove(request: IAORouterRequest) {
        const requestData: AODat_Remove_Data = request.data
        if(this.dats) {
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    const dat = this.dats[key];
                    const instance = dat.instance
                    if(
                        instance &&
                        instance.key.toString('hex') == requestData.key
                    ) {
                        instance.close(() => {
                            const datRemoveData:AODB_DatsRemove_Data = {
                                query: { key: requestData.key }
                            }
                            this.router.send('/db/dats/remove', datRemoveData).then(()=> {
                                request.respond({})
                            }).catch(request.reject)
                        })
                    }
                }
            }
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatList(request: IAORouterRequest) {
        if(this.dats) {
            const datList = []
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    const dat = this.dats[key];
                    if(dat.instance) {
                        datList.push( dat.instance.key.toString('hex') )
                    }
                }
            }
            request.respond({datList: datList})
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    

}