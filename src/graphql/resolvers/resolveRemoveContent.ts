import Debug from "debug";
import { IGraphqlResolverContext } from "../../http";
import AOContent from "../../models/AOContent";
import { AODB_UserContentGet_Data } from "../../modules/db/db";
import { IAORouterMessage } from "../../router/AORouter";
const debugUnwrapped = Debug("ao:removeContent");

export default async (
    obj: any,
    args: { id: string },
    context: IGraphqlResolverContext,
    info: any
) => {
    // 1. Ensure this content exists in the user db
    let userContentQuery: AODB_UserContentGet_Data = {
        query: { id: args.id }
    };
    const contentResponse: IAORouterMessage = await context.router.send(
        "/db/user/content/get",
        userContentQuery
    );
    if (!contentResponse.data || contentResponse.data.length === 0)
        throw new Error(`content not found`);
    const existingContent: AOContent = AOContent.fromObject(
        contentResponse.data[0]
    );
    const debug = (...args) => {
        debugUnwrapped(`[${existingContent.id}]`, ...args);
    };
    debug(`Attempting to remove content...`);
    // Remove the content dat file
    try {
        debug(`Removing content dat...`);
        await context.router.send("/dat/remove", {
            key: existingContent.fileDatKey
        });
    } catch (error) {
        debug(`Error removing content dat`, error);
    }
    // Remove this content from user's db
    try {
        debug(`Removing content from user db...`);
        await context.router.send("/db/user/content/remove", {
            id: existingContent.id
        });
    } catch (error) {
        debug(
            `Error removing content from user db, proceeding with content removal anyway...`,
            error
        );
    }
    // Remove this user as a content host
    try {
        debug(`Unregistering content host in taodb...`);
        await context.router.send("/p2p/unregisterContentHost", {
            content: existingContent
        });
    } catch (error) {
        debug(
            `Error unregistering content host. It is possible the user is not a host.`,
            error
        );
    }
    if (existingContent.creatorNameId === context.userSession.aoNameId) {
        /**
         * Additional actions required for content creator to remove content from
         * discovery.
         */
        debug(
            `User is the content creator, additional steps to remove content`
        );
        try {
            debug(`Removing metadata dat...`);
            await context.router.send("/dat/remove", {
                key: existingContent.metadataDatKey
            });
        } catch (error) {
            debug(
                `Error removing metadata dat folder, proceeding with content removal anyway...`,
                error
            );
        }
        try {
            debug(`Removing content from network db...`);
            await context.router.send("/db/network/content/remove", {
                id: existingContent.id
            });
        } catch (error) {
            debug(
                `Error removing content from network db, proceeding with content removal anyway...`,
                error
            );
        }
        try {
            debug(`Unregistering user content in taodb...`);
            await context.router.send("/p2p/unregisterContent", {
                content: existingContent
            });
        } catch (error) {
            debug(`Error unregistering user content in taodb`, error);
        }
    }
    return true;
};
