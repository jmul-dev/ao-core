import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data, AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOP2P_Watch_Key_Data, AOP2P_Watch_AND_Get_IndexData_Data } from '../../modules/p2p/p2p'
import { request } from 'http';

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
            const content = response.data[0]
            // 2. Watch for change in Key for this specific encrypted video Dat
            // TODO: How do we get the target encrypted file's dat address?  That's currently not recorded/passed from contentRequest
            const p2pWatchKeyRequest: AOP2P_Watch_AND_Get_IndexData_Data = {
                key: '/AOSpace/VOD/' + content.metadataDatKey + '/nodes/' + content.creatorId + '/' + content.fileDatKey + '/indexData',
                ethAddress: response.ethAddress
            }
            context.router.send('/p2p/watchAndGetIndexData', p2pWatchKeyRequest).then((watchIndexDataResponse:IAORouterMessage) => {
                // TODO: Use indexData to find and decrypt the decryption key using your private key
                const indexData = watchIndexDataResponse.data; // returned indexData is for your ethAddress
                if( indexData ) {
                    //Set State to Purchased
                    let contentUpdateQuery: AODB_UserContentUpdate_Data = {
                        id: contentId,
                        update: {
                            $set: {
                                "state": 'DECRYPTION_KEY_RECEIVED',
                                "encryptedKey": indexData.decryptKey //indexData is put against the buyer's ethaddress
                            }
                        }
                    }
                    context.router.send('/db/user/content/update', contentUpdateQuery).then((purchasedUpdateResponse: IAORouterMessage) => {
                        resolve(purchasedUpdateResponse.data)
                    }).catch(reject) // DB user content insert end
                } else {
                    reject(new Error('Did not find any indexData for specified key'))
                }
            }).catch(reject) // Watch Key end

        }).catch(reject) // Network content get from DB end
    })
}