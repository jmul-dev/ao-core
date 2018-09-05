import Debug from 'debug';
import EthCrypto from 'eth-crypto';
import path from 'path';
import AOContent, { AOContentState } from "../models/AOContent";
import { AODB_UserContentGet_Data, AODB_UserContentUpdate_Data, AODB_UserInsert_Data } from "../modules/db/db";
import { BuyContentEvent, IAOEth_BuyContentEvent_Data } from "../modules/eth/eth";
import { IAOFS_Mkdir_Data } from "../modules/fs/fs";
import { AOP2P_Watch_AND_Get_IndexData_Data, AOP2P_Write_Decryption_Key_Data } from "../modules/p2p/p2p";
import { IAORouterMessage } from "./AORouter";
import { AORouterInterface, IAORouterRequest } from "./AORouterInterface";
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

    public register(ethAddress: string): Promise<{ ethAddress: string }> {
        return new Promise((resolve, reject) => {
            if (this.ethAddress === ethAddress) {
                return resolve({ ethAddress })
            }
            this.ethAddress = ethAddress;
            // 1. Make sure user db has been setup for this user
            this.router.send('/db/user/init', { ethAddress }).then(() => {
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
                    this.router.send('/core/log', { message: `[AO Core] Registered as user ${ethAddress}` })
                    // 3. Pull user identity
                    this.router.send('/db/user/getIdentity').then((response: IAORouterMessage) => {
                        if (!response.data || !response.data.identity) {
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
                                debug(`User identity generated, public key: ${identity.publicKey}`)
                                resolve({ ethAddress })
                                this._resume()
                            }).catch(reject)
                        } else {
                            // 4B: User identity already exists     
                            this.identity = response.data.identity
                            // 5. Listeners that make this app work
                            resolve({ ethAddress })
                            this._resume()
                        }
                    }).catch(reject)
                }).catch(reject)
            }).catch(reject)
        })
    }

    /**
     * Resume, picks up where the user left off. Handles content in any state.
     */
    private _resume() {
        // Content resume
        this.router.send('/db/user/content/get').then((response: IAORouterMessage) => {
            const userContent = response.data
            userContent.forEach(contentJson => {
                const content: AOContent = AOContent.fromObject(contentJson)
                this.processContent(content)
            });
        })
        // Incoming content resume
        if (this.isListeningForIncomingContent)
            return debug(`Already listening for incoming content purchases`)
        this.isListeningForIncomingContent = true
        this.router.on('/core/content/incomingPurchase', (message: IAORouterRequest) => {
            const buyContentEvent: BuyContentEvent = message.data
            this._handleIncomingContentPurchase(buyContentEvent)
        })
    }

    /**
     * This method acts as a state machine and attempts to move a piece of content
     * along throughout the purchase & staking process.
     * 
     * @param {AOContent} content 
     */
    public processContent(content: AOContent) {
        switch (content.state) {
            case AOContentState.PURCHASING:
                this._listenForContentPurchaseReceipt(content)
                break;
            case AOContentState.PURCHASED:
                // Content has been purchased, but have yet to receive the Decryption key
                this._listenForContentDecryptionKey(content)
                break;
            case AOContentState.DECRYPTION_KEY_RECEIVED:
                this._handleContentDecryptionKeyReceived(content)
                break;
            case AOContentState.DISCOVERABLE:
                // Content has been hosted and is discoverable, listen for purchases
                this._listenForBuyContentEventsOnDiscoverableContent(content)
            default:
                break;
        }
    }

    /**
     * Starts listening for BuyContent events on the ethereum network. Not 100% clear, 
     * but these events come in on `/core/content/incomingPurchase` in _resume.
     * 
     * @param {AOContent} content
     */
    private _listenForBuyContentEventsOnDiscoverableContent(content: AOContent) {
        this.router.send('/eth/content/BuyContent/subscribe', { contentHostId: content.contentHostId })
    }

    /**
     * Someone purchased a piece of content that is hosted by this user. We need to 
     * generate the content decryption key with information from that purchase event
     * and pass that key off via p2p/hyperdb.
     * 
     * @param {BuyContentEvent} buyContentEvent
     */
    private _handleIncomingContentPurchase(buyContentEvent: BuyContentEvent) {
        // 1. Get the corresponding content entry in user db
        const contentQuery: AODB_UserContentGet_Data = {
            query: { contentHostId: buyContentEvent.contentHostId }
        }
        this.router.send('/db/user/content/get', contentQuery).then((response: IAORouterMessage) => {
            if (!response.data || response.data.length !== 1) {
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
                if (response.data && response.data.success) {
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
        if (content.state !== AOContentState.PURCHASED) {
            debug(`Warning: _listenForContentDecryptionKey called with content state = ${content.state}, expected PURCHASED`)
            return null
        }
        const p2pWatchKeyRequest: AOP2P_Watch_AND_Get_IndexData_Data = {
            key: '/AOSpace/VOD/' + content.metadataDatKey + '/nodes/' + content.creatorId + '/' + content.fileDatKey + '/indexData',
            ethAddress: this.ethAddress
        }
        this.router.send('/p2p/watchAndGetIndexData', p2pWatchKeyRequest).then((response: IAORouterMessage) => {
            if (response.data) {
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            "state": AOContentState.DECRYPTION_KEY_RECEIVED,
                            "encryptedKey": response.data.decryptKey //indexData is put against the buyer's ethaddress
                        }
                    }
                }
                this.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
                    debug(`Succesfully received decryption key for purchased content with id[${content.id}]`)
                    const updatedContent: AOContent = AOContent.fromObject( contentUpdateResponse.data )
                    this.processContent( updatedContent )                    
                }).catch(debug)
            } else {
                debug(`Error listening for decryption key, no index data returned`)
            }
        }).catch(debug)
    }

    /**
     * User has submitted a purchase transaction but we do not yet know if that
     * tx has been accepted by the network. This method listens for that result.
     * 
     * @param {AOContent} content
     */
    private _listenForContentPurchaseReceipt(content: AOContent) {
        if (!content.transactions || !content.transactions.purchaseTx) {
            debug(`Warning: calling _listenForContentPurchaseReceipt without a purchaseTx`)
            return null
        }
        let buyContentEventArgs: IAOEth_BuyContentEvent_Data = {
            transactionHash: content.transactions.purchaseTx
        }
        this.router.send('/eth/tx/BuyContent', buyContentEventArgs).then((response: IAORouterMessage) => {
            const { status } = response.data
            const event: BuyContentEvent = response.data.event
            let contentUpdateAfterTx: AODB_UserContentUpdate_Data = {
                id: content.id,
                update: {}
            }
            if (status && event) {
                // Succesful transaction
                contentUpdateAfterTx.update = {
                    $set: {
                        "state": AOContentState.PURCHASED,
                        "purchaseId": event.purchaseId,
                        "nodeId": event.contentHostId,
                    }
                }
            } else {
                // Transaction failed :(, go back to previous state
                contentUpdateAfterTx.update = {
                    $set: {
                        "state": AOContentState.DOWNLOADED,
                        "transactions.purchaseTx": null,
                    }
                }
            }
            this.router.send('/db/user/content/update', contentUpdateAfterTx).then((response: IAORouterMessage) => {
                let updatedContent: AOContent = AOContent.fromObject(response.data)
                if (updatedContent.state === AOContentState.PURCHASED) {
                    // Content succesfully purchased, begin next step in process (listen for decryption key)
                    this.processContent(updatedContent)
                }
            }).catch(debug)
        }).catch(error => {
            debug(error)
            // NOTE: failed to get tx status. I dont think it makes sense to roll content state
            // back (as the tx could still be vaild). For now let's just leave in limbo, but might
            // want to check again.
        })
    }

    /**
     * We have received an _encrypted_ decryption key from the p2p layer. This step in the process
     * involves decrypting the key and then verifying the contents of the file.
     * 
     * @param {AOContent} content
     */
    private _handleContentDecryptionKeyReceived(content: AOContent) {
        if (!content.encryptedKey) {
            debug(`Warning: calling _handleContentDecryptionKeyReceived without an encryptedKey`)
            return null
        }

    }
}