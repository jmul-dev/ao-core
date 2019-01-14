import { IGraphqlResolverContext } from "../../http";

export interface IRegister_Args {
    inputs: {
        ethAddress: string;
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
            .register(args.inputs.ethAddress)
            .then(() => {
                resolve({
                    id: args.inputs.ethAddress,
                    ethAddress: args.inputs.ethAddress
                });
            })
            .catch(reject);
    });
};
