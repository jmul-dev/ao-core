import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Datastore from 'nedb';
import path from 'path';
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
    id?: string;
    query?: Object;
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
        dats: Datastore,
    };
    private userDbs: {
        [key: string]: {
            content: Datastore,
        }
    } = {};

    constructor(args: AODB_Args) {
        super()
        this.storageLocation = args.storageLocation
        this.router.on('/db/logs/get', this._logsGet.bind(this))
        this.router.on('/db/logs/insert', this._logsInsert.bind(this))
        this.router.on('/db/settings/get', this._settingsGet.bind(this))
        this.router.on('/db/settings/update', this._settingsUpdate.bind(this))
        this.router.on('/db/user/init', this._setupUserDbs.bind(this))
        this.router.on('/db/user/get', this._getUser.bind(this))
        this.router.on('/db/user/content/get', this._userContentGet.bind(this))
        this.router.on('/db/user/content/insert', this._userContentInsert.bind(this))
        this.router.on('/db/user/content/update', this._userContentUpdate.bind(this))
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
            dats: new Datastore({
                filename: path.resolve(this.storageLocation, 'dats.db.json'),
                autoload: true,
                onload: (error: Error) => {
                    if ( error ){
                        this._handleCoreDbLoadError(error)
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
        // Dats db indexed by key
        this.db.dats.ensureIndex({
            fieldName: 'key',
            unique: true,
        })
    }

    private _setupUserDbs(request: IAORouterRequest): void {
        const requestData: AODB_UserInit_Data = request.data
        if ( !request.ethAddress ) {
            request.reject(new Error('user db init requires eth address'))
            return;
        }
        if ( this.userDbs[request.ethAddress] ) {
            request.respond({loaded: true})
            return;
        }
        const dbLoadHandler = (error: Error) => {
            if ( error ) {
                this._handleCoreDbLoadError(error)
            }
        }
        this.userDbs[request.ethAddress] = {
            content: new Datastore({
                filename: path.resolve(this.storageLocation, 'users', request.ethAddress, 'content.db.json'),
                autoload: true,
                onload: dbLoadHandler,
            })
        }
        this.router.send('/core/log', {message: `[AO DB] User database initialized for ${request.ethAddress}`})
        request.respond({loaded: true})
        // TODO: should probably use Promise.all to ensure each user db is loaded before responding!        
        // this.userDbs[request.ethAddress].loadDatabase((error: Error) => {
        //     this.router.send('/core/log', {message: `[AO DB] User database initialized for ${request.ethAddress}`})
        //     if ( error ) {
        //         request.reject(error)
        //         this.userDbs[request.ethAddress] = undefined
        //     } else {
        //         request.respond({loaded: true})
        //     }
        // })
    }

    private _getUser(request: IAORouterRequest): void {
        request.respond({ethAddress: request.ethAddress})
    }

    private _handleCoreDbLoadError(error: Error): void {
        debug('Error loading db: ', error)
        this.router.send('/core/log', {message: error.message})
    }

    /**
     * Get the content for a given user. If a user id is not passed,
     * then the current logged in user is assumed.
     */
    private _userContentGet(request: IAORouterRequest) {
        const requestData: AODB_UserContentGet_Data = request.data
        let query = requestData.query || {}       
        let userId = requestData.id ? requestData.id : request.ethAddress
        const userDbs = this.userDbs[userId]
        if ( !userDbs ) {
            request.reject(new Error(`User db not found for ${userId}`))
            return;
        }
        userDbs.content.find(query).exec((error: Error, docs) => {
            if ( error ) {
                request.reject(error)
            } else {
                request.respond(docs)
            }
        })        
    }

    private _userContentInsert(request: IAORouterRequest) {
        const requestData: any = request.data  // TODO: type check/validate content
        const userDbs = this.userDbs[request.ethAddress]
        if ( !userDbs ) {
            request.reject(new Error(`User db not found for ${request.ethAddress}`))
            return;
        }
        userDbs.content.insert(requestData, (error: Error, doc) => {
            if ( error ) {
                request.reject(error)
            } else {
                request.respond(doc)
            }
        })        
    }

    private _userContentUpdate(request: IAORouterRequest) {
        const requestData: any = request.data  // TODO: type check/validate content
        const userDbs = this.userDbs[request.ethAddress]
        if ( !userDbs ) {
            request.reject(new Error(`User db not found for ${request.ethAddress}`))
            return;
        }
        userDbs.content.update({id: requestData.id},  requestData, {returnUpdatedDocs: true, multi: false}, (error: Error, numAffected, updatedDoc, upsert) => {
            if ( error ) {
                request.reject(error)
            } else if ( numAffected !== 1 || !updatedDoc ) {
                request.reject(new Error(`User content not found or failed to update for query: id = ${requestData.id}`))
            } else {
                request.respond(updatedDoc)
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

}