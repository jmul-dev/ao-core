import { IGraphqlResolverContext } from "../../http";
import { IAORouterMessage } from "../../router/AORouter";
import AOContent from "../../models/AOContent";

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
        context.router
            .send("/dat/stats", { key: datKey }, { ignoreLogging: true })
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
                // In case the dat does not exist yet for whatever reason
                resolve(null);
            });
    });
};
