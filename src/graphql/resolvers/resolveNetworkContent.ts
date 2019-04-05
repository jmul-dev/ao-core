import { IGraphqlResolverContext } from "../../http";
import AOContent, {
    AOContentType,
    AOContentLicense
} from "../../models/AOContent";
import { AODB_NetworkContentGet_Data } from "../../modules/db/db";
import { IAORouterMessage } from "../../router/AORouter";
import { AONetworkContent } from "../../models/AONetworkContent";

interface IVideos_Args {
    contentType?: AOContentType;
    contentLicense?: AOContentLicense;
    query?: string;
    id?: string;
}

export default (
    obj: any,
    args: IVideos_Args,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const networkQueryData: AODB_NetworkContentGet_Data = {
            query: {
                status: "imported",
                "content.contentType": args.contentType || undefined,
                "content.id": args.id || undefined,
                "content.contentLicense": args.contentLicense || undefined
            },
            fuzzyQuery: args.query || undefined,
            contentOnly: false
        };
        context.router
            .send("/db/network/content/get", networkQueryData, {
                ignoreLogging: true
            })
            .then((networkContentResponse: IAORouterMessage) => {
                let content = networkContentResponse.data
                    .map((networkContent: AONetworkContent) => {
                        let aoContent: AOContent = AOContent.fromObject(
                            networkContent.content
                        );
                        aoContent.lastSeenContentHost =
                            networkContent.lastSeenContentHost;
                        aoContent.isNetworkContent = true;
                        aoContent.recentlySeenHostsCount =
                            networkContent.recentlySeenHostsCount || 0;
                        aoContent.totalHosts = networkContent.totalHosts || 0;
                        return aoContent;
                    })
                    .sort((a, b) => {
                        // Sorting algorithm -> recently seen host -> created at date
                        if (
                            a.recentlySeenHostsCount > 0 &&
                            b.recentlySeenHostsCount < 1
                        )
                            return -1;
                        if (
                            b.recentlySeenHostsCount > 0 &&
                            a.recentlySeenHostsCount < 1
                        )
                            return 1;
                        // Sort by content createdAt
                        return (
                            new Date(parseInt(b.createdAt)).getTime() -
                            new Date(parseInt(a.createdAt)).getTime()
                        );
                    });
                resolve(content);
            })
            .catch(reject);
    });
};
