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
export interface AODat_DatFileJSON_Data {
    datFolder: string;
    fileData: string;
    filePath: string;
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
    
    private datFolders:Object = {} // A way to store details for dat uploaded files.
    private datKeys:Object = {}

    constructor(args: AODat_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/dat/resumeAll', this._handleDatResumeAll.bind(this))
        this.router.on('/dat/stopAll', this._handleDatStopAll.bind(this))
        this.router.on('/dat/create', this._handleDatCreate.bind(this))
        this.router.on('/dat/fileJSON', this._handleDatFileJSON.bind(this))
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
            debug('Dat Subprocess initialized')
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
        this.multidat.create( fullPath, (err, dat) => {
            if(err) {
                request.reject(err)
            }
            this.dats = this.multidat.list()//update list.
            dat.importFiles()
            //dat.joinNetwork()
            const dat_folder = basename(fullPath)
            debug(dat_folder)
            const dat_hash =  dat.key.toString('hex')
            debug('New link: dat://' + dat_hash)

            request.respond({
                    datFolder: dat_folder,
                    hash: dat_hash
            })
        })
    }

    //Handles Video sharing JSON file creation.
    private _handleDatFileJSON(request: IAORouterRequest) {
        const requestData: AODat_DatFileJSON_Data = request.data
        const {datFolder, fileData, filePath} = requestData
        const fileName = basename(filePath)
        if(fileName == 'featuredImage') {
            fileData['file_type'] = 'image'
        }

        if(fileName == 'video') {
            delete fileData['key']
        }

        //if first cycle
        if( typeof this.datFolders[datFolder] == 'undefined') {
            this.datFolders[datFolder] = {}
        }

        this.datFolders[datFolder][fileName] = fileData

        if( Object.keys(this.datFolders[datFolder]).length == 3 ) {
            debug('Fileuploads complete for ' + datFolder)
            const basePath = path.resolve(this.ethAddress, 'dat', datFolder)
            const fileData = {
                ...this.datFolders[datFolder],
                id:datFolder
            }
            request.respond({
                fileData: fileData
            })
        } else {
            request.respond({})
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