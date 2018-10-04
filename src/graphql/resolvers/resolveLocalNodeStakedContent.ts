import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentGet_Data } from '../../modules/db/db';
import AOContent from '../../models/AOContent';

// TODO: obj is of type NodeIdentity (sorry still no types outside of graphql)
export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const contentQueryParams: AODB_UserContentGet_Data = {
            userId: obj.ethAddress,
            query: {
                creatorId: obj.ethAddress
            }
        }
        context.router.send('/db/user/content/get', contentQueryParams).then((response: IAORouterMessage) => {
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