import AOContent from "./AOContent";
import { NetworkContentHostEntry } from "../modules/p2p/p2p";

export interface AONetworkContent {
    _id: string /* metadataDatKey */;
    status: "imported" | "failed";
    content?: AOContent;
    lastSeenContentHost?: NetworkContentHostEntry;
    totalHosts?: number;
    recentlySeenHostsCount?: number;
    importAttempts?: number;
}
export default AONetworkContent;
