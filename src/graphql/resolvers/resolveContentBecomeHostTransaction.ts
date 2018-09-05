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
        const { contentId, transactionHash } = args.inputs
        // 1. Update the content state in user db
        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
            id: contentId,
            update: {
                $set: {
                    "state": AOContentState.STAKING,
                    "transactions.hostTx": transactionHash
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
            if (!response.data) {
                reject(new Error(`Failed to update content state`))
                return;
            }
            const content: AOContent = AOContent.fromObject(response.data)
            resolve(content)
            context.userSession.processContent(content)
        }).catch(reject)
    })
}