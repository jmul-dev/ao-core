import { IGraphqlResolverContext } from '../../http';

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        context.router.send('/db/logs/get', {ignoreLogging: true}).then(response => {
            let logs = response.data || []
            logs.sort((a, b) => {
                return new Date(parseInt(b.createdAt)).getTime() - new Date(parseInt(a.createdAt)).getTime();
            })
            resolve(logs)
        }).catch(reject)
    })
}