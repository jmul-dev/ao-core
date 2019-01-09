import AORouterInterface, {
    IAORouterRequest,
    AORouterSubprocessArgs
} from "../../router/AORouterInterface";
import Web3 from "web3";
import SolidityEvent from "web3-legacy/lib/web3/event.js";
import Debug from "../../AODebug";
import { IAOStatus } from "../../models/AOStatus";
import { AOP2P_Init_Data } from "../p2p/p2p";
const AOContent = require("ao-contracts/build/contracts/AOContent.json");
const AOToken = require("ao-contracts/build/contracts/AOToken.json");
const AOSetting = require("ao-contracts/build/contracts/AOSetting.json");
const debug = Debug("ao:eth");

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
    purchaseId: string;
    contentHostId: string;
    paidNetworkAmount: number;
    publicKey: string;
    publicAddress: string;
    createdOnTimestamp: number;
}
export interface StakeContentEvent {
    stakeOwner: string;
    stakeId: string;
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
    stakeId: string;
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

export interface AOEthProcessArgs extends AORouterSubprocessArgs {
    rpcEndpoint: string;
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

    private contracts: {
        // sry no type checking on these bad boys!
        aoToken: any;
        aoContent: any;
        aoSetting: any;
    };

    private events: {
        BuyContent: Subscription;
    };

    constructor(args: AOEthProcessArgs) {
        super(args);
        this.networkId = `${args.ethNetworkId}`;
        this.rpcEndpoint = args.rpcEndpoint;
        this.events = {
            BuyContent: undefined
        };
        this.router.on("/eth/init", this._handleInit.bind(this));
        this.router.on(
            "/eth/settings/taoDbKey",
            this._handleGetTaoDbKey.bind(this)
        );
        this.router.on("/eth/stats", this._handleStats.bind(this));
        this.router.on(
            "/eth/network/set",
            this._handleNetworkChange.bind(this)
        );
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
        debug(`started with network id: ${args.ethNetworkId}`);
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
        const ethNetworkId = this.networkId;
        if (ethNetworkRpc) {
            this.rpcEndpoint = ethNetworkRpc;
        }
        const ethRpcEndpoint = this.rpcEndpoint;
        const deployedNetworks = Object.keys(AOSetting.networks);
        if (deployedNetworks.indexOf(`${ethNetworkId}`) === -1) {
            return request.reject(
                new Error(
                    `AO contracts have not been deployed to the desired network [${ethNetworkId}], contracts are deployed to networks [${deployedNetworks.join(
                        ","
                    )}]`
                )
            );
        }
        this.connectToNetwork(ethNetworkId)
            .then(networkId => {
                if (`${networkId}` !== `${ethNetworkId}`) {
                    return request.reject(
                        new Error(
                            `Ethereum network id mismatch. The rpc provided [${ethRpcEndpoint}] returned a network id of [${networkId}], expected [${ethNetworkId}]`
                        )
                    );
                }
                request.respond({});
            })
            .catch(error => {
                request.reject(error);
            });
    }

    /**
     * NOTE: this method attempts to connect to the given network via web3.
     * If the connection fails, it will continue to retry until it makes a
     * connection.
     *
     * @param networkId
     */
    private connectToNetwork(networkId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.connectionStatus = "CONNECTING";
            const rpcEndpoint = this.rpcEndpoint;
            const deployedNetworks = Object.keys(AOSetting.networks);
            if (deployedNetworks.indexOf(`${networkId}`) < 0) {
                this.connectionStatus = "ERROR";
                debug(`Network currently not supported: ${networkId}`);
                reject(
                    new Error(`Network currently not supported: ${networkId}`)
                );
                return;
            }
            if (rpcEndpoint.indexOf("wss://") !== 0) {
                debug(
                    `Eth module currently requires web socket rpc endpoint in order to support filters`
                );
                reject(
                    new Error(
                        `Invalid eth network rpc, requires websocket connection.`
                    )
                );
                this.connectionStatus = "ERROR";
                return;
            }
            this.setNetworkProvider(rpcEndpoint);
            this.web3.eth.net
                .getId()
                .then(networkId => {
                    debug(`Connected to network with id [${networkId}]`);
                    this.networkId = `${networkId}`;
                    // Setup contracts
                    try {
                        this.contracts = {
                            aoContent: new this.web3.eth.Contract(
                                AOContent.abi,
                                AOContent.networks[this.networkId].address
                            ), //.at(AOContent.networks[this.networkId].address),
                            aoToken: new this.web3.eth.Contract(
                                AOToken.abi,
                                AOToken.networks[this.networkId].address
                            ), //.at(AOToken.networks[this.networkId].address)
                            aoSetting: new this.web3.eth.Contract(
                                AOSetting.abi,
                                AOSetting.networks[this.networkId].address
                            )
                        };
                        this.connectionStatus = "CONNECTED";
                        resolve(this.networkId);
                    } catch (error) {
                        this.connectionStatus = "ERROR";
                        return reject(
                            new Error(
                                `Error initializing contracts for network: ${networkId}. ${
                                    error.message
                                }`
                            )
                        );
                    }
                })
                .catch(error => {
                    debug("Error getting network:", error);
                    this.connectionStatus = "ERROR";
                    // TODO: may need to rethink this retry mechanism now that rpc endpoint is overridable
                    setTimeout(() => {
                        this.connectToNetwork(networkId)
                            .then(resolve)
                            .catch(reject);
                    }, 3000);
                });
        });
    }

    private setNetworkProvider(rpcEndpoint: string) {
        const provider = new Web3.providers.WebsocketProvider(rpcEndpoint);
        provider.on("error", (error?) => {
            debug("Web3 Provider Error", error);
        });
        provider.on("end", (error?) => {
            debug("Web3 Provider END", error);
            this.connectionStatus = "DISCONNECTED";
            // Attempt to reconnect
            setTimeout(() => {
                this.providerReconnectDebounce = Math.min(
                    this.providerReconnectDebounce * 2,
                    1000 * 60
                ); // maximum 1 minute retry period
                this.setNetworkProvider(rpcEndpoint);
            }, this.providerReconnectDebounce);
        });
        provider.on("connect", () => {
            debug("Web3 Provider Connected");
            this.connectionStatus = "CONNECTED";
        });
        if (this.web3) this.web3.setProvider(provider);
        else this.web3 = new Web3(provider);
    }

    private _handleGetTaoDbKey(request: IAORouterRequest) {
        // TODO: see #133
        this.contracts.aoSetting.methods
            .getSettingValuesByThoughtName(
                "0x939b070c66152b3e7efb52ec631d680270ce14c4",
                "taoDbKey"
            )
            .call()
            .then(transactionData => {
                request.respond({ taoDbKey: transactionData[4] });
            })
            .catch(e => {
                debug(`Error fetching taoDbKey`, e);
                request.reject(e);
            });
    }

    private _getTaoDBKey() {
        return new Promise((resolve, reject) => {
            this.contracts.aoSetting.methods
                .getSettingValuesByThoughtName(
                    "0x939b070c66152b3e7efb52ec631d680270ce14c4",
                    "taoDbKey"
                )
                .call()
                .then(data => {
                    if (data[4].length == 64) {
                        resolve(data[4]);
                    } else {
                        reject();
                    }
                })
                .catch(e => {
                    debug(e);
                    reject(e);
                });
        });
    }

    _handleStats(request: IAORouterRequest) {
        if (
            this.connectionStatus === "CONNECTED" &&
            typeof this.contracts !== "undefined"
        ) {
            this.contracts.aoContent.methods
                .totalContentHosts()
                .call()
                .then(totalContentHosts => {
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
                totalContentHosts: undefined
            };
            request.respond(stats);
        }
    }

    _handleNetworkChange(request: IAORouterRequest) {
        const requestData: IAOEth_NetworkChange_Data = request.data;
        // Check if we are already connected (to avoid uneccesarilly reconnecting)
        if (this.web3) {
            this.web3.eth.net.getId().then(networkId => {
                if (`${networkId}` === `${requestData.networkId}`) {
                    request.respond({ networkId });
                } else {
                    this.connectToNetwork(requestData.networkId)
                        .then(request.respond)
                        .catch(request.reject);
                }
            });
        } else {
            this.connectToNetwork(requestData.networkId)
                .then(request.respond)
                .catch(request.reject);
        }
    }

    _handleNetworkGet(request: IAORouterRequest) {
        if (this.networkId) {
            request.respond({ networkId: this.networkId });
        } else {
            request.respond({ networkId: null });
        }
    }

    /**
     * This method will begin listening for BuyContent events on the Eth network.
     *
     * route: /eth/events/BuyContent/subscribe
     */
    _listenForBuyContentEvents(request: IAORouterRequest) {
        const requestData: IAOEth_Events_BuyContent_Data = request.data;
        debug(
            `Attempting to listen for BuyContent events on network[${
                this.networkId
            }]`
        );
        if (this.events.BuyContent) {
            debug(`Warning, already subscribed to BuyContent events`);
            request.respond({ subscribed: true });
        } else {
            let responded = false;
            try {
                let subscription = this.contracts.aoContent.events
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
                        // Disregard BuyContent events from the current user
                        if (
                            buyContentEvent.buyer &&
                            buyContentEvent.buyer.toLowerCase() !==
                                request.ethAddress.toLowerCase()
                        ) {
                            this.router
                                .send(
                                    "/core/content/incomingPurchase",
                                    buyContentEvent
                                )
                                .then(() => {})
                                .catch(debug);
                        }
                    })
                    .on("error", error => {
                        debug(
                            `BuyContent subscription error: ${error.message}`
                        );
                        if (!responded) {
                            request.reject(error);
                            responded = true;
                        }
                    });
                this.events.BuyContent = subscription;
                request.respond({ subscribed: true });
                responded = true;
            } catch (error) {
                debug(
                    `Caught error while trying to subscribe to BuyContent events: ${
                        error.message
                    }`
                );
                request.reject(error);
                responded = true;
            }
        }
    }

    /**
     * route: /eth/events/BuyContent/unsubscribe
     */
    _unsubscribeBuyContentEvents(request: IAORouterRequest) {
        let subscriptionsCancelled = 0;
        if (this.events.BuyContent) {
            this.events.BuyContent.unsubscribe();
            delete this.events.BuyContent;
            subscriptionsCancelled++;
        }
        request.respond({ success: true, subscriptionsCancelled });
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
                        AOContent.abi
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
                        AOContent.abi
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
                    const logs = this.receiptLogParser(
                        receipt.logs,
                        AOContent.abi
                    );
                    const stakeContentEvent: StakeContentEvent = logs.find(
                        log => log.event === "StakeContent"
                    ).args;
                    const hostContentEvent: HostContentEvent = logs.find(
                        log => log.event === "HostContent"
                    ).args;
                    let storeContentEvent: StoreContentEvent = logs.find(
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
