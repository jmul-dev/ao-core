import { IGraphqlResolverContext } from "../../http";

interface ITaoProfile_Args {
    nameId: string;
}

export default (
    obj: any,
    args: ITaoProfile_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        resolve({
            nameId: args.nameId,
            imageString: "TODO"
        });
    });
};
