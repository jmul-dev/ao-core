import { IGraphqlResolverContext } from "../../http";
import { AOP2P_TaoRequest_Data } from "../../modules/p2p/p2p";
import { IAORouterMessage } from "../../router/AORouter";
import Debug from "debug";
const debug = Debug(`ao:resolveSubmitNameLookup`);

interface ISubmitNameLookup_Args {
    inputs: {
        name: string;
        id: string;
    };
}

export default (
    obj: any,
    args: ISubmitNameLookup_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        if (!args.inputs.id) {
            return reject(new Error(`Missing id`));
        }
        const taoRequestArgs: AOP2P_TaoRequest_Data = {
            method: "insertNameLookup",
            methodArgs: {
                name: args.inputs.name,
                id: args.inputs.id
            }
        };
        context.router
            .send("/p2p/tao", taoRequestArgs)
            .then((response: IAORouterMessage) => {
                resolve({
                    name: args.inputs.name,
                    id: args.inputs.id
                });
            })
            .catch(reject);
    });
};
