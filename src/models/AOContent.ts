export type AOContentType = "VOD" | 'STREAM' | 'FILE' | 'APP'
export const AOContentState = Object.freeze({
    DOWNLOADING: 'DOWNLOADING',
    DOWNLOADED: 'DOWNLOADED',
    PURCHASED: 'PURCHASED',
    DECRYPTION_KEY_RECEIVED: 'DECRYPTION_KEY_RECEIVED',
    DECRYPTED: 'DECRYPTED',
    VERIFIED: 'VERIFIED',
    ENCRYPTED: 'ENCRYPTED',
    STAKED: 'STAKED',
    DISCOVERABLE: 'DISCOVERABLE',
})

// NOTE: Data models should be implemented at *some* point. A few thoughts:
// - these models/classes should reflect the graphql types (possibly even generate those types)
// - graphql resolvers can resolve these class instances directly
// - should probably wrap object types in the AORouter (for cross-process communication)
//
// export default abstract class AOContent {
//     public id: string
//     protected _state: string  // derived
//     public stakeId: string
//     public nodeId: string
//     public creatorId: string
//     public contentType: AOContentType;
//     public isFolder: boolean
//     public isMutable: boolean
//     public fileName: string
//     public fileDatKey: string
//     public fileUrl: string
//     public metadataDatKey: string    
//     public title: string
//     public description: string    
//     public stake: number
//     public fileSize: number
//     public premium: number
//     public split: number
//     public adSupport: boolean
//     public createdAt: string

//     static fromObject( contentObject ) {
//         let instance;
//         switch (contentObject.contentType) {
//             case 'VOD':
//                 instance = new AOVideoContent()
//             default:
//                 break;
//         }
//         // assigning all value to the instance properties
//         if ( contentObject.state ) {
//             contentObject._state = contentObject.state
//             delete contentObject.state
//         }
//         Object.assign(instance, contentObject)
//     }

//     /**
//      * Returns a json structure that can be safely saved to 
//      * a metadata file (exludes any sensitive information)
//      */
//     public toMetadataJson() {
//         let json = Object.assign({}, this)
//         return json
//     }

//     public get state() {
//         // TODO: determine content state
//         return this._state;
//     }
// }

// export class AOVideoContent extends AOContent {
//     public contentType: AOContentType = 'VOD';
//     public teaserUrl: string
//     public featuredImageUrl: string
//     public metadata: {
//         duration: number
//         resolution: string
//         encoding: string
//     }
// }
