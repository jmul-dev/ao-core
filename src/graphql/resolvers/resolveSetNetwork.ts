import { IGraphqlResolverContext } from '../../modules/http/http';
import { IAOEth_NetworkChange_Data } from '../../modules/eth/eth';

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const networkSetData: IAOEth_NetworkChange_Data = {
            networkId: args.inputs.networkId
        }
        context.router.send('/eth/network/set', networkSetData).then(({networkId}) => {
            resolve(networkId ? true : false)
        }).catch(reject)
    })
}