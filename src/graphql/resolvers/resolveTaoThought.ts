import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";

interface ITaoThought_Args {
    taoId: string;
    thoughtId: string;
}

export default (
    obj: any,
    args: ITaoThought_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "getTaoThought",
            methodArgs: {
                taoId: args.taoId,
                thoughtId: args.thoughtId
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                if (response.data) resolve(response.data.value);
                else reject(new Error(`Tao thought not found`));
            })
            .catch(reject);
    });
};
