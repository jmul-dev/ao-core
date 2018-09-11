import Debug from 'debug';
import path from 'path';
import AOContent from '../../models/AOContent';
import AONetworkContent from '../../models/AONetworkContent';
import { AO_Hyper_Options, HDB_ListValueRow } from "../../router/AOHyperDB";
import AORouterInterface, { AORouterArgs, IAORouterRequest } from "../../router/AORouterInterface";
import AOContentIngestion from './AOContentIngestion';
const debug = Debug('ao:p2p');


export interface AOP2P_Args {
    storageLocation: string;
    dbNameSpace: string;
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
    key: string;
    ethAddress: string;
}

export interface AOP2P_Add_Discovery_Data {
    contentType: string;
    fileDatKey: string;
    metaDatKey: string;
    ethAddress: string;
    contentHostId: string;
}

export interface AOP2P_Write_Decryption_Key_Data {
    content: AOContent;
    buyerEthAddress: string;
    sellerEthAddress?: string; //mostly for testing.
    encryptedDecryptionKey: string;
    encryptedKeySignature: string;
}

export interface AOP2P_Update_Node_Timestamp_Data {
    content: AOContent;
}

export interface AOP2P_Get_File_Node_Data {
    content: AOContent;
}

//Single indexData
export interface AOP2P_IndexDataRow {
    signature: string;
    decryptionKey: string;
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


//This is out here since 
const routerArgs: AORouterArgs = {
    enableHyperDB: true
}

export default class AOP2P extends AORouterInterface {
    private dbPath: string;
    private dbKey: string = '006c3ce5918f7a577156adc74668a8bfad80b2420d1f11d4b5d66cbbe36e49d2'; //TODO: Set the production static dbKey
    private dbPrefix: string;
    private storageLocation: string;
    private contentWatchKey: string;
    private contentIngestion: AOContentIngestion;

    constructor(args: AOP2P_Args) {
        super(routerArgs)
        this.storageLocation = args.storageLocation
        this.dbPath = path.join(this.storageLocation, 'p2p')
        this.dbPrefix = args.dbNameSpace ? args.dbNameSpace :'/AOSpace/' //Also known as App ID

        //New Content upload
        this.contentIngestion = new AOContentIngestion(this.router)

        this.router.on('/p2p/newContent', this._handleNewContent.bind(this))
        this.router.on('/p2p/watchKey', this._handleWatchKey.bind(this))
        this.router.on('/p2p/watchAndGetKey', this._handleWatchAndGetKey.bind(this))
        this.router.on('/p2p/watchAndGetIndexData', this._handleWatchAndGetIndexData.bind(this))
        this.router.on('/p2p/addDiscovery', this._handleAddDiscovery.bind(this))
        this.router.on('/p2p/soldKey', this._handleSellDecryptionKey.bind(this))
        this.router.on('/p2p/updateNode', this._handleNodeUpdate.bind(this))
        this.router.on('/p2p/findEncryptedNode', this._handleGetFileNodes.bind(this))

        this.init().then(() => {
            debug('started')
        }).catch(debug)
    }

    private init() {
        return new Promise((resolve, reject) => {
            //TODO: Should this be a file or just a key assigned per module?
            const hyperDBOptions: AO_Hyper_Options = {
                dbKey: this.dbKey,
                dbPath: this.dbPath,
                autoAuth: true
            }
            this.hyperdb.init(hyperDBOptions).then(() => {                
                resolve({ success: true })
                this._beginDiscovery()
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Runs the content discovery once, then again each time the 
     * hyperdb instance changes under the content watch key.
     */
    private _beginDiscovery() {
        this.contentWatchKey = this.dbPrefix + 'VOD/'; // /AOSpace/VOD/*
        this._runDiscovery().then(() => {
            this.hyperdb.watch(this.contentWatchKey).then(this._runDiscovery.bind(this)).catch(debug)
        }).catch(debug)
    }
    private _runDiscovery() {
        return new Promise((resolve, reject) => {
            let contentCompare = []
            contentCompare.push(this.hyperdb.list(this.contentWatchKey))
            contentCompare.push(this.router.send('/db/network/content/get', {projection: {_id: 1}}))  // Only return _ids = metadataDatKey
            Promise.all(contentCompare).then((results) => {
                const contentInNetworkDb = results[0]
                const contentInLocalNetworkDb: Array<AONetworkContent> = results[1].data
                //Find appropriate hyperDB datkeys
                let metadataDatKeysInNetworkDb: Array<string> = []
                for (const content of contentInNetworkDb) {
                    const newKey = content[2]
                    if (newKey.length == 64) {
                        metadataDatKeysInNetworkDb.indexOf(newKey) === -1 ? metadataDatKeysInNetworkDb.push(newKey) : null
                    }
                }
                //Find appropriate existing datkeys
                let metadataDatKeysInLocalNetworkDb: Array<string> = []
                for (const content of contentInLocalNetworkDb) {
                    const newKey = content._id
                    if (newKey.length == 64) {
                        metadataDatKeysInLocalNetworkDb.indexOf(newKey) === -1 ? metadataDatKeysInLocalNetworkDb.push(newKey) : null
                    }
                }
                //Run a comparater
                const newMetadataDatKeys = metadataDatKeysInNetworkDb.filter((el) => {
                    return metadataDatKeysInLocalNetworkDb.indexOf(el) < 0;
                });
                //Add to content ingestion helper
                if (newMetadataDatKeys.length) {
                    for (const metadataDatKey in newMetadataDatKeys) {
                        if (newMetadataDatKeys.hasOwnProperty(metadataDatKey)) {
                            const datKey = newMetadataDatKeys[metadataDatKey];
                            this.contentIngestion.addDiscoveredMetadataDatKeyToQueue(datKey)
                        }
                    }
                }
                resolve()
            }).catch(reject)
        })
    }

    private _handleNewContent(request: IAORouterRequest) {
        const { contentType, metaDatKey, fileDatKey, ethAddress, metaData, indexData, signature }: AOP2P_New_Content_Data = request.data
        let allInserts = []

        //Content Signature/Meta Data
        const contentRegistrationKey = AOP2P.routeContentRegistrtionPrefix({nameSpace:this.dbPrefix, contentType, ethAddress, metaDatKey})
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/signature', signature))
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/metaData', metaData))

        //IndexData
        const selfRegistration = AOP2P.routeSelfRegistration({nameSpace:this.dbPrefix, ethAddress,contentType, fileDatKey})
        const nodeRegistration = AOP2P.routeNodeRegistration({nameSpace:this.dbPrefix, contentType,metaDatKey,ethAddress,fileDatKey})
        allInserts.push(this.hyperdb.insert(selfRegistration, indexData))
        allInserts.push(this.hyperdb.insert(nodeRegistration, indexData))

        //On/Off/Signatures
        allInserts.push(this.hyperdb.insert(AOP2P.routeAddSignature(selfRegistration), signature))
        allInserts.push(this.hyperdb.insert(AOP2P.routeAddSignature(nodeRegistration), signature))

        Promise.all(allInserts).then(() => {
            request.respond({ success: true })
        }).catch((e) => {
            request.reject(e)
        })
    }

    private _handleWatchKey(request: IAORouterRequest) {
        const requestData: AOP2P_Watch_Key_Data = request.data
        //TODO: We might consider helping construct the specific key here.  Dunno what exactly we're looking for yet 100%
        this.hyperdb.watch(requestData.key)
            .then(() => {
                request.respond({ success: true })
            }).catch(e => {
                request.reject(e)
            })
    }

    private _handleWatchAndGetKey(request: IAORouterRequest) {
        const requestData: AOP2P_Watch_AND_Get_Key_Data = request.data
        this.hyperdb.watch(requestData.key)
            .then(() => {
                //Query
                this.hyperdb.query(requestData.key)
                    .then((value) => {
                        request.respond(value)
                    }).catch(e => {
                        request.reject(e)
                    })
            }).catch(e => {
                request.reject(e)
            })
    }


    private _handleWatchAndGetIndexData(request: IAORouterRequest) {
        const { key, ethAddress }: AOP2P_Watch_AND_Get_IndexData_Data = request.data
        this.hyperdb.query(key).then((indexDataString: string) => {
            let indexData = JSON.parse(indexDataString)
            if (!indexData[ethAddress]) {
                this.hyperdb.watch(key).then(() => {
                    this.hyperdb.query(key).then((indexDataString: string) => {
                        let indexData = JSON.parse(indexDataString)
                        if (!indexData[ethAddress]) {
                            //Self call if there isn't a record for our own indexData
                            setTimeout(() => {
                                this._handleWatchAndGetIndexData(request)
                            }, 500);
                        } else {
                            let indexDataRow: AOP2P_IndexDataRow = indexData[ethAddress]
                            request.respond({ indexDataRow: indexDataRow })
                        }
                    }).catch(request.reject)
                }).catch(request.reject)
            } else {
                let indexDataRow: AOP2P_IndexDataRow = indexData[ethAddress]
                request.respond({ indexDataRow: indexDataRow })
            }

        }).catch(request.reject)
    }

    private _handleAddDiscovery(request: IAORouterRequest) {
        const { contentType, fileDatKey, ethAddress, metaDatKey, contentHostId }: AOP2P_Add_Discovery_Data = request.data
        const nodeRoute = AOP2P.routeNodeRegistration({nameSpace: this.dbPrefix, contentType, metaDatKey, ethAddress, fileDatKey})
        this.hyperdb.insert(nodeRoute, {})
            .then(() => {
                this.nodeTimestampUpdate({ nameSpace: this.dbPrefix, contentType, ethAddress, metaDatKey, contentHostId}).then(() => {
                    request.respond({ success: true })
                }).catch(request.reject)
            }).catch(request.reject)
    }

    /**
     * Gets time sorted keys for a specific content nodes
     * @param request 
     * @returns sortedKeys
     */
    private _handleGetFileNodes(request: IAORouterRequest) {
        const { content }:AOP2P_Get_File_Node_Data = request.data
        const fineNodeRoute = AOP2P.routeBaseRegistrationPrefix({
            nameSpace: this.dbPrefix, 
            contentType: content.contentType,
            metaDatKey: content.metadataDatKey
        })
        this.hyperdb.listValue(fineNodeRoute).then((results:Array<HDB_ListValueRow>) => {
            //Store the JSON object as value instead of just a stringified JSON.
            let jsonResults = results.map (a => {
                a.value = JSON.parse(a.value)
                return a
            })
            //Sort by timestamp data
            jsonResults.sort( (a,b) => {
                const timestampA = a.value.timestamp
                const timestampB = b.value.timestamp
                return timestampA>timestampB ? -1 : timestampA<timestampB ? 1 : 0;
            })
            request.respond(jsonResults)
        }).catch(request.reject)
    }

    private _handleSellDecryptionKey(request: IAORouterRequest) {
        let { content, buyerEthAddress, sellerEthAddress, encryptedDecryptionKey, encryptedKeySignature }: AOP2P_Write_Decryption_Key_Data = request.data
        if (!content) {
            return request.reject(new Error('No content'))
        }
        if (request.ethAddress) {
            sellerEthAddress = request.ethAddress
        }
        // 1. Let's get the current indexData for this
        const nodeRouteArgs:AOP2P_NodeRegistrationRoute = {
            nameSpace: this.dbPrefix,
            contentType: content.contentType,
            metaDatKey: content.metadataDatKey,
            ethAddress: sellerEthAddress,
            fileDatKey: content.fileDatKey
        }
        const nodeRoute = AOP2P.routeNodeRegistration(nodeRouteArgs)

        this.hyperdb.query(nodeRoute).then((indexDataString: string) => {
            let indexData = JSON.parse(indexDataString)
            // 2. Add row to indexData
            indexData[buyerEthAddress] = {
                decryptionKey: encryptedDecryptionKey, // Encrypted key with publicKey
                signature: encryptedKeySignature //
            }
            // 3. Let's write this thing into hyperdb
            this.hyperdb.insert(nodeRoute, indexData).then(() => {
                request.respond({ success: true })
            }).catch(e => {
                request.reject(e)
            })
        }).catch(e => {
            request.reject(e)
        })
    }

    private _handleNodeUpdate(request: IAORouterRequest) {
        const { content }:AOP2P_Update_Node_Timestamp_Data = request.data
        this.nodeTimestampUpdate({
            nameSpace: this.dbPrefix,
            contentType: content.contentType,
            metaDatKey: content.metadataDatKey,
            ethAddress: request.ethAddress,
            contentHostId: content.contentHostId
        }).then(() => {
            request.respond({})
        }).catch(request.reject)
    }

    private nodeTimestampUpdate({nameSpace, contentType, metaDatKey, ethAddress, contentHostId}) {
        return new Promise((resolve,reject) => {
            const nodeUpdateKey:string = AOP2P.routeNodeRegistrationUpdate({
                nameSpace,
                contentType,
                metaDatKey,
                ethAddress
            })
            const insertObject = {
                timestamp: Date.now(),
                contentHostId
            }
            this.hyperdb.insert( nodeUpdateKey, insertObject ).then(() => {
                resolve()
            }).catch(reject)
        })
    }

    /**
     * Creator Dat registration.  Only used for initial upload
     * App ID / Content Type / Creator EthAddress / Meta Dat Key 
     */
    public static routeContentRegistrtionPrefix({nameSpace, contentType, ethAddress, metaDatKey}:AOP2P_ContentRegistrationRoute) {
        return nameSpace + contentType + '/' + ethAddress + '/' + metaDatKey
    }

    /**
     * Prefix Route for your own ethAddress
     */
    public static routeSelfRegistrationPrefix({nameSpace, ethAddress, contentType}) {
        return ethAddress + '/' + nameSpace + contentType + '/nodes/'
    }

    /**
     * Prefix Route for the App's namespace
     */
    public static routeBaseRegistrationPrefix({nameSpace, contentType, metaDatKey}) {
        return nameSpace + contentType + '/' + metaDatKey + '/nodes/'
    }

    /**
     * Registration Data route to IndexData
     */
    public static routeRegistrationData({ethAddress, fileDatKey}) {
        return ethAddress + '/' + fileDatKey + '/indexData'
    }

    /**
     * Entire route for self registration
     */
    public static routeSelfRegistration({nameSpace, ethAddress, contentType, fileDatKey}:AOP2P_SelfRegistrationRoute ) {
        return AOP2P.routeSelfRegistrationPrefix({nameSpace, ethAddress,contentType}) + AOP2P.routeRegistrationData({ethAddress,fileDatKey})
    }

    /**
     * Entire route for node registration
     */
    public static routeNodeRegistration({nameSpace, contentType, metaDatKey, ethAddress, fileDatKey}:AOP2P_NodeRegistrationRoute) {
        return AOP2P.routeBaseRegistrationPrefix({nameSpace, contentType, metaDatKey}) + AOP2P.routeRegistrationData({ethAddress, fileDatKey})
    }

    /**
     * Entire route for updating your node registration timestamp
     */
    public static routeNodeRegistrationUpdate({nameSpace, contentType, metaDatKey, ethAddress}:AOP2P_NodeUpdateRoute) {
        return AOP2P.routeBaseRegistrationPrefix({nameSpace, contentType, metaDatKey}) + ethAddress
    }

    /**
     * Simply adds signatures to the end of the route for node routes.
     */
    public static routeAddSignature(route) {
        return route + '/signature'
    }
}