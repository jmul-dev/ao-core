import { AOCoreProcessRouter } from '../../router/AORouterInterface';
import { Http_Args } from '../../modules/http/http';
import resolveLocalNode from './resolveLocalNode'
import resolveSubmitVideoContent from './resolveSubmitVideoContent';
import resolveDatStats from './resolveDatStats';
import resolveContentCreatorContent from './resolveContentCreatorContent';
import resolveVideo from './resolveVideo';


export default function(aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return {
        // Query resolvers
        resolveLocalNode: resolveLocalNode(aoRouter, options),
        resolveDatStats: resolveDatStats(aoRouter, options),
        resolveContentCreatorContent: resolveContentCreatorContent(aoRouter, options),
        resolveVideo: resolveVideo(aoRouter, options),
        // Mutation resolvers
        resolveSubmitVideoContent: resolveSubmitVideoContent(aoRouter, options),
    }
}