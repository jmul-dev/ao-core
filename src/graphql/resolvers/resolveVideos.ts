import { IGraphqlResolverContext } from '../../http';
import AOContent from '../../models/AOContent';
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';
import { IAORouterMessage } from '../../router/AORouter';
import { AONetworkContent } from '../../models/AONetworkContent';


interface IVideos_Args {
    query?: string;
}

export default (obj: any, args: IVideos_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        //TODO: Add query validation?
        const networkQueryData: AODB_NetworkContentGet_Data = {
            query: {
                status: 'imported'
            },
            fuzzyQuery: args.query,
            contentOnly: false,
        }
        context.router.send('/db/network/content/get', networkQueryData).then((networkContentResponse: IAORouterMessage) => {
            let content = networkContentResponse.data.map((networkContent: AONetworkContent) => {
                let aoContent: AOContent = AOContent.fromObject(networkContent.content)
                aoContent.lastSeenContentHost = networkContent.lastSeenContentHost
                aoContent.isNetworkContent = true
                return aoContent
            }).filter(content => {
                // Filter out current user's content from this feed (so they dont see their own content
                // showing up in the network content listing)
                return content.creatorId !== context.userSession.ethAddress
            }).sort((a, b) => {
                // Sort by last seen host (useful for finding content that is still alive!)
                // if (!b.lastSeenContentHost)
                //     return -1;
                // if (!a.lastSeenContentHost)
                //     return 1;
                // return new Date( parseInt(b.lastSeenContentHost.timestamp) ).getTime() - new Date( parseInt(a.lastSeenContentHost.timestamp) ).getTime();
                // Sort by content createdAt
                return new Date(parseInt(b.createdAt)).getTime() - new Date(parseInt(a.createdAt)).getTime();
            })
            resolve(content)
        }).catch(reject)
    })
}