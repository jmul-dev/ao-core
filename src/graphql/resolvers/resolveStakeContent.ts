import { AOContentState } from "../../models/AOContent";
import { IGraphqlResolverContext } from "../../http";
import { AODB_UserContentUpdate_Data } from "../../modules/db/db";

interface IStakeContentInputs {
    contentId: string;
    stakeId: string;
    stakeAmount: number;
    profitPercentage: number;
}

export default (obj: any, args: IStakeContentInputs, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // 1. TODO: we may want to verify stake occured via blockchain
        // 2. Update the user's content state
        const contentUpdateArgs: AODB_UserContentUpdate_Data = {
            id: args.contentId,
            update: {
                stakeId: args.stakeId,
                stake: args.stakeAmount,
                state: AOContentState.STAKED,
                profit: args.profitPercentage,
            }
        }
        context.router.send('/db/user/content/update', contentUpdateArgs).then(response => {
            // 3. TODO: Now that content is staked, we need to host/broadcast to discovery
            resolve(response.data)
        }).catch(reject)
    })
}