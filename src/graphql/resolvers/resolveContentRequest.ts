import { IGraphqlResolverContext } from '../../http';
import AOContent, { AOContentState } from '../../models/AOContent';
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';
import { IAORouterMessage } from "../../router/AORouter";


interface IContentRequest_Args {
    metadataDatKey: string
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // 1. Pull the Content from network content db
        let networkContentQuery: AODB_NetworkContentGet_Data = {
            query: { _id: args.metadataDatKey },
            contentOnly: true,
        }
        context.router.send('/db/network/content/get', networkContentQuery).then((response: IAORouterMessage) => {
            if (!response.data || response.data.length !== 1) {
                reject(new Error(`No discovered content with id: ${args.metadataDatKey}`))
                return;
            }
            // 2. Insert the content into user db (they have begun the content purchase/hosting process)
            let updatedContent: AOContent = AOContent.fromObject({
                ...response.data[0],
                nodeId: context.userSession.id,
                state: AOContentState.HOST_DISCOVERY,
            })
            context.router.send('/db/user/content/insert', updatedContent.toRawJson()).then((insertResponse: IAORouterMessage) => {
                resolve(updatedContent)
                context.userSession.processContent(updatedContent)
            }).catch(reject)
        }).catch(reject)
    })
}