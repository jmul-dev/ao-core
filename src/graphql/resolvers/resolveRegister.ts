import Debug from '../../AODebug'
import { IGraphqlResolverContext } from '../../http';
import resolveSetNetwork from './resolveSetNetwork';
import { AOCore_NetworkIdMismatch_Data } from '../..';
const debug = Debug('ao:graphql:register')


export interface IRegister_Args {
    inputs: {
        ethAddress: string;
        networkId: string;
    }
}

export default (obj: any, args: IRegister_Args, context: IGraphqlResolverContext, info: any) => {
    return new Promise((resolve, reject) => {
        //Let's catch 
        if( args.inputs.networkId != context.options.networkId ) {
            debug('networkId changed, restarting core')
            const networkIdMismatchData: AOCore_NetworkIdMismatch_Data = {
                newNetworkId: args.inputs.networkId
            }
            context.router.send('/core/networkIdMismatch', networkIdMismatchData).catch(debug)
        } else {
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
        }
    })
}