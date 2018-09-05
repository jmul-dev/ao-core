import { AOP2P_IndexDataRow } from "../modules/p2p/p2p";

export type AOContentType = "VOD" | 'STREAM' | 'FILE' | 'APP'

// NOTE: match graphql/types/content.graphql -> ContentState enum
export const AOContentState = Object.freeze({
    DISCOVERED: 'DISCOVERED',
    DOWNLOADING: 'DOWNLOADING',
    DOWNLOADED: 'DOWNLOADED',
    PURCHASING: 'PURCHASING',
    PURCHASED: 'PURCHASED',
    DECRYPTION_KEY_RECEIVED: 'DECRYPTION_KEY_RECEIVED',
    DECRYPTION_KEY_DECRYPTED: 'DECRYPTION_KEY_DECRYPTED',
    VERIFIED: 'VERIFIED',
    VERIFICATION_FAILED: 'VERIFICATION_FAILED',
    ENCRYPTED: 'ENCRYPTED',
    DAT_INITIALIZED: 'DAT_INITIALIZED',
    STAKING: 'STAKING',
    STAKED: 'STAKED',
    DISCOVERABLE: 'DISCOVERABLE',
})

const AOContentStateOrdered = [
    AOContentState.DISCOVERED,
    AOContentState.DOWNLOADING,
    AOContentState.DOWNLOADED,
    AOContentState.PURCHASING,
    AOContentState.PURCHASED,        
    AOContentState.DECRYPTION_KEY_RECEIVED,
    AOContentState.DECRYPTION_KEY_DECRYPTED,
    AOContentState.VERIFIED,
    AOContentState.VERIFICATION_FAILED,
    AOContentState.ENCRYPTED,
    AOContentState.DAT_INITIALIZED,
    AOContentState.STAKING,
    AOContentState.STAKED,
    AOContentState.DISCOVERABLE,
]

/**
 * For a content to be considered in a completed state if must
 * have been made discoverable.
 */
export function getListOfContentCompletedStates() {
    return [
        AOContentState.DISCOVERABLE
    ]
}

/**
 * These are all intermediate steps before a piece of content
 * is fully brought into the node and re-hosted (or uploaded
 * and hosted).
 */
export function getListOfContentIncompleteStates() {
    return [
        AOContentState.DOWNLOADING,
        AOContentState.DOWNLOADED,
        AOContentState.PURCHASING,
        AOContentState.PURCHASED,        
        AOContentState.DECRYPTION_KEY_RECEIVED,
        AOContentState.DECRYPTION_KEY_DECRYPTED,
        AOContentState.VERIFIED,
        AOContentState.VERIFICATION_FAILED,
        AOContentState.ENCRYPTED,
        AOContentState.DAT_INITIALIZED,
        AOContentState.STAKING,
        AOContentState.STAKED,
    ]
}

// NOTE: Data models should be implemented at *some* point. A few thoughts:
// - these models/classes should reflect the graphql types (possibly even generate those types)
// - graphql resolvers can resolve these class instances directly
// - should probably wrap object types in the AORouter (for cross-process communication)
//
export default abstract class AOContent {
    public id: string
    public contentHostId?: string
    public state: string  // derived
    public stakeId: string
    public nodeId: string
    public creatorId: string
    public contentType: AOContentType;
    public isFolder: boolean
    public isMutable: boolean
    public fileName: string
    public fileDatKey: string
    public fileUrl: string
    public fileChecksum: string
    public baseChallenge: string
    public encChallenge: string
    public metadataDatKey: string    
    public title: string
    public description: string    
    public stake: number
    public fileSize: number
    public premium: number
    public profit: number
    public split: number
    public adSupport: boolean
    public createdAt: string
    public receivedIndexData: AOP2P_IndexDataRow
    public decryptionKey: string

    static fromObject( contentObject ) {
        let instance;
        switch (contentObject.contentType) {
            case 'VOD':
                instance = new AOVideoContent()
            default:
                break;
        }
        // assigning all value to the instance properties
        Object.assign(instance, contentObject)
        return instance;
    }

    public isDiscoverable(): boolean {
        return this.state === AOContentState.DISCOVERABLE
    }

    public isPurchased(): boolean {
        return AOContentStateOrdered.indexOf(this.state) >= AOContentStateOrdered.indexOf( AOContentState.PURCHASED )
    }

    /**
     * Returns a json structure that can be safely saved to 
     * a metadata file (exludes any sensitive information)
     */
    public toMetadataJson() {
        let json = Object.assign({}, this)
        delete json.decryptionKey
        delete json.nodeId
        delete json.stakeId
        delete json.state
        delete json.baseChallenge
        delete json.encChallenge
        delete json.receivedIndexData
        
        return json
    }
    
    /**
     * Unlike above, returns a raw dangerous json!
     */
    public toRawJson() {
        let json = Object.assign({}, this)
        return json
    }

    public get metadataDatStats() {
        // TODO: see resolveDatStats
        return undefined
    }
}

export class AOVideoContent extends AOContent {
    public contentType: AOContentType = 'VOD'
    public teaserUrl: string
    public teaserName: string
    public featuredImageUrl: string
    public featuredImageName: string
    public metadata: {
        duration: number
        resolution: string
        encoding: string
    }
}
