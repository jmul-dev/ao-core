import resolveLocalNode from './resolveLocalNode'
import resolveSubmitVideoContent from './resolveSubmitVideoContent';
import resolveDatStats from './resolveDatStats';
import resolveLocalNodeStakedContent from './resolveLocalNodeStakedContent';
import resolveLocalNodeHostedContent from './resolveLocalNodeHostedContent';
import resolveVideo from './resolveVideo';
import resolveStakeContent from './resolveStakeContent';
import resolveLogs from './resolveLogs';
import resolveSettings from './resolveSettings';
import resolveSetNetwork from './resolveSetNetwork';
import resolveRegister from './resolveRegister';
import resolveUpdateSettings from './resolveUpdateSettings';
import resolveVideos from './resolveVideos';
import resolveState from './resolveState';
import resolveUrl from './resolveUrl';
import resolveContentRequest from './resolveContentRequest';

export default {
    // Query resolvers
    resolveLocalNode,    
    resolveLocalNodeStakedContent,    
    resolveLocalNodeHostedContent,
    resolveDatStats,
    resolveVideo,
    resolveVideos,
    resolveLogs,
    resolveSettings,
    resolveState,
    // Mutation resolvers
    resolveSubmitVideoContent,
    resolveStakeContent,
    resolveSetNetwork,
    resolveRegister,
    resolveUpdateSettings,
    resolveContentRequest,
    // Field resolvers
    resolveUrl,
}
