import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";
import AOContent from "../../models/AOContent";
import Debug from "../../AODebug";
import { AODat_GetDatStats_Data } from "../../modules/dat/dat";
const debug = Debug("ao:resolveDatStats");

export default (
    obj: AOContent,
    args: any,
    context: IGraphqlResolverContext,
    info: any
) => {
    return new Promise((resolve, reject) => {
        let datKey = obj.metadataDatKey;
        if (info.fieldName === "fileDatStats") {
            datKey = obj.fileDatKey;
            // failed to bring in fileDatKey
            if (obj.state === AOContent.States.HOST_DISCOVERY_FAILED) {
                return resolve(null);
            }
        }
        if (!datKey) return resolve(null);
        const statsParams: AODat_GetDatStats_Data = {
            key: datKey
        };
        context.router
            .send("/dat/stats", statsParams, { ignoreLogging: true })
            .then((response: IAORouterMessage) => {
                const stats = response.data;
                if (!stats) return resolve(null);
                resolve({
                    key: datKey,
                    writer: stats.writer,
                    version: stats.version,
                    files: stats.files,
                    blocksDownloaded: stats.blocksDownloaded,
                    blocksLength: stats.blocksLength,
                    byteLength: stats.byteLength,
                    progress: stats.progress,
                    // Network
                    connected: stats.network.connected,
                    downloadSpeed: stats.network.downloadSpeed,
                    downloadTotal: stats.network.downloadTotal,
                    uploadSpeed: stats.network.uploadSpeed,
                    uploadTotal: stats.network.uploadTotal,
                    // Peers
                    peersTotal: stats.peers.total,
                    peersComplete: stats.peers.complete
                });
            })
            .catch(err => {
                debug(`[${datKey}] failed to get stats: ${err.message}`);
                // In case the dat does not exist yet for whatever reason
                resolve(null);
            });
    });
};
