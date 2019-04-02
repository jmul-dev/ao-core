import { IGraphqlResolverContext } from "../../http";

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
        resolve({
            taoId: args.inputs.taoId,
            description: args.inputs.description
        });
    });
};
