import Dat from "dat-node";
import Debug from "../../AODebug";
import Datastore from "nedb";
import path from "path";
import fsExtra, { statSync } from "fs-extra";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import { NetworkContentHostEntry } from "../p2p/p2p";
import mirror from "mirror-folder";
import ram from "random-access-memory";
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
            // 3. Resume dats
            this._resumeAll()
                .then(request.respond)
                .catch(request.reject);
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
                let incompleteCount = 0;
                let completeCount = 0;
                docs.forEach((datEntry: DatEntry) => {
                    let resumePromise = null;
                    if (datEntry.complete) {
                        completeCount++;
                        resumePromise = this._resume(datEntry, false).then(
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
                    } else {
                        // Dat has a real hard time picking up where it left off, so instead of
                        // resuming incomplete dats, we remove them with the assumption that the
                        // downloaded will be triggered again from the content ingestion or downloads
                        resumePromise = this.removeDat(datEntry.key);
                        incompleteCount++;
                    }
                    datKeyPromises.push(resumePromise);
                });
                debug(
                    `resuming ${completeCount} dats, removing ${incompleteCount} incomplete dats...`
                );
                Promise.all(datKeyPromises)
                    .then(() => {
                        debug(`resume all dats succesfull`);
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
        return new Promise(async (resolve, _reject) => {
            if (!datEntry.complete) {
                return resolve(new Error(`cannot resume incomplete dat`));
            }
            let dat = this.dats[datEntry.key];
            if (dat && dat.AO_joinedNetwork) {
                debug(`[${datEntry.key}] already resumed`);
                resolve();
                return;
            } else if (dat) {
                debug(
                    `[${
                        datEntry.key
                    }] attempting to resume existing dat instance...`
                );
                const network = dat.joinNetwork(
                    { port: this.swarmPort },
                    err => {
                        if (err || !dat) {
                            debug(
                                `[${datEntry.key}] error joining network`,
                                err
                            );
                            resolveOnJoinNetwork && resolve(err);
                            return;
                        }
                        dat.AO_joinedNetwork = true;
                        resolveOnJoinNetwork && resolve();
                        // const offline = !dat.network.connected || !dat.network.connecting;
                        // debug(
                        //     `[${datEntry.key}] joined network with ${
                        //     offline ? "no users online" : "users online"
                        //     }`
                        // );
                    }
                );
                network.on("error", error => {
                    if (error.code === "EADDRINUSE") {
                        // hit this error when attempting to download multiple dats
                        // it seems that network will retry with diff port
                        debug(
                            `[${datEntry.key}] port in use, trying another...`
                        );
                    } else {
                        debug(`[${datEntry.key}] network error:`, error);
                    }
                });
                !resolveOnJoinNetwork && resolve();
            } else {
                debug(`[${datEntry.key}] attempting to resume complete dat...`);
                const datDir = path.join(this.datDir, datEntry.key);
                Dat(
                    datDir,
                    { secretDir: this.datSecretsDir },
                    async (err: Error, dat: Dat) => {
                        if (err && dat) {
                            try {
                                dat.close();
                            } catch (error) {}
                            this.dats[datEntry.key] = null;
                        }
                        if (err) return resolve(err);
                        if (!dat)
                            return resolve(
                                new Error(
                                    `[${
                                        datEntry.key
                                    }] dat instance unobtainable`
                                )
                            );
                        debug(`[${datEntry.key}] joining network...`);
                        this.dats[datEntry.key] = dat;
                        // Join network
                        const network = dat.joinNetwork(
                            { port: this.swarmPort },
                            err => {
                                if (err) {
                                    resolveOnJoinNetwork && resolve(err);
                                    return;
                                }
                                dat.AO_joinedNetwork = true;
                                resolveOnJoinNetwork && resolve();
                                // const offline = !dat.network.connected || !dat.network.connecting;
                                // if ( offline ) {
                                //     debug(
                                //         `[${datEntry.key}] joined network with ${
                                //         offline ? "no users online" : "users online"
                                //         }`
                                //     );
                                // }
                            }
                        );
                        network.on("error", error => {
                            if (error.code === "EADDRINUSE") {
                                // hit this error when attempting to download multiple dats
                                // it seems that network will retry with diff port
                                debug(
                                    `[${
                                        datEntry.key
                                    }] port in use, trying another...`
                                );
                            } else {
                                debug(
                                    `[${datEntry.key}] network error:`,
                                    error
                                );
                            }
                        });
                        // Import files if writable
                        if (dat.writable) {
                            try {
                                await this._importFiles(dat);
                            } catch (error) {
                                debug(
                                    `[${
                                        datEntry.key
                                    }] error importing files on resume: ${
                                        error.message
                                    }`
                                );
                            }
                        }
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
                if (state.modified) {
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
                secretDir: this.datSecretsDir
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
            if (!dat.writable) {
                debug(
                    `[${dat.key.toString(
                        "hex"
                    )}] attempt to import files on non-writable dat`
                );
                return resolve({ success: false });
            }
            const progress = dat.importFiles(err => {
                if (err) return reject(err);
                resolve({ success: true });
            });
            progress.on("put", (src, dest) => {
                debug(
                    `[${dat.key.toString("hex")}] imported file: ${dest.name}`
                );
            });
        });
    }

    private _updateDatEntry(datEntry: DatEntry): Promise<any> {
        return new Promise((resolve, reject) => {
            this.datsDb.update(
                { key: datEntry.key },
                datEntry,
                { upsert: true },
                (err: Error) => {
                    if (err) {
                        debug(`Error updating dat entry in dat db:`, err);
                    }
                    resolve();
                }
            );
        });
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
                try {
                    const datInstance = this.dats[requestData.key];
                    if (!datInstance) {
                        debug(
                            `[${
                                requestData.key
                            }] attempting to get datStats, no dat instance found`
                        );
                        return request.reject(
                            new Error(`Dat instance not found`)
                        );
                    }
                    if (!datInstance.AO_joinedNetwork) {
                        return request.reject(
                            new Error(
                                `Dat instance has not joined the network yet`
                            )
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
                } catch (error) {
                    debug(
                        `[${requestData.key}] error returning dat stats:`,
                        error
                    );
                    request.respond(null);
                }
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
            Dat(datLocation, { secretDir: this.datSecretsDir }, (err, dat) => {
                if (err) return request.reject(err);
                this._importFiles(dat)
                    .then(() => {
                        debug(
                            `[${dat.key.toString(
                                "hex"
                            )}] initialized and imported files!`
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
        return new Promise(async (resolve, reject) => {
            const removeAndReject = async error => {
                try {
                    await this.removeDat(key);
                } catch (error) {}
                reject(error);
            };
            // 1. Check if we are already downloading (or have downloaded) this dat
            try {
                const datEntry: DatEntry = await this._getDatEntry(key);
                debug(
                    `[${key}] dat already exists in ${
                        datEntry.complete ? "a completed" : "an incomplete"
                    } state`
                );
                if (datEntry.complete) return resolve(datEntry);
                else
                    return reject(
                        new Error(
                            `attempting to download dat that is already downloading`
                        )
                    );
            } catch (error) {
                /* Catching this error means we do not have this dat yet and can proceed */
            }

            // 2. Ensure the target directory is clean (may have failed to remove previously)
            try {
                debug(`[${key}] removing dat before download...`);
                await this.removeDat(key);
            } catch (error) {
                debug(`[${key}] error removing dat: ${error.message}`);
            }

            // 3. Insert this dat into dats.db, marked as incomplete
            let datEntry: DatEntry = {
                createdAt: new Date(),
                updatedAt: new Date(),
                key,
                complete: false
            };
            await this._updateDatEntry(datEntry);

            // 4. Finally initialize the dat
            const newDatPath = path.join(this.datDir, key);
            Dat(
                ram,
                {
                    key,
                    secretDir: this.datSecretsDir,
                    sparse: false
                },
                async (err, dat) => {
                    if (err || !dat) {
                        if (err.name === "IncompatibleError") {
                            // TODO: incompatible metadata issue, hoping to solve elsewhere
                            debug("Dat Incompatible Error");
                        }
                        if (!dat) {
                            debug(`[${key}] dat instance unobtainable...`, dat);
                        } else {
                            debug(`[${key}] dat error, closing...`);
                        }
                        debug(`[${key}] failed to download dat`, err);
                        await removeAndReject(err);
                        return null;
                    }

                    // 5. Dat lifecycle is pretty weird.
                    //      - joinNetwork callback is fired if there is no connection OR the download is complete
                    //      - archive 'sync' event may be triggered before the joinNetwork callback
                    this.dats[key] = dat;
                    let downloadPercent = 0;
                    const network = dat.joinNetwork(
                        { port: this.swarmPort },
                        async err => {
                            debug(`[${key}] joinNetwork callback`);
                            if (err) {
                                debug(
                                    `[${key}] Failed to join network with error`,
                                    err
                                );
                                await removeAndReject(err);
                                return null;
                            }
                            let connectedWithPeers = false;
                            if (
                                dat.network.connected &&
                                dat.network.connecting
                            ) {
                                // check for peers (dat.stats may not exist in this callback since we dont run trackStats until connection event)
                                if (dat.stats && dat.stats.peers.total > 0)
                                    connectedWithPeers = true;
                            }
                            if (
                                !connectedWithPeers &&
                                downloadPercent === 0 &&
                                !dat.AO_joinedNetwork
                            ) {
                                debug(
                                    `[${key}] failed to join network, no peers or connection issue`
                                );
                                await removeAndReject(
                                    new Error(`Unable to connect with peers`)
                                );
                                return null;
                            }
                        }
                    );

                    network.on("error", error => {
                        if (error.code === "EADDRINUSE") {
                            // hit this error when attempting to download multiple dats
                            // it seems that network will retry with diff port
                            debug(`[${key}] port in use, trying another...`);
                        } else {
                            debug(`[${key}] network error:`, error);
                        }
                    });
                    network.once("connection", async () => {
                        try {
                            debug(`[${key}] network connection made`);
                            dat.AO_joinedNetwork = true;
                            if (!resolveOnDownloadCompletion) resolve(datEntry);
                            logDownloadStats(dat);
                            dat.archive.metadata.update(download);
                        } catch (error) {
                            debug(
                                `[${key}] error starting download after connection was made`,
                                error
                            );
                        }
                        // 6. Now that we have made a connection, begin monitoring stats & sync
                        // try {
                        //     logDownloadStats(dat);
                        //     await this._listenForDatSyncCompletion(dat);
                        //     datEntry.complete = true;
                        //     datEntry.updatedAt = new Date();
                        //     await this._updateDatEntry(datEntry);
                        //     if (resolveOnDownloadCompletion) resolve(datEntry);
                        //     debug(`[${key}] download complete!`);
                        // } catch (error) {
                        //     removeAndReject(error);
                        // }
                    });

                    const download = () => {
                        debug(`[${key}] download initiated...`);
                        try {
                            var progress = mirror(
                                { fs: dat.archive, name: "/" },
                                newDatPath,
                                async err => {
                                    debug(
                                        `[${key}] dat archive mirror callback`
                                    );
                                    try {
                                        if (err) throw err;
                                        // Super hacky, but mirror does the ram/mirror
                                        // route does not store the .dat folder
                                        await new Promise((resolve, reject) => {
                                            Dat(
                                                newDatPath,
                                                { key },
                                                (err, dat) => {
                                                    debug(
                                                        `[${key}] Dat instance created, checking for .dat folder...`
                                                    );
                                                    fsExtra.pathExists(
                                                        path.join(
                                                            newDatPath,
                                                            ".dat"
                                                        ),
                                                        (err, exists) => {
                                                            if (err)
                                                                debug(
                                                                    `[${key}] error checking if .dat folder exists: ${
                                                                        err.message
                                                                    }`,
                                                                    err
                                                                );
                                                            // TODO: dat.archive.version === 0
                                                            if (exists) {
                                                                resolve();
                                                            } else {
                                                                reject(
                                                                    new Error(
                                                                        `.dat folder does not exist`
                                                                    )
                                                                );
                                                            }
                                                            if (dat) {
                                                                try {
                                                                    dat.close(
                                                                        () => {
                                                                            dat = null;
                                                                        }
                                                                    );
                                                                } catch (error) {
                                                                    debug(
                                                                        `[${key}] error closing dat`,
                                                                        error
                                                                    );
                                                                    dat = null;
                                                                }
                                                            } else {
                                                                dat = null;
                                                            }
                                                        }
                                                    );
                                                }
                                            );
                                        });
                                        datEntry.complete = true;
                                        datEntry.updatedAt = new Date();
                                        await this._updateDatEntry(datEntry);
                                        if (resolveOnDownloadCompletion)
                                            resolve(datEntry);
                                        debug(`[${key}] download complete!`);
                                    } catch (error) {
                                        removeAndReject(error);
                                    }
                                }
                            );
                            progress.on("put", function(src, dst) {
                                debug(`[${key}] adding ${src.name}`);
                            });
                        } catch (error) {
                            debug(`[${key}] error mirroring dat folder`, error);
                        }
                    };

                    function logDownloadStats(dat) {
                        const stats = dat.trackStats();
                        debug(`[${key}] tracking stats`);
                        dat.AO_isTrackingStats = true;
                        let lastPercentage = null;

                        stats.on("update", onStatsUpdate);

                        function onStatsUpdate() {
                            try {
                                const newStats = stats.get();
                                dat.AO_latestStats = newStats;
                                let downloadPercentage = (
                                    (newStats.downloaded / newStats.length) *
                                    100
                                ).toFixed(0);
                                if (downloadPercentage === "NaN")
                                    downloadPercentage = `0`;
                                // To avoid blowing up the logs, only print at intervals of 10
                                if (
                                    parseInt(downloadPercentage) % 10 === 0 &&
                                    downloadPercentage != lastPercentage
                                ) {
                                    debug(
                                        `[${key}] downloaded ${downloadPercentage}%`
                                    );
                                }
                                if (parseInt(downloadPercentage) >= 100) {
                                    stats.removeEventListener(
                                        "update",
                                        onStatsUpdate
                                    );
                                    dat.stats = null;
                                    dat.AO_isTrackingStats = false;
                                }
                                lastPercentage = downloadPercentage;
                                downloadPercent = parseInt(lastPercentage);
                            } catch (error) {
                                debug(`[${key}] error in stats update`, error);
                            }
                        }
                    }
                }
            );
        });
    }

    private async removeDat(key: string) {
        return new Promise(async (resolve, reject) => {
            try {
                debug(`[${key}] attempting to remove dat...`);
                const datInstance = this.dats[key];
                if (!datInstance)
                    throw new Error(
                        `Cannot close Dat, instance does not exist`
                    );
                datInstance.close(async () => {
                    try {
                        // NOTE: wait until dat releases fd
                        await sleep(500);
                        await this._removeDatFromDisk(key);
                    } catch (error) {}
                    resolve();
                });
            } catch (e) {
                try {
                    await this._removeDatFromDisk(key);
                } catch (error) {}
                resolve();
            }
        });
    }
    //Thanks dat-node, the worst package ever!
    private async _removeDatFromDisk(key: string): Promise<any> {
        try {
            debug(`[${key}] attempting to remove dat from disk...`);
            const datPath = path.join(this.datDir, key);
            // remove dat instance if exists
            this.dats[key] = null;
            // remove db entry
            await this._asyncRemoveDat(key);
            // cleanup disk
            if (fsExtra.existsSync(datPath)) {
                await fsExtra.remove(datPath);
            }
        } catch (error) {
            debug(`[${key}] failed to remove dat dir: ${error.message}`);
        }
        debug(`[${key}] dat removed`);
    }

    private _asyncRemoveDat(key: string): Promise<any> {
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
