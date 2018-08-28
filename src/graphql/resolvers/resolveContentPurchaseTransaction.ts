import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOContentState } from '../../models/AOContent';
import { IAOEth_BuyContentEvent_Data } from '../../modules/eth/eth';

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
            context.router.send('/eth/tx/BuyContent', buyContentEventArgs);
            // NOTE: we are resolving without waiting for tx status and BuyContent event
            resolve(response.data)
        }).catch(reject)
    })
}