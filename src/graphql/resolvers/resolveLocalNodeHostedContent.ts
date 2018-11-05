import Http, { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentGet_Data } from '../../modules/db/db';
import AOContent, { getListOfContentIncompleteStates } from '../../models/AOContent';


interface ILocalNode_Hosted_Content_Args {
    incomplete: boolean
}
// TODO: obj is of type NodeIdentity (sorry still no types outside of graphql)
export default (obj: any, args: ILocalNode_Hosted_Content_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        if ( !context.userSession.ethAddress ) {
            resolve([])
            return null;
        }
        let contentQueryParams: AODB_UserContentGet_Data = {
            userId: obj.ethAddress,
            query: {
                creatorId: {
                    $ne: obj.ethAddress
                },
                state: args.incomplete ? {
                    $in: getListOfContentIncompleteStates()
                } : undefined
            }
        }
        context.router.send('/db/user/content/get', contentQueryParams, {ignoreLogging: true}).then((response: IAORouterMessage) => {
            let userContent: Array<AOContent> = new Array();
            // ensures array in case response is single item
            [].concat(response.data).forEach(content => {
                userContent.push(AOContent.fromObject(content))
            });
            userContent = userContent.sort((a, b) => {
                return parseInt(b.createdAt) - parseInt(a.createdAt)
            })
            resolve(userContent)
        }).catch(error => {
            reject(error)
        })
    })
}