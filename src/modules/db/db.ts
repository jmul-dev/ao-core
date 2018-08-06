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
    }
    private userDbs: {
        [key: string]: Datastore
    } = {}

    constructor(args: AODB_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/db/logs/get', this._logsGet.bind(this))
        this.router.on('/db/logs/insert', this._logsInsert.bind(this))
        this.router.on('/db/settings/get', this._settingsGet.bind(this))
        this.router.on('/db/settings/update', this._settingsUpdate.bind(this))
        this.router.on('/db/user/init', this._setupUserDb.bind(this))
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
            }),
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
        if ( !requestData || !requestData.ethAddress ) {
            request.reject(new Error('user db init requires eth address'))
            return;
        }
        if ( this.userDbs[requestData.ethAddress] instanceof Datastore ) {
            request.respond({loaded: true})
            return;
        }
        this.userDbs[requestData.ethAddress] = new Datastore({
            filename: path.resolve(this.storageLocation, requestData.ethAddress, 'content.db.json'),
            autoload: false,
        })
        this.userDbs[requestData.ethAddress].loadDatabase((error: Error) => {
            this.router.send('/core/log', {message: `[AO DB] User database initialized for ${requestData.ethAddress}`})
            if ( error ) {
                request.reject(error)
                this.userDbs[requestData.ethAddress] = undefined
            } else {
                request.respond({loaded: true})
            }
        })
    }

    private _handleCoreDbLoadError(error: Error): void {
        if ( error ) {
            debug('Error loading core db', error)
            // TODO: handle gracefully?
        } else {
            // TODO: we might need to drop some data (ex: peers) from previous session
        }
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

}