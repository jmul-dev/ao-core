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
                resolve({
                    files: response.data.files,
                    byteLength: response.data.byteLength,
                    length: response.data.length,
                    downloaded: response.data.downloaded,
                    version: response.data.version,
                    downloadTotal: response.data.network.downloadTotal,
                    uploadTotal: response.data.network.uploadTotal,
                    uploadSpeed: response.data.network.uploadSpeed,
                    downloadSpeed: response.data.network.downloadSpeed,
                    connected: response.data.network.connected,
                    joinedNetwork: response.data.joinedNetwork,
                    peersTotal: response.data.peers.total,
                    peersComplete: response.data.peers.complete
                });
            })
            .catch(() => {
                // In case the dat does not exist yet for whatever reason
                resolve(null);
            });
    });
};
