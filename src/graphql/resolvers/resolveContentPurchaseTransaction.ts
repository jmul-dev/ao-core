import { IGraphqlResolverContext } from '../../http';
import AOContent, { AOContentState } from '../../models/AOContent';
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { IAORouterMessage } from "../../router/AORouter";


interface IContentRequest_Args {
    inputs: {
        transactionHash: string;
        contentId: string;
    }
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
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
            // 2. State is now in PURCHASING, begin listening for tx result
            const content: AOContent = AOContent.fromObject(response.data)
            context.userSession.processContent( content )
            resolve( content )
        }).catch(reject)
    })
}