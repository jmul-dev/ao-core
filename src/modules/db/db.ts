import Debug from "../../AODebug";
import Fuse from "fuse.js";
import Datastore from "nedb";
import path from "path";
import AONetworkContent from "../../models/AONetworkContent";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
const debug = Debug("ao:db");
const errorLog = Debug("ao:db:error");

/**
 * Logs
 */
export interface AODB_LogsGet_Data {
    query: any; // https://github.com/louischatriot/nedb#finding-documents
}
export interface AODB_LogsInsert_Data {
    message: string;
    createdAt?: Date;
    userId?: string;
}
/**
 * Settings
 */
export interface AODB_SettingsGet_Data {
    query: any; // https://github.com/louischatriot/nedb#finding-documents
}
export interface AODB_SettingsUpdate_Data {
    maxDiskSpace?: number;
    maxBandwidthUp?: number;
    maxBandwidthDown?: number;
    maxPeerConnections?: number;
    runInBackground?: boolean;
    runOnStartup?: boolean;
    checkForUpdates?: boolean;
    exportPath?: string;
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
export interface AODB_UserGet_Data {
    query?: object;
}
export interface AODB_UserInsert_Data {
    object: any;
}
export interface AODB_UserUpdate_Data {
    id: string;
    update: any;
}

/**
 * User Content
 */
export interface AODB_UserContentGet_Data {
    userId?: string;
    query?: Object;
}
export interface AODB_UserContentUpdate_Data {
    id: string;
    update: any;
}
/**
 * Network Content
 */
export interface AODB_NetworkContentGet_Data {
    query?: Object;
    fuzzyQuery?: string;
    projection?: Object;
    contentOnly?: boolean;
}
export interface AODB_NetworkContentInsert_Data {
    key: string;
    value: Object;
}
export interface AODB_NetworkContentUpdate_Data {
    id: string;
    update: any;
}

export default class AODB extends AORouterInterface {
    public static DEFAULT_SETTINGS = {
        maxDiskSpace: -1,
        maxBandwidthUp: -1,
        maxBandwidthDown: -1,
        maxPeerConnections: -1,
        runInBackground: false,
        runOnStartup: false,
        checkForUpdates: false
    };
    private storageLocation: string;
    private networkId: string;
    private db: {
        logs: Datastore;
        settings: Datastore;
        networkContent: Datastore;
    };
    private userDbs: {
        [key: string]: {
            content: Datastore;
            user: Datastore;
        };
    } = {};

    constructor(args: AORouterSubprocessArgs) {
        super(args);
        this.storageLocation = args.storageLocation;
        this.networkId = String(args.ethNetworkId);
        this.router.on("/db/init", this._init.bind(this));
        this.router.on("/db/logs/get", this._logsGet.bind(this));
        this.router.on("/db/logs/insert", this._logsInsert.bind(this));
        this.router.on("/db/settings/get", this._settingsGet.bind(this));
        this.router.on("/db/settings/update", this._settingsUpdate.bind(this));

        this.router.on("/db/user/init", this._setupUserDbs.bind(this)); //both content and user dbs
        this.router.on(
            "/db/user/getIdentity",
            this._getUserIdentity.bind(this)
        );
        this.router.on("/db/user/get", this._userGet.bind(this));
        this.router.on("/db/user/insert", this._userInsert.bind(this));
        this.router.on("/db/user/update", this._userUpdate.bind(this));

        this.router.on("/db/user/content/get", this._userContentGet.bind(this));
        this.router.on(
            "/db/user/content/insert",
            this._userContentInsert.bind(this)
        );
        this.router.on(
            "/db/user/content/update",
            this._userContentUpdate.bind(this)
        );

        this.router.on(
            "/db/network/content/get",
            this._getNetworkContent.bind(this)
        );
        this.router.on(
            "/db/network/content/insert",
            this._insertNetworkContent.bind(this)
        );
        this.router.on(
            "/db/network/content/update",
            this._networkContentUpdate.bind(this)
        );

        debug(`started`);
        this.router.send("/core/log", {
            message: `[AO DB] Core database initialized`
        });
    }

    /**
     * The initialization of db process involves loading the core dbs.
     * Note that this does not include user specific dbs created on a
     * per user basis.
     *
     * @param request
     */
    private _init(request: IAORouterRequest): void {
        const networkContentDBPath = path.resolve(
            this.storageLocation,
            `networkContent-${this.networkId}.db.json`
        );
        this.db = {
            logs: null,
            settings: null,
            networkContent: null
        };
        let dbLoadPromises = [];
        // Logs db
        dbLoadPromises.push(
            new Promise((resolve, reject) => {
                this.db.logs = new Datastore({
                    //inMemoryOnly: true,
                    filename: path.resolve(
                        this.storageLocation,
                        "logs.db.json"
                    ),
                    autoload: false
                });
                this.db.logs.ensureIndex({
                    fieldName: "createdAt",
                    // @ts-ignore Types not quite up to par
                    expireAfterSeconds: 3600 * 48 // Logs expire after 48 hrs
                });
                this.db.logs.loadDatabase((error?: Error) => {
                    if (error) {
                        errorLog(`[Core:db:logs]: Error loading database`);
                        reject(error);
                    } else {
                        debug(`[Core:db:logs]: database loaded`);
                        resolve();
                        // We do not want the logs db to grow too large, so we only keep a
                        // few days worth of logs.
                        let d = new Date();
                        d.setDate(d.getDate() - 2);
                        let removeQuery = {
                            "createdAt.$$date": { $lt: d.getTime() }
                        };
                        this.db.logs.remove(
                            removeQuery,
                            { multi: true },
                            (err, numRemoved) => {
                                if (err) {
                                    errorLog("[Core:db:logs]:", err);
                                } else {
                                    debug(
                                        `[Core:db:logs]: removed ${numRemoved} old records`
                                    );
                                }
                            }
                        );
                    }
                });
            })
        );
        // Settings DB
        dbLoadPromises.push(
            new Promise((resolve, reject) => {
                this.db.settings = new Datastore({
                    filename: path.resolve(
                        this.storageLocation,
                        "settings.db.json"
                    ),
                    autoload: false
                });
                // Settings indexed by name (unique)
                this.db.settings.ensureIndex({
                    fieldName: "setting",
                    unique: true
                });
                this.db.settings.loadDatabase((error?: Error) => {
                    if (error) {
                        errorLog(`[Core:db:settings]: Error loading database`);
                        reject(error);
                    } else {
                        debug(`[Core:db:settings]: database loaded`);
                        // Load default settings (insert will not overwrite existing settings)
                        Object.keys(AODB.DEFAULT_SETTINGS).forEach(
                            settingName => {
                                const settingValue =
                                    AODB.DEFAULT_SETTINGS[settingName];
                                this.db.settings.insert({
                                    setting: settingName,
                                    value: settingValue
                                });
                            }
                        );
                        resolve();
                    }
                });
            })
        );
        // Network Content DB
        dbLoadPromises.push(
            new Promise((resolve, reject) => {
                this.db.networkContent = new Datastore({
                    filename: networkContentDBPath,
                    autoload: false
                });
                this.db.networkContent.loadDatabase((error?: Error) => {
                    if (error) {
                        errorLog(
                            `[Core:db:networkContent]: Error loading database`
                        );
                        reject(error);
                    } else {
                        debug(`[Core:db:networkContent]: database loaded`);
                        // Reset the number of recently seen hosts from previous session
                        this.db.networkContent.update(
                            {},
                            { $set: { recentlySeenHostsCount: 0 } },
                            { multi: true },
                            error => {
                                this.db.networkContent.persistence.compactDatafile();
                            }
                        );
                        resolve();
                    }
                });
            })
        );
        Promise.all(dbLoadPromises)
            .then(() => {
                request.respond({});
            })
            .catch((error?: Error) => {
                request.reject(error);
            });
    }

    private _setupUserDbs(request: IAORouterRequest): void {
        const requestData: AODB_UserInit_Data = request.data;
        if (!request.ethAddress) {
            request.reject(new Error("user db init requires eth address"));
            return;
        }
        if (this.userDbs[request.ethAddress]) {
            request.respond({ loaded: true });
            return;
        }
        const dbLoadHandler = () => (error: Error) =>
            new Promise((resolve, reject) => {
                if (error) reject(error);
                else resolve();
            });
        this.userDbs[request.ethAddress] = {
            content: new Datastore({
                filename: path.resolve(
                    this.storageLocation,
                    "users",
                    request.ethAddress,
                    `content-${this.networkId}.db.json`
                ),
                autoload: false
            }),
            user: new Datastore({
                filename: path.resolve(
                    this.storageLocation,
                    "users",
                    request.ethAddress,
                    "user.db.json"
                ),
                autoload: false
            })
        };
        this.userDbs[request.ethAddress].content.ensureIndex({
            fieldName: "id",
            unique: true
        });
        let dbLoadPromises = [dbLoadHandler(), dbLoadHandler()];
        this.userDbs[request.ethAddress].content.loadDatabase(
            dbLoadPromises[0]
        );
        this.userDbs[request.ethAddress].user.loadDatabase(dbLoadPromises[0]);

        Promise.all(dbLoadPromises)
            .then(() => {
                this.router.send("/core/log", {
                    message: `[AO DB] User database initialized for ${
                        request.ethAddress
                    }`
                });
                request.respond({ loaded: true });
            })
            .catch(error => {
                this._handleCoreDbLoadError(error);
                request.reject(error);
            });
    }

    private _handleCoreDbLoadError(error: Error): void {
        debug("Error loading db: ", error);
        this.router.send("/core/log", { message: error.message });
    }

    private _getUserIdentity(request: IAORouterRequest): void {
        if (!request.ethAddress) {
            request.respond({ identity: null });
            return null;
        }
        const query = {
            id: "identity"
        };
        this.userDbs[request.ethAddress].user
            .find(query)
            .exec((error, results) => {
                if (error) {
                    request.reject(error);
                } else {
                    request.respond({ identity: results[0] });
                }
            });
    }

    private _userGet(request: IAORouterRequest) {
        const requestData: AODB_UserGet_Data = request.data;
        let query = requestData.query || {};
        this.userDbs[request.ethAddress].user
            .find(query)
            .exec((error, results) => {
                if (error) {
                    request.reject(error);
                } else {
                    request.respond(results);
                }
            });
    }

    private _userInsert(request: IAORouterRequest) {
        const { object }: AODB_UserInsert_Data = request.data;
        this.userDbs[request.ethAddress].user.insert(
            object,
            (err: Error, doc) => {
                if (err) {
                    request.reject(err);
                } else {
                    request.respond(doc);
                }
            }
        );
    }

    private _userUpdate(request: IAORouterRequest) {
        const { id, update }: AODB_UserUpdate_Data = request.data;
        const userDB = this.userDbs[request.ethAddress].user;
        userDB.update(
            { id: id },
            update,
            { returnUpdatedDocs: true, multi: false },
            (error, numAffected, updatedDoc, upsert) => {
                if (error) {
                    request.reject(error);
                } else {
                    request.respond(updatedDoc);
                }
            }
        );
    }

    /**
     * Get the content for a given user. If a user id is not passed,
     * then the current logged in user is assumed.
     */
    private _userContentGet(request: IAORouterRequest) {
        const requestData: AODB_UserContentGet_Data = request.data;
        let query = requestData.query || {};
        let userId = requestData.userId
            ? requestData.userId
            : request.ethAddress;
        const userDb = this.userDbs[userId];
        if (!userDb) {
            request.reject(new Error(`User db not found for ${userId}`));
            return;
        }
        userDb.content.find(query).exec((error: Error, docs) => {
            if (error) {
                request.reject(error);
            } else {
                request.respond(docs);
            }
        });
    }

    private _userContentInsert(request: IAORouterRequest) {
        const requestData: any = request.data; // TODO: type check/validate content
        const userDbs = this.userDbs[request.ethAddress];
        if (!userDbs) {
            request.reject(
                new Error(`User db not found for ${request.ethAddress}`)
            );
            return;
        }
        userDbs.content.insert(requestData, (error: Error, doc) => {
            if (error) {
                request.reject(error);
            } else {
                request.respond(doc);
            }
        });
    }

    private _userContentUpdate(request: IAORouterRequest) {
        const requestData: AODB_UserContentUpdate_Data = request.data; // TODO: type check/validate content
        const userDbs = this.userDbs[request.ethAddress];
        if (!userDbs) {
            request.reject(
                new Error(`User db not found for ${request.ethAddress}`)
            );
            return;
        }
        userDbs.content.update(
            { id: requestData.id },
            requestData.update,
            { returnUpdatedDocs: true, multi: false },
            (error: Error, numAffected, updatedDoc, upsert) => {
                if (error) {
                    request.reject(error);
                } else if (numAffected !== 1 || !updatedDoc) {
                    request.reject(
                        new Error(
                            `User content not found or failed to update for query: id = ${
                                requestData.id
                            }`
                        )
                    );
                } else {
                    request.respond(updatedDoc);
                }
            }
        );
    }

    private _logsGet(request: IAORouterRequest) {
        const requestData: AODB_LogsGet_Data = request.data;
        let query = requestData.query || {};
        this.db.logs
            .find(query)
            .sort({ createdAt: -1 })
            .exec((error, results) => {
                if (error) {
                    request.reject(error);
                } else {
                    request.respond(results);
                }
            });
    }

    private _logsInsert(request: IAORouterRequest) {
        const requestData: AODB_LogsInsert_Data = request.data;
        const log = requestData;
        if (!log.message) {
            request.reject(
                new Error(
                    'Invalid data format for log insert, "message" field required'
                )
            );
            return;
        }
        if (!log.createdAt || !(log.createdAt instanceof Date)) {
            log.createdAt = new Date();
        }
        this.db.logs.insert(log, function(error: Error, doc) {
            if (error) {
                request.reject(error);
            } else {
                request.respond(doc);
            }
        });
    }

    private _settingsGet(request: IAORouterRequest) {
        const requestData: AODB_SettingsGet_Data = request.data;
        let query = requestData.query || {};
        this.db.settings.find(query).exec((error, results) => {
            if (error) {
                request.reject(error);
            } else {
                let keyValueSettings = results.reduce(
                    (values, settingEntry: AODB_Setting) => ({
                        ...values,
                        [settingEntry.setting]: settingEntry.value
                    }),
                    {}
                );
                request.respond(keyValueSettings);
            }
        });
    }

    private _settingsUpdate(request: IAORouterRequest) {
        const requestData: AODB_SettingsUpdate_Data = request.data;
        const settings = requestData;
        let options = {
            upsert: true
        };
        let updatePromises = [];
        Object.keys(settings).forEach(settingName => {
            updatePromises.push(
                new Promise((resolve, reject) => {
                    let query = {
                        setting: settingName
                    };
                    let update = {
                        setting: settingName,
                        value: settings[settingName]
                    };
                    this.db.settings.update(
                        query,
                        update,
                        options,
                        (error: Error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve();
                            }
                        }
                    );
                })
            );
        });
        Promise.all(updatePromises)
            .then(() => {
                // We return all settings
                this.db.settings.find({}).exec((error: Error, results) => {
                    if (error) {
                        request.reject(error);
                    } else {
                        let keyValueSettings = results.reduce(
                            (values, settingEntry: AODB_Setting) => ({
                                ...values,
                                [settingEntry.setting]: settingEntry.value
                            }),
                            {}
                        );
                        request.respond(keyValueSettings);
                    }
                });
            })
            .catch(request.reject);
    }

    private _getNetworkContent(request: IAORouterRequest) {
        const requestData: AODB_NetworkContentGet_Data = request.data;
        let query = requestData.query || {};
        let cursor = this.db.networkContent.find(query);
        if (requestData.projection) {
            cursor = cursor.projection(requestData.projection);
        }
        cursor.exec((error, results) => {
            if (error) {
                request.reject(error);
            } else {
                if (requestData.contentOnly) {
                    results = results.map((result: AONetworkContent) => {
                        return result.content;
                    });
                }
                if (requestData.fuzzyQuery) {
                    const fuseOptions = {
                        shouldSort: true,
                        threshold: 0.6,
                        location: 0,
                        distance: 100,
                        maxPatternLength: 32,
                        minMatchCharLength: 1,
                        keys: requestData.contentOnly
                            ? ["title", "description"]
                            : ["content.title", "content.description"]
                    };
                    const fuse = new Fuse(results, fuseOptions);
                    results = fuse.search(requestData.fuzzyQuery);
                }
                request.respond(results);
            }
        });
    }

    private _insertNetworkContent(request: IAORouterRequest) {
        const requestData: AODB_NetworkContentInsert_Data = request.data;
        this.db.networkContent.insert(requestData, (err, doc) => {
            if (err) {
                request.reject(err);
            } else {
                request.respond(doc);
            }
        });
    }

    private _networkContentUpdate(request: IAORouterRequest) {
        const requestData: AODB_NetworkContentUpdate_Data = request.data;
        this.db.networkContent.update(
            { _id: requestData.id },
            requestData.update,
            { returnUpdatedDocs: true, multi: false },
            (error: Error, numAffected, updatedDoc, upsert) => {
                if (error) {
                    request.reject(error);
                } else if (numAffected !== 1 || !updatedDoc) {
                    request.reject(
                        new Error(
                            `Network content not found or failed to update for query: id = ${
                                requestData.id
                            }`
                        )
                    );
                } else {
                    request.respond(updatedDoc);
                }
            }
        );
    }
}
