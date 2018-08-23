import { IGraphqlResolverContext } from '../../http';


export default  (obj: any, args: any, context: IGraphqlResolverContext, info: any) => {
    const contentId = args.id
    // 1. First we ping user db to see if current user 
}