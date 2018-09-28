import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Web3 from 'web3';
import SolidityEvent from 'web3-legacy/lib/web3/event.js';
import Debug from '../../AODebug'
const AOContent = require('ao-contracts/build/contracts/AOContent.json');
const AOToken = require('ao-contracts/build/contracts/AOToken.json');
const debug = Debug('ao:eth');


export interface AOEth_Args {
    network: string;
    rpcMainnet: string;
    rpcRinkeby: string;
}

export interface IAOEth_NetworkChange_Data {
    networkId: '1' | '3' | '4'
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
export interface IAOEth_Events_BuyContent_Data {
}

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

interface Subscription {
    unsubscribe(callBack?: (Error, boolean) => void): void | boolean
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
    private rpcMainnet: string;
    private rpcRopsten: string;
    private rpcRinkeby: string;    

    private contracts: { // sry no type checking on these bad boys!
        aoToken: any;
        aoContent: any;
    };

    private events: {
        BuyContent: Subscription;
    }

    constructor(args: AOEth_Args) {
        super()
        this.rpcMainnet = args.rpcMainnet
        this.rpcRinkeby = args.rpcRinkeby
        this.events = {
            BuyContent: undefined
        }
        this.router.on('/eth/network/set', this._handleNetworkChange.bind(this))
        this.router.on('/eth/network/get', this._handleNetworkGet.bind(this))
        this.router.on('/eth/tx', this._handleTx.bind(this))
        this.router.on('/eth/tx/BuyContent', this._getBuyContentEventForTransaction.bind(this))
        this.router.on('/eth/tx/HostContent', this._getHostContentEventForTransaction.bind(this))
        this.router.on('/eth/tx/StakeContent', this._getStakeContentEventForTransaction.bind(this))
        this.router.on('/eth/events/BuyContent/subscribe', this._listenForBuyContentEvents.bind(this))
        this.router.on('/eth/events/BuyContent/unsubscribe', this._unsubscribeBuyContentEvents.bind(this))
        debug(`started`)
    }

    /**
     * NOTE: this method attempts to connect to the given network via web3.
     * If the connection fails, it will continue to retry until it makes a 
     * connection.
     * 
     * @param networkId 
     */
    private connectToNetwork(networkId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (['1', '3', '4'].indexOf(networkId) < 0) {
                debug(`Network currently not supported: ${networkId}`)
                reject(new Error(`Network currently not supported: ${networkId}`))
                return;
            }
            let rpcEndpoint = this.rpcMainnet
            if (networkId === '1')  // mainnet
                rpcEndpoint = this.rpcMainnet
            else if (networkId === '3')  // ropsten
                rpcEndpoint = this.rpcRopsten
            else if (networkId === '4')  // rinkeby
                rpcEndpoint = this.rpcRinkeby
            if ( rpcEndpoint.indexOf('wss://') !== 0 ) {
                debug(`Eth module currently requires web socket rpc endpoint in order to support filters`)
                reject(new Error(`Invalid eth network rpc, requires websocket connection.`))
                return;
            }
            this.setNetworkProvider(rpcEndpoint)
            this.web3.eth.net.getId().then(networkId => {
                debug(`Connected to network with id [${networkId}]`)
                this.networkId = `${networkId}`
                // Setup contracts
                try {
                    this.contracts = {
                        aoContent: new this.web3.eth.Contract(AOContent.abi, AOContent.networks[this.networkId].address), //.at(AOContent.networks[this.networkId].address),
                        aoToken: new this.web3.eth.Contract(AOToken.abi, AOToken.networks[this.networkId].address), //.at(AOToken.networks[this.networkId].address)
                    }
                    resolve({ networkId: this.networkId })
                } catch (error) {
                    reject(new Error(`Error initializing contracts for network: ${networkId}. ${error.message}`))
                }
            }).catch(error => {
                debug('Error getting network:', error)
                setTimeout(() => {
                    this.connectToNetwork(networkId).then(resolve).catch(reject)
                }, 3000)
            })
        })
    }

    private setNetworkProvider(rpcEndpoint: string) {
        const provider = new Web3.providers.WebsocketProvider(rpcEndpoint)
        provider.on('error', (error?) => {
            debug('Web3 Provider Error', error)
        });
        provider.on('end', (error?) => {
            debug('Web3 Provider END', error)
            // Attempt to reconnect
            this.setNetworkProvider(rpcEndpoint)
        });
        provider.on('connect', () => {
            debug('Web3 Provider Connected')
        });
        if ( this.web3 )
            this.web3.setProvider(provider)
        else
            this.web3 = new Web3(provider)
    }

    _handleNetworkChange(request: IAORouterRequest) {
        const requestData: IAOEth_NetworkChange_Data = request.data;
        // Check if we are already connected (to avoid uneccesarilly reconnecting)
        if ( this.web3 ) {
            this.web3.eth.net.getId().then(networkId => {
                if ( `${networkId}` === `${requestData.networkId}` ) {
                    request.respond({networkId})
                } else {
                    this.connectToNetwork(requestData.networkId).then(request.respond).catch(request.reject)
                }
            })
        } else {
            this.connectToNetwork(requestData.networkId).then(request.respond).catch(request.reject)
        }        
    }
    
    _handleNetworkGet(request: IAORouterRequest) {
        if( this.networkId ) {
            request.respond({networkId: this.networkId})
        } else {
            request.respond({networkId: null})
        }
    }

    /**
     * This method will begin listening for BuyContent events on the Eth network.
     * 
     * route: /eth/events/BuyContent/subscribe
     */
    _listenForBuyContentEvents(request: IAORouterRequest) {
        const requestData: IAOEth_Events_BuyContent_Data = request.data;
        debug(`Attempting to listen for BuyContent events on network[${this.networkId}]`)
        if ( this.events.BuyContent ) {
            debug(`Warning, already subscribed to BuyContent events`)
            request.respond({subscribed: true})
        } else {
            let responded = false
            try {
                let subscription = this.contracts.aoContent.events.BuyContent({
                    fromBlock: 0,
                    toBlock: 'latest',
                }, (error, event) => {
                    if ( error ) {
                        debug(`BuyContent callback error: ${error.message}`)
                    }
                }).on('data', event => {
                    const buyContentEvent: BuyContentEvent = event.returnValues
                    // Disregard BuyContent events from the current user
                    if ( buyContentEvent.buyer && buyContentEvent.buyer.toLowerCase() !== request.ethAddress.toLowerCase() ) {
                        this.router.send('/core/content/incomingPurchase', buyContentEvent).then(() => {
                            
                        }).catch(debug)
                    }
                }).on('error', (error) => {
                    debug(`BuyContent subscription error: ${error.message}`)
                    if ( !responded ) {
                        request.reject(error)
                        responded = true
                    }
                })
                this.events.BuyContent = subscription
                request.respond({subscribed: true})
                responded = true
            } catch (error) {
                debug(`Caught error while trying to subscribe to BuyContent events: ${error.message}`)
                request.reject(error)
                responded = true
            }
        }
    }

    /**
     * route: /eth/events/BuyContent/unsubscribe
     */
    _unsubscribeBuyContentEvents(request: IAORouterRequest) {
        let subscriptionsCancelled = 0
        if ( this.events.BuyContent ) {
            this.events.BuyContent.unsubscribe()
            delete this.events.BuyContent
            subscriptionsCancelled++;
        }
        request.respond({success: true, subscriptionsCancelled})
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
        this._listenForTransactionStatus(requestData.transactionHash).then(({ status, receipt }) => {
            if (status && receipt) {
                const logs = this.receiptLogParser(receipt.logs, AOContent.abi)
                try {
                    const buyContentEvent: BuyContentEvent = logs.find(log => log.event === 'BuyContent').args;
                    request.respond({ status, buyContentEvent })
                } catch (error) {
                    debug(`Error reading BuyContent event from a buyContent tx: \n\ttx[${requestData.transactionHash}] \n\tstatus[${status}] \n\treceipt[${receipt}] \n\tlogs[${logs}]`)
                    request.respond({ status: 0 })
                }
            } else {
                // Transaction failed
                request.respond({ status: 0 })
            }
        }).catch(request.reject)
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
        this._listenForTransactionStatus(requestData.transactionHash).then(({ status, receipt }) => {
            if (status && receipt) {
                const logs = this.receiptLogParser(receipt.logs, AOContent.abi)
                const hostContentEvent: HostContentEvent = logs.find(log => log.event === 'HostContent').args;
                request.respond({
                    status,
                    hostContentEvent,
                })
            } else {
                // Transaction failed
                request.respond({ status: 0 })
            }
        }).catch(request.reject)
    }

    /**
     * route: /eth/tx/StakeContent
     * 
     * 
     * @param request.transactionHash
     * @returns {status, hostContentEvent, stakeContentEvent} 
     */
    _getStakeContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_StakeContentEvent_Data = request.data
        this._listenForTransactionStatus(requestData.transactionHash).then(({ status, receipt }) => {
            if (status && receipt) {
                const logs = this.receiptLogParser(receipt.logs, AOContent.abi)
                const stakeContentEvent: StakeContentEvent = logs.find(log => log.event === 'StakeContent').args;
                const hostContentEvent: HostContentEvent = logs.find(log => log.event === 'HostContent').args;
                request.respond({
                    status,
                    stakeContentEvent,
                    hostContentEvent,
                })
            } else {
                // Transaction failed
                request.respond({ status: 0 })
            }
        }).catch(request.reject)
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
            this._listenForTransactionStatus(requestData.transactionHash).then(({ status }) => {
                request.respond({ status })
            }).catch(request.reject)
        } else {
            request.reject(new Error(`No transaction hash supplied`))
        }
    }

    /**
     * Helper method for getting transaction result (past or future)
     * 
     * @param transactionHash
     * @returns {status, receipt} 
     */
    private _listenForTransactionStatus(transactionHash: string): Promise<any> {
        const statusFromReciept = receipt => receipt.status === '0x0' || receipt.status === false ? 0 : 1
        return new Promise((resolve, reject) => {
            // 1. Check for transaction receipt already existing
            this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                if (receipt) {
                    const status = statusFromReciept(receipt)
                    debug(`Found receipt for tx[${transactionHash}] status[${status}]`)
                    resolve({ status, receipt })
                } else {
                    // 2. Receipt does not exist, begin listening intently
                    debug(`No receipt found for tx[${transactionHash}], begin listening`)
                    /**
                     * NOTE: infura rpc does not support watch, so we are just going to ping
                     */
                    const receiptChecker = () => {
                        this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                            if (error) {
                                debug(`Error checking receipt for tx[${transactionHash}]`, error)
                                reject(error)
                            } else if (receipt) {
                                const status = statusFromReciept(receipt)
                                debug(`Found receipt for tx[${transactionHash}] status[${status}]`)
                                // The TX has been added to the chain, now determine status
                                resolve({ status, receipt })
                            } else {
                                // no error and no receipt found on this block, keep listening
                                debug(`Receipt still not found for tx[${transactionHash}]`)
                                setTimeout(receiptChecker, 10000)
                            }
                        })
                    }
                    setTimeout(receiptChecker, 10000)
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
            })
        })
    }

    // https://github.com/barkthins/ether-pudding/blob/master/index.js#L23
    private receiptLogParser(logs: Array<any>, abi: any): Array<any> {
        var decoders = abi.filter(function (json) {
            return json.type === 'event';
        }).map(function (json) {
            // note first and third params only required only by enocde and execute;
            // so don't call those!
            return new SolidityEvent(null, json, null);
        });   
        return logs.map(function (log) {
            var decoder = decoders.find(function (decoder) {
                return (decoder.signature() == log.topics[0].replace("0x", ""));
            })
            if (decoder) {
                return decoder.decode(log);
            } else {
                return log;
            }
        })
    }
}
