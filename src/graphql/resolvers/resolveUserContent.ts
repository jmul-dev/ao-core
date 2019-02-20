import { IGraphqlResolverContext } from "../../http";
import { AODB_UserContentGet_Data } from "../../modules/db/db";
import { IAORouterMessage } from "../../router/AORouter";

/**
 * NOTE: this resolver pulls video/content from *user* content db
 */
interface IUserContent_Args {
    id: string;
}

export default (
    obj: any,
    args: IUserContent_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        let userDbQuery: AODB_UserContentGet_Data = {
            query: {
                id: args.id
            }
        };
        context.router
            .send("/db/user/content/get", userDbQuery, { ignoreLogging: true })
            .then((contentGetResponse: IAORouterMessage) => {
                resolve(contentGetResponse.data[0]);
            })
            .catch(reject);
    });
};
