import resolveLocalNode from './resolveLocalNode'
import { AOCoreProcessRouter } from '../../router/AORouterInterface';
import { Http_Args } from '../../modules/http/http';

export default function(aoRouter: AOCoreProcessRouter, options: Http_Args) {
    return {
        resolveLocalNode: resolveLocalNode(aoRouter, options),
    }
}