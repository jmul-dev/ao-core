import { IGraphqlResolverContext } from '../../modules/http/http';


export default (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        // TODO: pull actual core state from wherever that lives
        resolve('READY')
    })
}