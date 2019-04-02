import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";

interface ISubmitTaoDescription_Args {
    inputs: {
        taoId: string;
        description: string;
    };
}

export default (
    obj: any,
    args: ISubmitTaoDescription_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "insertTaoDescription",
            methodArgs: {
                taoId: args.inputs.taoId,
                description: args.inputs.description
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve({
                    taoId: args.inputs.taoId,
                    description: args.inputs.description
                });
            })
            .catch(reject);
    });
};
