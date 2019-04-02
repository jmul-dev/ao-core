import { IGraphqlResolverContext } from "../../http";

interface ISubmitTaoProfile_Args {
    inputs: {
        nameId: string;
        imageString: string;
    };
}

export default (
    obj: any,
    args: ISubmitTaoProfile_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        resolve({
            nameId: args.inputs.nameId,
            imageString: args.inputs.imageString
        });
    });
};
