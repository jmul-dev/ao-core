import { IGraphqlResolverContext } from '../../http';
import AOContent, { AOContentState } from '../../models/AOContent';
import { AODB_UserContentUpdate_Data, AODB_UserContentGet_Data } from '../../modules/db/db';
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
        // 1. Ensure that the current state of content is: DAT_INITIALIZED
        const getContentDBData: AODB_UserContentGet_Data = {
            query: {
                id: contentId,
                state: AOContentState.DAT_INITIALIZED
            }
        }
        context.router.send('/db/user/content/get',getContentDBData).then( (message: IAORouterMessage) => {
            if(!message.data.length) {
                reject(new Error('Content is in incorrect state for staking'))
                return
            }
            // 2. Update the content state in user db
            let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                id: contentId,
                update: {
                    $set: {
                        "state": AOContentState.STAKING,
                        "transactions.stakeTx": transactionHash
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
        }).catch(reject)

    })
}