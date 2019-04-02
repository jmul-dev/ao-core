import { IGraphqlResolverContext } from "../../http";

interface ITaoDescription_Args {
    taoId: string;
}

export default (
    obj: any,
    args: ITaoDescription_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        resolve({
            taoId: args.taoId,
            description: "TODO"
        });
    });
};
