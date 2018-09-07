import { IGraphqlResolverContext } from '../../http';
import { generateMockVideoList } from '../mockVideos';
import { IAORouterMessage } from '../../router/AORouter';
import { AODB_NetworkContentGet_Data } from '../../modules/db/db';


let mockVideos = null

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const networkQueryData:AODB_NetworkContentGet_Data = {
            query: {
                content: {
                    $exists:true
                }
            }
        }
        context.router.send('/db/network/content/get', networkQueryData).then((networkContentResponse:IAORouterMessage) => {
            let returnData = networkContentResponse.data.map( (a) => {
                return a.content
            })
            resolve(returnData)
        }).catch(reject)
    })
}