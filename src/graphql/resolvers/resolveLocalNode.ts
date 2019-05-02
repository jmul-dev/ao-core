import { IGraphqlResolverContext } from "../../http";

export default (
    obj: any,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        resolve({
            id: context.userSession.id,
            publicKey: context.userSession.publicKey,
            publicAddress: context.userSession.publicAddress,
            ethAddress: context.userSession.ethAddress,
            aoNameId: context.userSession.aoNameId
        });
    });
};
