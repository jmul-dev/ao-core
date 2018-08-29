import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOContentState } from '../../models/AOContent';
import { IAOEth_BuyContentEvent_Data, StakeContentEvent, HostContentEvent } from '../../modules/eth/eth';
const debug = Debug('ao:graphql:contentUploadStakeTransaction')


interface IContentRequest_Args {
    inputs: {
        transactionHash: string;
        contentId: string;
    }
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const { contentId, transactionHash } = args.inputs
        // 1. Update the content state in user db
        let contentUpdateQuery: AODB_UserContentUpdate_Data = {
            id: contentId,
            update: {
                $set: {
                    "state": AOContentState.STAKING,
                    "transactions.stakeTx": transactionHash
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
            if (!response.data) {
                reject(new Error(`Failed to update content state`))
                return;
            }
            debug(`Content[${response.data.id}].state = ${response.data.state}`)
            // NOTE: we are resolving without waiting for tx status
            resolve(response.data)

            // 2. Begin listening for Staking tx status
            let stakeContentEventArgs: IAOEth_BuyContentEvent_Data = {
                transactionHash: transactionHash
            }
            context.router.send('/eth/tx/StakeContent', stakeContentEventArgs).then((stakeEventResponse: IAORouterMessage) => {
                if ( stakeEventResponse.data.status ) {
                    const stakeContentEvent: StakeContentEvent = stakeEventResponse.data.stakeContentEvent
                    const hostContentEvent: HostContentEvent = stakeEventResponse.data.hostContentEvent
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.STAKED,
                            "stakeId": stakeContentEvent.stakeId
                        }
                    }                    
                } else {
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.ENCRYPTED,// TODO: Verify that this is the correct state to go back to.
                        }
                    }  
                }                
                context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
                    debug(`Content[${response.data.id}].state = ${response.data.state}`)
                }).catch(debug)
            }).catch(debug)

        }).catch(reject)
    })
}