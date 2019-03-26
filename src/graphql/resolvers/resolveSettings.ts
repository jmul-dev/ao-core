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
            .send("/db/settings/get", { ignoreLogging: true })
            .then((settingsResponse: IAORouterMessage) => {
                context.router
                    .send("/eth/network/get")
                    .then((ethNetworkResponse: IAORouterMessage) => {
                        // fetching rpc endpoint from eth network in case it is not defined/overwritten by settings
                        resolve({
                            ...settingsResponse.data,
                            ethNetorkRpc:
                                settingsResponse.data.ethNetorkRpc ||
                                ethNetworkResponse.data.rpcEndpoint
                        });
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};
