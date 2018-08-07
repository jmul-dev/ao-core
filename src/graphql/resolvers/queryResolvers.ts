import resolveLocalNode from './resolveLocalNode'
import { AOCoreProcessRouter } from '../../router/AORouterInterface';

export default function(aoRouter: AOCoreProcessRouter) {
    return {
        resolveLocalNode: resolveLocalNode(aoRouter),
    }
}