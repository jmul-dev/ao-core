import Dat from 'dat-node';
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

export interface DatEntry {
    key: string;
    createdAt?: Date;
    updatedAt?: Date;
    complete?: boolean;
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
        this.router.on('/dat/stopAll', this._handleDatStopAll.bind(this))
        this.router.on('/dat/create', this._handleDatCreate.bind(this))
        this.router.on('/dat/download', this._handleDatDownload.bind(this))
        this.router.on('/dat/check', this._handleDatCheck.bind(this))
        this.router.on('/dat/stats', this._handleGetDatStats.bind(this))
        this.datsDb = new Datastore({
            filename: path.resolve(this.storageLocation, 'dats.db.json'),
            autoload: true,
            onload: (error?: Error) => {
                if ( error ) {
                    debug('Error loading dats database', error)
                    this.router.send('/core/log', {message: 'Error loading dats database'})
                }
                this._resumeAll().catch((error: Error) => {
                    debug(`Error resuming all dats`, error)
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
                    debug('Resumed all dats')
                    this.router.send('/core/log', { message: `[AO Dat] All local dats resumed` })
                    resolve()
                }).catch(reject)
            })
        })
    }

    private _resume(datEntry: DatEntry): Promise<any> {
        return new Promise((resolve, reject) => {
            const datDir = path.join(this.datDir, datEntry.key)
            debug(`Resuming dat: ${datDir}`)
            Dat(datDir, (err: Error, dat: Dat) => {
                if (err) {
                    debug('Error resuming dat ' + datEntry.key)
                    reject(err)
                }
                dat.importFiles({}, () => {
                    this._updateDatEntry({
                        ...datEntry,
                        complete: true,
                    })
                })
                dat.joinNetwork()
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

    private _handleDatDownload(request: IAORouterRequest) {
        const requestData: AODat_Download_Data = request.data;        
        if ( this.dats[requestData.key] ) {
            // A. This dat already exists!
            this._getDatEntry(requestData.key).then(request.respond).catch(request.reject)
        } else {
            // B. We do not have this dat, proceed to create and download
            const newDatPath = path.join(this.datDir, requestData.key);
            Dat(newDatPath, {key: requestData.key}, (err, dat) => {
                if ( err ) {
                    debug('failed to download dat', err)
                    request.reject(err)
                    return;
                }
                dat.joinNetwork((err) => {
                    if ( err ) {
                        debug('failed to join network for dat download', err)
                        request.reject(err)
                        return;
                    } else if ( !dat.network.connected || !dat.network.connecting ) {
                        debug('no one is hosting dat://' + requestData.key)
                        request.reject(new Error('No users are hosting the requested content'))
                        return;
                    } else {
                        debug('succesfully joined network for dat://' + requestData.key)
                        const datKey = dat.key.toString('hex');
                        this.dats[datKey] = dat;
                        const newDatEntry: DatEntry = {
                            key: datKey,
                            complete: false,
                            updatedAt: new Date(),
                            createdAt: new Date(),
                        }
                        this._updateDatEntry(newDatEntry)            
                        request.respond({
                            ...newDatEntry,
                        })
                    }
                })           
            })
        }
    }

    private _handleDatCheck(request: IAORouterRequest) {
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