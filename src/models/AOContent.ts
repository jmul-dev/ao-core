import path from "path";
import { NetworkContentHostEntry } from "../modules/p2p/p2p";
import { ITaoDB_ContentHost_IndexData_Entry } from "../modules/p2p/TaoDB";

export type AOContentType = "VOD" | "PDF" | "DAPP";
export type AOContentLicense = "AO" | "TAO" | "CC";

// NOTE: match graphql/types/content.graphql -> ContentState enum
export const AOContentState = Object.freeze({
    DISCOVERED: "DISCOVERED",
    HOST_DISCOVERY: "HOST_DISCOVERY",
    HOST_DISCOVERY_FAILED: "HOST_DISCOVERY_FAILED",
    DOWNLOADING: "DOWNLOADING",
    DOWNLOADED: "DOWNLOADED",
    PURCHASING: "PURCHASING",
    PURCHASED: "PURCHASED",
    DECRYPTION_KEY_RECEIVED: "DECRYPTION_KEY_RECEIVED",
    VERIFIED: "VERIFIED",
    VERIFICATION_FAILED: "VERIFICATION_FAILED",
    ENCRYPTED: "ENCRYPTED",
    DAT_INITIALIZED: "DAT_INITIALIZED",
    STAKING: "STAKING",
    STAKED: "STAKED",
    DISCOVERABLE: "DISCOVERABLE"
});
// NOTE: match graphql/types/content.graphql -> ContentType enum
export const AOContentTypes = Object.freeze({
    VOD: "VOD",
    PDF: "PDF",
    DAPP: "DAPP"
});

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
    AOContentState.DISCOVERABLE
];

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
        AOContentState.STAKED
    ];
}

/**
 * AOContent
 *
 * This class should closely reflect the structure of the IContent graphql type.
 * Ideally we would generate the graphql types from this (another time for another
 * time). Also note, graphql resolvers can resolve these class instances directly,
 * and even call instance methods to resolve fields.
 *
 * TODO: should probably wrap object types in the AORouter (for cross-process communication).
 * TODO: should have used generics, ex: AOContent<AOVideoContent> or AOContent<AODappContent>.
 *
 * Main usage: const content: AOContent = AOContent.fromObject({})
 */
export default abstract class AOContent {
    public static Types = AOContentTypes;
    public static States = AOContentState;
    public id: string;
    public ethNetworkId: string;
    public contentHostId?: string;
    public state: string;
    public stakeId: string;
    public purchaseReceiptId: string;
    public nodePublicKey: string;
    public nodeEthAddress: string;
    public creatorNodePublicKey: string;
    public creatorEthAddress: string;
    public creatorNameId: string;
    public taoId: string;
    public contentType: AOContentType;
    public mimetype: string;
    public contentLicense: AOContentLicense = "AO";
    public contentAttribution: string;
    public isFolder: boolean;
    public isMutable: boolean;
    public fileName: string;
    public fileDatKey: string;
    public fileUrl: string;
    public fileChecksum: string;
    public encryptionAlgorithm: string;
    public baseChallenge: string;
    public baseChallengeSignature: string;
    public encChallenge: string;
    public teaserUrl: string;
    public featuredImageUrl: string;
    public metadataDatKey: string;
    public metadata?: object;
    public title: string;
    public description: string;
    public stake: number;
    public fileSize: number;
    public stakePrimordialPercentage: number;
    public profitSplitPercentage: number;
    public adSupport: boolean;
    public createdAt: string;
    public hostedAt: string;
    public transactions?: {
        purchaseTx: string;
        stakeTx: string;
        hostTx: string;
    };
    public lastSeenContentHost?: NetworkContentHostEntry;
    public isNetworkContent?: boolean;
    public totalHosts?: number;
    public recentlySeenHostsCount?: number;
    // variables not exposed to graphql
    public receivedIndexData: ITaoDB_ContentHost_IndexData_Entry;
    public decryptionKey: string;

    static fromObject(contentObject): AOContent {
        let instance: AOContent;
        switch (contentObject.contentType) {
            case AOContentTypes.VOD:
                instance = new AOVideoContent();
                break;
            case AOContentTypes.DAPP:
                instance = new AODappContent();
                break;
            case AOContentTypes.PDF:
                instance = new AOPdfContent();
                break;
            default:
                console.warn(
                    `Content type not yet implemented or failed to pass the content type: ${
                        contentObject.contentType
                    }`
                );
                return contentObject;
        }
        // assigning all value to the instance properties
        Object.assign(instance, contentObject);
        return instance;
    }

    public isDiscoverable(): boolean {
        return this.state === AOContentState.DISCOVERABLE;
    }

    public isPurchased(): boolean {
        return (
            AOContentStateOrdered.indexOf(this.state) >=
            AOContentStateOrdered.indexOf(AOContentState.PURCHASED)
        );
    }

    public static isValidForImport(object): boolean | string {
        const keys = Object.keys(object);
        const minRequiredFields = [
            "id",
            "ethNetworkId",
            "metadataDatKey",
            "stakeId",
            "creatorNodePublicKey",
            "creatorEthAddress",
            "creatorNameId",
            "contentType",
            "mimetype",
            "contentLicense",
            "fileName",
            "fileDatKey",
            "fileUrl",
            "fileChecksum",
            "encryptionAlgorithm",
            "title"
        ];
        for (let i = 0; i < minRequiredFields.length; i++) {
            const fieldName = minRequiredFields[i];
            if (keys.indexOf(fieldName) === -1) return fieldName;
        }
        return true;
    }

    public getFilePath(): string {
        return path.join(
            `content-${this.ethNetworkId}`,
            this.fileDatKey,
            this.fileName
        );
    }

    public getFileFolderPath(): string {
        return path.join(`content-${this.ethNetworkId}`, this.fileDatKey);
    }

    public getMetadataFolderPath(): string {
        return path.join(`content-${this.ethNetworkId}`, this.metadataDatKey);
    }

    public getTempFolderPath(): string {
        return path.join(`content-${this.ethNetworkId}`, "tmp", this.id); //Note, content is included here since dat works only inside of the content dir
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
            "ethNetworkId",
            "metadataDatKey",
            "stakeId",
            "creatorNodePublicKey",
            "creatorEthAddress",
            "creatorNameId",
            "taoId",
            "contentType",
            "mimetype",
            "contentLicense",
            "contentAttribution",
            "isFolder",
            "isMutable",
            "fileName",
            "fileDatKey",
            "fileUrl",
            "fileChecksum",
            "encryptionAlgorithm",
            "title",
            "description",
            "fileSize",
            "stake", // TODO: stake, stakePrimordialPercentage, profitSplitPercentage may change over time and should be removed from the somewhat static metadata json file
            "stakePrimordialPercentage",
            "profitSplitPercentage",
            "adSupport",
            "createdAt",
            "teaserUrl",
            "featuredImageUrl",
            "metadata",
            "baseChallenge",
            "dappIndexPath"
        ];
        let metadataJson = {};
        metadataJsonKeys.forEach(key => {
            metadataJson[key] = this[key];
        });
        return metadataJson;
    }

    /**
     * Unlike above, returns a raw dangerous json!
     */
    public toRawJson() {
        let json = Object.assign({}, this);
        return json;
    }

    public get metadataDatStats() {
        // TODO: see resolveDatStats
        return undefined;
    }
}

export class AOVideoContent extends AOContent {
    public contentType: AOContentType = "VOD";
    public metadata: {
        encoding: string;
        duration: number;
        width: number;
        height: number;
        aspectRatio: number;
        aspectRatioDisplay: string;
        bitRate: number;
        frameRate: number;
    };
}

export class AODappContent extends AOContent {
    public contentType: AOContentType = "DAPP";
    public mimetype: string = "text/html";
    public unpacked: boolean = false;
    // dappIndexPath is the path within the content's zip folder to index.html
    public dappIndexPath: string;
}

export class AOPdfContent extends AOContent {
    public contentType: AOContentType = "PDF";
    public mimetype: string = "application/pdf";
}
