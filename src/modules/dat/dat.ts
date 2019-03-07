import Dat from "dat-node";
import Debug from "../../AODebug";
import Datastore from "nedb";
import path from "path";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import { IAOFS_Unlink_Data, IAOFS_Mkdir_Data } from "../fs/fs";
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
                    // NOTE: resolving early for now in case resumeAll fails
                    // I think it is possible a single dat can become fucked.
                    request.respond({});
                    // 3. Resume dats
                    this._resumeAll()
                        .then(() => {
                            debug(`All dats resumed.`);
                        })
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
                docs.forEach((datEntry: DatEntry) => {
                    datKeyPromises.push(this._resume(datEntry));
                });
                Promise.all(datKeyPromises)
                    .then(() => {
                        this.router.send("/core/log", {
                            message: `[AO Dat] All local dats resumed`
                        });
                        resolve();
                    })
                    .catch(reject);
            });
        });
    }

    private _resume(datEntry: DatEntry): Promise<any> {
        return new Promise((resolve, reject) => {
            if (
                this.dats[datEntry.key] &&
                this.dats[datEntry.key].AO_joinedNetwork
            ) {
                debug(`Dat ${datEntry.key} already resumed`);
                resolve();
                return;
            }
            const datDir = path.join(this.datDir, datEntry.key);
            debug(
                `Resuming ${
                    datEntry.complete ? "complete" : "incomplete"
                } dat: ${datDir}`
            );
            Dat(datDir, (err: Error, dat: Dat) => {
                if (err || !dat) {
                    if (dat) {
                        debug("Dat error, closing");
                        dat.close();
                    }
                    debug("Error resuming dat " + datEntry.key);
                    resolve(err); //This has to remain a resolve, or else the entire Promise.all dies
                    if (err.name === "IncompatibleError") {
                        // TODO: Dat folder is kinda fucked, recommended route it to `rm -fr .dat`
                        // Going to ingore for now, but might want to address this at some point.
                    }
                    return null;
                }
                // NOTE: joinNetwork callback only fires when someone connects (or an error occurs)
                dat.joinNetwork(err => {
                    if (err) {
                        debug(
                            `Error joining network for dat://${datEntry.key}: ${
                                err.emssage
                            }`
                        );
                    } else if (
                        !datEntry.complete &&
                        dat.archive._latestVersion > 0
                    ) {
                        debug(
                            `Resumed dat is now fully download dat://${
                                datEntry.key
                            }`
                        );
                        const updatedDatEntry: DatEntry = {
                            key: datEntry.key,
                            complete: true,
                            updatedAt: new Date()
                        };
                        this._updateDatEntry(updatedDatEntry);
                    }
                });
                dat.AO_joinedNetwork = true;
                this.dats[datEntry.key] = dat;
                resolve();
                this._updateDatEntry(datEntry);
                // Finally, if the datEntry is not complete, listen for completion and update our
                // db.
                if (!datEntry.complete) {
                    debug(`Resuming incomplete dat://${datEntry.key}`);
                    dat.archive.on("sync", () => {
                        debug(
                            `Resumed dat is now fully download dat://${
                                datEntry.key
                            }`
                        );
                        const updatedDatEntry: DatEntry = {
                            key: datEntry.key,
                            complete: true,
                            updatedAt: new Date()
                        };
                        this._updateDatEntry(updatedDatEntry);
                    });
                }
            });
        });
    }

    private _handleImportSingle(request: IAORouterRequest) {
        const { key }: AODat_ImportSingle_Data = request.data;
        const datDir = path.join(this.datDir, key);
        Dat(datDir, (err: Error, dat: Dat) => {
            if (!dat || err) {
                if (err) {
                    request.reject(err);
                    return;
                } else {
                    request.reject(
                        new Error("No dat instance returned for import")
                    );
                    return;
                }
            } else {
                try {
                    dat.importFiles(err => {
                        if (err) {
                            request.reject(new Error("Error importing files"));
                            return;
                        } else {
                            debug("Files imported for " + key);
                            request.respond({ success: true });
                            return;
                        }
                    });
                } catch (e) {
                    debug(e);
                    request.reject(e);
                    return;
                }
            }
        });
    }

    private _updateDatEntry(datEntry: DatEntry) {
        this.datsDb.update(
            { key: datEntry.key },
            datEntry,
            { upsert: true },
            (err: Error) => {
                if (err) {
                    debug(err);
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
                    request.reject(new Error(`Dat instance not available`));
                    return;
                }
                if (!datInstance.AO_isTrackingStats) {
                    datInstance.trackStats();
                    datInstance.AO_isTrackingStats = true;
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

    private _handleResumeAll(request: IAORouterRequest) {
        this._resumeAll()
            .then(request.respond)
            .catch(request.reject);
    }

    private _handleResumeSingle(request: IAORouterRequest) {
        const requestData: AODat_ResumeSingle_Data = request.data;
        this._getDatEntry(requestData.key).then((datEntry: DatEntry) => {
            this._resume(datEntry)
                .then(request.respond)
                .catch(request.reject);
        });
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

    private _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data;
        const fullPath = path.join(this.datDir, requestData.newDatDir);
        try {
            Dat(fullPath, (err, dat) => {
                if (err) {
                    debug("failed to create new dat");
                    request.reject(err);
                    return;
                }

                //Note, this doesn't do a lot for our code base since the import has to be run post file creation.
                dat.importFiles(() => {
                    const datKey = dat.key.toString("hex");
                    debug("Created new dat file: dat://" + datKey);
                    //this.dats[datKey] = dat;
                    //Thanks windowz
                    dat.close(() => {
                        const newDatEntry: DatEntry = {
                            key: datKey,
                            complete: true, // assume its complete since already on disk
                            updatedAt: new Date(),
                            createdAt: new Date()
                        };
                        this._updateDatEntry(newDatEntry);
                        request.respond({
                            ...newDatEntry,
                            dir: requestData.newDatDir
                        });
                    });
                });
            });
        } catch (error) {
            debug(
                `Caught error while attempting to create dat: ${
                    error.message
                }, path: ${fullPath}`
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
            .then(() => {
                request.respond({});
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
            if (this.dats[key]) {
                // A. This dat already exists!
                debug(`[${key}] Dat already exists, skip download`);
                this._getDatEntry(key)
                    .then((datEntry: DatEntry) => {
                        resolve(datEntry);
                    })
                    .catch(reject);
            } else {
                // B1. We do not have this dat in the DB records, let's make sure we didn't try to download it in the past
                const newDatPath = path.join(this.datDir, key);
                const removeDatPathData: IAOFS_Unlink_Data = {
                    removePath: newDatPath
                };
                this.router
                    .send("/fs/unlink", removeDatPathData)
                    .then(() => {
                        // B2. All good, lets download this key
                        Dat(newDatPath, { key: key }, (err, dat) => {
                            if (err || !dat) {
                                if (err.name === "IncompatibleError") {
                                    // TODO: incompatible metadata issue, hoping to solve elsewhere
                                    debug("Dat Incompatible Error");
                                }
                                if (!dat) {
                                    debug("borked dat ", dat);
                                    this.removeDat(key);
                                } else {
                                    debug("Dat error, closing");
                                    this.removeDat(key);
                                }
                                debug(`[${key}] Failed to download dat`, err);
                                reject(err);
                                return;
                            }
                            //Dat is super stupid and will exit with its own recommended code when in fact its all okay: https://github.com/datproject/dat-node#downloading-files
                            let datDownloadComplete = false;
                            try {
                                const datKey = dat.key.toString("hex");
                                this.dats[datKey] = dat;
                                dat.joinNetwork(err => {
                                    if (err) {
                                        debug(
                                            `[${key}] Failed to join network`,
                                            err
                                        );
                                        this.removeDat(key);
                                        reject(err);
                                        return;
                                    } else if (
                                        !(
                                            dat.network.connected +
                                            dat.network.connecting
                                        ) &&
                                        !datDownloadComplete
                                    ) {
                                        debug(
                                            `[${key}] Failed to download, no one is hosting. connected[${
                                                dat.network.connected
                                            }] connecting[${
                                                dat.network.connecting
                                            }].`
                                        );
                                        this.removeDat(key);
                                        reject(
                                            new Error(
                                                "No users are hosting the requested content"
                                            )
                                        );
                                        return;
                                    } else {
                                        debug(
                                            `[${key}] Succesfully joined network and began downloading!`
                                        );
                                        dat.AO_joinedNetwork = true;
                                        // Assuming we do not have an existing dat db entry
                                        const newDatEntry: DatEntry = {
                                            key: datKey,
                                            complete: datDownloadComplete,
                                            updatedAt: new Date(),
                                            createdAt: new Date()
                                        };
                                        this._updateDatEntry(newDatEntry);
                                        if (!resolveOnDownloadCompletion) {
                                            resolve(newDatEntry);
                                        }
                                    }
                                });

                                // Begin listening for completion & start tracking stats
                                if (!dat.AO_isTrackingStats) {
                                    debug(`Tracking Stats fired for ${key}`);
                                    const stats = dat.trackStats();
                                    dat.AO_isTrackingStats = true;
                                    stats.on("update", () => {
                                        const newStats = stats.get();
                                        //TODO: Add percentage off of length vs downloaded as percentage of newStats
                                        // if(newStats.length.length == newStats.downloaded.length) {
                                        // }
                                    });
                                }

                                dat.archive.on("sync", () => {
                                    if (!datDownloadComplete) {
                                        // NOTE: this may actually run before the joinNetwork callback is hit!
                                        debug(
                                            `[${key}] Fully downloaded the goods!`
                                        );
                                        datDownloadComplete = true;
                                        const currentDate = new Date();
                                        let updatedDatEntry: DatEntry = {
                                            key: key,
                                            complete: datDownloadComplete,
                                            updatedAt: currentDate
                                        };
                                        //Yaay!  Dat node sux
                                        this._getDatEntry(key)
                                            .then((datEntry: DatEntry) => {
                                                this._updateDatEntry(
                                                    updatedDatEntry
                                                );
                                            })
                                            .catch((error: Error) => {
                                                updatedDatEntry.createdAt = currentDate;
                                                this._updateDatEntry(
                                                    updatedDatEntry
                                                );
                                            });
                                        if (resolveOnDownloadCompletion) {
                                            debug(
                                                "Resolving with resolveOnDownloadCompletion"
                                            );
                                            //Gotta wait for that dat node to actually write to disk!
                                            setTimeout(() => {
                                                resolve(updatedDatEntry);
                                            }, 1000);
                                        }
                                    }
                                });
                            } catch (error) {
                                debug(
                                    `Dat error while attempting to download...`,
                                    error
                                );
                                this.removeDat(key);
                                reject(error);
                            }
                        });
                    })
                    .catch(e => {
                        //FS delete of newDatPath
                        debug(e);
                        reject(e);
                    });
            }
        });
    }

    private removeDat(key: string) {
        if (this.dats[key]) {
            try {
                this.dats[key].close(() => {
                    this._removeDat(key);
                });
            } catch (e) {
                debug(e);
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
                debug("Dat removed");
            })
            .catch(debug);
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
