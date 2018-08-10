import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Datastore from 'nedb';
import path from 'path';
import fs from 'fs';
import Debug from 'debug';
const debug = Debug('ao:db');


export interface AODB_Args {
    storageLocation: string;
}

/**
 * Logs
 */
export interface AODB_LogsGet_Data {
    query: any;  // https://github.com/louischatriot/nedb#finding-documents
}
export interface AODB_LogsInsert_Data {
    message: string;
    createdAt?: Date;
}
/**
 * Settings
 */
export interface AODB_SettingsGet_Data {
    query: any;  // https://github.com/louischatriot/nedb#finding-documents
}
export interface AODB_SettingsUpdate_Data {
    maxDiskSpace?: number;
    maxBandwidthUp?: number;
    maxBandwidthDown?: number;
    maxPeerConnections?: number;
    runInBackground?: boolean;
    runOnStartup?: boolean;
    checkForUpdates?: boolean;
}
export interface AODB_Setting {
    id: string;
    setting: string;
    value: string;
}
/**
 * User
 */
export interface AODB_UserInit_Data {
    ethAddress: string;
}
export interface AODB_UserContentGet_Data {
    query?: Object;
}

/**
 * Dats
 */
export interface AODB_DatsInit_Data {
}
export interface AODB_DatsGet_Data {
    query?:Object;
}
export interface AODB_DatsInsert_Data {
    key: string;
    dir: string;
    contentJSON?: Object;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AODB_UpdateObject {
    key?: string;
    dir?: string;
    contentJSON?: Object;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface AODB_DatsUpdate_Data {
    query: Object;
    update: any;
}
export interface AODB_DatsRemove_Data {
    query: Object;
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
    private db: {
        logs: Datastore,
        settings: Datastore,
        dats?: Datastore,
        decryptionKeys?: Datastore
    };
    private userDbs: {
        [key: string]: Datastore
    } = {};

    constructor(args: AODB_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/db/logs/get', this._logsGet.bind(this))
        this.router.on('/db/logs/insert', this._logsInsert.bind(this))
        this.router.on('/db/settings/get', this._settingsGet.bind(this))
        this.router.on('/db/settings/update', this._settingsUpdate.bind(this))

        this.router.on('/db/user/init', this._setupUserDb.bind(this))
        this.router.on('/db/user/get', this._getUser.bind(this))
        this.router.on('/db/user/content/get', this._userContentGet.bind(this))
        this.router.on('/db/user/content/insert', this._userContentInsert.bind(this))

        this.router.on('/db/dats/init', this._datsInit.bind(this))
        this.router.on('/db/dats/get', this._datsGet.bind(this))
        this.router.on('/db/dats/insert', this._datsInsert.bind(this))
        this.router.on('/db/dats/update', this._datsUpdate.bind(this))
        this.router.on('/db/dats/remove', this._datsRemove.bind(this))
        this._setupCoreDbs()
        debug(`started`)
        this.router.send('/core/log', {message: `[AO DB] Core database initialized`})
    }

    private _setupCoreDbs(): void {
        this.db = {
            logs: new Datastore({
                inMemoryOnly: true,
                // filename: path.resolve(this.storageLocation, 'logs.db.json'),
                // autoload: true,
                // onload: this._handleCoreDbLoadError.bind(this)
            }),
            settings: new Datastore({
                filename: path.resolve(this.storageLocation, 'settings.db.json'),
                autoload: true,
                onload: (error: Error) => {
                    if ( error ){
                        this._handleCoreDbLoadError(error)
                    } else {
                        // Load default settings (insert will not overwrite existing settings)
                        Object.keys(AODB.DEFAULT_SETTINGS).forEach(settingName => {
                            const settingValue = AODB.DEFAULT_SETTINGS[settingName]
                            this.db.settings.insert({setting: settingName, value: settingValue})
                        })   
                    }
                }
            })
        }
        // Logs expire after 48 hrs
        this.db.logs.ensureIndex({
            fieldName: 'createdAt',
            // @ts-ignore Types not quite up to par
            expireAfterSeconds: 3600 * 48,
        })
        // Settings indexed by name (unique)
        this.db.settings.ensureIndex({
            fieldName: 'setting',
            unique: true,
        })        
    }

    private _setupUserDb(request: IAORouterRequest): void {
        const requestData: AODB_UserInit_Data = request.data
        if ( !request.ethAddress ) {
            request.reject(new Error('user db init requires eth address'))
            return;
        }
        if ( this.userDbs[request.ethAddress] instanceof Datastore ) {
            request.respond({loaded: true})
            return;
        }
        this.userDbs[request.ethAddress] = new Datastore({
            filename: path.resolve(this.storageLocation, 'users', request.ethAddress, 'content.db.json'),
            autoload: false,
        })
        this.userDbs[request.ethAddress].loadDatabase((error: Error) => {
            this.router.send('/core/log', {message: `[AO DB] User database initialized for ${request.ethAddress}`})
            if ( error ) {
                request.reject(error)
                this.userDbs[request.ethAddress] = undefined
            } else {
                request.respond({loaded: true})
            }
        })
    }

    private _getUser(request: IAORouterRequest): void {
        request.respond({ethAddress: request.ethAddress})
    }

    private _handleCoreDbLoadError(error: Error): void {
        if ( error ) {
            debug('Error loading core db', error)
            // TODO: handle gracefully?
        } else {
            // TODO: we might need to drop some data (ex: peers) from previous session
        }
    }

    private _userContentGet(request: IAORouterRequest) {
        const requestData: AODB_UserContentGet_Data = request.data
        let query = requestData.query || {}
        const userDb = this.userDbs[request.ethAddress]
        if ( !userDb ) {
            request.reject(new Error(`User db not found for ${request.ethAddress}`))
            return;
        }
        userDb.find(query).exec((error: Error, docs) => {
            if ( error ) {
                request.reject(error)
            } else {
                request.respond(docs)
            }
        })        
    }

    private _userContentInsert(request: IAORouterRequest) {
        const requestData: any = request.data  // TODO: type check/validate content
        const userDb = this.userDbs[request.ethAddress]
        if ( !userDb ) {
            request.reject(new Error(`User db not found for ${request.ethAddress}`))
            return;
        }
        userDb.insert(requestData, (error: Error, doc) => {
            if ( error ) {
                request.reject(error)
            } else {
                request.respond(doc)
            }
        })        
    }

    private _logsGet(request: IAORouterRequest) {
        const requestData: AODB_LogsGet_Data = request.data
        let query = requestData.query || {}
        this.db.logs.find(query).sort({createdAt: 1}).exec((error, results) => {
            if ( error ) {
                request.reject(error)
            } else {
                request.respond(results)
            }
        })
    }

    private _logsInsert(request: IAORouterRequest) {
        const requestData: AODB_LogsInsert_Data = request.data
        const log = requestData
        if ( !log.message ) {
            request.reject(new Error('Invalid data format for log insert, "message" field required'))
            return;
        }
        if ( !log.createdAt || !(log.createdAt instanceof Date) ) {
            log.createdAt = new Date()
        }
        this.db.logs.insert(log, function(error: Error, doc) {
            if ( error ) {
                request.reject(error)
            } else {
                request.respond(doc)
            }
        })
    }

    private _settingsGet(request: IAORouterRequest) {
        const requestData: AODB_SettingsGet_Data = request.data
        let query = requestData.query || {}
        this.db.settings.find(query).exec((error, results) => {
            if ( error ) {
                request.reject(error)
            } else {
                let keyValueSettings = results.reduce((values, settingEntry: AODB_Setting) => ({
                    ...values,
                    [settingEntry.setting]: settingEntry.value
                }), {})
                request.respond(keyValueSettings)
            }
        })
    }

    private _settingsUpdate(request: IAORouterRequest) {
        const requestData: AODB_SettingsUpdate_Data = request.data
        const settings = requestData
        let options = {
            upsert: true
        }
        let updatePromises = []
        Object.keys(settings).forEach(settingName => {
            updatePromises.push(new Promise((resolve, reject) => {
                let query = {
                    setting: settingName,
                }
                let update = {
                    setting: settingName,
                    value: settings[settingName]
                }
                this.db.settings.update(query, update, options, (error: Error) => {
                    if ( error ) {
                        reject(error)
                    } else {
                        resolve()
                    }
                })
            }))
        })
        Promise.all(updatePromises).then(() => {
            // We return all settings
            this.db.settings.find({}).exec((error: Error, results) => {
                if ( error ) {
                    request.reject(error)
                } else {
                    let keyValueSettings = results.reduce((values, settingEntry: AODB_Setting) => ({
                        ...values,
                        [settingEntry.setting]: settingEntry.value
                    }), {})
                    request.respond(keyValueSettings)
                }
            })
        }).catch(request.reject)
    }

    
    private _datsInit(request: IAORouterRequest) {
        //const requestData: AODB_DatsInit_Data = request.data
        this.db.dats = new Datastore({
            filename: path.resolve(this.storageLocation, 'users', request.ethAddress, 'dats.db.json'),
            autoload: true,
            onload: (error: Error) => {
                if ( error ){
                    this._handleCoreDbLoadError(error)
                    request.reject(new Error('Error loading up Dats DB'))
                } else {
                    //let's return everything from init
                    this.db.dats.find({}).exec((err, results) => {
                        if ( err ) {
                            request.reject(err)
                        } else {
                            let returnValue = {}
                            for (let i = 0; i < results.length; i++) {
                                const result = results[i];
                                returnValue[result['key']] = result
                            }
                            request.respond(returnValue)
                        }
                    })
                }
            }
        })
    }
    private _datsGet(request: IAORouterRequest) {
        const requestData: AODB_DatsGet_Data = request.data
        if(!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'))
        } else {
            let query = requestData.query || {}
            this.db.dats.find(query).exec((err, results) => {
                if ( err ) {
                    request.reject(err)
                } else {
                    if( Array.isArray(results) ) {
                        let returnValue = {}
                        for (let i = 0; i < results.length; i++) {
                            const result = results[i];
                            returnValue[result['key']] = result
                        }
                        request.respond(returnValue)
                    } else {
                        request.respond(results)
                    }                    
                }
            })
        }
        
    }
    private _datsInsert(request: IAORouterRequest) {
        const requestData: AODB_DatsInsert_Data = request.data
        if(!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'))
        } else {
            if ( !requestData.createdAt || !(requestData.createdAt instanceof Date) ) {
                requestData.createdAt = new Date()
            }
            if ( !requestData.updatedAt || !(requestData.updatedAt instanceof Date) ) {
                requestData.updatedAt = requestData.createdAt
            }
            this.db.dats.insert(requestData, (err) => {
                if(err) {
                    debug('Error inserting new dat')
                    request.reject(err)
                }
                request.respond(requestData)
            })
        }
    }
    private _datsUpdate(request: IAORouterRequest) {
        const requestData: AODB_DatsUpdate_Data = request.data
        if(!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'))
        } else {
            let options = {
            }
            requestData.update.updatedAt = new Date()
            this.db.dats.update(requestData.query, requestData.update, options, (err,numReplaced) => {
                if(err) {
                    request.reject(err)
                }
                debug('Update replaced '+numReplaced+' dat record(s)')
                request.respond({})
            })
        }
    }
    private _datsRemove(request: IAORouterRequest) {
        const requestData: AODB_DatsRemove_Data = request.data
        if(!this.db.dats) {
            request.reject(new Error('Dats DB not initialized'))
        } else {
            this.db.dats.remove(requestData.query, {}, (err,numRemoved) => {
                if(err) {
                    request.reject(err)
                }
                debug('Removed '+numRemoved+' dat record(s)')
                request.respond({})
            })
        }
    }

}