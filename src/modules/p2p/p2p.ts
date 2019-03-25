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
import { AODB_Entry, IAODB_Args } from "./AODB";
import TaoDB, {
    ITaoDB_ContentHost_IndexData,
    ITaoDB_ContentHost_IndexData_Entry
} from "./TaoDB";
const debug = Debug("ao:p2p");

export interface AOP2P_Init_Data {
    dbKey: string;
}

export interface AOP2P_New_Content_Data {
    contentType: string;
    metaDatKey: string;
    fileDatKey: string;
    ethAddress: string;
    metaData: Object;
    indexData: Object;
    signature: string;
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
}

export interface AOP2P_GetContentHosts_Data {
    content: AOContent;
}

export interface AOP2P_ContentRegistrationRoute {
    nameSpace: string;
    contentType: string;
    ethAddress: string;
    metaDatKey: string;
}

export interface AOP2P_SelfRegistrationRoute {
    nameSpace: string;
    ethAddress: string;
    contentType: string;
    fileDatKey: string;
}

export interface AOP2P_NodeRegistrationRoute {
    nameSpace: string;
    contentType: string;
    metaDatKey: string;
    ethAddress: string;
    fileDatKey: string;
}

export interface AOP2P_NodeUpdateRoute {
    nameSpace: string;
    contentType: string;
    metaDatKey: string;
    ethAddress: string;
}

export interface AOP2P_PeerStats {
    p2pStatus: IAOStatus;
    peersConnected: number;
    recentlySeenContentHosts: number;
}

export interface NetworkContentHostEntry {
    contentDatKey: string;
    contentHostId: string;
    nodeId: string;
    timestamp: string;
}

export default class AOP2P extends AORouterInterface {
    private taodb: TaoDB;
    private dbPath: string;

    private taoDbRootDir: string;
    private storageLocation: string;
    private contentIngestion: AOContentIngestion;
    private contentHostsUpdater: AOContentHostsUpdater;

    constructor(args: AORouterSubprocessArgs) {
        super(args);
        this.storageLocation = args.storageLocation;
        this.taoDbRootDir = "/AO";

        //New Content upload
        this.contentIngestion = new AOContentIngestion(this.router);
        this.contentHostsUpdater = new AOContentHostsUpdater(
            this.router,
            this._getContentHostsFormatted.bind(this)
        );

        this.router.on("/p2p/init", this._init.bind(this));
        this.router.on(
            "/p2p/beginDiscovery",
            this._handleStartDiscovery.bind(this)
        );
        // this.router.on("/p2p/newContent", this._handleNewContent.bind(this));
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
            "/p2p/addDiscovery",
            this._handleAddDiscovery.bind(this)
        );
        this.router.on(
            "/p2p/soldKey",
            this._handleSellDecryptionKey.bind(this)
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
    }

    private _init(request: IAORouterRequest) {
        const { dbKey }: AOP2P_Init_Data = request.data;
        this.dbPath = path.join(this.storageLocation, "p2p", dbKey);
        const ensureP2PPathData: IAOFS_Mkdir_Data = { dirPath: this.dbPath };
        this.router
            .send("/fs/mkdir", ensureP2PPathData)
            .then(() => {
                const hyperDBOptions: IAODB_Args = {
                    dbKey,
                    dbPath: this.dbPath
                };
                this.taodb = new TaoDB();
                this.taodb
                    .start(hyperDBOptions)
                    .then(() => {
                        request.respond({ data: "great success!" });
                    })
                    .catch(request.reject);
            })
            .catch(request.reject);
    }

    /**
     * Runs the content discovery once, then again each time the
     * hyperdb instance changes under the content watch key.
     */
    _handleStartDiscovery(request: IAORouterRequest) {
        debug(`hyperdb starting discovery...`);
        this._runDiscovery()
            .then(() => {
                debug("Initial discovery ran");
                this._watchDiscovery();
            })
            .catch(debug);
        request.respond({});
    }

    //For the sake of clean recursive methods.
    _watchDiscovery() {
        this.taodb
            .watch(this.taoDbRootDir)
            .then(() => {
                debug("Something changed in " + this.taoDbRootDir);
                this._runDiscovery()
                    .then(() => {
                        this._watchDiscovery();
                    })
                    .catch(debug);
            })
            .catch(debug);
    }

    _runDiscovery() {
        debug(`Running discovery...`);
        return Promise.resolve()
            .then(() => {
                // 1. List all content types
                return this.taodb.list(this.taoDbRootDir, {
                    recursive: false
                });
            })
            .then((contentList: Array<AODB_Entry<any>>) => {
                const contentTypes = contentList.map(
                    (entry: AODB_Entry<any>) => {
                        return entry.splitKey[1]; // /AOSpace/{contentType}
                    }
                );
                debug(
                    `Content types found in network db: ${contentTypes.join(
                        ", "
                    )}`
                );
                // 2. List all keys within each content type
                const contentListPromises = contentTypes.map(contentType => {
                    return this.taodb.list(
                        `${this.taoDbRootDir}/${contentType}/`,
                        { recursive: false }
                    );
                });
                return Promise.all(contentListPromises);
            })
            .then((contentLists: Array<Array<AODB_Entry<any>>>) => {
                // Lets merge all the content keys into a single array
                let contentKeys: Array<string> = [];
                contentLists.forEach(contentList => {
                    contentList.forEach((entry: AODB_Entry<any>) => {
                        // sanity check to make sure entry is a Dat key
                        const key = entry.splitKey[2];
                        if (key.length === 64) {
                            contentKeys.push(key); // /AOSpace/{contentType}/{metadataDatKey}
                        }
                    });
                });
                return Promise.resolve(contentKeys);
            })
            .then((networkContentKeys: Array<string>) => {
                // 3. Pull all content keys found in the user's *local* network db (content already discovered)
                return new Promise((localResolve, localReject) => {
                    const networkContentQuery: AODB_NetworkContentGet_Data = {
                        projection: { _id: 1 }
                    }; // Only return _ids = metadataDatKey
                    this.router
                        .send("/db/network/content/get", networkContentQuery)
                        .then((networkContentResponse: IAORouterMessage) => {
                            localResolve({
                                contentKeysAlreadyDiscovered: networkContentResponse.data.map(
                                    entry => entry._id
                                ),
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
        this.taodb
            .setUserIdentity(userIdentity)
            .then(request.respond)
            .catch(request.reject);
    }

    _handleNewContent(request: IAORouterRequest) {
        const {
            contentType,
            metaDatKey,
            fileDatKey,
            ethAddress,
            metaData,
            indexData,
            signature
        }: AOP2P_New_Content_Data = request.data;
        let allInserts = [];
        return request.reject(new Error(`TODO: Unimplemented!`));
        //Content Signature/Meta Data
        // const contentRegistrationKey = AOP2P.routeContentRegistrtionPrefix({
        //     nameSpace: this.taoDbRootDir,
        //     contentType,
        //     ethAddress,
        //     metaDatKey
        // });

        // allInserts.push(
        //     this.hyperdb.insert(
        //         contentRegistrationKey + "/signature",
        //         signature
        //     )
        // );
        // allInserts.push(
        //     this.hyperdb.insert(contentRegistrationKey + "/metaData", metaData)
        // );

        // //IndexData
        // const selfRegistration = AOP2P.routeSelfRegistration({
        //     nameSpace: this.taoDbRootDir,
        //     ethAddress,
        //     contentType,
        //     fileDatKey
        // });
        // const nodeRegistration = AOP2P.routeNodeRegistration({
        //     nameSpace: this.taoDbRootDir,
        //     contentType,
        //     metaDatKey,
        //     ethAddress,
        //     fileDatKey
        // });
        // allInserts.push(this.hyperdb.insert(selfRegistration, indexData));
        // allInserts.push(this.hyperdb.insert(nodeRegistration, indexData));

        // //On/Off/Signatures
        // allInserts.push(
        //     this.hyperdb.insert(
        //         AOP2P.routeAddSignature(selfRegistration),
        //         signature
        //     )
        // );
        // allInserts.push(
        //     this.hyperdb.insert(
        //         AOP2P.routeAddSignature(nodeRegistration),
        //         signature
        //     )
        // );

        // Promise.all(allInserts)
        //     .then(() => {
        //         request.respond({ success: true });
        //     })
        //     .catch(e => {
        //         request.reject(e);
        //     });
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
            hostsPublicKey: content.nodeId,
            contentDatKey: content.fileDatKey,
            contentMetadataDatKey: content.metadataDatKey,
            contentType: content.contentType
        });

        Promise.resolve()
            .then(() => {
                // 1. Initial query for indexData
                return this.taodb.get(indexDataKey);
            })
            .then((entry: AODB_Entry<ITaoDB_ContentHost_IndexData>) => {
                // 2a. Check if indexData entry for the buyer already exists
                if (entry.value && entry.value[buyersPublicKey]) {
                    debug(
                        `[${
                            request.id
                        }] _handleWatchAndGetIndexData got index data on first try`
                    );
                    request.respond(entry.value[buyersPublicKey]);
                    return;
                }
                // 2b. Not found, listen for changes...
                debug(
                    `[${
                        request.id
                    }] _handleWatchAndGetIndexData did not find index data on first try, watching...`
                );
                const watcher = this.taodb.aodb.watch(indexDataKey);
                return Promise.resolve(watcher);
            })
            .then(watcher => {
                return new Promise((localResolve, localReject) => {
                    watcher.on("watching", () => {
                        debug(
                            `[${
                                request.id
                            }] watching aodb on ${indexDataKey}...`
                        );
                    });
                    watcher.on("change", () => {
                        debug(
                            `[${
                                request.id
                            }] aodb detected change on ${indexDataKey}!`
                        );
                        // Check if our value exists
                        this.taodb
                            .get(indexDataKey)
                            .then(
                                (
                                    entry: AODB_Entry<
                                        ITaoDB_ContentHost_IndexData
                                    >
                                ) => {
                                    if (
                                        entry.value &&
                                        entry.value[buyersPublicKey]
                                    ) {
                                        watcher.destroy();
                                        localResolve(
                                            entry.value[buyersPublicKey]
                                        );
                                    }
                                }
                            );
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
    _handleAddDiscovery(request: IAORouterRequest) {
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
            .send("/db/network/content/get", networkContentQuery)
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
                .then((results: Array<AODB_Entry<any>>) => {
                    /**
                     * Results needs quite a bit of formatting
                     */
                    let jsonResults = results
                        .map((entry: AODB_Entry<any>) => {
                            // 1. Convert entry value data to json
                            if (entry && entry.value) {
                                return {
                                    contentDatKey: entry.value.contentDatKey,
                                    contentHostId: entry.value.contentHostId,
                                    timestamp: entry.value.timestamp,
                                    nodeId: entry.splitKey[5] // /AO/Content/{contentType}/{contentMetadataDatKey}/Hosts/{hostsNodeId/publicKey}
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
                    debug(
                        `${jsonResults.length} potential hosts for content: ${
                            content.title
                        }`
                    );
                    resolve(jsonResults);
                })
                .catch(reject);
        });
    }

    _handleSellDecryptionKey(request: IAORouterRequest) {
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
        const indexDataKey = TaoDB.getContentHostIndexDataKey({
            hostsPublicKey,
            contentType: content.contentType,
            contentMetadataDatKey: content.metadataDatKey,
            contentDatKey: content.fileDatKey
        });
        this.taodb
            .get(indexDataKey)
            .then((entry: AODB_Entry<ITaoDB_ContentHost_IndexData>) => {
                let existingIndexData: ITaoDB_ContentHost_IndexData =
                    entry.value || {};
                const existingIndexDataForBuyer =
                    existingIndexData[buyersPublicKey];
                if (
                    existingIndexDataForBuyer &&
                    existingIndexDataForBuyer.decryptionKey
                ) {
                    debug(
                        `Decryption key handoff already exists for content ${
                            content.title
                        } and buyer ${buyersPublicKey}`
                    );
                    request.respond({ success: true, alreadyExists: true });
                    return null;
                }
                existingIndexData[buyersPublicKey] = {
                    signature: encryptedKeySignature,
                    decryptionKey: encryptedDecryptionKey
                };
                this.taodb
                    .insertContentHostIndexData({
                        content,
                        indexData: existingIndexData
                    })
                    .then(() => {
                        request.respond({ success: true });
                    })
                    .catch(request.reject);
            })
            .catch(request.reject);
    }

    _handleNodeUpdate(request: IAORouterRequest) {
        const { content }: AOP2P_Update_Node_Timestamp_Data = request.data;
        this.taodb
            .insertContentHostTimestamp({ content })
            .then(request.respond)
            .catch(request.reject);
    }
}
