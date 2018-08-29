import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Web3 from 'web3';
import SolidityEvent from 'web3/lib/web3/event.js';
import Debug from 'debug';
const AOContent = require('ao-contracts/build/contracts/AOContent.json');
const AOToken = require('ao-contracts/build/contracts/AOToken.json');
const debug = Debug('ao:eth');


export interface AOEth_Args {
    rpcMainnet: string;
    rpcRinkeby: string;
}

export interface IAOEth_NetworkChange_Data {
    networkId: '1' | '4'
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

export interface BuyContentEvent {
    buyer: string;
    purchaseId: string;
    contentHostId: string;
    paidNetworkAmount: number;
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

/**
 * AOEth
 * 
 * This is the main fs package for AO. Note all reads/writes are relative
 * to the `storageLocation` argument.
 */
export default class AOEth extends AORouterInterface {
    private web3: Web3;

    private networkId: number;
    private rpcMainnet: string;
    private rpcRinkeby: string;

    private contracts: { // sry no type checking on these bad boys!
        aoToken: any;
        aoContent: any;
    };

    constructor(args: AOEth_Args) {
        super()
        this.rpcMainnet = args.rpcMainnet
        this.rpcRinkeby = args.rpcRinkeby
        this.router.on('/eth/network/set', this._handleNetworkChange.bind(this))
        this.router.on('/eth/tx', this._handleTx.bind(this))
        this.router.on('/eth/tx/BuyContent', this._getBuyContentEventForTransaction.bind(this))
        this.router.on('/eth/tx/HostContent', this._getHostContentEventForTransaction.bind(this))
        this.router.on('/eth/tx/StakeContent', this._getStakeContentEventForTransaction.bind(this))
        debug(`started`)
    }

    _handleNetworkChange(request: IAORouterRequest) {
        const requestData: IAOEth_NetworkChange_Data = request.data;
        if (['1', '4'].indexOf(requestData.networkId) < 0) {
            debug(`Network currently not supported: ${requestData.networkId}`)
            request.reject(new Error(`Network currently not supported: ${requestData.networkId}`))
            return;
        }
        if (this.web3)
            this.web3.reset()  // clears any filters etc that may have already existed
        let rpcEndpoint = this.rpcMainnet
        if (requestData.networkId === '1')  // mainnet
            rpcEndpoint = this.rpcMainnet
        else if (requestData.networkId === '4')  // rinkeby
            rpcEndpoint = this.rpcRinkeby
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))
        this.web3.version.getNetwork((error, networkId) => {
            if (error) {
                debug('Error getting network:', error)
                request.reject(error)
            } else {
                debug(`Connected to network with id [${networkId}]`)
                this.networkId = networkId
                // Setup contracts
                try {
                    this.contracts = {
                        aoContent: this.web3.eth.contract(AOContent.abi).at(AOContent.networks[this.networkId].address),
                        aoToken: this.web3.eth.contract(AOToken.abi).at(AOToken.networks[this.networkId].address)
                    }
                    request.respond({ networkId })
                } catch (error) {
                    request.reject(new Error(`Error initializing contracts for network: ${networkId}. ${error.message}`))
                }
            }
        })
    }

    /**
     * This method will query and/or listen for a BuyContent event on the AOContent
     * contract. Will return status = 0 if the tx failed, or status = 1 and the 
     * corresponding event upon success.
     * 
     * route: /eth/events/BuyContent
     * 
     * 
     * @param request.buyer
     * @param request.transactionHash
     * @param request.contentHostId
     * @returns {status, event} 
     */
    _getBuyContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_BuyContentEvent_Data = request.data;
        this._listenForTransactionStatus(requestData.transactionHash).then(({ status, receipt }) => {
            if (status && receipt) {
                const logs = this.receiptLogParser(receipt.logs, this.contracts.aoContent.abi)
                const buyContentEvent: BuyContentEvent = logs.find(log => log.event === 'BuyContent').args;
                request.respond({ status, buyContentEvent })
            } else {
                // Transaction failed
                request.respond({ status: 0 })
            }
        }).catch(request.reject)
    }

    /**
     * route: /eth/events/HostContent
     * 
     * 
     * @param request.transactionHash
     * @returns {status, hostContentEvent} 
     */
    _getHostContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_HostContentEvent_Data = request.data;
        this._listenForTransactionStatus(requestData.transactionHash).then(({ status, receipt }) => {
            if (status && receipt) {
                const logs = this.receiptLogParser(receipt.logs, this.contracts.aoContent.abi)
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

    _getStakeContentEventForTransaction(request: IAORouterRequest) {
        const requestData: IAOEth_StakeContentEvent_Data = request.data
        this._listenForTransactionStatus(requestData.transactionHash).then(({ status, receipt }) => {
            if (status && receipt) {
                const logs = this.receiptLogParser(receipt.logs, this.contracts.aoContent.abi)
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
        return new Promise((resolve, reject) => {
            // 1. Check for transaction receipt already existing
            this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                if (receipt) {
                    resolve({ status: receipt.status !== '0x0' ? 1 : 0, receipt })
                } else {
                    // 2. Receipt does not exist, begin listening intently
                    const filter = this.web3.eth.filter('latest')
                    filter.watch((error, result) => {
                        this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                            if (error) {
                                reject(error)
                            } else if (receipt) {
                                filter.stopWatching()
                                // The TX has been added to the chain, now determine status
                                resolve({ status: receipt.status !== '0x0' ? 1 : 0, receipt })
                            } else {
                                // no error and no receipt found on this block, keep listening
                            }
                        })
                    })
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
