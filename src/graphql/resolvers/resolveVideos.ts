import { IGraphqlResolverContext } from '../../http';
import AOContent from '../../models/AOContent';
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';
import { IAORouterMessage } from '../../router/AORouter';


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
            contentOnly: true,
        }
        context.router.send('/db/network/content/get', networkQueryData).then((networkContentResponse: IAORouterMessage) => {
            let networkContent = networkContentResponse.data.map(networkContent => AOContent.fromObject(networkContent))
            resolve(networkContent)
        }).catch(reject)
    })
}