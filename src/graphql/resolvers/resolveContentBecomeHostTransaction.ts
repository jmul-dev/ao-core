import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOContentState } from '../../models/AOContent';
import { IAOEth_TX_Data, IAOEth_HostContentEvent_Data, HostContentEvent } from '../../modules/eth/eth';
const debug = Debug('ao:graphql:contentBecomeHostTransaction')


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
                    "transactions.hostTx": transactionHash
                }
            }
        }
        context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
            if (!response.data) {
                reject(new Error(`Failed to update content state`))
                return;
            }
            resolve(response.data)//Early Resolve

            // 2. Start the Transaction Watch
            const hostContentEventParams: IAOEth_HostContentEvent_Data = {
                transactionHash: transactionHash
            }
            context.router.send('/eth/tx/HostContent', hostContentEventParams).then((response: IAORouterMessage) => {
                // 3. Update the Content State based on status                
                if (response.data.status) {
                    const hostContentEvent: HostContentEvent = response.data.hostContentEvent
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.STAKED,
                            "contentHostId": hostContentEvent.contentHostId
                        }
                    }
                } else {
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.ENCRYPTED,
                            "transactions.hostTx": null,
                        }
                    }
                }
                context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
                    debug(`Succesfully updated content state: ${response.data.state}`)
                }).catch(debug)
            }).catch(debug)
            
        }).catch(reject)
    })
}