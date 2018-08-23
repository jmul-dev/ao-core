import Http, { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentGet_Data } from '../../modules/db/db';
import { getListOfContentIncompleteStates } from '../../models/AOContent';


interface ILocalNode_Hosted_Content_Args {
    incomplete: boolean
}
// TODO: obj is of type NodeIdentity (sorry still no types outside of graphql)
export default (obj: any, args: ILocalNode_Hosted_Content_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        let contentQueryParams: AODB_UserContentGet_Data = {
            userId: obj.id,
            query: {
                creatorId: {
                    $ne: obj.id
                },
                state: args.incomplete ? {
                    $in: getListOfContentIncompleteStates()
                } : undefined
            }
        }
        context.router.send('/db/user/content/get', contentQueryParams).then((response: IAORouterMessage) => {
            let userContent = [].concat(response.data);  // ensures array in case response is single item
            resolve(userContent)
        }).catch(error => {
            reject(error)
        })
    })
}