/**
 * makeContentDiscoverable
 * 
 * NOTE: this resolver is actually called internally (not from frontend).
 * See resolveContentBecomeHostTransaction for example
 */
import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import AOContent, { AOContentState } from '../../models/AOContent';
import { AODB_UserContentUpdate_Data, AODB_UserContentGet_Data } from '../../modules/db/db';
import { AOP2P_Add_Discovery_Data } from '../../modules/p2p/p2p'
import { AODat_ResumeSingle_Data } from '../../modules/dat/dat';
const debug = Debug('ao:graphql:makeContentDiscoverable')

export interface IMakeContentDiscoverable_Args {
    inputs: {
        contentId: string;
    }
}

export default (obj: any, args: IMakeContentDiscoverable_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const { contentId } = args.inputs
        // 1. First, let's get the content data from user db
        let contentQuery: AODB_UserContentGet_Data = {
            query: {
                id: contentId
            }
        }
        context.router.send('/db/user/content/get', contentQuery).then((response: IAORouterMessage) => {
            if (!response.data || response.data.length !== 1) {
                reject(new Error(`Failed to update content stakeId`))
                return;
            }
            const content:AOContent = response.data[0]
            // 2. Add new discovery
            const p2pAddDiscoveryData: AOP2P_Add_Discovery_Data = {
                contentType: content.contentType,
                fileDatKey: content.fileDatKey, //TODO: We used to use newFileDatKey as a way to see if this is a re-encrypted thing
                metaDatKey: content.metadataDatKey,
                ethAddress: response.ethAddress, // My Eth Address
                metaData: content,//We should take shit out?
                indexData: {} 
            }
            context.router.send('/p2p/addDiscovery', p2pAddDiscoveryData).then((response: IAORouterMessage) => {
                if (response.data.success) {

                    // 3. The Dats have to be alive too!
                    const fileResumeDatData:AODat_ResumeSingle_Data = {
                        key: p2pAddDiscoveryData.fileDatKey
                    }
                    const metaResumeDatData:AODat_ResumeSingle_Data = {
                        key: p2pAddDiscoveryData.metaDatKey
                    }
                    let resumeDats = []
                    resumeDats.push( context.router.send('/dat/resumeSingle', fileResumeDatData) )
                    resumeDats.push( context.router.send('/dat/resumeSingle', metaResumeDatData) )
                    Promise.all(resumeDats).then(() => {
                        // 4. Update the content state (mark as Discoverable)
                        const contentUpdateQuery: AODB_UserContentUpdate_Data = {
                            id: content.id,
                            update: {
                                $set: {
                                    "state": AOContentState.DISCOVERABLE
                                }
                            }
                        }
                        context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
                            if (!response.data) {
                                reject(new Error('Failed to update content state'))
                            } else {
                                resolve(response.data)
                            }
                        }).catch(reject)
                    }).catch(reject)
                } else {
                    reject(new Error('Failed to add reencryped Dat to discovery'))
                }
            }).catch(reject)
        }).catch(reject)
    })
}