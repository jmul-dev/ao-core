import { IGraphqlResolverContext } from "../../http";
import AOContent, { AOContentState } from "../../models/AOContent";
import {
    AODB_NetworkContentGet_Data,
    AODB_UserContentGet_Data
} from "../../modules/db/db";
import { IAORouterMessage } from "../../router/AORouter";
import Debug from "../../AODebug";
const debug = Debug("ao:resolveContentRequest");

interface IContentRequest_Args {
    metadataDatKey: string;
}

export default (
    obj: any,
    args: IContentRequest_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        // 1. Make sure user has not already pulled this content into node
        let userContentQuery: AODB_UserContentGet_Data = {
            query: { id: args.metadataDatKey }
        };
        context.router
            .send("/db/user/content/get", userContentQuery)
            .then((response: IAORouterMessage) => {
                if (response.data && response.data.length > 0) {
                    // User already has this content! Pass through to processContent to try and bump through
                    // the process.
                    const existingContent: AOContent = AOContent.fromObject(
                        response.data[0]
                    );
                    resolve(existingContent);
                    context.userSession.processContent(existingContent);
                    return null;
                }
                // 2. Pull the Content from network content db
                let networkContentQuery: AODB_NetworkContentGet_Data = {
                    query: { _id: args.metadataDatKey },
                    contentOnly: true
                };
                context.router
                    .send("/db/network/content/get", networkContentQuery)
                    .then((response: IAORouterMessage) => {
                        if (!response.data || response.data.length !== 1) {
                            reject(
                                new Error(
                                    `No discovered content with id: ${
                                        args.metadataDatKey
                                    }`
                                )
                            );
                            return;
                        }
                        // 3. Insert the content into user db (they have begun the content purchase/hosting process)
                        let updatedContent: AOContent = AOContent.fromObject({
                            ...response.data[0],
                            // Bringing this content into node, so the nodeId/nodeEthAddress now reference this node.
                            nodeId: context.userSession.id,
                            nodeEthAddress: context.userSession.ethAddress,
                            state: AOContentState.HOST_DISCOVERY
                        });
                        context.router
                            .send(
                                "/db/user/content/insert",
                                updatedContent.toRawJson()
                            )
                            .then((insertResponse: IAORouterMessage) => {
                                resolve(updatedContent);
                                context.userSession.processContent(
                                    updatedContent
                                );
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(e => {
                debug("problems from the user content get ay");
                reject(e);
            });
    });
};
