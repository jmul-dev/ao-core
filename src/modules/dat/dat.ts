import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Dat from 'dat-node'
import toilet from 'toiletdb'
import path, { basename, dirname } from "path";
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


export default class AODat extends AORouterInterface {
    private encryptionAlgorithm: string = 'aes-256-ctr'

    private ethAddress: string
    private storageLocation: string
    private datDir: string
    private db: toilet  //That's right, we're going to use the toilet.
    private dats: Array<any>
    private contents: Object
    
    constructor(args: AODat_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/dat/resumeAll', this._handleDatResumeAll.bind(this))
        this.router.on('/dat/stopAll', this._handleDatStopAll.bind(this))
        this.router.on('/dat/create', this._handleDatCreate.bind(this))
        this.router.on('/dat/joinNetwork', this._handlejoinNetwork.bind(this)) //this is separate from above since we want to include some information in the json files
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
        this.datDir = path.resolve(this.storageLocation, requestData.ethAddress)
        this.db = toilet( path.resolve(this.datDir, 'dat.json') )
        this.dats = toilet( path.resolve(this.datDir, 'dat.json') )//For now.  Will replace quickly.

        let initPromises = []
        for (const key in this.dats) {
            if (this.dats.hasOwnProperty(key)) {
                initPromises.push(new Promise((resolve,reject) => {
                    const datInfo = this.dats[key];
                    const datDir = datInfo.dir
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
        })
    }

    private _handleDatStopAll(request: IAORouterRequest) {
        const requestData: AODat_StopAll_Data = request.data
        for (let i = 0; i < this.dats.length; i++) {
            const dat = this.dats[i]
            dat.close()
        }
        request.respond({})
    }

    private _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data
        //debug('datdir:'+this.datDir)
        const fullPath = path.resolve(this.datDir, requestData.newDatDir)
        //debug('full path:' + fullPath)
        if(!this.dats) {
            request.reject(new Error('Multidat is not ready? is EthAddress set?'))
        } else {
            Dat( fullPath, (err, dat) => {
                if(err) {
                    request.reject(err)
                }
                dat.importFiles()
                const datFolder = basename(fullPath)
                const datKey =  dat.key.toString('hex')
                debug('New link: dat://' + datKey)

                //TODO: Make sure to send the new path back to DB once DB is no longer toilet
                this.dats[datKey]['dir'] = fullPath

                request.respond({
                    datFolder: datFolder,
                    key: datKey
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
                    if(dat.key.toString('hex') == requestData.key) {
                        debug('Joining network for '+requestData.key)
                        dat.importFiles()
                        dat.joinNetwork()
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
                    this.contents[requestData.key] = JSON.parse(content)
                    const teaserName = this.contents[requestData.key]['teaserName']
                    dat.archive.readFile(teaserName, (err,teaser) => {
                        //TODO: What to do with the teaser??
                    })
                })
            })
        } else {
            request.reject(new Error('Not initialized'))
        }
        
    }
    private _handleDatDownload(request: IAORouterRequest) {
        const requestData: AODat_Download_Data = request.data
        if(!this.contents[requestData.key] && !this.dats[requestData.key]) {
            const options = {
                key: requestData.key,
                sparse: true
            }
            Dat(requestData.newDatDir, options, (err,dat) => {
                if(err) {
                    request.reject(new Error('Issue with dat download'))
                }
                dat.joinNetwork()
                dat.archive.readFile('content.json', (err,content) => {
                    if(err) {
                        request.reject(new Error('content.json download error'))
                    }
                    this.contents[requestData.key] = JSON.parse(content)
                    const fileName = this.contents[requestData.key]['fileName']
                    dat.archive.readFile(fileName, (err,video) => {
                        if(err) {
                            request.reject(new Error('video file download error'))
                        }
                        //TODO: Gotta stream that video back!
                    })
                })
            })
        } else {
            const dat = this.dats[requestData.key]
            const fileName = this.contents[requestData.key]['fileName']
            dat.archive.readFile(fileName, (err,video) => {
                if(err) {
                    request.reject(new Error('video file download error'))
                }
                //TODO: Gotta stream that video back!
            })
            
        }
    }

    private _handleDatRemove(request: IAORouterRequest) {
        const requestData: AODat_Remove_Data = request.data
        if(this.dats) {
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    const dat = this.dats[key];
                    if(dat.key.toString('hex') == requestData.key) {
                        dat.close(() => {
                            request.respond({})
                        })
                    }
                }
            }
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatList(request: IAORouterRequest) {
        //const requestData: AODat_List_Data = request.data
        if(this.dats) {
            const datList = []
            for (const key in this.dats) {
                if (this.dats.hasOwnProperty(key)) {
                    const dat = this.dats[key];
                    datList.push( dat.key.toString('hex') )
                }
            }
            request.respond({datList: datList})
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    

}