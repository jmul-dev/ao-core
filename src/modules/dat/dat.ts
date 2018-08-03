import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import crypto from 'crypto'
import md5 from 'md5'
import Multidat from 'multidat'
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
    datKey: string;
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
        this.router.on('/dat/joinNetwork', this._handlejoinNetwork.bind(this))
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
        const fullPath = path.resolve(this.datDir, requestData.newDatDir)
        if(!this.multidat) {
            request.reject(new Error('Multidat is not ready? is EthAddress set?'))
        } else {
            this.multidat.create( fullPath, (err, dat) => {
                if(err) {
                    request.reject(err)
                }
                this.dats = this.multidat.list()//update list.
                dat.importFiles()
                //dat.joinNetwork()
                const datFolder = basename(fullPath)
                debug(datFolder)
                const datHash =  dat.key.toString('hex')
                debug('New link: dat://' + datHash)

                request.respond({
                        datFolder: datFolder,
                        hash: datHash
                })
            })
        }
    }
    private _handlejoinNetwork(request: IAORouterRequest) {
        const requestData: AODat_JoinNetwork_Data = request.data
        if(this.multidat) {
            const dat_list = []
            const dats = this.multidat.list()
            for (let i = 0; i < dats.length; i++) {
                const dat = dats[i];
                if(dat.key == requestData.datKey) {
                    dat.joinNetwork()
                    break;
                }
            }
            request.respond({})
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