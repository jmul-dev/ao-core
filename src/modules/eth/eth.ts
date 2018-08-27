import AORouterInterface, { IAORouterRequest } from "../../router/AORouterInterface";
import Web3 from 'web3';
import Debug from 'debug';
import { resolve } from "url";
const AOContent = require('ao-contracts/build/contracts/AOContent.json');
const debug = Debug('ao:eth');


export interface AOEth_Args {
    rpcMainnet: string;
    rpcRinkeby: string;
}

export interface IAOEth_NetworkChange_Data {
    networkId: '1' | '4'
}

export interface IAOEth_ContentIsStaked_Data {
    contentId: string;
}

export interface IAOEth_TX_Data {
    transactionHash: string;
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

    constructor(args: AOEth_Args) {
        super()
        this.rpcMainnet = args.rpcMainnet
        this.rpcRinkeby = args.rpcRinkeby
        this.router.on('/eth/network/set', this._handleNetworkChange.bind(this))
        this.router.on('/eth/content/isStaked', this._handleContentIsStaked.bind(this))        
        this.router.on('/eth/tx', this._handleTx.bind(this))
        debug(`started`)
    }

    _handleNetworkChange(request: IAORouterRequest) {
        const requestData: IAOEth_NetworkChange_Data = request.data;
        if ( ['1', '4'].indexOf(requestData.networkId) < 0 ) {
            debug(`Network currently not supported: ${requestData.networkId}`)
            request.reject(new Error(`Network currently not supported: ${requestData.networkId}`))
            return;
        }
        if ( this.web3 )
            this.web3.reset()  // clears any filters etc that may have already existed
        let rpcEndpoint = this.rpcMainnet
        if ( requestData.networkId === '1' )  // mainnet
            rpcEndpoint = this.rpcMainnet
        else if ( requestData.networkId === '4' )  // rinkeby
            rpcEndpoint = this.rpcRinkeby
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))        
        this.web3.version.getNetwork((error, networkId) => {
            if ( error ) {
                debug('Error getting network:', error)
                request.reject(error)
            } else {
                debug(`Connected to network with id [${networkId}]`)
                this.networkId = networkId
                request.respond({
                    networkId
                })
            }
        })        
    }

    _handleContentIsStaked(request: IAORouterRequest) {
        const requestData: IAOEth_ContentIsStaked_Data = request.data;
        try {
            const aoContent = this.web3.eth.contract(AOContent.abi).at(AOContent.networks[this.networkId].address)
            // TODO: check if content is staked
            request.respond(true)
        } catch( error ) {
            debug('Error checking if content is staked:', error)
            request.reject(error)
        }
    }

    /**
     * This method will fetch the result of a transaction. If the tx is pending or not found,
     * it will begin checking tx status on each incoming block.
     * 
     * @param request.transactionHash The tx we want to get result for
     */
    _handleTx(request: IAORouterRequest) {
        const requestData: IAOEth_TX_Data = request.data;
        if ( requestData.transactionHash ) {            
            this._listenForTransactionStatus(requestData.transactionHash).then(({status}) => {
                request.respond({status})
            }).catch(request.reject)
        } else {
            request.reject(new Error(`No transaction hash supplied`))
        }
    }

    private _listenForTransactionStatus(transactionHash: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // 1. Check for transaction receipt already existing
            this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                if ( receipt ) {
                    resolve({status: receipt.status !== '0x0'})
                } else {
                    // 2. Receipt does not exist, begin listening intently
                    const filter = this.web3.eth.filter('latest')
                    filter.watch((error, result) => {
                        this.web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
                            if ( error ) {
                                reject(error)
                            } else if ( receipt ) {
                                filter.stopWatching()
                                // The TX has been added to the chain, now determine status
                                resolve({status: receipt.status !== '0x0'})
                            } else {
                                // no error and no receipt found on this block, keep listening
                            }
                        })
                    })
                }
            })
        })
    }
}
