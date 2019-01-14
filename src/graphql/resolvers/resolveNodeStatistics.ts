import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";
import AOContent from "../../models/AOContent";
import { AOP2P_PeerStats } from "../../modules/p2p/p2p";
import { IAOETH_Stats } from "../../modules/eth/eth";
const packageJson = require("../../../package.json");

export default (
    obj: AOContent,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        const p2pStatsPromise = context.router.send("/p2p/stats", null, {
            ignoreLogging: true
        });
        const ethStatsPromise = context.router.send("/eth/stats", null, {
            ignoreLogging: true
        });
        Promise.all([p2pStatsPromise, ethStatsPromise])
            .then((results: Array<IAORouterMessage>) => {
                const p2pStats: AOP2P_PeerStats = results[0].data;
                const ethStats: IAOETH_Stats = results[1].data;
                resolve({
                    status: "CONNECTED",
                    coreVersion: packageJson.version,
                    p2pStatus: p2pStats.p2pStatus,
                    p2pPeersConnected: p2pStats.peersConnected,
                    p2pRecentlySeenHostsCount:
                        p2pStats.recentlySeenContentHosts,
                    ethNetworkStatus: ethStats.connectionStatus,
                    ethNetworkId: ethStats.networkId,
                    totalContentHosts: ethStats.totalContentHosts
                });
            })
            .catch(reject);
    });
};
