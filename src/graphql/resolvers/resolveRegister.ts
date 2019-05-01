import { IGraphqlResolverContext } from "../../http";

export interface IRegister_Args {
    inputs: {
        ethAddress: string;
        aoNameId?: string;
    };
}

export default (
    obj: any,
    args: IRegister_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        context.userSession
            .register(args.inputs.ethAddress, args.inputs.aoNameId)
            .then(() => {
                resolve({
                    id: args.inputs.ethAddress,
                    ethAddress: args.inputs.ethAddress,
                    aoNameId: args.inputs.aoNameId
                });
            })
            .catch(reject);
    });
};
