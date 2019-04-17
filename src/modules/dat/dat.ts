import Dat from "dat-node";
import Debug from "../../AODebug";
import Datastore from "nedb";
import path from "path";
import fsExtra from "fs-extra";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import { IAOFS_Unlink_Data, IAOFS_Mkdir_Data } from "../fs/fs";
import { NetworkContentHostEntry } from "../p2p/p2p";
import util from "util";
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
    private datDir: string;
    private dats: {
        [key: string]: Dat;
    };
    private datsDb: Datastore;

    constructor(args: AORouterSubprocessArgs) {
        super(args);
        this.storageLocation = args.storageLocation;
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
        this.router.on("/dat/download", this._handleDatDownload.bind(this));
        this.router.on(
            "/dat/encryptedFileDownload",
            this._handleEncryptedFileDownload.bind(this)
        );
        this.router.on("/dat/exists", this._handleDatExists.bind(this));
        this.router.on("/dat/stats", this._handleGetDatStats.bind(this));
        this.dats = {};
        debug(`started`);
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
            const fsMakeContentDirData: IAOFS_Mkdir_Data = {
                dirPath: path.join("content")
            };
            this.router
                .send("/fs/mkdir", fsMakeContentDirData)
                .then(() => {
                    debug(
                        `Content directory exists, proceed to resume dats...`
                    );
                    // NOTE: resolving early for now in case resumeAll fails
                    // I think it is possible a single dat can become fucked.
                    request.respond({});
                    // 3. Resume dats
                    this._resumeAll()
                        .then(() => {})
                        .catch((error: Error) => {
                            debug(`Error resuming all dats: ${error.message}`);
                        });
                })
                .catch((error: Error) => {
                    debug("Error making dat content directory", error);
                    request.reject(error);
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
                    datKeyPromises.push(this._resume(datEntry, false));
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
        return new Promise((resolve, reject) => {
            let dat = this.dats[datEntry.key];
            if (dat && (dat.AO_joinedNetwork || dat.resumed)) {
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
            } else {
                debug(
                    `[${datEntry.key}] attempting to resume ${
                        datEntry.complete ? "complete" : "incomplete"
                    } dat with no instance...`
                );
                const datDir = path.join(this.datDir, datEntry.key);
                Dat(datDir, (err: Error, dat: Dat) => {
                    if (err && dat)
                        dat.close() && delete this.dats[datEntry.key];
                    if (err) return resolve(err);
                    if (!dat)
                        return resolve(
                            new Error(
                                `[${datEntry.key}] dat instance unobtainable`
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
                            !dat.network.connected || !dat.network.connecting;
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
                    this._importFiles(dat);
                    dat.AO_joinedNetwork = true;
                    this.dats[datEntry.key] = dat;
                    !resolveOnJoinNetwork && resolve();
                });
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
            // NOTE: this is cheating for now, as multiple versions can exist
            if (dat.archive._latestVersion > 0 || dat.version > 0) {
                debug(
                    `[${dat.key.toString(
                        "hex"
                    )}] fully synced (archive version ${dat.archive
                        ._latestVersion || dat.version} > 0)!`
                );
                this._tagDatAsComplete(dat.key.toString("hex"));
                return resolve();
            }
            dat.archive.once("sync", () => {
                debug(`[${dat.key.toString("hex")}] fully synced!`);
                this._tagDatAsComplete(dat.key.toString("hex"));
                resolve();
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
        Dat(datDir, { createIfMissing: false }, (err: Error, dat: Dat) => {
            try {
                if (err) throw err;
                if (!dat)
                    throw new Error(
                        `[${key}] No dat instance returned during import attempt.`
                    );
                if (!existingInstance) this.dats[dat.key.toString("hex")] = dat;
                this._importFiles(dat)
                    .then(request.respond)
                    .catch(request.reject);
            } catch (error) {
                debug(`[${key}] Error during dat import:`, error);
                request.reject(error);
            }
        });
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
            debug(`No dat instance found for dat://${requestData.key}`);
            request.reject(new Error(`Dat instance not found`));
            return;
        }
        this._getDatEntry(requestData.key)
            .then((datEntry: DatEntry) => {
                const datInstance = this.dats[requestData.key];
                if (!datInstance) {
                    debug(
                        `Attempting to get datStats, no dat instance found: dat://${
                            requestData.key
                        }`
                    );
                    return request.reject(
                        new Error(`Dat instance not available`)
                    );
                }
                if (!datInstance.AO_isTrackingStats) {
                    return request.reject(
                        new Error(`Dat instance not tracking stats`)
                    );
                }
                const datStats = datInstance.stats.get();
                let returnValue = {
                    ...datStats,
                    network: {
                        ...datInstance.stats.network
                    },
                    peers: {
                        ...datInstance.stats.peers
                    },
                    complete: datEntry.complete,
                    joinedNetwork: datInstance.AO_joinedNetwork
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
            Dat(datLocation, (err, dat) => {
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
            });
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
        return new Promise((resolve, reject) => {
            debug(`[${key}] Attempting to download dat`);
            // Quick check to see if the dat is already complete.
            // check for database instance in case the dat is not
            // yet resumed...
            this.datsDb.findOne({ key }, (error: Error, datEntry: DatEntry) => {
                if (datEntry) {
                    // We already have the dat
                    debug(`[${key}] Dat already exists, skip download`);
                    resolve(datEntry);
                } else {
                    // Assume dat has not been downloaded
                    // 1. We do not have this dat in the DB records, let's make sure we didn't try to download it in the past
                    const newDatPath = path.join(this.datDir, key);
                    const removeDatPathData: IAOFS_Unlink_Data = {
                        removePath: newDatPath,
                        isAbsolute: true
                    };
                    this.router
                        .send("/fs/unlink", removeDatPathData)
                        .then(() => {
                            // 2. All good, lets download this key
                            Dat(newDatPath, { key }, (err, dat) => {
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
                                    this.removeDat(key);
                                    debug(
                                        `[${key}] failed to download dat`,
                                        err
                                    );
                                    return reject(err);
                                }
                                // 3. Dat instance ready to go. Order of operations is kind of wierd here,
                                // but the archive sync event may emit *before* the joinNetwork callback.
                                this.dats[key] = dat;
                                let datEntryInserted = false;
                                dat.joinNetwork(err => {
                                    if (err) {
                                        debug(
                                            `[${key}] Failed to join network with error`,
                                            err
                                        );
                                        return reject(err);
                                    }
                                    if (
                                        !dat.network.connected ||
                                        !dat.network.connecting
                                    ) {
                                        debug(
                                            `[${key}] Failed to join network, unable to connect`
                                        );
                                        return reject(
                                            new Error(
                                                `Unable to connect with peers`
                                            )
                                        );
                                    }
                                    debug(
                                        `[${key}] Succesfully joined network and began downloading!`
                                    );
                                    dat.AO_joinedNetwork = true;
                                    if (!datEntryInserted) {
                                        datEntryInserted = true;
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
                                        dat.AO_joinedNetwork = true;
                                        const updatedDatEntry: DatEntry = {
                                            key,
                                            complete: true,
                                            updatedAt: new Date()
                                        };
                                        resolveOnDownloadCompletion &&
                                            resolve(updatedDatEntry);
                                    }
                                );
                                if (!dat.AO_isTrackingStats) {
                                    debug(`[${key}] Tracking stats`);
                                    const stats = dat.trackStats();
                                    dat.AO_isTrackingStats = true;
                                    stats.on("update", () => {
                                        const newStats = stats.get();
                                        let downloadPercentage = (
                                            (newStats.downloaded /
                                                newStats.length) *
                                            100
                                        ).toFixed(0);
                                        if (downloadPercentage === "NaN")
                                            downloadPercentage = `0`;
                                        // To avoid blowing up the logs, only print at intervals of 10
                                        if (
                                            parseInt(downloadPercentage) %
                                                10 ===
                                            0
                                        ) {
                                            debug(
                                                `[${key}] downloaded ${downloadPercentage}%`
                                            );
                                        }
                                    });
                                }

                                // //Dat is super stupid and will exit with its own recommended code when in fact its all okay: https://github.com/datproject/dat-node#downloading-files
                                // let datDownloadComplete = false;
                                // try {
                                //     const datKey = dat.key.toString("hex");
                                //     this.dats[datKey] = dat;
                                //     dat.joinNetwork(err => {
                                //         if (err) {
                                //             debug(
                                //                 `[${key}] Failed to join network`,
                                //                 err
                                //             );
                                //             this.removeDat(key);
                                //             reject(err);
                                //             return;
                                //         } else if (
                                //             (!dat.network.connected ||
                                //                 !dat.network.connecting) &&
                                //             !datDownloadComplete
                                //         ) {
                                //             debug(
                                //                 `[${key}] Failed to download, no one is hosting.`
                                //             );
                                //             this.removeDat(key);
                                //             reject(
                                //                 new Error(
                                //                     "No users are hosting the requested content"
                                //                 )
                                //             );
                                //             return;
                                //         } else {
                                //             debug(
                                //                 `[${key}] Succesfully joined network and began downloading! connected[${
                                //                     dat.network.connected
                                //                 }] connecting[${
                                //                     dat.network.connecting
                                //                 }]`
                                //             );
                                //             dat.AO_joinedNetwork = true;
                                //             // Assuming we do not have an existing dat db entry
                                //             const newDatEntry: DatEntry = {
                                //                 key: datKey,
                                //                 complete: datDownloadComplete,
                                //                 updatedAt: new Date(),
                                //                 createdAt: new Date()
                                //             };
                                //             this._updateDatEntry(newDatEntry);
                                //             if (!resolveOnDownloadCompletion) {
                                //                 resolve(newDatEntry);
                                //             }
                                //         }
                                //     });

                                //     // Begin listening for completion & start tracking stats
                                //     if (!dat.AO_isTrackingStats) {
                                //         debug(
                                //             `Tracking Stats fired for ${key}`
                                //         );
                                //         const stats = dat.trackStats();
                                //         dat.AO_isTrackingStats = true;
                                //         stats.on("update", () => {
                                //             const newStats = stats.get();
                                //             let downloadPercentage = (
                                //                 (newStats.downloaded /
                                //                     newStats.length) *
                                //                 100
                                //             ).toFixed(0);
                                //             if (downloadPercentage === "NaN")
                                //                 downloadPercentage = `0`;
                                //             // To avoid blowing up the logs, only print at intervals of 10
                                //             if (
                                //                 parseInt(downloadPercentage) %
                                //                     10 ===
                                //                 0
                                //             ) {
                                //                 debug(
                                //                     `[${key}] downloaded ${downloadPercentage}%`
                                //                 );
                                //             }
                                //         });
                                //     }

                                //     dat.archive.on("sync", () => {
                                //         if (!datDownloadComplete) {
                                //             // NOTE: this may actually run before the joinNetwork callback is hit!
                                //             debug(
                                //                 `[${key}] Fully downloaded the goods!`
                                //             );
                                //             datDownloadComplete = true;
                                //             const currentDate = new Date();
                                //             let updatedDatEntry: DatEntry = {
                                //                 key: key,
                                //                 complete: datDownloadComplete,
                                //                 updatedAt: currentDate
                                //             };
                                //             //Yaay!  Dat node sux
                                //             this._getDatEntry(key)
                                //                 .then((datEntry: DatEntry) => {
                                //                     this._updateDatEntry(
                                //                         updatedDatEntry
                                //                     );
                                //                 })
                                //                 .catch((error: Error) => {
                                //                     updatedDatEntry.createdAt = currentDate;
                                //                     this._updateDatEntry(
                                //                         updatedDatEntry
                                //                     );
                                //                 });
                                //             if (resolveOnDownloadCompletion) {
                                //                 debug(
                                //                     "Resolving with resolveOnDownloadCompletion"
                                //                 );
                                //                 //Gotta wait for that dat node to actually write to disk!
                                //                 setTimeout(() => {
                                //                     resolve(updatedDatEntry);
                                //                 }, 1000);
                                //             }
                                //         }
                                //     });
                                // } catch (error) {
                                //     debug(
                                //         `Dat error while attempting to download...`,
                                //         error
                                //     );
                                //     this.removeDat(key);
                                //     reject(error);
                                // }
                            });
                        })
                        .catch(e => {
                            //FS delete of newDatPath
                            debug(e);
                            reject(e);
                        });
                }
            });
        });
    }

    private removeDat(key: string) {
        if (this.dats[key]) {
            try {
                this.dats[key].close(() => {
                    this._removeDat(key);
                });
            } catch (e) {
                debug(
                    `[${key}] caught error while attempting to call close() method on dat instance: ${
                        e.message
                    }`
                );
                this._removeDat(key);
            }
        }
    }
    //Thanks dat-node, the worst package ever!
    private _removeDat(key: string) {
        const datPath = path.join(this.datDir, key);
        // remove dat instance if exists
        delete this.dats[key];
        // remove db entry
        this.datsDb.remove({ key: key });
        // cleanup disk
        let unlinkParams: IAOFS_Unlink_Data = {
            removePath: datPath,
            isAbsolute: true
        };
        this.router
            .send("/fs/unlink", unlinkParams)
            .then(() => {
                debug(`[${key}] dat removed`);
            })
            .catch(error => {
                debug(`[${key}] failed to unlink: ${error.message}`);
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
