import { IGraphqlResolverContext } from "../../http";
import { IAOEth_NetworkChange_Data } from "../../modules/eth/eth";
import { IAORouterMessage } from "../../router/AORouter";

/**
 * TODO: this method is obsolete at this point and should be removed.
 * ao-core requires the ethNetwork id as an argument and must be restarted
 * in order to switch networks.
 */
export default (
    obj: any,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const networkSetData: IAOEth_NetworkChange_Data = {
            networkId: args.inputs.networkId
        };
        context.router
            .send("/eth/network/set", networkSetData)
            .then((response: IAORouterMessage) => {
                resolve(response.data.networkId ? true : false);
            })
            .catch(reject);
    });
};
