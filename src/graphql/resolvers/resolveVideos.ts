import { IGraphqlResolverContext } from '../../http';
import { generateMockVideoList } from '../mockVideos';


let mockVideos = null

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // TODO: resolve the actual videos
        if ( !mockVideos ) {
            mockVideos = generateMockVideoList(90, context.options.coreOrigin, context.options.corePort)
        }
        resolve(mockVideos)
    })
}