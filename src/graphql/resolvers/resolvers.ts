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
    // Field resolvers
    resolveUrl,
    resolveDappUrl,
    resolveSignatureVrs
};
