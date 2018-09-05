import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data, AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOP2P_Watch_AND_Get_IndexData_Data, indexDataRow } from '../../modules/p2p/p2p'
import AOContent, { AOContentState }  from '../../models/AOContent';
import contentDecryptionKey, { IContentDecryptionKey_Args } from './resolveContentDecryptionKey'

export interface IContentPurchased_Args {
    inputs: {
        contentId: string;
        purchaseId: string;
        hostId: string;
    }
}
/**
 * This is an internal resolver.  Its not called by graphql
 */

export default (obj: any, args: IContentPurchased_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const { contentId, purchaseId, hostId } = args.inputs
        // 1. Get existing content from user content 
        const networkContentQuery :AODB_NetworkContentGet_Data = {
            query: { id: contentId }
        }
        context.router.send('/db/user/content/get', networkContentQuery).then( (response:IAORouterMessage) => {
            if ( !response.data || response.data.length !== 1 ) {
                reject(new Error(`No discovered content with id: ${contentId}`))
                return;
            }
            const content:AOContent = response.data[0]
            // 2. Watch for change in Key for this specific encrypted video Dat
            const p2pWatchKeyRequest: AOP2P_Watch_AND_Get_IndexData_Data = {
                key: '/AOSpace/VOD/' + content.metadataDatKey + '/nodes/' + content.creatorId + '/' + content.fileDatKey + '/indexData',
                ethAddress: context.userSession.ethAddress
            }
            context.router.send('/p2p/watchAndGetIndexData', p2pWatchKeyRequest).then((watchIndexDataResponse:IAORouterMessage) => {

                // 3. Update the database with the appropriate indexData.
                const indexDataRow: indexDataRow = watchIndexDataResponse.data; // returned indexData is for your ethAddress
                if( indexDataRow ) {
                    let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                        id: contentId,
                        update: {
                            $set: {
                                "state": AOContentState.DECRYPTION_KEY_RECEIVED,
                                "receivedIndexData": indexDataRow
                            }
                        }
                    }
                    context.router.send('/db/user/content/update', contentUpdateQuery).then((purchasedUpdateResponse: IAORouterMessage) => {

                        // 4. Decrypt the Key and send it to contentDecryptionKey resolver
                        context.userSession.decryptString( indexDataRow.decryptionKey ).then((decryptedKey:string) => {
                            let decryptionKeyArgs : IContentDecryptionKey_Args = {
                                contentId: contentId,
                                decryptionKey: decryptedKey
                            }
                            contentDecryptionKey(obj, decryptionKeyArgs, context, info).then((updatedContent) => {
                                resolve()
                            }).catch(e => {
                                reject(e)
                            })
                        }).catch(e => {
                            //Decryption error.  Bad news hombre
                            reject(e)
                        })
                    }).catch(reject) // DB user content insert end
                } else {
                    reject(new Error('Did not find any indexData for specified key'))
                }
            }).catch(reject) // Watch Key end

        }).catch(reject) // Network content get from DB end
    })
}