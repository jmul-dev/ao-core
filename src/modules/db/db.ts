import AORouterInterface, { IAORouterRequest } from "../../routing/AORouterInterface";
import toilet from 'toiletdb';
import path from 'path';
import fs from 'fs';
import Debug from 'debug';
const debug = Debug('ao:db');


export interface AODB_Args {
    storageLocation: string;
}

export interface AODB_CoreGet_Data {
    key: string;
}

export interface AODB_CoreUpdate_Data {
    key: string;
    value: any;
    merge?: boolean;
}


export default class AODB extends AORouterInterface {
    public static DEFAULT_SETTINGS = {
        maxDiskSpace: -1,
        maxBandwidthUp: -1,
        maxBandwidthDown: -1,
        maxPeerConnections: -1,
        runInBackground: false,
        runOnStartup: false,
        checkForUpdates: true,
    }
    private storageLocation: string;
    private coreDb: toilet;
    private userDbs: {
        [key: string]: toilet
    }

    constructor(args: AODB_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/db/core/get', this._handleCoreDbGet.bind(this))
        this.router.on('/db/core/update', this._handleCoreDbUpdate.bind(this))
        debug(`AODB started, storage location: ${args.storageLocation}`)
    }

    private getCoreDb(): Promise<toilet> {
        return new Promise((resolve, reject) => {
            if ( this.coreDb ) {
                resolve(this.coreDb)
            } else {
                const dbLocation = path.resolve(this.storageLocation, 'core.db.json')
                // TODO: should we use fs module? ie: this.router.send('/fs/write')
                if ( !fs.existsSync(dbLocation) ) {
                    debug('coreDb does not exist, creating with settings seed')
                    const dbSeed = JSON.stringify({
                        settings: AODB.DEFAULT_SETTINGS,
                    }, null, '\t')
                    fs.writeFileSync(dbLocation, dbSeed)
                }
                this.coreDb = toilet(dbLocation)
                this.coreDb.open(err => {
                    if ( err ) {
                        reject(err)
                    } else {
                        resolve(this.coreDb)
                    }
                })
            }
        })
    }

    private getUserDb(userId: string): Promise<toilet> {
        return new Promise((resolve, reject) => {
            // TODO:
        })
    }

    private _handleCoreDbGet(request: IAORouterRequest) {
        const requestData: AODB_CoreGet_Data = request.data
        // TODO: validate requestData
        this.getCoreDb().then(db => {
            db.read(requestData.key, (err, data) => {
                if ( err ) {
                    request.reject(err)
                } else {
                    request.respond(data)
                }
            })
        }).catch(request.reject)
    }

    private _handleCoreDbUpdate(request: IAORouterRequest) {
        const requestData: AODB_CoreUpdate_Data = request.data
        // TODO: validate requestData
        this.getCoreDb().then(db => {
            db.read(requestData.key, (err, existingValue) => {
                let updatedValue = existingValue;
                if ( typeof existingValue === 'object' && requestData.merge )
                    updatedValue = Object.assign({}, existingValue, requestData.value)                
                db.write(requestData.key, requestData.value, (err, data) => {
                    if ( err ) {
                        request.reject(err)
                    } else {
                        request.respond(data)
                    }
                })
            })            
        }).catch(request.reject)
    }
}