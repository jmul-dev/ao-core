import { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";
import { AODB_UserContentGet_Data } from '../../modules/db/db';
import AOContent from '../../models/AOContent';

// TODO: obj is of type NodeIdentity (sorry still no types outside of graphql)
export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const contentQueryParams: AODB_UserContentGet_Data = {
            userId: obj.id,
            query: {
                creatorId: obj.id
            }
        }
        context.router.send('/db/user/content/get', contentQueryParams).then((response: IAORouterMessage) => {
            let userContent:Array<AOContent> = [].concat(response.data);  // ensures array in case response is single item            
            resolve(userContent)
        }).catch(error => {
            reject(error)
        })
    })
}