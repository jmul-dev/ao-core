import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_NetworkContentGet_Data, AODB_UserContentUpdate_Data } from '../../modules/db/db';
import { AOP2P_Watch_Key_Data } from '../../modules/p2p/p2p'

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
        //context.router.send('/')
    })
}