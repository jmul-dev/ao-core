import path from 'path';
import { AOP2P_IndexDataRow, NetworkContentHostEntry } from "../modules/p2p/p2p";


export type AOContentType = "VOD" | 'STREAM' | 'FILE' | 'APP'

// NOTE: match graphql/types/content.graphql -> ContentState enum
export const AOContentState = Object.freeze({
    DISCOVERED: 'DISCOVERED',
    HOST_DISCOVERY: 'HOST_DISCOVERY',
    HOST_DISCOVERY_FAILED: 'HOST_DISCOVERY_FAILED',
    DOWNLOADING: 'DOWNLOADING',
    DOWNLOADED: 'DOWNLOADED',
    PURCHASING: 'PURCHASING',
    PURCHASED: 'PURCHASED',
    DECRYPTION_KEY_RECEIVED: 'DECRYPTION_KEY_RECEIVED',
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
    AOContentState.HOST_DISCOVERY,
    AOContentState.HOST_DISCOVERY_FAILED,
    AOContentState.DOWNLOADING,
    AOContentState.DOWNLOADED,
    AOContentState.PURCHASING,
    AOContentState.PURCHASED,
    AOContentState.DECRYPTION_KEY_RECEIVED,
    AOContentState.VERIFIED,
    AOContentState.VERIFICATION_FAILED,
    AOContentState.ENCRYPTED,
    AOContentState.DAT_INITIALIZED,
    AOContentState.STAKING,
    AOContentState.STAKED,
    AOContentState.DISCOVERABLE,
]

/**
 * These are all intermediate steps before a piece of content
 * is fully brought into the node and re-hosted (or uploaded
 * and hosted).
 */
export function getListOfContentIncompleteStates() {
    return [
        AOContentState.HOST_DISCOVERY,
        AOContentState.HOST_DISCOVERY_FAILED,
        AOContentState.DOWNLOADING,
        AOContentState.DOWNLOADED,
        AOContentState.PURCHASING,
        AOContentState.PURCHASED,
        AOContentState.DECRYPTION_KEY_RECEIVED,
        AOContentState.VERIFIED,
        AOContentState.VERIFICATION_FAILED,
        AOContentState.ENCRYPTED,
        AOContentState.DAT_INITIALIZED,
        AOContentState.STAKING,
        AOContentState.STAKED,
    ]
}

/**
 * AOContent
 * 
 * This class should closely reflect the structure of the IContent graphql type.
 * Ideally we would generate the graphql types from this (another time for another
 * time). Also note, graphql resolvers can resolve these class instances directly, 
 * and even call instance methods to resolve fields. Also a todo, should probably wrap 
 * object types in the AORouter (for cross-process communication).
 * 
 * Main usage: const content: AOContent = AOContent.fromObject({})
 */
export default abstract class AOContent {
    public id: string
    public contentHostId?: string
    public state: string
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
    public baseChallengeSignature: string
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
    public transactions?: {
        purchaseTx: string
        stakeTx: string
        hostTx: string
    }
    public lastSeenContentHost?: NetworkContentHostEntry
    public isNetworkContent?: boolean
    // variables not exposed to graphql
    public receivedIndexData: AOP2P_IndexDataRow
    public decryptionKey: string

    static fromObject(contentObject) {
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
        return AOContentStateOrdered.indexOf(this.state) >= AOContentStateOrdered.indexOf(AOContentState.PURCHASED)
    }

    public getFilePath(): string {
        return path.join('content', this.fileDatKey, this.fileName)
    }

    public getFileFolderPath(): string {
        return path.join('content', this.fileDatKey)
    }

    public getMetadataFolderPath(): string {
        return path.join('content', this.metadataDatKey)
    }

    public getTempFolderPath(): string {
        return path.join('content','tmp', this.id)//Note, content is included here since dat works only inside of the content dir
    }

    //This one is aware of the Dat context and won't add 'content'
    public getDatTempFolderPath(): string {
        return path.join('tmp', this.id)
    }

    /**
     * Returns a json structure that can be safely saved to 
     * a metadata file (exludes any sensitive information).
     * This is the content that will exist in the public Dat
     * file and shows up during discovery.
     */
    public toMetadataJson() {
        const metadataJsonKeys = [
            "id",
            "metadataDatKey",
            'stakeId',
            'creatorId',
            'contentType',
            'isFolder',
            'isMutable',
            'fileName',
            'fileDatKey',
            'fileUrl',
            'fileChecksum',
            'title',
            'description',
            'stake',            
            'fileSize',
            'premium',
            'profit',
            'split',
            'adSupport',
            'createdAt',
            'teaserUrl',
            'teaserName',
            'featuredImageUrl',
            'featuredImageName',
            'metadata',
            'baseChallenge',
        ]
        let metadataJson = {}
        metadataJsonKeys.forEach(key => {
            metadataJson[key] = this[key]
        });
        return metadataJson
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
        encoding: string
        duration: number
        width: number
        height: number
        aspectRatio: number
        aspectRatioDisplay: string
        bitRate: number
        frameRate: number
    }
}
