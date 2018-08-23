import Http, { IGraphqlResolverContext } from '../../http';
import { IAORouterMessage } from "../../router/AORouter";

// TODO: obj is of type NodeIdentity (sorry still no types outside of graphql)
export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/user/content/get', {id: obj.id}).then((response: IAORouterMessage) => {
            let userContent = [].concat(response.data);  // ensures array in case response is single item                    
            userContent = userContent.map(content => ({
                ...content,
                fileUrl: `${Http.ENCRYPTED_RESOURCES_ENDPOINT}/${content.fileUrl}`,
                teaserUrl: `${Http.RESOURCES_ENDPOINT}/${content.teaserUrl}`,
                featuredImageUrl: `${Http.RESOURCES_ENDPOINT}/${content.featuredImageUrl}`,
            }))
            resolve(userContent)
        }).catch(error => {
            reject(error)
        })
    })
}