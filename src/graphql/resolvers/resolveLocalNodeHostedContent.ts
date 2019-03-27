import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentGet_Data } from "../../modules/db/db";
import AOContent, {
    getListOfContentIncompleteStates,
    AOContentType
} from "../../models/AOContent";

export interface ILocalNode_ContentQuery_Inputs {
    inputs: {
        id?: string;
        incomplete?: boolean;
        contentType?: AOContentType;
    };
}
// TODO: obj is of type NodeIdentity (sorry still no types outside of graphql)
export default (
    nodeIdentity: any,
    args: ILocalNode_ContentQuery_Inputs = { inputs: {} },
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        if (!context.userSession.ethAddress) {
            resolve([]);
            return null;
        }
        let contentQueryParams: AODB_UserContentGet_Data = {
            userId: nodeIdentity.ethAddress,
            query: {
                creatorNodePublicKey: {
                    $ne: nodeIdentity.publicKey
                },
                state: args.inputs.incomplete
                    ? {
                          $in: getListOfContentIncompleteStates()
                      }
                    : undefined,
                contentType: args.inputs.contentType
            }
        };
        context.router
            .send("/db/user/content/get", contentQueryParams, {
                ignoreLogging: true
            })
            .then((response: IAORouterMessage) => {
                let userContent: Array<AOContent> = new Array();
                // ensures array in case response is single item
                [].concat(response.data).forEach(content => {
                    userContent.push(AOContent.fromObject(content));
                });
                userContent = userContent.sort((a, b) => {
                    return parseInt(b.createdAt) - parseInt(a.createdAt);
                });
                resolve(userContent);
            })
            .catch(error => {
                reject(error);
            });
    });
};
