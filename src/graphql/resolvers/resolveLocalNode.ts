import { IGraphqlResolverContext } from '../../modules/http/http';
import { IAORouterMessage } from "../../router/AORouter";

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/user/get').then((response: IAORouterMessage) => {
            let localNode = {
                id: response.data.ethAddress,
                ethAddress: response.data.ethAddress,
            }
            resolve(localNode)
        }).catch(reject)
    })
}