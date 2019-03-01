import Http, { IGraphqlResolverContext } from "../../http";

export default (
    obj: any,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return `${Http.RESOURCES_ENDPOINT}/${obj.fileDatKey}/unpacked/${
        obj.dappIndexPath
    }`;
};
