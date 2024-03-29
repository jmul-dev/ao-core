import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";

interface ITaoDescription_Args {
    taoId: string;
    timestamp: number;
}

export default (
    obj: any,
    args: ITaoDescription_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "getTaoDescription",
            methodArgs: {
                taoId: args.taoId,
                timestamp: args.timestamp
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve({
                    taoId: args.taoId,
                    description: response.data
                });
            })
            .catch(reject);
    });
};
