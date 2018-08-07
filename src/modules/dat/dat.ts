import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";

import Multidat from 'multidat'
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
    private multidat: Multidat
    private db: toilet  //That's right, we're going to use the toilet.
    private dats: Array<any>
    
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

        Multidat(this.db, (err, multidat) => {
            if(err) {
                request.reject(err)
            }
            this.multidat = multidat
            this.dats = multidat.list()
            for (let i = 0; i < this.dats.length; i++) {
                const dat = this.dats[i];
                dat.importFiles()
                dat.joinNetwork()
                const dat_link = 'dat://' + dat.key.toString('hex')
                debug('Joined network for: '+ dat_link)
            }
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
        if(!this.multidat) {
            request.reject(new Error('Multidat is not ready? is EthAddress set?'))
        } else {
            this.multidat.create( fullPath, (err, dat) => {
                if(err) {
                    request.reject(err)
                }
                this.dats = this.multidat.list()//update list.
                dat.importFiles()
                const datFolder = basename(fullPath)
                const datKey =  dat.key.toString('hex')
                debug('New link: dat://' + datKey)

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
        if(this.multidat) {
            const dats = this.multidat.list()
            for (let i = 0; i < dats.length; i++) {
                const dat = dats[i];
                if(dat.key.toString('hex') == requestData.key) {
                    debug('Joining network for '+requestData.key)
                    dat.importFiles()
                    dat.joinNetwork()
                    break;
                }
            }
            request.respond({})
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatDownload(request: IAORouterRequest) {
        const requestData: AODat_Download_Data = request.data
        if(this.multidat) {
            const options = {
                key: requestData.key
            }
            Dat(requestData.newDatDir, options, (err,dat) => {
                if(err) {
                    request.reject(new Error('Issue with dat download'))
                }
                dat.importFiles()
            })
        } else {
            request.reject(new Error('Not initialized'))
        }
        
    }

    private _handleDatRemove(request: IAORouterRequest) {
        const requestData: AODat_Remove_Data = request.data
        if(this.multidat) {
            this.multidat.close(requestData.key,(err) => {
                request.reject(err)
            })
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    private _handleDatList(request: IAORouterRequest) {
        //const requestData: AODat_List_Data = request.data
        if(this.multidat) {
            const dat_list = []
            for (let i = 0; i < this.multidat.list().length; i++) {
                const dat = this.multidat.list()[i];
                dat_list.push( dat.key.toString('hex') )
            }
            request.respond({dat_list: dat_list})
        } else {
            request.reject(new Error('Not initialized'))
        }
    }

    

}