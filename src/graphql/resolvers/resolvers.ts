import { AOCoreProcessRouter } from '../../router/AORouterInterface';
import { Http_Args } from '../../modules/http/http';
import resolveLocalNode from './resolveLocalNode'
import resolveSubmitVideoContent from './resolveSubmitVideoContent';

export default function(aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return {
        // Query resolvers
        resolveLocalNode: resolveLocalNode(aoRouter, options),
        // Mutation resolvers
        resolveSubmitVideoContent: resolveSubmitVideoContent(aoRouter, options),
    }
}