import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentGet_Data } from "../../modules/db/db";
import AOContent, {
    getListOfContentIncompleteStates
} from "../../models/AOContent";
import { ILocalNode_ContentQuery_Inputs } from "./resolveLocalNodeHostedContent";
import { AODat_GetMultipleDatStats_Data } from "../../modules/dat/dat";

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
        if (!nodeIdentity.ethAddress)
            nodeIdentity.ethAddress = context.userSession.ethAddress;
        if (!nodeIdentity.publicKey)
            nodeIdentity.publicKey = context.userSession.publicKey;
        const contentQueryParams: AODB_UserContentGet_Data = {
            userId: nodeIdentity.ethAddress,
            query: {
                creatorNodePublicKey: nodeIdentity.publicKey,
                state: args.inputs.incomplete
                    ? {
                          $in: getListOfContentIncompleteStates()
                      }
                    : undefined,
                contentType: args.inputs.contentType,
                contentLicense: args.inputs.contentLicense
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
                const keys = userContent.reduce((keys, content: AOContent) => {
                    return keys.concat([
                        content.metadataDatKey,
                        content.fileDatKey
                    ]);
                }, []);
                const statsArgs: AODat_GetMultipleDatStats_Data = {
                    keys
                };
                context.router
                    .send("/dat/statsMultiple", statsArgs, {
                        ignoreLogging: true
                    })
                    .then((response: IAORouterMessage) => {
                        const stats = response.data;
                        userContent = userContent.map(content => {
                            content["metadataDatStats"] =
                                stats[content.metadataDatKey];
                            content["fileDatStats"] = stats[content.fileDatKey];
                            return content;
                        });
                        resolve(userContent);
                    })
                    .catch(error => {
                        // simply resolve without the stats
                        resolve(userContent);
                    });
            })
            .catch(error => {
                reject(error);
            });
    });
};
