import path from "path";
import { isAddress } from "web3-utils";
import * as AOCrypto from "./AOCrypto";
import Debug from "./AODebug";
import AOContent, { AOContentState, AODappContent } from "./models/AOContent";
import {
    AODat_Create_Data,
    AODat_Encrypted_Download_Data,
    AODat_GetDatStats_Data,
    AODat_ImportSingle_Data,
    AODat_ResumeSingle_Data,
    DatStats
} from "./modules/dat/dat";
import {
    AODB_NetworkContentUpdate_Data,
    AODB_UserContentGet_Data,
    AODB_UserContentUpdate_Data,
    AODB_UserInit_Data,
    AODB_UserInsert_Data
} from "./modules/db/db";
import {
    BuyContentEvent,
    HostContentEvent,
    IAOEth_BuyContentEvent_Data
} from "./modules/eth/eth";
import {
    IAOFS_DecryptCheck_Data,
    IAOFS_Mkdir_Data,
    IAOFS_Move_Data,
    IAOFS_Reencrypt_Data,
    IAOFS_Unlink_Data,
    IAOFS_UnzipFile_Data,
    IAOFS_Write_Data
} from "./modules/fs/fs";
import {
    AOP2P_Add_Discovery_Data,
    AOP2P_GetContentHosts_Data,
    AOP2P_Update_Node_Timestamp_Data,
    AOP2P_Watch_AND_Get_IndexData_Data,
    AOP2P_Write_Decryption_Key_Data,
    NetworkContentHostEntry,
    AOP2P_ContentRegistration_Data
} from "./modules/p2p/p2p";
import { ITaoDB_ContentHost_IndexData_Entry } from "./modules/p2p/TaoDB";
import { IAORouterMessage } from "./router/AORouter";
import {
    AORouterInterface,
    IAORouterRequest
} from "./router/AORouterInterface";
const AOContentHostContract = require("ao-contracts/build/contracts/AOContentHost.json");
const debug = Debug("ao:userSession");

/**
 * NOTE: there is currently a flaw in how this class is being used that can result
 * in identity crossover's between users. If, while a piece of content is being processed,
 * the there is a change in user/identity by calling register() method again, then that
 * content may finish processing with a reference to the new user identity. Ideally, a
 * new instance of this class would be instantiated on user change, but time is of the essence.
 *
 * For now I just store a scoped reference inside the processing methods. This is not a solution,
 * but at least ensures same user identity is used for the processing for any one state. In most
 * cases user action is required after a state change which helps minimize the problem.
 */
export default class AOUserSession {
    private router: AORouterInterface;
    public ethAddress: string;
    private isListeningForIncomingContent: boolean = false;
    private isSubscribedToBuyContentEvents: boolean = false;
    private usersContentDiscoveryUpdateInterval: NodeJS.Timer;
    public static CONTENT_DISCOVERY_UPDATE_INTERVAL: number = 1000 * 60 * 10; // 10 minutes
    private identity: AOCrypto.Identity;

    constructor(router: AORouterInterface) {
        this.router = router;
    }

    public get id() {
        return this.identity ? this.identity.address : null;
    }

    public get publicKey() {
        return this.identity ? this.identity.publicKey : null;
    }

    public getContentBaseChallengeSignature({
        contentChecksum
    }): Promise<string> {
        return new Promise((localResolve, localReject) => {
            this.router
                .send("/eth/network/get")
                .then((networkResponse: IAORouterMessage) => {
                    const { networkId } = networkResponse.data;
                    const contractAddress =
                        AOContentHostContract["networks"][networkId]["address"];
                    const baseChallengeHash = AOCrypto.generateContentBaseChallengeHash(
                        {
                            baseChallenge: contentChecksum,
                            contractAddress
                        }
                    );
                    const baseChallengeSignature = AOCrypto.generateBaseChallengeSignature(
                        {
                            baseChallengeHash,
                            privateKey: this.identity.privateKey
                        }
                    );
                    localResolve(baseChallengeSignature);
                })
                .catch(localReject);
        });
    }

    public register(ethAddress: string): Promise<{ ethAddress: string }> {
        return new Promise((resolve, reject) => {
            if (this.ethAddress === ethAddress) {
                return resolve({ ethAddress });
            }
            if (!isAddress(ethAddress)) {
                return reject(new Error("ethAddress format rejected"));
            }
            this.ethAddress = ethAddress;
            // 1. Make sure the user/ethadd directory exist
            const fsMakeEthDirData: IAOFS_Mkdir_Data = {
                dirPath: path.join("users", ethAddress)
            };
            this.router
                .send("/fs/mkdir", fsMakeEthDirData)
                .then(() => {
                    // 2. Make sure user db has been setup for this user
                    const userDbInitData: AODB_UserInit_Data = {
                        ethAddress
                    };
                    this.router
                        .send("/db/user/init", userDbInitData)
                        .then(() => {
                            this.router.send("/core/log", {
                                message: `[AO Core] Registered as user ${ethAddress}`
                            });
                            // 3. Pull user identity
                            this.router
                                .send("/db/user/getIdentity")
                                .then((response: IAORouterMessage) => {
                                    if (
                                        !response.data ||
                                        !response.data.identity
                                    ) {
                                        // 4A. Create user identity
                                        const identity: AOCrypto.Identity = AOCrypto.createUserIdentity();
                                        this.identity = identity;
                                        const storeIdentityData: AODB_UserInsert_Data = {
                                            object: {
                                                id: "identity",
                                                ...identity
                                            }
                                        };
                                        this.router
                                            .send(
                                                "/db/user/insert",
                                                storeIdentityData
                                            )
                                            .then(
                                                (
                                                    response: IAORouterMessage
                                                ) => {
                                                    // 6. Listeners that make this app work
                                                    debug(
                                                        `User identity generated, public key: ${
                                                            identity.publicKey
                                                        }`
                                                    );
                                                    resolve({ ethAddress });
                                                    this._resume();
                                                }
                                            )
                                            .catch(reject);
                                    } else {
                                        // 4B: User identity already exists
                                        this.identity = response.data.identity;
                                        // 5. Listeners that make this app work
                                        resolve({ ethAddress });
                                        this._resume();
                                    }
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    /**
     * Resume, picks up where the user left off. Handles content in all states.
     */
    private _resume() {
        // Register the taodb schemas
        this.router
            .send("/p2p/setUserIdentity", {
                userIdentity: this.identity
            })
            .then(() => {
                // Content resume
                this.router
                    .send("/db/user/content/get")
                    .then((response: IAORouterMessage) => {
                        const userContent = response.data;
                        userContent.forEach(contentJson => {
                            const content: AOContent = AOContent.fromObject(
                                contentJson
                            );
                            this.processContent(content);
                        });
                    });
                // Incoming content resume
                if (!this.isListeningForIncomingContent) {
                    this.isListeningForIncomingContent = true;
                    this.router.on(
                        "/core/content/incomingPurchase",
                        (request: IAORouterRequest) => {
                            const buyContentEvent: BuyContentEvent =
                                request.data;
                            this._handleIncomingContentPurchase(buyContentEvent)
                                .then(() => {
                                    request.respond({});
                                })
                                .catch(error => {
                                    debug(error);
                                    request.reject(error);
                                });
                        }
                    );
                }
                // Updates p2p content timestamps periodically
                if (!this.usersContentDiscoveryUpdateInterval) {
                    this.usersContentDiscoveryUpdateInterval = setInterval(
                        this._usersContentDiscoveryUpdate.bind(this),
                        AOUserSession.CONTENT_DISCOVERY_UPDATE_INTERVAL
                    );
                    this._usersContentDiscoveryUpdate();
                }
                // Listen for content purchases on Eth network
                if (this.isSubscribedToBuyContentEvents) {
                    this.router
                        .send("/eth/events/BuyContent/unsubscribe")
                        .then(() => {
                            this.router.send(
                                "/eth/events/BuyContent/subscribe"
                            );
                        });
                } else {
                    this.router.send("/eth/events/BuyContent/subscribe");
                }
                this.isSubscribedToBuyContentEvents = true;
            })
            .catch((error: Error) => {
                debug(`Error registering taodb schemas: ${error.message}`);
            });
    }

    private _usersContentDiscoveryUpdate() {
        // Safety check
        if (!this.ethAddress) {
            clearInterval(this.usersContentDiscoveryUpdateInterval);
            this.usersContentDiscoveryUpdateInterval = undefined;
            return debug(
                `Clearing users content discovery update interval (no longer have user address)`
            );
        }
        // 1. Pull all user's staked/hosted content
        const contentQuery: AODB_UserContentGet_Data = {
            query: {
                state: AOContentState.DISCOVERABLE
            }
        };
        this.router
            .send("/db/user/content/get", contentQuery)
            .then((response: IAORouterMessage) => {
                if (response.data && response.data.length > 0) {
                    // 2. Ping p2p/discovery to update the timestamp of last seen
                    response.data.forEach(contentObj => {
                        let updateNodeParams: AOP2P_Update_Node_Timestamp_Data = {
                            content: AOContent.fromObject(contentObj)
                        };
                        this.router
                            .send("/p2p/updateNode", updateNodeParams)
                            .then(() => {
                                debug(`Updated hosted content timestamp`);
                            })
                            .catch(error => {
                                debug(
                                    `Error updating hosted content timestamp: ${
                                        error.message
                                    }`,
                                    error
                                );
                            });
                    });
                }
            });
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
                this._handleContentHostDiscovery(content);
                break;
            case AOContentState.DOWNLOADING:
                this._handleContentDownloading(content);
                break;
            case AOContentState.DOWNLOADED:
                // Pending user purchase tx
                break;
            case AOContentState.PURCHASING:
                this._listenForContentPurchaseReceipt(content);
                break;
            case AOContentState.PURCHASED:
                // Content has been purchased, but have yet to receive the Decryption key
                this._listenForContentDecryptionKey(content);
                break;
            case AOContentState.DECRYPTION_KEY_RECEIVED:
                this._handleContentDecryptionKeyReceived(content);
                break;
            case AOContentState.VERIFIED:
                this._handleContentVerified(content);
                break;
            case AOContentState.VERIFICATION_FAILED:
                // TODO: cleanup? stay quite?
                break;
            case AOContentState.ENCRYPTED:
                this._handleContentEncrypted(content);
                break;
            case AOContentState.DAT_INITIALIZED:
                // This state is pending user stake/becomeHost
                if (content.contentType === AOContent.Types.DAPP) {
                    // Slight side effect, we need to unpack the zipped dapp
                    this._handleContentUnpacking(content as AODappContent);
                }
                break;
            case AOContentState.STAKING:
                this._listenForContentStakingReceipt(content);
                break;
            case AOContentState.STAKED:
                this._handleContentStaked(content);
                break;
            case AOContentState.DISCOVERABLE:
                // Content has been hosted and is discoverable,
                // we should already be listening for purchases
                break;
            default:
                break;
        }
    }

    /**
     * Specific to DAPP content type, needs to be unzipped after decryption takes place.
     *
     * @param {AODappContent} content Dapp content specifically needs unpacking/unzipping
     */
    private _handleContentUnpacking(content: AODappContent) {
        const sessionEthAddress = this.ethAddress;
        if (
            content.contentType !== AOContent.Types.DAPP ||
            content.unpacked === true
        )
            return null; // sanity check
        // Read in the decrypted content
        const unzipArgs: IAOFS_UnzipFile_Data = {
            readPath: path.join(
                "content",
                content.fileDatKey,
                content.fileName
            ),
            writePath: path.join("content", content.fileDatKey, "unpacked"),
            key: content.decryptionKey
        };
        this.router
            .send("/fs/unzipFile", unzipArgs)
            .then(() => {
                debug(`Succesfully unpacked DAPP [${content.title}]`);
                let userContentUpdate: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            unpacked: true
                        }
                    }
                };
                this.router
                    .send("/db/user/content/update", userContentUpdate)
                    .then((userContentUpdateResponse: IAORouterMessage) => {
                        // silent
                    })
                    .catch(error => {
                        debug(`Error updating user content: ${error.message}`);
                    });
                this.router.send("/db/logs/insert", {
                    message: `Succesfully unpacked DAPP [${content.title}]`,
                    userId: sessionEthAddress
                });
            })
            .catch(error => {
                debug(`Error unpacking DAPP [${content.title}]:`, error);
            });
    }

    /**
     * Someone purchased a piece of content that is hosted by this user. We need to
     * generate the content decryption key with information from that purchase event
     * and pass that key off via p2p/hyperdb.
     *
     * @param {BuyContentEvent} buyContentEvent
     */
    private _handleIncomingContentPurchase(buyContentEvent: BuyContentEvent) {
        return new Promise((resolve, reject) => {
            const sessionEthAddress = this.ethAddress;
            const sessionIdentity = this.identity;
            // 0. Disregard if the BuyContent event is from the current user
            if (
                buyContentEvent.buyer.toLowerCase() ===
                sessionEthAddress.toLowerCase()
            ) {
                return null;
            }
            // 1. Get the corresponding content entry in user db (make sure it is not )
            const contentQuery: AODB_UserContentGet_Data = {
                query: {
                    contentHostId: buyContentEvent.contentHostId
                }
            };
            this.router
                .send("/db/user/content/get", contentQuery)
                .then(async (response: IAORouterMessage) => {
                    if (!response.data || response.data.length < 1) {
                        // NOTE: this is most likely a BuyContent event for another user's content / host
                        // debug(
                        //     `[BuyContent][contentHostId=${
                        //         buyContentEvent.contentHostId
                        //     }] Skip, user is not a host.`
                        // );
                        return;
                    }
                    const userContent: AOContent = AOContent.fromObject(
                        response.data[0]
                    );
                    debug(
                        `Handling incoming purchase, content[${
                            userContent.title
                        }]->buyer[${buyContentEvent.publicKey}]`
                    );
                    try {
                        // 2. Generate the encryption key according to spec
                        const contentDecryptParams = {
                            contentDecryptionKey: userContent.decryptionKey,
                            contentRequesterPublicKey:
                                buyContentEvent.publicKey,
                            contentOwnersPrivateKey: sessionIdentity.privateKey
                        };
                        const {
                            encryptedDecryptionKey,
                            encryptedDecryptionKeySignature
                        } = await AOCrypto.generateContentEncryptionKeyForUser(
                            contentDecryptParams
                        );
                        // 3. Handoff to discovery
                        const sendDecryptionKeyMessage: AOP2P_Write_Decryption_Key_Data = {
                            content: userContent,
                            hostsPublicKey: sessionIdentity.publicKey,
                            buyersPublicKey: buyContentEvent.publicKey,
                            encryptedDecryptionKey,
                            encryptedKeySignature: encryptedDecryptionKeySignature
                        };
                        this.router
                            .send(
                                "/p2p/decryptionKeyHandoff",
                                sendDecryptionKeyMessage
                            )
                            .then((response: IAORouterMessage) => {
                                if (response.data.alreadyExists) {
                                    debug(
                                        `Incoming purchase already handled, content[${
                                            userContent.id
                                        }]->buyer[${buyContentEvent.buyer}]`
                                    );
                                } else if (response.data.success) {
                                    debug(
                                        `Succesfully handled content purchase with: contentHostId[${
                                            buyContentEvent.contentHostId
                                        }], purchaseReceiptId[${
                                            buyContentEvent.purchaseReceiptId
                                        }]`
                                    );
                                    this.router.send("/db/logs/insert", {
                                        message: `Sold ${
                                            userContent.title
                                        } to user ${
                                            buyContentEvent.buyer
                                        }, decryption key handoff successful`,
                                        userId: sessionEthAddress
                                    });
                                } else {
                                    debug(
                                        `Failed to handle content purhcase, writing to discovery resolved without success`
                                    );
                                    this.router.send("/db/logs/insert", {
                                        message: `Sold ${
                                            userContent.title
                                        } to user ${
                                            buyContentEvent.buyer
                                        }, decryption key handoff unsuccessful`,
                                        userId: sessionEthAddress
                                    });
                                }
                                resolve();
                            })
                            .catch(error => {
                                debug(
                                    `Failed to handle content purhcase`,
                                    error
                                );
                                reject(error);
                            });
                    } catch (error) {
                        debug(
                            `Error generating content decryption key for user: ${
                                error.message
                            }`,
                            error
                        );
                        reject(error);
                    }
                });
        });
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
        const sessionEthAddress = this.ethAddress;
        // 1. Grab all nodes/contentHostId's for this piece of content
        const findEncryptedNodeData: AOP2P_GetContentHosts_Data = { content };
        this.router
            .send("/p2p/content/getContentHosts", findEncryptedNodeData)
            .then((fileNodesResponse: IAORouterMessage) => {
                const potentialNodes: Array<NetworkContentHostEntry> =
                    fileNodesResponse.data;
                if (!potentialNodes || potentialNodes.length === 0) {
                    // NOTE: we *shouldnt* hit this case unless the hyperdb is behind or the content has not been hosted
                    // (in which case user should not have made it this far)
                    debug(
                        `No content hosts found in the database for content id[${
                            content.id
                        }]`
                    );
                    return;
                }
                // 2. Update the network content db with latest hosted timestamp for this content
                const networkContentUpdate: AODB_NetworkContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            lastSeenContentHost: potentialNodes[0]
                        }
                    }
                };
                this.router
                    .send("/db/network/content/update", networkContentUpdate)
                    .catch(error => {
                        debug(
                            `Error updating network content lastSeenContentHost: ${
                                error.message
                            }`,
                            error
                        );
                    });
                // 3. Attempt to download the content from ONE of the nodes above (we may not even find someone who is hosting this content)
                const encryptedDownloadData: AODat_Encrypted_Download_Data = {
                    nodes: potentialNodes
                };
                this.router
                    .send("/dat/encryptedFileDownload", encryptedDownloadData)
                    .then((downloadResponse: IAORouterMessage) => {
                        // 4a. Content has started downloading from a host!
                        let userContentUpdate: AODB_UserContentUpdate_Data = {
                            id: content.id,
                            update: {
                                $set: {
                                    state: downloadResponse.data.datEntry
                                        .complete
                                        ? AOContentState.DOWNLOADED
                                        : AOContentState.DOWNLOADING,
                                    contentHostId:
                                        downloadResponse.data.contentHostId,
                                    fileDatKey:
                                        downloadResponse.data.datEntry.key,
                                    nodePublicKey:
                                        downloadResponse.data.nodeEntry
                                            .nodePublicKey //Important for when you're listening on the sold key channel.
                                }
                            }
                        };
                        this.router
                            .send("/db/user/content/update", userContentUpdate)
                            .then(
                                (
                                    userContentUpdateResponse: IAORouterMessage
                                ) => {
                                    let updatedContent = AOContent.fromObject(
                                        userContentUpdateResponse.data
                                    );
                                    this.processContent(updatedContent);
                                }
                            )
                            .catch(error => {
                                debug(
                                    `Error updating user content: ${
                                        error.message
                                    }`
                                );
                            });
                        this.router.send("/db/logs/insert", {
                            message: `Downloading encrypted content [${
                                content.title
                            }] from host [${
                                downloadResponse.data.contentHostId
                            }]. See dat://${
                                downloadResponse.data.datEntry.key
                            }`,
                            userId: sessionEthAddress
                        });
                    })
                    .catch(error => {
                        debug(
                            `Unable to download content from any host: ${
                                error.message
                            }`
                        );
                        // 4b. We were unable to download the content from any host (likely that all hosted dats were not reachable)
                        let userContentUpdate: AODB_UserContentUpdate_Data = {
                            id: content.id,
                            update: {
                                $set: {
                                    state: AOContentState.HOST_DISCOVERY_FAILED
                                }
                            }
                        };
                        this.router
                            .send("/db/user/content/update", userContentUpdate)
                            .then(
                                (
                                    userContentUpdateResponse: IAORouterMessage
                                ) => {
                                    let updatedContent = AOContent.fromObject(
                                        userContentUpdateResponse.data
                                    );
                                    this.processContent(updatedContent);
                                }
                            )
                            .catch(error => {
                                debug(
                                    `Error updating user content: ${
                                        error.message
                                    }`
                                );
                            });
                    });
            })
            .catch(error => {
                debug(
                    `Error while trying to pull content hosts from p2p: ${
                        error.message
                    }`
                );
                let userContentUpdate: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            state: AOContentState.HOST_DISCOVERY_FAILED
                        }
                    }
                };
                this.router
                    .send("/db/user/content/update", userContentUpdate)
                    .then((userContentUpdateResponse: IAORouterMessage) => {
                        let updatedContent = AOContent.fromObject(
                            userContentUpdateResponse.data
                        );
                        this.processContent(updatedContent);
                    })
                    .catch(error => {
                        debug(`Error updating user content: ${error.message}`);
                    });
            });
    }

    /**
     * Content is currently downloading (via dat). Ping dat until content is completely downloaded.
     *
     * content.state ==== DOWNLOADING
     *
     * @param {AOContent} content
     */
    private _handleContentDownloading(content: AOContent) {
        const sessionEthAddress = this.ethAddress;
        setTimeout(() => {
            const datStatsParams: AODat_GetDatStats_Data = {
                key: content.fileDatKey
            };
            this.router
                .send("/dat/stats", datStatsParams)
                .then((response: IAORouterMessage) => {
                    const datStats: DatStats = response.data;
                    if (datStats.complete) {
                        let userContentUpdate: AODB_UserContentUpdate_Data = {
                            id: content.id,
                            update: {
                                $set: {
                                    state: AOContentState.DOWNLOADED
                                }
                            }
                        };
                        this.router
                            .send("/db/user/content/update", userContentUpdate)
                            .then(
                                (
                                    userContentUpdateResponse: IAORouterMessage
                                ) => {
                                    let updatedContent = AOContent.fromObject(
                                        userContentUpdateResponse.data
                                    );
                                    this.processContent(updatedContent);
                                }
                            )
                            .catch(error => {
                                debug(
                                    `Error updating user content: ${
                                        error.message
                                    }`
                                );
                            });
                    } else {
                        this.processContent(content);
                    }
                });
        }, 1500);
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
        const sessionEthAddress = this.ethAddress;
        if (!content.transactions || !content.transactions.purchaseTx) {
            debug(
                `Warning: calling _listenForContentPurchaseReceipt without a purchaseTx`
            );
            return null;
        }
        let buyContentEventArgs: IAOEth_BuyContentEvent_Data = {
            transactionHash: content.transactions.purchaseTx
        };
        this.router
            .send("/eth/tx/BuyContent", buyContentEventArgs)
            .then((response: IAORouterMessage) => {
                const { status } = response.data;
                const buyContentEvent: BuyContentEvent =
                    response.data.buyContentEvent;
                let contentUpdateAfterTx: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {}
                };
                if (status && buyContentEvent) {
                    // Succesful transaction
                    contentUpdateAfterTx.update = {
                        $set: {
                            state: AOContentState.PURCHASED,
                            purchaseReceiptId: buyContentEvent.purchaseReceiptId
                            //"nodePublicKey": buyContentEvent.contentHostId, //taken out since this should be the node id, which is the seller's public key
                        }
                    };
                } else {
                    // Transaction failed :(, go back to previous state
                    contentUpdateAfterTx.update = {
                        $set: {
                            state: AOContentState.DOWNLOADED,
                            "transactions.purchaseTx": null
                        }
                    };
                }
                this.router
                    .send("/db/user/content/update", contentUpdateAfterTx)
                    .then((response: IAORouterMessage) => {
                        let updatedContent: AOContent = AOContent.fromObject(
                            response.data
                        );
                        if (updatedContent.state === AOContentState.PURCHASED) {
                            this.router.send("/db/logs/insert", {
                                message: `Purchased content [${
                                    content.title
                                }], see tx/${content.transactions.purchaseTx}`,
                                userId: sessionEthAddress
                            });
                            // Content succesfully purchased, begin next step in process (listen for decryption key)
                            this.processContent(updatedContent);
                        }
                    })
                    .catch(debug);
            })
            .catch(error => {
                debug(error);
                // NOTE: failed to get tx status. I dont think it makes sense to roll content state
                // back (as the tx could still be vaild). For now let's just leave in limbo, but might
                // want to check again.
            });
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
        const sessionEthAddress = this.ethAddress;
        const sessionIdentity = this.identity;
        debug("starting to listen for content decryption keys");
        if (content.state !== AOContentState.PURCHASED) {
            debug(
                `Warning: _listenForContentDecryptionKey called with content state = ${
                    content.state
                }, expected PURCHASED`
            );
            return null;
        }
        const p2pWatchKeyRequest: AOP2P_Watch_AND_Get_IndexData_Data = {
            content,
            buyersPublicKey: sessionIdentity.publicKey
        };
        this.router
            .send("/p2p/watchAndGetIndexData", p2pWatchKeyRequest)
            .then((response: IAORouterMessage) => {
                if (response.ethAddress !== sessionEthAddress) {
                    // TODO: we currently do not have a method of stopping /p2p/watchAndGetIndexData. There is a chance
                    // that the user has changed within this time frame and we dont want
                    debug(
                        `Warning, user has changed we are skipping content update to state DECRYPTION_KEY_RECEIVED`
                    );
                    return null;
                }
                const indexData: ITaoDB_ContentHost_IndexData_Entry =
                    response.data;
                if (indexData) {
                    let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                        id: content.id,
                        update: {
                            $set: {
                                state: AOContentState.DECRYPTION_KEY_RECEIVED,
                                receivedIndexData: indexData
                            }
                        }
                    };
                    this.router
                        .send("/db/user/content/update", contentUpdateQuery)
                        .then((contentUpdateResponse: IAORouterMessage) => {
                            debug(
                                `Succesfully received decryption key for purchased content with id[${
                                    content.id
                                }]`
                            );
                            const updatedContent: AOContent = AOContent.fromObject(
                                contentUpdateResponse.data
                            );
                            this.processContent(updatedContent);
                            this.router.send("/db/logs/insert", {
                                message: `Decryption key received for content [${
                                    content.title
                                }]`,
                                userId: sessionEthAddress
                            });
                        })
                        .catch(debug);
                } else {
                    debug(
                        `Error listening for decryption key, no index data returned`
                    );
                }
            })
            .catch(debug);
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
        const sessionEthAddress = this.ethAddress;
        const sessionIdentity = this.identity;
        if (!content.receivedIndexData) {
            debug(
                `Warning: calling _handleContentDecryptionKeyReceived without receivedIndexData from p2p/hyperdb`
            );
            return null;
        }
        // 1. Decrypt the decryption key that we received from seller
        AOCrypto.decryptMessage({
            message: content.receivedIndexData.decryptionKey,
            privateKey: sessionIdentity.privateKey
        })
            .then((decryptionKey: string) => {
                // 2. Decrypt/ffprobe/Checksum the downloaded file and match against the content data.
                const decryptChecksumData: IAOFS_DecryptCheck_Data = {
                    path: content.getFilePath(),
                    decryptionKey: decryptionKey
                };
                this.router
                    .send("/fs/decryptChecksum", decryptChecksumData)
                    .then((decryptChecksumResponse: IAORouterMessage) => {
                        // 3. Check that the decrypted file's checksum actually matches the original content checksum
                        let checksum = decryptChecksumResponse.data.checksum;
                        let nextContentState = AOContentState.VERIFIED;
                        if (checksum != content.fileChecksum) {
                            nextContentState =
                                AOContentState.VERIFICATION_FAILED;
                            debug(
                                `Checksum of decrypted file does not match the purchased content's checksum`
                            );
                        }
                        this.router.send("/db/logs/insert", {
                            message:
                                nextContentState === AOContentState.VERIFIED
                                    ? `Decrypted content verified [${
                                          content.title
                                      }]`
                                    : `Decrypted content failed the verification step, checksum did not match the original content [${
                                          content.title
                                      }]`,
                            userId: sessionEthAddress
                        });
                        // 4. Update the content with verification state
                        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                            id: content.id,
                            update: {
                                $set: {
                                    state: nextContentState
                                }
                            }
                        };
                        this.router
                            .send("/db/user/content/update", contentUpdateQuery)
                            .then(
                                (contentVerifiedResponse: IAORouterMessage) => {
                                    let updatedContent: AOContent = AOContent.fromObject(
                                        contentVerifiedResponse.data
                                    );
                                    // Handoff to next handler
                                    this.processContent(updatedContent);
                                }
                            )
                            .catch(debug);
                    })
                    .catch(debug);
            })
            .catch(error => {
                debug(
                    `Error attempting to decrypt content encryption key: ${
                        error.message
                    }`
                );
            });
    }

    /**
     * Content has been verified, now it is time to re-host that content.
     *
     * content.state === VERIFIED
     *
     * @param {AOContent} content
     */
    private _handleContentVerified(content: AOContent) {
        const sessionEthAddress = this.ethAddress;
        const sessionIdentity = this.identity;
        // 1. Get the decryption key again
        AOCrypto.decryptMessage({
            message: content.receivedIndexData.decryptionKey,
            privateKey: sessionIdentity.privateKey
        })
            .then((decryptionKey: string) => {
                // 2. New directory for data to be re-encrypted (tmp path)
                const tmpContentPath: IAOFS_Mkdir_Data = {
                    dirPath: content.getTempFolderPath()
                };
                this.router
                    .send("/fs/mkdir", tmpContentPath)
                    .then(() => {
                        const cleanupTmpContent = () => {
                            let removePathData: IAOFS_Unlink_Data = {
                                removePath: tmpContentPath.dirPath
                            };
                            this.router.send("/fs/unlink", removePathData);
                        };
                        // 3. Reencrypt original encrypted file into the new dir
                        const fileReencrypt: IAOFS_Reencrypt_Data = {
                            originalPath: content.getFilePath(),
                            decryptionKey: decryptionKey,
                            finalPath: path.join(
                                content.getTempFolderPath(),
                                content.fileName
                            )
                        };
                        this.router
                            .send("/fs/reencrypt", fileReencrypt)
                            .then((reencryptionResponse: IAORouterMessage) => {
                                let newDecrytionKey =
                                    reencryptionResponse.data.newKey;
                                let newEncryptedChecksum =
                                    reencryptionResponse.data.encryptedChecksum;
                                if (!newDecrytionKey) {
                                    debug(
                                        "Error re-encrypting file: No new decryption key"
                                    );
                                    cleanupTmpContent();
                                    return null;
                                }
                                if (!content.baseChallenge) {
                                    // Sanity check
                                    debug(
                                        `Attempting to sign the baseChallenge for content, baseChallenge does not exist!`
                                    );
                                    cleanupTmpContent();
                                    return null;
                                }
                                // 4. Generate the baseChallengeSignature & assign encChallenge (note that baseChallenge should not change as fileChecksum should remain the same)
                                this.getContentBaseChallengeSignature({
                                    contentChecksum: content.fileChecksum
                                })
                                    .then(baseChallengeSignature => {
                                        // 5. Update Content State to Encrypted
                                        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                                            id: content.id,
                                            update: {
                                                $set: {
                                                    state:
                                                        AOContentState.ENCRYPTED,
                                                    decryptionKey: newDecrytionKey,
                                                    encChallenge: newEncryptedChecksum,
                                                    baseChallengeSignature
                                                }
                                            }
                                        };
                                        this.router
                                            .send(
                                                "/db/user/content/update",
                                                contentUpdateQuery
                                            )
                                            .then(
                                                (
                                                    contentUpdateResponse: IAORouterMessage
                                                ) => {
                                                    const updatedContent: AOContent = AOContent.fromObject(
                                                        contentUpdateResponse.data
                                                    );
                                                    // Handoff to next state handler
                                                    this.processContent(
                                                        updatedContent
                                                    );
                                                }
                                            )
                                            .catch(debug); // Content State update to Encrypted
                                        this.router.send("/db/logs/insert", {
                                            message: `Content succesfully encrypted [${
                                                content.title
                                            }]`,
                                            userId: sessionEthAddress
                                        });
                                    })
                                    .catch(error => {
                                        debug(
                                            `Bad news, there was an error generating content base challenge and signature: ${
                                                error
                                                    ? error.message
                                                    : "(error not an object)"
                                            }`
                                        );
                                        cleanupTmpContent();
                                        return null;
                                    });
                            })
                            .catch((error: Error) => {
                                debug(
                                    `Error re-encrypting file: ${error.message}`
                                );
                                cleanupTmpContent();
                            }); // Reencryption/copy
                    })
                    .catch(debug); // MakeDir for new dat
            })
            .catch(debug); // Decrypt-decryptionKey
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
        const sessionEthAddress = this.ethAddress;
        const sessionIdentity = this.identity;
        // 1. Initialize the new Dat within our temp folder created during encryption process
        const createDatData: AODat_Create_Data = {
            newDatDir: content.getDatTempFolderPath() //Contextually aware of the dat's constraints to 'content' path
        };
        this.router
            .send("/dat/create", createDatData)
            .then((datCreateResponse: IAORouterMessage) => {
                let newDatKey = datCreateResponse.data.key;
                // 2. Move Dat to its final location within content directory
                const moveNewDatData: IAOFS_Move_Data = {
                    srcPath: content.getTempFolderPath(),
                    destPath: path.join("content", newDatKey)
                };
                this.router
                    .send("/fs/move", moveNewDatData)
                    .then(() => {
                        // 3. Resume the Dat (start hosting)
                        const resumeDatData: AODat_ResumeSingle_Data = {
                            key: newDatKey
                        };
                        this.router.send("/dat/resumeSingle", resumeDatData);
                        // 4. Store the newDatKey
                        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                            id: content.id,
                            update: {
                                $set: {
                                    state: AOContentState.DAT_INITIALIZED,
                                    fileDatKey: newDatKey,
                                    // At this point the content is reencrypted and it is safe to update the content's node
                                    nodePublicKey: sessionIdentity.publicKey,
                                    nodeEthAddress: sessionEthAddress
                                }
                            }
                        };
                        this.router
                            .send("/db/user/content/update", contentUpdateQuery)
                            .then((contentUpdateResponse: IAORouterMessage) => {
                                const updatedContent: AOContent = AOContent.fromObject(
                                    contentUpdateResponse.data
                                );
                                // Handoff to next state handler
                                this.processContent(updatedContent);
                            })
                            .catch(debug);
                    })
                    .catch(debug); // Move Dat Dir
            })
            .catch((error: Error) => {
                debug(`Error creating Dat: ${error.message}`);
                let removePathData: IAOFS_Unlink_Data = {
                    removePath: path.join(content.getTempFolderPath(), ".dat")
                };
                this.router.send("/fs/unlink", removePathData).catch(debug);
            }); // Dat Creation
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
        const sessionEthAddress = this.ethAddress;
        if (
            !content.transactions ||
            (!content.transactions.stakeTx && !content.transactions.hostTx)
        ) {
            debug(
                `Warning: calling _listenForContentStakingReceipt without a stakeTx or hostTx, rolling back state...`
            );
            let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                id: content.id,
                update: {
                    $set: {
                        state: AOContentState.DAT_INITIALIZED
                    }
                }
            };
            this.router
                .send("/db/user/content/update", contentUpdateQuery)
                .then((contentUpdateResponse: IAORouterMessage) => {
                    debug(
                        `Content [${content.title}] rolled back to state [${
                            AOContentState.DAT_INITIALIZED
                        }]`
                    );
                })
                .catch(error => {
                    debug(`Error rolling back content state: ${error.message}`);
                });
            return null;
        }
        let transactionHash =
            content.transactions.stakeTx || content.transactions.hostTx;
        const isStake = transactionHash === content.transactions.stakeTx;
        let txEventRoute = isStake
            ? "/eth/tx/StakeContent"
            : "/eth/tx/HostContent";
        // 1. Listen for tx status
        this.router
            .send(txEventRoute, { transactionHash })
            .then((response: IAORouterMessage) => {
                let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {}
                };
                // 2. Update the Content State based on status
                if (response.data.status) {
                    // 2a. Stake succesfull
                    const hostContentEvent: HostContentEvent =
                        response.data.hostContentEvent;
                    contentUpdateQuery.update = {
                        $set: {
                            state: AOContentState.STAKED,
                            contentHostId: hostContentEvent.contentHostId,
                            stakeId: hostContentEvent.stakedContentId
                        }
                    };
                } else {
                    // 2b. Failed to stake! Roll back to previous state
                    contentUpdateQuery.update = {
                        $set: {
                            state: AOContentState.DAT_INITIALIZED
                        }
                    };
                }
                this.router
                    .send("/db/user/content/update", contentUpdateQuery)
                    .then((contentUpdateResponse: IAORouterMessage) => {
                        const updatedContent: AOContent = AOContent.fromObject(
                            contentUpdateResponse.data
                        );
                        // 3. Another side-effect is that we are storing the stakeId within the metadata dat repo, so we update that here
                        if (updatedContent.stakeId) {
                            const contentWriteData: IAOFS_Write_Data = {
                                writePath: `${updatedContent.getMetadataFolderPath()}/content.json`,
                                data: JSON.stringify(
                                    updatedContent.toMetadataJson()
                                )
                            };
                            this.router.send("/fs/write", contentWriteData);
                            this.router.send("/db/logs/insert", {
                                message: `${
                                    isStake ? "Staked" : "Hosted"
                                } content [${
                                    content.title
                                }], see tx:${transactionHash}`,
                                userId: sessionEthAddress
                            });
                        }
                        // Handoff to next state handler
                        this.processContent(updatedContent);
                    })
                    .catch(debug);
            })
            .catch(error => {
                debug(error);
                // NOTE: failed to get tx status. I dont think it makes sense to roll content state
                // back (as the tx could still be vaild). For now let's just leave in limbo, but might
                // want to check again.
            });
    }

    /**
     * Content is ready to be broadcasted to discovery
     *
     * content.state === STAKED
     *
     * @param {AOContent} content
     */
    private _handleContentStaked(content: AOContent) {
        const sessionEthAddress = this.ethAddress;
        debug(
            "Content staked, begin process of making discoverable...",
            content.fileDatKey
        );
        Promise.resolve()
            .then(() => {
                // 1. Import all the freaken files.
                const fileImportDatData: AODat_ImportSingle_Data = {
                    key: content.fileDatKey
                };
                const metaImportDatData: AODat_ImportSingle_Data = {
                    key: content.metadataDatKey
                };
                let importDats = [];
                importDats.push(
                    this.router.send("/dat/importSingle", fileImportDatData)
                );
                if (content.creatorEthAddress == sessionEthAddress) {
                    importDats.push(
                        this.router.send("/dat/importSingle", metaImportDatData)
                    );
                }
                return Promise.all(importDats);
            })
            .then(() => {
                debug("Content dat imports are good, now resuming...");
                // 2. Ensure the dats are resumed (they may already be, but need to make sure)
                const fileResumeDatData: AODat_ResumeSingle_Data = {
                    key: content.fileDatKey
                };
                const metaResumeDatData: AODat_ResumeSingle_Data = {
                    key: content.metadataDatKey
                };
                let resumeDats = [];
                resumeDats.push(
                    this.router.send("/dat/resumeSingle", fileResumeDatData)
                );
                if (content.creatorEthAddress == sessionEthAddress) {
                    resumeDats.push(
                        this.router.send("/dat/resumeSingle", metaResumeDatData)
                    );
                }
                return Promise.all(resumeDats);
            })
            .then(() => {
                // 3. If this is the content creator, we also register the content under their
                // namespace
                if (content.creatorEthAddress == sessionEthAddress) {
                    const contentRegistrationRequest: AOP2P_ContentRegistration_Data = {
                        content
                    };
                    return this.router.send(
                        "/p2p/registerContent",
                        contentRegistrationRequest
                    );
                } else {
                    return Promise.resolve();
                }
            })
            .then(() => {
                debug("Content dats resumed, adding content to discovery...");
                // 4. Add new discovery
                const p2pAddDiscoveryData: AOP2P_Add_Discovery_Data = {
                    content
                };
                return this.router.send(
                    "/p2p/registerContentHost",
                    p2pAddDiscoveryData
                );
            })
            .then((response: IAORouterMessage) => {
                debug("Content has been added to discovery");
                // 5. Update the content state (mark as Discoverable)
                const contentUpdateQuery: AODB_UserContentUpdate_Data = {
                    id: content.id,
                    update: {
                        $set: {
                            state: AOContentState.DISCOVERABLE
                        }
                    }
                };
                this.router.send("/db/logs/insert", {
                    message: `Content [${
                        content.title
                    }] is now discoverable within the AO network!`,
                    userId: sessionEthAddress
                });
                return this.router.send(
                    "/db/user/content/update",
                    contentUpdateQuery
                );
            })
            .then((contentUpdateResponse: IAORouterMessage) => {
                // 6. Finally, done with staked content
                const updatedContent: AOContent = AOContent.fromObject(
                    contentUpdateResponse.data
                );
                // Handoff to next state handler
                this.processContent(updatedContent);
            })
            .catch((error: Error) => {
                // NOTE; no real recovery mechanism if this state fails to advance.
                debug(error);
            });
    }
}
