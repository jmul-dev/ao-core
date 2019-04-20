import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";

interface INameProfile_Args {
    nameId: string;
}

export default (
    obj: any,
    args: INameProfile_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "getNameProfileImage",
            methodArgs: {
                nameId: args.nameId
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve({
                    nameId: args.nameId,
                    imageString: response.data
                });
            })
            .catch(reject);
    });
};
