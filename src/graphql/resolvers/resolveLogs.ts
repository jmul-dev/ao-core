import { IGraphqlResolverContext } from '../../http';
import { AODB_LogsGet_Data } from '../../modules/db/db';

export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        const logsQuery: AODB_LogsGet_Data = {
            query: {
                userId: context.userSession.ethAddress
            }
        }
        context.router.send('/db/logs/get', logsQuery, {ignoreLogging: true}).then(response => {
            let logs = response.data || []
            resolve(logs)
        }).catch(reject)
    })
}