import Debug from 'debug'
import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOContentState } from '../../models/AOContent';
import { IAOEth_TX_Data } from '../../modules/eth/eth';
const debug = Debug('ao:graphql:contentBecomeHostTransaction')


interface IContentRequest_Args {
    inputs: {
        transactionHash: string;
        contentId: string;
    }
}

export default (obj: any, args: IContentRequest_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const {contentId, transactionHash} = args.inputs
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
            if ( !response.data ) {
                reject(new Error(`Failed to update content state`))
                return;
            }
            resolve(response.data)//Early Resolve

            // 2. Start the Transaction Watch
            const txWatchData: IAOEth_TX_Data = {
                transactionHash: transactionHash
            }
            context.router.send('/eth/tx',txWatchData).then((response:IAORouterMessage) => {
                // 3. Update the Content State based on status
                // TODO: Actually check that the response status is what we wanted
                if(response.data.status) {
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.STAKED
                        }
                    }
                } else {
                    contentUpdateQuery.update = {
                        $set: {
                            "state": AOContentState.ENCRYPTED
                        }
                    }
                    debug('No status')
                }
                context.router.send('/db/user/content/update', contentUpdateQuery).then((response: IAORouterMessage) => {
                    
                }).catch(debug)
                
            }).catch(debug)

        }).catch(reject)
    })
}