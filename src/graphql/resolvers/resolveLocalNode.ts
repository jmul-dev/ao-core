import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/user/getIdentity').then((response: IAORouterMessage) => {
            let localNode = {
                id: response.data.ethAddress,
                ethAddress: response.data.ethAddress,
                address: response.data.address,
                publicKey: response.data.publicKey
            }
            resolve(localNode)
        }).catch(reject)
    })
}