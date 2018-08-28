import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOContentState } from '../../models/AOContent';
import { IAOEth_BuyContentEvent_Data, BuyContentEvent } from '../../modules/eth/eth';
const debug = Debug('ao:graphql:contentPurchaseTransaction')


interface IContentRequest_Args {
    inputs: {
        transactionHash: string;
        contentId: string;
    }
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // TODO: make sure the content being updated does not go `backwards` in state (ex: going from PURCHASED -> PURCHASING)
        // 1. Update the content state in user db
        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
            id: args.inputs.contentId,
            update: {
                $set: {
                    "state": AOContentState.PURCHASING,
                    "transactions.purchaseTx": args.inputs.transactionHash
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
            if ( !response.data ) {
                reject(new Error(`Failed to update content state`))
                return;
            }            
            // 2. Begin listening for tx status
            let buyContentEventArgs: IAOEth_BuyContentEvent_Data = {
                transactionHash: args.inputs.transactionHash
            }
            // 3. We are resolving without waiting for tx status and BuyContent event
            resolve(response.data)
            // 4. Still listen for event completion/failure
            context.router.send('/eth/tx/BuyContent', buyContentEventArgs).then((response: IAORouterMessage) => {
                const { status } = response.data
                const event: BuyContentEvent = response.data.event
                let contentUpdateAfterTx: AODB_UserContentUpdate_Data = {
                    id: args.inputs.contentId,
                    update: {}
                }
                if ( status && event ) {
                    // 5a. Succesful transaction
                    contentUpdateAfterTx.update = {
                        $set: {
                            "state": AOContentState.PURCHASED,
                            "purchaseId": event.purchaseId,
                            "nodeId": event.contentHostId,
                        }
                    }
                } else {
                    // 5b. Transaction failed :(, go back to previous state
                    contentUpdateAfterTx.update = {
                        $set: {
                            "state": AOContentState.DOWNLOADED,
                            "transactions.purchaseTx": null,
                        }
                    }                    
                }
                context.router.send('/db/user/content/update', contentUpdateAfterTx)
            }).catch(error => {
                debug(error)
                // NOTE: failed to get tx status. I dont think it makes sense to roll content state
                // back (as the tx could still be vaild). For now let's just leave in limbo, but might
                // want to check again.
            })
        }).catch(reject)
    })
}