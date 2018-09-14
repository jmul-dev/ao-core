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
                return aoContent
            })
            resolve(content)
        }).catch(reject)
    })
}