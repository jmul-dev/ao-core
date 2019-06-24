import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";

interface INameLookup_Args {
    name: string;
}

export default (
    obj: any,
    args: INameLookup_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "getNameLookup",
            methodArgs: {
                name: args.name.toLowerCase().replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve({
                    name: args.name,
                    id: response.data
                });
            })
            .catch(error => {
                if (error.message === "null rejection") {
                    resolve({
                        name: args.name,
                        id: null
                    });
                } else {
                    reject(error);
                }
            });
    });
};
