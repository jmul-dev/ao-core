import Debug from 'debug';
import path from 'path';
import AOContent from '../../models/AOContent';
import { AO_Hyper_Options } from "../../router/AOHyperDB";
import { IAORouterMessage } from "../../router/AORouter";
import AORouterInterface, { AORouterArgs, IAORouterRequest } from "../../router/AORouterInterface";
import { AODB_NetworkContentGet_Data } from '../db/db';
import { IAOFS_Read_Data } from '../fs/fs';
const debug = Debug('ao:p2p');


export interface AOP2P_Args {
    storageLocation: string;
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
}

export interface AOP2P_Write_Decryption_Key_Data {
    content: AOContent;
    buyerEthAddress: string;
    sellerEthAddress?: string; //mostly for testing.
    encryptedDecryptionKey: string;
    encryptedKeySignature: string;
}

//Single indexData
export interface AOP2P_IndexDataRow {
    signature: string;
    decryptionKey: string;
}



//This is out here since 
const routerArgs: AORouterArgs = {
    enableHyperDB: true
}

export default class AOP2P extends AORouterInterface {
    private dbPath: string
    private dbKey: string = '006c3ce5918f7a577156adc74668a8bfad80b2420d1f11d4b5d66cbbe36e49d2'//TODO: Set the production static dbKey
    private dbPrefix: string

    private storageLocation: string

    private contentWatchKey: string

    constructor(args: AOP2P_Args) {
        super(routerArgs)
        this.storageLocation = args.storageLocation
        this.dbPath = path.join(this.storageLocation, 'p2p')
        this.dbPrefix = '/AOSpace/' //Also known as App ID

        //New Content upload
        this.router.on('/p2p/newContent', this._handleNewContent.bind(this))
        //Watch for New Key
        this.router.on('/p2p/watchKey', this._handleWatchKey.bind(this))
        //Watch and Get
        this.router.on('/p2p/watchAndGetKey', this._handleWatchAndGetKey.bind(this))
        //Watch and Get IndexData
        this.router.on('/p2p/watchAndGetIndexData', this._handleWatchAndGetIndexData.bind(this))
        //Add content into Discovery
        this.router.on('/p2p/addDiscovery', this._handleAddDiscovery.bind(this))

        //Sold a piece of content via discovery.  Now need to update indexData
        this.router.on('/p2p/soldKey', this._handleSellDecryptionKey.bind(this))

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
                //Initialize discovery
                this._discovery()
                resolve({ success: true })
            }).catch(e => {
                reject(e)
            })
        })
    }

    //Discovery from watching the P2P networks.
    private _discovery() {
        this.contentWatchKey = this.dbPrefix + 'VOD/'; // /AOSpace/VOD/*
        this._initialDiscovery()
        .then(() => {
            this.hyperdb.watch(this.contentWatchKey)
            .then( this._initialDiscovery.bind(this) )
            .catch(debug)
        }).catch(debug)
    }

    private _initialDiscovery() {
        return new Promise((resolve, reject) => {
            let contentCompare = []
            contentCompare.push(this.hyperdb.list(this.contentWatchKey))
            contentCompare.push(this.router.send('/db/network/content/get', { query: {} }))

            Promise.all(contentCompare).then((results) => {
                const hyperPreviewList = results[0]
                const dbPreviewList = results[1].data

                //Find appropriate hyperDB datkeys
                let hyperPreviewKeys:Array<string> = []
                for (const preview of hyperPreviewList) {
                    const newKey = preview[2]
                    if(newKey.length == 64) {
                        hyperPreviewKeys.indexOf(newKey) === -1 ? hyperPreviewKeys.push(newKey) : null
                    }
                }

                //Find appropriate existing datkeys
                let dbPreviewKeys:Array<string> = []
                for (const preview of dbPreviewList) {
                    const newKey = preview.key
                    if(newKey.length == 64) {
                        dbPreviewKeys.indexOf(newKey) === -1 ? dbPreviewKeys.push(newKey) : null
                    }
                }

                //Run a comparater
                const newKeys = hyperPreviewKeys.filter((el) => {
                    return dbPreviewKeys.indexOf(el) < 0;
                });

                if (newKeys.length) {
                    for (const newKey of newKeys) {
                        this.router.send('/dat/download', { key: newKey }).then((downloadResponse: IAORouterMessage) => {
                            const readContentJson:IAOFS_Read_Data = {
                                readPath: path.join('content', newKey,'content.json')
                            }
                            this.router.send('/fs/read',readContentJson).then((readResponse: IAORouterMessage)=> {
                                const contentJson = JSON.parse(readResponse.data)
                                if(contentJson)  {
                                    const content:AOContent = AOContent.fromObject(contentJson)
                                    this._newKeyDiscoveryInsert(newKey, content).then(resolve).catch(reject)
                                } else {
                                    this._newKeyDiscoveryInsert(newKey).then(resolve).catch(reject)
                                }
                            }).catch(e => {
                                this._newKeyDiscoveryInsert(newKey).then(resolve).catch(reject)
                            })//Read Content File
                        }).catch(debug)
                    }
                }
            }).catch(debug)
        })
    }

    private _newKeyDiscoveryInsert(newKey:string, content?:AOContent) {
        return new Promise((resolve,reject ) => {
            let contentInsert = null
            if( content ) {
                contentInsert = content.toMetadataJson()
            }
            this.router.send('/db/network/content/insert', {
                key: newKey,
                content: contentInsert
            }).then(() => {
                if(contentInsert) {
                    debug('Successfully downloaded and recorded ' + newKey)
                } else {
                    debug('Empty preview dat.  Key inserted for record only ' + newKey)
                }
                resolve()
            }).catch(reject)//Insert into network DB
        })
    }

    private _handleNewContent(request: IAORouterRequest) {
        const { contentType, metaDatKey, fileDatKey, ethAddress, metaData, indexData, signature }: AOP2P_New_Content_Data = request.data
        let allInserts = []

        //Content Signature/Meta Data
        const contentRegistrationKey = this.dbPrefix + contentType + '/' + ethAddress + '/' + metaDatKey
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/signature', signature))
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/metaData', metaData))

        //IndexData
        const registrationData = ethAddress + '/' + fileDatKey + '/indexData'
        const selfRegistrationPrefix = ethAddress + '/' + this.dbPrefix + contentType + '/nodes/'
        const appRegistrationPrefix = this.dbPrefix + contentType + '/' + metaDatKey + '/nodes/'
        allInserts.push(this.hyperdb.insert(selfRegistrationPrefix + registrationData, indexData))
        allInserts.push(this.hyperdb.insert(appRegistrationPrefix + registrationData, indexData))

        //On/Off/Signatures
        allInserts.push(this.hyperdb.insert(selfRegistrationPrefix + registrationData + '/on/signature', signature))
        allInserts.push(this.hyperdb.insert(appRegistrationPrefix + registrationData + '/on/signature', signature))

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
        const { contentType, fileDatKey, ethAddress, metaDatKey }: AOP2P_Add_Discovery_Data = request.data
        const appRegistrationPrefix = this.dbPrefix + contentType + '/' + metaDatKey + '/nodes/'
        const registrationData = ethAddress + '/' + fileDatKey + '/indexData'
        this.hyperdb.insert(appRegistrationPrefix + registrationData, {})
            .then(() => {
                request.respond({ success: true })
            })
            .catch(e => {
                request.reject(e)
            })
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
        const contentPrefixRoute = this.dbPrefix + content.contentType + '/' + content.metadataDatKey + '/nodes/'
        const indexDataRoute = sellerEthAddress + '/' + content.fileDatKey + '/indexData';

        this.hyperdb.query(contentPrefixRoute + indexDataRoute).then((indexDataString: string) => {
            let indexData = JSON.parse(indexDataString)
            // 2. Add row to indexData
            indexData[buyerEthAddress] = {
                decryptionKey: encryptedDecryptionKey, // Encrypted key with publicKey
                signature: encryptedKeySignature //
            }
            // 3. Let's write this thing into hyperdb
            this.hyperdb.insert(contentPrefixRoute + indexDataRoute, indexData).then(() => {
                request.respond({ success: true })
            }).catch(e => {
                request.reject(e)
            })
        }).catch(e => {
            request.reject(e)
        })
    }
} 