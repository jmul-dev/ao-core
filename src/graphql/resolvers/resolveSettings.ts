import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";

export default (
    obj: any,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        context.router
            .send("/db/settings/get")
            .then((settingsResponse: IAORouterMessage) => {
                context.router
                    .send("/eth/network/get")
                    .then((ethNetworkResponse: IAORouterMessage) => {
                        // fetching rpc endpoint from eth network in case it is not defined/overwritten by settings
                        let settings = settingsResponse.data;
                        if (!settings.ethNetworkRpc) {
                            settings.ethNetworkRpc =
                                ethNetworkResponse.data.rpcEndpoint;
                        }
                        resolve(settings);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};
