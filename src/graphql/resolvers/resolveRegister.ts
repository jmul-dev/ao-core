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
                    id: context.userSession.ethAddress,
                    ethAddress: context.userSession.ethAddress,
                    publicKey: context.userSession.publicKey,
                    publicAddress: context.userSession.publicAddress,
                    aoNameId: context.userSession.aoNameId
                });
            })
            .catch(reject);
    });
};
