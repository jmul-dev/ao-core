import Debug from "debug";
import path from "path";
import fsExtra from "fs-extra";
import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import { NetworkContentHostEntry } from "../p2p/p2p";
import DatManager, { DatArchive, DatStats } from "dat-manager";
const debug = Debug("ao:dat");

export interface AODat_Init_Data {
    ethNetworkId: string;
}

export interface AODat_ResumeAll_Data {}

export interface AODat_ImportSingle_Data {
    key: string;
    srcDir?: string;
}

export interface AODat_StopAll_Data {}

export interface AODat_Create_Data {
    initialImportDir: string;
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
export interface AODat_GetMultipleDatStats_Data {
    keys: Array<string>;
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

export type DatStats = DatStats;

export default class AODat extends AORouterInterface {
    private storageLocation: string;
    private datSecretsDir: string;
    private datDir: string;
    private datManager: DatManager;

    constructor(args: AORouterSubprocessArgs) {
        super({ ...args, debug });
        this.storageLocation = args.storageLocation;
        this.datSecretsDir = path.join(args.storageLocation, ".dat");
        this.router.on("/dat/init", this._handleInit.bind(this));
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
        this.router.on(
            "/dat/statsMultiple",
            this._handleGetMultipleDatStats.bind(this)
        );
        setInterval(() => {}, 1 << 30); // slight hack to prevent event loop from ending
        debug(`started`);
    }

    private async _handleInit(request: IAORouterRequest) {
        const { ethNetworkId }: AODat_Init_Data = request.data;
        // 1. Setup & load db (note the db is namespaced based on the current network we are on)
        debug(`Initializing dat module...`);
        this.datDir = path.join(
            this.storageLocation,
            `content-${ethNetworkId}`
        );
        try {
            await fsExtra.ensureDir(this.datDir);
            await fsExtra.ensureDir(this.datSecretsDir);
            debug(`Dat directories exists, proceed to resume dats...`);
            this.datManager = new DatManager({
                storagePath: this.datDir,
                datStorageOptions: {
                    secretDir: this.datSecretsDir
                }
            });
            await this.datManager.resumeAll();
            request.respond({});
        } catch (error) {
            request.reject(error);
        }
    }

    /**
     * Import any files within an existing dat folder, useful for adding or
     * updating content.
     *
     * @param request
     * @returns request.response({filesImported: number})
     */
    private async _handleImportSingle(request: IAORouterRequest) {
        const { key, srcDir }: AODat_ImportSingle_Data = request.data;
        if (!this.datManager.exists(key))
            return request.reject(
                new Error(`Attempting to import files to a non-existent dat`)
            );
        try {
            const archive: DatArchive = await this.datManager.get(key);
            const archivePath = archive.getPath();
            // By default, we simply import the files within the archive
            let srcPath = archivePath;
            if (srcDir) {
                srcPath = path.isAbsolute(srcDir)
                    ? srcDir
                    : path.join(this.storageLocation, srcDir);
            }
            await new Promise((resolve, reject) => {
                archive.importFiles(srcPath, function(err) {
                    if (err) reject();
                    else resolve();
                });
            });
            request.respond({});
        } catch (error) {
            request.reject(error);
        }
    }

    private async _handleGetDatStats(request: IAORouterRequest) {
        const requestData: AODat_GetDatStats_Data = request.data;
        if (this.datManager.exists(requestData.key))
            return request.reject(
                new Error(
                    `Dat instance does not exist or has not been initialized`
                )
            );
        try {
            const archive: DatArchive = await this.datManager.get(
                requestData.key
            );
            const stats = archive.getStats();
            request.respond(stats);
        } catch (error) {
            debug(
                `[${requestData.key}] error fetching archive stats: ${
                    error.message
                }`
            );
            request.reject(error);
        }
    }

    private async _handleGetMultipleDatStats(request: IAORouterRequest) {
        const requestData: AODat_GetMultipleDatStats_Data = request.data;
        const keys = requestData ? requestData.keys : [];
        let stats = {};

        for (let i = 0; i < keys.length; i++) {
            const datKey = keys[i];
            try {
                const archive: DatArchive = await this.datManager.get(datKey);
                stats[datKey] = archive.getStats();
            } catch (error) {
                debug(`[${datKey}] error in getStats: ${error.message}`);
                stats[datKey] = null;
            }
        }
        request.respond(stats);
    }

    private async _handleDatStopAll(request: IAORouterRequest) {
        try {
            this.datManager.close();
        } catch (error) {}
        request.respond({});
    }

    /**
     * Initializes a new dat at the provided location. All files
     * within that location will be imported
     * @param request
     */
    private async _handleDatCreate(request: IAORouterRequest) {
        const requestData: AODat_Create_Data = request.data;
        try {
            const archive = await this.datManager.create(
                path.join(this.storageLocation, requestData.initialImportDir)
            );
            request.respond({
                key: archive.key.toString("hex"),
                dir: archive.getPath()
            });
        } catch (error) {
            request.reject(error);
        }
    }

    private async _handleDatRemove(request: IAORouterRequest) {
        const key = request.data.key;
        try {
            await this.datManager.remove(key);
        } catch (error) {
            debug(`[${key}] Error removing dat`, error);
        }
        request.respond({ removed: true });
    }

    /**
     * Individual and known dat downloads
     * @param request
     */
    private async _handleDatDownload(request: IAORouterRequest) {
        const { key }: AODat_Download_Data = request.data;
        try {
            const archive = await this.datManager.download(key);
            request.respond({ key });
        } catch (error) {
            request.reject(error);
        }
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
                const archive = await this.datManager.download(
                    nodeEntry.contentDatKey,
                    {
                        resolveOnStart: true
                    }
                );
                request.respond({
                    key: archive.key.toString("hex"),
                    contentHostId: nodeEntry.contentHostId,
                    nodeEntry,
                    datEntry: {
                        complete: archive.getProgress() === 1,
                        key: archive.key.toString("hex")
                    }
                });
                return;
            } catch (error) {
                // Unable to download dat, continue to next dat key
            }
        }
        debug(`Host for the given nodes not found`);
        request.reject(new Error(`Unable to find a host`));
    }

    private _handleDatExists(request: IAORouterRequest) {
        const requestData: AODat_Check_Data = request.data;
        const exists = this.datManager.exists(requestData.key);
        if (exists) request.respond({ exists });
        else
            request.reject(
                new Error(`Dat not initialized or complete: ${requestData.key}`)
            );
    }
}
