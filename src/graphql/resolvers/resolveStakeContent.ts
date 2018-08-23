import { AOContentState } from "../../models/AOContent";
import { IGraphqlResolverContext } from "../../http";

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
        context.router.send('/db/user/content/update', {
            id: args.contentId,
            stakeId: args.stakeId,
            stake: args.stakeAmount,
            state: AOContentState.STAKED,
            profit: args.profitPercentage,
        }).then(response => {
            // 3. TODO: Now that content is staked, we need to host/broadcast to discovery
            resolve(response.data)
        }).catch(reject)
    })
}