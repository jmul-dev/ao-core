import Debug from '../../AODebug'
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

export interface NetworkContentHostEntry {
    contentDatKey: string;
    contentHostId: string;
    timestamp: string;
}


//This is out here since 
const routerArgs: AORouterArgs = {
    enableHyperDB: true
}

export default class AOP2P extends AORouterInterface {
    private dbPath: string;
    private dbKey: string = '7fa866717f66a54fd51d481f7dd04bd7a508e3bd878553ec39c12021b2cb4deb';
    private dbPrefix: string;
    private storageLocation: string;
    private contentWatchKey: string;
    private contentIngestion: AOContentIngestion;

    constructor(args: AOP2P_Args) {
        super(routerArgs)
        this.storageLocation = args.storageLocation
        this.dbPath = path.join(this.storageLocation, 'p2p')
        this.dbPrefix = args.dbNameSpace ? args.dbNameSpace : '/AOSpace/' //Also known as App ID

        //New Content upload
        this.contentIngestion = new AOContentIngestion(this.router)

        this.router.on('/p2p/beginDiscovery', this._handleStartDiscovery.bind(this))
        this.router.on('/p2p/newContent', this._handleNewContent.bind(this))
        this.router.on('/p2p/watchKey', this._handleWatchKey.bind(this))
        this.router.on('/p2p/watchAndGetKey', this._handleWatchAndGetKey.bind(this))
        this.router.on('/p2p/watchAndGetIndexData', this._handleWatchAndGetIndexData.bind(this))
        this.router.on('/p2p/addDiscovery', this._handleAddDiscovery.bind(this))
        this.router.on('/p2p/soldKey', this._handleSellDecryptionKey.bind(this))
        this.router.on('/p2p/updateNode', this._handleNodeUpdate.bind(this))
        this.router.on('/p2p/content/getContentHosts', this._handleGetContentHosts.bind(this))

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
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Runs the content discovery once, then again each time the 
     * hyperdb instance changes under the content watch key.
     */
    private _handleStartDiscovery(request:IAORouterRequest) {
        debug(`hyperdb starting discovery...`)
        this.contentWatchKey = this.dbPrefix + 'VOD/'; // /AOSpace/VOD/*
        this._runDiscovery().then(() => {
            debug('Initial discovery ran')
            this._watchDiscovery()
        }).catch(debug)
        request.respond({})
    }

    //For the sake of clean recursive methods.
    private _watchDiscovery() {
        this.hyperdb.watch(this.contentWatchKey).then(() => {
            debug('Something changed in ' + this.contentWatchKey)
            this._runDiscovery().then(()=> {
                this._watchDiscovery()
            }).catch(debug)
        }).catch(debug)
    }

    private _runDiscovery() {
        return new Promise((resolve, reject) => {
            let contentCompare = []
            contentCompare.push(this.hyperdb.list(this.contentWatchKey))
            contentCompare.push(this.router.send('/db/network/content/get', { query: { projection: { _id: 1 } } }))  // Only return _ids = metadataDatKey
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
                const newMetadataDatKeys: Array<string> = metadataDatKeysInNetworkDb.filter((el) => {
                    return metadataDatKeysInLocalNetworkDb.indexOf(el) < 0;
                });
                //debug(newMetadataDatKeys)
                //Add to content ingestion helper
                if (newMetadataDatKeys.length) {
                    for (let i = 0; i < newMetadataDatKeys.length; i++) {
                        const datKey = newMetadataDatKeys[i];
                        this.contentIngestion.addDiscoveredMetadataDatKeyToQueue(datKey)
                    }
                } else {
                    debug('No new meta dat keys found')
                }
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    }

    private _handleNewContent(request: IAORouterRequest) {
        const { contentType, metaDatKey, fileDatKey, ethAddress, metaData, indexData, signature }: AOP2P_New_Content_Data = request.data
        let allInserts = []

        //Content Signature/Meta Data
        const contentRegistrationKey = AOP2P.routeContentRegistrtionPrefix({ nameSpace: this.dbPrefix, contentType, ethAddress, metaDatKey })
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/signature', signature))
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/metaData', metaData))

        //IndexData
        const selfRegistration = AOP2P.routeSelfRegistration({ nameSpace: this.dbPrefix, ethAddress, contentType, fileDatKey })
        const nodeRegistration = AOP2P.routeNodeRegistration({ nameSpace: this.dbPrefix, contentType, metaDatKey, ethAddress, fileDatKey })
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
        debug(`[${request.id}] _handleWatchAndGetIndexData`)
        this.hyperdb.query(key).then((indexDataString: string) => {
            debug(`[${indexDataString}] indexDataString`)
            this.parseIndexDataByEth({ indexDataString, ethAddress }).then((indexData) => {
                debug(indexData)
                // If it exists, send it back.
                debug(`[${request.id}] _handleWatchAndGetIndexData got index data on first try`)
                request.respond(indexData)                
            }).catch(() => {
                // If it doens't, watch for change
                debug(`[${request.id}] _handleWatchAndGetIndexData did not find index data on first try, watching...`)
                this.hyperdb.watch(key).then(() => {
                    this.hyperdb.query(key).then((indexDataString: string) => {
                        this.parseIndexDataByEth({ indexDataString, ethAddress }).then((indexData) => {
                            request.respond(indexData)
                        }).catch(() => {
                            //Self call if there isn't a record for our own indexData
                            debug(`[${request.id}] _handleWatchAndGetIndexData recursively called`)
                            setTimeout(() => {
                                this._handleWatchAndGetIndexData(request)
                            }, 500);
                        })
                    }).catch(request.reject)
                }).catch(request.reject)
            })
        }).catch(request.reject)
    }

    private parseIndexDataByEth({ indexDataString, ethAddress }) {
        return new Promise((resolve, reject) => {
            let indexData: object = {}
            try {
                indexData = JSON.parse(indexDataString)
            } catch (e) {
                debug('Index Data was not able to be parsed')
                indexData = {}
            }
            let comparativeAddress = ethAddress.substring(2)
            for (const address in indexData) {
                if (indexData.hasOwnProperty(address)) {
                    let currentAddress = address.substring(2).toLowerCase()
                    if(comparativeAddress == currentAddress) {
                        let indexDataRow: AOP2P_IndexDataRow = indexData[address];
                        debug(indexDataRow)
                        resolve(indexDataRow)
                        return
                    }
                }
            }
            reject()
        })
    }

    private _handleAddDiscovery(request: IAORouterRequest) {
        const { contentType, fileDatKey, ethAddress, metaDatKey, contentHostId }: AOP2P_Add_Discovery_Data = request.data
        const nodeRoute = AOP2P.routeNodeRegistration({ nameSpace: this.dbPrefix, contentType, metaDatKey, ethAddress, fileDatKey })
        this.hyperdb.insert(nodeRoute, {}).then(() => {
            debug('NODE INSERTED')
            this.nodeTimestampUpdate({ nameSpace: this.dbPrefix, contentType, ethAddress, metaDatKey, contentHostId, contentDatKey: fileDatKey, }).then(() => {
                debug('NODE TIMESTAMP UPDATED FO SURE')
                request.respond({ success: true })
            }).catch(request.reject)
        }).catch(request.reject)
    }

    /**
     * Get all potential hosts for a given piece of content. 
     * 
     * hyperdb: /AOSpace/{contentType}/metadataDatKey/nodes/*
     * 
     * @returns {Array<NetworkContentHostEntry>} response.data
     */
    private _handleGetContentHosts(request: IAORouterRequest) {
        const { content }: AOP2P_Get_File_Node_Data = request.data
        const fineNodeRoute = AOP2P.routeBaseRegistrationPrefix({
            nameSpace: this.dbPrefix,
            contentType: content.contentType,
            metaDatKey: content.metadataDatKey
        })
        this.hyperdb.listValue(fineNodeRoute).then((results: Array<HDB_ListValueRow>) => {
            /**
             * Results needs quite a bit of formatting
             */
            debug(results)
            // 1. Convert entry value data to json
            let jsonResults = results.map(entry => {
                try {
                    let entryValue = JSON.parse(entry.value)
                    return {
                        contentDatKey: entryValue.contentDatKey,
                        contentHostId: entryValue.contentHostId,
                        timestamp: entryValue.timestamp,
                    }
                } catch (error) {
                    // Instead of letting a single malformed entry ruin the show, we just ignore it
                    debug('Malformatted timestamp/contentHostId for ' + entry.key)
                    return null
                }
                // 2. Filter any malformed entries or entries without the correct values
            }).filter((entry: NetworkContentHostEntry) => {
                if (entry === null)
                    return false
                if (!entry.timestamp || !entry.contentHostId || !entry.contentDatKey)
                    return false
                return true
                // 3. Sort by timestamps
            }).sort((a: NetworkContentHostEntry, b: NetworkContentHostEntry) => {
                const timestampA = parseInt(a.timestamp)
                const timestampB = parseInt(b.timestamp)
                return timestampA > timestampB ? -1 : timestampA < timestampB ? 1 : 0;
            })
            debug(`${jsonResults.length} potential hosts for content: ${content.title}`)
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
        const nodeRouteArgs: AOP2P_NodeRegistrationRoute = {
            nameSpace: this.dbPrefix,
            contentType: content.contentType,
            metaDatKey: content.metadataDatKey,
            ethAddress: sellerEthAddress,
            fileDatKey: content.fileDatKey
        }
        const nodeRoute = AOP2P.routeNodeRegistration(nodeRouteArgs)

        this.hyperdb.query(nodeRoute).then((indexDataString: string) => {
            debug('Good query into finding '+ nodeRoute)
            let indexData: object = {}
            let indexDataRow: AOP2P_IndexDataRow = {
                decryptionKey: encryptedDecryptionKey, // Encrypted key with publicKey
                signature: encryptedKeySignature //
            }
            try {
                indexData = JSON.parse(indexDataString)
            } catch (e) {
                debug('Index Data could not be read/parsed while selling a key')
                indexData = {}
            }

            // 2. Check to see if we have already wrote in the right data (to avoid unecessary hyperdb update)
            if(indexData[buyerEthAddress] && indexData[buyerEthAddress].signature == indexDataRow.signature) {
                debug('This transaction is already recorded')
                request.respond({ success: true })
                return
            } else if(indexData[buyerEthAddress]) {
                debug(`Looks like we've already sold ${content.title} to ${buyerEthAddress}, going to overwrite the entry`)
            }

            // 3. Add row to indexData
            indexData[buyerEthAddress] = indexDataRow
            

            // 4. Let's write this thing into hyperdb
            this.hyperdb.insert(nodeRoute, indexData).then(() => {
                debug('Wrote in sold decryption key')
                request.respond({ success: true })
            }).catch(e => {
                request.reject(e)
            })
        }).catch(e => {
            request.reject(e)
        })
    }

    private _handleNodeUpdate(request: IAORouterRequest) {
        const { content }: AOP2P_Update_Node_Timestamp_Data = request.data
        this.nodeTimestampUpdate({
            nameSpace: this.dbPrefix,
            contentType: content.contentType,
            metaDatKey: content.metadataDatKey,
            ethAddress: request.ethAddress,
            contentHostId: content.contentHostId,
            contentDatKey: content.fileDatKey,
        }).then(() => {
            request.respond({})
        }).catch(request.reject)
    }

    private nodeTimestampUpdate({ nameSpace, contentType, metaDatKey, ethAddress, contentHostId, contentDatKey }) {
        return new Promise((resolve, reject) => {
            const nodeUpdateKey: string = AOP2P.routeNodeRegistrationUpdate({
                nameSpace,
                contentType,
                metaDatKey,
                ethAddress
            })
            const insertObject = {
                timestamp: Date.now(),
                contentHostId,
                contentDatKey,
            }
            this.hyperdb.insert(nodeUpdateKey, insertObject).then(() => {
                resolve()
            }).catch(reject)
        })
    }

    /**
     * Creator Dat registration.  Only used for initial upload
     * App ID / Content Type / Creator EthAddress / Meta Dat Key 
     */
    public static routeContentRegistrtionPrefix({ nameSpace, contentType, ethAddress, metaDatKey }: AOP2P_ContentRegistrationRoute) {
        return nameSpace + contentType + '/' + ethAddress + '/' + metaDatKey
    }

    /**
     * Prefix Route for your own ethAddress
     */
    public static routeSelfRegistrationPrefix({ nameSpace, ethAddress, contentType }) {
        return ethAddress + '/' + nameSpace + contentType + '/nodes/'
    }

    /**
     * Prefix Route for the App's namespace
     */
    public static routeBaseRegistrationPrefix({ nameSpace, contentType, metaDatKey }) {
        return nameSpace + contentType + '/' + metaDatKey + '/nodes/'
    }

    /**
     * Registration Data route to IndexData
     */
    public static routeRegistrationData({ ethAddress, fileDatKey }) {
        return ethAddress + '/' + fileDatKey + '/indexData'
    }

    /**
     * Entire route for self registration
     */
    public static routeSelfRegistration({ nameSpace, ethAddress, contentType, fileDatKey }: AOP2P_SelfRegistrationRoute) {
        return AOP2P.routeSelfRegistrationPrefix({ nameSpace, ethAddress, contentType }) + AOP2P.routeRegistrationData({ ethAddress, fileDatKey })
    }

    /**
     * Entire route for node registration
     */
    public static routeNodeRegistration({ nameSpace, contentType, metaDatKey, ethAddress, fileDatKey }: AOP2P_NodeRegistrationRoute) {
        return AOP2P.routeBaseRegistrationPrefix({ nameSpace, contentType, metaDatKey }) + AOP2P.routeRegistrationData({ ethAddress, fileDatKey })
    }

    /**
     * Entire route for updating your node registration timestamp
     */
    public static routeNodeRegistrationUpdate({ nameSpace, contentType, metaDatKey, ethAddress }: AOP2P_NodeUpdateRoute) {
        return AOP2P.routeBaseRegistrationPrefix({ nameSpace, contentType, metaDatKey }) + ethAddress
    }

    /**
     * Simply adds signatures to the end of the route for node routes.
     */
    public static routeAddSignature(route) {
        return route + '/signature'
    }
}