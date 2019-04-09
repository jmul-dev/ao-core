import resolveLocalNode from "./resolveLocalNode";
import resolveSubmitContent from "./resolveSubmitContent";
import resolveDatStats from "./resolveDatStats";
import resolveLocalNodeStakedContent from "./resolveLocalNodeStakedContent";
import resolveLocalNodeHostedContent from "./resolveLocalNodeHostedContent";
import resolveUserContent from "./resolveUserContent";
import resolveLogs from "./resolveLogs";
import resolveSettings from "./resolveSettings";
import resolveRegister from "./resolveRegister";
import resolveUpdateSettings from "./resolveUpdateSettings";
import resolveNetworkContent from "./resolveNetworkContent";
import resolveState from "./resolveState";
import resolveUrl from "./resolveUrl";
import resolveContentRequest from "./resolveContentRequest";
import resolveContentPurchaseTransaction from "./resolveContentPurchaseTransaction";
import resolveContentBecomeHostTransaction from "./resolveContentBecomeHostTransaction";
import resolveContentUploadStakeTransaction from "./resolveContentUploadStakeTransaction";
import resolveSignatureVrs from "./resolveSignatureVrs";
import resolveContentRetryHostDiscovery from "./resolveContentRetryHostDiscovery";
import resolveExportData from "./resolveExportData";
import resolveNodeStatistics from "./resolveNodeStatistics";
import resolveDappUrl from "./resolveDappUrl";
import resolveTaoDescription from "./resolveTaoDescription";
import resolveTaoProfile from "./resolveTaoProfile";
import resolveSubmitTaoDescription from "./resolveSubmitTaoDescription";
import resolveSubmitTaoProfile from "./resolveSubmitTaoProfile";
import resolveTaoThought from "./resolveTaoThought";
import resolveTaoThoughts from "./resolveTaoThoughts";
import resolveTaoThoughtsCount from "./resolveTaoThoughtsCount";
import resolveSubmitTaoThought from "./resolveSubmitTaoThought";
import resolveTaoDescriptions from "./resolveTaoDescriptions";

export default {
    // Query resolvers
    resolveLocalNode,
    resolveLocalNodeStakedContent,
    resolveLocalNodeHostedContent,
    resolveDatStats,
    resolveUserContent,
    resolveNetworkContent,
    resolveLogs,
    resolveSettings,
    resolveState,
    resolveNodeStatistics,
    resolveTaoDescription,
    resolveTaoProfile,
    resolveTaoThought,
    resolveTaoThoughts,
    resolveTaoThoughtsCount,
    resolveTaoDescriptions,
    // Mutation resolvers
    resolveSubmitContent,
    resolveRegister,
    resolveUpdateSettings,
    resolveContentRequest,
    resolveContentPurchaseTransaction,
    resolveContentBecomeHostTransaction,
    resolveContentUploadStakeTransaction,
    resolveContentRetryHostDiscovery,
    resolveExportData,
    resolveSubmitTaoDescription,
    resolveSubmitTaoProfile,
    resolveSubmitTaoThought,
    // Field resolvers
    resolveUrl,
    resolveDappUrl,
    resolveSignatureVrs
};
