import Dat from 'dat-node';
import mirror from 'mirror-folder';
import Debug from 'debug';
import path from "path";
import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Datastore from 'nedb';
const debug = Debug('ao:dat');


export interface AODat_Args {
    storageLocation: string;
}

export interface AODat_ResumeAll_Data {
}

export interface AODat_ResumeSingle_Data {
    key: string
}

export interface AODat_StopAll_Data {
}

export interface AODat_Create_Data {
    newDatDir: string;
}

export interface AODat_Download_Data {
    key: string;
}

export interface AODat_Check_Data {
    key: string;
}

export interface AODat_GetDatStats_Data {
    key: string;
}

export interface AODat_Encrypted_Download_Data {
    nodes: {[key:string]: string;}; //nodes[datkey] = contentHostId
}

export interface DatEntry {
    key: string;
    createdAt?: Date;
    updatedAt?: Date;
    complete?: boolean;
}

export interface DatStats {
    files: number;
    byteLength: number;
    length: number;
    version: number;
    downloadSpeed: number;
    uploadSpeed: number;
    downloadTotal: number;
    uploadTotal: number;
    peersTotal: number;
    peersComplete: number;
}


export default class AODat extends AORouterInterface {
    private storageLocation: string;
    private datDir: string;
    private dats: {
        [key: string]: Dat
    } = {};
    private datsDb: Datastore;

    constructor(args: AODat_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.datDir = path.resolve(this.storageLocation, 'content')
        this.router.on('/dat/resumeAll', this._handleResumeAll.bind(this))
        this.router.on('/dat/resumeSingle', this._handleResumeSingle.bind(this))
        this.router.on('/dat/stopAll', this._handleDatStopAll.bind(this))
        this.router.on('/dat/create', this._handleDatCreate.bind(this))
        this.router.on('/dat/download', this._handleDatDownload.bind(this))
        this.router.on('/dat/encryptedFileDownload', this._handleEncryptedFileDownload.bind(this))
        this.router.on('/dat/exists', this._handleDatExists.bind(this))
        this.router.on('/dat/stats', this._handleGetDatStats.bind(this))
        this.datsDb = new Datastore({
            filename: path.resolve(this.storageLocation, 'dats.db.json'),
            autoload: true,
            onload: (error?: Error) => {
                if ( error ) {
                    debug('Error loading dats database', error)
                    this.router.send('/core/log', {message: 'Error loading dats database'})
                }
                this._resumeAll().then(() => {
                    debug(`Resumed all dats`)
                }).catch((error: Error) => {
                    debug(`Error resuming all dats: ${error.message}`)
                })
            }
        })
        this.datsDb.ensureIndex({
            fieldName: 'key',
            unique: true
        })
        debug(`started`)
    }

    private _resumeAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.datsDb.find({}).exec((error: Error, docs) => {
                if ( error ) {
                    debug('Error loading dats from datsDb', error)
                    reject(error)
                    return;
                }
                let datKeyPromises = []
                docs.forEach((datEntry: DatEntry) => {
                    datKeyPromises.push(this._resume(datEntry))
                })
                Promise.all(datKeyPromises).then(() => {
                    this.router.send('/core/log', { message: `[AO Dat] All local dats resumed` })
                    resolve()
                }).catch(reject)
            })
        })
    }

    private _resume(datEntry: DatEntry): Promise<any> {
        return new Promise((resolve, reject) => {
            if ( this.dats[datEntry.key] ) {
                debug(`Dat ${datEntry.key} already resumed`)
                resolve()
                return;
            }
            const datDir = path.join(this.datDir, datEntry.key)
            debug(`Resuming dat: ${datDir}`)
            Dat(datDir, (err: Error, dat: Dat) => {
                if (err || !dat) {
                    debug('Error resuming dat ' + datEntry.key)
                    reject(err)
                    if ( err.name === 'IncompatibleError' ) {
                        // TODO: Dat folder is kinda fucked, recommended route it to `rm -fr .dat`
                        // Going to ingore for now, but might want to address this at some point.
                    }
                    return null;
                }
                dat.joinNetwork((err) => {
                    if(err) {
                        debug(err)
                    } else {
                        this._updateDatEntry(datEntry)
                    }
                })
                debug(`Joined network: dat://${dat.key.toString('hex')}`)
                this.dats[datEntry.key] = dat
                resolve()
            })
        })
    }

    private _updateDatEntry(datEntry: DatEntry) {
        this.datsDb.update({key: datEntry.key}, datEntry, {upsert: true})
    }

    private _getDatEntry(datKey: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.datsDb.findOne({key: datKey}, function(error: Error, doc: DatEntry) {
                if ( error ) {
                    reject(error)
                } else if ( !doc ) {
                    reject( new Error(`No dat entry found for key: ${datKey}`) )
                } else {
                    resolve(doc)
                }
            })
        })
    }

    private _handleGetDatStats(request: IAORouterRequest) {
        const requestData: AODat_GetDatStats_Data = request.data
        if ( !this.dats[requestData.key] ) {
            debug(`No dat instance found for dat://${requestData.key}`)
            request.reject(new Error(`Dat instance not found`))
            return;
        }
        const datInstance = this.dats[requestData.key]
        const stats = datInstance.trackStats()
        const datStats = datInstance.stats.get()
        request.respond({
            ...datStats,
            network: stats.network,
            peers: stats.peers,
        })
    }
    
    private _handleResumeAll(request: IAORouterRequest) {
        this._resumeAll().then(request.respond).catch(request.reject)
    }

    private _handleResumeSingle(request:IAORouterRequest) {
        const requestData: AODat_ResumeSingle_Data = request.data
        this._resume(this.dats[requestData.key]).then(request.respond).catch(request.reject)
    }

    private _handleDatStopAll(request: IAORouterRequest) {
        for (const key in this.dats) {
            if (this.dats.hasOwnProperty(key)) {
                const datInstance = this.dats[key]
                if (datInstance) {
                    datInstance.close()
                }
            }
        }
        request.respond({})
    }

    private _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data
        const fullPath = path.join(this.datDir, requestData.newDatDir)
        Dat(fullPath, (err, dat) => {
            if (err) {
                debug('failed to create new dat')
                request.reject(err)
                return;
            }
            dat.importFiles()
            const datKey = dat.key.toString('hex')
            debug('Created new dat file: dat://' + datKey)
            this.dats[datKey] = dat;
            const newDatEntry: DatEntry = {
                key: datKey,
                complete: true, // assume its complete since already on disk
                updatedAt: new Date(),
                createdAt: new Date(),
            }
            this._updateDatEntry(newDatEntry)            
            request.respond({
                ...newDatEntry,
                dir: requestData.newDatDir
            })
        })
    }

    /**
     * Individual and known dat downloads
     * @param request 
     */
    private _handleDatDownload(request: IAORouterRequest) {
        const {key}: AODat_Download_Data = request.data;        
        this.downloadDat(key).then( (datEntry:DatEntry) => {
            request.respond(datEntry)
        }).catch(e => {
            request.reject(e)
        })
    }

    /**
     * Dat Downloads for encrypted files.  Goes doesn the list of given nodes
     * @param request 
     */
    private _handleEncryptedFileDownload(request:IAORouterRequest) {
        const {nodes}: AODat_Encrypted_Download_Data = request.data
        let keys = []
        for (const fileDatKey in nodes) {
            if (nodes.hasOwnProperty(fileDatKey)) {
                keys.push(fileDatKey)
            }
        }
        this.firstInSequence(keys, this.downloadDat.bind(this)).then((datEntry:DatEntry) => {
            //For when we return it.
            const contentHostId = nodes[datEntry.key]
            request.respond({
                datEntry,
                contentHostId
            })
            
        }).catch(e => {
            debug('This is bad ay! No encrypted file dat is available for download')
            request.reject(e)
        })
    }

    /**
     * Downloads dats and resolves the internal entry for that dat.
     * https://github.com/datproject/dat-node/blob/master/examples/download.js
     * @param key 
     * @returns datEntry
     */
    private downloadDat(key) {
        return new Promise((resolve,reject) => {
            if ( this.dats[key] ) {
                // A. This dat already exists!
                this._getDatEntry(key).then(() => {
                    resolve(this.dats[key])
                }).catch(reject)
            } else {
                // B. We do not have this dat, proceed to create and download
                const newDatPath = path.join(this.datDir, key);
                let downloadComplete = false
                Dat(newDatPath, {key: key}, (err, dat) => {
                    if ( err || !dat ) {
                        debug('failed to download dat', err)
                        reject(err)
                        return;
                    }
                    try {
                        dat.joinNetwork((err) => {
                            if ( err ) {
                                debug('failed to join network for dat download', err)
                                reject(err)
                                return;
                            } else if ( !dat.network.connected || !dat.network.connecting ) {
                                debug('no one is hosting dat://' + key)
                                reject(new Error('No users are hosting the requested content'))
                                return;
                            } else {
                                debug('succesfully joined network for dat://' + key)
                                const datKey = dat.key.toString('hex');
                                this.dats[datKey] = dat;
                                const newDatEntry: DatEntry = {
                                    key: datKey,
                                    complete: downloadComplete,
                                    updatedAt: new Date(),
                                    createdAt: new Date(),
                                }
                                this._updateDatEntry(newDatEntry)            
                                resolve({
                                    ...newDatEntry,
                                })
                            }
                        })
                        dat.archive.metadata.update(() => {
                            var progress = mirror({fs: dat.archive, name: '/'}, newDatPath, (err) => {
                                if ( err ) {
                                    debug('Error downloading dat file:', err)
                                } else {
                                    debug('fully downloaded the goods!')
                                    downloadComplete = true
                                    const updatedDatEntry: DatEntry = {
                                        key: key,
                                        complete: true,
                                        updatedAt: new Date(),
                                    }
                                    this._updateDatEntry(updatedDatEntry)
                                }                        
                            })
                        })
                    } catch (error) {
                        debug(`Dat error while attempting to download...`, error)
                        reject(error)
                    }
                })
            }
        })
    }

    //For Dat download in sequence: https://www.abeautifulsite.net/executing-promises-in-sequence-and-stopping-at-the-first-resolved-promise
    private firstInSequence(values, asyncFn) {
        return new Promise((resolve, reject) => {
            // Are there any values to check?
            if(values.length === 0) {
                // All were rejected
                reject();
            }
            // Try the first value
            asyncFn(values[0]).then((val) =>  {
                // Resolved, we're all done
                resolve(val);
            }).catch(() =>{
                // Rejected, remove the first item from the array and recursively
                // try the next one
                values.shift();
                this.firstInSequence(values, asyncFn).then(resolve).catch(reject);
            });
        });
    }

    private _handleDatExists(request: IAORouterRequest) {
        const requestData: AODat_Check_Data = request.data
        this._getDatEntry(requestData.key).then((datEntry: DatEntry) => {
            if ( datEntry.complete ) {
                request.respond(datEntry)
            } else {
                request.reject(new Error(`Dat not initialized or complete: ${requestData.key}`))
            }
        }).catch(request.reject)
    }

    
}