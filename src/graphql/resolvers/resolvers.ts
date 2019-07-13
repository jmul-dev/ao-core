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
import resolveNameProfile from "./resolveNameProfile";
import resolveSubmitTaoDescription from "./resolveSubmitTaoDescription";
import resolveSubmitNameProfile from "./resolveSubmitNameProfile";
import resolveTaoThought from "./resolveTaoThought";
import resolveTaoThoughts from "./resolveTaoThoughts";
import resolveTaoThoughtsCount from "./resolveTaoThoughtsCount";
import resolveSubmitTaoThought from "./resolveSubmitTaoThought";
import resolveTaoDescriptions from "./resolveTaoDescriptions";
import resolveWriterKey from "./resolveWriterKey";
import resolveWriterKeySignature from "./resolveWriterKeySignature";
import resolveRemoveContent from "./resolveRemoveContent";
import resolveNameLookup from "./resolveNameLookup";
import resolveSubmitNameLookup from "./resolveSubmitNameLookup";
import resolveContentTaodbValues from "./resolveContentTaodbValues";

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
    resolveNameProfile,
    resolveTaoThought,
    resolveTaoThoughts,
    resolveTaoThoughtsCount,
    resolveTaoDescriptions,
    resolveWriterKey,
    resolveWriterKeySignature,
    resolveNameLookup,
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
    resolveSubmitNameProfile,
    resolveSubmitTaoDescription,
    resolveSubmitTaoThought,
    resolveRemoveContent,
    resolveSubmitNameLookup,
    // Field resolvers
    resolveUrl,
    resolveDappUrl,
    resolveSignatureVrs,
    resolveContentTaodbValues
};
