import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data, AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOP2P_Watch_Key_Data } from '../../modules/p2p/p2p'

interface IContentRequest_Args {
    contentId: string;
    purchaseId: string;
    hostId: string;
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const { contentId, purchaseId, hostId } = args
        // 1. Get existing content from user content 
        const networkContentQuery :AODB_NetworkContentGet_Data = {
            query: { id: contentId }
        }
        context.router.send('/db/user/content/get', networkContentQuery).then( (response:IAORouterMessage) => {
            if ( !response.data || response.data.length !== 1 ) {
                reject(new Error(`No discovered content with id: ${contentId}`))
                return;
            }
            const content = response.data[0]
            // 2. Update to PURCHASED
            let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                id: contentId,
                update: {
                    $set: {
                        "state": 'PURCHASED',
                        "purchaseId": purchaseId
                    }
                }
            }
            context.router.send('/db/user/content/update', contentUpdateQuery).then((purchasingUpdateResponse: IAORouterMessage) => {
                // 3. Resolve with updated content
                resolve(purchasingUpdateResponse.data)

                // 4. Watch for change in Key for this specific encrypted video Dat
                // Note: Note that key watch is 100% up to us, no pre-fixing, or anything on the module side.
                // TODO: How do we get the target encrypted file's dat address?  That's currently not recorded/passed from contentRequest
                const p2pWatchKeyRequest: AOP2P_Watch_Key_Data = {
                    key: '/AOSpace/VOD/' + content.metadataDatKey + '/nodes/' + content.creatorId + '/' + content.fileDatKey + '/indexData'
                }
                context.router.send('/p2p/watchAndGetKey', p2pWatchKeyRequest).then((watchKeyResponse:IAORouterMessage) => {
                    /* 
                     * The following logic will likely be moved elsewhere.
                     * 
                    // TODO: Use indexData to find and decrypt the decryption key using your private key
                    // TODO: #2, Might want to sort through the indexData first.
                    const indexData = watchKeyResponse.data
                    if( indexData ) {
                        //Set State to Purchased
                        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                            id: contentId,
                            update: {
                                $set: {
                                    "state": 'DECRYPTION_KEY_RECEIVED',
                                    "encryptedKey": indexData //Gotta figure this out later!
                                }
                            }
                        }
                        context.router.send('/db/user/content/update', contentUpdateQuery).then((purchasedUpdateResponse: IAORouterMessage) => {

                        }).catch(reject) // DB user content insert end
                    } else {
                        // TODO: We might have to loop this watch/get as sometimes someone else might be purchasing from the same node.
                        let error = new Error('Did not find any indexData for specified key')
                        console.log( error ) // NO reject here since we already resolved.
                    }
                    */
                }).catch(error => {
                    console.error(error)
                }) // Watch Key end
                
            }).catch(reject) // update to purchasing.
        }).catch(reject) // Network content get from DB end
    })
}