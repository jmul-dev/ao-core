import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";

interface ISubmitTaoProfile_Args {
    inputs: {
        nameId: string;
        taoId: string;
        parentThoughtId?: string;
        thought: string;
    };
}

export default (
    obj: any,
    args: ISubmitTaoProfile_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "insertTaoThought",
            methodArgs: args
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve(response.data);
            })
            .catch(reject);
    });
};
