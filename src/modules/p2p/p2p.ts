import Debug from 'debug';
import path from 'path';
import { AO_Hyper_Options } from "../../router/AOHyperDB";
import { IAORouterMessage } from "../../router/AORouter";
import AORouterInterface, { AORouterArgs, IAORouterRequest } from "../../router/AORouterInterface";
import { AODB_UserContentGet_Data } from "../db/db";
import EthCrypto from 'eth-crypto'
const debug = Debug('ao:p2p');

export interface AOP2P_Args {
    storageLocation: string;
}


export interface AOP2P_New_Content_Data {
    contentType: string;
    datKey: string;
    ethAddress: string;
    metaData: Object;
    indexData: Object;//TODO: Define this better
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
    contentId: string;
    ethAddress: string; //Buyer Eth Address
    publicKey: string; //Buyer Public Key
    privateKey: string; //Seller Private Key
}

//Single indexData
export interface AOP2P_IndexDataRow {
    signature: string;
    decryptionKey: string;
}

interface AddIndexDataInterface {
    indexData: object;
    ethAddress: string;
    privateKey: string;
    publicKey: string;
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
        const contentWatchKey = this.dbPrefix + 'VOD/'; // /AOSpace/VOD/*
        this.hyperdb.watch(contentWatchKey)
        .then( ()=> {
            let contentCompare = []
            contentCompare.push( this.hyperdb.list( contentWatchKey ) )
            contentCompare.push( this.router.send( '/db/network/content/get',{ query: {} } ) )

            Promise.all(contentCompare).then((results) => {
                const hyperPreviewList = results[0]
                const dbPreviewList = results[1].data
                let hyperPreviewKeys = []
                let hyperKeyValue = {}

                for (const preview of hyperPreviewList) {
                    hyperPreviewKeys.push(preview[2])
                    hyperKeyValue[preview.key] = preview.value //for later use
                }
                
                let dbPreviewKeys = []
                for (const preview of dbPreviewList) {
                    dbPreviewKeys.push(preview.key)
                }
                let newKeys = hyperPreviewKeys.filter( function( el ) {
                    return dbPreviewKeys.indexOf( el ) < 0;
                });
                
                if(newKeys.length) {
                    for (const newKey of newKeys) {
                        if(newKey.length == 64) {//Just make sure that its a freaken dat key
                            this.router.send('/dat/download', { key: newKey }).then((downloadResponse:IAORouterMessage)=> {
                                this.router.send('/db/network/content/insert',{
                                    key: newKey,
                                    value: hyperKeyValue[newKey]
                                }).then(() => {
                                    debug('Successfully downloaded and recorded ' + newKey)
                                }).catch(debug)
                            }).catch((err) => {
                                debug(err)
                            })
                        }
                    }
                }
            }).catch(debug)
        }).catch(debug)
    }

    private _handleNewContent(request: IAORouterRequest) {
        const requestData: AOP2P_New_Content_Data = request.data
        let allInserts = []

        //Content Signature/Meta Data
        const contentRegistrationKey = this.dbPrefix + requestData.contentType + '/' + requestData.ethAddress + '/' + requestData.datKey
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/signature', requestData.signature))
        allInserts.push(this.hyperdb.insert(contentRegistrationKey + '/metaData', requestData.metaData))

        //IndexData
        const registrationData = requestData.ethAddress + '/' + requestData.datKey + '/indexData'
        const selfRegistrationPrefix = requestData.ethAddress + '/' + this.dbPrefix + requestData.contentType + '/nodes/'
        const appRegistrationPrefix = this.dbPrefix + requestData.contentType + '/' + requestData.datKey + '/nodes/'
        allInserts.push( this.hyperdb.insert(selfRegistrationPrefix + registrationData, requestData.indexData) )
        allInserts.push( this.hyperdb.insert(appRegistrationPrefix + registrationData, requestData.indexData) )


        //On/Off/Signatures
        allInserts.push(this.hyperdb.insert(selfRegistrationPrefix + registrationData + '/on/signature', requestData.signature))
        allInserts.push(this.hyperdb.insert(appRegistrationPrefix + registrationData + '/on/signature', requestData.signature))

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
        const {key, ethAddress}: AOP2P_Watch_AND_Get_IndexData_Data = request.data
        this.hyperdb.watch(key).then(() => {
            this.hyperdb.query(key).then((indexData) => {
                    if(!indexData[ethAddress]) {
                        //Self call if there isn't a record for our own indexData
                        setTimeout(() => {
                            this._handleWatchAndGetIndexData(request)
                        }, 1000);
                    } else {
                        let indexDataRow: AOP2P_IndexDataRow = indexData[ethAddress]
                        request.respond({indexDataRow: indexDataRow})
                    }
            }).catch(request.reject)
        }).catch( request.reject )
    }

    private _handleAddDiscovery(request:IAORouterRequest) {
        const {contentType, fileDatKey, ethAddress, metaDatKey}: AOP2P_Add_Discovery_Data = request.data
        const appRegistrationPrefix = this.dbPrefix + contentType + '/' + metaDatKey + '/nodes/'
        const registrationData = ethAddress  + '/' + fileDatKey + '/indexData'
        this.hyperdb.insert(appRegistrationPrefix + registrationData, {} )
        .then(() => {
            request.respond({success:true})
        })
        .catch(e => {
            request.reject(e)
        })
    }

    private _handleSellDecryptionKey(request: IAORouterRequest) {
        const { contentId, ethAddress, privateKey, publicKey }: AOP2P_Write_Decryption_Key_Data = request.data

        // 1. Get the content for this piece being sold
        const userContentQuery: AODB_UserContentGet_Data = {
            query: { id: contentId }
        }
        this.router.send('/db/user/content/get', userContentQuery).then((contentGetResponse: IAORouterMessage) => {
            const content = contentGetResponse.data ? contentGetResponse.data[0] : undefined
            if (!content) {
                return request.reject(new Error('No content returned'))
            }
            // 2. Let's get the current indexData for this
            const contentPrefixRoute = this.dbPrefix  + content.contentType + '/' + content.metadataDatKey + '/nodes/' 
            const indexDataRoute =  request.ethAddress + '/' + content.fileDatKey + '/indexData';
            this.hyperdb.query(contentPrefixRoute + indexDataRoute).then((indexData)=> {
                this.addIndexData({
                    indexData: indexData,
                    ethAddress: ethAddress, //buyer's address
                    publicKey: publicKey,   //buyer's public key 
                    privateKey: privateKey, //your privatekey as the seller
                    decryptionKey: content.decryptionKey
                }).then((newIndexData) => {
                    // 3. Let's write this thing into hyperdb
                    this.hyperdb.insert(contentPrefixRoute + indexDataRoute, newIndexData).then(() => {
                        request.respond({ success: true })
                    }).catch(request.reject)
                }).catch(request.reject)
            }).catch(request.reject)
        })
    }

    private addIndexData(indexDataRequest: AddIndexDataInterface) {
        return new Promise( async (resolve, reject) => {
            const { indexData, ethAddress, privateKey, publicKey, decryptionKey } = indexDataRequest

            // 1. Sign the hash of the decryption key using this node's private key
            const messageHash = EthCrypto.hash.keccak256(decryptionKey)
            const signature = EthCrypto.sign(privateKey, messageHash)
            
            // 2. Encrypt the decryption key using their public key
            let encryptedObject: object = {}
            try {
                encryptedObject = await EthCrypto.encryptWithPublicKey(publicKey, decryptionKey)
            } catch(e) {
                return reject(e)
            }
            const encryptedDecryptionKey:string = EthCrypto.cipher.stringify(encryptedObject)

            // 3. Add/overwrite the record for specific ethaddress and resolve the result
            indexData[ethAddress] = {
                decryptKey: encryptedDecryptionKey, // Encrypted key with publicKey
                signature: signature //
            }
            resolve(indexData)
        })
    }


} 