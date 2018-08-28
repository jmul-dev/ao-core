import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AOContentState } from '../../models/AOContent';
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOP2P_Add_Discovery_Data } from '../../modules/p2p/p2p'

interface IContentRequest_Args {
    inputs: {
        contentId: string;
        stakeId: string;
    }
}
/**
 * Registering the whole thing on HyperDB for purpose of discovery
 */
export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const { contentId, stakeId } = args.inputs
        // 1. First, let's get the content data from user db
        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
            id: contentId,
            update: {
                $set: {
                    //"state": AOContentState.DISCOVERABLE, // TODO: Talk to Neil.  Should this be like "Almost Discoverable"?
                    "stakeId": stakeId
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
            if ( !response.data ) {
                reject(new Error(`Failed to update content stakeId`))
                return;
            }
            let clonedContent = {
                ...response.data
            }

            // 2. Add new discovery
            const p2pAddDiscoveryData: AOP2P_Add_Discovery_Data = {
                contentType: 'VOD',
                datKey: clonedContent.newFileDatKey,
                ethAddress: response.ethAddress, // My Eth Address
                metaData: clonedContent,//We should take shit out?
                indexData: {} // TODO: WTF do we do here?
            }
            context.router.send('/p2p/addDiscovery', p2pAddDiscoveryData).then((response:IAORouterMessage) => {
                if(response.data.success) {
                    
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.DISCOVERABLE
                        }
                    }
                    context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
                        if ( !response.data ) {
                            reject(new Error('Failed to update content state'))
                        } else {
                            resolve(response.data)
                        }
                    }).catch(reject)

                } else {
                    reject(new Error('Failed to add reencryped Dat to discovery'))
                }
            }).catch(reject)
        }).catch(reject)
    })
}