import { IGraphqlResolverContext } from '../../modules/http/http';

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/logs/get').then(response => {
            resolve(response.data || [])
        }).catch(reject)
    })
}