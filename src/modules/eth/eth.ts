import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import Web3 from "web3";
import SolidityEvent from "web3-legacy/lib/web3/event.js";
import Debug from "../../AODebug";
import { IAOStatus } from "../../models/AOStatus";
const AOPurchaseReceipt = require("ao-contracts/build/contracts/AOPurchaseReceipt.json");
const AOContent = require("ao-contracts/build/contracts/AOContent.json");
const AOContentHost = require("ao-contracts/build/contracts/AOContentHost.json");
const AOStakedContent = require("ao-contracts/build/contracts/AOStakedContent.json");
const AOIon = require("ao-contracts/build/contracts/AOIon.json");
const AOSetting = require("ao-contracts/build/contracts/AOSetting.json");
const debug = Debug("ao:eth");
const errorLog = Debug("ao:eth:error");

export interface IAOETH_Init_Data {
    ethNetworkRpc: string;
}
export interface IAOETH_Stats {
    connectionStatus: IAOStatus;
    networkId: string;
    totalContentHosts?: number;
}
export interface IAOEth_NetworkChange_Data {
    networkId: "1" | "3" | "4";
}
export interface IAOEth_TX_Data {
    transactionHash: string;
}
export interface IAOEth_StakeContentEvent_Data {
    transactionHash: string;
}
export interface IAOEth_BuyContentEvent_Data {
    transactionHash: string;
}
export interface IAOEth_HostContentEvent_Data {
    transactionHash: string;
}
export interface IAOEth_Events_BuyContent_Data {}

export interface BuyContentEvent {
    buyer: string;
    purchaseReceiptId: string;
    contentHostId: string;
    paidNetworkAmount: number;
    publicKey: string;
    publicAddress: string;
    createdOnTimestamp: number;
}
export interface StakeContentEvent {
    stakeOwner: string;
    stakedContentId: string;
    contentId: string;
    baseNetworkAmount: number;
    primordialAmount: number;
    primordialWeightedIndex: number;
    profitPercentage: number;
    createdOnTimestamp: number;
}
export interface HostContentEvent {
    host: string;
    contentHostId: string;
    stakedContentId: string;
    contentDatKey: string;
    metadataDatKey: string;
}
export interface StoreContentEvent {
    creator: string;
    contentId: string;
    fileSize: number;
    contentUsageType: string;
}

interface Subscription {
    unsubscribe(callBack?: (Error, boolean) => void): void | boolean;
}

export enum ErrorCode {
    INVALID_URL, // could not be parsed
    INVALID_WS_URL, // was not a valid websocket url
    INVALID_RPC, // was a valid url, but possibly not an rpc
    UNSUPPORTED_NETWORK,
    INVALID_CONTRACTS,
    UNKOWN
}
export class EthereumNetworkError extends Error {
    public static readonly ErrorCodes = ErrorCode;
    public readonly code: ErrorCode;
    constructor(m: string, code?: ErrorCode) {
        super(m);
        Object.setPrototypeOf(this, EthereumNetworkError.prototype);
        this.code = code || ErrorCode.UNKOWN;
    }
}

/**
 * AOEth
 *
 * This is the main fs package for AO. Note all reads/writes are relative
 * to the `storageLocation` argument.
 */
export default class AOEth extends AORouterInterface {
    private web3: Web3;
    private networkId: string;
    private rpcEndpoint: string;
    private providerReconnectDebounce: number = 100;
    private connectionStatus: IAOStatus = "DISCONNECTED";
    private contentHosts = {
        totalContentHosts: 0,
        lastFetched: null,
        refetchPeriodInMs: 60 * 1000 // 1 min
    };

    private contracts: {
        // sry no type checking on these bad boys!
        aoIon: any;
        aoPurchaseReceipt: any;
        aoContentHost: any;
        aoSetting: any;
    };

    private events: {
        BuyContent: Subscription;
    };

    constructor(args: AORouterSubprocessArgs) {
        super(args);
        this.rpcEndpoint = args.ethNetworkRpc;
        this.events = {
            BuyContent: undefined
        };
        this.router.on("/eth/init", this._handleInit.bind(this));
        this.router.on(
            "/eth/settings/taoDbKey",
            this._handleGetTaoDbKey.bind(this)
        );
        this.router.on("/eth/stats", this._handleStats.bind(this));
        this.router.on("/eth/network/get", this._handleNetworkGet.bind(this));
        this.router.on("/eth/tx", this._handleTx.bind(this));
        this.router.on(
            "/eth/tx/BuyContent",
            this._getBuyContentEventForTransaction.bind(this)
        );
        this.router.on(
            "/eth/tx/HostContent",
            this._getHostContentEventForTransaction.bind(this)
        );
        this.router.on(
            "/eth/tx/StakeContent",
            this._getStakeContentEventForTransaction.bind(this)
        );
        this.router.on(
            "/eth/events/BuyContent/subscribe",
            this._listenForBuyContentEvents.bind(this)
        );
        this.router.on(
            "/eth/events/BuyContent/unsubscribe",
            this._unsubscribeBuyContentEvents.bind(this)
        );
    }

    /**
     * This Eth process initialization involves attempting to connect to the
     * provided RPC endpoint and verifying that the network id matches the
     * expected network. The contracts must have been deployed to
     * the given network.
     *
     * @param request
     */
    private _handleInit(request: IAORouterRequest) {
        const { ethNetworkRpc }: IAOETH_Init_Data = request.data;
        if (ethNetworkRpc) {
            this.rpcEndpoint = ethNetworkRpc;
        }
        debug(`Initializing ethereum module with RPC: ${this.rpcEndpoint}`);
        // 0. Sanity check, make sure the user provided a websocket url
        if (
            this.rpcEndpoint.indexOf("wss://") !== 0 &&
            this.rpcEndpoint.indexOf("ws://")
        ) {
            request.reject(
                new EthereumNetworkError(
                    `AO currently only supports websocket rpc providers`,
                    ErrorCode.INVALID_WS_URL
                )
            );
            return;
        }
        const rejectWithError = (web3, provider, error) => {
            this.connectionStatus = "ERROR";
            if (web3) web3.setProvider(null);
            request.reject(error);
        };
        // 2. Get the provider
        this.getEthereumProvider(this.rpcEndpoint)
            .then(provider => {
                // 1. Setup web3 instance
                this.web3 = new Web3(provider);
                // 3. Attempt to fetch the network id. This will tell us if the rpc
                // connection is valid.
                this.web3.eth.net
                    .getId()
                    .then(networkId => {
                        this.networkId = `${networkId}`;
                        // We are succefully connected to ethereum network!
                        debug(
                            `connected to ethereum network, id[${networkId}], rpc[${
                                this.rpcEndpoint
                            }]`
                        );
                        // 4.a Sanity check, make sure contracts have been deployed to desired network
                        const deployedNetworks = Object.keys(
                            AOSetting.networks
                        );
                        if (deployedNetworks.indexOf(this.networkId) === -1) {
                            debug(
                                `Contracts not deployed to target network: ${
                                    this.networkId
                                }`
                            );
                            rejectWithError(
                                this.web3,
                                provider,
                                new EthereumNetworkError(
                                    `AO contracts have not been deployed to the desired network [${
                                        this.networkId
                                    }], contracts are deployed to networks [${deployedNetworks.join(
                                        ","
                                    )}]`,
                                    ErrorCode.UNSUPPORTED_NETWORK
                                )
                            );
                            return;
                        }
                        // 5. Setup contracts
                        const contractsInitialized = this.initializeEthereumContracts();
                        if (!contractsInitialized) {
                            rejectWithError(
                                this.web3,
                                provider,
                                new EthereumNetworkError(
                                    `Error initializing contracts, this may be a result of an invalid ABI`,
                                    ErrorCode.INVALID_CONTRACTS
                                )
                            );
                            return;
                        } else {
                            request.respond({
                                ethNetworkId: `${networkId}`,
                                ethNetworkRpc: this.rpcEndpoint
                            });
                            let recconectAttempted = false;
                            const reconnectAttempt = (error?: Error) => {
                                if (error) {
                                    errorLog(
                                        `Ethereum provider on:error`,
                                        error
                                    );
                                } else {
                                    debug(`Ethereum provider on:end`);
                                }
                                if (!recconectAttempted) {
                                    recconectAttempted = true;
                                    this.providerReconnectDebounce = 100; // reset the debounce
                                    this.reconnectEthereumProvider(
                                        this.rpcEndpoint
                                    );
                                }
                            };
                            provider.on("end", reconnectAttempt);
                            provider.on("error", reconnectAttempt);
                        }
                    })
                    .catch(networkError => {
                        errorLog(networkError);
                        // Failure location 2, ws endpoint is likely an invalid RPC endpoint
                        // even thought the WS connection was established
                        let error = new EthereumNetworkError(
                            `Error fetching network id, likely due to an invalid rpc endpoint`,
                            ErrorCode.INVALID_RPC
                        );
                        errorLog(error);
                        rejectWithError(this.web3, provider, error);
                    });
            })
            .catch(error => {
                errorLog(
                    `Attempt at getting ethereum provider rejected with error:`,
                    error
                );
                request.reject(error);
            });
    }

    /**
     * Get and returns a valid Eth Provider. This method waits for the succesfull
     * connection before resolving.
     *
     * @param rpcEndpoint
     */
    private getEthereumProvider(rpcEndpoint: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const provider = new Web3.providers.WebsocketProvider(
                    rpcEndpoint
                );
                let resolveAndRemoveListeners = provider => {
                    provider.removeAllListeners("connect");
                    provider.removeAllListeners("error");
                    provider.removeAllListeners("end");
                    resolve(provider);
                };
                let rejectAndRemoveListeners = (provider, error) => {
                    provider.removeAllListeners("connect");
                    provider.removeAllListeners("error");
                    provider.removeAllListeners("end");
                    reject(error);
                };
                provider.on("end", (error?: Error) => {
                    // NOTE: we will not hit this callback if the provider
                    // has already connected (since we remove listener on connect)
                    // so it is safe to assume this "end" event was triggered
                    // by an error/failure to connect
                    debug("web3 provider connection end", error);
                    this.connectionStatus = "DISCONNECTED";
                    rejectAndRemoveListeners(
                        provider,
                        new Error(
                            `Web3 provider failed to establish connection`
                        )
                    );
                });
                provider.on("connect", () => {
                    debug(`web provider connected to ${rpcEndpoint}`);
                    this.connectionStatus = "CONNECTED";
                    resolveAndRemoveListeners(provider);
                });
                provider.on("error", (error?: Error) => {
                    // NOTE: this makes the assumption that a critical error will also emit the "end" event.
                    debug("web3 provider error:", error);
                });
            } catch (error) {
                if (error.name === "TypeError [ERR_INVALID_URL]") {
                    // Failure: invalid url
                    reject(
                        new EthereumNetworkError(
                            `Invalid ethereum rpc url`,
                            ErrorCode.INVALID_URL
                        )
                    );
                } else {
                    reject(error);
                }
            }
        });
    }

    private reconnectEthereumProvider(rpcEndpoint: string) {
        debug(`Attempting to reconnect ethereum provider...`);
        this.getEthereumProvider(rpcEndpoint)
            .then(provider => {
                this.web3.setProvider(provider);
                // Restart any watch events
                this.unsubscribeBuyContentEvents();
                this.listenForBuyContentEvents();
            })
            .catch(error => {
                // Failed to connect
                setTimeout(() => {
                    this.providerReconnectDebounce = Math.min(
                        this.providerReconnectDebounce * 2,
                        1000 * 60
                    ); // maximum 1 minute retry period
                    this.reconnectEthereumProvider(rpcEndpoint);
                }, this.providerReconnectDebounce);
            });
    }

    private initializeEthereumContracts(): boolean {
        try {
            this.contracts = {
                aoPurchaseReceipt: new this.web3.eth.Contract(
                    AOPurchaseReceipt.abi,
                    AOPurchaseReceipt.networks[this.networkId].address
                ),
                aoContentHost: new this.web3.eth.Contract(
                    AOContentHost.abi,
                    AOContentHost.networks[this.networkId].address
                ),
                aoIon: new this.web3.eth.Contract(
                    AOIon.abi,
                    AOIon.networks[this.networkId].address
                ),
                aoSetting: new this.web3.eth.Contract(
                    AOSetting.abi,
                    AOSetting.networks[this.networkId].address
                )
            };
            return true;
        } catch (error) {
            errorLog(
                `error initializing contracts for network ${this.networkId}:`,
                error
            );
            return false;
        }
    }

    private _handleGetTaoDbKey(request: IAORouterRequest) {
        this.contracts.aoIon.methods
            .settingTAOId()
            .call()
            .then((settingTaoId: string) => {
                this.contracts.aoSetting.methods
                    .getSettingValuesByTAOName(settingTaoId, "taoDbKey")
                    .call()
                    .then(transactionData => {
                        request.respond({ taoDbKey: transactionData[4] });
                    })
                    .catch((error: Error) => {
                        debug(`Error fetching taoDbKey`, error);
                        request.reject(error);
                    });
            })
            .catch((error: Error) => {
                debug(`Error fetching taoDbKey`, error);
                request.reject(error);
            });
    }

    _handleStats(request: IAORouterRequest) {
        let shouldRefetchContentHostCount = false;
        if (this.contentHosts.lastFetched === null) {
            shouldRefetchContentHostCount = true;
        } else if (
            this.contentHosts.lastFetched <
            Date.now() - this.contentHosts.refetchPeriodInMs
        ) {
            shouldRefetchContentHostCount = true;
        }
        if (
            this.connectionStatus === "CONNECTED" &&
            typeof this.contracts !== "undefined" &&
            shouldRefetchContentHostCount
        ) {
            this.contentHosts.lastFetched = Date.now();
            this.contracts.aoContentHost.methods
                .totalContentHosts()
                .call()
                .then(totalContentHosts => {
                    this.contentHosts.totalContentHosts = totalContentHosts;
                    let stats: IAOETH_Stats = {
                        connectionStatus: this.connectionStatus,
                        networkId: this.networkId,
                        totalContentHosts: parseInt(totalContentHosts)
                    };
                    request.respond(stats);
                })
                .catch(request.reject);
        } else {
            let stats: IAOETH_Stats = {
                connectionStatus: this.connectionStatus,
                networkId: this.networkId,
                totalContentHosts: this.contentHosts.totalContentHosts
            };
            request.respond(stats);
        }
    }

    _handleNetworkGet(request: IAORouterRequest) {
        if (this.networkId) {
            request.respond({
                networkId: this.networkId,
                rpcEndpoint: this.rpcEndpoint
            });
        } else {
            request.respond({ networkId: null, rpcEndpoint: null });
        }
    }

    /**
     * This method will begin listening for BuyContent events on the Eth network.
     *
     * route: /eth/events/BuyContent/subscribe
     */
    _listenForBuyContentEvents(request: IAORouterRequest) {
        debug(
            `Attempting to listen for BuyContent events on network[${
                this.networkId
            }]`
        );
        if (this.events.BuyContent) {
            debug(`Warning, already subscribed to BuyContent events`);
            request.respond({ subscribed: true });
        } else {
            this.listenForBuyContentEvents()
                .then(() => {
                    request.respond({ subscribed: true });
                })
                .catch(error => {
                    request.reject(error);
                });
        }
    }

    private listenForBuyContentEvents(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let subscription = this.contracts.aoPurchaseReceipt.events
                    .BuyContent(
                        {
                            fromBlock: 0,
                            toBlock: "latest"
                        },
                        (error, event) => {
                            if (error) {
                                debug(
                                    `BuyContent callback error: ${
                                        error.message
                                    }`
                                );
                            }
                        }
                    )
                    .on("data", event => {
                        const buyContentEvent: BuyContentEvent =
                            event.returnValues;
                        this.router
                            .send(
                                "/core/content/incomingPurchase",
                                buyContentEvent
                            )
                            .then(() => {})
                            .catch(debug);
                    })
                    .on("error", error => {
                        debug(
                            `BuyContent subscription error: ${error.message}`
                        );
                    });
                this.events.BuyContent = subscription;
                resolve();
            } catch (error) {
                debug(
                    `Caught error while trying to subscribe to BuyContent events: ${
                        error.message
                    }`
                );
                reject(error);
            }
        });
    }

    /**
     * route: /eth/events/BuyContent/unsubscribe
     */
    _unsubscribeBuyContentEvents(request: IAORouterRequest) {
        this.unsubscribeBuyContentEvents();
        request.respond({ success: true });
    }

    private unsubscribeBuyContentEvents() {
        if (this.events.BuyContent) {
            debug(
                `Attempting to unsubscribe from BuyContent event listener...`
            );
            this.events.BuyContent.unsubscribe();
            delete this.events.BuyContent;
        }
    }

    /**
     * Get the BuyContent event associated with a specific transaction. Will return
     * status = 0 if the tx failed, or status = 1 and the corresponding event upon success.
     *
     * route: /eth/tx/BuyContent
     *
     *
     * @param request.data.buyer
     * @param request.data.transactionHash
     * @param request.data.contentHostId
     * @returns {status, buyContentEvent}
     */
    _getBuyContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_BuyContentEvent_Data = request.data;
        this._listenForTransactionStatus(requestData.transactionHash)
            .then(({ status, receipt }) => {
                if (status && receipt) {
                    const logs = this.receiptLogParser(
                        receipt.logs,
                        AOPurchaseReceipt.abi
                    );
                    try {
                        const buyContentEvent: BuyContentEvent = logs.find(
                            log => log.event === "BuyContent"
                        ).args;
                        request.respond({ status, buyContentEvent });
                    } catch (error) {
                        debug(
                            `Error reading BuyContent event from a buyContent tx: \n\ttx[${
                                requestData.transactionHash
                            }] \n\tstatus[${status}] \n\treceipt[${receipt}] \n\tlogs[${logs}]`
                        );
                        request.respond({ status: 0 });
                    }
                } else {
                    // Transaction failed
                    request.respond({ status: 0 });
                }
            })
            .catch(request.reject);
    }

    /**
     * route: /eth/tx/HostContent
     *
     *
     * @param request.transactionHash
     * @returns {status, hostContentEvent}
     */
    _getHostContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_HostContentEvent_Data = request.data;
        this._listenForTransactionStatus(requestData.transactionHash)
            .then(({ status, receipt }) => {
                if (status && receipt) {
                    const logs = this.receiptLogParser(
                        receipt.logs,
                        AOContentHost.abi
                    );
                    const hostContentEvent: HostContentEvent = logs.find(
                        log => log.event === "HostContent"
                    ).args;
                    request.respond({
                        status,
                        hostContentEvent
                    });
                } else {
                    // Transaction failed
                    request.respond({ status: 0 });
                }
            })
            .catch(request.reject);
    }

    /**
     * route: /eth/tx/StakeContent
     *
     *
     * @param request.transactionHash
     * @returns {status, hostContentEvent, stakeContentEvent, storeContentEvent}
     */
    _getStakeContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_StakeContentEvent_Data = request.data;
        this._listenForTransactionStatus(requestData.transactionHash)
            .then(({ status, receipt }) => {
                if (status && receipt) {
                    // TODO: These events have been split into multiple contracts with different abi's.
                    // I beleive this means that we will need to run the receiptLogParser multiple times
                    // to extract each event. Also, the HostContent event is the main event being used.
                    const stakedContentLogs = this.receiptLogParser(
                        receipt.logs,
                        AOStakedContent.abi
                    );
                    const stakeContentEvent: StakeContentEvent = stakedContentLogs.find(
                        log => log.event === "StakeContent"
                    ).args;
                    const contentHostLogs = this.receiptLogParser(
                        receipt.logs,
                        AOContentHost.abi
                    );
                    const hostContentEvent: HostContentEvent = contentHostLogs.find(
                        log => log.event === "HostContent"
                    ).args;
                    const contentLogs = this.receiptLogParser(
                        receipt.logs,
                        AOContent.abi
                    );
                    let storeContentEvent: StoreContentEvent = contentLogs.find(
                        log => log.event === "StoreContent"
                    ).args;
                    if (
                        storeContentEvent &&
                        storeContentEvent.contentUsageType
                    ) {
                        storeContentEvent.contentUsageType = this.web3.utils.hexToAscii(
                            storeContentEvent.contentUsageType
                        );
                    }
                    request.respond({
                        status,
                        stakeContentEvent,
                        hostContentEvent,
                        storeContentEvent
                    });
                } else {
                    // Transaction failed
                    request.respond({ status: 0 });
                }
            })
            .catch(request.reject);
    }

    /**
     * This method will fetch the result of a transaction. If the tx is pending or not found,
     * it will begin checking tx status on each incoming block.
     *
     * @param request.transactionHash The tx we want to get result for
     */
    _handleTx(request: IAORouterRequest) {
        const requestData: IAOEth_TX_Data = request.data;
        if (requestData.transactionHash) {
            this._listenForTransactionStatus(requestData.transactionHash)
                .then(({ status }) => {
                    request.respond({ status });
                })
                .catch(request.reject);
        } else {
            request.reject(new Error(`No transaction hash supplied`));
        }
    }

    /**
     * Helper method for getting transaction result (past or future)
     *
     * @param transactionHash
     * @returns {status, receipt}
     */
    private _listenForTransactionStatus(transactionHash: string): Promise<any> {
        const statusFromReciept = receipt =>
            receipt.status === "0x0" || receipt.status === false ? 0 : 1;
        return new Promise((resolve, reject) => {
            // 1. Check for transaction receipt already existing
            this.web3.eth.getTransactionReceipt(
                transactionHash,
                (error, receipt) => {
                    if (receipt) {
                        const status = statusFromReciept(receipt);
                        debug(
                            `Found receipt for tx[${transactionHash}] status[${status}]`
                        );
                        resolve({ status, receipt });
                    } else {
                        // 2. Receipt does not exist, begin listening intently
                        debug(
                            `No receipt found for tx[${transactionHash}], begin listening`
                        );
                        /**
                         * NOTE: infura rpc does not support watch, so we are just going to ping
                         */
                        const receiptChecker = () => {
                            this.web3.eth.getTransactionReceipt(
                                transactionHash,
                                (error, receipt) => {
                                    if (error) {
                                        debug(
                                            `Error checking receipt for tx[${transactionHash}]`,
                                            error
                                        );
                                        reject(error);
                                    } else if (receipt) {
                                        const status = statusFromReciept(
                                            receipt
                                        );
                                        debug(
                                            `Found receipt for tx[${transactionHash}] status[${status}]`
                                        );
                                        // The TX has been added to the chain, now determine status
                                        resolve({ status, receipt });
                                    } else {
                                        // no error and no receipt found on this block, keep listening
                                        debug(
                                            `Receipt still not found for tx[${transactionHash}]`
                                        );
                                        setTimeout(receiptChecker, 10000);
                                    }
                                }
                            );
                        };
                        setTimeout(receiptChecker, 10000);
                        /*
                    const filter = this.web3.eth.filter('latest')
                    filter.watch((error, result) => {
                        if ( error ) {
                            debug(`Watch filter error`, error)
                        } else {
                            debug(`Checking receipt for tx[${transactionHash}]`, error)
                            this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                                if (error) {
                                    debug(`Error checking receipt for tx[${transactionHash}]`, error)
                                    reject(error)
                                } else if (receipt) {
                                    debug(`Found receipt for tx[${transactionHash}]`)
                                    filter.stopWatching()
                                    // The TX has been added to the chain, now determine status
                                    resolve({ status: receipt.status !== '0x0' ? 1 : 0, receipt })
                                } else {
                                    // no error and no receipt found on this block, keep listening
                                    debug(`Receipt still not found for tx[${transactionHash}]`)
                                }
                            })
                        }
                    })
                    */
                    }
                }
            );
        });
    }

    // https://github.com/barkthins/ether-pudding/blob/master/index.js#L23
    private receiptLogParser(logs: Array<any>, abi: any): Array<any> {
        var decoders = abi
            .filter(function(json) {
                return json.type === "event";
            })
            .map(function(json) {
                // note first and third params only required only by enocde and execute;
                // so don't call those!
                return new SolidityEvent(null, json, null);
            });
        return logs.map(function(log) {
            var decoder = decoders.find(function(decoder) {
                if (!log.topics) return false;
                return decoder.signature() == log.topics[0].replace("0x", "");
            });
            if (decoder) {
                return decoder.decode(log);
            } else {
                return log;
            }
        });
    }
}
