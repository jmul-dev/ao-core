import Debug from 'debug';
import path, { resolve } from 'path';
import AOContent, { AOContentState } from "./models/AOContent";
import { AODat_Create_Data, AODat_ResumeSingle_Data, AODat_Encrypted_Download_Data, DatStats, AODat_GetDatStats_Data } from './modules/dat/dat';
import { AODB_UserContentGet_Data, AODB_UserContentUpdate_Data, AODB_UserInsert_Data, AODB_NetworkContentUpdate_Data } from "./modules/db/db";
import { BuyContentEvent, HostContentEvent, IAOEth_BuyContentEvent_Data } from "./modules/eth/eth";
import { IAOFS_DecryptCheck_Data, IAOFS_Mkdir_Data, IAOFS_Move_Data, IAOFS_Reencrypt_Data, IAOFS_Unlink_Data } from "./modules/fs/fs";
import { AOP2P_Add_Discovery_Data, AOP2P_IndexDataRow, AOP2P_Watch_AND_Get_IndexData_Data, AOP2P_Write_Decryption_Key_Data, AOP2P_Get_File_Node_Data } from "./modules/p2p/p2p";
import { IAORouterMessage } from "./router/AORouter";
import { AORouterInterface, IAORouterRequest } from "./router/AORouterInterface";
import * as AOCrypto from './AOCrypto'
const debug = Debug('ao:userSession');


export interface IAOUser_Signature_Data {
    message: string;
    privateKey?: string;
}

export default class AOUserSession {
    private router: AORouterInterface;

    public ethAddress: string;

    private isListeningForIncomingContent: boolean = false;
    private identity: AOCrypto.Identity;

    constructor(router: AORouterInterface) {
        this.router = router;
    }

    public get id() {
        return this.identity ? this.identity.address : null
    }

    public get publicKey() {
        return this.identity ? this.identity.publicKey : null
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
                            const identity: AOCrypto.Identity = AOCrypto.createUserIdentity()
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
            case AOContentState.HOST_DISCOVERY:
                this._handleContentHostDiscovery(content)
                break;
            case AOContentState.DOWNLOADING:
                this._handleContentDownloading(content)
                break;
            case AOContentState.DOWNLOADED:
                // Pending user purchase tx
                break;
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
            case AOContentState.VERIFIED:
                this._handleContentVerified(content)
                break;
            case AOContentState.VERIFICATION_FAILED:
                // TODO: cleanup? stay quite?
                break;
            case AOContentState.ENCRYPTED:
                this._handleContentEncrypted(content)
                break;
            case AOContentState.DAT_INITIALIZED:
                // This state is pending user stake/becomeHost
                break;
            case AOContentState.STAKING:
                this._listenForContentStakingReceipt(content)
                break;
            case AOContentState.STAKED:
                this._handleContentStaked(content)
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
        this.router.send('/db/user/content/get', contentQuery).then(async (response: IAORouterMessage) => {
            if (!response.data || response.data.length !== 1) {
                debug(`Attempt to handle incoming purchase but did not find matching content in user db:`, buyContentEvent)
                return;
            }
            const userContent: AOContent = AOContent.fromObject(response.data[0])
            // 2. TODO: check to see if we have already handled this purchase transaction 
            // (ie: wrote decryption key to discovery already)

            // 3. Generate the encryption key according to spec
            const contentDecryptParams = {
                contentDecryptionKey: userContent.decryptionKey,
                contentRequesterPublicKey: buyContentEvent.publicKey,
                contentOwnersPrivateKey: this.identity.privateKey,
            }
            const { encryptedDecryptionKey, encryptedDecryptionKeySignature } = await AOCrypto.generateContentEncryptionKeyForUser(contentDecryptParams)

            // 4. Handoff to discovery
            const sendDecryptionKeyMessage: AOP2P_Write_Decryption_Key_Data = {
                content: userContent,
                buyerEthAddress: buyContentEvent.buyer,
                encryptedDecryptionKey,
                encryptedKeySignature: encryptedDecryptionKeySignature
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
     * User has initiated a content request action, meaning we need to bring
     * the content into the node before proceeding with purchase process.
     * 
     * content.state ==== HOST_DISCOVERY
     * 
     * @param {AOContent} content
     */
    private _handleContentHostDiscovery(content: AOContent) {
        // 1. Grab all nodes/contentHostId's for this piece of content
        const findEncryptedNodeData: AOP2P_Get_File_Node_Data = { content }
        this.router.send('/p2p/findEncryptedNode', findEncryptedNodeData).then((fileNodesResponse: IAORouterMessage) => {
            const resultNodes = fileNodesResponse.data
            const nodes = {}
            resultNodes.map((a) => {
                let datKey = a.splitKey[1]
                nodes[datKey] = a.value.contentHostId //<-- datkey to contentHostId
            })
            // 2. Attempt to download the content from ONE of the nodes above (we may not even find someone who is hosting this content)
            const encryptedDownloadData: AODat_Encrypted_Download_Data = { nodes }
            this.router.send('/dat/encryptedFileDownload', encryptedDownloadData).then((downloadResponse: IAORouterMessage) => {
                // 3a. Content has started downloading from a host!
                let userContentUpdate: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        state: downloadResponse.data.datEntry.complete ? AOContentState.DOWNLOADED : AOContentState.DOWNLOADING,
                        contentHostId: downloadResponse.data.contentHostId,
                        fileDatKey: downloadResponse.data.datEntry.key
                    }
                }
                this.router.send('/db/user/content/update', userContentUpdate).then((userContentUpdateResponse: IAORouterMessage) => {
                    let updatedContent = AOContent.fromObject(userContentUpdateResponse.data)
                    this.processContent(updatedContent)
                }).catch(error => {
                    debug(`Error updating user content: ${error.message}`)
                })
            }).catch(error => {
                // 3b. We were unable to download the content from any host (likely that all hosted dats were not reachable)
                let userContentUpdate: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        state: AOContentState.HOST_DISCOVERY_FAILED
                    }
                }
                this.router.send('/db/user/content/update', userContentUpdate).then((userContentUpdateResponse: IAORouterMessage) => {
                    let updatedContent = AOContent.fromObject(userContentUpdateResponse.data)
                    this.processContent(updatedContent)
                }).catch(error => {
                    debug(`Error updating user content: ${error.message}`)
                })
            })
        }).catch(error => {
            debug(`Error while trying to pull content hosts from p2p: ${error.message}`)
            let userContentUpdate: AODB_UserContentUpdate_Data = {
                id: content.id,
                update: {
                    state: AOContentState.HOST_DISCOVERY_FAILED
                }
            }
            this.router.send('/db/user/content/update', userContentUpdate).then((userContentUpdateResponse: IAORouterMessage) => {
                let updatedContent = AOContent.fromObject(userContentUpdateResponse.data)
                this.processContent(updatedContent)
            }).catch(error => {
                debug(`Error updating user content: ${error.message}`)
            })
        })
    }

    /**
     * Content is currently downloading (via dat). Ping dat until content is completely downloaded.
     * 
     * content.state ==== DOWNLOADING
     * 
     * @param {AOContent} content
     */
    private _handleContentDownloading(content: AOContent) {
        setTimeout(() => {
            const datStatsParams: AODat_GetDatStats_Data = { key: content.fileDatKey }
            this.router.send('/dat/stats', datStatsParams).then((response: IAORouterMessage) => {
                const datStats: DatStats = response.data
                if ( datStats.complete ) {
                    let userContentUpdate: AODB_UserContentUpdate_Data = {
                        id: content.id,
                        update: {
                            state: AOContentState.DOWNLOADED
                        }
                    }
                    this.router.send('/db/user/content/update', userContentUpdate).then((userContentUpdateResponse: IAORouterMessage) => {
                        let updatedContent = AOContent.fromObject(userContentUpdateResponse.data)
                        this.processContent(updatedContent)
                    }).catch(error => {
                        debug(`Error updating user content: ${error.message}`)
                    })
                } else {
                    this.processContent(content)
                }
            })
        }, 1500)
    }

    /**
     * User has submitted a purchase transaction but we do not yet know if that
     * tx has been accepted by the network. This method listens for that result.
     * 
     * content.state ==== PURCHASING
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
     * User has purchased this piece of content, begin listening for the decryption
     * key to come in through p2p module.
     * 
     * content.state === PURCHASED
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
            const indexData: AOP2P_IndexDataRow = response.data
            if (indexData) {
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            "state": AOContentState.DECRYPTION_KEY_RECEIVED,
                            "receivedIndexData": indexData
                        }
                    }
                }
                this.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
                    debug(`Succesfully received decryption key for purchased content with id[${content.id}]`)
                    const updatedContent: AOContent = AOContent.fromObject(contentUpdateResponse.data)
                    this.processContent(updatedContent)
                }).catch(debug)
            } else {
                debug(`Error listening for decryption key, no index data returned`)
            }
        }).catch(debug)
    }

    /**
     * We have received an _encrypted_ decryption key from the p2p layer. This step in the process
     * involves decrypting the key and then verifying the contents of the file.
     * 
     * content.state === DECRYPTION_KEY_RECEIVED
     * 
     * @param {AOContent} content
     */
    private _handleContentDecryptionKeyReceived(content: AOContent) {
        if (!content.receivedIndexData) {
            debug(`Warning: calling _handleContentDecryptionKeyReceived without receivedIndexData from p2p/hyperdb`)
            return null
        }
        // 1. Decrypt the decryption key that we received from seller
        AOCrypto.decryptMessage({message: content.receivedIndexData.decryptionKey, privateKey: this.identity.privateKey}).then((decryptionKey: string) => {
            // 2. Decrypt/ffprobe/Checksum the downloaded file and match against the content data.
            const decryptChecksumData: IAOFS_DecryptCheck_Data = {
                path: content.getFilePath(),
                decryptionKey: decryptionKey
            }
            this.router.send('/fs/decryptChecksum', decryptChecksumData).then((decryptChecksumResponse: IAORouterMessage) => {
                // 3. Check that the decrypted file's checksum actually matches the original content checksum                
                let checksum = decryptChecksumResponse.data[0].checksum
                let nextContentState = AOContentState.VERIFIED
                if (checksum != content.fileChecksum) {
                    nextContentState = AOContentState.VERIFICATION_FAILED
                    debug(`Checksum of decrypted file does not match the purchased content's checksum`)
                }
                // 4. Update the content with verification state
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            "state": nextContentState
                        }
                    }
                }
                this.router.send('/db/user/content/update', contentUpdateQuery).then((contentVerifiedResponse: IAORouterMessage) => {
                    let updatedContent: AOContent = AOContent.fromObject(contentVerifiedResponse.data)
                    // Handoff to next handler
                    this.processContent(updatedContent)
                }).catch(debug)
            }).catch(debug)
        }).catch(error => {
            debug(`Error attempting to decrypt content encryption key: ${error.message}`)
        })
    }

    /**
     * Content has been verified, now it is time to re-host that content.
     * 
     * content.state === VERIFIED
     * 
     * @param {AOContent} content
     */
    private _handleContentVerified(content: AOContent) {
        // 1. Get the decryption key again
        AOCrypto.decryptMessage({message: content.receivedIndexData.decryptionKey, privateKey: this.identity.privateKey}).then((decryptionKey: string) => {
            // 2. New directory for data to be re-encrypted (tmp path)
            const tmpContentPath: IAOFS_Mkdir_Data = {
                dirPath: content.getTempFolderPath()
            }
            this.router.send('/fs/mkdir', tmpContentPath).then(() => {
                const cleanupTmpContent = () => {
                    let removePathData: IAOFS_Unlink_Data = {
                        removePath: tmpContentPath.dirPath
                    }
                    this.router.send('/fs/unlink', removePathData)
                }
                // 3. Reencrypt original encrypted file into the new dir
                const fileReencrypt: IAOFS_Reencrypt_Data = {
                    originalPath: content.getFilePath(),
                    decryptionKey: decryptionKey,
                    finalPath: path.join(content.getTempFolderPath(), content.fileName)
                }
                this.router.send('/fs/reencrypt', fileReencrypt).then((reencryptionResponse: IAORouterMessage) => {
                    let newDecrytionKey = reencryptionResponse.data.newKey
                    let newEncryptedChecksum = reencryptionResponse.data.encryptedChecksum
                    if (!newDecrytionKey) {
                        debug('Error re-encrypting file: No new decryption key')
                        cleanupTmpContent()
                        return null;
                    }
                    if (!content.baseChallenge) {
                        // Sanity check
                        debug(`Attempting to sign the baseChallenge for content, baseChallenge does not exist!`)
                        cleanupTmpContent()
                        return null;
                    }
                    // 4. Generate the baseChallengeSignature & new encChallenge
                    // 5. Update Content State to Encrypted
                    let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                        id: content.id,
                        update: {
                            $set: {
                                "state": AOContentState.ENCRYPTED,
                                "decryptionKey": newDecrytionKey,
                                "encChallenge": AOCrypto.generateContentEncChallenge({encryptedFileChecksum: newEncryptedChecksum}),
                                "baseChallengeSignature": AOCrypto.generateBaseChallengeSignature({baseChallenge: content.baseChallenge, privateKey: this.identity.privateKey}),
                            }
                        }
                    }
                    this.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
                        const updatedContent: AOContent = AOContent.fromObject(contentUpdateResponse.data)
                        // Handoff to next state handler
                        this.processContent(updatedContent)
                    }).catch(debug) // Content State update to Encrypted
                }).catch((error: Error) => {
                    debug(`Error re-encrypting file: ${error.message}`)
                    cleanupTmpContent()
                }) // Reencryption/copy
            }).catch(debug) // MakeDir for new dat
        }).catch(debug)  // Decrypt-decryptionKey
    }

    /**
     * Content has been re-encrypted and is ready to be re-hosted. This mostly involves
     * creating a new Dat instance for the newly encrypted content.
     * 
     * content.state === ENCRYPTED
     * 
     * @param {AOContent} content 
     */
    private _handleContentEncrypted(content: AOContent) {
        // 1. Initialize the new Dat within our temp folder created during encryption process
        const createDatData: AODat_Create_Data = {
            newDatDir: content.getTempFolderPath()
        }
        this.router.send('/dat/create', createDatData).then((datCreateResponse: IAORouterMessage) => {
            let newDatKey = datCreateResponse.data.key
            // 2. Move Dat to its final location within content directory
            const moveNewDatData: IAOFS_Move_Data = {
                srcPath: content.getTempFolderPath(),
                destPath: path.join('content', newDatKey)
            }
            this.router.send('/fs/move', moveNewDatData).then(() => {
                // 3. Resume the Dat (start hosting)
                const resumeDatData: AODat_ResumeSingle_Data = {
                    key: newDatKey
                }
                this.router.send('/dat/resumeSingle', resumeDatData)
                // 4. Store the newDatKey
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            "state": AOContentState.DAT_INITIALIZED,
                            "fileDatKey": newDatKey
                        }
                    }
                }
                this.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
                    const updatedContent: AOContent = AOContent.fromObject(contentUpdateResponse.data)
                    // Handoff to next state handler
                    this.processContent(updatedContent)
                }).catch(debug)
            }).catch(debug) // Move Dat Dir
        }).catch((error: Error) => {
            debug(`Error creating Dat: ${error.message}`)
            let removePathData: IAOFS_Unlink_Data = {
                removePath: path.join(content.getTempFolderPath(), '.dat')
            }
            this.router.send('/fs/unlink', removePathData).catch(debug)
        }) // Dat Creation
    }

    /**
     * Listen for the staking receipt. We need to differentiate between stakeContent (user upload)
     * and becomeHost (user purchase).
     * 
     * content.state ==== STAKING
     * 
     * @param {AOContent} content
     */
    private _listenForContentStakingReceipt(content: AOContent) {
        if (!content.transactions || (!content.transactions.stakeTx && !content.transactions.hostTx)) {
            debug(`Warning: calling _listenForContentStakingReceipt without a stakeTx or hostTx`)
            return null
        }
        let transactionHash = content.transactions.stakeTx || content.transactions.hostTx
        const isStake = transactionHash === content.transactions.stakeTx
        let txEventRoute = isStake ? '/eth/tx/StakeContent' : '/eth/tx/HostContent'
        // 1. Listen for tx status
        this.router.send(txEventRoute, { transactionHash }).then((response: IAORouterMessage) => {
            let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                id: content.id,
                update: {}
            }
            // 2. Update the Content State based on status
            if (response.data.status) {
                // 2a. Stake succesfull
                const hostContentEvent: HostContentEvent = response.data.hostContentEvent
                contentUpdateQuery.update = {
                    $set: {
                        "state": AOContentState.STAKED,
                        "contentHostId": hostContentEvent.contentHostId,
                        "stakeId": hostContentEvent.stakeId,
                    }
                }
            } else {
                // 2b. Failed to stake! Roll back to previous state
                contentUpdateQuery.update = {
                    $set: {
                        "state": AOContentState.DAT_INITIALIZED,
                    }
                }
            }
            this.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
                const updatedContent: AOContent = AOContent.fromObject(contentUpdateResponse.data)
                // Handoff to next state handler
                this.processContent(updatedContent)
            }).catch(debug)
        }).catch(error => {
            debug(error)
            // NOTE: failed to get tx status. I dont think it makes sense to roll content state
            // back (as the tx could still be vaild). For now let's just leave in limbo, but might
            // want to check again.
        })
    }

    /**
     * Content is ready to be broadcasted to discovery
     * 
     * content.state === STAKED
     * 
     * @param {AOContent} content 
     */
    private _handleContentStaked(content: AOContent) {
        // 1. Add new discovery
        const p2pAddDiscoveryData: AOP2P_Add_Discovery_Data = {
            contentType: content.contentType,
            fileDatKey: content.fileDatKey,
            metaDatKey: content.metadataDatKey,
            ethAddress: this.ethAddress, // Current user's ethAddress
            contentHostId: content.contentHostId
        }
        this.router.send('/p2p/addDiscovery', p2pAddDiscoveryData).then((response: IAORouterMessage) => {
            if (response.data.success) {
                // 2. Ensure the dats are resumed (they may already be, but need to make sure)
                const fileResumeDatData:AODat_ResumeSingle_Data = {
                    key: p2pAddDiscoveryData.fileDatKey
                }
                const metaResumeDatData:AODat_ResumeSingle_Data = {
                    key: p2pAddDiscoveryData.metaDatKey
                }
                let resumeDats = []
                resumeDats.push( this.router.send('/dat/resumeSingle', fileResumeDatData) )
                resumeDats.push( this.router.send('/dat/resumeSingle', metaResumeDatData) )
                Promise.all(resumeDats).then(() => {
                    // 4. Update the content state (mark as Discoverable)
                    const contentUpdateQuery: AODB_UserContentUpdate_Data = {
                        id: content.id,
                        update: {
                            $set: {
                                "state": AOContentState.DISCOVERABLE
                            }
                        }
                    }
                    this.router.send('/db/user/content/update', contentUpdateQuery).then((contentUpdateResponse: IAORouterMessage) => {
                        const updatedContent: AOContent = AOContent.fromObject(contentUpdateResponse.data)
                        // Handoff to next state handler
                        this.processContent(updatedContent)
                    }).catch(debug)
                }).catch(debug)
            } else {
                debug(`Error, failed to add content to discovery`)
            }
        }).catch(debug)
    }
}