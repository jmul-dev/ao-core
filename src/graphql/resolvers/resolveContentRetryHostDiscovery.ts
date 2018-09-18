import { IGraphqlResolverContext } from '../../http';
import AOContent, { AOContentState } from '../../models/AOContent';
import { AODB_UserContentUpdate_Data, AODB_UserContentGet_Data } from '../../modules/db/db';
import { IAORouterMessage } from "../../router/AORouter";


interface IContentRetryHostDiscovery_Args {
    id: string
}

export default (obj: any, args: IContentRetryHostDiscovery_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // 0. Make sure this only takes place in the HOST_DISCOVERY_FAILED state
        let userContentQuery: AODB_UserContentGet_Data = {
            query: { id: args.id }
        }
        context.router.send('/db/user/content/get', userContentQuery).then((response: IAORouterMessage) => {
            if ( response.data && response.data.length > 0 ) {
                const existingContent: AOContent = AOContent.fromObject(response.data[0])
                if ( existingContent.state !== AOContentState.HOST_DISCOVERY_FAILED ) {
                    reject(new Error(`Attempting to retry host discovery for content from invalid state ${existingContent.state}, expected ${AOContentState.HOST_DISCOVERY_FAILED}`))
                    return null;
                }
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
            } else {
                reject(new Error(`Content not found`))
            }            
        }).catch(reject)        
    })
}