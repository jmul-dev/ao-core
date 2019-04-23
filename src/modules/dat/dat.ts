import Dat from "dat-node";
import Debug from "../../AODebug";
import Datastore from "nedb";
import path from "path";
import fsExtra from "fs-extra";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import { NetworkContentHostEntry } from "../p2p/p2p";
const debug = Debug("ao:dat");

export interface AODat_Init_Data {
    ethNetworkId: string;
}

export interface AODat_ResumeAll_Data {}

export interface AODat_ResumeSingle_Data {
    key: string;
}

export interface AODat_ImportSingle_Data {
    key: string;
}

export interface AODat_StopAll_Data {}

export interface AODat_Create_Data {
    newDatDir: string;
}

export interface AODat_Download_Data {
    key: string;
    resolveOnNetworkJoined?: boolean;
    resolveOnDownloadCompletion?: boolean;
}

export interface AODat_Check_Data {
    key: string;
}

export interface AODat_GetDatStats_Data {
    key: string;
}

export interface AODat_Encrypted_Download_Data {
    nodes: Array<NetworkContentHostEntry>;
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
    complete: boolean;
}

export default class AODat extends AORouterInterface {
    private storageLocation: string;
    private datSecretsDir: string;
    private datDir: string;
    private lastUsedPort = 3200;
    private swarmPortRange = [3200, 3400];
    private dats: {
        [key: string]: Dat;
    };
    private activelyDownloadingDats: {
        [key: string]: boolean;
    };
    private datsDb: Datastore;

    constructor(args: AORouterSubprocessArgs) {
        super({ ...args, debug });
        this.storageLocation = args.storageLocation;
        this.datSecretsDir = path.join(args.storageLocation, ".dat");
        this.datDir = path.resolve(this.storageLocation, "content");
        this.router.on("/dat/init", this._handleInit.bind(this));
        this.router.on(
            "/dat/resumeSingle",
            this._handleResumeSingle.bind(this)
        );
        this.router.on(
            "/dat/importSingle",
            this._handleImportSingle.bind(this)
        );
        this.router.on("/dat/stopAll", this._handleDatStopAll.bind(this));
        this.router.on("/dat/create", this._handleDatCreate.bind(this));
        this.router.on("/dat/remove", this._handleDatRemove.bind(this));
        this.router.on("/dat/download", this._handleDatDownload.bind(this));
        this.router.on(
            "/dat/encryptedFileDownload",
            this._handleEncryptedFileDownload.bind(this)
        );
        this.router.on("/dat/exists", this._handleDatExists.bind(this));
        this.router.on("/dat/stats", this._handleGetDatStats.bind(this));
        this.dats = {};
        this.activelyDownloadingDats = {};
        debug(`started`);
    }

    private get swarmPort(): number {
        let port = this.lastUsedPort + 1;
        if (port > this.swarmPortRange[1]) port = this.swarmPortRange[0];
        this.lastUsedPort = port;
        return port;
    }

    private _handleInit(request: IAORouterRequest) {
        const { ethNetworkId }: AODat_Init_Data = request.data;
        // 1. Setup & load db (note the db is namespaced based on the current network we are on)
        debug(`Initializing dat module...`);
        this.datsDb = new Datastore({
            filename: path.resolve(
                this.storageLocation,
                `dats-${ethNetworkId}.db.json`
            ),
            autoload: false
        });
        this.datsDb.ensureIndex({
            fieldName: "key",
            unique: true
        });
        this.datsDb.loadDatabase((error?: Error) => {
            if (error) {
                debug(`Failed to load dat module database`);
                request.reject(error);
                return;
            }
            // 2. Ensure the content directory exists
            fsExtra.ensureDirSync(this.datDir);
            fsExtra.ensureDirSync(this.datSecretsDir);
            debug(`Dat directories exists, proceed to resume dats...`);
            // NOTE: resolving early for now in case resumeAll fails
            // I think it is possible a single dat can become fucked.
            request.respond({});
            // 3. Resume dats
            this._resumeAll()
                .then(() => {})
                .catch((error: Error) => {
                    debug(`Error resuming all dats: ${error.message}`);
                });
        });
    }

    private _resumeAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.datsDb.find({}).exec((error: Error, docs) => {
                if (error) {
                    debug("Error loading dats from datsDb", error);
                    reject(error);
                    return;
                }
                let datKeyPromises = [];
                debug(`Attempting to resume ${docs.length} dats...`);
                docs.forEach((datEntry: DatEntry) => {
                    const resumePromise = this._resume(datEntry, false).then(
                        (error?) => {
                            if (error) {
                                debug(
                                    `[${
                                        datEntry.key
                                    }] resume returned an error: ${
                                        error.message
                                    }`
                                );
                            }
                            return Promise.resolve();
                        }
                    );
                    datKeyPromises.push(resumePromise);
                });
                Promise.all(datKeyPromises)
                    .then(() => {
                        this.router.send("/core/log", {
                            message: `[AO Dat] All local dats resumed`
                        });
                        debug(`Resume all Dats succesfull`);
                        resolve();
                    })
                    .catch(reject);
            });
        });
    }

    /**
     * Not a good practice, but this method always resolves. If an error occurs,
     * it is return as the resolve handler argument.
     *
     * @param datEntry
     */
    private _resume(
        datEntry: DatEntry,
        resolveOnJoinNetwork: boolean = false
    ): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let dat = this.dats[datEntry.key];
            if (dat && dat.AO_joinedNetwork) {
                debug(`[${datEntry.key}] already resumed`);
                resolve();
                return;
            } else if (dat) {
                debug(
                    `[${datEntry.key}]${
                        datEntry.complete ? "complete" : "incomplete"
                    } attempting to resume existing dat instance...`
                );
                dat.joinNetwork(err => {
                    if (err) {
                        debug(`[${datEntry.key}] error joining network`, err);
                        resolveOnJoinNetwork && resolve(err);
                        return;
                    }
                    const offline =
                        !dat.network.connected || !dat.network.connecting;
                    debug(
                        `[${datEntry.key}] joined network with ${
                            offline ? "no users online" : "users online"
                        }`
                    );
                    resolveOnJoinNetwork && resolve();
                    if (!datEntry.complete && !offline)
                        this._listenForDatSyncCompletion(dat).catch(error => {
                            debug(
                                `[${
                                    datEntry.key
                                }] error listening for sync complete:`,
                                error
                            );
                        });
                });
                dat.AO_joinedNetwork = true;
                !resolveOnJoinNetwork && resolve();
                return;
            } else if (datEntry.complete === false) {
                // NOTE: there is a big assumtion that an incomplete dat must have been a download
                // since the dats generated locally start in a complete state.
                debug(
                    `[${
                        datEntry.key
                    }] attempting to resume incomplete dat, remove and retry download`
                );
                try {
                    debug(
                        `[${
                            datEntry.key
                        }] removing existing dat before download`
                    );
                    await this.removeDat(datEntry.key);
                    await this.downloadDat(datEntry.key, false);
                    return resolve();
                } catch (error) {
                    resolve(error);
                }
            } else {
                debug(
                    `[${
                        datEntry.key
                    }] attempting to resume complete dat with no instance...`
                );
                const datDir = path.join(this.datDir, datEntry.key);
                Dat(
                    datDir,
                    { secretDir: this.datSecretsDir, port: this.swarmPort },
                    (err: Error, dat: Dat) => {
                        if (err && dat)
                            dat.close() && delete this.dats[datEntry.key];
                        if (err) return resolve(err);
                        if (!dat)
                            return resolve(
                                new Error(
                                    `[${
                                        datEntry.key
                                    }] dat instance unobtainable`
                                )
                            );
                        debug(
                            `[${
                                datEntry.key
                            }] joining network and tracking stats...`
                        );
                        dat.joinNetwork(err => {
                            if (err) {
                                resolveOnJoinNetwork && resolve(err);
                                return;
                            }
                            const offline =
                                !dat.network.connected ||
                                !dat.network.connecting;
                            debug(
                                `[${datEntry.key}] joined network with ${
                                    offline ? "no users online" : "users online"
                                }`
                            );
                            resolveOnJoinNetwork && resolve();
                            if (!datEntry.complete && !offline)
                                this._listenForDatSyncCompletion(dat).catch(
                                    error => {
                                        debug(
                                            `[${
                                                datEntry.key
                                            }] error listening for sync complete:`,
                                            error
                                        );
                                    }
                                );
                        });
                        dat.trackStats();
                        dat.AO_isTrackingStats = true;
                        dat.AO_joinedNetwork = true;
                        if (dat.writable) {
                            this._importFiles(dat);
                        }
                        this.dats[datEntry.key] = dat;
                        !resolveOnJoinNetwork && resolve();
                    }
                );
            }
        });
    }

    /**
     * Waiting for dat sync to know whether we can expect files in the dat folder.
     * We are assuming things have not been fully downloaded yet.
     *
     * @param dat {Dat}
     */
    private _listenForDatSyncCompletion(dat: Dat): Promise<any> {
        return new Promise((resolve, reject) => {
            const key = dat.key.toString("hex");
            let state = {
                modified: false,
                nsync: false
            };
            const listenOnArchiveContent = () => {
                dat.archive.content.on("clear", () => {
                    debug(`[${key}] archive clear`);
                    state.modified = true;
                });
                dat.archive.content.on("download", (index, data) => {
                    state.modified = true;
                });
            };
            if (dat.archive.content) {
                listenOnArchiveContent();
            } else {
                dat.archive.once("content", listenOnArchiveContent);
            }
            dat.archive.once("error", error => {
                debug(
                    `[${key}] archive error while listening for sync completion!`,
                    error
                );
                reject(error);
            });
            dat.archive.on("syncing", () => {
                debug(`[${key}] archive syncing`);
                state.nsync = false;
            });
            dat.archive.on("update", () => {
                debug(`[${key}] archive update`);
            });
            dat.archive.on("sync", () => {
                debug(`[${key}] archive sync`, dat.AO_latestStats);
                state.nsync = true;
                // if we are supposed to exit, do so if we've pulled changes or have given the network the desired wait time
                if (state.modified) {
                    this._tagDatAsComplete(key);
                    return resolve();
                }
                if (dat.archive.version === 0) {
                    // TODO: deal with this.
                    // Sync sometimes fires early when it should wait for update.
                    debug(
                        `[${dat.key}] archive sync, but version still === 0?`
                    );
                }
            });
        });
    }

    private _tagDatAsComplete(key: string) {
        const updatedDatEntry: DatEntry = {
            key,
            complete: true,
            updatedAt: new Date()
        };
        this._updateDatEntry(updatedDatEntry);
    }

    /**
     * Import any files within an existing dat folder, useful for adding or
     * updating content.
     *
     * @param request
     */
    private _handleImportSingle(request: IAORouterRequest) {
        const { key }: AODat_ImportSingle_Data = request.data;
        let existingInstance = this.dats[key];
        if (existingInstance) {
            this._importFiles(existingInstance)
                .then(request.respond)
                .catch(request.reject);
            return;
        }
        const datDir = path.join(this.datDir, key);
        Dat(
            datDir,
            {
                createIfMissing: false,
                secretDir: this.datSecretsDir,
                port: this.swarmPort
            },
            (err: Error, dat: Dat) => {
                try {
                    if (err) throw err;
                    if (!dat)
                        throw new Error(
                            `[${key}] No dat instance returned during import attempt.`
                        );
                    if (!existingInstance)
                        this.dats[dat.key.toString("hex")] = dat;
                    this._importFiles(dat)
                        .then(request.respond)
                        .catch(request.reject);
                } catch (error) {
                    debug(`[${key}] Error during dat import:`, error);
                    request.reject(error);
                }
            }
        );
    }
    private _importFiles(dat: Dat): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!dat.writable) return resolve({ success: false });
            const progress = dat.importFiles(err => {
                if (err) return reject(err);
                resolve({ success: true });
            });
            progress.on("put", (src, dest) => {
                debug(`[${dat.key.toString("hex")}] added file: ${dest.name}`);
            });
        });
    }

    private _updateDatEntry(datEntry: DatEntry) {
        this.datsDb.update(
            { key: datEntry.key },
            datEntry,
            { upsert: true },
            (err: Error) => {
                if (err) {
                    debug(`Error updating dat entry in dat db:`, err);
                }
            }
        );
    }

    private _getDatEntry(datKey: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.datsDb.findOne(
                { key: datKey },
                (error: Error, doc: DatEntry) => {
                    if (error) {
                        reject(error);
                    } else if (!doc) {
                        reject(
                            new Error(`No dat entry found for key: ${datKey}`)
                        );
                    } else {
                        resolve(doc);
                    }
                }
            );
        });
    }

    private _handleGetDatStats(request: IAORouterRequest) {
        const requestData: AODat_GetDatStats_Data = request.data;
        if (!this.dats[requestData.key]) {
            debug(`[${requestData.key}] No dat instance found`);
            request.reject(new Error(`Dat instance not found`));
            return;
        }
        this._getDatEntry(requestData.key)
            .then((datEntry: DatEntry) => {
                const datInstance = this.dats[requestData.key];
                if (!datInstance) {
                    debug(
                        `[${
                            requestData.key
                        }] attempting to get datStats, no dat instance found`
                    );
                    return request.reject(
                        new Error(`Dat instance not available`)
                    );
                }
                if (!datInstance.AO_joinedNetwork) {
                    return request.reject(
                        new Error(`Dat instance has not joined the network yet`)
                    );
                }
                if (
                    datInstance.AO_joinedNetwork &&
                    !datInstance.AO_isTrackingStats
                ) {
                    debug(
                        `[${
                            requestData.key
                        }] dat has joined network but is not tracking stats, begin tracking now`
                    );
                    datInstance.AO_isTrackingStats = true;
                    datInstance.trackStats();
                    datInstance.stats.on("update", () => {
                        datInstance.AO_latestStats = datInstance.stats.get();
                    });
                }
                let datStats = datInstance.AO_latestStats || {};
                let returnValue = {
                    ...datStats,
                    network: {
                        ...datInstance.stats.network
                    },
                    peers: {
                        ...datInstance.stats.peers
                    },
                    complete: datEntry.complete,
                    joinedNetwork: datInstance.AO_joinedNetwork,
                    trackingStats: datInstance.AO_isTrackingStats
                };
                request.respond(returnValue);
            })
            .catch(request.reject);
    }

    private _handleResumeSingle(request: IAORouterRequest) {
        const requestData: AODat_ResumeSingle_Data = request.data;
        this._getDatEntry(requestData.key)
            .then((datEntry: DatEntry) => {
                this._resume(datEntry, true)
                    .then((err?: Error) => {
                        if (err) {
                            request.reject(err);
                        } else {
                            request.respond(datEntry);
                        }
                    })
                    .catch(request.reject);
            })
            .catch(request.reject);
    }

    private _handleDatStopAll(request: IAORouterRequest) {
        for (const key in this.dats) {
            if (this.dats.hasOwnProperty(key)) {
                const datInstance = this.dats[key];
                if (datInstance) {
                    datInstance.close();
                }
            }
        }
        request.respond({});
    }

    /**
     * Initializes a new dat at the provided location. All files
     * within that location will be imported
     * @param request
     */
    private async _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data;
        const datLocation = path.join(this.datDir, requestData.newDatDir);
        try {
            Dat(
                datLocation,
                { secretDir: this.datSecretsDir, port: this.swarmPort },
                (err, dat) => {
                    if (err) return request.reject(err);
                    this._importFiles(dat)
                        .then(() => {
                            debug(
                                `[${dat.key.toString(
                                    "hex"
                                )}] initialized and imported files! live=${
                                    dat.live ? "true" : "false"
                                }`
                            );
                            dat.close(() => {
                                const datKey = dat.key.toString("hex");
                                debug(`[${datKey}] dat closed`);
                                const newDatEntry: DatEntry = {
                                    key: datKey,
                                    complete: true,
                                    updatedAt: new Date(),
                                    createdAt: new Date()
                                };
                                this._updateDatEntry(newDatEntry);
                                request.respond({
                                    ...newDatEntry,
                                    dir: requestData.newDatDir
                                });
                            });
                        })
                        .catch(request.reject);
                }
            );
        } catch (error) {
            debug(
                `Caught error while attempting to create dat: ${
                    error.message
                }, path: ${datLocation}`
            );
            request.reject(error);
            return;
        }
    }

    private async _handleDatRemove(request: IAORouterRequest) {
        const key = request.data.key;
        try {
            await this.removeDat(key);
        } catch (error) {}
        request.respond({ removed: true });
    }

    /**
     * Individual and known dat downloads
     * @param request
     */
    private _handleDatDownload(request: IAORouterRequest) {
        const {
            key,
            resolveOnNetworkJoined,
            resolveOnDownloadCompletion
        }: AODat_Download_Data = request.data;
        this.downloadDat(key, resolveOnDownloadCompletion)
            .then((datEntry: DatEntry) => {
                request.respond(datEntry);
            })
            .catch(request.reject);
    }

    /**
     * Dat Downloads for encrypted files.  Goes doesn the list of given nodes
     * @param request
     */
    private async _handleEncryptedFileDownload(request: IAORouterRequest) {
        const requestData: AODat_Encrypted_Download_Data = request.data;
        const nodes: Array<NetworkContentHostEntry> = requestData.nodes;
        for (let i = 0; i < nodes.length; i++) {
            const nodeEntry: NetworkContentHostEntry = nodes[i];
            try {
                const datEntry: DatEntry = await this.downloadDat(
                    nodeEntry.contentDatKey,
                    false
                );
                request.respond({
                    datEntry,
                    contentHostId: nodeEntry.contentHostId,
                    nodeEntry
                });
                return;
            } catch (error) {
                // Unable to download dat, continue to next dat key
            }
        }
        debug(`Host for the given nodes not found`);
        request.reject(new Error(`Unable to find a host`));
    }

    /**
     * Attempts to download a Dat file from the network.
     * https://github.com/datproject/dat-node/blob/master/examples/download.js
     *
     * @param {string} key Dat key to download
     * @param {boolean} resolveOnDownloadCompletion If true, waits to resolve when the
     *                  download is complete, otherwise resolves once we joined the network.
     * @returns {Promise<DatEntry>}
     */
    private downloadDat(key, resolveOnDownloadCompletion): Promise<DatEntry> {
        return new Promise((_resolve, _reject) => {
            if (this.activelyDownloadingDats[key] === true) {
                debug(`[${key}] dat instance is already downloading`);
                return _reject(
                    new Error(`Attempting to download an already active dat `)
                );
            }
            const resolve = (datEntry: DatEntry) => {
                delete this.activelyDownloadingDats[key];
                _resolve(datEntry);
            };
            const reject = async error => {
                try {
                    await this.removeDat(key);
                } catch (error) {}
                delete this.activelyDownloadingDats[key];
                _reject(error);
            };
            debug(`[${key}] Attempting to download dat`);
            this.activelyDownloadingDats[key] = true;
            // Quick check to see if the dat is already complete.
            // check for database instance in case the dat is not
            // yet resumed...
            this.datsDb.findOne(
                { key },
                async (error: Error, datEntry: DatEntry) => {
                    if (datEntry && datEntry.complete) {
                        // We already have the dat
                        debug(`[${key}] dat already exists, skip download`);
                        resolve(datEntry);
                    } else {
                        // Delete the folder in case a previous attempt at downloading this dat failed
                        const newDatPath = path.join(this.datDir, key);
                        try {
                            await this.removeDat(key);
                        } catch (error) {}
                        // 1. We do not have this dat in the DB records, proceed with download
                        Dat(
                            newDatPath,
                            {
                                key,
                                secretDir: this.datSecretsDir,
                                port: this.swarmPort
                            },
                            async (err, dat) => {
                                if (err || !dat) {
                                    if (err.name === "IncompatibleError") {
                                        // TODO: incompatible metadata issue, hoping to solve elsewhere
                                        debug("Dat Incompatible Error");
                                    }
                                    if (!dat) {
                                        debug(
                                            `[${key}] dat instance unobtainable...`,
                                            dat
                                        );
                                    } else {
                                        debug(`[${key}] dat error, closing...`);
                                    }
                                    debug(
                                        `[${key}] failed to download dat`,
                                        err
                                    );
                                    return reject(err);
                                }
                                // 2. Dat instance ready to go. Order of operations is kind of wierd here,
                                // but the archive sync event may emit *before* the joinNetwork callback.
                                this.dats[key] = dat;
                                const network = dat.joinNetwork(err => {
                                    if (err) {
                                        debug(
                                            `[${key}] Failed to join network with error`,
                                            err
                                        );
                                        return reject(err);
                                    }
                                    let connectedWithPeers = false;
                                    if (
                                        dat.network.connected &&
                                        dat.network.connecting
                                    ) {
                                        // check for peers
                                        if (
                                            dat.stats &&
                                            dat.stats.peers.total > 0
                                        )
                                            connectedWithPeers = true;
                                    }
                                    if (!connectedWithPeers) {
                                        debug(
                                            `[${key}] failed to join network, no peers or connection issue`
                                        );
                                        return reject(
                                            new Error(
                                                `Unable to connect with peers`
                                            )
                                        );
                                    }
                                    // NOTE: in my experience, during an active download
                                    // this callback is not hit until the download is complete!
                                    // It is mostly useful for initial connection errors/peer count
                                    debug(`[${key}] joinNetwork callback`);
                                });
                                network.on("error", error => {
                                    debug(`[${key}] network error:`, error);
                                    if (error.code === "EADDRINUSE") {
                                        // hit this error when attempting to download multiple dats
                                        // it seems that network will retry with diff port
                                    }
                                });
                                let firstConnection = false;
                                network.on("connection", () => {
                                    if (!firstConnection) {
                                        firstConnection = true;
                                        dat.AO_joinedNetwork = true;
                                        const newDatEntry: DatEntry = {
                                            key,
                                            complete: false,
                                            updatedAt: new Date(),
                                            createdAt: new Date()
                                        };
                                        this._updateDatEntry(newDatEntry);
                                        !resolveOnDownloadCompletion &&
                                            resolve(newDatEntry);
                                    }
                                });
                                this._listenForDatSyncCompletion(dat).then(
                                    () => {
                                        const updatedDatEntry: DatEntry = {
                                            key,
                                            complete: true,
                                            updatedAt: new Date()
                                        };
                                        resolveOnDownloadCompletion &&
                                            resolve(updatedDatEntry);
                                    }
                                );
                                const stats = dat.trackStats();
                                debug(`[${key}] tracking stats`);
                                dat.AO_isTrackingStats = true;
                                let lastPercentage = null;
                                stats.on("update", () => {
                                    const newStats = stats.get();
                                    dat.AO_latestStats = newStats;
                                    let downloadPercentage = (
                                        (newStats.downloaded /
                                            newStats.length) *
                                        100
                                    ).toFixed(0);
                                    if (downloadPercentage === "NaN")
                                        downloadPercentage = `0`;
                                    // To avoid blowing up the logs, only print at intervals of 10
                                    if (
                                        parseInt(downloadPercentage) % 10 ===
                                            0 &&
                                        downloadPercentage != lastPercentage
                                    ) {
                                        debug(
                                            `[${key}] downloaded ${downloadPercentage}%`
                                        );
                                    }
                                    lastPercentage = downloadPercentage;
                                });
                            }
                        );
                    }
                }
            );
        });
    }

    private async removeDat(key: string) {
        return new Promise(async (resolve, reject) => {
            try {
                this.dats[key].pause();
                this.dats[key].close(async () => {
                    try {
                        // NOTE: wait until dat releases fd
                        await sleep(1000);
                        await this._removeDat(key);
                    } catch (error) {}
                    resolve();
                });
            } catch (e) {
                try {
                    await this._removeDat(key);
                } catch (error) {}
                resolve();
            }
        });
    }
    //Thanks dat-node, the worst package ever!
    private async _removeDat(key: string) {
        try {
            const datPath = path.join(this.datDir, key);
            // remove dat instance if exists
            delete this.dats[key];
            // remove db entry
            await this._asyncRemove(key);
            // cleanup disk
            await fsExtra.remove(datPath);
        } catch (error) {
            debug(`[${key}] failed to remove dat dir: ${error.message}`);
        }
        debug(`[${key}] dat removed`);
    }

    private _asyncRemove(key: string): Promise<any> {
        return new Promise(resolve => {
            this.datsDb.remove({ key: key }, {}, (err, numRemoved) => {
                resolve();
            });
        });
    }

    private _handleDatExists(request: IAORouterRequest) {
        const requestData: AODat_Check_Data = request.data;
        this._getDatEntry(requestData.key)
            .then((datEntry: DatEntry) => {
                if (datEntry.complete) {
                    request.respond(datEntry);
                } else {
                    request.reject(
                        new Error(
                            `Dat not initialized or complete: ${
                                requestData.key
                            }`
                        )
                    );
                }
            })
            .catch(request.reject);
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
