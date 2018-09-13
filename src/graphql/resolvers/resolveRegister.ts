import Debug from 'debug';
import { IGraphqlResolverContext } from '../../http';
import resolveSetNetwork from './resolveSetNetwork';
const debug = Debug('ao:graphql:register')


interface IRegister_Args {
    inputs: {
        ethAddress: string;
        networkId: number;
    }
}

export default (obj: any, args: IRegister_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {        
        resolveSetNetwork(obj, args, context, info).then((ethNetworkConnected: boolean) => {
            if ( !ethNetworkConnected ) {
                reject(new Error(`Unable to connect to ethereum network`))
            } else {
                context.userSession.register(args.inputs.ethAddress).then(() => {
                    resolve({
                        id: args.inputs.ethAddress,
                        ethAddress: args.inputs.ethAddress,
                    })
                }).catch(reject)  
            }        
        }).catch(reject)        
    })
}