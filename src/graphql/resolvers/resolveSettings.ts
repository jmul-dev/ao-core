import { IGraphqlResolverContext } from '../../http';

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/settings/get').then(response => {
            resolve(response.data)
        }).catch(reject)
    })
}