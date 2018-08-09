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
    ethAddress: string;
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
    dir?: string;
    contentJSON?: Object;
    createdAt?: Date;
    updatedAt?: Date;
    instance?: Dat;
}


export default class AODat extends AORouterInterface {

    private ethAddress: string
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
        this.router.on('/dat/preview', this._handleDatPreview.bind(this))
        this.router.on('/dat/download', this._handleDatDownload.bind(this))
        this.router.on('/dat/remove', this._handleDatRemove.bind(this))
        this.router.on('/dat/list', this._handleDatList.bind(this))
        debug(`started`)
    }

    //Should be the first method called by the core processes.
    private _handleDatResumeAll(request: IAORouterRequest) {
        const requestData: AODat_ResumeAll_Data = request.data

        //Initialization
        this.ethAddress = requestData.ethAddress
        this.datDir = path.resolve(this.storageLocation, requestData.ethAddress, 'dat')

        const datInitData: AODB_DatsInit_Data = {
            ethAddress: this.ethAddress
        }
        this.router.send('/db/dats/init', datInitData).then((dats) => {
            this.dats = dats.data
            let initPromises = []
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    initPromises.push(new Promise((resolve,reject) => {
                        const datInfo = this.dats[key];
                        const datDir = path.join(this.datDir, datInfo.dir)
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
                debug(`Dat process initialized for user ${this.ethAddress}`)
                this.router.send('/core/log', {message: `[AO Dat] Dat process initialized for user ${this.ethAddress}`})
                request.respond({dat:'All Dats have Resumed'})
            }).catch(request.reject)

        }).catch(request.reject)
    }

    private _handleDatStopAll(request: IAORouterRequest) {
        const requestData: AODat_StopAll_Data = request.data
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
                const datFolder = basename(fullPath)
                const datKey =  dat.key.toString('hex')
                debug('New link: dat://' + datKey)

                const dbInsertData:AODB_DatsInsert_Data = {
                    key: datKey,
                    dir: fullPath
                }
                this.router.send('/db/dats/insert',dbInsertData)
                .then(()=> {
                    //TODO: Figure out if we want to have contentJSON be returned through another method.
                    this.dats[datKey] = {
                        key: datKey,
                        dir: fullPath
                    }
                    request.respond({                    
                        key: datKey,
                        dir: datFolder
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
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    const dat = this.dats[key];
                    const instance = dat.instance
                    if(
                        instance &&
                        instance.key.toString('hex') == requestData.key
                    ) {
                        debug('Joining network for '+requestData.key)
                        instance.importFiles()
                        instance.joinNetwork()
                        break;
                    }
                }
            }
            request.respond({})
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatPreview(request: IAORouterRequest) {
        const requestData: AODat_Download_Data = request.data
        if(this.dats) {
            const options = {
                key: requestData.key,
                sparse: true
            }
            Dat(requestData.newDatDir, options, (err,dat) => {
                if(err) {
                    request.reject(new Error('Issue with dat download'))
                }
                //Don't run importFile here.  That'll cause this entire archive to be downloaded
                dat.joinNetwork()
                dat.archive.readFile('content.json', (err,content) => {
                    if(err) {
                        request.reject(new Error('content.json download error'))
                    }
                    const contentJSON = JSON.parse(content)
                    const teaserName = contentJSON['teaserName']
                    dat.archive.readFile(teaserName, (err,teaser) => {
                        //Should save directly to file
                    })

                    const dbInsertData:AODB_DatsInsert_Data = {
                        key: requestData.key,
                        dir: requestData.newDatDir,
                        contentJSON: contentJSON
                    }
                    this.router.send('/db/dats/insert', dbInsertData)
                    .then(() => {
                        this.dats[requestData.key] = dbInsertData
                        this.dats[requestData.key].instance = dat
                    }).catch(request.reject)
                })
            })
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatDownload(request: IAORouterRequest) {
        const requestData: AODat_Download_Data = request.data
        if(!this.dats[requestData.key]) {
            request.reject(new Error('Preview not generated / no such instance'))
        } else {
            const dat = this.dats[requestData.key].instance
            const fileName = this.dats[requestData.key].contentJSON['fileName']
            dat.archive.readFile(fileName, (err,video) => {
                if(err) {
                    request.reject(new Error('video file download error'))
                }
                
            })
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