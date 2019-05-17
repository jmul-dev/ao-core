import path from "path";
import Debug from "../../AODebug";
import AOContent from "../../models/AOContent";
import { IAOStatus } from "../../models/AOStatus";
import { IAORouterMessage } from "../../router/AORouter";
import AORouterInterface, {
    AORouterSubprocessArgs,
    IAORouterRequest
} from "../../router/AORouterInterface";
import { AODB_NetworkContentGet_Data } from "../db/db";
import { IAOFS_Mkdir_Data } from "../fs/fs";
import AOContentHostsUpdater from "./AOContentHostsUpdater";
import AOContentIngestion from "./AOContentIngestion";
import { ITAODB_Entry, ITAODB_Args } from "./TAODBWrapper";
import TaoDB, {
    ITaoDB_ContentHost_IndexData,
    ITaoDB_ContentHost_IndexData_Entry
} from "./TaoDB";
import EthCrypto from "eth-crypto";
import AOUserSession from "../../AOUserSession";
const debug = Debug("ao:p2p");

export interface AOP2P_Init_Data {
    dbKey: string;
    dbPath?: Function | string;
    ethNetworkId: string;
}

export interface AOP2P_ContentRegistration_Data {
    content: AOContent;
}

export interface AOP2P_Watch_Key_Data {
    key: string;
}

export interface AOP2P_Watch_AND_Get_Key_Data {
    key: string;
}

export interface AOP2P_Watch_AND_Get_IndexData_Data {
    content: AOContent;
    buyersPublicKey: string;
}

export interface AOP2P_Add_Discovery_Data {
    content: AOContent;
}

export interface AOP2P_Write_Decryption_Key_Data {
    content: AOContent;
    buyersPublicKey: string;
    hostsPublicKey: string;
    encryptedDecryptionKey: string;
    encryptedKeySignature: string;
}

export interface AOP2P_Update_Node_Timestamp_Data {
    content: AOContent;
    hostPublicKey: string;
}

export interface AOP2P_GetContentHosts_Data {
    content: AOContent;
}

export interface AOP2P_PeerStats {
    p2pStatus: IAOStatus;
    peersConnected: number;
    recentlySeenContentHosts: number;
}

export interface NetworkContentHostEntry {
    contentDatKey: string;
    contentHostId: string;
    nodePublicKey: string;
    timestamp: string;
}

export interface AOP2P_TaoRequest_Data {
    method:
        | "insertTaoDescription"
        | "getTaoDescription"
        | "getTaoDescriptions"
        | "insertNameProfileImage"
        | "getNameProfileImage"
        | "getTaoThoughts"
        | "getTaoThought"
        | "getTaoThoughtsCount"
        | "insertTaoThought"
        | "getWriterKey"
        | "getWriterKeySignature";
    methodArgs: any;
}

export default class AOP2P extends AORouterInterface {
    public taodb: TaoDB;
    private discoveryRunning: boolean = false;
    private storageLocation: string;
    private contentIngestion: AOContentIngestion;
    private contentHostsUpdater: AOContentHostsUpdater;
    private ethNetworkId: string;

    constructor(args: AORouterSubprocessArgs) {
        super({ ...args, debug });
        this.storageLocation = args.storageLocation;

        this.contentHostsUpdater = new AOContentHostsUpdater(
            this.router,
            this._getContentHostsFormatted.bind(this)
        );

        this.router.on("/p2p/init", this._init.bind(this));
        this.router.on(
            "/p2p/beginDiscovery",
            this._handleStartDiscovery.bind(this)
        );
        this.router.on(
            "/p2p/registerContent",
            this._handleContentRegistration.bind(this)
        );
        this.router.on(
            "/p2p/registerContentHost",
            this._handleRegisterContentHost.bind(this)
        );
        this.router.on("/p2p/watchKey", this._handleWatchKey.bind(this));
        this.router.on(
            "/p2p/watchAndGetKey",
            this._handleWatchAndGetKey.bind(this)
        );
        this.router.on(
            "/p2p/watchAndGetIndexData",
            this._handleWatchAndGetIndexData.bind(this)
        );
        this.router.on(
            "/p2p/decryptionKeyHandoff",
            this._handleDecryptionKeyHandoff.bind(this)
        );
        this.router.on("/p2p/updateNode", this._handleNodeUpdate.bind(this));
        this.router.on(
            "/p2p/content/getContentHosts",
            this._handleGetContentHosts.bind(this)
        );
        this.router.on("/p2p/stats", this._handleStats.bind(this));
        this.router.on(
            "/p2p/setUserIdentity",
            this._setUserIdentity.bind(this)
        );
        this.router.on("/p2p/tao", this._handleTaoRequest.bind(this));
    }

    _init(request: IAORouterRequest) {
        const { dbKey, dbPath, ethNetworkId }: AOP2P_Init_Data = request.data;
        this.ethNetworkId = ethNetworkId;
        let resolvedDbPath: Function | string;
        Promise.resolve()
            .then(() => {
                // NOTE: really only for testing purposes (where dbPath is in-memory)
                if (typeof dbPath === "function") {
                    resolvedDbPath = dbPath;
                    return Promise.resolve();
                } else {
                    resolvedDbPath = path.join(
                        this.storageLocation,
                        "p2p",
                        dbKey
                    );
                    const ensureP2PPathData: IAOFS_Mkdir_Data = {
                        dirPath: resolvedDbPath.toString()
                    };
                    return this.router.send("/fs/mkdir", ensureP2PPathData);
                }
            })
            .then(() => {
                // Content ingestion
                this.contentIngestion = new AOContentIngestion(
                    this.router,
                    ethNetworkId
                );
                this.contentIngestion.on(
                    AOContentIngestion.Events.CONTENT_INGESTED,
                    metadataDatKey => {
                        this.contentHostsUpdater.addContentKeyToQueue(
                            metadataDatKey
                        );
                    }
                );
            })
            .then(() => {
                debug(`Attempting to spin up taodb...`);
                const aodbArgs: ITAODB_Args = {
                    dbKey,
                    dbPath: resolvedDbPath,
                    ethNetworkId
                };
                this.taodb = new TaoDB();
                return this.taodb.start(aodbArgs);
            })
            .then(() => {
                request.respond({ data: "great success!" });
            })
            .catch(request.reject);
    }

    /**
     * Runs the content discovery once, then again each time the
     * hyperdb instance changes under the content watch key.
     */
    _handleStartDiscovery(request: IAORouterRequest) {
        debug(`p2p starting, setup watcher and run initial discovery...`);
        this._watchDiscovery()
            .then(request.respond)
            .catch(request.reject);
        setTimeout(() => {
            this._runDiscovery()
                .then(() => {
                    this.discoveryRunning = false;
                    debug("initial discovery ran");
                })
                .catch(err => {
                    this.discoveryRunning = false;
                    debug(`error running initial discovery:`, err);
                });
        }, 3000);
    }

    _watchDiscovery(): Promise<any> {
        return new Promise((resolve, reject) => {
            const watcher = this.taodb.watcher(TaoDB.ContentKey);
            let startedWatching = false;
            watcher.on("watching", () => {
                debug(
                    `watching aodb for content changes on key: /${
                        TaoDB.ContentKey
                    }`
                );
                startedWatching = true;
                resolve();
            });
            watcher.on("change", () => {
                debug(
                    `aodb watcher detected change on key: ${TaoDB.ContentKey}`
                );
                this._runDiscovery()
                    .then(() => {
                        this.discoveryRunning = false;
                        debug(`discovery complete after change on aodb`);
                    })
                    .catch(err => {
                        this.discoveryRunning = false;
                        debug(
                            `error running discovery triggered by watcher:`,
                            err
                        );
                    });
            });
            watcher.on("error", err => {
                debug(
                    `error while watching on key: /${TaoDB.ContentKey}`,
                    err || "undefined"
                );
                if (!startedWatching) reject(err);
            });
            watcher.on("close", async () => {
                debug(`watcher closed on key: /${TaoDB.ContentKey}`);
                if (!startedWatching)
                    reject(
                        new Error(
                            `watcher closed before we began watching on key: /${
                                TaoDB.ContentKey
                            }`
                        )
                    );
                // restart the watcher?
                try {
                    debug(`attempting to restart discovery watcher...`);
                    await this._watchDiscovery();
                } catch (error) {
                    debug(
                        `error restarting discovery watcher: ${error.message}`
                    );
                }
            });
        });
    }

    _runDiscovery(): Promise<any> {
        debug(`running discovery...`);
        return Promise.resolve()
            .then(() => {
                if (this.discoveryRunning) {
                    return Promise.reject(
                        new Error(`discovery already running`)
                    );
                }
                this.discoveryRunning = true;
                return Promise.resolve();
            })
            .then(() => {
                // 1. List all content types
                return this.taodb.list(TaoDB.ContentKey, {
                    recursive: false
                });
            })
            .then((contentList: Array<ITAODB_Entry<any>>) => {
                let contentTypes = [];
                contentList.forEach((entry: ITAODB_Entry<any>) => {
                    const key = entry.splitKey[2]; // /AO/Content/{contentType}
                    if (contentTypes.indexOf(key) === -1) {
                        contentTypes.push(key);
                    }
                });
                debug(
                    `discovery returned content type list: ${contentTypes.join(
                        ", "
                    )}`
                );
                // 2. List all keys within each content type
                const contentListPromises = contentTypes.map(contentType => {
                    return this.taodb.list(
                        `${TaoDB.ContentKey}/${contentType}/`,
                        { recursive: false, reverse: false }
                    );
                });
                return Promise.all(contentListPromises);
            })
            .then((contentLists: Array<Array<ITAODB_Entry<any>>>) => {
                // Lets merge all the content keys into a single array
                let contentKeys: Array<string> = [];
                contentLists.forEach(contentList => {
                    contentList.forEach((entry: ITAODB_Entry<any>) => {
                        // sanity check to make sure entry is a Dat key
                        const key = entry.splitKey[3];
                        if (key.length === 64) {
                            contentKeys.push(key); // /AO/Content/{contentType}/{metadataDatKey}
                        }
                    });
                });
                debug(`discovery found ${contentKeys.length} content keys`);
                return Promise.resolve(contentKeys);
            })
            .then((networkContentKeys: Array<string>) => {
                debug(
                    `attempting to match keys found in discovery with already discovered keys...`
                );
                // 3. Pull all content keys found in the user's *local* network db (content already discovered)
                return new Promise((localResolve, localReject) => {
                    const networkContentQuery: AODB_NetworkContentGet_Data = {
                        projection: { _id: 1, status: 1 }
                    }; // Only return _ids = metadataDatKey
                    this.router
                        .send("/db/network/content/get", networkContentQuery)
                        .then((networkContentResponse: IAORouterMessage) => {
                            localResolve({
                                contentKeysAlreadyDiscovered: networkContentResponse.data
                                    .filter(
                                        entry => entry.status === "imported"
                                    )
                                    .map(entry => entry._id),
                                contentKeysFoundInDiscovery: networkContentKeys
                            });
                        })
                        .catch(localReject);
                });
            })
            .then(
                ({
                    contentKeysAlreadyDiscovered,
                    contentKeysFoundInDiscovery
                }) => {
                    debug(
                        `[${contentKeysAlreadyDiscovered.length}/${
                            contentKeysFoundInDiscovery.length
                        }] keys discovered`
                    );
                    // 4. Diff the contentKeys to figure out what we have not already discovered
                    // Sort network content keys into new/existing buckets
                    let newContentKeys: Array<string> = [];
                    let existingContentKeys: Array<string> = [];
                    for (
                        let i = 0;
                        i < contentKeysFoundInDiscovery.length;
                        i++
                    ) {
                        const key = contentKeysFoundInDiscovery[i];
                        if (contentKeysAlreadyDiscovered.indexOf(key) < 0) {
                            newContentKeys.push(key);
                        } else {
                            existingContentKeys.push(key);
                        }
                    }

                    debug(
                        `[${
                            newContentKeys.length
                        }] pieces of content being added to discovery queue, [${
                            existingContentKeys.length
                        }] added to hosts updater queue`
                    );
                    // Add new content keys to content ingestion
                    if (newContentKeys.length) {
                        for (let i = 0; i < newContentKeys.length; i++) {
                            const datKey = newContentKeys[i];
                            this.contentIngestion.addDiscoveredMetadataDatKeyToQueue(
                                datKey
                            );
                        }
                    }
                    // Add existing content keys to content hosts updater
                    if (existingContentKeys.length) {
                        for (let i = 0; i < existingContentKeys.length; i++) {
                            const datKey = existingContentKeys[i];
                            this.contentHostsUpdater.addContentKeyToQueue(
                                datKey
                            );
                        }
                    }
                    return Promise.resolve();
                }
            );
    }

    _setUserIdentity(request: IAORouterRequest) {
        const { userIdentity } = request.data;
        this.taodb.setUserIdentity(userIdentity);
        request.respond(null);
    }

    _handleContentRegistration(request: IAORouterRequest) {
        const { content }: AOP2P_ContentRegistration_Data = request.data;
        this.taodb
            .insertUserContentSignature({ content })
            .then(request.respond)
            .catch(request.reject);
    }

    _handleWatchKey(request: IAORouterRequest) {
        const requestData: AOP2P_Watch_Key_Data = request.data;
        //TODO: We might consider helping construct the specific key here.  Dunno what exactly we're looking for yet 100%
        this.taodb
            .watch(requestData.key)
            .then(() => {
                request.respond({ success: true });
            })
            .catch(e => {
                request.reject(e);
            });
    }

    _handleWatchAndGetKey(request: IAORouterRequest) {
        const requestData: AOP2P_Watch_AND_Get_Key_Data = request.data;
        this.taodb
            .watch(requestData.key)
            .then(() => {
                //Query
                this.taodb
                    .get(requestData.key)
                    .then(value => {
                        request.respond(value);
                    })
                    .catch(e => {
                        request.reject(e);
                    });
            })
            .catch(e => {
                request.reject(e);
            });
    }

    _handleWatchAndGetIndexData(request: IAORouterRequest) {
        const {
            buyersPublicKey,
            content
        }: AOP2P_Watch_AND_Get_IndexData_Data = request.data;

        const indexDataKey = TaoDB.getContentHostIndexDataKey({
            hostsPublicKey: content.nodePublicKey,
            contentDatKey: content.fileDatKey,
            contentMetadataDatKey: content.metadataDatKey,
            contentType: content.contentType
        });

        Promise.resolve()
            .then(() => {
                // 1. Initial query for indexData
                return this.taodb.get(indexDataKey);
            })
            .then((indexData: ITaoDB_ContentHost_IndexData) => {
                // 2a. Check if indexData entry for the buyer already exists
                if (indexData && indexData[buyersPublicKey]) {
                    debug(
                        `[${
                            content.title
                        }]->[${buyersPublicKey}] _handleWatchAndGetIndexData got index data on first try`
                    );
                    request.respond(indexData[buyersPublicKey]);
                    return;
                }
                // 2b. Not found, listen for changes...
                debug(
                    `[${
                        content.title
                    }]->[${buyersPublicKey}] _handleWatchAndGetIndexData did not find index data on first try, watching...`
                );
                const watcher = this.taodb.taodb.watch(indexDataKey);
                return Promise.resolve(watcher);
            })
            .then(watcher => {
                return new Promise((localResolve, localReject) => {
                    watcher.on("watching", () => {
                        debug(
                            `[${
                                content.title
                            }]->[${buyersPublicKey}] watching aodb on ${indexDataKey}...`
                        );
                    });
                    watcher.on("change", () => {
                        debug(
                            `[${
                                content.title
                            }]->[${buyersPublicKey}] aodb detected change on ${indexDataKey}!`
                        );
                        // Check if our value exists
                        this.taodb
                            .get(indexDataKey)
                            .then((indexData: ITaoDB_ContentHost_IndexData) => {
                                if (indexData && indexData[buyersPublicKey]) {
                                    debug(
                                        `[${
                                            content.title
                                        }]->[${buyersPublicKey}] aodb detected change on ${indexDataKey}!`
                                    );
                                    watcher.destroy();
                                    localResolve(indexData[buyersPublicKey]);
                                } else {
                                    debug(
                                        `[${
                                            content.title
                                        }]->[${buyersPublicKey}] aodb detected change on ${indexDataKey}, but no matching indexData entry for buyer. Still waiting...`
                                    );
                                }
                            });
                    });
                    watcher.on("error", localReject);
                });
            })
            .then(
                (buyersIndexDataEntry: ITaoDB_ContentHost_IndexData_Entry) => {
                    request.respond(buyersIndexDataEntry);
                }
            )
            .catch(request.reject);
    }

    /**
     * Method for adding a piece of content to the p2p network,
     * ie make content discoverable.
     */
    _handleRegisterContentHost(request: IAORouterRequest) {
        const { content }: AOP2P_Add_Discovery_Data = request.data;
        Promise.resolve()
            .then(() => {
                // Initial indexData entry, no handoffs yet
                return this.taodb.insertContentHostIndexData({
                    content,
                    indexData: {}
                });
            })
            .then(() => {
                return this.taodb.insertContentHostSignature({ content });
            })
            .then(() => {
                return this.taodb.insertContentHostTimestamp({ content });
            })
            .then(request.respond)
            .catch(request.reject);
    }

    /**
     * Get the following stats:
     * 1. Estimate of the number of content hosts currently online (based on
     *    recently updated host timestamps)
     * 2. Number of peers connected to the p2p network (hyperdb), but not
     *    neccesarily hosting content.
     * 3. Number of content hosts ever seen.
     *
     * @param {IAORouterRequest} request
     * @returns {AOP2P_PeerStats} response.data
     */
    _handleStats(request: IAORouterRequest) {
        const peersCurrentlyConnected = this.taodb.peersConnected();
        const networkContentQuery: AODB_NetworkContentGet_Data = {
            query: {
                recentlySeenHostsCount: {
                    $gt: 0
                }
            },
            projection: { recentlySeenHostsCount: 1 }
        };
        this.router
            .send("/db/network/content/get", networkContentQuery, {
                ignoreLogging: true
            })
            .then((networkContentResults: IAORouterMessage) => {
                // NOTE: hosts count for each content may technically be overlaping (one host
                // for multiple pieces of content). Ideally we would add up unique host ids
                // but this info was not currently available.
                let networkContent: Array<{ recentlySeenHostsCount: number }> =
                    networkContentResults.data;
                const totalRecentlySeenHostsCount = networkContent.reduce(
                    function(
                        accumulator: number,
                        networkContent: { recentlySeenHostsCount: number }
                    ) {
                        return (
                            accumulator + networkContent.recentlySeenHostsCount
                        );
                    },
                    0
                );
                const stats: AOP2P_PeerStats = {
                    p2pStatus: this.taodb.connectionStatus,
                    peersConnected: peersCurrentlyConnected,
                    recentlySeenContentHosts: totalRecentlySeenHostsCount
                };
                request.respond(stats);
            })
            .catch(error => {
                const stats: AOP2P_PeerStats = {
                    p2pStatus: this.taodb.connectionStatus,
                    peersConnected: peersCurrentlyConnected,
                    recentlySeenContentHosts: 0
                };
                request.respond(stats);
            });
    }

    /**
     * Get all potential hosts for a given piece of content.
     *
     * hyperdb: /AOSpace/{contentType}/{metadataDatKey}/nodes/*
     *
     * @returns {Array<NetworkContentHostEntry>} response.data
     */
    _handleGetContentHosts(request: IAORouterRequest) {
        const { content }: AOP2P_GetContentHosts_Data = request.data;
        this._getContentHostsFormatted(content)
            .then(request.respond)
            .catch(request.reject);
    }

    _getContentHostsFormatted(
        content: AOContent
    ): Promise<Array<NetworkContentHostEntry>> {
        return new Promise((resolve, reject) => {
            this.taodb
                .listContentHosts({ content })
                .then((results: Array<ITAODB_Entry<any>>) => {
                    /**
                     * Results needs quite a bit of formatting
                     */
                    let jsonResults = results
                        .map((entry: ITAODB_Entry<any>) => {
                            // 1. Convert entry value data to json
                            if (entry && entry.value) {
                                return {
                                    contentDatKey: entry.value.contentDatKey,
                                    contentHostId: entry.value.contentHostId,
                                    timestamp: entry.value.timestamp,
                                    nodePublicKey: entry.splitKey[5] // /AO/Content/{contentType}/{contentMetadataDatKey}/Hosts/{hostsNodeId/publicKey}
                                };
                            } else {
                                return null;
                            }
                        })
                        .filter((entry: NetworkContentHostEntry) => {
                            // 2. Filter any malformed entries or entries without the correct values
                            if (entry === null) return false;
                            if (
                                !entry.timestamp ||
                                !entry.contentHostId ||
                                !entry.contentDatKey
                            )
                                return false;
                            return true;
                        })
                        .sort(
                            (
                                a: NetworkContentHostEntry,
                                b: NetworkContentHostEntry
                            ) => {
                                // 3. Sort by timestamps
                                const timestampA = parseInt(a.timestamp);
                                const timestampB = parseInt(b.timestamp);
                                return timestampA > timestampB
                                    ? -1
                                    : timestampA < timestampB
                                    ? 1
                                    : 0;
                            }
                        );
                    resolve(jsonResults);
                })
                .catch(reject);
        });
    }

    _handleDecryptionKeyHandoff(request: IAORouterRequest) {
        let {
            content,
            buyersPublicKey,
            hostsPublicKey,
            encryptedDecryptionKey,
            encryptedKeySignature
        }: AOP2P_Write_Decryption_Key_Data = request.data;
        if (!content) {
            return request.reject(new Error("No content"));
        }
        Promise.resolve()
            .then(() => {
                return new Promise((localResolve, localReject) => {
                    // Fetch existing indexData...
                    const indexDataKey = TaoDB.getContentHostIndexDataKey({
                        hostsPublicKey,
                        contentType: content.contentType,
                        contentMetadataDatKey: content.metadataDatKey,
                        contentDatKey: content.fileDatKey
                    });
                    this.taodb
                        .get(indexDataKey)
                        .then(
                            (
                                existingIndexData: ITaoDB_ContentHost_IndexData
                            ) => {
                                const existingBuyerCount = Object.keys(
                                    existingIndexData
                                ).length;
                                debug(
                                    `[${
                                        content.id
                                    }] has been sold ${existingBuyerCount} times`
                                );
                                localResolve(existingIndexData);
                            }
                        )
                        .catch((error: Error) => {
                            if (
                                error.message &&
                                error.message.indexOf("No value found") > -1
                            ) {
                                debug(
                                    `Warning, expected indexData key not found in aodb: ${indexDataKey}. Proceeding with write anyway.`
                                );
                                debug(
                                    `[${
                                        content.id
                                    }] has not been sold, indexData not found`
                                );
                                localResolve({});
                            } else {
                                localReject(error);
                            }
                        });
                });
            })
            .then((existingIndexData: ITaoDB_ContentHost_IndexData) => {
                const existingIndexDataForBuyer =
                    existingIndexData[buyersPublicKey];
                if (existingIndexDataForBuyer) {
                    // Validate the signature, if incorrect overwrite the entry
                    const signer = EthCrypto.recoverPublicKey(
                        existingIndexDataForBuyer.signature,
                        EthCrypto.hash.keccak256(
                            existingIndexDataForBuyer.decryptionKey
                        )
                    );
                    if (signer === hostsPublicKey) {
                        debug(
                            `[${
                                content.id
                            }] decryption key handoff for buyer[${buyersPublicKey}] already processed, skipping write to indexData`
                        );
                        request.respond({ success: true, alreadyExists: true });
                        return null;
                    } else {
                        debug(
                            `[${
                                content.id
                            }] found invalid signature for decryption key, proceeding to overwrite indexData with fresh value`
                        );
                    }

                    debug(
                        `[${
                            content.id
                        }] existing entry, decryption key mismatch: prev[${
                            existingIndexDataForBuyer.decryptionKey
                        }] cur[${encryptedDecryptionKey}]`
                    );
                }
                let updatedIndexData: ITaoDB_ContentHost_IndexData = Object.assign(
                    {},
                    existingIndexData
                );
                updatedIndexData[buyersPublicKey] = {
                    signature: encryptedKeySignature,
                    decryptionKey: encryptedDecryptionKey
                };
                return this.taodb.insertContentHostIndexData({
                    content,
                    indexData: updatedIndexData
                });
            })
            .then(() => {
                request.respond({ success: true });
            })
            .catch(request.reject);
    }

    async _handleNodeUpdate(request: IAORouterRequest) {
        const {
            content,
            hostPublicKey
        }: AOP2P_Update_Node_Timestamp_Data = request.data;
        const timestampKey = TaoDB.getContentHostTimestampKey({
            hostsPublicKey: hostPublicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey
        });
        try {
            let timestampEntry = await this.taodb.get(timestampKey);
            if (timestampEntry) {
                // If timestamp entry is recent, avoid additional write
                let recentThreshold =
                    AOUserSession.CONTENT_DISCOVERY_UPDATE_INTERVAL / 2;
                if (timestampEntry.timestamp > Date.now() - recentThreshold) {
                    debug(
                        `[${
                            content.id
                        }] skipping host timestamp update, already updated recently`
                    );
                    return request.respond({});
                }
            }
            // proceed to update
            await this.taodb.insertContentHostTimestamp({ content });
            this.contentHostsUpdater.addContentKeyToQueue(content.id);
            request.respond({});
        } catch (error) {
            request.reject(error);
        }
    }

    /**
     * Just a pass through to access taodb methods. Should have exposed taodb in
     * main process...
     */
    _handleTaoRequest(request: IAORouterRequest) {
        const { method, methodArgs }: AOP2P_TaoRequest_Data = request.data;
        let taodbPromise: Promise<any> = Promise.resolve();
        debug(`Attempt at handling tao request method: ${method}`);
        switch (method) {
            case "getTaoDescription":
                let descriptionKey = TaoDB.getTaoDescriptionKey({
                    taoId: methodArgs["taoId"],
                    timestamp: methodArgs["timestamp"]
                });
                taodbPromise = this.taodb.get(descriptionKey);
                break;
            case "getTaoDescriptions":
                let descriptionsKey = TaoDB.getTaoDescriptionListKey({
                    taoId: methodArgs["taoId"]
                });
                taodbPromise = this.taodb.list(descriptionsKey);
                break;
            case "insertTaoDescription":
                taodbPromise = this.taodb.insertTaoDescription({
                    taoId: methodArgs["taoId"],
                    description: methodArgs["description"]
                });
                break;
            case "getNameProfileImage":
                let profileImageKey = TaoDB.getNameProfileImageKey({
                    nameId: methodArgs["nameId"]
                });
                taodbPromise = this.taodb.get(profileImageKey);
                break;
            case "insertNameProfileImage":
                taodbPromise = this.taodb.insertNameProfileImage({
                    nameId: methodArgs["nameId"],
                    imageString: methodArgs["imageString"]
                });
                break;
            case "getTaoThoughts":
                let taoThoughtsKey = TaoDB.getTaoThoughtsListKey({
                    taoId: methodArgs["taoId"]
                });
                taodbPromise = this.taodb.list(taoThoughtsKey);
                break;
            case "getTaoThought":
                let taoThoughtKey = TaoDB.getTaoThoughtNameKey({
                    taoId: methodArgs["taoId"],
                    thoughtId: methodArgs["thoughtId"],
                    nameId: methodArgs["nameId"]
                });
                taodbPromise = this.taodb.get(taoThoughtKey);
                break;
            case "getTaoThoughtsCount":
                let taoThoughtsCountKey = TaoDB.getTaoThoughtsListKey({
                    taoId: methodArgs["taoId"]
                });
                taodbPromise = this.taodb.count(taoThoughtsCountKey);
                break;
            case "insertTaoThought":
                taodbPromise = this.taodb.insertTaoThought({
                    nameId: methodArgs["nameId"],
                    taoId: methodArgs["taoId"],
                    parentThoughtId: methodArgs["parentThoughtId"],
                    thought: methodArgs["thought"]
                });
                break;
            case "getWriterKey":
                const writerKey = this.taodb.userPublicAddress;
                return request.respond(writerKey);
            case "getWriterKeySignature":
                const nameId = methodArgs["nameId"];
                const nonce = methodArgs["nonce"];
                taodbPromise = this.taodb.getWriterKeySignature({
                    nameId,
                    nonce
                });
                break;
            default:
                debug(
                    `Warning, /p2p/tao request with invalid method [${method}]`
                );
        }
        taodbPromise.then(request.respond).catch(request.reject);
    }
}
