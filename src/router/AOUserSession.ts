import { AORouterInterface, IAORouterRequest } from "./AORouterInterface";
import { IAOFS_Mkdir_Data } from "../modules/fs/fs";
import path from 'path';
import { IAORouterMessage } from "./AORouter";
import AOContent, { AOContentState } from "../models/AOContent";
import { BuyContentEvent } from "../modules/eth/eth";
import { AODB_UserContentGet_Data, AODB_UserContentUpdate_Data, AODB_UserInsert_Data } from "../modules/db/db";
import EthCrypto from 'eth-crypto';
import Debug from 'Debug';
import { AOP2P_Write_Decryption_Key_Data, AOP2P_Watch_AND_Get_IndexData_Data } from "../modules/p2p/p2p";
const debug = Debug('ao:userSession');


export interface Identity {
    privateKey: string;
    publicKey: string;
    address: string;
}

export default class AOUserSession {
    private router: AORouterInterface;

    public ethAddress: string;
    private isListeningForIncomingContent: boolean = false;
    private identity: Identity;

    constructor(router: AORouterInterface) {
        this.router = router;
    }

    public register(ethAddress: string): Promise<{ethAddress: string}> {
        return new Promise((resolve, reject) => {
            if ( this.ethAddress === ethAddress ) {
                return resolve({ethAddress})
            }
            this.ethAddress = ethAddress;
            // 1. Make sure user db has been setup for this user
            this.router.send('/db/user/init', {ethAddress}).then(() => {
                // 2. Make sure directories exist
                const fsMakeContentDirData: IAOFS_Mkdir_Data = {
                    dirPath: 'content'
                }
                const fsMakeEthDirData: IAOFS_Mkdir_Data = {
                    dirPath: path.join('users', ethAddress)
                }
                const mkdirPromises: Array<Promise<any>> = [
                    this.router.send('/fs/mkdir', fsMakeContentDirData),
                    this.router.send('/fs/mkdir', fsMakeEthDirData)
                ]
                Promise.all(mkdirPromises).then(() => {
                    this.router.send('/core/log', {message: `[AO Core] Registered as user ${ethAddress}`})
                    // 3. Pull user identity
                    this.router.send('/db/user/getIdentity').then((response: IAORouterMessage) => {
                        if ( !response.data || !response.data.identity ) {
                            // 4A. Create user identity
                            const identity: Identity = EthCrypto.createIdentity()
                            this.identity = identity
                            const storeIdentityData: AODB_UserInsert_Data = {
                                object: {
                                    id: 'identity',
                                    ...identity
                                }
                            }
                            this.router.send('/db/user/insert', storeIdentityData).then((response: IAORouterMessage) => {
                                // 5. Listeners that make this app work                                
                                resolve({ethAddress})
                                this._processExistingUserContent()
                                this._beginListeningForIncomingPurchases()
                            }).catch(reject)
                        } else {
                            // 4B: User identity already exists     
                            this.identity = response.data.identity                       
                            // 5. Listeners that make this app work
                            resolve({ethAddress})
                            this._processExistingUserContent()
                            this._beginListeningForIncomingPurchases()
                        }
                    }).catch(reject)
                }).catch(reject)
            }).catch(reject)
        })
    }

    /**
     * Pull all existing user content, and setup one of the following:
     *  A. If content is purchased and we are waiting decryption key, begin
     *      listening for decryption key on discovery.
     *  B. If content is succesfully hosted (uploaded/re-hosted) start listener
     *      for BuyContent events on ethereum network.
     */
    private _processExistingUserContent() {
        this.router.send('/db/user/content/get').then((response: IAORouterMessage) => {
            const userContent = response.data
            userContent.forEach(contentJson => {
                const content: AOContent = AOContent.fromObject(contentJson)
                if ( content.state === AOContentState.PURCHASED ) {
                    // A. Content has been purchased, but have yet to receive the Decryption key
                    this._listenForContentDecryptionKey( content )
                } else if ( content.isDiscoverable() ) {
                    // B. Content has been hosted and is discoverable, listen for purchases
                    this.listenForBuyContentEventsOnDiscoverableContent( content )
                }
            });
        })
    }

    /**
     * Starts listening for BuyContent events on the ethereum network. Not 100% clear, 
     * but these events come in on `/core/content/incomingPurchase` in _beginListeningForIncomingPurchases.
     * 
     * @param {AOContent} content
     */
    public listenForBuyContentEventsOnDiscoverableContent(content: AOContent) {
        this.router.send('/eth/content/BuyContent/subscribe', {contentHostId: content.contentHostId})
    }

    private _beginListeningForIncomingPurchases() {
        if ( this.isListeningForIncomingContent )
        return debug(`Already listening for incoming content purchases`)
        this.isListeningForIncomingContent = true
        this.router.on('/core/content/incomingPurchase', (message: IAORouterRequest) => {
            const buyContentEvent: BuyContentEvent = message.data
            this._handleIncomingContentPurchase( buyContentEvent )
        })
    }

    /**
     * Someone purchased a piece of content that is hosted by this user. We need to 
     * generate the content decryption key with information from that purchase event
     * and pass that key off via p2p/hyperdb.
     * 
     * @param {BuyContentEvent} buyContentEvent
     */
    private _handleIncomingContentPurchase( buyContentEvent: BuyContentEvent ) {
        // 1. Get the corresponding content entry in user db
        const contentQuery: AODB_UserContentGet_Data = {
            query: { contentHostId: buyContentEvent.contentHostId }
        }
        this.router.send('/db/user/content/get', contentQuery).then((response: IAORouterMessage) => {
            if ( !response.data || response.data.length !== 1 ) {
                debug(`Attempt to handle incoming purchase but did not find matching content in user db:`, buyContentEvent)
                return;
            }
            const userContent: AOContent = AOContent.fromObject(response.data[0])
            // 2. TODO: check to see if we have already handled this purchase transaction 
            // (ie: wrote decryption key to discovery already)

            // 3. TODO: generate the encryption key according to spec
            const sendDecryptionKeyMessage: AOP2P_Write_Decryption_Key_Data = {
                ethAddress: this.ethAddress,
                contentId: userContent.id,
                publicKey: this.identity.publicKey,
            }
            this.router.send('/p2p/soldKey', sendDecryptionKeyMessage).then((response: IAORouterMessage) => {
                if ( response.data && response.data.success ) {
                    debug(`Succesfully handled content purchase with: contentHostId[${buyContentEvent.contentHostId}], purchaseId[${buyContentEvent.purchaseId}]`)
                } else {
                    debug(`Failed to handle content purhcase, writing to discovery resolved without success`)
                }
            }).catch(error => {
                debug(`Failed to handle content purhcase`, error)
            })
        })
    }

    /**
     * User has purchased this piece of content, begin listening for the decryption
     * key to come in through p2p module.
     * 
     * @param {AOContent} content
     */
    private _listenForContentDecryptionKey(content: AOContent) {
        const p2pWatchKeyRequest: AOP2P_Watch_AND_Get_IndexData_Data = {
            key: '/AOSpace/VOD/' + content.metadataDatKey + '/nodes/' + content.creatorId + '/' + content.fileDatKey + '/indexData',
            ethAddress: this.ethAddress
        }
        this.router.send('/p2p/watchAndGetIndexData', p2pWatchKeyRequest).then((response: IAORouterMessage) => {
            if ( response.data ) {
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            "state": 'DECRYPTION_KEY_RECEIVED',
                            "encryptedKey": response.data.decryptKey //indexData is put against the buyer's ethaddress
                        }
                    }
                }
                this.router.send('/db/user/content/update', contentUpdateQuery).then((purchasedUpdateResponse: IAORouterMessage) => {
                    debug(`Succesfully received decryption key for purchased content with id[${content.id}]`)
                }).catch(debug)
            } else {
                debug(`Error listening for decryption key, no index data returned`)
            }
        }).catch(debug)
    }

}