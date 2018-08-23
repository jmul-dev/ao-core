import { IGraphqlResolverContext } from '../../modules/http/http';
import { IAORouterMessage } from "../../router/AORouter";

// TODO: obj is of type Content (sorry still no types outside of graphql)
export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/dat/stats', {key: obj.metadataDatKey}).then((response: IAORouterMessage) => {
            resolve({
                files: response.data.files,
                byteLength: response.data.byteLength,
                length: response.data.length,
                version: response.data.version,
                downloadTotal: response.data.network.downloadTotal,
                uploadTotal: response.data.network.uploadTotal,
                uploadSpeed: response.data.network.uploadSpeed,
                downloadSpeed: response.data.network.downloadSpeed,
                peersTotal: response.data.peers.total,
                peersComplete: response.data.peers.complete,
            })
        }).catch(reject)
    })
}