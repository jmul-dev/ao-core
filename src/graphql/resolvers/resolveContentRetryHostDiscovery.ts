import { IGraphqlResolverContext } from '../../http';
import AOContent, { AOContentState } from '../../models/AOContent';
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { IAORouterMessage } from "../../router/AORouter";


interface IContentRetryHostDiscovery_Args {
    id: string
}

export default (obj: any, args: IContentRetryHostDiscovery_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // 1. Change content state back to HOST_DISCOVERY
        const contentUpdate: AODB_UserContentUpdate_Data = {
            id: args.id,
            update: {
                $set: {
                    "state": AOContentState.HOST_DISCOVERY
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdate).then((response: IAORouterMessage) => {
            let updatedContent: AOContent = AOContent.fromObject(response.data)
            context.userSession.processContent(updatedContent)
            resolve(updatedContent)
        }).catch(reject)
    })
}