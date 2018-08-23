import resolveLocalNode from './resolveLocalNode'
import resolveSubmitVideoContent from './resolveSubmitVideoContent';
import resolveDatStats from './resolveDatStats';
import resolveContentCreatorContent from './resolveContentCreatorContent';
import resolveVideo from './resolveVideo';
import resolveStakeContent from './resolveStakeContent';
import resolveLogs from './resolveLogs';
import resolveSettings from './resolveSettings';
import resolveSetNetwork from './resolveSetNetwork';
import resolveRegister from './resolveRegister';
import resolveUpdateSettings from './resolveUpdateSettings';
import resolveVideos from './resolveVideos';
import resolveState from './resolveState';

export default {
    // Query resolvers
    resolveLocalNode,
    resolveDatStats,
    resolveContentCreatorContent,
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
}
